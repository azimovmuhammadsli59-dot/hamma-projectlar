import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Simple in-memory rate limiter per IP (max 5 contact submissions per 15 minutes)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX_REQUESTS = 5;

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_MAX_REQUESTS) {
    return true;
  }
  entry.count += 1;
  return false;
}

function stripHeaderControls(value: string): string {
  return value.replace(/[\r\n\0]+/g, ' ').trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface EmailConfigStatus {
  configured: boolean;
  provider: 'smtp' | 'resend' | 'none';
  recipientEmail: string;
}

function getEmailConfigStatus(): EmailConfigStatus {
  const recipientEmail = (
    process.env.CONTACT_TO_EMAIL ||
    process.env.SMTP_USER ||
    'azimovmuhammadsli59@gmail.com'
  ).trim();

  const hasResend = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim());
  const hasSmtp = Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim()
  );

  if (hasResend) {
    return { configured: true, provider: 'resend', recipientEmail };
  }
  if (hasSmtp) {
    return { configured: true, provider: 'smtp', recipientEmail };
  }
  return { configured: false, provider: 'none', recipientEmail };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '32kb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  app.get('/api/contact/config', (_req: Request, res: Response) => {
    const status = getEmailConfigStatus();
    res.json({
      configured: status.configured,
      provider: status.provider,
      fallbackEmail: 'azimovmuhammadsli59@gmail.com',
    });
  });

  app.post('/api/contact', async (req: Request, res: Response) => {
    const clientIp = getClientIp(req);
    if (isRateLimited(clientIp)) {
      res.status(429).json({
        ok: false,
        code: 'RATE_LIMITED',
        message: 'Too many messages sent recently. Please wait a few minutes and try again.',
      });
      return;
    }

    const body = req.body as Record<string, unknown> | undefined;
    if (!body || typeof body !== 'object') {
      res.status(400).json({
        ok: false,
        code: 'INVALID_PAYLOAD',
        message: 'Invalid request payload.',
      });
      return;
    }

    const rawName = typeof body.name === 'string' ? stripHeaderControls(body.name) : '';
    const rawEmail = typeof body.email === 'string' ? stripHeaderControls(body.email) : '';
    const rawSubject = typeof body.subject === 'string' ? stripHeaderControls(body.subject) : '';
    const rawMessage = typeof body.message === 'string' ? body.message.trim() : '';

    if (rawName.length < 2 || rawName.length > 100) {
      res.status(400).json({
        ok: false,
        code: 'VALIDATION_ERROR',
        message: 'Please enter your name (2–100 characters).',
      });
      return;
    }

    if (!EMAIL_REGEX.test(rawEmail) || rawEmail.length > 160) {
      res.status(400).json({
        ok: false,
        code: 'VALIDATION_ERROR',
        message: 'Please provide a valid email address.',
      });
      return;
    }

    if (rawSubject.length < 3 || rawSubject.length > 160) {
      res.status(400).json({
        ok: false,
        code: 'VALIDATION_ERROR',
        message: 'Please enter a subject (3–160 characters).',
      });
      return;
    }

    if (rawMessage.length < 10 || rawMessage.length > 4000) {
      res.status(400).json({
        ok: false,
        code: 'VALIDATION_ERROR',
        message: 'Please enter a message (10–4000 characters).',
      });
      return;
    }

    const config = getEmailConfigStatus();
    if (!config.configured) {
      res.status(503).json({
        ok: false,
        code: 'EMAIL_SERVICE_UNCONFIGURED',
        message:
          'Direct server email delivery is not configured yet. Set SMTP_* or RESEND_API_KEY in server secrets, or use the email client option below.',
      });
      return;
    }

    const fromAddress =
      process.env.CONTACT_FROM_EMAIL?.trim() ||
      (config.provider === 'resend'
        ? 'Portfolio Contact <onboarding@resend.dev>'
        : process.env.SMTP_USER?.trim() || 'no-reply@muhammadali.dev');

    const safeHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#050505; color:#ffffff; padding:32px; border:1px solid #27272a;">
        <p style="font-size:12px; letter-spacing:0.15em; text-transform:uppercase; color:#a1a1aa; margin:0 0 16px;">Portfolio Contact Submission</p>
        <h2 style="font-size:20px; margin:0 0 20px; color:#ffffff;">${escapeHtml(rawSubject)}</h2>
        <p style="margin:6px 0; color:#d4d4d8;"><strong>From:</strong> ${escapeHtml(rawName)} (${escapeHtml(rawEmail)})</p>
        <hr style="border:none; border-top:1px solid #27272a; margin:20px 0;" />
        <p style="white-space:pre-wrap; line-height:1.6; color:#f4f4f5;">${escapeHtml(rawMessage)}</p>
      </div>
    `;

    try {
      if (config.provider === 'resend') {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY?.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [config.recipientEmail],
            reply_to: rawEmail,
            subject: `[Portfolio] ${rawSubject}`,
            text: `From: ${rawName} <${rawEmail}>\n\n${rawMessage}`,
            html: safeHtml,
          }),
        });

        if (!resendRes.ok) {
          throw new Error(`Resend HTTP ${resendRes.status}`);
        }
      } else {
        const smtpPort = Number(process.env.SMTP_PORT || 587);
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST?.trim(),
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: process.env.SMTP_USER?.trim(),
            pass: process.env.SMTP_PASS?.trim(),
          },
        });

        await transporter.sendMail({
          from: fromAddress,
          to: config.recipientEmail,
          replyTo: rawEmail,
          subject: `[Portfolio] ${rawSubject}`,
          text: `From: ${rawName} <${rawEmail}>\n\n${rawMessage}`,
          html: safeHtml,
        });
      }

      res.json({
        ok: true,
        message: 'Your message has been delivered successfully.',
      });
    } catch (err) {
      console.error('Contact email dispatch failed:', err instanceof Error ? err.message : 'Unknown error');
      res.status(502).json({
        ok: false,
        code: 'EMAIL_DELIVERY_FAILED',
        message: 'Unable to send email through the configured provider right now. Please try again or use your email client.',
      });
    }
  });

  if (!IS_PRODUCTION) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir, { index: false }));
    app.get('*', (_req: Request, res: Response) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});

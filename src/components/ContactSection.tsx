import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Mail, Send } from 'lucide-react';
import { DEVELOPER_PROFILE } from '../data/portfolioData';
import { MagneticButton } from './MagneticButton';

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface ContactConfig {
  configured: boolean;
  provider: 'smtp' | 'resend' | 'none';
  fallbackEmail: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ContactSection() {
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: 'idle' | 'success' | 'error' | 'unconfigured';
    message: string;
  }>({ type: 'idle', message: '' });

  const [config, setConfig] = useState<ContactConfig | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/contact/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ContactConfig | null) => {
        if (active && data) {
          setConfig(data);
        }
      })
      .catch(() => {
        // Keep config null if unreachable
      });
    return () => {
      active = false;
    };
  }, []);

  const validate = (form: FormValues): FormErrors => {
    const nextErrors: FormErrors = {};
    if (form.name.trim().length < 2) {
      nextErrors.name = 'Please enter at least 2 characters for your name.';
    }
    if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (form.subject.trim().length < 3) {
      nextErrors.subject = 'Please enter a subject (minimum 3 characters).';
    }
    if (form.message.trim().length < 10) {
      nextErrors.message = 'Please enter a message (minimum 10 characters).';
    }
    return nextErrors;
  };

  const buildMailtoHref = () => {
    const recipient = config?.fallbackEmail || DEVELOPER_PROFILE.email;
    const subject = encodeURIComponent(values.subject.trim() || 'Project Inquiry');
    const body = encodeURIComponent(
      `Name: ${values.name.trim()}\nEmail: ${values.email.trim()}\n\n${values.message.trim()}`
    );
    return `mailto:${recipient}?subject=${subject}&body=${body}`;
  };

  const handleChange = (field: keyof FormValues, val: string) => {
    setValues((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (status.type !== 'idle') {
      setStatus({ type: 'idle', message: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        message?: string;
      };

      if (response.ok && payload.ok) {
        setStatus({
          type: 'success',
          message: payload.message || 'Your message has been delivered successfully.',
        });
        setValues({ name: '', email: '', subject: '', message: '' });
      } else if (payload.code === 'EMAIL_SERVICE_UNCONFIGURED') {
        setStatus({
          type: 'unconfigured',
          message:
            payload.message ||
            'Direct server email delivery is not configured yet. Configure SMTP or Resend credentials, or open your email app below.',
        });
      } else {
        setStatus({
          type: 'error',
          message: payload.message || 'Unable to send your message right now. Please try again.',
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Network error while reaching the contact service. Please use your email client below.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-36 px-6 md:px-10 bg-[#050505]">
      <div className="hairline-divider mb-20 md:mb-28" aria-hidden="true" />

      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Editorial Column */}
        <div className="lg:col-span-5">
          <p className="reveal-item text-xs font-mono tracking-[0.24em] uppercase text-zinc-500 mb-4">
            04 · Contact
          </p>
          <h2 className="reveal-item font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6 text-balance">
            LET&apos;S CREATE SOMETHING AMAZING.
          </h2>
          <p className="reveal-item text-base sm:text-lg text-zinc-300 leading-relaxed mb-10">
            &ldquo;Have a great idea? Let&apos;s build something extraordinary together.&rdquo;
          </p>

          <div className="reveal-item border-t border-white/10 pt-8 space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-1.5">
                Direct Email
              </p>
              <a
                href={`mailto:${DEVELOPER_PROFILE.email}`}
                className="inline-flex items-center gap-2 text-sm text-white hover:text-zinc-300 transition-colors"
              >
                <Mail className="w-4 h-4 text-zinc-400" aria-hidden="true" />
                <span>{DEVELOPER_PROFILE.email}</span>
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-1.5">
                Email Delivery Configuration
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {config?.configured
                  ? `Server email delivery is active (${config.provider.toUpperCase()}).`
                  : 'Configurable via server environment variables (SMTP_* or RESEND_API_KEY).'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Functional Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="reveal-item glass-panel rounded-2xl p-6 sm:p-10 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs uppercase tracking-[0.18em] text-zinc-400 mb-2"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Your full name"
                  aria-invalid={Boolean(errors.name)}
                  className="w-full rounded-xl border border-white/15 bg-[#09090b] px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-white focus:outline-none transition-colors"
                />
                {errors.name && (
                  <p className="mt-2 text-xs text-zinc-300 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs uppercase tracking-[0.18em] text-zinc-400 mb-2"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  className="w-full rounded-xl border border-white/15 bg-[#09090b] px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-white focus:outline-none transition-colors"
                />
                {errors.email && (
                  <p className="mt-2 text-xs text-zinc-300 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="block text-xs uppercase tracking-[0.18em] text-zinc-400 mb-2"
              >
                Subject
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                value={values.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                placeholder="Project inquiry or collaboration"
                aria-invalid={Boolean(errors.subject)}
                className="w-full rounded-xl border border-white/15 bg-[#09090b] px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-white focus:outline-none transition-colors"
              />
              {errors.subject && (
                <p className="mt-2 text-xs text-zinc-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.subject}</span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs uppercase tracking-[0.18em] text-zinc-400 mb-2"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                value={values.message}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="Tell me about your goals, timeline, and vision..."
                aria-invalid={Boolean(errors.message)}
                className="w-full rounded-xl border border-white/15 bg-[#09090b] px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-white focus:outline-none transition-colors resize-y"
              />
              {errors.message && (
                <p className="mt-2 text-xs text-zinc-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.message}</span>
                </p>
              )}
            </div>

            {/* Honest Status Feedback */}
            <div aria-live="polite">
              {status.type === 'success' && (
                <div className="rounded-xl border border-white/30 bg-white/[0.06] p-4 flex items-start gap-3 text-sm text-white">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{status.message}</span>
                </div>
              )}

              {(status.type === 'error' || status.type === 'unconfigured') && (
                <div className="rounded-xl border border-white/20 bg-white/[0.04] p-4 space-y-3 text-sm text-zinc-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-white" aria-hidden="true" />
                    <span>{status.message}</span>
                  </div>
                  <div className="pl-8">
                    <a
                      href={buildMailtoHref()}
                      className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white px-4 py-2 text-xs font-semibold text-[#050505] hover:bg-zinc-200 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Open in Email Client</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <MagneticButton
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#050505] hover:bg-zinc-200 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                <Send className="w-4 h-4" aria-hidden="true" />
              </MagneticButton>

              <a
                href={buildMailtoHref()}
                className="text-xs text-zinc-400 hover:text-white underline underline-offset-4 transition-colors"
              >
                Or compose directly via email
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

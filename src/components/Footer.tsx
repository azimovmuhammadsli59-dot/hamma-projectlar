import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { DEVELOPER_PROFILE } from '../data/portfolioData';
import { MagneticButton } from './MagneticButton';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050505] border-t border-white/10 px-6 md:px-10 pt-16 pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-12 border-b border-white/10">
          <div className="space-y-3 max-w-xl">
            <p className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {DEVELOPER_PROFILE.name.toUpperCase()}
            </p>
            <p className="text-xs tracking-[0.2em] uppercase text-zinc-400">
              {DEVELOPER_PROFILE.heroTitle}
            </p>
            <p className="text-sm sm:text-base text-zinc-300 pt-2">
              &ldquo;{DEVELOPER_PROFILE.footerQuote}&rdquo;
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Social Media Placeholders & Direct Email */}
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:border-white/40 hover:text-white transition-colors"
            >
              <Github className="w-3.5 h-3.5" aria-hidden="true" />
              <span>GitHub</span>
            </a>

            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:border-white/40 hover:text-white transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
              <span>LinkedIn</span>
            </a>

            <a
              href={`mailto:${DEVELOPER_PROFILE.email}`}
              aria-label="Send email"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:border-white/40 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Email</span>
            </a>

            <MagneticButton
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-[#050505] hover:bg-zinc-200 transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
            </MagneticButton>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-500">
          <p>{DEVELOPER_PROFILE.copyright}</p>
          <p className="font-mono">{DEVELOPER_PROFILE.brand}</p>
        </div>
      </div>
    </footer>
  );
}

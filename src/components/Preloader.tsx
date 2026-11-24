import { useEffect, useState } from 'react';
import { DEVELOPER_PROFILE } from '../data/portfolioData';
import { usePrefersReducedMotion } from '../utils/webgl';

interface PreloaderProps {
  onComplete?: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [progress, setProgress] = useState(() => (reducedMotion ? 100 : 0));
  const [closing, setClosing] = useState(false);
  const [dismissed, setDismissed] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setDismissed(true);
      onComplete?.();
      return;
    }

    let rafId = 0;
    const start = performance.now();
    const duration = 680;

    const step = (now: number) => {
      const elapsed = now - start;
      const ratio = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - ratio, 3);
      setProgress(Math.round(eased * 100));

      if (ratio < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setClosing(true);
        window.setTimeout(() => {
          setDismissed(true);
          onComplete?.();
        }, 420);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion, onComplete]);

  if (dismissed) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-[#050505] px-6 py-8 md:px-12 md:py-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        closing ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="flex items-center justify-between text-xs tracking-[0.22em] text-zinc-400">
        <span className="font-display font-bold text-white">{DEVELOPER_PROFILE.brand}</span>
        <span className="font-mono tabular-nums">{String(progress).padStart(2, '0')}%</span>
      </div>

      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.26em] text-zinc-500 mb-3">
          {DEVELOPER_PROFILE.roleLine}
        </p>
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
          {DEVELOPER_PROFILE.name}
        </h2>
      </div>

      <div className="w-full">
        <div className="h-[1px] w-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-white transition-[width] duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

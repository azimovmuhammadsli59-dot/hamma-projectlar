import { Suspense, lazy } from 'react';
import { DEVELOPER_PROFILE } from '../data/portfolioData';

const AboutSculptureCanvas = lazy(() =>
  import('./three/AboutSculptureCanvas').then((m) => ({ default: m.AboutSculptureCanvas }))
);

const DISCIPLINES = [
  {
    index: '01',
    title: 'Frontend Engineering',
    detail: 'Responsive interfaces, fluid typography, and interactive 3D graphics.',
  },
  {
    index: '02',
    title: 'Backend Architecture',
    detail: 'Structured server logic, clean APIs, and dependable data handling.',
  },
  {
    index: '03',
    title: 'Motion & Craft',
    detail: 'Purposeful transitions engineered for clarity and speed.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 md:py-36 px-6 md:px-10 bg-[#050505]">
      <div className="hairline-divider mb-20 md:mb-28" aria-hidden="true" />

      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
        {/* Left Column: Animated Editorial Typography */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <p className="reveal-item text-xs font-mono tracking-[0.24em] uppercase text-zinc-500 mb-4">
            01 · Profile
          </p>
          <h2 className="reveal-item font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mb-8 text-balance">
            ABOUT ME
          </h2>

          <p className="reveal-item text-lg sm:text-xl leading-relaxed text-zinc-200 font-normal mb-10">
            {DEVELOPER_PROFILE.aboutText}
          </p>

          <div className="reveal-item border-t border-white/10 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {DISCIPLINES.map((item) => (
              <div key={item.index} className="space-y-2">
                <span className="font-mono text-xs text-zinc-500 block">{item.index}</span>
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="text-xs leading-relaxed text-zinc-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive 3D Visual */}
        <div className="lg:col-span-6 flex flex-col">
          <div
            data-cursor-hover="true"
            className="reveal-item relative flex-1 min-h-[340px] sm:min-h-[420px] lg:min-h-[480px] rounded-2xl border border-white/12 bg-[#09090b] overflow-hidden"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.07),transparent_65%)]"
            />
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center text-xs tracking-widest uppercase text-zinc-500">
                  Loading 3D Object
                </div>
              }
            >
              <AboutSculptureCanvas />
            </Suspense>

            <div className="pointer-events-none absolute bottom-4 left-5 right-5 flex items-center justify-between text-[11px] tracking-[0.18em] uppercase text-zinc-400">
              <span>Interactive 3D Sculpture</span>
              <span className="font-mono text-zinc-500">Drag to Rotate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

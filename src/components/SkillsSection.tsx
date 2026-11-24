import { SKILLS } from '../data/portfolioData';
import type { SkillItem } from '../data/portfolioData';
import { usePrefersReducedMotion } from '../utils/webgl';
import { TechIcon } from './TechIcons';

function SkillCard3D({ skill }: { skill: SkillItem }) {
  const reducedMotion = usePrefersReducedMotion();

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);
    card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.transform =
      'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <article
      data-cursor-hover="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="skills-stagger tilt-card-3d glass-panel rounded-2xl p-7 md:p-8 flex flex-col justify-between min-h-[240px]"
    >
      <div className="tilt-card-inner relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl border border-white/15 bg-white/[0.04] flex items-center justify-center text-white">
            <TechIcon id={skill.id} className="w-6 h-6" />
          </div>
          <span className="font-mono text-xs text-zinc-500">{skill.index}</span>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-2">
            {skill.category}
          </p>
          <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-3">
            {skill.name}
          </h3>
          <p className="text-sm leading-relaxed text-zinc-400">{skill.description}</p>
        </div>
      </div>
    </article>
  );
}

export function SkillsSection() {
  return (
    <section id="skills" className="relative py-24 md:py-36 px-6 md:px-10 bg-[#050505]">
      <div className="hairline-divider mb-20 md:mb-28" aria-hidden="true" />

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-16">
          <div>
            <p className="reveal-item text-xs font-mono tracking-[0.24em] uppercase text-zinc-500 mb-4">
              02 · Core Stack
            </p>
            <h2 className="reveal-item font-display text-3xl sm:text-5xl font-bold tracking-tight text-white text-balance">
              TECHNOLOGIES I WORK WITH
            </h2>
          </div>
          <p className="reveal-item text-sm text-zinc-400 max-w-md leading-relaxed">
            Focused core technologies spanning semantic frontend structure, modular styling, client interactivity, and server-side architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS.map((skill) => (
            <SkillCard3D key={skill.id} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
}

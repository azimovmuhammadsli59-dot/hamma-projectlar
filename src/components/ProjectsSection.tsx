import { useState } from 'react';
import { ArrowUpRight, Globe } from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import type { ProjectItem } from '../data/portfolioData';
import { usePrefersReducedMotion } from '../utils/webgl';

function ProjectCard3D({ project }: { project: ProjectItem }) {
  const reducedMotion = usePrefersReducedMotion();
  const [imageError, setImageError] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);
    card.style.transform = `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.transform =
      'perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <article
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="projects-stagger tilt-card-3d glass-panel rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Monochrome Browser Preview Frame */}
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.title} in a new tab`}
        className="group block relative bg-[#08080a] border-b border-white/10 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-white"
      >
        {/* Minimal Monochrome Browser Chrome */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#0b0b0e]">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2 h-2 rounded-full bg-white/25" />
            <span className="w-2 h-2 rounded-full bg-white/15" />
            <span className="w-2 h-2 rounded-full bg-white/10" />
          </div>
          <span className="font-mono text-[11px] text-zinc-400 truncate max-w-[200px]">
            {project.domainLabel}
          </span>
          <ArrowUpRight
            className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors"
            aria-hidden="true"
          />
        </div>

        {/* 16:9 Monochrome Preview Surface with Mandatory Zero-Broken-Image Fallback */}
        <div className="relative aspect-video w-full overflow-hidden bg-[#0a0a0c]">
          {!imageError ? (
            <img
              src={project.previewImage}
              alt={`${project.title} monochrome project preview`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover grayscale contrast-110 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-zinc-900 via-[#08080a] to-black">
              <Globe className="w-8 h-8 text-zinc-500 mb-3" aria-hidden="true" />
              <span className="font-mono text-xs tracking-widest text-zinc-500 mb-1">
                PROJECT {project.number}
              </span>
              <span className="font-display text-lg font-bold text-white">{project.title}</span>
            </div>
          )}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/70 via-transparent to-transparent"
          />
        </div>
      </a>

      {/* Project Content */}
      <div className="tilt-card-inner relative z-10 p-6 md:p-8 flex-1 flex flex-col justify-between gap-6">
        <div>
          <div className="flex items-center justify-between gap-4 text-xs text-zinc-400 mb-3">
            <span className="font-mono tracking-[0.18em]">PROJECT {project.number}</span>
            <span aria-hidden="true" className="text-zinc-600">
              /
            </span>
            <span className="truncate text-zinc-500">{project.domainLabel}</span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            {project.title}
          </h3>

          <p className="text-sm leading-relaxed text-zinc-400">{project.description}</p>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-4">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white px-5 py-2.5 text-xs font-semibold tracking-wide text-[#050505] hover:bg-zinc-200 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span>View Project</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit live URL for ${project.title}`}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <span>Live Site</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="relative py-24 md:py-36 px-6 md:px-10 bg-[#050505]">
      <div className="hairline-divider mb-20 md:mb-28" aria-hidden="true" />

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-16">
          <div>
            <p className="reveal-item text-xs font-mono tracking-[0.24em] uppercase text-zinc-500 mb-4">
              03 · Selected Works
            </p>
            <h2 className="reveal-item font-display text-3xl sm:text-5xl font-bold tracking-tight text-white text-balance">
              FEATURED PROJECTS
            </h2>
          </div>
          <p className="reveal-item text-sm text-zinc-400 max-w-md leading-relaxed">
            Four live web applications built and deployed online. Select any project to inspect the live experience in a new tab.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {PROJECTS.map((project) => (
            <ProjectCard3D key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

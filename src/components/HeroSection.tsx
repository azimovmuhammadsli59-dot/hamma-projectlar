import { ArrowDown, ArrowUpRight, Compass } from 'lucide-react';
import { DEVELOPER_PROFILE } from '../data/portfolioData';
import { HeroSculptureCanvas } from './three/HeroSculptureCanvas';
import { MagneticLink } from './MagneticButton';

export function HeroSection() {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#050505] pt-24 pb-10 px-6 md:px-10"
    >
      {/* Subtle monochrome vignette over deep obsidian background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_46%,rgba(255,255,255,0.07),transparent_52%)]"
      />

      {/* Interactive 3D Metallic Sculpture & Particle Field */}
      <HeroSculptureCanvas />

      {/* Readability scrim on the left side for crisp text contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050505]/92 via-[#050505]/55 to-transparent md:w-3/4"
      />

      {/* Top spacer */}
      <div className="h-2" />

      {/* Main Hero Editorial Stack */}
      <div className="relative z-10 mx-auto w-full max-w-7xl my-auto py-12">
        <div className="max-w-3xl">
          {/* Static Available for Projects Indicator (zero pulsing dots) */}
          <div className="hero-stagger inline-flex items-center gap-2.5 text-xs font-medium tracking-[0.2em] uppercase text-zinc-300 mb-6 border-b border-white/15 pb-2">
            <Compass className="w-3.5 h-3.5 text-white" aria-hidden="true" />
            <span>Available for Projects</span>
          </div>

          <p className="hero-stagger text-sm md:text-base font-medium tracking-[0.18em] uppercase text-zinc-400 mb-3">
            {DEVELOPER_PROFILE.name.toUpperCase()}
          </p>

          <h1 className="hero-stagger font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02] text-balance monochrome-title-gradient mb-5">
            {DEVELOPER_PROFILE.heroTitle}
          </h1>

          <p className="hero-stagger text-xs sm:text-sm tracking-[0.14em] uppercase text-zinc-400 mb-6">
            Frontend Developer <span aria-hidden="true" className="mx-2 text-zinc-600">/</span> Backend Developer
          </p>

          <p className="hero-stagger text-lg sm:text-xl md:text-2xl text-zinc-200 font-normal leading-relaxed max-w-xl mb-10">
            &ldquo;{DEVELOPER_PROFILE.tagline}&rdquo;
          </p>

          <div className="hero-stagger flex flex-wrap items-center gap-4">
            <MagneticLink
              href="#projects"
              onClick={(e) => scrollToSection(e, 'projects')}
              className="inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#050505] hover:bg-zinc-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <span>Explore My Work</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </MagneticLink>

            <MagneticLink
              href="#contact"
              onClick={(e) => scrollToSection(e, 'contact')}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-black/50 px-7 py-3.5 text-sm font-semibold text-white hover:border-white/60 hover:bg-white/[0.06] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <span>Contact Me</span>
            </MagneticLink>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="relative z-10 mx-auto w-full max-w-7xl flex items-end justify-between">
        <a
          href="#about"
          onClick={(e) => scrollToSection(e, 'about')}
          className="group inline-flex items-center gap-4 text-xs uppercase tracking-[0.22em] text-zinc-400 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span className="scroll-indicator-line block" aria-hidden="true" />
          <span className="flex items-center gap-2">
            <span>Scroll to Explore</span>
            <ArrowDown
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </a>

        <p className="hidden sm:block text-xs text-zinc-500 tracking-wide">
          Interactive 3D Scene · Move cursor to tilt
        </p>
      </div>
    </section>
  );
}

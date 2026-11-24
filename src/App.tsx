import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { detectWebGLCapabilities, usePrefersReducedMotion } from './utils/webgl';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const appRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const { isSoftwareGl } = detectWebGLCapabilities();
    if (!isSoftwareGl) {
      document.documentElement.classList.add('has-hw-gpu');
    } else {
      document.documentElement.classList.remove('has-hw-gpu');
    }
  }, []);

  useEffect(() => {
    if (reducedMotion || !appRef.current) return;

    const ctx = gsap.context(() => {
      // Hero entrance stagger
      gsap.from('.hero-stagger', {
        y: 28,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.15,
        clearProps: 'transform,opacity',
      });

      // Scroll-triggered reveals for section headings and copy
      gsap.utils.toArray<HTMLElement>('.reveal-item').forEach((el) => {
        gsap.from(el, {
          y: 26,
          opacity: 0,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        });
      });

      // Staggered Skills Cards
      gsap.from('.skills-stagger', {
        y: 32,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '#skills',
          start: 'top 78%',
          once: true,
        },
      });

      // Staggered Project Cards
      gsap.from('.projects-stagger', {
        y: 36,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '#projects',
          start: 'top 78%',
          once: true,
        },
      });
    }, appRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={appRef} className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-[#050505]">
      <Preloader />
      <CustomCursor />
      <Navbar />

      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}

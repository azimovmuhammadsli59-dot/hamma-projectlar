import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../utils/webgl';

export function CustomCursor() {
  const reducedMotion = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined' || !window.matchMedia) {
      setEnabled(false);
      return;
    }

    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let rafId = 0;

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setVisible(true);

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('a, button, input, textarea, [data-cursor-hover="true"]');
      setHovering(Boolean(interactive));
    };

    const onPointerLeave = () => setVisible(false);

    const tick = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
    };
  }, [reducedMotion]);

  if (!enabled || !visible) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`custom-cursor-ring hidden md:block ${hovering ? 'is-hovering' : ''}`}
      />
      <div ref={dotRef} aria-hidden="true" className="custom-cursor-dot hidden md:block" />
    </>
  );
}

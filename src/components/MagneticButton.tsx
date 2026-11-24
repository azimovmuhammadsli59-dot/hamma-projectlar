import { useRef } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { usePrefersReducedMotion } from '../utils/webgl';

interface BaseProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

type MagneticButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
type MagneticLinkProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement>;

function useMagneticHandlers(strength = 0.25) {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    ref.current.style.transform = `translate3d(${relX * strength}px, ${relY * strength}px, 0)`;
  };

  const onMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate3d(0px, 0px, 0)';
  };

  return { ref, onMouseMove, onMouseLeave };
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.22,
  ...rest
}: MagneticButtonProps) {
  const { ref, onMouseMove, onMouseLeave } = useMagneticHandlers(strength);
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`magnetic-btn ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function MagneticLink({
  children,
  className = '',
  strength = 0.22,
  ...rest
}: MagneticLinkProps) {
  const { ref, onMouseMove, onMouseLeave } = useMagneticHandlers(strength);
  return (
    <a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`magnetic-btn ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}

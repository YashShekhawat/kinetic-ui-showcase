import { useRef } from 'react';
import gsap from 'gsap';

const ArrowSlideButton = () => {
  const currentRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const onEnter = () => {
    gsap.to(currentRef.current, { x: '-110%', opacity: 0, duration: 0.25, ease: 'power2.out' });
    gsap.fromTo(cloneRef.current, { x: '110%', opacity: 0 }, { x: '0%', opacity: 1, duration: 0.25, ease: 'power2.out' });
    if (btnRef.current) btnRef.current.style.borderColor = '#7c3aed';
  };

  const onLeave = () => {
    gsap.to(currentRef.current, { x: '0%', opacity: 1, duration: 0.25, ease: 'power2.out' });
    gsap.to(cloneRef.current, { x: '110%', opacity: 0, duration: 0.25, ease: 'power2.out' });
    if (btnRef.current) btnRef.current.style.borderColor = '#1a1a1a';
  };

  return (
    <button
      ref={btnRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative overflow-hidden font-inter font-medium text-sm px-6 py-3 rounded-md text-kinetic-text transition-colors"
      style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
    >
      <div ref={currentRef} className="flex items-center gap-2">
        <span>Explore Components</span>
        <span>→</span>
      </div>
      <div ref={cloneRef} className="absolute inset-0 flex items-center justify-center gap-2" style={{ opacity: 0 }}>
        <span>Explore Components</span>
        <span>→</span>
      </div>
    </button>
  );
};

export default ArrowSlideButton;

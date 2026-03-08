import { useRef } from 'react';
import gsap from 'gsap';

const LiquidFillButton = () => {
  const fillRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const onEnter = () => {
    gsap.fromTo(fillRef.current, { y: '100%' }, { y: '0%', duration: 0.4, ease: 'power2.out' });
    gsap.to(textRef.current, { color: '#ffffff', duration: 0.3 });
  };

  const onLeave = () => {
    gsap.to(fillRef.current, { y: '-100%', duration: 0.35, ease: 'power2.in' });
    gsap.to(textRef.current, { color: '#a78bfa', duration: 0.3 });
  };

  return (
    <button
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative overflow-hidden font-syne font-bold text-sm px-8 py-3 rounded-md"
      style={{ border: '1px solid #7c3aed', background: 'transparent' }}
    >
      <div
        ref={fillRef}
        className="absolute inset-0 pointer-events-none"
        style={{ background: '#7c3aed', transform: 'translateY(100%)', borderRadius: 'inherit' }}
      />
      <span ref={textRef} className="relative z-10" style={{ color: '#a78bfa' }}>
        Get Started
      </span>
    </button>
  );
};

export default LiquidFillButton;

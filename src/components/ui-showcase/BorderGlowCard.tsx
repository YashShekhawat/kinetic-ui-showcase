import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const BorderGlowCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.bgc-rotate', {
        rotation: 360,
        duration: 4,
        repeat: -1,
        ease: 'none',
      });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  const onEnter = () => {
    gsap.to(cardRef.current!, { y: -4, duration: 0.3 });
    if (borderRef.current) gsap.to(borderRef.current, { opacity: 1, duration: 0.3 });
  };
  const onLeave = () => {
    gsap.to(cardRef.current!, { y: 0, duration: 0.3 });
    if (borderRef.current) gsap.to(borderRef.current, { opacity: 0.5, duration: 0.3 });
  };

  return (
    <div className="relative w-[280px] h-[320px]" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {/* Rotating border glow */}
      <div
        ref={borderRef}
        className="absolute inset-[-1px] rounded-lg overflow-hidden opacity-50"
      >
        <div
          className="bgc-rotate absolute inset-[-50%] w-[200%] h-[200%]"
          style={{
            background: 'conic-gradient(from 0deg, transparent, #7c3aed, transparent, #a78bfa, transparent)',
          }}
        />
      </div>
      <div
        ref={cardRef}
        className="relative w-full h-full rounded-lg overflow-hidden p-6 flex flex-col"
        style={{ background: '#10101a' }}
      >
        <div className="w-10 h-10 rounded-md mb-4" style={{ background: '#1a1a2e' }} />
        <h3 className="font-inter font-semibold text-kinetic-text text-base mb-2">Border Glow</h3>
        <p className="font-inter font-light text-sm text-kinetic-text-muted leading-relaxed">
          Animated conic gradient border that rotates continuously.
        </p>
      </div>
    </div>
  );
};

export default BorderGlowCard;

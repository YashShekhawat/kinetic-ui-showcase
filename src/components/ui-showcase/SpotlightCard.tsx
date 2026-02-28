import { useRef } from 'react';
import gsap from 'gsap';

const SpotlightCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const rect = cardRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gsap.to(glowRef.current!, {
      background: `radial-gradient(300px circle at ${x}px ${y}px, rgba(124,58,237,0.08), transparent)`,
      duration: 0.3,
    });
  };

  const onLeave = () => {
    gsap.to(glowRef.current!, { opacity: 0, duration: 0.3 });
  };

  const onEnter = () => {
    gsap.to(glowRef.current!, { opacity: 1, duration: 0.3 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onEnter}
      className="relative w-[280px] h-[320px] rounded-lg overflow-hidden p-6 flex flex-col"
      style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
    >
      <div ref={glowRef} className="absolute inset-0 opacity-0 pointer-events-none" />
      <div className="w-10 h-10 rounded-md mb-4" style={{ background: '#1a1a1a' }} />
      <h3 className="font-inter font-semibold text-kinetic-text text-base mb-2">Spotlight Card</h3>
      <p className="font-inter font-light text-sm text-kinetic-text-muted leading-relaxed">
        Move your cursor around to see the spotlight effect follow your mouse.
      </p>
    </div>
  );
};

export default SpotlightCard;

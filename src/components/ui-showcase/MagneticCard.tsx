import { useRef } from 'react';
import gsap from 'gsap';

const MagneticCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const rect = cardRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const dist = Math.sqrt(x * x + y * y);
    if (dist < 120) {
      gsap.to(cardRef.current!, { x: x * 0.15, y: y * 0.15, duration: 0.3 });
    }
  };

  const onLeave = () => {
    gsap.to(cardRef.current!, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,0.3)' });
  };

  return (
    <div className="p-8" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div
        ref={cardRef}
        className="w-[260px] rounded-lg p-6 flex flex-col items-center text-center"
        style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
      >
        <div className="w-12 h-12 rounded-full mb-3" style={{ background: '#1a1a1a' }} />
        <h3 className="font-inter font-semibold text-kinetic-text text-sm">Alex Chen</h3>
        <p className="font-inter text-xs text-kinetic-text-muted mt-1">UI Engineer</p>
      </div>
    </div>
  );
};

export default MagneticCard;

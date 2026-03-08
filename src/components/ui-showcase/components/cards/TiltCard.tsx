import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useIsTouch } from '@/hooks/use-mobile';

const TiltCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();

  // Entrance animation for touch devices
  useEffect(() => {
    if (isTouch && cardRef.current) {
      gsap.fromTo(cardRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
    }
  }, [isTouch]);

  const onMove = (e: React.MouseEvent) => {
    if (isTouch) return;
    const rect = cardRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(cardRef.current!, {
      rotateY: x * 15,
      rotateX: -y * 15,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
    });
    gsap.to(glareRef.current!, {
      opacity: 0.15,
      x: x * 100,
      y: y * 100,
      duration: 0.3,
    });
  };

  const onLeave = () => {
    if (isTouch) return;
    gsap.to(cardRef.current!, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1,0.5)' });
    gsap.to(glareRef.current!, { opacity: 0, duration: 0.3 });
  };

  return (
    <div style={{ perspective: '1000px' }}>
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative w-[240px] md:w-[280px] h-[280px] md:h-[320px] rounded-lg overflow-hidden p-6 flex flex-col"
        style={{ background: '#10101a', border: '1px solid #252535', transformStyle: 'preserve-3d' }}
      >
        <div
          ref={glareRef}
          className="absolute inset-0 opacity-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)',
          }}
        />
        <div className="w-10 h-10 rounded-md mb-4" style={{ background: '#1a1a2e' }} />
        <h3 className="font-inter font-semibold text-kinetic-text text-base mb-2">Tilt Card</h3>
        <p className="font-inter font-light text-sm text-kinetic-text-muted leading-relaxed">
          {isTouch ? 'View on desktop for 3D tilt effect.' : 'Hover to see the 3D tilt effect with glare overlay.'}
        </p>
      </div>
    </div>
  );
};

export default TiltCard;

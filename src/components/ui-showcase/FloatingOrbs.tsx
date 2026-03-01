import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

const FloatingOrbs = () => {
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();

  const orbData = [
    { size: isMobile ? 126 : 180, color: '#7c3aed', opacity: 0.2, blur: 40, x: '10%', y: '10%', dx: 60, dy: 40, dur: 8 },
    { size: isMobile ? 98 : 140, color: '#a78bfa', opacity: 0.15, blur: 50, x: '45%', y: '40%', dx: -40, dy: 50, dur: 10 },
    { size: isMobile ? 140 : 200, color: '#6d28d9', opacity: 0.18, blur: 35, x: '70%', y: '60%', dx: -50, dy: -30, dur: 7 },
    { size: isMobile ? 70 : 100, color: '#e879f9', opacity: 0.12, blur: 45, x: '75%', y: '15%', dx: 30, dy: 40, dur: 11 },
    { size: isMobile ? 112 : 160, color: '#7c3aed', opacity: 0.1, blur: 55, x: '20%', y: '65%', dx: 50, dy: -40, dur: 9 },
  ];

  useEffect(() => {
    const tweens = orbRefs.current.map((el, i) => {
      if (!el) return null;
      const o = orbData[i];
      return gsap.to(el, {
        x: o.dx, y: o.dy, scale: 1.2,
        duration: o.dur, yoyo: true, repeat: -1, ease: 'sine.inOut',
        delay: i * 0.5,
      });
    });
    return () => tweens.forEach(t => t?.kill());
  }, [isMobile]);

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: 320, background: '#030303' }}>
      {orbData.map((o, i) => (
        <div
          key={i}
          ref={el => { orbRefs.current[i] = el; }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: o.size, height: o.size,
            left: o.x, top: o.y,
            background: o.color,
            opacity: o.opacity,
            filter: `blur(${o.blur}px)`,
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-lg px-6 py-4 text-center" style={{ background: 'rgba(3,3,3,0.7)', border: '1px solid #1a1a1a' }}>
          <h3 className="font-syne font-bold text-kinetic-text text-base">Floating Orbs</h3>
          <p className="font-inter text-xs text-kinetic-text-muted mt-1">Ambient background effect</p>
        </div>
      </div>
    </div>
  );
};

export default FloatingOrbs;

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

const AuroraBackground = () => {
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();

  const blobs = [
    { w: isMobile ? 350 : 600, h: isMobile ? 350 : 600, color: 'rgba(124,58,237,0.8)', x: 20, y: -20, dx: 80, dy: 60, ds: 1.3, dur: 8 },
    { w: isMobile ? 400 : 700, h: isMobile ? 280 : 450, color: 'rgba(167,139,250,0.65)', x: isMobile ? 100 : 200, y: 60, dx: -60, dy: 80, ds: 1.2, dur: 11 },
    { w: isMobile ? 300 : 500, h: isMobile ? 300 : 500, color: 'rgba(232,121,249,0.55)', x: isMobile ? 40 : 80, y: isMobile ? 120 : 140, dx: 40, dy: -50, ds: 1.1, dur: 9 },
  ];

  useEffect(() => {
    const tweens: gsap.core.Tween[] = [];
    blobRefs.current.forEach((el, i) => {
      if (!el) return;
      const b = blobs[i];
      // Movement
      tweens.push(gsap.to(el, {
        x: b.dx, y: b.dy, scale: b.ds,
        duration: b.dur, yoyo: true, repeat: -1, ease: 'sine.inOut',
      }));
      // Pulse glow
      tweens.push(gsap.to(el, {
        opacity: 0.55, duration: 1.5 + i * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut',
      }));
    });
    return () => tweens.forEach(t => t.kill());
  }, [isMobile]);

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: 320, background: '#030303' }}>
      {blobs.map((b, i) => (
        <div
          key={i}
          ref={el => { blobRefs.current[i] = el; }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: b.w, height: b.h,
            left: b.x, top: b.y,
            background: `radial-gradient(circle, ${b.color}, transparent)`,
            filter: 'blur(50px)',
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-syne font-extrabold text-xl md:text-2xl text-kinetic-text" style={{ opacity: 0.9 }}>KINETIC UI</span>
      </div>
    </div>
  );
};

export default AuroraBackground;

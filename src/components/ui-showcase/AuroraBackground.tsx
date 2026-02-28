import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const blobs = [
  { w: 400, h: 400, color: 'rgba(124,58,237,0.38)', x: 80, y: 40, dx: 80, dy: 60, ds: 1.3, dur: 8 },
  { w: 500, h: 300, color: 'rgba(167,139,250,0.28)', x: 280, y: 100, dx: -60, dy: 80, ds: 1.2, dur: 11 },
  { w: 350, h: 350, color: 'rgba(232,121,249,0.23)', x: 160, y: 220, dx: 40, dy: -50, ds: 1.1, dur: 9 },
];

const AuroraBackground = () => {
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tweens = blobRefs.current.map((el, i) => {
      if (!el) return null;
      const b = blobs[i];
      return gsap.to(el, {
        x: b.dx, y: b.dy, scale: b.ds,
        duration: b.dur, yoyo: true, repeat: -1, ease: 'sine.inOut',
      });
    });
    return () => tweens.forEach(t => t?.kill());
  }, []);

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
            filter: 'blur(60px)',
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-syne font-extrabold text-2xl text-kinetic-text" style={{ opacity: 0.9 }}>KINETIC UI</span>
      </div>
    </div>
  );
};

export default AuroraBackground;

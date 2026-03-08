import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const BeamOfLight = () => {
  const beamRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
    tl.fromTo([beamRef.current, glowRef.current],
      { x: -30 },
      { x: '100%', duration: 2.5, ease: 'none' }
    );
    return () => { tl.kill(); };
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: 320, background: '#030303' }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-syne font-extrabold" style={{ fontSize: '7rem', color: '#181825', lineHeight: 1 }}>
          SWEEP
        </span>
      </div>
      <div
        ref={glowRef}
        className="absolute top-0 h-full pointer-events-none"
        style={{
          width: 30,
          background: 'linear-gradient(to bottom, transparent, rgba(124,58,237,0.15), rgba(167,139,250,0.08), transparent)',
          filter: 'blur(15px)',
        }}
      />
      <div
        ref={beamRef}
        className="absolute top-0 h-full pointer-events-none"
        style={{
          width: 2,
          background: 'linear-gradient(to bottom, transparent, rgba(124,58,237,1), rgba(167,139,250,0.5), transparent)',
          filter: 'blur(3px)',
        }}
      />
    </div>
  );
};

export default BeamOfLight;

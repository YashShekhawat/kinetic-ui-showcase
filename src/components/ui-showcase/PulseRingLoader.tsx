import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const PulseRingLoader = () => {
  const ringsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tweens = ringsRef.current.map((ring, i) => {
      if (!ring) return null;
      return gsap.fromTo(ring,
        { scale: 1, opacity: 0.6 },
        { scale: 2.5, opacity: 0, duration: 2, ease: 'power1.out', repeat: -1, delay: i * 0.6 }
      );
    });
    return () => tweens.forEach(t => t?.kill());
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          ref={el => { ringsRef.current[i] = el; }}
          className="absolute rounded-full"
          style={{ width: 40, height: 40, border: '1px solid #7c3aed' }}
        />
      ))}
      <div
        className="relative flex items-center justify-center rounded-full font-syne font-bold text-xs text-kinetic-text"
        style={{ width: 40, height: 40, border: '1px solid #7c3aed' }}
      >
        KU
      </div>
    </div>
  );
};

export default PulseRingLoader;

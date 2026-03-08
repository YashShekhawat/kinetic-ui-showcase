import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const orbitData = [
  { radius: 20, size: 6, color: '#7c3aed', speed: 1.2, offset: 0 },
  { radius: 35, size: 5, color: '#a78bfa', speed: 1.8, offset: (2 * Math.PI) / 3 },
  { radius: 50, size: 4, color: '#6d28d9', speed: 2.4, offset: (4 * Math.PI) / 3 },
];

const OrbitLoader = () => {
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tickerRef = useRef<((t: number) => void) | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    const fn = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      orbitData.forEach((o, i) => {
        const dot = dotsRef.current[i];
        if (!dot) return;
        const angle = o.offset + (elapsed / o.speed) * Math.PI * 2;
        dot.style.transform = `translate(${Math.cos(angle) * o.radius}px, ${Math.sin(angle) * o.radius}px)`;
      });
    };
    tickerRef.current = fn;
    gsap.ticker.add(fn);
    return () => { gsap.ticker.remove(fn); };
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
      <div className="w-3 h-3 rounded-full" style={{ background: '#ededed' }} />
      {orbitData.map((o, i) => (
        <div
          key={i}
          ref={el => { dotsRef.current[i] = el; }}
          className="absolute rounded-full"
          style={{
            width: o.size,
            height: o.size,
            background: o.color,
            boxShadow: `0 0 8px ${o.color}`,
          }}
        />
      ))}
    </div>
  );
};

export default OrbitLoader;

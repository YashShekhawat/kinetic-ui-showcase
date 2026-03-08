import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CursorTrail = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const dots = dotsRef.current;
    if (!dots.length) return;

    const xTos = dots.map((_, i) => gsap.quickTo(dots[i], 'x', { duration: 0.1 + i * 0.09, ease: 'power2.out' }));
    const yTos = dots.map((_, i) => gsap.quickTo(dots[i], 'y', { duration: 0.1 + i * 0.09, ease: 'power2.out' }));

    const onMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left - 3;
      const y = e.clientY - rect.top - 3;
      xTos.forEach(fn => fn(x));
      yTos.forEach(fn => fn(y));
    };

    const container = containerRef.current!;
    container.addEventListener('mousemove', onMove);
    return () => container.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[280px] rounded-lg overflow-hidden cursor-none"
      style={{ background: '#050505', border: '1px solid #1a1a1a' }}
    >
      <p className="absolute top-4 left-4 font-mono text-[11px] text-kinetic-text-dim">Move cursor here</p>
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          ref={el => { if (el) dotsRef.current[i] = el; }}
          className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{
            background: i === 0 ? '#7c3aed' : `rgba(167, 139, 250, ${1 - i * 0.1})`,
            opacity: 1 - i * 0.09,
          }}
        />
      ))}
    </div>
  );
};

export default CursorTrail;

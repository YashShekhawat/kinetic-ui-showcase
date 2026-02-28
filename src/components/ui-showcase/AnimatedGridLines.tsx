import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CELL = 40;

const AnimatedGridLines = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cellsRef = useRef<HTMLDivElement[]>([]);
  const intervalRef = useRef<number>(0);

  useEffect(() => {
    // Scanning line
    const lineTween = gsap.to(lineRef.current, {
      top: '100%', duration: 4, ease: 'none', repeat: -1,
    });

    // Random cell pulses
    const w = containerRef.current?.clientWidth || 400;
    const h = containerRef.current?.clientHeight || 320;
    const cols = Math.floor(w / CELL);
    const rows = Math.floor(h / CELL);

    intervalRef.current = window.setInterval(() => {
      const idx = Math.floor(Math.random() * cellsRef.current.length);
      const cell = cellsRef.current[idx];
      if (cell) {
        gsap.fromTo(cell, { background: 'rgba(124,58,237,0.06)' }, { background: 'transparent', duration: 0.8 });
      }
    }, 300);

    return () => {
      lineTween.kill();
      clearInterval(intervalRef.current);
    };
  }, []);

  const w = 400;
  const h = 320;
  const cols = Math.floor(w / CELL);
  const rows = Math.floor(h / CELL);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{
        minHeight: 320,
        background: '#030303',
        backgroundImage: `linear-gradient(#0f0f0f 1px, transparent 1px), linear-gradient(90deg, #0f0f0f 1px, transparent 1px)`,
        backgroundSize: `${CELL}px ${CELL}px`,
      }}
      onMouseMove={e => {
        const rect = containerRef.current!.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        cellsRef.current.forEach(cell => {
          const cr = cell.getBoundingClientRect();
          const cx = cr.left - rect.left + CELL / 2;
          const cy = cr.top - rect.top + CELL / 2;
          const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
          if (dist < 80) {
            cell.style.background = `rgba(124,58,237,${0.12 * (1 - dist / 80)})`;
          }
        });
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div
          key={i}
          ref={el => { if (el) cellsRef.current[i] = el; }}
          className="absolute"
          style={{
            width: CELL, height: CELL,
            left: (i % cols) * CELL,
            top: Math.floor(i / cols) * CELL,
          }}
        />
      ))}
      <div
        ref={lineRef}
        className="absolute left-0 w-full"
        style={{ top: 0, height: 1, background: '#7c3aed', opacity: 0.3 }}
      />
    </div>
  );
};

export default AnimatedGridLines;

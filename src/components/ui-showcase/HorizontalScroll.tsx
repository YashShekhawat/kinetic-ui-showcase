import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const panels = [
  { num: '01', label: 'Introduction' },
  { num: '02', label: 'Philosophy' },
  { num: '03', label: 'Architecture' },
  { num: '04', label: 'Components' },
  { num: '05', label: 'Showcase' },
];

const HorizontalScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const currentX = useRef(0);
  const targetX = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const getMaxScroll = () => track.scrollWidth - container.offsetWidth;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      currentX.current = lerp(currentX.current, targetX.current, 0.1);

      // Snap when close enough
      if (Math.abs(currentX.current - targetX.current) < 0.5) {
        currentX.current = targetX.current;
      }

      gsap.set(track, { x: -currentX.current });
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const maxScroll = getMaxScroll();
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      targetX.current = Math.max(0, Math.min(targetX.current + delta, maxScroll));
    };

    const onEnter = () => {
      const lenis = (window as any).__lenis;
      if (lenis) lenis.stop();
    };

    const onLeave = () => {
      const lenis = (window as any).__lenis;
      if (lenis) lenis.start();
      // Snap momentum to rest
      targetX.current = currentX.current;
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);

    return () => {
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      // Ensure lenis is never left paused
      const lenis = (window as any).__lenis;
      if (lenis) lenis.start();
    };
  }, []);

  return (
    <div className="w-full">
      <p className="font-mono text-[11px] text-kinetic-text-muted mb-4 text-center">↓ Scroll to move →</p>
      <div ref={containerRef} className="overflow-hidden h-[240px]">
        <div ref={trackRef} className="flex h-full w-max gap-4">
          {panels.map((p, i) => (
            <div
              key={i}
              className="w-[240px] h-full rounded-lg flex flex-col items-center justify-center"
              style={{
                background: i % 2 === 0 ? '#0a0a0a' : '#0f0f0f',
                border: '1px solid #1a1a1a',
              }}
            >
              <span className="font-mono text-3xl text-kinetic-text-dim">{p.num}</span>
              <span className="font-inter text-sm text-kinetic-text-muted mt-2">{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalScroll;

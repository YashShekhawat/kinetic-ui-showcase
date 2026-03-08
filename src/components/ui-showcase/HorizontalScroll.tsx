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
    const clamp = (val: number, max: number, min: number) =>
      Math.max(min, Math.min(val, max));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      currentX.current = lerp(currentX.current, targetX.current, 0.1);
      if (Math.abs(currentX.current - targetX.current) < 0.5) {
        currentX.current = targetX.current;
      }
      gsap.set(track, { x: -currentX.current });
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    const onWheel = (e: WheelEvent) => {
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (isHorizontal) {
        e.preventDefault();
        targetX.current = clamp(targetX.current - e.deltaX * 1.2, getMaxScroll(), 0);
      }
      // vertical scroll: do nothing, let page scroll naturally
    };

    const onEnter = () => {
      const lenis = (window as any).__lenis;
      if (lenis) lenis.stop();
    };

    const onLeave = () => {
      const lenis = (window as any).__lenis;
      if (lenis) lenis.start();
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
      const lenis = (window as any).__lenis;
      if (lenis) lenis.start();
    };
  }, []);

  return (
    <div className="w-full" data-preview="true" style={{ pointerEvents: 'none' }}>
      <p className="font-mono text-[11px] text-kinetic-text-muted mb-4 text-center">↓ Scroll to move →</p>
      <div ref={containerRef} className="overflow-hidden" style={{ height: 320, pointerEvents: 'auto' }}>
        <div ref={trackRef} className="flex h-full w-max gap-4">
          {panels.map((p, i) => (
            <div
              key={i}
              className="h-full rounded-lg flex flex-col items-center justify-center"
              style={{
                width: 240,
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

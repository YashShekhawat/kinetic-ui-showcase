import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const scrollWidth = track.scrollWidth - track.offsetWidth;

      gsap.to(track, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current!,
          start: 'top top',
          end: `+=${scrollWidth}`,
          scrub: 1,
          pin: true,
        },
      });
    });
    return () => ctx.revert();
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

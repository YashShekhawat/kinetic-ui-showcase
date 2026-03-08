import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollProgressBar = () => {
  const bar1Ref = useRef<HTMLDivElement>(null);
  const bar2Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Accent bar
      gsap.to(bar1Ref.current!, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current!,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
      // Gradient bar
      gsap.to(bar2Ref.current!, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current!,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full space-y-8">
      {/* Variant 1: Accent */}
      <div>
        <span className="font-mono text-[11px] text-kinetic-text-muted mb-2 block">Accent / 2px</span>
        <div className="w-full h-[2px] bg-kinetic-border rounded-full overflow-hidden">
          <div ref={bar1Ref} className="h-full bg-kinetic-accent origin-left" style={{ transform: 'scaleX(0.3)' }} />
        </div>
      </div>
      {/* Variant 2: Gradient / 4px */}
      <div>
        <span className="font-mono text-[11px] text-kinetic-text-muted mb-2 block">Gradient / 4px</span>
        <div className="w-full h-1 bg-kinetic-border rounded-full overflow-hidden">
          <div
            ref={bar2Ref}
            className="h-full origin-left"
            style={{
              background: 'linear-gradient(90deg, #7c3aed, #a78bfa, #e879f9)',
              transform: 'scaleX(0.6)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScrollProgressBar;

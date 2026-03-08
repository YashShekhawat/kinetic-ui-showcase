import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const DNAStrandLoader = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const dots1 = el.querySelectorAll('.dna-top');
    const dots2 = el.querySelectorAll('.dna-bot');

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(dots1, { y: 20, stagger: 0.08, duration: 0.6, ease: 'sine.inOut' }, 0);
    tl.to(dots2, { y: -20, stagger: 0.08, duration: 0.6, ease: 'sine.inOut' }, 0);

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-1">
      <div className="flex gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="dna-top w-2 h-2 rounded-full" style={{ background: '#9b5de5' }} />
        ))}
      </div>
      <div className="flex gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="dna-bot w-2 h-2 rounded-full" style={{ background: '#c77dff' }} />
        ))}
      </div>
    </div>
  );
};

export default DNAStrandLoader;

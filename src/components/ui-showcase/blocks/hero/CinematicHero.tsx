import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CinematicHero = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2, defaults: { ease: 'power4.out' } });
      tl.fromTo('.ch-badge', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4 });
      tl.fromTo('.ch-line', { y: '100%' }, { y: '0%', duration: 0.7, stagger: 0.1 }, '-=0.2');
      tl.fromTo('.ch-sub', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');
      tl.fromTo('.ch-btn', { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 }, '-=0.2');
      tl.to({}, { duration: 2 });
      tl.to(['.ch-badge', '.ch-sub', '.ch-btn'], { opacity: 0, y: -10, duration: 0.4 });
      tl.to('.ch-line', { y: '-100%', duration: 0.5, stagger: 0.05 }, '-=0.2');
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="relative w-full h-full min-h-[400px] flex items-center justify-center text-center">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] h-[300px]" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)' }} />
      </div>
      <div className="relative z-10">
        <div className="ch-badge opacity-0 inline-block font-mono text-[10px] text-kinetic-accent-light px-3 py-1 rounded-full mb-4"
          style={{ border: '1px solid rgba(124,58,237,0.25)', background: 'rgba(124,58,237,0.06)' }}>
          ✦ Cinematic
        </div>
        <div className="overflow-hidden"><div className="ch-line font-syne font-extrabold text-2xl text-kinetic-text">Stunning visuals</div></div>
        <div className="overflow-hidden"><div className="ch-line font-syne font-extrabold text-2xl text-kinetic-accent-light">for every project.</div></div>
        <p className="ch-sub opacity-0 font-inter font-light text-xs text-kinetic-text-muted mt-3 max-w-[280px] mx-auto">
          Production-ready hero components built with GSAP.
        </p>
        <div className="flex gap-2 mt-4 justify-center">
          <button className="ch-btn opacity-0 font-inter text-xs px-4 py-2 rounded-md text-white" style={{ background: 'var(--theme-accent)' }}>Get Started</button>
          <button className="ch-btn opacity-0 font-inter text-xs px-4 py-2 rounded-md text-kinetic-text-muted" style={{ border: '1px solid #1a1a1a' }}>Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default CinematicHero;

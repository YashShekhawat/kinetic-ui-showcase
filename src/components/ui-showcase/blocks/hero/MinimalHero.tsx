import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const words = ['DESIGN', 'BUILD', 'SHIP'];

const MinimalHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let idx = 0;
    const el = wordRef.current!;
    
    const cycle = () => {
      gsap.to(el, {
        y: '-100%',
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.6,
        ease: 'power4.inOut',
        onComplete: () => {
          idx = (idx + 1) % words.length;
          el.textContent = words[idx];
          gsap.set(el, { y: '100%', clipPath: 'inset(100% 0 0 0)' });
          gsap.to(el, { y: '0%', clipPath: 'inset(0% 0 0% 0)', duration: 0.6, ease: 'power4.inOut' });
        },
      });
    };

    const interval = setInterval(cycle, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] flex flex-col items-center justify-center">
      <div className="overflow-hidden h-[80px] flex items-center">
        <div ref={wordRef} className="font-syne font-extrabold text-6xl text-kinetic-text">
          DESIGN
        </div>
      </div>
      <p className="font-inter font-light text-sm text-kinetic-text-muted mt-4">
        One word. Infinite possibilities.
      </p>
    </div>
  );
};

export default MinimalHero;

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const words = 'Craft interfaces that feel inevitable and impossible to forget'.split(' ');

const WordByWordReveal = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>('.wbw-word');
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
      tl.fromTo(els, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power3.out' });
      tl.to(els, { opacity: 0, y: -10, duration: 0.3, stagger: 0.02 }, '+=2');
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="font-inter font-light text-lg text-kinetic-text leading-relaxed max-w-[400px] text-center">
      {words.map((w, i) => (
        <span key={i} className="wbw-word inline-block mr-1.5 opacity-0">{w}</span>
      ))}
    </div>
  );
};

export default WordByWordReveal;

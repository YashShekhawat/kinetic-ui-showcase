import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const TextReveal = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>('.tr-word-inner');
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
      tl.fromTo(words, { y: '100%' }, { y: '0%', duration: 0.8, stagger: 0.12, ease: 'power4.out' });
      tl.to(words, { y: '-100%', duration: 0.6, stagger: 0.08, ease: 'power3.in' }, '+=1.5');
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="flex gap-3 items-center">
      {['Every', 'word.', 'A', 'moment.'].map((w, i) => (
        <div key={i} className="overflow-hidden">
          <span className="tr-word-inner block font-syne font-bold text-xl md:text-3xl text-kinetic-text">{w}</span>
        </div>
      ))}
    </div>
  );
};

export default TextReveal;

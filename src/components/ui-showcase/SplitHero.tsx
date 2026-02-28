import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const SplitHero = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Word reveals
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
      tl.fromTo('.sh-word', { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power4.out' });
      tl.to('.sh-word', { y: '-100%', opacity: 0, duration: 0.5, stagger: 0.05 }, '+=2');

      // Split line
      gsap.fromTo('.sh-line', { scaleY: 0 }, { scaleY: 1, duration: 1, ease: 'power3.out' });

      // Rotating shapes
      gsap.to('.sh-outer', { rotation: 360, duration: 12, repeat: -1, ease: 'none' });
      gsap.to('.sh-inner', { rotation: -360, duration: 8, repeat: -1, ease: 'none' });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="w-full h-full min-h-[400px] flex items-center">
      {/* Left */}
      <div className="flex-1 pr-8">
        {['Build', 'Something', 'Beautiful'].map((w, i) => (
          <div key={i} className="overflow-hidden">
            <span className="sh-word block font-syne font-extrabold text-3xl text-kinetic-text">{w}</span>
          </div>
        ))}
      </div>

      {/* Split line */}
      <div className="sh-line w-px h-[200px] bg-kinetic-border origin-top" />

      {/* Right */}
      <div className="flex-1 flex items-center justify-center pl-8">
        <div className="sh-outer w-[120px] h-[120px] flex items-center justify-center" style={{ border: '1px solid #1a1a1a' }}>
          <div className="sh-inner w-[60px] h-[60px]" style={{ border: '1px solid rgba(124,58,237,0.4)' }} />
        </div>
      </div>
    </div>
  );
};

export default SplitHero;

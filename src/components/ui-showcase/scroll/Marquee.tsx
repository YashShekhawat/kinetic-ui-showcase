import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Marquee = () => {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r1 = row1Ref.current!;
    const r2 = row2Ref.current!;
    r1.innerHTML += r1.innerHTML;
    r2.innerHTML += r2.innerHTML;

    const tl1 = gsap.to(r1, { xPercent: -50, duration: 15, repeat: -1, ease: 'none' });
    const tl2 = gsap.fromTo(r2, { xPercent: -50 }, { xPercent: 0, duration: 20, repeat: -1, ease: 'none' });

    const c = containerRef.current!;
    const pause = () => { tl1.timeScale(0); tl2.timeScale(0); };
    const play = () => { gsap.to(tl1, { timeScale: 1, duration: 0.5 }); gsap.to(tl2, { timeScale: 1, duration: 0.5 }); };
    c.addEventListener('mouseenter', pause);
    c.addEventListener('mouseleave', play);

    return () => {
      tl1.kill(); tl2.kill();
      c.removeEventListener('mouseenter', pause);
      c.removeEventListener('mouseleave', play);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-hidden space-y-4">
      <div ref={row1Ref} className="flex w-max whitespace-nowrap">
        {'KINETIC UI · GSAP · REACT · MOTION · '.split('').map((_, i) => null)}
        <span className="font-syne font-bold text-xl text-kinetic-text mr-4">
          KINETIC UI · GSAP · REACT · MOTION ·&nbsp;
        </span>
      </div>
      <div ref={row2Ref} className="flex w-max whitespace-nowrap">
        <span className="font-mono text-[11px] text-kinetic-text-muted tracking-[0.2em] mr-4">
          COMPONENTS · ANIMATIONS · OPEN SOURCE ·&nbsp;
        </span>
      </div>
    </div>
  );
};

export default Marquee;

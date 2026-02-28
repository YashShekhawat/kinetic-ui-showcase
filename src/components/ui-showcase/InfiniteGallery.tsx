import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const InfiniteGallery = () => {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r1 = row1Ref.current!;
    const r2 = row2Ref.current!;

    // Clone items for seamless loop
    r1.innerHTML += r1.innerHTML;
    r2.innerHTML += r2.innerHTML;

    const tl1 = gsap.to(r1, { xPercent: -50, duration: 20, repeat: -1, ease: 'none' });
    const tl2 = gsap.to(r2, { xPercent: -50, duration: 25, repeat: -1, ease: 'none' });
    // Reverse direction for row 2
    tl2.reversed(true);
    // Actually let's use different approach
    tl2.kill();
    const tl2b = gsap.fromTo(r2, { xPercent: -50 }, { xPercent: 0, duration: 25, repeat: -1, ease: 'none' });

    const container = containerRef.current!;
    const onEnter = () => { tl1.pause(); tl2b.pause(); };
    const onLeave = () => { tl1.resume(); tl2b.resume(); };
    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);

    return () => {
      tl1.kill();
      tl2b.kill();
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const items = Array.from({ length: 6 }, (_, i) => (
    <div
      key={i}
      className="flex-shrink-0 w-[200px] h-[140px] rounded-lg flex items-center justify-center font-mono text-sm text-kinetic-text-muted mx-2"
      style={{
        background: `linear-gradient(135deg, #0f0f0f, #1a1a1a)`,
        border: '1px solid #1a1a1a',
      }}
    >
      {String(i + 1).padStart(2, '0')}
    </div>
  ));

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div ref={row1Ref} className="flex mb-4 w-max">
        {items}
      </div>
      <div ref={row2Ref} className="flex w-max">
        {items}
      </div>
    </div>
  );
};

export default InfiniteGallery;

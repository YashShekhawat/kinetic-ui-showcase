import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const images = [
  { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80', alt: 'Mountains' },
  { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80', alt: 'Valley' },
  { src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&q=80', alt: 'Forest' },
  { src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80', alt: 'Waterfall' },
  { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80', alt: 'Fog' },
  { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80', alt: 'Trees' },
];

const InfiniteGallery = () => {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r1 = row1Ref.current!;
    const r2 = row2Ref.current!;

    r1.innerHTML += r1.innerHTML;
    r2.innerHTML += r2.innerHTML;

    const tl1 = gsap.to(r1, { xPercent: -50, duration: 20, repeat: -1, ease: 'none' });
    const tl2 = gsap.fromTo(r2, { xPercent: -50 }, { xPercent: 0, duration: 25, repeat: -1, ease: 'none' });

    const container = containerRef.current!;
    const onEnter = () => { tl1.pause(); tl2.pause(); };
    const onLeave = () => { tl1.resume(); tl2.resume(); };
    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);

    return () => {
      tl1.kill();
      tl2.kill();
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const items = images.map((img, i) => (
    <div
      key={i}
      className="flex-shrink-0 w-[160px] h-[110px] md:w-[200px] md:h-[140px] rounded-lg overflow-hidden mx-2"
      style={{ border: '1px solid #252535' }}
    >
      <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
    </div>
  ));

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div ref={row1Ref} className="flex mb-4 w-max">{items}</div>
      <div ref={row2Ref} className="flex w-max">{items}</div>
    </div>
  );
};

export default InfiniteGallery;

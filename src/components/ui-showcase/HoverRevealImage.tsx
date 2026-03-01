import { useRef, useState } from 'react';
import gsap from 'gsap';

const items = [
  { label: 'Brand Identity', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=480&q=80' },
  { label: 'Web Design', image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=480&q=80' },
  { label: 'Motion Graphics', image: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=480&q=80' },
  { label: 'Development', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=480&q=80' },
];

const HoverRevealImage = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState(items[0].image);

  const onMove = (e: React.MouseEvent) => {
    if (!wrapRef.current) return;
    gsap.to(wrapRef.current, {
      x: e.clientX - wrapRef.current.parentElement!.getBoundingClientRect().left - 120,
      y: e.clientY - wrapRef.current.parentElement!.getBoundingClientRect().top - 80,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const onEnter = (image: string) => {
    setCurrentImage(image);
    gsap.to(wrapRef.current!, { opacity: 1, scale: 1, duration: 0.3 });
  };

  const onLeave = () => {
    gsap.to(wrapRef.current!, { opacity: 0, scale: 0.95, duration: 0.2 });
  };

  return (
    <div className="relative w-full" onMouseMove={onMove}>
      <div
        ref={wrapRef}
        className="absolute w-[240px] h-[160px] rounded-lg pointer-events-none z-10 opacity-0 overflow-hidden"
        style={{ transform: 'scale(0.95)', border: '1px solid #252535' }}
      >
        <img src={currentImage} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col gap-0">
        {items.map((item, i) => (
          <div
            key={i}
            onMouseEnter={() => onEnter(item.image)}
            onMouseLeave={onLeave}
            className="font-syne font-bold text-2xl text-kinetic-text py-4 cursor-pointer hover:text-kinetic-accent-light transition-colors border-b border-kinetic-border"
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HoverRevealImage;

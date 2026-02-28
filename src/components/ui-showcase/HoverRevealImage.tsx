import { useRef, useState } from 'react';
import gsap from 'gsap';

const items = ['Brand Identity', 'Web Design', 'Motion Graphics', 'Development'];

const HoverRevealImage = () => {
  const imgRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    gsap.to(imgRef.current, {
      x: e.clientX - imgRef.current.parentElement!.getBoundingClientRect().left - 120,
      y: e.clientY - imgRef.current.parentElement!.getBoundingClientRect().top - 80,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const onEnter = () => {
    setVisible(true);
    gsap.to(imgRef.current!, { opacity: 1, scale: 1, duration: 0.3 });
  };

  const onLeave = () => {
    gsap.to(imgRef.current!, { opacity: 0, scale: 0.95, duration: 0.2, onComplete: () => setVisible(false) });
  };

  return (
    <div className="relative w-full" onMouseMove={onMove}>
      {/* Floating image */}
      <div
        ref={imgRef}
        className="absolute w-[240px] h-[160px] rounded-lg pointer-events-none z-10 opacity-0"
        style={{
          background: 'linear-gradient(135deg, #7c3aed30, #10101a)',
          border: '1px solid #252535',
          transform: 'scale(0.95)',
        }}
      />

      {/* Items list */}
      <div className="flex flex-col gap-0">
        {items.map((item, i) => (
          <div
            key={i}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            className="font-syne font-bold text-2xl text-kinetic-text py-4 cursor-pointer hover:text-kinetic-accent-light transition-colors border-b border-kinetic-border"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HoverRevealImage;

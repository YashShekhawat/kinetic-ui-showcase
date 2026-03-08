import { useRef } from 'react';
import gsap from 'gsap';

const stackImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=320&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=320&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=320&q=80',
];

const ImageStackReveal = () => {
  const cardsRef = useRef<HTMLDivElement>(null);

  const onEnter = () => {
    const cards = cardsRef.current!.children;
    gsap.to(cards[0], { rotation: -15, x: -80, duration: 0.5, ease: 'power3.out' });
    gsap.to(cards[1], { rotation: 0, x: 0, y: -10, duration: 0.5, ease: 'power3.out' });
    gsap.to(cards[2], { rotation: 15, x: 80, duration: 0.5, ease: 'power3.out' });
  };

  const onLeave = () => {
    const cards = cardsRef.current!.children;
    gsap.to(cards[0], { rotation: -3, x: -6, duration: 0.4 });
    gsap.to(cards[1], { rotation: 0, x: 0, y: 0, duration: 0.4 });
    gsap.to(cards[2], { rotation: 3, x: 6, duration: 0.4 });
  };

  return (
    <div
      className="relative w-[240px] h-[200px] cursor-pointer"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div ref={cardsRef} className="relative w-full h-full flex items-center justify-center">
        {stackImages.map((src, i) => (
          <div
            key={i}
            className="absolute w-[160px] h-[120px] rounded-lg overflow-hidden"
            style={{
              border: '1px solid #252535',
              transform: `rotate(${[-3, 0, 3][i]}deg) translateX(${[-6, 0, 6][i]}px)`,
            }}
          >
            <img src={src} alt={`Stack image ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageStackReveal;

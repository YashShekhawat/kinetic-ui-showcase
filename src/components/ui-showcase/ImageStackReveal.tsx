import { useRef } from 'react';
import gsap from 'gsap';

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
        {[
          { rot: -3, x: -6, bg: 'linear-gradient(135deg, #13131f, #1a1a2e)' },
          { rot: 0, x: 0, bg: 'linear-gradient(135deg, #7c3aed25, #10101a)' },
          { rot: 3, x: 6, bg: 'linear-gradient(135deg, #13131f, #1a1a2e)' },
        ].map((c, i) => (
          <div
            key={i}
            className="absolute w-[160px] h-[120px] rounded-lg"
            style={{
              background: c.bg,
              border: '1px solid #252535',
              transform: `rotate(${c.rot}deg) translateX(${c.x}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageStackReveal;

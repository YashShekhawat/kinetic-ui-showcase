import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const GradientText = () => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      backgroundPosition: '200% center',
      duration: 3,
      repeat: -1,
      ease: 'none',
    });
  }, []);

  return (
    <span
      ref={ref}
      className="font-syne font-extrabold text-xl sm:text-2xl md:text-4xl text-center"
      style={{
        background: 'linear-gradient(90deg, #7c3aed, #a78bfa, #e879f9, #7c3aed)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      Beautiful interfaces
    </span>
  );
};

export default GradientText;

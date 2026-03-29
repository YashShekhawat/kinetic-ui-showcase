import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CountingNumbers = () => {
  const ref = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!numRef.current) return;
    const el = numRef.current;

    const animate = () => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 2400,
        duration: 2.5,
        ease: 'power2.out',
        snap: { val: 1 },
        onUpdate: () => {
          const v = obj.val;
          el.textContent = v >= 1000 ? (v / 1000).toFixed(1) + 'K' : String(Math.round(v));
        },
        onComplete: () => {
          gsap.delayedCall(2, () => {
            gsap.to(el, {
              opacity: 0, duration: 0.3,
              onComplete: () => {
                el.textContent = '0';
                gsap.to(el, { opacity: 1, duration: 0.2, onComplete: animate });
              }
            });
          });
        },
      });
    };

    animate();
    return () => { gsap.killTweensOf(el); gsap.killTweensOf({}); };
  }, []);

  return (
    <div ref={ref} className="flex items-end justify-center">
      <div className="text-center">
        <div className="font-syne font-extrabold text-2xl sm:text-3xl md:text-4xl text-kinetic-text">
          <span ref={numRef}>0</span>
          <span className="text-kinetic-accent-light">+</span>
        </div>
        <div className="font-inter font-light text-[10px] sm:text-xs text-kinetic-text-muted mt-1">Users</div>
      </div>
    </div>
  );
};

export default CountingNumbers;
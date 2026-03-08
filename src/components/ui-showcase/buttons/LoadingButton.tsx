import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const LoadingButton = () => {
  const btnRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<HTMLSpanElement>(null);
  const doneRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const run = () => {
      const btn = btnRef.current!;
      const text = textRef.current!;
      const dots = dotsRef.current!;
      const check = checkRef.current!;
      const done = doneRef.current!;

      const tl = gsap.timeline({ onComplete: () => gsap.delayedCall(1.5, run) });
      tlRef.current = tl;

      // Reset
      tl.set(text, { opacity: 1 });
      tl.set(dots, { opacity: 0, display: 'none' });
      tl.set(check, { opacity: 0, scale: 0 });
      tl.set(done, { opacity: 0 });
      tl.set(btn, { background: '#7c3aed' });

      // Default → Loading
      tl.to(text, { opacity: 0, duration: 0.2 }, '+=1');
      tl.set(dots, { display: 'flex', opacity: 1 });
      tl.to(btn, { background: '#5b21b6', duration: 0.3 }, '<');

      // Pulse dots
      const dotEls = dots.children;
      tl.fromTo(dotEls, { scale: 0.5, opacity: 0.3 }, {
        scale: 1, opacity: 1, stagger: { each: 0.15, repeat: 3, yoyo: true },
        duration: 0.3, ease: 'sine.inOut',
      });

      // Loading → Success
      tl.to(dots, { opacity: 0, duration: 0.2 });
      tl.to(btn, { background: '#22c55e', duration: 0.3 }, '<');
      tl.fromTo(check, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'elastic.out(1,0.5)' });
      tl.to(done, { opacity: 1, duration: 0.2 }, '-=0.2');

      // Hold then reset
      tl.to({}, { duration: 1 });
      tl.to([check, done], { opacity: 0, duration: 0.2 });
      tl.to(btn, { background: '#7c3aed', duration: 0.2 });
      tl.to(text, { opacity: 1, duration: 0.2 });
    };

    run();
    return () => { tlRef.current?.kill(); };
  }, []);

  return (
    <div
      ref={btnRef}
      className="relative inline-flex items-center justify-center px-6 py-3 rounded-md text-white cursor-pointer select-none overflow-hidden"
      style={{ background: '#7c3aed', minWidth: 160, height: 44 }}
    >
      <span ref={textRef} className="font-inter font-medium text-sm">Submit Project</span>
      <div ref={dotsRef} className="absolute flex gap-1.5" style={{ display: 'none', opacity: 0 }}>
        <div className="w-2 h-2 rounded-full bg-white" />
        <div className="w-2 h-2 rounded-full bg-white" />
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>
      <span ref={checkRef} className="absolute text-white text-lg font-bold" style={{ opacity: 0 }}>✓</span>
      <span ref={doneRef} className="absolute text-white font-inter font-medium text-sm mt-6" style={{ opacity: 0 }}>Done!</span>
    </div>
  );
};

export default LoadingButton;

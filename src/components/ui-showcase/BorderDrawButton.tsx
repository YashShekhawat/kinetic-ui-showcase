import { useRef } from 'react';
import gsap from 'gsap';

const BorderDrawButton = () => {
  const topRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const onEnter = () => {
    tlRef.current?.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;
    tl.fromTo(topRef.current, { width: '0%' }, { width: '100%', duration: 0.15, ease: 'none' });
    tl.fromTo(rightRef.current, { height: '0%' }, { height: '100%', duration: 0.15, ease: 'none' }, '-=0.07');
    tl.fromTo(bottomRef.current, { width: '0%' }, { width: '100%', duration: 0.15, ease: 'none' }, '-=0.07');
    tl.fromTo(leftRef.current, { height: '0%' }, { height: '100%', duration: 0.15, ease: 'none' }, '-=0.07');
  };

  const onLeave = () => {
    tlRef.current?.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;
    tl.to(leftRef.current, { height: '0%', duration: 0.12, ease: 'none' });
    tl.to(bottomRef.current, { width: '0%', duration: 0.12, ease: 'none' }, '-=0.06');
    tl.to(rightRef.current, { height: '0%', duration: 0.12, ease: 'none' }, '-=0.06');
    tl.to(topRef.current, { width: '0%', duration: 0.12, ease: 'none' }, '-=0.06');
  };

  const lineStyle = 'absolute bg-kinetic-accent';

  return (
    <button
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative px-6 py-3 font-inter font-medium text-sm text-kinetic-text cursor-pointer"
      style={{ background: 'transparent' }}
    >
      <div ref={topRef} className={`${lineStyle} top-0 left-0 h-[1.5px]`} style={{ width: 0 }} />
      <div ref={rightRef} className={`${lineStyle} top-0 right-0 w-[1.5px]`} style={{ height: 0 }} />
      <div ref={bottomRef} className={`${lineStyle} bottom-0 right-0 h-[1.5px]`} style={{ width: 0 }} />
      <div ref={leftRef} className={`${lineStyle} bottom-0 left-0 w-[1.5px]`} style={{ height: 0 }} />
      View Docs
    </button>
  );
};

export default BorderDrawButton;

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Cursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) {
      setIsTouch(true);
      return;
    }

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const xTo = gsap.quickTo(ring, 'x', { duration: 0.12, ease: 'power2.out' });
    const yTo = gsap.quickTo(ring, 'y', { duration: 0.12, ease: 'power2.out' });

    const onMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const inPreview = target.closest('[data-preview="true"]') || target.closest('.block-preview-scroll');
      if (inPreview) {
        gsap.set(dot, { opacity: 0 });
        gsap.set(ring, { opacity: 0 });
      } else {
        gsap.set(dot, { opacity: 1 });
        gsap.set(ring, { opacity: 1 });
      }
      gsap.set(dot, { x: e.clientX - 4, y: e.clientY - 4 });
      xTo(e.clientX - 18);
      yTo(e.clientY - 18);
    };

    const onEnterInteractive = () => {
      gsap.to(ring, { scale: 2, background: 'rgba(124,58,237,0.12)', duration: 0.3 });
      gsap.to(dot, { scale: 0, duration: 0.3 });
    };

    const onLeaveInteractive = () => {
      gsap.to(ring, { scale: 1, background: 'transparent', duration: 0.3 });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    const onEnterCode = () => {
      gsap.to(ring, { borderColor: '#22c55e', duration: 0.3 });
    };

    const onLeaveCode = () => {
      gsap.to(ring, { borderColor: 'rgba(124,58,237,0.6)', duration: 0.3 });
    };

    window.addEventListener('mousemove', onMove);

    const addListeners = () => {
      document.querySelectorAll('a, button, [data-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnterInteractive);
        el.addEventListener('mouseleave', onLeaveInteractive);
      });
      document.querySelectorAll('pre, code, [data-code]').forEach(el => {
        el.addEventListener('mouseenter', onEnterCode);
        el.addEventListener('mouseleave', onLeaveCode);
      });
    };

    addListeners();
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      observer.disconnect();
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none"
        style={{ background: '#7c3aed', zIndex: 9999 }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full pointer-events-none"
        style={{
          border: '1.5px solid rgba(124,58,237,0.6)',
          zIndex: 9999,
        }}
      />
    </>
  );
};

export default Cursor;

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

const PageTransition = () => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const el = overlayRef.current;
    if (!el) return;
    const tl = gsap.timeline();
    tl.set(el, { display: 'block', opacity: 0 });
    tl.to(el, { opacity: 1, duration: 0.15, ease: 'power2.in' });
    tl.to(el, { opacity: 0, duration: 0.2, ease: 'power2.out', delay: 0.05 });
    tl.set(el, { display: 'none' });
  }, [location.pathname]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        background: '#060608',
        zIndex: 9998,
        display: 'none',
        opacity: 0,
      }}
    />
  );
};

export default PageTransition;

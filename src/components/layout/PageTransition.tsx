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
    tl.set(el, { xPercent: 100, display: 'block' });
    tl.to(el, { xPercent: 0, duration: 0.25, ease: 'power2.inOut' });
    tl.to(el, { xPercent: -100, duration: 0.25, ease: 'power2.inOut' });
    tl.set(el, { display: 'none' });
  }, [location.pathname]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none"
      style={{ background: '#060608', zIndex: 9998, display: 'none', transform: 'translateX(100%)' }}
    />
  );
};

export default PageTransition;

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const ShatterButton = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const text = 'Click Me';
    const chars = text.split('');

    const runCycle = () => {
      container.innerHTML = '';
      const spans: HTMLSpanElement[] = [];
      chars.forEach(ch => {
        const span = document.createElement('span');
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.display = 'inline-block';
        span.style.position = 'relative';
        span.className = 'font-syne font-bold text-sm text-kinetic-text';
        container.appendChild(span);
        spans.push(span);
      });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.delayedCall(1.5, runCycle);
        },
      });
      tlRef.current = tl;

      // Shatter
      tl.to(spans, {
        x: () => gsap.utils.random(-150, 150),
        y: () => gsap.utils.random(-150, 150),
        rotation: () => gsap.utils.random(-180, 180),
        opacity: 0,
        scale: 0,
        stagger: 0.02,
        duration: 0.6,
        ease: 'power2.in',
      });

      // Reassemble
      tl.to(spans, {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.03,
        duration: 0.8,
        ease: 'elastic.out(1,0.5)',
      }, '+=0.1');
    };

    runCycle();

    return () => {
      tlRef.current?.kill();
      gsap.killTweensOf(container.children);
    };
  }, []);

  return (
    <div
      className="relative overflow-visible px-6 py-3 rounded-md cursor-pointer inline-flex items-center justify-center"
      style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', minWidth: 140, minHeight: 44 }}
    >
      <div ref={containerRef} className="whitespace-nowrap" />
    </div>
  );
};

export default ShatterButton;

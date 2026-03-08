import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const lines = [
  { text: 'Initializing components...', color: '#505050' },
  { text: 'Loading animations...', color: '#505050' },
  { text: 'Mounting GSAP plugins...', color: '#505050' },
  { text: 'Ready. ✓', color: '#22c55e' },
];

const TextProgressLoader = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const run = () => {
      container.innerHTML = '';
      const tl = gsap.timeline({ onComplete: () => gsap.delayedCall(1.5, run) });
      tlRef.current = tl;

      lines.forEach((line) => {
        const div = document.createElement('div');
        div.className = 'font-mono text-xs leading-relaxed';
        div.style.color = line.color;
        div.style.minHeight = '1.4em';
        container.appendChild(div);

        const chars = line.text.split('');
        chars.forEach((ch, ci) => {
          tl.call(() => { div.textContent = line.text.slice(0, ci + 1) + '|'; }, [], `+=${0.04}`);
        });
        tl.call(() => { div.textContent = line.text; });
        tl.to({}, { duration: 0.3 });
      });

      // Pause then fade out
      tl.to({}, { duration: 1.5 });
      tl.to(container.children, { opacity: 0, duration: 0.4, stagger: 0.05 });
    };

    run();
    return () => { tlRef.current?.kill(); };
  }, []);

  return <div ref={containerRef} className="flex flex-col gap-1" style={{ minWidth: 240 }} />;
};

export default TextProgressLoader;

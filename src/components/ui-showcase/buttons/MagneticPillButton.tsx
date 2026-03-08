import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const MagneticPillButton = () => {
  const btnRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const qx = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const qy = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const qtx = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const qty = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    if (!btnRef.current || !textRef.current) return;
    qx.current = gsap.quickTo(btnRef.current, 'x', { duration: 0.3, ease: 'power2.out' });
    qy.current = gsap.quickTo(btnRef.current, 'y', { duration: 0.3, ease: 'power2.out' });
    qtx.current = gsap.quickTo(textRef.current, 'x', { duration: 0.5, ease: 'power2.out' });
    qty.current = gsap.quickTo(textRef.current, 'y', { duration: 0.5, ease: 'power2.out' });
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const rect = btnRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      const factor = (1 - dist / 100) * 18;
      const nx = (dx / dist) * factor;
      const ny = (dy / dist) * factor;
      qx.current?.(nx);
      qy.current?.(ny);
      qtx.current?.(nx * 0.5);
      qty.current?.(ny * 0.5);
    }
  };

  const onLeave = () => {
    gsap.to(btnRef.current, { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1,0.4)' });
    gsap.to(textRef.current, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,0.4)' });
    if (btnRef.current) {
      btnRef.current.style.boxShadow = 'none';
      btnRef.current.style.background = '#7c3aed';
    }
  };

  const onEnter = () => {
    gsap.to(btnRef.current, { scale: 1.05, duration: 0.3 });
    if (btnRef.current) {
      btnRef.current.style.boxShadow = '0 0 50px rgba(124,58,237,0.4)';
      btnRef.current.style.background = '#8b47ff';
    }
  };

  return (
    <div onMouseMove={onMove} onMouseLeave={onLeave} className="flex items-center justify-center py-8" style={{ minHeight: 120 }}>
      <div
        ref={btnRef}
        onMouseEnter={onEnter}
        className="font-syne font-bold text-base px-10 py-4 rounded-full text-white cursor-pointer select-none"
        style={{ background: '#7c3aed' }}
      >
        <span ref={textRef} className="inline-block">Let's Build →</span>
      </div>
    </div>
  );
};

export default MagneticPillButton;

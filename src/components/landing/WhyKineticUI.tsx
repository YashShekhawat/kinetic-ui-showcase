import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useScrollReveal, useScrollRevealChildren } from '@/hooks/useScrollReveal';

const rows = [
  { left: '❌ Framer Motion required', right: '✓ Pure GSAP only' },
  { left: '❌ Next.js / framework lock-in', right: '✓ Any React project' },
  { left: '❌ 5+ install steps', right: '✓ npm install gsap. Done.' },
  { left: '❌ Complex configuration', right: '✓ Zero config, copy paste' },
  { left: '❌ Subscription pricing', right: '✓ Free components forever' },
  { left: '❌ Opinionated styling', right: '✓ Bring your own styles' },
];

const WhyKineticUI = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  // Reveal heading with clip-path using IntersectionObserver
  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    gsap.set(el, { clipPath: 'inset(0 100% 0 0)' });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(el, { clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power4.out' });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    const safety = setTimeout(() => { gsap.set(el, { clipPath: 'inset(0 0% 0 0)' }); }, 4000);
    return () => { observer.disconnect(); clearTimeout(safety); };
  }, []);

  // Reveal border
  useEffect(() => {
    const el = borderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(el, { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: 'power2.out' });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Reveal rows
  useScrollRevealChildren(containerRef, '.compare-row', { x: -20, y: 0, stagger: 0.08 });

  // Flash right cells after they appear
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rightCell = (entry.target as HTMLElement).querySelector('.compare-right') as HTMLElement;
            if (rightCell) {
              setTimeout(() => {
                gsap.fromTo(rightCell,
                  { background: 'rgba(124,58,237,0.15)' },
                  { background: 'rgba(21,21,32,1)', duration: 0.8, ease: 'power2.out' }
                );
              }, 300);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    container.querySelectorAll('.compare-row').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className="py-16 md:py-24 px-5 md:px-10" style={{ background: '#13131e' }}>
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center md:text-left">
          <span className="inline-block font-mono text-[11px] tracking-[0.15em] uppercase mb-3 px-3 py-1 rounded"
            style={{ color: '#c4b5fd', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            WHY KINETIC UI
          </span>
          <h2 ref={headingRef} className="font-syne font-extrabold mb-12" style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)', color: '#f0ede8' }}>
            Built different.
          </h2>
        </div>

        <div className="mt-12">
          <div className="flex" style={{ borderBottom: '1px solid #1a1a2a' }}>
            <div className="flex-1 px-3 md:px-5 py-2.5 md:py-3 font-mono text-[11px]" style={{ color: '#404050' }}>Others</div>
            <div className="flex-1 px-3 md:px-5 py-2.5 md:py-3 font-mono text-[11px] relative" style={{ color: '#7c3aed' }}>
              <div
                ref={borderRef}
                style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: 2,
                  background: '#7c3aed', transformOrigin: 'top', transform: 'scaleY(0)',
                }}
              />
              Kinetic UI
            </div>
          </div>

          {rows.map((row, i) => (
            <div key={i} className="compare-row flex" style={{ borderBottom: '1px solid #1a1a2a' }}>
              <div className="flex-1 px-3 md:px-5 py-2.5 md:py-3.5 font-inter font-light text-[11px] md:text-[13px]" style={{ color: '#404050', background: '#111119' }}>
                {row.left}
              </div>
              <div className="compare-right flex-1 px-3 md:px-5 py-2.5 md:py-3.5 font-inter text-[11px] md:text-[13px]" style={{ color: '#f0ede8', background: '#151520' }}>
                {row.right}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 font-inter font-light text-[13px]" style={{ color: '#686878' }}>
          No opinionated design system. No framework requirements. Just GSAP + React.
        </p>
      </div>
    </section>
  );
};

export default WhyKineticUI;

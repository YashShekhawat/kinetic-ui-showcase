import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(headingRef.current, { clipPath: 'inset(0 100% 0 0)' }, {
          clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power4.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true },
        });
      }
      gsap.utils.toArray<HTMLElement>('.compare-row').forEach((row, i) => {
        gsap.fromTo(row, { opacity: 0, x: -20 }, {
          opacity: 1, x: 0, duration: 0.5, delay: i * 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: row, start: 'top 85%', once: true },
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-16 md:py-24 px-5 md:px-10" style={{ background: '#0a0a12' }}>
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center md:text-left">
          <span className="inline-block font-mono text-[11px] tracking-[0.15em] uppercase mb-3 px-3 py-1 rounded"
            style={{ color: '#a78bfa', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}>
            WHY KINETIC UI
          </span>
          <h2 ref={headingRef} className="font-syne font-extrabold mb-12" style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)', color: '#ededed' }}>
            Built different.
          </h2>
        </div>

        {/* Table */}
        <div className="mt-12">
          {/* Header */}
          <div className="flex" style={{ borderBottom: '1px solid #1a1a2e' }}>
            <div className="flex-1 px-3 md:px-5 py-2.5 md:py-3 font-mono text-[11px]" style={{ color: '#303040' }}>Others</div>
            <div className="flex-1 px-3 md:px-5 py-2.5 md:py-3 font-mono text-[11px]" style={{ color: '#7c3aed' }}>Kinetic UI</div>
          </div>

          {rows.map((row, i) => (
            <div key={i} className="compare-row flex opacity-0" style={{ borderBottom: '1px solid #1a1a2e' }}>
              <div className="flex-1 px-3 md:px-5 py-2.5 md:py-3.5 font-inter font-light text-[11px] md:text-[13px]" style={{ color: '#404050', background: '#080810' }}>
                {row.left}
              </div>
              <div className="flex-1 px-3 md:px-5 py-2.5 md:py-3.5 font-inter text-[11px] md:text-[13px]" style={{ color: '#ededed', background: '#0d0d16' }}>
                {row.right}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 font-inter font-light text-[13px]" style={{ color: '#404050' }}>
          No opinionated design system. No framework requirements. Just GSAP + React.
        </p>
      </div>
    </section>
  );
};

export default WhyKineticUI;

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

const features = [
  { num: '01', title: 'Lightweight Animations', tag: 'GSAP' },
  { num: '02', title: 'Copy Paste Ready', tag: 'React' },
  { num: '03', title: 'Zero Configuration', tag: 'Plug & Play' },
  { num: '04', title: 'Fully Customizable', tag: 'Open Source' },
  { num: '05', title: 'Mobile Responsive', tag: 'All Devices' },
  { num: '06', title: 'Clean Code Output', tag: 'Documented' },
];

const FeatureListReveal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const rowsRef = useRef<HTMLDivElement[]>([]);
  const linesRef = useRef<HTMLDivElement[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) gsap.fromTo(headingRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'power4.out' });
      if (descRef.current) gsap.fromTo(descRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: 'power2.out' });
      rowsRef.current.forEach((row, i) => {
        if (!row) return;
        gsap.fromTo(row, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.5, delay: 0.4 + i * 0.08, ease: 'power2.out' });
      });
      linesRef.current.forEach((line, i) => {
        if (!line) return;
        gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.5, delay: 0.4 + i * 0.08, ease: 'power2.out', transformOrigin: 'left center' });
      });
      if (footerRef.current) gsap.fromTo(footerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 1, ease: 'power2.out' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleRowEnter = (i: number) => {
    const row = rowsRef.current[i];
    if (!row) return;
    const wipe = row.querySelector<HTMLElement>('.fl-wipe');
    const title = row.querySelector<HTMLElement>('.fl-title');
    const num = row.querySelector<HTMLElement>('.fl-num');
    const tag = row.querySelector<HTMLElement>('.fl-tag');
    if (wipe) gsap.to(wipe, { scaleX: 1, duration: 0.3, ease: 'power2.out', transformOrigin: 'left center' });
    if (title) { gsap.to(title, { x: 10, duration: 0.3, ease: 'power2.out' }); gsap.to(title, { color: '#a78bfa', duration: 0.2 }); }
    if (num) gsap.to(num, { color: '#7c3aed', duration: 0.2 });
    if (tag) gsap.to(tag, { opacity: 1, duration: 0.2 });
  };
  const handleRowLeave = (i: number) => {
    const row = rowsRef.current[i];
    if (!row) return;
    const wipe = row.querySelector<HTMLElement>('.fl-wipe');
    const title = row.querySelector<HTMLElement>('.fl-title');
    const num = row.querySelector<HTMLElement>('.fl-num');
    const tag = row.querySelector<HTMLElement>('.fl-tag');
    if (wipe) gsap.to(wipe, { scaleX: 0, duration: 0.25, ease: 'power2.out', transformOrigin: 'right center' });
    if (title) { gsap.to(title, { x: 0, duration: 0.3, ease: 'power2.out' }); gsap.to(title, { color: '#ededed', duration: 0.2 }); }
    if (num) gsap.to(num, { color: '#303040', duration: 0.2 });
    if (tag) gsap.to(tag, { opacity: 0.4, duration: 0.2 });
  };

  const handlePillEnter = () => { if (pillRef.current) gsap.to(pillRef.current, { scale: 1.03, duration: 0.2 }); };
  const handlePillLeave = () => { if (pillRef.current) gsap.to(pillRef.current, { scale: 1, duration: 0.2 }); };

  return (
    <div ref={containerRef} className="w-full" style={{ background: '#0a0a12', padding: isMobile ? '48px 20px' : '48px 40px', minHeight: 480, pointerEvents: 'none' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Section Header */}
        <div className="flex justify-between items-end" style={{ marginBottom: 48 }}>
          <div>
            <span className="font-mono block" style={{ fontSize: 10, color: '#a78bfa', letterSpacing: '0.2em', marginBottom: 12 }}>FEATURES</span>
            <div className="overflow-hidden">
              <div ref={headingRef}>
                <h2 className="font-syne font-extrabold" style={{ fontSize: isMobile ? 'clamp(1.2rem, 5vw, 1.6rem)' : '2.8rem', color: '#ededed', lineHeight: 1.1 }}>
                  What you get.
                </h2>
              </div>
            </div>
          </div>
          {!isMobile && (
            <p ref={descRef} className="font-inter font-light opacity-0" style={{ fontSize: 13, color: '#606070', lineHeight: 1.7, maxWidth: 240, textAlign: 'right' }}>
              Every component ships with clean code, full documentation, and zero extra dependencies.
            </p>
          )}
        </div>

        {/* Feature Rows */}
        <div>
          {features.map((f, i) => (
            <div
              key={i}
              ref={el => { if (el) rowsRef.current[i] = el; }}
              className="relative opacity-0 cursor-default"
              style={{ padding: isMobile ? '14px 0' : '20px 0', overflow: 'hidden' }}
              onMouseEnter={() => handleRowEnter(i)}
              onMouseLeave={() => handleRowLeave(i)}
            >
              <div
                ref={el => { if (el) linesRef.current[i] = el; }}
                className="absolute top-0 left-0 w-full"
                style={{ height: 1, background: '#1a1a2e', transformOrigin: 'left center', transform: 'scaleX(0)' }}
              />
              <div className="fl-wipe absolute inset-0" style={{ background: '#13131e', zIndex: 0, transform: 'scaleX(0)', transformOrigin: 'left center' }} />
              <div className="relative flex items-center" style={{ zIndex: 1 }}>
                <span className="fl-num font-mono" style={{ width: isMobile ? '10%' : '8%', fontSize: isMobile ? '0.7rem' : 11, color: '#303040' }}>{f.num}</span>
                <span className="fl-title font-syne font-semibold" style={{ width: isMobile ? '90%' : '62%', fontSize: isMobile ? '0.85rem' : '1.15rem', color: '#ededed' }}>{f.title}</span>
                {!isMobile && (
                  <span className="fl-tag font-mono" style={{ width: '30%', fontSize: 11, color: '#505060', textAlign: 'right', opacity: 0.4 }}>{f.tag}</span>
                )}
              </div>
              {i === features.length - 1 && (
                <div
                  ref={el => { if (el) linesRef.current[features.length] = el; }}
                  className="absolute bottom-0 left-0 w-full"
                  style={{ height: 1, background: '#1a1a2e', transformOrigin: 'left center', transform: 'scaleX(0)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div ref={footerRef} className="flex justify-between items-center opacity-0" style={{ marginTop: 32 }}>
          <span className="font-mono" style={{ fontSize: isMobile ? '0.7rem' : 11, color: '#303040' }}>6 components included</span>
          <button
            ref={pillRef}
            className="font-mono cursor-pointer"
            style={{ fontSize: isMobile ? '0.7rem' : 11, color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.06)', padding: '6px 16px', borderRadius: 4, pointerEvents: 'auto' }}
            onMouseEnter={handlePillEnter}
            onMouseLeave={handlePillLeave}
          >
            View All →
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureListReveal;

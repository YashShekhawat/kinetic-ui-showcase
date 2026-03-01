import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import MarqueeStatementSection from '../ui-showcase/MarqueeStatementSection';
import FeatureListReveal from '../ui-showcase/FeatureListReveal';
import CinematicTextImageReveal from '../ui-showcase/CinematicTextImageReveal';

const sectionComponents = [
  {
    name: 'Marquee Statement Section',
    component: <MarqueeStatementSection />,
    fullBleed: true,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const marqueeLines = [
  { text: 'PRECISION · MOTION · DETAIL · ', speed: 35, direction: -1, style: 'filled' as const },
  { text: 'CRAFT · INTENTION · FLOW · ', speed: 28, direction: 1, style: 'outline' as const },
  { text: 'BUILD · DESIGN · SHIP · ', speed: 45, direction: -1, style: 'accent' as const },
];

const MarqueeStatementSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingLinesRef = useRef<HTMLDivElement[]>([]);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const marqueeTweens = useRef<gsap.core.Tween[]>([]);
  const hrRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      headingLinesRef.current.forEach((line, i) => {
        if (line) {
          gsap.fromTo(line, { yPercent: 100 }, {
            yPercent: 0, duration: 0.8, delay: i * 0.1, ease: 'power4.out',
          });
        }
      });
      if (bodyRef.current) {
        gsap.fromTo(bodyRef.current, { opacity: 0, y: 10 }, {
          opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: 'power2.out',
        });
      }
      hrRefs.current.forEach((hr, i) => {
        if (hr) {
          gsap.fromTo(hr, { scaleX: 0 }, {
            scaleX: 1, duration: 0.8, delay: 0.2 + i * 0.15, ease: 'power2.out',
            transformOrigin: 'left center',
          });
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const rows = containerRef.current?.querySelectorAll<HTMLDivElement>('.mq-row');
    if (!rows) return;
    rows.forEach((row, i) => {
      const inner = row.querySelector<HTMLDivElement>('.mq-inner');
      if (!inner) return;
      inner.innerHTML += inner.innerHTML;
      const dir = marqueeLines[i].direction;
      const speed = marqueeLines[i].speed;
      const tween = gsap.to(inner, {
        xPercent: dir === -1 ? -50 : 0,
        duration: speed, repeat: -1, ease: 'none',
      });
      if (dir === 1) {
        gsap.set(inner, { xPercent: -50 });
        tween.vars.xPercent = 0;
        tween.invalidate().restart();
      }
      marqueeTweens.current[i] = tween;
      row.addEventListener('mouseenter', () => gsap.to(tween, { timeScale: 0.3, duration: 0.6 }));
      row.addEventListener('mouseleave', () => gsap.to(tween, { timeScale: 1, duration: 0.6 }));
    });
    return () => marqueeTweens.current.forEach(t => t?.kill());
  }, []);

  const getLineStyle = (style: 'filled' | 'outline' | 'accent'): React.CSSProperties => {
    if (style === 'outline') return { WebkitTextStroke: '1px #333344', color: 'transparent' };
    if (style === 'accent') return { color: '#7c3aed', opacity: 0.4 };
    return { color: '#ededed' };
  };

  return (
    <div ref={containerRef} className="w-full flex" style={{ background: '#0a0a12', minHeight: 480 }}>
      {/* Left: sticky text column */}
      <div className="w-[35%] px-10 flex flex-col justify-center" style={{ position: 'sticky', top: '40%', alignSelf: 'flex-start' }}>
        <span className="font-mono text-[10px] px-3 py-1 rounded mb-6 inline-block"
          style={{ color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)', width: 'fit-content' }}>ABOUT</span>
        <div className="mb-5">
          {['We obsess over', 'the details.'].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <div ref={el => { if (el) headingLinesRef.current[i] = el; }}>
                <span className="font-syne font-extrabold block" style={{ fontSize: '2.2rem', color: '#ededed', lineHeight: 1.1 }}>{line}</span>
              </div>
            </div>
          ))}
        </div>
        <p ref={bodyRef} className="font-inter font-light text-sm opacity-0" style={{ color: '#606070', lineHeight: 1.8, maxWidth: 260 }}>
          From micro-interactions to full page transitions — every detail is considered, nothing is accidental.
        </p>
        <a href="#" className="font-mono text-[13px] mt-8 inline-block relative group" style={{ color: '#a78bfa', width: 'fit-content' }}
          onMouseEnter={e => gsap.to(e.currentTarget, { letterSpacing: '0.05em', duration: 0.3 })}
          onMouseLeave={e => gsap.to(e.currentTarget, { letterSpacing: '0em', duration: 0.3 })}>
          Learn more →
          <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" style={{ background: '#a78bfa' }} />
        </a>
      </div>
      {/* Right: marquees */}
      <div className="w-[65%] flex flex-col justify-center py-10">
        {marqueeLines.map((line, i) => (
          <div key={i}>
            {i > 0 && <div ref={el => { if (el) hrRefs.current[i-1] = el; }} className="w-full h-px" style={{ background: '#1a1a2e', transform: 'scaleX(0)' }} />}
            <div className="mq-row overflow-hidden" style={{ padding: '12px 0' }}>
              <div className="mq-inner flex w-max whitespace-nowrap">
                <span className="font-syne font-extrabold mr-2" style={{ fontSize: '5.5vw', ...getLineStyle(line.style), lineHeight: 1.1 }}>{line.text}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeStatementSection;`,
  },
  {
    name: 'Feature List Reveal',
    component: <FeatureListReveal />,
    fullBleed: true,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(headingRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'power4.out' });
      }
      if (descRef.current) {
        gsap.fromTo(descRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: 'power2.out' });
      }
      rowsRef.current.forEach((row, i) => {
        if (!row) return;
        gsap.fromTo(row, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.5, delay: 0.4 + i * 0.08, ease: 'power2.out' });
      });
      linesRef.current.forEach((line, i) => {
        if (!line) return;
        gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.5, delay: 0.4 + i * 0.08, ease: 'power2.out', transformOrigin: 'left center' });
      });
      if (footerRef.current) {
        gsap.fromTo(footerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 1, ease: 'power2.out' });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleRowEnter = (i: number) => {
    const row = rowsRef.current[i]; if (!row) return;
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
    const row = rowsRef.current[i]; if (!row) return;
    const wipe = row.querySelector<HTMLElement>('.fl-wipe');
    const title = row.querySelector<HTMLElement>('.fl-title');
    const num = row.querySelector<HTMLElement>('.fl-num');
    const tag = row.querySelector<HTMLElement>('.fl-tag');
    if (wipe) gsap.to(wipe, { scaleX: 0, duration: 0.25, ease: 'power2.out', transformOrigin: 'right center' });
    if (title) { gsap.to(title, { x: 0, duration: 0.3 }); gsap.to(title, { color: '#ededed', duration: 0.2 }); }
    if (num) gsap.to(num, { color: '#303040', duration: 0.2 });
    if (tag) gsap.to(tag, { opacity: 0.4, duration: 0.2 });
  };

  return (
    <div ref={containerRef} className="w-full" style={{ background: '#0a0a12', padding: '48px 40px', minHeight: 480 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="flex justify-between items-end" style={{ marginBottom: 48 }}>
          <div>
            <span className="font-mono block" style={{ fontSize: 10, color: '#a78bfa', letterSpacing: '0.2em', marginBottom: 12 }}>FEATURES</span>
            <div className="overflow-hidden">
              <div ref={headingRef}>
                <h2 className="font-syne font-extrabold" style={{ fontSize: '2.8rem', color: '#ededed', lineHeight: 1.1 }}>What you get.</h2>
              </div>
            </div>
          </div>
          <p ref={descRef} className="font-inter font-light opacity-0" style={{ fontSize: 13, color: '#606070', lineHeight: 1.7, maxWidth: 240, textAlign: 'right' }}>
            Every component ships with clean code, full documentation, and zero extra dependencies.
          </p>
        </div>
        <div>
          {features.map((f, i) => (
            <div key={i} ref={el => { if (el) rowsRef.current[i] = el; }} className="relative opacity-0 cursor-default" style={{ padding: '20px 0', overflow: 'hidden' }}
              onMouseEnter={() => handleRowEnter(i)} onMouseLeave={() => handleRowLeave(i)}>
              <div ref={el => { if (el) linesRef.current[i] = el; }} className="absolute top-0 left-0 w-full" style={{ height: 1, background: '#1a1a2e', transformOrigin: 'left center', transform: 'scaleX(0)' }} />
              <div className="fl-wipe absolute inset-0" style={{ background: '#13131e', zIndex: 0, transform: 'scaleX(0)', transformOrigin: 'left center' }} />
              <div className="relative flex items-center" style={{ zIndex: 1 }}>
                <span className="fl-num font-mono" style={{ width: '8%', fontSize: 11, color: '#303040' }}>{f.num}</span>
                <span className="fl-title font-syne font-semibold" style={{ width: '62%', fontSize: '1.15rem', color: '#ededed' }}>{f.title}</span>
                <span className="fl-tag font-mono" style={{ width: '30%', fontSize: 11, color: '#505060', textAlign: 'right', opacity: 0.4 }}>{f.tag}</span>
              </div>
              {i === features.length - 1 && (
                <div ref={el => { if (el) linesRef.current[features.length] = el; }} className="absolute bottom-0 left-0 w-full" style={{ height: 1, background: '#1a1a2e', transformOrigin: 'left center', transform: 'scaleX(0)' }} />
              )}
            </div>
          ))}
        </div>
        <div ref={footerRef} className="flex justify-between items-center opacity-0" style={{ marginTop: 32 }}>
          <span className="font-mono" style={{ fontSize: 11, color: '#303040' }}>6 components included</span>
          <button ref={pillRef} className="font-mono cursor-pointer" style={{ fontSize: 11, color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.06)', padding: '6px 16px', borderRadius: 4 }}
            onMouseEnter={() => { if (pillRef.current) gsap.to(pillRef.current, { scale: 1.03, duration: 0.2 }); }}
            onMouseLeave={() => { if (pillRef.current) gsap.to(pillRef.current, { scale: 1, duration: 0.2 }); }}>View All →</button>
        </div>
      </div>
    </div>
  );
};

export default FeatureListReveal;`,
  },
  {
    name: 'Cinematic Text + Image Reveal',
    component: <CinematicTextImageReveal />,
    fullBleed: true,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CinematicTextImageReveal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headingLinesRef = useRef<HTMLDivElement[]>([]);
  const metaRef = useRef<HTMLDivElement>(null);
  const tickRefs = useRef<HTMLDivElement[]>([]);
  const innerBoxRef = useRef<HTMLDivElement>(null);
  const bgNumRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(dividerRef.current, { height: '0%' }, { height: '100%', duration: 0.8, ease: 'power2.out' }, 0);
      tl.to(leftCurtainRef.current, { clipPath: 'inset(0 100% 0 0)', duration: 0.9, ease: 'expo.inOut' }, 0.3);
      tl.to(rightCurtainRef.current, { clipPath: 'inset(0 0 0 100%)', duration: 0.9, ease: 'expo.inOut' }, 0.3);
      tl.fromTo(eyebrowRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.9);
      headingLinesRef.current.forEach((line, i) => {
        if (line) tl.fromTo(line, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'power4.out' }, 1.0 + i * 0.1);
      });
      tickRefs.current.forEach((tick, i) => {
        if (tick) tl.fromTo(tick, { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' }, 1.1 + i * 0.05);
      });
      tl.fromTo(metaRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.5);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleRightEnter = () => {
    if (innerBoxRef.current) gsap.to(innerBoxRef.current, { scale: 1.03, duration: 0.4 });
    tickRefs.current.forEach(t => { if (t) gsap.to(t, { borderColor: '#a78bfa', duration: 0.3 }); });
    if (bgNumRef.current) gsap.to(bgNumRef.current, { opacity: 0.12, duration: 0.4 });
  };
  const handleRightLeave = () => {
    if (innerBoxRef.current) gsap.to(innerBoxRef.current, { scale: 1, duration: 0.4 });
    tickRefs.current.forEach(t => { if (t) gsap.to(t, { borderColor: '#7c3aed', duration: 0.3 }); });
    if (bgNumRef.current) gsap.to(bgNumRef.current, { opacity: 0.06, duration: 0.4 });
  };

  const tickStyle = (c: string): React.CSSProperties => {
    const base: React.CSSProperties = { position: 'absolute', width: 16, height: 16, borderColor: '#7c3aed', borderStyle: 'solid', borderWidth: 0 };
    if (c === 'tl') return { ...base, top: -1, left: -1, borderTopWidth: 1, borderLeftWidth: 1 };
    if (c === 'tr') return { ...base, top: -1, right: -1, borderTopWidth: 1, borderRightWidth: 1 };
    if (c === 'bl') return { ...base, bottom: -1, left: -1, borderBottomWidth: 1, borderLeftWidth: 1 };
    return { ...base, bottom: -1, right: -1, borderBottomWidth: 1, borderRightWidth: 1 };
  };

  return (
    <div ref={containerRef} className="w-full" style={{ minHeight: 480 }}>
      <div className="relative flex" style={{ minHeight: 420 }}>
        {/* Left half */}
        <div className="w-1/2 relative overflow-hidden" style={{ background: '#0a0a12', padding: '60px 48px' }}>
          <div ref={leftCurtainRef} className="absolute inset-0 z-10" style={{ background: '#060608', clipPath: 'inset(0 0 0 0)' }} />
          <div className="relative z-0 flex flex-col justify-center h-full">
            <span ref={eyebrowRef} className="font-mono text-[10px] opacity-0 mb-6" style={{ color: '#a78bfa', letterSpacing: '0.2em' }}>PROJECT SHOWCASE</span>
            <div className="space-y-1">
              {[
                { text: 'The art', style: { fontSize: '4rem', color: '#ededed' } },
                { text: 'of building', style: { fontSize: '4rem', color: '#606070' } },
                { text: 'different.', style: { fontSize: '4rem', color: 'transparent', WebkitTextStroke: '1px #7c3aed' } },
              ].map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <div ref={el => { if (el) headingLinesRef.current[i] = el; }}>
                    <span className="font-syne font-extrabold block" style={{ ...line.style, lineHeight: 1.15 }}>{line.text}</span>
                  </div>
                </div>
              ))}
            </div>
            <div ref={metaRef} className="flex items-center gap-4 mt-10 opacity-0">
              <span className="font-mono text-xs" style={{ color: '#404050' }}>2024</span>
              <div className="w-px h-3" style={{ background: '#252535' }} />
              <span className="font-mono text-xs" style={{ color: '#404050' }}>Brand Identity + Web</span>
            </div>
          </div>
        </div>
        {/* Center divider */}
        <div ref={dividerRef} className="absolute left-1/2 top-0 w-px z-20" style={{ height: '0%', background: 'linear-gradient(to bottom, transparent, #252535, transparent)' }} />
        {/* Right half */}
        <div className="w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0f1f, #1a1228 40%, #0d0d18)' }} onMouseEnter={handleRightEnter} onMouseLeave={handleRightLeave}>
          <div ref={rightCurtainRef} className="absolute inset-0 z-10" style={{ background: '#060608', clipPath: 'inset(0 0 0 0)' }} />
          <div className="relative z-0 flex items-center justify-center h-full" style={{ minHeight: 420 }}>
            <span ref={bgNumRef} className="absolute font-syne font-extrabold pointer-events-none select-none" style={{ fontSize: '12rem', color: 'rgba(124,58,237,0.06)', bottom: 10, right: 20, lineHeight: 1 }}>01</span>
            <div ref={innerBoxRef} className="relative" style={{ width: '80%', height: '60%', minHeight: 240, border: '1px solid #252535' }}>
              {['tl','tr','bl','br'].map((corner, i) => (
                <div key={corner} ref={el => { if (el) tickRefs.current[i] = el; }} style={tickStyle(corner)} />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-syne font-extrabold text-2xl" style={{ color: '#1a1a2e' }}>VISUAL</span>
              </div>
            </div>
            <span className="absolute bottom-6 left-8 font-mono text-[11px] cursor-pointer" style={{ color: '#505060' }}
              onMouseEnter={e => gsap.to(e.currentTarget, { color: '#a78bfa', x: 4, y: -4, duration: 0.25 })}
              onMouseLeave={e => gsap.to(e.currentTarget, { color: '#505060', x: 0, y: 0, duration: 0.25 })}>
              ↗ View Case Study
            </span>
          </div>
        </div>
      </div>
      {/* Bottom strip */}
      <div className="w-full flex items-center justify-between px-12 py-4" style={{ background: '#0d0d14', borderTop: '1px solid #1a1a2e' }}>
        <span className="font-mono text-[10px]" style={{ color: '#303040' }}>KINETIC UI — SECTION COMPONENT</span>
        <span className="font-mono text-[10px] cursor-pointer" style={{ color: '#505060' }}
          onMouseEnter={e => gsap.to(e.currentTarget, { color: '#a78bfa', duration: 0.2 })}
          onMouseLeave={e => gsap.to(e.currentTarget, { color: '#505060', duration: 0.2 })}>Copy Code →</span>
      </div>
    </div>
  );
};

export default CinematicTextImageReveal;`,
  },
];

const SectionsSection = () => (
  <section id="sections" className="py-24">
    <SectionHeader label="SECTIONS" heading="Full Section Layouts" />
    <div className="grid grid-cols-1 gap-6">
      {sectionComponents.map(c => (
        <ComponentCard key={c.name} name={c.name} code={c.code} category="sections" fullBleed={c.fullBleed}>
          {c.component}
        </ComponentCard>
      ))}
    </div>
  </section>
);

export default SectionsSection;

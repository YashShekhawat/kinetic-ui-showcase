import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import MarqueeStatementSection from '../ui-showcase/MarqueeStatementSection';
import BentoGridSection from '../ui-showcase/BentoGridSection';
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
    name: 'Bento Grid Section',
    component: <BentoGridSection />,
    fullBleed: true,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const BentoGridSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const cellRefs = useRef<HTMLDivElement[]>([]);
  const fpsRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const codeLineRefs = useRef<HTMLDivElement[]>([]);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const checkRefs = useRef<HTMLSpanElement[]>([]);
  const statNumRefs = useRef<HTMLSpanElement[]>([]);
  const pulseRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(headingRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'power4.out' });
      }
      if (subtextRef.current) {
        gsap.fromTo(subtextRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: 'power2.out' });
      }
      const order = [0, 2, 3, 4, 1, 5];
      order.forEach((ci, i) => {
        const cell = cellRefs.current[ci];
        if (cell) {
          gsap.fromTo(cell, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.5, delay: 0.3 + i * 0.07, ease: 'power2.out',
          });
        }
      });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
      codeLineRefs.current.forEach((line, i) => {
        if (line) tl.fromTo(line, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.3 }, 0.8 + i * 0.15);
      });
      tl.to(codeLineRefs.current.filter(Boolean), { opacity: 0, duration: 0.3 }, '+=2');
      if (cursorRef.current) gsap.to(cursorRef.current, { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: 'power2.inOut' });
      if (pathRef.current) {
        const len = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(pathRef.current, { strokeDashoffset: 0, duration: 2, ease: 'none', repeat: -1, repeatDelay: 0.5 });
      }
      if (dotRef.current && pathRef.current) {
        const path = pathRef.current;
        const len = path.getTotalLength();
        gsap.to({ t: 0 }, { t: 1, duration: 2, ease: 'none', repeat: -1, repeatDelay: 0.5,
          onUpdate() { const pt = path.getPointAtLength(this.targets()[0].t * len); gsap.set(dotRef.current, { attr: { cx: pt.x, cy: pt.y } }); },
        });
      }
      checkRefs.current.forEach((el, i) => { if (el) gsap.fromTo(el, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.4, delay: 1 + i * 0.1, ease: 'power2.out' }); });
      if (fpsRef.current) gsap.fromTo(fpsRef.current, { textContent: '0' }, { textContent: '60', duration: 1.5, delay: 0.6, ease: 'power2.out', snap: { textContent: 1 }, onUpdate() { if (fpsRef.current) fpsRef.current.textContent = Math.round(parseFloat(fpsRef.current.textContent || '0')).toString(); } });
      if (barRef.current) gsap.fromTo(barRef.current, { width: '0%' }, { width: '95%', duration: 1.5, delay: 0.6, ease: 'power2.out' });
      if (pulseRef.current) gsap.to(pulseRef.current, { scale: 1.4, opacity: 0.5, duration: 1, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      const vals = [24, 6, 0];
      statNumRefs.current.forEach((el, i) => { if (el) gsap.fromTo(el, { textContent: '0' }, { textContent: String(vals[i]), duration: 1.2, delay: 0.8 + i * 0.1, ease: 'power2.out', snap: { textContent: 1 }, onUpdate() { if (el) { const v = Math.round(parseFloat(el.textContent || '0')); el.textContent = i === 0 ? v + '+' : String(v); } } }); });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleCellEnter = (el: HTMLDivElement) => gsap.to(el, { borderColor: '#252538', y: -2, duration: 0.25, ease: 'power2.out', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' });
  const handleCellLeave = (el: HTMLDivElement) => gsap.to(el, { borderColor: '#1a1a2e', y: 0, duration: 0.2, boxShadow: 'none' });

  return (
    <div ref={containerRef} className="w-full" style={{ background: '#0a0a12', padding: '48px 40px', minHeight: 480 }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <span className="font-mono text-[10px] inline-block px-3 py-1 rounded mb-3" style={{ color: '#a78bfa', letterSpacing: '0.2em', border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.06)' }}>WHY KINETIC</span>
          <div className="overflow-hidden"><div ref={headingRef}><h2 className="font-syne font-extrabold" style={{ fontSize: '2.8rem', color: '#ededed', lineHeight: 1.1 }}>Everything you need.</h2></div></div>
          <p ref={subtextRef} className="font-inter font-light mt-3 opacity-0" style={{ fontSize: 14, color: '#606070' }}>Powerful animation primitives for modern React applications.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {/* Cell A */}
          <div ref={el => { if (el) cellRefs.current[0] = el; }} className="opacity-0" style={{ gridColumn: '1/3', background: '#0d0d16', border: '1px solid #1a1a2e', borderRadius: 8, padding: 28, overflow: 'hidden', position: 'relative', minHeight: 140, display: 'flex', justifyContent: 'space-between', gap: 20 }} onMouseEnter={e => handleCellEnter(e.currentTarget)} onMouseLeave={e => handleCellLeave(e.currentTarget)}>
            <div style={{ flex: '0 0 60%' }}><span className="font-mono text-[10px] block mb-3" style={{ color: '#a78bfa' }}>WORKFLOW</span><h3 className="font-syne font-bold mb-2" style={{ fontSize: '1.4rem', color: '#ededed' }}>Copy. Paste. Ship.</h3><p className="font-inter font-light" style={{ fontSize: 12, color: '#606070', lineHeight: 1.6, maxWidth: 220 }}>Every component is self-contained. No configuration required.</p></div>
            <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><div style={{ background: '#07070e', border: '1px solid #1a1a2e', borderRadius: 6, padding: '12px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.8 }}><div ref={el => { if (el) codeLineRefs.current[0] = el; }} className="opacity-0"><span style={{ color: '#a78bfa' }}>import </span><span style={{ color: '#ededed' }}>{'{ TextReveal }'}</span><span style={{ color: '#606070' }}> from</span></div><div ref={el => { if (el) codeLineRefs.current[1] = el; }} className="opacity-0"><span style={{ color: '#22c55e' }}>'kinetic-ui'</span><span ref={cursorRef} style={{ color: '#a78bfa' }}>|</span></div></div></div>
          </div>
          {/* Cell B */}
          <div ref={el => { if (el) cellRefs.current[1] = el; }} className="opacity-0" style={{ gridColumn: '3/4', gridRow: '1/3', background: '#0d0d16', border: '1px solid #1a1a2e', borderRadius: 8, padding: 28, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(124,58,237,0.06), transparent 70%)' }} onMouseEnter={e => handleCellEnter(e.currentTarget)} onMouseLeave={e => handleCellLeave(e.currentTarget)}>
            <span className="font-mono text-[10px] mb-4" style={{ color: '#a78bfa' }}>ANIMATION ENGINE</span>
            <svg viewBox="0 0 200 100" className="w-full" style={{ height: 100 }}><path ref={pathRef} d="M 10 90 C 40 90, 60 10, 100 10 C 140 10, 160 50, 190 10" fill="none" stroke="#7c3aed" strokeWidth="1.5" /><circle ref={dotRef} cx="10" cy="90" r="3" fill="#a78bfa" /></svg>
            <div className="mt-4"><h3 className="font-syne font-bold mb-1" style={{ fontSize: '1.1rem', color: '#ededed' }}>Industry Standard</h3><p className="font-inter font-light" style={{ fontSize: 11, color: '#606070' }}>Powered by GSAP — used by Apple, Google, and 11M+ developers.</p></div>
          </div>
          {/* Cell C */}
          <div ref={el => { if (el) cellRefs.current[2] = el; }} className="opacity-0" style={{ background: '#0d0d16', border: '1px solid #1a1a2e', borderRadius: 8, padding: 28, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 140 }} onMouseEnter={e => handleCellEnter(e.currentTarget)} onMouseLeave={e => handleCellLeave(e.currentTarget)}>
            <span className="font-mono text-[10px] block mb-3" style={{ color: '#a78bfa' }}>SETUP</span><h3 className="font-syne font-bold mb-2" style={{ fontSize: '1.2rem', color: '#ededed' }}>One install.</h3>
            <div className="flex items-center justify-between cursor-pointer" style={{ background: '#07070e', border: '1px solid #252535', borderRadius: 6, padding: '10px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#ededed' }}><span>npm install gsap</span></div>
            <div className="mt-auto pt-4" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#606070', lineHeight: 1.8 }}>{['GSAP included', 'No Framer Motion', 'Tree shakeable'].map((t, i) => (<span key={i} ref={el => { if (el) checkRefs.current[i] = el; }} className="block opacity-0"><span style={{ color: '#22c55e' }}>✓ </span>{t}</span>))}</div>
          </div>
          {/* Cell D */}
          <div ref={el => { if (el) cellRefs.current[3] = el; }} className="opacity-0" style={{ background: '#0d0d16', border: '1px solid #1a1a2e', borderRadius: 8, padding: 28, overflow: 'hidden', minHeight: 140 }} onMouseEnter={e => handleCellEnter(e.currentTarget)} onMouseLeave={e => handleCellLeave(e.currentTarget)}>
            <span className="font-mono text-[10px] block mb-3" style={{ color: '#a78bfa' }}>PERFORMANCE</span>
            <div className="flex items-baseline"><span ref={fpsRef} className="font-syne font-extrabold" style={{ fontSize: '3.5rem', color: '#ededed' }}>0</span><span className="font-syne ml-1" style={{ fontSize: '1rem', color: '#606070' }}>fps</span></div>
            <div className="mt-3" style={{ width: '100%', height: 4, background: '#1a1a2e', borderRadius: 2 }}><div ref={barRef} style={{ width: '0%', height: '100%', background: 'linear-gradient(to right, #7c3aed, #a78bfa)', borderRadius: 2 }} /></div>
            <span className="font-mono block mt-2" style={{ fontSize: 10, color: '#404050' }}>Hardware accelerated</span>
          </div>
          {/* Cell E */}
          <div ref={el => { if (el) cellRefs.current[4] = el; }} className="opacity-0" style={{ background: '#0d0d16', border: '1px solid #1a1a2e', borderRadius: 8, padding: 28, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 140 }} onMouseEnter={e => handleCellEnter(e.currentTarget)} onMouseLeave={e => handleCellLeave(e.currentTarget)}>
            <span className="font-mono text-[10px] block mb-3" style={{ color: '#a78bfa' }}>LICENSE</span><h3 className="font-syne font-bold mb-2" style={{ fontSize: '1.2rem', color: '#ededed' }}>Free forever.</h3>
            <p className="font-inter font-light" style={{ fontSize: 12, color: '#606070', lineHeight: 1.6 }}>MIT licensed. Use in personal and commercial projects.</p>
            <div className="mt-auto pt-4"><span className="inline-flex items-center gap-2 font-mono text-[10px] px-3 py-1 rounded" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e' }}><span ref={pulseRef} style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />MIT License</span></div>
          </div>
          {/* Cell F */}
          <div ref={el => { if (el) cellRefs.current[5] = el; }} className="opacity-0" style={{ gridColumn: '2/4', background: '#0d0d16', border: '1px solid #1a1a2e', borderRadius: 8, padding: 28, overflow: 'hidden', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 140 }} onMouseEnter={e => handleCellEnter(e.currentTarget)} onMouseLeave={e => handleCellLeave(e.currentTarget)}>
            <div><span className="font-mono text-[10px] block mb-2" style={{ color: '#a78bfa' }}>LIBRARY</span><h3 className="font-syne font-bold mb-1" style={{ fontSize: '1.2rem', color: '#ededed' }}>Growing every week.</h3><p className="font-inter font-light" style={{ fontSize: 12, color: '#606070' }}>New components added regularly. Star us on GitHub.</p></div>
            <div className="flex gap-6">{[{ val: '24+', label: 'Components', color: '#ededed' }, { val: '6', label: 'Categories', color: '#ededed' }, { val: '0', label: 'Dependencies', color: '#22c55e' }].map((s, i) => (<div key={i} className="text-center"><span ref={el => { if (el) statNumRefs.current[i] = el; }} className="font-syne font-extrabold block" style={{ fontSize: '2rem', color: s.color }}>0</span><span className="font-mono block" style={{ fontSize: 10, color: '#505060' }}>{s.label}</span></div>))}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BentoGridSection;`,
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
    <div ref={containerRef} className="w-full" style={{ minHeight: 420 }}>
      <div className="relative flex" style={{ minHeight: 360 }}>
        <div className="w-1/2 relative overflow-hidden" style={{ background: '#0a0a12', padding: '40px 32px' }}>
          <div ref={leftCurtainRef} className="absolute inset-0 z-10" style={{ background: '#060608', clipPath: 'inset(0 0 0 0)' }} />
          <div className="relative z-0 flex flex-col justify-center h-full">
            <span ref={eyebrowRef} className="font-mono text-[10px] opacity-0 mb-6" style={{ color: '#a78bfa', letterSpacing: '0.2em' }}>PROJECT SHOWCASE</span>
            <div className="space-y-1">
              {[
                { text: 'The art', style: { fontSize: '2rem', color: '#ededed' } },
                { text: 'of building', style: { fontSize: '2rem', color: '#606070' } },
                { text: 'different.', style: { fontSize: '2rem', color: 'transparent', WebkitTextStroke: '1px #7c3aed' } },
              ].map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <div ref={el => { if (el) headingLinesRef.current[i] = el; }}>
                    <span className="font-syne font-extrabold block" style={{ ...line.style, lineHeight: 1.2 }}>{line.text}</span>
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
        <div ref={dividerRef} className="absolute left-1/2 top-0 w-px z-20" style={{ height: '0%', background: 'linear-gradient(to bottom, transparent, #252535, transparent)' }} />
        <div className="w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0f1f, #1a1228 40%, #0d0d18)' }} onMouseEnter={handleRightEnter} onMouseLeave={handleRightLeave}>
          <div ref={rightCurtainRef} className="absolute inset-0 z-10" style={{ background: '#060608', clipPath: 'inset(0 0 0 0)' }} />
          <div className="relative z-0 flex items-center justify-center h-full" style={{ minHeight: 360 }}>
            <span ref={bgNumRef} className="absolute font-syne font-extrabold pointer-events-none select-none" style={{ fontSize: '7rem', color: 'rgba(124,58,237,0.06)', bottom: 10, right: 20, lineHeight: 1 }}>01</span>
            <div ref={innerBoxRef} className="relative" style={{ width: '70%', height: '55%', minHeight: 200, border: '1px solid #252535' }}>
              {['tl','tr','bl','br'].map((corner, i) => (<div key={corner} ref={el => { if (el) tickRefs.current[i] = el; }} style={tickStyle(corner)} />))}
              <div className="absolute inset-0 flex items-center justify-center"><span className="font-syne font-extrabold text-base" style={{ color: '#1a1a2e' }}>VISUAL</span></div>
            </div>
            <span className="absolute bottom-6 left-8 font-mono text-[11px] cursor-pointer" style={{ color: '#505060' }}
              onMouseEnter={e => gsap.to(e.currentTarget, { color: '#a78bfa', x: 4, y: -4, duration: 0.25 })}
              onMouseLeave={e => gsap.to(e.currentTarget, { color: '#505060', x: 0, y: 0, duration: 0.25 })}>
              ↗ View Case Study
            </span>
          </div>
        </div>
      </div>
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

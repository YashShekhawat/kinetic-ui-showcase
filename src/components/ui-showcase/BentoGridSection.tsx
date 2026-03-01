import { useEffect, useRef } from 'react';
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
      // Header
      if (headingRef.current) {
        gsap.fromTo(headingRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'power4.out' });
      }
      if (subtextRef.current) {
        gsap.fromTo(subtextRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: 'power2.out' });
      }

      // Cell entrances — order: A(0), C(2), D(3), E(4), B(1), F(5)
      const order = [0, 2, 3, 4, 1, 5];
      order.forEach((ci, i) => {
        const cell = cellRefs.current[ci];
        if (cell) {
          gsap.fromTo(cell, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.5, delay: 0.3 + i * 0.07, ease: 'power2.out',
          });
        }
      });

      // Cell A — code lines loop
      const animateCodeLines = () => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
        codeLineRefs.current.forEach((line, i) => {
          if (line) {
            tl.fromTo(line, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.3 }, 0.8 + i * 0.15);
          }
        });
        tl.to(codeLineRefs.current.filter(Boolean), { opacity: 0, duration: 0.3 }, '+=2');
      };
      animateCodeLines();

      // Cell A — blinking cursor
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: 'power2.inOut' });
      }

      // Cell B — SVG path draw + dot
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(pathRef.current, { strokeDashoffset: 0, duration: 2, ease: 'none', repeat: -1, repeatDelay: 0.5 });
      }
      if (dotRef.current && pathRef.current) {
        const path = pathRef.current;
        const length = path.getTotalLength();
        gsap.to({ t: 0 }, {
          t: 1, duration: 2, ease: 'none', repeat: -1, repeatDelay: 0.5,
          onUpdate: function () {
            const t = this.targets()[0].t;
            const pt = path.getPointAtLength(t * length);
            gsap.set(dotRef.current, { attr: { cx: pt.x, cy: pt.y } });
          },
        });
      }

      // Cell C — check items
      checkRefs.current.forEach((el, i) => {
        if (el) {
          gsap.fromTo(el, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.4, delay: 1 + i * 0.1, ease: 'power2.out' });
        }
      });

      // Cell D — fps counter + bar
      if (fpsRef.current) {
        gsap.fromTo(fpsRef.current, { textContent: '0' }, {
          textContent: '60', duration: 1.5, delay: 0.6, ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate: function () {
            if (fpsRef.current) fpsRef.current.textContent = Math.round(parseFloat(fpsRef.current.textContent || '0')).toString();
          },
        });
      }
      if (barRef.current) {
        gsap.fromTo(barRef.current, { width: '0%' }, { width: '95%', duration: 1.5, delay: 0.6, ease: 'power2.out' });
      }

      // Cell E — pulse
      if (pulseRef.current) {
        gsap.to(pulseRef.current, { scale: 1.4, opacity: 0.5, duration: 1, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      }

      // Cell F — stat counters
      const statValues = [24, 6, 0];
      statNumRefs.current.forEach((el, i) => {
        if (el) {
          gsap.fromTo(el, { textContent: '0' }, {
            textContent: String(statValues[i]), duration: 1.2, delay: 0.8 + i * 0.1, ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function () {
              if (el) {
                const v = Math.round(parseFloat(el.textContent || '0'));
                el.textContent = i === 0 ? v + '+' : String(v);
              }
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleCellEnter = (el: HTMLDivElement) => {
    gsap.to(el, { borderColor: '#252538', y: -2, duration: 0.25, ease: 'power2.out', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' });
  };
  const handleCellLeave = (el: HTMLDivElement) => {
    gsap.to(el, { borderColor: '#1a1a2e', y: 0, duration: 0.2, boxShadow: 'none' });
  };

  return (
    <div ref={containerRef} className="w-full" style={{ background: '#0a0a12', padding: '48px 40px', minHeight: 480 }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <span className="font-mono text-[10px] inline-block px-3 py-1 rounded mb-3" style={{ color: '#a78bfa', letterSpacing: '0.2em', border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.06)' }}>
            WHY KINETIC
          </span>
          <div className="overflow-hidden">
            <div ref={headingRef}>
              <h2 className="font-syne font-extrabold" style={{ fontSize: '2.8rem', color: '#ededed', lineHeight: 1.1 }}>Everything you need.</h2>
            </div>
          </div>
          <p ref={subtextRef} className="font-inter font-light mt-3 opacity-0" style={{ fontSize: 14, color: '#606070' }}>
            Powerful animation primitives for modern React applications.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>

          {/* Cell A — Copy Paste Workflow (wide) */}
          <div
            ref={el => { if (el) cellRefs.current[0] = el; }}
            className="opacity-0"
            style={{ gridColumn: '1/3', gridRow: '1', background: '#0d0d16', border: '1px solid #1a1a2e', borderRadius: 8, padding: 28, overflow: 'hidden', position: 'relative', minHeight: 140, display: 'flex', justifyContent: 'space-between', gap: 20 }}
            onMouseEnter={e => handleCellEnter(e.currentTarget)}
            onMouseLeave={e => handleCellLeave(e.currentTarget)}
          >
            <div style={{ flex: '0 0 60%' }}>
              <span className="font-mono text-[10px] block mb-3" style={{ color: '#a78bfa' }}>WORKFLOW</span>
              <h3 className="font-syne font-bold mb-2" style={{ fontSize: '1.4rem', color: '#ededed' }}>Copy. Paste. Ship.</h3>
              <p className="font-inter font-light" style={{ fontSize: 12, color: '#606070', lineHeight: 1.6, maxWidth: 220 }}>Every component is self-contained. No configuration required.</p>
            </div>
            <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ background: '#07070e', border: '1px solid #1a1a2e', borderRadius: 6, padding: '12px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.8 }}>
                <div ref={el => { if (el) codeLineRefs.current[0] = el; }} className="opacity-0">
                  <span style={{ color: '#a78bfa' }}>import </span>
                  <span style={{ color: '#ededed' }}>{'{ TextReveal }'}</span>
                  <span style={{ color: '#606070' }}> from</span>
                </div>
                <div ref={el => { if (el) codeLineRefs.current[1] = el; }} className="opacity-0">
                  <span style={{ color: '#22c55e' }}>'kinetic-ui'</span>
                  <span ref={cursorRef} style={{ color: '#a78bfa' }}>|</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cell B — GSAP Powered (tall, 2 rows) */}
          <div
            ref={el => { if (el) cellRefs.current[1] = el; }}
            className="opacity-0"
            style={{ gridColumn: '3/4', gridRow: '1/3', background: '#0d0d16', border: '1px solid #1a1a2e', borderRadius: 8, padding: 28, overflow: 'hidden', position: 'relative', minHeight: 140, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(124,58,237,0.06), transparent 70%)' }}
            onMouseEnter={e => handleCellEnter(e.currentTarget)}
            onMouseLeave={e => handleCellLeave(e.currentTarget)}
          >
            <span className="font-mono text-[10px] mb-4" style={{ color: '#a78bfa' }}>ANIMATION ENGINE</span>
            <svg viewBox="0 0 200 100" className="w-full" style={{ height: 100 }}>
              <path
                ref={pathRef}
                d="M 10 90 C 40 90, 60 10, 100 10 C 140 10, 160 50, 190 10"
                fill="none" stroke="#7c3aed" strokeWidth="1.5"
              />
              <circle ref={dotRef} cx="10" cy="90" r="3" fill="#a78bfa" />
            </svg>
            <div className="mt-4">
              <h3 className="font-syne font-bold mb-1" style={{ fontSize: '1.1rem', color: '#ededed' }}>Industry Standard</h3>
              <p className="font-inter font-light" style={{ fontSize: 11, color: '#606070' }}>Powered by GSAP — used by Apple, Google, and 11M+ developers.</p>
            </div>
          </div>

          {/* Cell C — Zero Dependencies */}
          <div
            ref={el => { if (el) cellRefs.current[2] = el; }}
            className="opacity-0"
            style={{ gridColumn: '1/2', gridRow: '2', background: '#0d0d16', border: '1px solid #1a1a2e', borderRadius: 8, padding: 28, overflow: 'hidden', position: 'relative', minHeight: 140, display: 'flex', flexDirection: 'column' }}
            onMouseEnter={e => handleCellEnter(e.currentTarget)}
            onMouseLeave={e => handleCellLeave(e.currentTarget)}
          >
            <div>
              <span className="font-mono text-[10px] block mb-3" style={{ color: '#a78bfa' }}>SETUP</span>
              <h3 className="font-syne font-bold mb-2" style={{ fontSize: '1.2rem', color: '#ededed' }}>One install.</h3>
            </div>
            <div className="flex items-center justify-between cursor-pointer group" style={{ background: '#07070e', border: '1px solid #252535', borderRadius: 6, padding: '10px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#ededed', transition: 'border-color 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 }); }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#252535'; gsap.to(e.currentTarget, { scale: 1, duration: 0.2 }); }}
            >
              <span>npm install gsap</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-colors" style={{ color: '#505060' }}>
                <rect x="4" y="1" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <rect x="1" y="4" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="mt-auto pt-4" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#606070', lineHeight: 1.8 }}>
              {['GSAP included', 'No Framer Motion', 'Tree shakeable'].map((t, i) => (
                <span key={i} ref={el => { if (el) checkRefs.current[i] = el; }} className="block opacity-0">
                  <span style={{ color: '#22c55e' }}>✓ </span>{t}
                </span>
              ))}
            </div>
          </div>

          {/* Cell D — Performance */}
          <div
            ref={el => { if (el) cellRefs.current[3] = el; }}
            className="opacity-0"
            style={{ gridColumn: '2/3', gridRow: '2', background: '#0d0d16', border: '1px solid #1a1a2e', borderRadius: 8, padding: 28, overflow: 'hidden', position: 'relative', minHeight: 140 }}
            onMouseEnter={e => handleCellEnter(e.currentTarget)}
            onMouseLeave={e => handleCellLeave(e.currentTarget)}
          >
            <span className="font-mono text-[10px] block mb-3" style={{ color: '#a78bfa' }}>PERFORMANCE</span>
            <div className="flex items-baseline">
              <span ref={fpsRef} className="font-syne font-extrabold" style={{ fontSize: '3.5rem', color: '#ededed' }}>0</span>
              <span className="font-syne ml-1" style={{ fontSize: '1rem', color: '#606070' }}>fps</span>
            </div>
            <div className="mt-3" style={{ width: '100%', height: 4, background: '#1a1a2e', borderRadius: 2 }}>
              <div ref={barRef} style={{ width: '0%', height: '100%', background: 'linear-gradient(to right, #7c3aed, #a78bfa)', borderRadius: 2 }} />
            </div>
            <span className="font-mono block mt-2" style={{ fontSize: 10, color: '#404050' }}>Hardware accelerated</span>
          </div>

          {/* Cell E — Open Source */}
          <div
            ref={el => { if (el) cellRefs.current[4] = el; }}
            className="opacity-0"
            style={{ gridColumn: '1/2', gridRow: '3', background: '#0d0d16', border: '1px solid #1a1a2e', borderRadius: 8, padding: 28, overflow: 'hidden', position: 'relative', minHeight: 140, display: 'flex', flexDirection: 'column' }}
            onMouseEnter={e => handleCellEnter(e.currentTarget)}
            onMouseLeave={e => handleCellLeave(e.currentTarget)}
          >
            <span className="font-mono text-[10px] block mb-3" style={{ color: '#a78bfa' }}>LICENSE</span>
            <h3 className="font-syne font-bold mb-2" style={{ fontSize: '1.2rem', color: '#ededed' }}>Free forever.</h3>
            <p className="font-inter font-light" style={{ fontSize: 12, color: '#606070', lineHeight: 1.6 }}>MIT licensed. Use in personal and commercial projects. No attribution required.</p>
            <div className="mt-auto pt-4">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] px-3 py-1 rounded" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e' }}>
                <span ref={pulseRef} style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                MIT License
              </span>
            </div>
          </div>

          {/* Cell F — Component Count (wide) */}
          <div
            ref={el => { if (el) cellRefs.current[5] = el; }}
            className="opacity-0"
            style={{ gridColumn: '2/4', gridRow: '3', background: '#0d0d16', border: '1px solid #1a1a2e', borderRadius: 8, padding: 28, overflow: 'hidden', position: 'relative', minHeight: 140, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            onMouseEnter={e => handleCellEnter(e.currentTarget)}
            onMouseLeave={e => handleCellLeave(e.currentTarget)}
          >
            <div>
              <span className="font-mono text-[10px] block mb-2" style={{ color: '#a78bfa' }}>LIBRARY</span>
              <h3 className="font-syne font-bold mb-1" style={{ fontSize: '1.2rem', color: '#ededed' }}>Growing every week.</h3>
              <p className="font-inter font-light" style={{ fontSize: 12, color: '#606070' }}>New components added regularly. Star us on GitHub.</p>
            </div>
            <div className="flex gap-6">
              {[
                { val: '24+', label: 'Components', color: '#ededed' },
                { val: '6', label: 'Categories', color: '#ededed' },
                { val: '0', label: 'Dependencies', color: '#22c55e' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <span ref={el => { if (el) statNumRefs.current[i] = el; }} className="font-syne font-extrabold block" style={{ fontSize: '2rem', color: s.color }}>0</span>
                  <span className="font-mono block" style={{ fontSize: 10, color: '#505060' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BentoGridSection;

import { useEffect, useRef } from 'react';
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
  const caseLinkRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // t=0: Center divider draws
      tl.fromTo(dividerRef.current, { height: '0%' }, {
        height: '100%', duration: 0.8, ease: 'power2.out',
      }, 0);

      // t=0.3: Both curtains lift
      tl.to(leftCurtainRef.current, {
        clipPath: 'inset(0 100% 0 0)', duration: 0.9, ease: 'expo.inOut',
      }, 0.3);
      tl.to(rightCurtainRef.current, {
        clipPath: 'inset(0 0 0 100%)', duration: 0.9, ease: 'expo.inOut',
      }, 0.3);

      // t=0.9: Eyebrow
      tl.fromTo(eyebrowRef.current, { opacity: 0 }, {
        opacity: 1, duration: 0.4,
      }, 0.9);

      // t=1.0: Heading lines stagger
      headingLinesRef.current.forEach((line, i) => {
        if (line) {
          tl.fromTo(line, { yPercent: 100 }, {
            yPercent: 0, duration: 0.7, ease: 'power4.out',
          }, 1.0 + i * 0.1);
        }
      });

      // t=1.1: Corner ticks
      tickRefs.current.forEach((tick, i) => {
        if (tick) {
          tl.fromTo(tick, { scale: 0 }, {
            scale: 1, duration: 0.3, ease: 'back.out(2)',
          }, 1.1 + i * 0.05);
        }
      });

      // t=1.5: Meta
      tl.fromTo(metaRef.current, { opacity: 0 }, {
        opacity: 1, duration: 0.4,
      }, 1.5);

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

  const tickStyle = (corner: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute', width: 16, height: 16,
      borderColor: '#7c3aed', borderStyle: 'solid', borderWidth: 0,
    };
    if (corner === 'tl') return { ...base, top: -1, left: -1, borderTopWidth: 1, borderLeftWidth: 1 };
    if (corner === 'tr') return { ...base, top: -1, right: -1, borderTopWidth: 1, borderRightWidth: 1 };
    if (corner === 'bl') return { ...base, bottom: -1, left: -1, borderBottomWidth: 1, borderLeftWidth: 1 };
    return { ...base, bottom: -1, right: -1, borderBottomWidth: 1, borderRightWidth: 1 };
  };

  return (
    <div ref={containerRef} className="w-full" style={{ minHeight: 480 }}>
      <div className="relative flex" style={{ minHeight: 420 }}>
        {/* LEFT HALF */}
        <div className="w-1/2 relative overflow-hidden" style={{ background: '#0a0a12', padding: '60px 48px' }}>
          {/* Curtain */}
          <div
            ref={leftCurtainRef}
            className="absolute inset-0 z-10"
            style={{ background: '#060608', clipPath: 'inset(0 0 0 0)' }}
          />

          {/* Content */}
          <div className="relative z-0 flex flex-col justify-center h-full">
            <span
              ref={eyebrowRef}
              className="font-mono text-[10px] opacity-0 mb-6"
              style={{ color: '#a78bfa', letterSpacing: '0.2em' }}
            >
              PROJECT SHOWCASE
            </span>

            <div className="space-y-1">
              {[
                { text: 'The art', style: { fontSize: '4rem', color: '#ededed' } as React.CSSProperties },
                { text: 'of building', style: { fontSize: '4rem', color: '#606070' } as React.CSSProperties },
                { text: 'different.', style: { fontSize: '4rem', color: 'transparent', WebkitTextStroke: '1px #7c3aed' } as React.CSSProperties },
              ].map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <div ref={el => { if (el) headingLinesRef.current[i] = el; }}>
                    <span className="font-syne font-extrabold block" style={{ ...line.style, lineHeight: 1.15 }}>
                      {line.text}
                    </span>
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

        {/* CENTER DIVIDER */}
        <div
          ref={dividerRef}
          className="absolute left-1/2 top-0 w-px z-20"
          style={{
            height: '0%',
            background: 'linear-gradient(to bottom, transparent, #252535, transparent)',
          }}
        />

        {/* RIGHT HALF */}
        <div
          className="w-1/2 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f0f1f 0%, #1a1228 40%, #0d0d18 100%)' }}
          onMouseEnter={handleRightEnter}
          onMouseLeave={handleRightLeave}
        >
          {/* Curtain */}
          <div
            ref={rightCurtainRef}
            className="absolute inset-0 z-10"
            style={{ background: '#060608', clipPath: 'inset(0 0 0 0)' }}
          />

          {/* Content */}
          <div className="relative z-0 flex items-center justify-center h-full" style={{ minHeight: 420 }}>
            {/* Large bg number */}
            <span
              ref={bgNumRef}
              className="absolute font-syne font-extrabold pointer-events-none select-none"
              style={{ fontSize: '12rem', color: 'rgba(124,58,237,0.06)', bottom: 10, right: 20, lineHeight: 1 }}
            >
              01
            </span>

            {/* Framed inner box */}
            <div
              ref={innerBoxRef}
              className="relative"
              style={{ width: '80%', height: '60%', minHeight: 240, border: '1px solid #252535' }}
            >
              {['tl', 'tr', 'bl', 'br'].map((corner, i) => (
                <div
                  key={corner}
                  ref={el => { if (el) tickRefs.current[i] = el; }}
                  style={tickStyle(corner)}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-syne font-extrabold text-2xl" style={{ color: '#1a1a2e' }}>
                  VISUAL
                </span>
              </div>
            </div>

            {/* Case study link */}
            <span
              ref={caseLinkRef}
              className="absolute bottom-6 left-8 font-mono text-[11px] cursor-pointer"
              style={{ color: '#505060' }}
              onMouseEnter={e => {
                gsap.to(e.currentTarget, { color: '#a78bfa', x: 4, y: -4, duration: 0.25 });
              }}
              onMouseLeave={e => {
                gsap.to(e.currentTarget, { color: '#505060', x: 0, y: 0, duration: 0.25 });
              }}
            >
              ↗ View Case Study
            </span>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div
        className="w-full flex items-center justify-between px-12 py-4"
        style={{ background: '#0d0d14', borderTop: '1px solid #1a1a2e' }}
      >
        <span className="font-mono text-[10px]" style={{ color: '#303040' }}>
          KINETIC UI — SECTION COMPONENT
        </span>
        <span
          className="font-mono text-[10px] cursor-pointer"
          style={{ color: '#505060' }}
          onMouseEnter={e => gsap.to(e.currentTarget, { color: '#a78bfa', duration: 0.2 })}
          onMouseLeave={e => gsap.to(e.currentTarget, { color: '#505060', duration: 0.2 })}
        >
          Copy Code →
        </span>
      </div>
    </div>
  );
};

export default CinematicTextImageReveal;

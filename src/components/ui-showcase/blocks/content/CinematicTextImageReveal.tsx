import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      if (dividerRef.current) {
        tl.fromTo(dividerRef.current, { height: '0%' }, { height: '100%', duration: 0.8, ease: 'power2.out' }, 0);
      }
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

  const tickSize = isMobile ? 4 : 16;
  const tickStyle = (corner: string): React.CSSProperties => {
    const base: React.CSSProperties = { position: 'absolute', width: tickSize, height: tickSize, borderColor: '#7c3aed', borderStyle: 'solid', borderWidth: 0 };
    if (corner === 'tl') return { ...base, top: -1, left: -1, borderTopWidth: 1, borderLeftWidth: 1 };
    if (corner === 'tr') return { ...base, top: -1, right: -1, borderTopWidth: 1, borderRightWidth: 1 };
    if (corner === 'bl') return { ...base, bottom: -1, left: -1, borderBottomWidth: 1, borderLeftWidth: 1 };
    return { ...base, bottom: -1, right: -1, borderBottomWidth: 1, borderRightWidth: 1 };
  };

  if (isMobile) {
    return (
      <div ref={containerRef} className="w-full" style={{ pointerEvents: 'none' }}>
        <div style={{ background: '#0e0e14', padding: '24px 20px', width: '100%', position: 'relative', overflow: 'hidden' }}>
          {/* Curtain overlay */}
          <div ref={leftCurtainRef} className="absolute inset-0 z-10" style={{ background: '#060608', clipPath: 'inset(0 0 0 0)' }} />

          <div className="relative z-0">
            <span ref={eyebrowRef} className="font-mono opacity-0 block mb-3" style={{ color: '#a78bfa', letterSpacing: '0.2em', fontSize: 9 }}>
              PROJECT SHOWCASE
            </span>

            <div className="space-y-1">
              {[
                { text: 'The art', style: { color: '#ededed' } as React.CSSProperties },
                { text: 'of building', style: { color: '#606070' } as React.CSSProperties },
                { text: 'different.', style: { color: 'transparent', WebkitTextStroke: '1px #7c3aed' } as React.CSSProperties },
              ].map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <div ref={el => { if (el) headingLinesRef.current[i] = el; }}>
                    <span className="font-syne font-extrabold block" style={{ ...line.style, fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', lineHeight: 1.2 }}>{line.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Thin rule */}
            <div className="w-full h-px my-4" style={{ background: '#1a1a2e' }} />

            {/* Meta row */}
            <div ref={metaRef} className="flex items-center justify-between opacity-0">
              <span className="font-mono" style={{ fontSize: 11, color: '#404050' }}>2024</span>
              <span className="font-mono" style={{ fontSize: 11, color: '#404050' }}>Brand Identity + Web</span>
            </div>

            {/* Decorative box */}
            <div className="flex justify-center" style={{ marginTop: 20 }}>
              <div className="relative" style={{ width: 120, height: 80, border: '1px solid #252535' }}>
                {['tl', 'tr', 'bl', 'br'].map((corner, i) => (
                  <div key={corner} ref={el => { if (el) tickRefs.current[i] = el; }} style={tickStyle(corner)} />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#1a1a2e' }}>VISUAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          className="w-full flex items-center justify-between px-5 py-3"
          style={{ background: '#0e0e14', borderTop: '1px solid #1a1a2e' }}
        >
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#252535' }}>KINETIC UI — SECTION COMPONENT</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#252535', pointerEvents: 'auto', cursor: 'pointer' }}>Copy Code →</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full" style={{ pointerEvents: 'none' }}>
      <div className="relative flex flex-row">
        {/* LEFT HALF */}
        <div
          className="w-1/2 relative overflow-hidden"
          style={{ background: '#0a0a12', padding: '40px 20px', minHeight: 300 }}
        >
          <div ref={leftCurtainRef} className="absolute inset-0 z-10" style={{ background: '#060608', clipPath: 'inset(0 0 0 0)', height: '100%' }} />
          <div className="relative z-0 flex flex-col justify-center h-full" style={{ minHeight: 200 }}>
            <span ref={eyebrowRef} className="font-mono opacity-0 mb-6" style={{ color: '#a78bfa', letterSpacing: '0.2em', fontSize: 10 }}>
              PROJECT SHOWCASE
            </span>
            <div className="space-y-1">
              {[
                { text: 'The art', style: { fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#ededed' } as React.CSSProperties },
                { text: 'of building', style: { fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#606070' } as React.CSSProperties },
                { text: 'different.', style: { fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'transparent', WebkitTextStroke: '1px #7c3aed' } as React.CSSProperties },
              ].map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <div ref={el => { if (el) headingLinesRef.current[i] = el; }}>
                    <span className="font-syne font-extrabold block" style={{ ...line.style, lineHeight: 1.2 }}>{line.text}</span>
                  </div>
                </div>
              ))}
            </div>
            <div ref={metaRef} className="flex items-center gap-4 mt-10 opacity-0">
              <span className="font-mono" style={{ fontSize: '0.75rem', color: '#404050' }}>2024</span>
              <div className="w-px h-3" style={{ background: '#252535' }} />
              <span className="font-mono" style={{ fontSize: '0.75rem', color: '#404050' }}>Brand Identity + Web</span>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div ref={dividerRef} className="absolute left-1/2 top-0 w-px z-20" style={{ height: '0%', background: 'linear-gradient(to bottom, transparent, #252535, transparent)' }} />

        {/* RIGHT HALF */}
        <div
          className="w-1/2 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f0f1f 0%, #1a1228 40%, #0d0d18 100%)', pointerEvents: 'auto', minHeight: 300 }}
          onMouseEnter={handleRightEnter}
          onMouseLeave={handleRightLeave}
        >
          <div ref={rightCurtainRef} className="absolute inset-0 z-10" style={{ background: '#060608', clipPath: 'inset(0 0 0 0)', height: '100%' }} />
          <div className="relative z-0 flex items-center justify-center h-full" style={{ minHeight: 180 }}>
            <span
              ref={bgNumRef}
              className="absolute font-syne font-extrabold pointer-events-none select-none"
              style={{ color: 'rgba(124,58,237,0.06)', fontSize: '4rem', lineHeight: 1, bottom: 8, right: 8 }}
            >
              01
            </span>
            <div
              ref={innerBoxRef}
              className="relative"
              style={{ width: '70%', height: '55%', minHeight: 140, border: '1px solid #252535' }}
            >
              {['tl', 'tr', 'bl', 'br'].map((corner, i) => (
                <div key={corner} ref={el => { if (el) tickRefs.current[i] = el; }} style={tickStyle(corner)} />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-syne font-extrabold text-base" style={{ color: '#1a1a2e' }}>VISUAL</span>
              </div>
            </div>
            <span
              ref={caseLinkRef}
              className="absolute font-mono cursor-pointer"
              style={{ bottom: 6, left: 8, color: '#505060', fontSize: '0.6875rem', pointerEvents: 'auto' }}
            >
              ↗ View Case Study
            </span>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="w-full flex items-center justify-between px-12 py-4" style={{ background: '#0d0d14', borderTop: '1px solid #1a1a2e' }}>
        <span className="font-mono text-[10px]" style={{ color: '#303040' }}>KINETIC UI — SECTION COMPONENT</span>
        <span className="font-mono text-[10px]" style={{ color: '#505060', pointerEvents: 'auto', cursor: 'pointer' }}>Copy Code →</span>
      </div>
    </div>
  );
};

export default CinematicTextImageReveal;

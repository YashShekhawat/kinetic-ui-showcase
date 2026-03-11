import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// ─── Types ───────────────────────────────────────────────────────────────────
interface CurtainPreloaderProps {
  onComplete?: () => void;
  brandName?: string;
  tagline?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
// Chunky step counter — mimics Awwwards-style non-linear counting
const COUNT_STEPS = [0, 4, 9, 15, 23, 31, 40, 52, 61, 70, 78, 85, 91, 96, 100];

// ─── Main Component ───────────────────────────────────────────────────────────
const CurtainPreloader = ({
  onComplete,
  brandName = 'KINETIC UI',
  tagline = 'MOTION · GSAP · REACT',
}: CurtainPreloaderProps) => {
  const rootRef        = useRef<HTMLDivElement>(null);
  const topRef         = useRef<HTMLDivElement>(null);
  const botRef         = useRef<HTMLDivElement>(null);
  const countRef       = useRef<HTMLSpanElement>(null);
  const percentRef     = useRef<HTMLSpanElement>(null);
  const brandTopRef    = useRef<HTMLDivElement>(null);
  const brandBotRef    = useRef<HTMLDivElement>(null);
  const taglineRef     = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef= useRef<HTMLDivElement>(null);
  const cornerTLRef    = useRef<HTMLDivElement>(null);
  const cornerTRRef    = useRef<HTMLDivElement>(null);
  const cornerBLRef    = useRef<HTMLDivElement>(null);
  const cornerBRRef    = useRef<HTMLDivElement>(null);

  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const root      = rootRef.current;
    const top       = topRef.current;
    const bot       = botRef.current;
    const countEl   = countRef.current;
    const brandTop  = brandTopRef.current;
    const brandBot  = brandBotRef.current;
    const tagline_  = taglineRef.current;
    const bar       = progressBarRef.current;
    const fill      = progressFillRef.current;
    const cTL       = cornerTLRef.current;
    const cTR       = cornerTRRef.current;
    const cBL       = cornerBLRef.current;
    const cBR       = cornerBRRef.current;

    if (!root || !top || !bot) return;

    // ── Lock body scroll during preloader
    document.body.style.overflow = 'hidden';

    // ── Initial states
    gsap.set([brandTop, brandBot], { y: 40, opacity: 0 });
    gsap.set(tagline_,             { opacity: 0, letterSpacing: '0.5em' });
    gsap.set(bar,                  { scaleX: 0, transformOrigin: 'left', opacity: 0 });
    gsap.set([cTL, cTR, cBL, cBR],{ opacity: 0, scale: 0.6 });
    gsap.set(countEl,              { opacity: 0 });
    gsap.set(percentRef.current,   { opacity: 0 });

    // ── Master timeline
    const master = gsap.timeline();

    // Phase 1 — Elements appear
    master
      .to([cTL, cTR, cBL, cBR], {
        opacity: 1, scale: 1, duration: 0.4, stagger: 0.06, ease: 'power3.out',
      }, 0.2)
      .to([brandTop, brandBot], {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power4.out',
      }, 0.3)
      .to(tagline_, {
        opacity: 1, letterSpacing: '0.25em', duration: 0.8, ease: 'power3.out',
      }, 0.6)
      .to([bar, countEl, percentRef.current], {
        opacity: 1, duration: 0.4,
      }, 0.8)
      .to(fill, {
        scaleX: 0, duration: 0, // will be driven by count
      }, 0.8);

    // Phase 2 — Count up with steps(14) style — chunky non-linear
    let stepIndex = 0;
    const countObj = { value: 0 };

    const driveCount = () => {
      if (stepIndex >= COUNT_STEPS.length) return;
      const target = COUNT_STEPS[stepIndex];
      const duration = stepIndex < 5 ? 0.18 : stepIndex < 10 ? 0.12 : 0.09;

      gsap.to(countObj, {
        value: target,
        duration,
        ease: 'power1.inOut',
        onUpdate: () => {
          const v = Math.round(countObj.value);
          setDisplayCount(v);
          if (fill) gsap.set(fill, { scaleX: v / 100 });
        },
        onComplete: () => {
          stepIndex++;
          if (stepIndex < COUNT_STEPS.length) {
            gsap.delayedCall(stepIndex < 6 ? 0.08 : 0.05, driveCount);
          } else {
            // Phase 3 — Hold at 100, then curtain split
            gsap.delayedCall(0.35, revealPage);
          }
        },
      });
    };

    master.call(driveCount, [], '+=0.2');

    // Phase 3 — Curtain split reveal
    const revealPage = () => {
      const exitTl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          if (onComplete) onComplete();
          // Hide root after exit
          if (root) gsap.set(root, { display: 'none' });
        },
      });

      // Corners fade + tagline out
      exitTl
        .to([cTL, cTR, cBL, cBR, tagline_, bar], {
          opacity: 0, duration: 0.25, ease: 'power2.in',
        })
        // Brand name scales up and fades — like it "becomes" the page
        .to([brandTop, brandBot], {
          scale: 1.06, opacity: 0, duration: 0.35, ease: 'power3.in',
        }, '-=0.1')
        // COUNT fades
        .to([countEl, percentRef.current], {
          opacity: 0, duration: 0.2,
        }, '-=0.3')
        // TOP panel flies UP
        .to(top, {
          yPercent: -100,
          duration: 1.1,
          ease: 'expo.inOut',
        }, '-=0.05')
        // BOTTOM panel flies DOWN simultaneously
        .to(bot, {
          yPercent: 100,
          duration: 1.1,
          ease: 'expo.inOut',
        }, '<');
    };

    return () => {
      master.kill();
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  // ─── Corner bracket SVG
  const Corner = ({
    ref: r,
    flip,
  }: {
    ref: React.RefObject<HTMLDivElement>;
    flip: { x?: boolean; y?: boolean };
  }) => (
    <div
      ref={r}
      style={{
        position: 'absolute',
        width: 20, height: 20,
        transform: `scaleX(${flip.x ? -1 : 1}) scaleY(${flip.y ? -1 : 1})`,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M1 19V1H19" stroke="rgba(124,58,237,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  const panelContent = (isTop: boolean) => (
    <>
      {/* Corner brackets */}
      {isTop && (
        <>
          <div ref={cornerTLRef} style={{ position: 'absolute', top: 20, left: 20 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M1 19V1H19" stroke="rgba(124,58,237,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div ref={cornerTRRef} style={{ position: 'absolute', top: 20, right: 20, transform: 'scaleX(-1)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M1 19V1H19" stroke="rgba(124,58,237,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </>
      )}
      {!isTop && (
        <>
          <div ref={cornerBLRef} style={{ position: 'absolute', bottom: 20, left: 20, transform: 'scaleY(-1)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M1 19V1H19" stroke="rgba(124,58,237,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div ref={cornerBRRef} style={{ position: 'absolute', bottom: 20, right: 20, transform: 'scale(-1,-1)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M1 19V1H19" stroke="rgba(124,58,237,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </>
      )}
    </>
  );

  return (
    <div
      ref={rootRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        pointerEvents: 'all',
      }}
    >
      {/* ── TOP PANEL */}
      <div
        ref={topRef}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '50%',
          background: '#0e0e14',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: 0,
          overflow: 'hidden',
        }}
      >
        {/* Corner TL + TR */}
        <div ref={cornerTLRef} style={{ position: 'absolute', top: 20, left: 20 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M1 19V1H19" stroke="rgba(124,58,237,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div ref={cornerTRRef} style={{ position: 'absolute', top: 20, right: 20, transform: 'scaleX(-1)' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M1 19V1H19" stroke="rgba(124,58,237,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Brand name — top half */}
        <div
          ref={brandTopRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: 'clamp(8px, 2vw, 20px)',
          }}
        >
          <span
            className="font-syne font-extrabold"
            style={{
              fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
              color: '#f0ede8',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            {brandName}
          </span>
        </div>
      </div>

      {/* ── DIVIDER LINE + COUNTER (sits in the middle, above both panels) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0, right: 0,
          transform: 'translateY(-50%)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          pointerEvents: 'none',
        }}
      >
        {/* Horizontal divider line */}
        <div style={{
          width: '100%',
          height: 1,
          background: 'linear-gradient(to right, transparent 0%, rgba(124,58,237,0.3) 20%, #7c3aed 50%, rgba(124,58,237,0.3) 80%, transparent 100%)',
        }} />

        {/* Counter bubble sitting on the line */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 2,
          marginTop: -1,
          background: '#0e0e14',
          padding: '4px 14px',
          border: '1px solid #1e1e2e',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
        }}>
          <span
            ref={countRef}
            className="font-syne font-extrabold"
            style={{
              fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
              color: '#7c3aed',
              lineHeight: 1,
              minWidth: '3ch',
              textAlign: 'right',
            }}
          >
            {displayCount}
          </span>
          <span
            ref={percentRef}
            className="font-mono"
            style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)', color: '#404050', lineHeight: 1 }}
          >
            %
          </span>
        </div>
      </div>

      {/* ── BOTTOM PANEL */}
      <div
        ref={botRef}
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '50%',
          background: '#0e0e14',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 0,
          overflow: 'hidden',
        }}
      >
        {/* Brand name — bottom half (mirror of top, clipped) */}
        <div
          ref={brandBotRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 'clamp(8px, 2vw, 20px)',
          }}
        >
          {/* Tagline */}
          <div ref={taglineRef}>
            <span
              className="font-mono"
              style={{
                fontSize: 'clamp(8px, 1.2vw, 11px)',
                color: '#404050',
                letterSpacing: '0.25em',
                display: 'block',
                textAlign: 'center',
              }}
            >
              {tagline}
            </span>
          </div>

          {/* Progress bar */}
          <div
            ref={progressBarRef}
            style={{
              width: 'clamp(120px, 20vw, 200px)',
              height: 1,
              background: '#1e1e2e',
              marginTop: 16,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 1,
            }}
          >
            <div
              ref={progressFillRef}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, #7c3aed, #a78bfa)',
                transformOrigin: 'left',
                scaleX: 0,
                borderRadius: 1,
              }}
            />
          </div>
        </div>

        {/* Corner BL + BR */}
        <div ref={cornerBLRef} style={{ position: 'absolute', bottom: 20, left: 20, transform: 'scaleY(-1)' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M1 19V1H19" stroke="rgba(124,58,237,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div ref={cornerBRRef} style={{ position: 'absolute', bottom: 20, right: 20, transform: 'scale(-1,-1)' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M1 19V1H19" stroke="rgba(124,58,237,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// ─── Demo wrapper showing preloader + fake page underneath ────────────────────
const CurtainPreloaderDemo = () => {
  const [done, setDone] = useState(false);
  const [key, setKey]   = useState(0);
  const pageRef         = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done && pageRef.current) {
      gsap.fromTo(
        pageRef.current.querySelectorAll('[data-reveal]'),
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.1 }
      );
    }
  }, [done]);

  return (
    <div
      data-preview="true"
      style={{ background: '#0e0e14', minHeight: '100vh', width: '100%', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}
    >
      {/* ── Preloader */}
      {!done && (
        <CurtainPreloader
          key={key}
          brandName="KINETIC UI"
          tagline="MOTION · GSAP · REACT"
          onComplete={() => setDone(true)}
        />
      )}

      {/* ── Page content revealed underneath */}
      <div
        ref={pageRef}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          padding: '40px 24px',
          textAlign: 'center',
        }}
      >
        {/* Ambient glow */}
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div data-reveal style={{ opacity: 0 }}>
          <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.25em', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.25)', background: 'rgba(124,58,237,0.07)', padding: '4px 14px', borderRadius: 20 }}>
            CURTAIN PRELOADER
          </span>
        </div>

        <div data-reveal style={{ opacity: 0 }}>
          <h1 className="font-syne font-extrabold" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', color: '#f0ede8', margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Page is revealed.
          </h1>
        </div>

        <div data-reveal style={{ opacity: 0 }}>
          <p className="font-inter font-light" style={{ fontSize: '0.85rem', color: '#606070', maxWidth: 360, lineHeight: 1.8, margin: 0 }}>
            The curtain split preloader counts to 100 then the two panels fly apart — top up, bottom down — revealing your content beneath.
          </p>
        </div>

        <div data-reveal style={{ opacity: 0, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['GSAP Timeline', 'Chunky Counter', 'Curtain Split', 'expo.inOut'].map((tag) => (
            <span key={tag} className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.15em', color: '#404050', border: '1px solid #1e1e2e', padding: '4px 12px', borderRadius: 4 }}>
              {tag}
            </span>
          ))}
        </div>

        {done && (
          <div data-reveal style={{ opacity: 0, marginTop: 16 }}>
            <button
              onClick={() => { setDone(false); setKey(k => k + 1); }}
              style={{ padding: '10px 24px', background: 'transparent', border: '1px solid #2a2a3e', borderRadius: 8, color: '#909098', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.05em' }}
            >
              ↺ Replay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurtainPreloaderDemo;
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * CurtainPreloader
 *
 * Wrap your entire app with this component. The curtain covers the screen,
 * counts to 100, then splits apart revealing your content underneath.
 *
 * ── USAGE (App.tsx) ──────────────────────────────────────────────────────────
 *
 *   import { CurtainPreloader } from '@/components/CurtainPreloader';
 *
 *   export default function App() {
 *     return (
 *       <CurtainPreloader brandName="ACME STUDIO" tagline="CRAFTING EXPERIENCE">
 *         <YourApp />
 *       </CurtainPreloader>
 *     );
 *   }
 *
 * ── CUSTOMIZING COLORS (in your global CSS) ───────────────────────────────────
 *
 *   :root {
 *     --preloader-bg:     #0e0e14;   /* panel background        *\/
 *     --preloader-text:   #f0ede8;   /* brand name + labels     *\/
 *     --preloader-accent: #7c3aed;   /* counter, bar, brackets  *\/
 *     --preloader-muted:  #1e1e2e;   /* progress track + border *\/
 *   }
 *
 *   Light mode example:
 *   :root {
 *     --preloader-bg:     #ffffff;
 *     --preloader-text:   #0e0e14;
 *     --preloader-accent: #7c3aed;
 *     --preloader-muted:  #e5e5e5;
 *   }
 *
 * ── PROPS ────────────────────────────────────────────────────────────────────
 *   brandName  — text on top curtain panel     default: 'YOUR BRAND'
 *   tagline    — small label, bottom panel     default: 'LOADING'
 *   children   — your page content, revealed on finish
 * ─────────────────────────────────────────────────────────────────────────────
 */

interface CurtainPreloaderProps {
  brandName?: string;
  tagline?: string;
  children?: React.ReactNode;
}

// Non-linear steps — mimics real asset-loading rhythm (fast start, decelerates)
const STEPS: number[] = [0, 4, 9, 15, 23, 31, 40, 52, 61, 70, 78, 85, 91, 96, 100];

// Typed ref helper — compatible with React 18 and 19
type DivRef = React.RefObject<HTMLDivElement | null>;

// Declared outside component to avoid "component created during render" error
function Bracket({ r, bottom = false, right = false }: { r: DivRef; bottom?: boolean; right?: boolean }) {
  const rotation =
    !bottom && !right
      ? 0 // top-left
      : !bottom && right
        ? 90 // top-right
        : bottom && !right
          ? -90 // bottom-left
          : 180; // bottom-right

  return (
    <div
      ref={r}
      style={{
        position: "absolute",
        width: 18,
        height: 18,
        [bottom ? "bottom" : "top"]: 16,
        [right ? "right" : "left"]: 16,
        transform: `rotate(${rotation}deg)`,
        opacity: 0.45,
        color: "var(--preloader-accent, #7c3aed)",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M1 17V1H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function CurtainPreloader({ brandName = "YOUR BRAND", tagline = "LOADING", children }: CurtainPreloaderProps) {
  const [count, setCount] = useState<number>(0);
  const [done, setDone] = useState<boolean>(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const cTL = useRef<HTMLDivElement>(null);
  const cTR = useRef<HTMLDivElement>(null);
  const cBL = useRef<HTMLDivElement>(null);
  const cBR = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const top = topRef.current;
    const bot = botRef.current;
    if (!overlay || !top || !bot) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // ── Initial hidden states
    gsap.set([brandRef.current, tagRef.current], { y: 28, opacity: 0 });
    gsap.set(counterRef.current, { opacity: 0 });
    gsap.set(fillRef.current, { scaleX: 0, transformOrigin: "left" });
    gsap.set([cTL.current, cTR.current, cBL.current, cBR.current], {
      opacity: 0,
      scale: 0.5,
    });

    // ── Phase 1: elements enter
    const intro = gsap.timeline();
    intro
      .to(
        [cTL.current, cTR.current, cBL.current, cBR.current],
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.07,
          ease: "power3.out",
        },
        0.1,
      )
      .to(
        brandRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: "power4.out",
        },
        0.2,
      )
      .to(
        tagRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: "power4.out",
        },
        0.35,
      )
      .to(
        counterRef.current,
        {
          opacity: 1,
          duration: 0.35,
        },
        0.5,
      );

    // ── Phase 2: chunky non-linear count
    let idx = 0;
    const obj = { v: 0 };

    const tick = (): void => {
      const total = STEPS.length;
      if (idx >= total) return;

      const target = STEPS[idx] ?? 100;
      const dur = idx < 5 ? 0.18 : idx < 10 ? 0.13 : 0.09;
      const gap = idx < 6 ? 0.08 : 0.05;

      gsap.to(obj, {
        v: target,
        duration: dur,
        ease: "power1.inOut",
        onUpdate: () => {
          const v = Math.round(obj.v);
          setCount(v);
          if (fillRef.current) {
            gsap.set(fillRef.current, { scaleX: v / 100 });
          }
        },
        onComplete: () => {
          idx += 1;
          if (idx < total) {
            gsap.delayedCall(gap, tick);
          } else {
            gsap.delayedCall(0.4, split);
          }
        },
      });
    };

    intro.call(tick, [], "+=0.1");

    // ── Phase 3: curtain split
    const split = (): void => {
      gsap
        .timeline({
          onComplete: () => {
            document.body.style.overflow = prev;
            overlay.style.display = "none";
            setDone(true);
          },
        })
        .to([cTL.current, cTR.current, cBL.current, cBR.current, tagRef.current, counterRef.current], {
          opacity: 0,
          duration: 0.22,
          ease: "power2.in",
        })
        .to(
          brandRef.current,
          {
            scale: 1.08,
            opacity: 0,
            duration: 0.3,
            ease: "power3.in",
          },
          "-=0.1",
        )
        .to(
          top,
          {
            yPercent: -100,
            duration: 1.05,
            ease: "expo.inOut",
          },
          "-=0.05",
        )
        .to(
          bot,
          {
            yPercent: 100,
            duration: 1.05,
            ease: "expo.inOut",
          },
          "<",
        );
    };

    return () => {
      document.body.style.overflow = prev;
      intro.kill();
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Overlay: fixed so it always covers the full viewport */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          pointerEvents: done ? "none" : "all",
        }}
      >
        {/* ── TOP PANEL */}
        <div
          ref={topRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "var(--preloader-bg, #0e0e14)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            overflow: "hidden",
          }}
        >
          <Bracket r={cTL} />
          <Bracket r={cTR} right />

          <div
            ref={brandRef}
            style={{
              padding: "0 16px clamp(8px, 3vw, 24px)",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.1rem, 5vw, 3rem)",
                color: "var(--preloader-text, #f0ede8)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                userSelect: "none",
                display: "block",
                wordBreak: "break-word",
              }}
            >
              {brandName}
            </span>
          </div>
        </div>

        {/* ── CENTRE DIVIDER + COUNTER */}
        <div
          ref={counterRef}
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            transform: "translateY(-50%)",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          {/* Gradient divider line */}
          <div
            style={{
              width: "100%",
              height: 1,
              background:
                "linear-gradient(to right, transparent, color-mix(in srgb, var(--preloader-accent, #7c3aed) 35%, transparent) 25%, var(--preloader-accent, #7c3aed) 50%, color-mix(in srgb, var(--preloader-accent, #7c3aed) 35%, transparent) 75%, transparent)",
            }}
          />

          {/* Counter pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              marginTop: -1,
              background: "var(--preloader-bg, #0e0e14)",
              border: "1px solid var(--preloader-muted, #1e1e2e)",
              borderTop: "none",
              borderRadius: "0 0 8px 8px",
              padding: "4px 14px 6px",
              minWidth: 72,
            }}
          >
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1rem, 4vw, 1.6rem)",
                color: "var(--preloader-accent, #7c3aed)",
                lineHeight: 1,
                display: "inline-block",
                width: "3ch",
                textAlign: "right",
              }}
            >
              {count}
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "clamp(0.55rem, 2vw, 0.8rem)",
                color: "var(--preloader-text, #f0ede8)",
                opacity: 0.4,
                lineHeight: 1,
                marginLeft: 1,
              }}
            >
              %
            </span>
          </div>
        </div>

        {/* ── BOTTOM PANEL */}
        <div
          ref={botRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "var(--preloader-bg, #0e0e14)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            overflow: "hidden",
          }}
        >
          <div
            ref={tagRef}
            style={{
              padding: "clamp(8px, 3vw, 24px) 16px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "clamp(7px, 2vw, 10px)",
                color: "var(--preloader-text, #f0ede8)",
                opacity: 0.35,
                letterSpacing: "0.2em",
                userSelect: "none",
                textAlign: "center",
              }}
            >
              {tagline}
            </span>

            {/* Progress bar */}
            <div
              style={{
                width: "clamp(80px, 30vw, 160px)",
                height: 1,
                background: "var(--preloader-muted, #1e1e2e)",
                borderRadius: 1,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                ref={fillRef}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "var(--preloader-accent, #7c3aed)",
                  borderRadius: 1,
                }}
              />
            </div>
          </div>

          <Bracket r={cBL} bottom />
          <Bracket r={cBR} bottom right />
        </div>
      </div>

      {/* Children — rendered in DOM during load for performance, revealed after split */}
      <div
        style={{
          visibility: done ? "visible" : "hidden",
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// @preview-only — everything below is for the component card preview only.
// Do NOT copy this into your project. Only CurtainPreloader above is needed.

const PreviewPage = ({ onReplay }: { onReplay?: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>("[data-item]");
    gsap.fromTo(
      items,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.15,
      },
    );
  }, []);

  const handleReplay = (): void => {
    const btn = btnRef.current;
    if (!btn) return;
    gsap.to(btn, {
      scale: 0.92,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: () => {
        onReplay?.();
      },
    });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.style.borderColor = "#7c3aed";
    e.currentTarget.style.color = "#a78bfa";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.style.borderColor = "#2a2a3e";
    e.currentTarget.style.color = "#606070";
  };

  return (
    <div
      ref={ref}
      style={{
        minHeight: "100vh",
        background: "#0e0e14",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: "40px 20px",
        textAlign: "center",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <div data-item style={{ opacity: 0 }}>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "9px",
            letterSpacing: "0.22em",
            color: "#7c3aed",
            border: "1px solid rgba(124,58,237,0.25)",
            background: "rgba(124,58,237,0.07)",
            padding: "3px 12px",
            borderRadius: 20,
            display: "inline-block",
          }}
        >
          CURTAIN PRELOADER
        </span>
      </div>

      <div data-item style={{ opacity: 0 }}>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.6rem, 5vw, 3.2rem)",
            color: "#f0ede8",
            margin: 0,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
          }}
        >
          Your page,
          <br />
          <span style={{ color: "transparent", WebkitTextStroke: "1.5px #7c3aed" }}>revealed.</span>
        </h1>
      </div>

      <div data-item style={{ opacity: 0, maxWidth: 320 }}>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: "0.82rem",
            color: "#606070",
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          Counts to 100 then splits — top panel up, bottom panel down — unveiling your content in a single dramatic
          motion.
        </p>
      </div>

      <div
        data-item
        style={{
          opacity: 0,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {["expo.inOut", "Chunky counter", "Split reveal", "GSAP"].map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.12em",
              color: "#404050",
              border: "1px solid #1e1e2e",
              padding: "3px 10px",
              borderRadius: 4,
              display: "inline-block",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div data-item style={{ opacity: 0, marginTop: 4 }}>
        <button
          ref={btnRef}
          onClick={handleReplay}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 20px",
            background: "transparent",
            border: "1px solid #2a2a3e",
            borderRadius: 8,
            color: "#606070",
            cursor: "pointer",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: "0.78rem",
            letterSpacing: "0.05em",
            transition: "border-color 0.2s, color 0.2s",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M10 6A4 4 0 1 1 6 2V0L9 3 6 6V4A2 2 0 1 0 8 6"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Replay animation
        </button>
      </div>
    </div>
  );
};

export default function CurtainPreloaderDemo() {
  const [key, setKey] = useState<number>(0);
  return (
    <div
      data-preview="true"
      style={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/*
        Override position:fixed → absolute so the curtain stays inside
        the preview card instead of escaping to the browser viewport.
        This style tag is preview-only and not part of the production component.
      */}
      <style>{`[data-preview="true"] > div > div[style*="position: fixed"] { position: absolute !important; }`}</style>
      <CurtainPreloader key={key} brandName="KINETIC UI" tagline="MOTION · GSAP · REACT">
        <PreviewPage
          onReplay={() => {
            setKey((k) => k + 1);
          }}
        />
      </CurtainPreloader>
    </div>
  );
}

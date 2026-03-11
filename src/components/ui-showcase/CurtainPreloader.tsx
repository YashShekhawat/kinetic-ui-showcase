import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * CurtainPreloader
 *
 * Drop this into your app's root (App.tsx or layout.tsx) and wrap your
 * page content with it. The curtain panels cover the screen while your
 * app loads, count to 100, then split apart to reveal everything beneath.
 *
 * USAGE — App.tsx:
 * ─────────────────────────────────────────────────────
 * import CurtainPreloader from '@/components/CurtainPreloader';
 *
 * export default function App() {
 *   return (
 *     <CurtainPreloader brandName="YOUR BRAND" tagline="YOUR TAGLINE">
 *       <YourPageContent />
 *     </CurtainPreloader>
 *   );
 * }
 * ─────────────────────────────────────────────────────
 *
 * PROPS:
 *  brandName  — text shown on the top panel            (default: 'YOUR BRAND')
 *  tagline    — small mono text on the bottom panel    (default: 'LOADING')
 *  duration   — total count duration in ms             (default: 2200)
 *  children   — your page content, revealed on finish
 */

interface CurtainPreloaderProps {
  brandName?: string;
  tagline?: string;
  duration?: number;
  children?: React.ReactNode;
}

// Non-linear count steps — mimics real asset-loading feel (fast start, decelerates)
const COUNT_STEPS = [0, 4, 9, 15, 23, 31, 40, 52, 61, 70, 78, 85, 91, 96, 100];

const CurtainPreloader = ({ brandName = "YOUR BRAND", tagline = "LOADING", children }: CurtainPreloaderProps) => {
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  const overlayRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const counterRowRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const cornerTLRef = useRef<HTMLDivElement>(null);
  const cornerTRRef = useRef<HTMLDivElement>(null);
  const cornerBLRef = useRef<HTMLDivElement>(null);
  const cornerBRRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const top = topRef.current;
    const bot = botRef.current;
    if (!overlay || !top || !bot) return;

    // Prevent scroll during load
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // ── Set initial hidden states
    gsap.set([brandRef.current, taglineRef.current], { y: 32, opacity: 0 });
    gsap.set(counterRowRef.current, { opacity: 0 });
    gsap.set(progressFillRef.current, { scaleX: 0, transformOrigin: "left" });
    gsap.set([cornerTLRef.current, cornerTRRef.current, cornerBLRef.current, cornerBRRef.current], {
      opacity: 0,
      scale: 0.5,
    });

    // ── Phase 1: entrance
    const intro = gsap.timeline();
    intro
      .to(
        [cornerTLRef.current, cornerTRRef.current, cornerBLRef.current, cornerBRRef.current],
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.07, ease: "power3.out" },
        0.15,
      )
      .to(brandRef.current, { y: 0, opacity: 1, duration: 0.65, ease: "power4.out" }, 0.25)
      .to(taglineRef.current, { y: 0, opacity: 1, duration: 0.55, ease: "power4.out" }, 0.4)
      .to(counterRowRef.current, { opacity: 1, duration: 0.35 }, 0.55);

    // ── Phase 2: chunky non-linear count
    let stepIdx = 0;
    const countObj = { value: 0 };

    const tick = () => {
      if (stepIdx >= COUNT_STEPS.length) return;
      const target = COUNT_STEPS[stepIdx];
      const dur = stepIdx < 5 ? 0.18 : stepIdx < 10 ? 0.13 : 0.09;
      const gapDelay = stepIdx < 6 ? 0.08 : 0.05;

      gsap.to(countObj, {
        value: target,
        duration: dur,
        ease: "power1.inOut",
        onUpdate: () => {
          const v = Math.round(countObj.value);
          setCount(v);
          gsap.set(progressFillRef.current, { scaleX: v / 100 });
        },
        onComplete: () => {
          stepIdx++;
          if (stepIdx < COUNT_STEPS.length) {
            gsap.delayedCall(gapDelay, tick);
          } else {
            // Hold at 100 then curtain split
            gsap.delayedCall(0.4, split);
          }
        },
      });
    };

    intro.call(tick, [], "+=0.1");

    // ── Phase 3: curtain split reveal
    const split = () => {
      const exit = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = prevOverflow;
          // Remove overlay from DOM flow entirely
          if (overlay) overlay.style.display = "none";
          setDone(true);
        },
      });

      exit
        // Fade all UI elements first
        .to(
          [
            cornerTLRef.current,
            cornerTRRef.current,
            cornerBLRef.current,
            cornerBRRef.current,
            taglineRef.current,
            counterRowRef.current,
          ],
          { opacity: 0, duration: 0.22, ease: "power2.in" },
        )
        // Brand scales up and dissolves — feels like it becomes the page
        .to(brandRef.current, { scale: 1.08, opacity: 0, duration: 0.3, ease: "power3.in" }, "-=0.1")
        // Top panel flies up, bottom panel flies down — simultaneously
        .to(top, { yPercent: -100, duration: 1.05, ease: "expo.inOut" }, "-=0.05")
        .to(bot, { yPercent: 100, duration: 1.05, ease: "expo.inOut" }, "<");
    };

    return () => {
      document.body.style.overflow = prevOverflow;
      intro.kill();
    };
  }, []);

  // ── Corner SVG helper
  const CornerSVG = ({ style }: { style: React.CSSProperties }) => (
    <div style={{ position: "absolute", width: 18, height: 18, ...style }}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M1 17V1H17" stroke="rgba(124,58,237,0.45)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );

  return (
    <>
      {/* ── Curtain overlay — position fixed, covers everything */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          pointerEvents: done ? "none" : "all",
        }}
      >
        {/* TOP PANEL */}
        <div
          ref={topRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "#0e0e14",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            overflow: "hidden",
          }}
        >
          {/* TL corner */}
          <CornerSVG ref={cornerTLRef} style={{ top: 18, left: 18 }} />
          {/* TR corner */}
          <div
            ref={cornerTRRef}
            style={{ position: "absolute", top: 18, right: 18, width: 18, height: 18, transform: "scaleX(-1)" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 17V1H17" stroke="rgba(124,58,237,0.45)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Brand name */}
          <div ref={brandRef} style={{ paddingBottom: "clamp(10px, 2.5vw, 24px)", textAlign: "center" }}>
            <span
              className="font-syne font-extrabold"
              style={{
                fontSize: "clamp(1.6rem, 4.5vw, 3.2rem)",
                color: "#f0ede8",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                userSelect: "none",
                display: "block",
              }}
            >
              {brandName}
            </span>
          </div>
        </div>

        {/* ── CENTRE DIVIDER + COUNTER */}
        <div
          ref={counterRowRef}
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
                "linear-gradient(to right, transparent, rgba(124,58,237,0.35) 25%, #7c3aed 50%, rgba(124,58,237,0.35) 75%, transparent)",
            }}
          />

          {/* Counter pill — hangs below the line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              marginTop: -1,
              background: "#0e0e14",
              border: "1px solid #1e1e2e",
              borderTop: "none",
              borderRadius: "0 0 8px 8px",
              padding: "5px 16px 6px",
              minWidth: 76,
            }}
          >
            {/* Fixed-width number so pill doesn't resize */}
            <span
              className="font-syne font-extrabold"
              style={{
                fontSize: "clamp(1.1rem, 2.8vw, 1.7rem)",
                color: "#7c3aed",
                lineHeight: 1,
                display: "inline-block",
                width: "2ch",
                textAlign: "right",
              }}
            >
              {count}
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: "clamp(0.65rem, 1.4vw, 0.85rem)",
                color: "#505060",
                lineHeight: 1,
                marginLeft: 2,
              }}
            >
              %
            </span>
          </div>
        </div>

        {/* BOTTOM PANEL */}
        <div
          ref={botRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "#0e0e14",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            overflow: "hidden",
          }}
        >
          {/* Tagline + progress bar */}
          <div
            ref={taglineRef}
            style={{
              paddingTop: "clamp(10px, 2.5vw, 24px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: "clamp(8px, 1.1vw, 10px)",
                color: "#404050",
                letterSpacing: "0.22em",
                userSelect: "none",
              }}
            >
              {tagline}
            </span>

            {/* Progress bar */}
            <div
              style={{
                width: "clamp(100px, 18vw, 180px)",
                height: 1,
                background: "#1a1a2a",
                borderRadius: 1,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                ref={progressFillRef}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to right, #7c3aed, #a78bfa)",
                  borderRadius: 1,
                }}
              />
            </div>
          </div>

          {/* BL corner */}
          <div
            ref={cornerBLRef}
            style={{ position: "absolute", bottom: 18, left: 18, width: 18, height: 18, transform: "scaleY(-1)" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 17V1H17" stroke="rgba(124,58,237,0.45)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          {/* BR corner */}
          <div
            ref={cornerBRRef}
            style={{ position: "absolute", bottom: 18, right: 18, width: 18, height: 18, transform: "scale(-1,-1)" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 17V1H17" stroke="rgba(124,58,237,0.45)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Page content — always rendered underneath, revealed when curtain splits */}
      <div style={{ visibility: done ? "visible" : "hidden" }}>{children}</div>
    </>
  );
};

export default CurtainPreloader;

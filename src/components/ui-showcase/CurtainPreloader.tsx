import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * CurtainPreloader
 *
 * Wrap your entire app with this component. The curtain covers the screen,
 * counts to 100, then splits apart revealing your content underneath.
 *
 * ── USAGE (App.tsx) ──────────────────────────────────────────────
 * import CurtainPreloader from '@/components/CurtainPreloader';
 *
 * export default function App() {
 *   return (
 *     <CurtainPreloader brandName="ACME STUDIO" tagline="CRAFTING EXPERIENCE">
 *       <YourApp />
 *     </CurtainPreloader>
 *   );
 * }
 * ─────────────────────────────────────────────────────────────────
 *
 * PROPS
 *   brandName  — displayed on the top curtain panel   (default: 'YOUR BRAND')
 *   tagline    — small label on the bottom panel      (default: 'LOADING')
 *   children   — your page content, revealed on finish
 */

interface Props {
  brandName?: string;
  tagline?: string;
  children?: React.ReactNode;
}

const STEPS = [0, 4, 9, 15, 23, 31, 40, 52, 61, 70, 78, 85, 91, 96, 100];

export default function CurtainPreloader({ brandName = "YOUR BRAND", tagline = "LOADING", children }: Props) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
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
    if (!overlayRef.current || !topRef.current || !botRef.current) return;

    // Lock body scroll (safe — restores on cleanup)
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // ── Initial states (everything hidden)
    gsap.set([brandRef.current, tagRef.current], { y: 28, opacity: 0 });
    gsap.set(counterRef.current, { opacity: 0 });
    gsap.set(fillRef.current, { scaleX: 0, transformOrigin: "left" });
    gsap.set([cTL.current, cTR.current, cBL.current, cBR.current], { opacity: 0, scale: 0.5 });

    // ── Phase 1: elements enter
    const intro = gsap.timeline();
    intro
      .to(
        [cTL.current, cTR.current, cBL.current, cBR.current],
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.07, ease: "power3.out" },
        0.1,
      )
      .to(brandRef.current, { y: 0, opacity: 1, duration: 0.65, ease: "power4.out" }, 0.2)
      .to(tagRef.current, { y: 0, opacity: 1, duration: 0.55, ease: "power4.out" }, 0.35)
      .to(counterRef.current, { opacity: 1, duration: 0.35 }, 0.5);

    // ── Phase 2: chunky non-linear count
    let idx = 0;
    const obj = { v: 0 };

    const tick = () => {
      if (idx >= STEPS.length) return;
      const target = STEPS[idx];
      const dur = idx < 5 ? 0.18 : idx < 10 ? 0.13 : 0.09;
      const gap = idx < 6 ? 0.08 : 0.05;

      gsap.to(obj, {
        v: target,
        duration: dur,
        ease: "power1.inOut",
        onUpdate: () => {
          const v = Math.round(obj.v);
          setCount(v);
          gsap.set(fillRef.current, { scaleX: v / 100 });
        },
        onComplete: () => {
          idx++;
          idx < STEPS.length ? gsap.delayedCall(gap, tick) : gsap.delayedCall(0.4, split);
        },
      });
    };

    intro.call(tick, [], "+=0.1");

    // ── Phase 3: curtain split
    const split = () => {
      gsap
        .timeline({
          onComplete: () => {
            document.body.style.overflow = prev;
            if (overlayRef.current) overlayRef.current.style.display = "none";
            setDone(true);
          },
        })
        // Fade all UI
        .to([cTL.current, cTR.current, cBL.current, cBR.current, tagRef.current, counterRef.current], {
          opacity: 0,
          duration: 0.22,
          ease: "power2.in",
        })
        .to(brandRef.current, { scale: 1.08, opacity: 0, duration: 0.3, ease: "power3.in" }, "-=0.1")
        // Panels fly apart
        .to(topRef.current, { yPercent: -100, duration: 1.05, ease: "expo.inOut" }, "-=0.05")
        .to(botRef.current, { yPercent: 100, duration: 1.05, ease: "expo.inOut" }, "<");
    };

    return () => {
      document.body.style.overflow = prev;
      intro.kill();
    };
  }, []);

  // ── Reusable corner bracket
  const Bracket = ({
    divRef,
    bottom = false,
    right = false,
  }: {
    divRef: React.RefObject<HTMLDivElement>;
    bottom?: boolean;
    right?: boolean;
  }) => (
    <div
      ref={divRef}
      style={{
        position: "absolute",
        width: 18,
        height: 18,
        [bottom ? "bottom" : "top"]: 16,
        [right ? "right" : "left"]: 16,
        transform: `scale(${right ? -1 : 1}, ${bottom ? -1 : 1})`,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M1 17V1H17" stroke="rgba(124,58,237,0.45)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );

  return (
    // Root fills whatever container it's placed in
    <div ref={rootRef} style={{ position: "relative", width: "100%", height: "100%", minHeight: "100vh" }}>
      {/* ── Curtain overlay — absolute so it works inside any container */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 9999,
          pointerEvents: done ? "none" : "all",
          // Also cover viewport when used at app root
          minHeight: "100%",
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
          <Bracket divRef={cTL} />
          <Bracket divRef={cTR} right />

          <div ref={brandRef} style={{ paddingBottom: "clamp(8px, 2vw, 22px)", textAlign: "center" }}>
            <span
              className="font-syne font-extrabold"
              style={{
                fontSize: "clamp(1.4rem, 4vw, 3rem)",
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

        {/* CENTRE DIVIDER + COUNTER */}
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
          {/* Divider line */}
          <div
            style={{
              width: "100%",
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(124,58,237,0.35) 25%, #7c3aed 50%, rgba(124,58,237,0.35) 75%, transparent)",
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
              background: "#0e0e14",
              border: "1px solid #1e1e2e",
              borderTop: "none",
              borderRadius: "0 0 8px 8px",
              padding: "4px 14px 6px",
              minWidth: 72,
            }}
          >
            <span
              className="font-syne font-extrabold"
              style={{
                fontSize: "clamp(1rem, 2.5vw, 1.6rem)",
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
              style={{ fontSize: "clamp(0.6rem, 1.3vw, 0.8rem)", color: "#505060", lineHeight: 1, marginLeft: 1 }}
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
          <div
            ref={tagRef}
            style={{
              paddingTop: "clamp(8px, 2vw, 22px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: "clamp(7px, 1vw, 10px)",
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
                width: "clamp(80px, 16vw, 160px)",
                height: 1,
                background: "#1a1a2a",
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
                  background: "linear-gradient(to right, #7c3aed, #a78bfa)",
                  borderRadius: 1,
                }}
              />
            </div>
          </div>

          <Bracket divRef={cBL} bottom />
          <Bracket divRef={cBR} bottom right />
        </div>
      </div>

      {/* Page content — in DOM while loading (good for perf), hidden until curtain splits */}
      <div style={{ visibility: done ? "visible" : "hidden", width: "100%", height: "100%" }}>{children}</div>
    </div>
  );
}

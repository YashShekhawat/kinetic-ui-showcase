import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTION COMPONENT — copy everything below this line into your project
// ─────────────────────────────────────────────────────────────────────────────
//
// USAGE (App.tsx):
//
//   import CurtainPreloader from '@/components/CurtainPreloader';
//
//   export default function App() {
//     return (
//       <CurtainPreloader brandName="ACME STUDIO" tagline="CRAFTING EXPERIENCE">
//         <YourApp />
//       </CurtainPreloader>
//     );
//   }
//
// PROPS
//   brandName  — text on top curtain panel     default: 'YOUR BRAND'
//   tagline    — small label, bottom panel     default: 'LOADING'
//   children   — your page content, revealed on finish
// ─────────────────────────────────────────────────────────────────────────────

interface CurtainPreloaderProps {
  brandName?: string;
  tagline?: string;
  children?: React.ReactNode;
}

const STEPS = [0, 4, 9, 15, 23, 31, 40, 52, 61, 70, 78, 85, 91, 96, 100];

export function CurtainPreloader({ brandName = "YOUR BRAND", tagline = "LOADING", children }: CurtainPreloaderProps) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

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

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    gsap.set([brandRef.current, tagRef.current], { y: 28, opacity: 0 });
    gsap.set(counterRef.current, { opacity: 0 });
    gsap.set(fillRef.current, { scaleX: 0, transformOrigin: "left" });
    gsap.set([cTL.current, cTR.current, cBL.current, cBR.current], { opacity: 0, scale: 0.5 });

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

    const split = () => {
      gsap
        .timeline({
          onComplete: () => {
            document.body.style.overflow = prev;
            if (overlayRef.current) overlayRef.current.style.display = "none";
            setDone(true);
          },
        })
        .to([cTL.current, cTR.current, cBL.current, cBR.current, tagRef.current, counterRef.current], {
          opacity: 0,
          duration: 0.22,
          ease: "power2.in",
        })
        .to(brandRef.current, { scale: 1.08, opacity: 0, duration: 0.3, ease: "power3.in" }, "-=0.1")
        .to(topRef.current, { yPercent: -100, duration: 1.05, ease: "expo.inOut" }, "-=0.05")
        .to(botRef.current, { yPercent: 100, duration: 1.05, ease: "expo.inOut" }, "<");
    };

    return () => {
      document.body.style.overflow = prev;
      intro.kill();
    };
  }, []);

  const Bracket = ({
    r,
    bottom = false,
    right = false,
  }: {
    r: React.RefObject<HTMLDivElement>;
    bottom?: boolean;
    right?: boolean;
  }) => (
    <div
      ref={r}
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
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "100vh" }}>
      <div
        ref={overlayRef}
        style={{ position: "absolute", inset: 0, zIndex: 9999, pointerEvents: done ? "none" : "all" }}
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
          <Bracket r={cTL} />
          <Bracket r={cTR} right />
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

        {/* CENTRE COUNTER */}
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
          <div
            style={{
              width: "100%",
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(124,58,237,0.35) 25%, #7c3aed 50%, rgba(124,58,237,0.35) 75%, transparent)",
            }}
          />
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
              style={{
                fontSize: "clamp(0.6rem, 1.3vw, 0.8rem)",
                color: "#505060",
                lineHeight: 1,
                marginLeft: 1,
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
          <Bracket r={cBL} bottom />
          <Bracket r={cBR} bottom right />
        </div>
      </div>

      {/* Children hidden until curtain splits */}
      <div style={{ visibility: done ? "visible" : "hidden", width: "100%", height: "100%" }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW WRAPPER — shows demo content after reveal so you can see the full
// animation flow inside the component card. This is NOT part of the
// production component — only CurtainPreloader above ships to users.
// ─────────────────────────────────────────────────────────────────────────────
const PreviewPage = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll("[data-item]");
    gsap.fromTo(
      items,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: "power3.out", delay: 0.15 },
    );
  }, []);

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
        padding: "40px 24px",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <div data-item style={{ opacity: 0 }}>
        <span
          className="font-mono"
          style={{
            fontSize: "9px",
            letterSpacing: "0.22em",
            color: "#7c3aed",
            border: "1px solid rgba(124,58,237,0.25)",
            background: "rgba(124,58,237,0.07)",
            padding: "3px 12px",
            borderRadius: 20,
          }}
        >
          CURTAIN PRELOADER
        </span>
      </div>

      <div data-item style={{ opacity: 0 }}>
        <h1
          className="font-syne font-extrabold"
          style={{
            fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
            color: "#f0ede8",
            margin: 0,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          Your page,
          <br />
          <span style={{ color: "transparent", WebkitTextStroke: "1.5px #7c3aed" }}>revealed.</span>
        </h1>
      </div>

      <div data-item style={{ opacity: 0, maxWidth: 340 }}>
        <p
          className="font-inter font-light"
          style={{
            fontSize: "0.82rem",
            color: "#606070",
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          The curtain counts to 100 then splits — top panel up, bottom panel down — unveiling your content in a single
          dramatic motion.
        </p>
      </div>

      <div data-item style={{ opacity: 0, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        {["expo.inOut", "Chunky counter", "Split reveal", "GSAP timeline"].map((tag) => (
          <span
            key={tag}
            className="font-mono"
            style={{
              fontSize: "9px",
              letterSpacing: "0.12em",
              color: "#404050",
              border: "1px solid #1e1e2e",
              padding: "3px 10px",
              borderRadius: 4,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

// Default export = preview (what renders in the component card)
export default function CurtainPreloaderDemo() {
  return (
    <div data-preview="true" style={{ width: "100%", height: "100%", minHeight: "100vh" }}>
      <CurtainPreloader brandName="KINETIC UI" tagline="MOTION · GSAP · REACT">
        <PreviewPage />
      </CurtainPreloader>
    </div>
  );
}

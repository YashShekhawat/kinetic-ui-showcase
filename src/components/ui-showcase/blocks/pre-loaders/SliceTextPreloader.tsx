// src/components/ui-showcase/blocks/pre-loaders/SliceTextPreloader.tsx

import { useEffect, useRef, useState, useCallback } from "react";
import type { ReactNode, CSSProperties } from "react";
import gsap from "gsap";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SliceTextPreloaderProps {
  children?: ReactNode;
  brandName?: string;
  eyebrow?: string;
  slices?: number;
}

// ---------------------------------------------------------------------------
// SliceRow — one horizontal band (module-level, never inside render)
// ---------------------------------------------------------------------------

interface SliceRowProps {
  text: string;
  index: number;
  total: number;
  bandHeightPx: number;
  fontSizePx: number;
  sliceRef: (el: HTMLDivElement | null) => void;
}

function SliceRow({ text, index, total, bandHeightPx, fontSizePx, sliceRef }: SliceRowProps) {
  const isEven = index % 2 === 0;
  const color = isEven ? "var(--theme-text-primary)" : "var(--theme-accent-light)";

  const outerStyle: CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    top: index * bandHeightPx,
    height: bandHeightPx,
    overflow: "hidden",
    willChange: "transform, opacity",
  };

  const innerStyle: CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    top: -(index * bandHeightPx),
    height: total * bandHeightPx,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const textStyle: CSSProperties = {
    fontFamily: "var(--font-syne, system-ui)",
    fontWeight: 800,
    fontSize: fontSizePx,
    letterSpacing: "-0.02em",
    textTransform: "uppercase",
    color,
    lineHeight: 1,
    userSelect: "none",
    whiteSpace: "nowrap",
    display: "block",
  };

  return (
    <div ref={sliceRef} style={outerStyle}>
      <div style={innerStyle}>
        <span style={textStyle}>{text}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SliceTextPreloader — named export (shown in Code tab)
// ---------------------------------------------------------------------------

export function SliceTextPreloader({
  children,
  brandName = "STUDIO",
  eyebrow = "WELCOME TO",
  slices = 8,
}: SliceTextPreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const sliceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [done, setDone] = useState<boolean>(false);
  const [fontSizePx, setFontSizePx] = useState<number>(120);

  const computeSize = useCallback((): void => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const containerW = overlay.offsetWidth;
    const canvas = document.createElement("canvas");
    const c = canvas.getContext("2d");
    if (!c) return;
    c.font = "800 100px system-ui";
    const w100 = c.measureText(brandName.toUpperCase()).width;
    if (w100 === 0) return;
    const px = Math.min(400, Math.max(40, ((containerW * 1.1) / w100) * 100));
    setFontSizePx(px);
  }, [brandName]);

  useEffect(() => {
    computeSize();
    const ro = new ResizeObserver(computeSize);
    const overlay = overlayRef.current;
    if (overlay) ro.observe(overlay);
    return () => ro.disconnect();
  }, [computeSize]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const eyebrowEl = eyebrowRef.current;
    const counter = counterRef.current;
    const bar = barRef.current;
    if (!overlay || !eyebrowEl || !counter || !bar) return;

    const sliceEls = sliceRefs.current.filter((s): s is HTMLDivElement => s !== null);
    if (sliceEls.length !== slices) return;

    const obj = { val: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => setDone(true),
      });

      tl.fromTo(sliceEls, (i: number) => ({ x: i % 2 === 0 ? "-6%" : "6%", opacity: 0 }), {
        x: "0%",
        opacity: 1,
        duration: 0.9,
        ease: "expo.out",
        stagger: { amount: 0.3, from: "start" as const },
      });

      tl.fromTo(eyebrowEl, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.5");

      tl.to(
        bar,
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power2.inOut",
          transformOrigin: "left center",
        },
        "-=0.2",
      );
      tl.to(
        obj,
        {
          val: 100,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counter) counter.textContent = String(Math.round(obj.val));
          },
        },
        "<",
      );

      tl.to({}, { duration: 0.25 });
      tl.to(eyebrowEl, {
        opacity: 0,
        y: -10,
        duration: 0.25,
        ease: "power2.in",
      });

      tl.to(sliceEls, {
        x: (i: number) => (i % 2 === 0 ? "115%" : "-115%"),
        opacity: 0,
        duration: 0.6,
        ease: "expo.inOut",
        stagger: { amount: 0.28, from: "center" as const },
      });

      tl.set(overlay, { display: "none" });
    }, overlay);

    return () => ctx.revert();
  }, [slices, fontSizePx]);

  const bandHeightPx = fontSizePx / slices;
  const wrapHeightPx = fontSizePx;

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "var(--theme-bg-panel)",
    overflow: "hidden",
  };

  const textStageStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  };

  const sliceWrapStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    height: wrapHeightPx,
  };

  const eyebrowStyle: CSSProperties = {
    position: "absolute",
    top: "2rem",
    left: "2rem",
    fontFamily: "var(--font-mono, monospace)",
    fontSize: "0.6rem",
    letterSpacing: "0.28em",
    color: "var(--theme-accent)",
    textTransform: "uppercase",
    opacity: 0,
  };

  const bottomBarStyle: CSSProperties = {
    position: "absolute",
    bottom: "2rem",
    left: "2rem",
    right: "2rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  };

  const trackStyle: CSSProperties = {
    flex: 1,
    height: "1px",
    background: "var(--theme-border)",
    overflow: "hidden",
    position: "relative",
  };

  const barFillStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to right, var(--theme-accent), var(--theme-accent-light))",
    transformOrigin: "left center",
    transform: "scaleX(0)",
  };

  const counterStyle: CSSProperties = {
    fontFamily: "var(--font-mono, monospace)",
    fontSize: "0.7rem",
    letterSpacing: "0.12em",
    color: "var(--theme-text-dim)",
    minWidth: "4ch",
    textAlign: "right" as const,
  };

  return (
    <>
      {!done && (
        <div ref={overlayRef} style={overlayStyle}>
          <div style={textStageStyle}>
            <div style={sliceWrapStyle}>
              {Array.from({ length: slices }).map((_, i) => (
                <SliceRow
                  key={i}
                  text={brandName}
                  index={i}
                  total={slices}
                  bandHeightPx={bandHeightPx}
                  fontSizePx={fontSizePx}
                  sliceRef={(el) => {
                    sliceRefs.current[i] = el;
                  }}
                />
              ))}
            </div>
          </div>

          {Array.from({ length: slices - 1 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `calc(50% - ${wrapHeightPx / 2}px + ${(i + 1) * bandHeightPx}px)`,
                height: "1px",
                background: "var(--theme-accent-border)",
                pointerEvents: "none",
              }}
            />
          ))}

          <div ref={eyebrowRef} style={eyebrowStyle}>
            {eyebrow}
          </div>

          <div style={bottomBarStyle}>
            <div style={trackStyle}>
              <div ref={barRef} style={barFillStyle} />
            </div>
            <div style={counterStyle}>
              <span ref={counterRef}>0</span>
              <span style={{ color: "var(--theme-text-very-dim)" }}>%</span>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}

// ---CODE---

// @preview-only — everything below is for the component card preview only.
// Do NOT copy this into your project. Only SliceTextPreloader above is needed.

interface PreviewPageProps {
  onReplay?: () => void;
}

function SlicePreviewPage({ onReplay }: PreviewPageProps) {
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
    e.currentTarget.style.borderColor = "var(--theme-accent)";
    e.currentTarget.style.color = "var(--theme-accent-light)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.style.borderColor = "var(--theme-border-hover)";
    e.currentTarget.style.color = "var(--theme-text-dim)";
  };

  return (
    <div
      ref={ref}
      style={{
        minHeight: "100vh",
        background: "var(--theme-bg-panel)",
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
          background: "radial-gradient(circle, var(--theme-accent-glow) 0%, transparent 70%)",
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
            color: "var(--theme-accent)",
            border: "1px solid var(--theme-accent-border)",
            background: "var(--theme-accent-glow)",
            padding: "3px 12px",
            borderRadius: 20,
            display: "inline-block",
          }}
        >
          SLICE TEXT PRELOADER
        </span>
      </div>

      <div data-item style={{ opacity: 0 }}>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.6rem, 5vw, 3.2rem)",
            color: "var(--theme-text-primary)",
            margin: 0,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
          }}
        >
          Oversized text,
          <br />
          <span style={{ color: "transparent", WebkitTextStroke: "1.5px var(--theme-accent)" }}>sliced apart.</span>
        </h1>
      </div>

      <div data-item style={{ opacity: 0, maxWidth: 320 }}>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: "0.82rem",
            color: "var(--theme-text-dim)",
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          Brand word fills the viewport in alternating colour bands — then each slice cuts away left or right, revealing
          your page beneath.
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
        {["expo.inOut", "Alternating slices", "Progress bar", "GSAP"].map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.12em",
              color: "var(--theme-text-very-dim)",
              border: "1px solid var(--theme-border)",
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
            border: "1px solid var(--theme-border-hover)",
            borderRadius: 8,
            color: "var(--theme-text-dim)",
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
}

export default function SliceTextPreloaderDemo() {
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
        Overrides position:fixed → absolute so the preloader stays inside
        the preview card instead of escaping to the browser viewport.
        This <style> tag is preview-only — not part of the production component.
      */}
      <style>{`[data-preview="true"] div[style*="position: fixed"] { position: absolute !important; }`}</style>
      <SliceTextPreloader key={key} brandName="KINETIC" eyebrow="WELCOME TO" slices={8}>
        <SlicePreviewPage onReplay={() => setKey((k) => k + 1)} />
      </SliceTextPreloader>
    </div>
  );
}

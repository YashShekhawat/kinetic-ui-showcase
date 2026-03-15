// src/components/ui-showcase/blocks/pre-loaders/SliceTextPreloader.tsx

import { useEffect, useRef, useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import gsap from 'gsap';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SliceTextPreloaderProps {
  /** Content rendered beneath the preloader (your app/page) */
  children?: ReactNode;
  /** Brand word displayed across the viewport */
  brandName?: string;
  /** Number of horizontal slices — default 6 */
  slices?: number;
}

// ---------------------------------------------------------------------------
// SliceTextPreloader — named export (shown in Code tab)
// ---------------------------------------------------------------------------

export function SliceTextPreloader({
  children,
  brandName = 'STUDIO',
  slices = 6,
}: SliceTextPreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const sliceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  const sliceHeight = 100 / slices;

  useEffect(() => {
    const overlay = overlayRef.current;
    const progress = progressRef.current;
    if (!overlay || !progress) return;

    const tiles = sliceRefs.current.filter(
      (t): t is HTMLDivElement => t !== null,
    );

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => setDone(true),
      });

      // 1. Progress bar fills
      tl.fromTo(
        progress,
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, duration: 2, ease: 'power2.inOut' },
      );

      // 2. Brief hold
      tl.to({}, { duration: 0.3 });

      // 3. Slices cut away — alternating left/right
      tl.to(tiles, {
        duration: 0.8,
        ease: 'expo.inOut',
        stagger: { amount: 0.35, from: 'start' },
        xPercent: (_i: number) => (_i % 2 === 0 ? -110 : 110),
        opacity: 0,
      });

      tl.set(overlay, { display: 'none' });
    }, overlay);

    return () => ctx.revert();
  }, [slices]);

  // ---------------------------------------------------------------------------
  // Palette — alternating dark/lighter bands
  // ---------------------------------------------------------------------------

  const colors = [
    '#0e0e14', // dark
    '#141420', // slightly lighter
  ];

  // ---------------------------------------------------------------------------
  // Inline styles
  // ---------------------------------------------------------------------------

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    overflow: 'hidden',
  };

  const sliceStyle = (i: number): CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: `${i * sliceHeight}%`,
    height: `${sliceHeight + 0.5}%`, // +0.5 to prevent sub-pixel gaps
    background: colors[i % 2],
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    willChange: 'transform, opacity',
  });

  const textStyle: CSSProperties = {
    fontFamily: "var(--font-syne, 'Syne', system-ui)",
    fontWeight: 900,
    fontSize: 'clamp(4rem, 18vw, 14rem)',
    letterSpacing: '-0.03em',
    color: '#f0ede8',
    opacity: 0.06,
    lineHeight: 1,
    userSelect: 'none',
    whiteSpace: 'nowrap',
    position: 'absolute',
    // Each slice clips the same big text — offset so they combine into one word
  };

  const progressTrackStyle: CSSProperties = {
    position: 'absolute',
    bottom: '3rem',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'clamp(80px, 25vw, 160px)',
    height: 2,
    background: '#1e1e2e',
    borderRadius: 1,
    zIndex: 1,
    overflow: 'hidden',
  };

  const progressBarStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: '#7c3aed',
    borderRadius: 1,
  };

  return (
    <>
      {!done && (
        <div ref={overlayRef} style={overlayStyle}>
          {Array.from({ length: slices }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                sliceRefs.current[i] = el;
              }}
              style={sliceStyle(i)}
            >
              {/* Brand text — positioned so all slices together show the full word */}
              <span
                style={{
                  ...textStyle,
                  top: `calc(50vh - ${i * sliceHeight}% - 0.5em)`,
                  transform: 'translateY(-50%)',
                }}
              >
                {brandName}
              </span>
            </div>
          ))}

          {/* Progress bar */}
          <div style={progressTrackStyle}>
            <div ref={progressRef} style={progressBarStyle} />
          </div>
        </div>
      )}

      {children}
    </>
  );
}

// ---CODE---

// @preview-only — everything below is for preview card only.
// NOT shown in Code tab. Do NOT copy into your project.

import { PreviewPageShell } from './_PreviewPageShell';

export default function SliceTextPreloaderDemo() {
  const [key, setKey] = useState<number>(0);
  return (
    <div
      data-preview="true"
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <style>{`[data-preview="true"] > div > div[style*="position: fixed"] { position: absolute !important; }`}</style>
      <SliceTextPreloader key={key} brandName="KINETIC">
        <PreviewPageShell
          badge="SLICE TEXT PRELOADER"
          title={
            <>
              Oversized text,
              <br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px #7c3aed' }}>sliced apart.</span>
            </>
          }
          description="Brand word fills the viewport in alternating colour bands — then each slice cuts away left or right, revealing your page beneath."
          tags={['expo.inOut', 'Alternating slices', 'Progress bar', 'GSAP']}
          onReplay={() => setKey((k) => k + 1)}
        />
      </SliceTextPreloader>
    </div>
  );
}

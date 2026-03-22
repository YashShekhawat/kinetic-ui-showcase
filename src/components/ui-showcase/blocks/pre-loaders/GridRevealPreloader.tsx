// src/components/ui-showcase/blocks/pre-loaders/GridRevealPreloader.tsx

import { useEffect, useRef, useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import gsap from 'gsap';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GridRevealPreloaderProps {
  /** Content rendered beneath the preloader (your app/page) */
  children?: ReactNode;
  /** Brand / site name shown during load */
  brandName?: string;
  /** Sub-label shown below brand name */
  tagline?: string;
  /** Number of grid columns — default 6 */
  cols?: number;
  /** Number of grid rows — default 5 */
  rows?: number;
}

// ---------------------------------------------------------------------------
// Pre-compute fly directions — stable, deterministic, never re-computed
// ---------------------------------------------------------------------------

function getTileTransform(
  index: number,
  total: number,
): { x: number; y: number } {
  const seed = (index * 2654435761) % total;
  const angle = (seed / total) * Math.PI * 2;
  const dist = 120 + (index % 5) * 30;
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
  };
}

// ---------------------------------------------------------------------------
// Tile — module-level helper (never defined inside render)
// ---------------------------------------------------------------------------

interface TileProps {
  index: number;
  total: number;
  tileRef: (el: HTMLDivElement | null) => void;
}

function Tile({ index, total, tileRef }: TileProps) {
  const lightness = 7 + Math.round((index / total) * 5);
  const tileStyle: CSSProperties = {
    background: `hsl(248, 18%, ${lightness}%)`,
    width: '100%',
    height: '100%',
    willChange: 'transform, opacity',
  };
  return <div ref={tileRef} style={tileStyle} />;
}

// ---------------------------------------------------------------------------
// GridRevealPreloader — named export (shown in Code tab)
// ---------------------------------------------------------------------------

export function GridRevealPreloader({
  children,
  brandName = 'STUDIO',
  tagline = 'LOADING EXPERIENCE',
  cols = 6,
  rows = 5,
}: GridRevealPreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [done, setDone] = useState<boolean>(false);

  const totalTiles = cols * rows;

  const tileTransforms = useRef<{ x: number; y: number }[]>(
    Array.from({ length: totalTiles }, (_, i) =>
      getTileTransform(i, totalTiles),
    ),
  );

  useEffect(() => {
    const overlay = overlayRef.current;
    const brand = brandRef.current;
    const taglineEl = taglineRef.current;
    const counter = counterRef.current;
    if (!overlay || !brand || !taglineEl || !counter) return;

    const tiles = tileRefs.current.filter(
      (t): t is HTMLDivElement => t !== null,
    );
    const obj = { val: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => setDone(true),
      });

      // 1. Brand slides up
      tl.fromTo(
        brand,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7 },
      );

      // 2. Tagline fades in
      tl.fromTo(
        taglineEl,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.4',
      );

      // 3. Counter 0 → 100
      tl.to(
        obj,
        {
          val: 100,
          duration: 1.8,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (counter) counter.textContent = String(Math.round(obj.val));
          },
        },
        '-=0.3',
      );

      // 4. Fade out brand text
      tl.to(
        [brand, taglineEl],
        { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' },
        '+=0.1',
      );

      // 5. Tiles scatter outward in all directions
      tl.to(
        tiles,
        {
          duration: 0.7,
          ease: 'expo.inOut',
          stagger: { amount: 0.5, from: 'random' as const },
          opacity: 0,
          scale: 0.8,
          x: (i: number) => tileTransforms.current[i]?.x ?? 0,
          y: (i: number) => tileTransforms.current[i]?.y ?? 0,
        },
        '-=0.15',
      );

      tl.set(overlay, { display: 'none' });
    }, overlay);

    return () => ctx.revert();
  }, []);

  // ---------------------------------------------------------------------------
  // Inline styles
  // ---------------------------------------------------------------------------

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    overflow: 'hidden',
  };

  const gridStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gap: '1px',
    background: '#1e1e2e',
  };

  const hudStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    gap: '12px',
  };

  const brandTextStyle: CSSProperties = {
    fontFamily: 'var(--font-syne, system-ui)',
    fontWeight: 800,
    fontSize: 'clamp(2rem, 6vw, 5rem)',
    letterSpacing: '0.12em',
    color: '#f0ede8',
    textTransform: 'uppercase',
    lineHeight: 1,
    textAlign: 'center',
  };

  const accentLineStyle: CSSProperties = {
    width: 'clamp(40px, 6vw, 80px)',
    height: '1px',
    background: 'linear-gradient(to right, transparent, #7c3aed, transparent)',
    margin: '10px auto 0',
  };

  const taglineTextStyle: CSSProperties = {
    fontFamily: 'var(--font-mono, monospace)',
    fontSize: 'clamp(0.55rem, 1.2vw, 0.7rem)',
    letterSpacing: '0.25em',
    color: '#7c3aed',
    textTransform: 'uppercase',
  };

  const counterStyle: CSSProperties = {
    position: 'absolute',
    bottom: '2.5rem',
    right: '3rem',
    fontFamily: 'var(--font-mono, monospace)',
    fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
    letterSpacing: '0.15em',
    color: '#606070',
  };

  return (
    <>
      {!done && (
        <div ref={overlayRef} style={overlayStyle}>
          {/* Tile grid */}
          <div style={gridStyle}>
            {Array.from({ length: totalTiles }).map((_, i) => (
              <Tile
                key={i}
                index={i}
                total={totalTiles}
                tileRef={(el) => {
                  tileRefs.current[i] = el;
                }}
              />
            ))}
          </div>

          {/* Brand HUD */}
          <div style={hudStyle}>
            <div ref={brandRef} style={{ opacity: 0, textAlign: 'center' }}>
              <div style={brandTextStyle}>{brandName}</div>
              <div style={accentLineStyle} />
            </div>
            <div ref={taglineRef} style={{ ...taglineTextStyle, opacity: 0 }}>
              {tagline}
            </div>
          </div>

          {/* Counter */}
          <div style={counterStyle}>
            <span ref={counterRef}>0</span>
            <span style={{ color: '#404050' }}> / 100</span>
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

export default function GridRevealPreloaderDemo() {
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
      <style>{`[data-preview="true"] div[style*="position: fixed"] { position: absolute !important; }`}</style>
      <GridRevealPreloader key={key} brandName="KINETIC" tagline="CRAFTING MOTION">
        <PreviewPageShell
          badge="GRID REVEAL PRELOADER"
          title={
            <>
              Tiles shatter,
              <br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px #7c3aed' }}>page reveals.</span>
            </>
          }
          description="Screen splits into a grid of tiles that scatter outward in all directions, exposing your content beneath."
          tags={['expo.inOut', 'Random stagger', 'Grid tiles', 'GSAP']}
          onReplay={() => setKey((k) => k + 1)}
        />
      </GridRevealPreloader>
    </div>
  );
}

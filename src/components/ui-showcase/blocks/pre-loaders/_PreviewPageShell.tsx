// src/components/ui-showcase/blocks/pre-loaders/_PreviewPageShell.tsx
// Shared preview-page shell used by all preloader demo wrappers.
// NOT a production component — preview-only.

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';

export interface PreviewPageShellProps {
  badge: string;
  title: ReactNode;
  description: string;
  tags: string[];
  onReplay?: () => void;
}

export function PreviewPageShell({
  badge,
  title,
  description,
  tags,
  onReplay,
}: PreviewPageShellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>('[data-item]');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.15,
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const handleReplay = (): void => {
    const btn = btnRef.current;
    if (!btn) return;
    gsap.to(btn, {
      scale: 0.92,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        onReplay?.();
      },
    });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.style.borderColor = 'var(--theme-accent)';
    e.currentTarget.style.color = 'var(--theme-accent-light)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.style.borderColor = 'var(--theme-border-hover)';
    e.currentTarget.style.color = 'var(--theme-text-dim)';
  };

  return (
    <div
      ref={ref}
      style={{
        minHeight: '100vh',
        background: 'var(--theme-bg-panel)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: '40px 20px',
        textAlign: 'center',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* Badge */}
      <div data-item style={{ opacity: 0 }}>
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '9px',
            letterSpacing: '0.22em',
            color: 'var(--theme-accent)',
            border: '1px solid rgba(124,58,237,0.25)',
            background: 'rgba(124,58,237,0.07)',
            padding: '3px 12px',
            borderRadius: 20,
            display: 'inline-block',
          }}
        >
          {badge}
        </span>
      </div>

      {/* Title */}
      <div data-item style={{ opacity: 0 }}>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(1.6rem, 5vw, 3.2rem)',
            color: 'var(--theme-text-primary)',
            margin: 0,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
          }}
        >
          {title}
        </h1>
      </div>

      {/* Description */}
      <div data-item style={{ opacity: 0, maxWidth: 320 }}>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: '0.82rem',
            color: 'var(--theme-text-dim)',
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>

      {/* Tags */}
      <div
        data-item
        style={{
          opacity: 0,
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: 'monospace',
              fontSize: '9px',
              letterSpacing: '0.12em',
              color: 'var(--theme-text-very-dim)',
              border: '1px solid var(--theme-border)',
              padding: '3px 10px',
              borderRadius: 4,
              display: 'inline-block',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Replay button */}
      <div data-item style={{ opacity: 0, marginTop: 4 }}>
        <button
          ref={btnRef}
          onClick={handleReplay}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 20px',
            background: 'transparent',
            border: '1px solid var(--theme-border-hover)',
            borderRadius: 8,
            color: 'var(--theme-text-dim)',
            cursor: 'pointer',
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: '0.78rem',
            letterSpacing: '0.05em',
            transition: 'border-color 0.2s, color 0.2s',
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

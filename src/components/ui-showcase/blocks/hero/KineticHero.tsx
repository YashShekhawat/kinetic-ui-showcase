import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

const KineticHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const shape1Ref = useRef<HTMLDivElement>(null);
  const shape3Ref = useRef<HTMLDivElement>(null);
  const quickX1 = useRef<gsap.QuickToFunc | null>(null);
  const quickY1 = useRef<gsap.QuickToFunc | null>(null);
  const quickX3 = useRef<gsap.QuickToFunc | null>(null);
  const quickY3 = useRef<gsap.QuickToFunc | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 3, defaults: { ease: 'power4.out' } });

      if (!isMobile) {
        tl.fromTo('.kh-shape', 
          { scale: 0, opacity: 0 }, 
          { scale: 1, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'elastic.out(1,0.5)' }, 
          0
        );
      }

      tl.fromTo('.kh-line-inner', 
        { y: '100%' }, 
        { y: '0%', duration: 0.7, stagger: 0.08 }, 
        0.3
      );

      tl.fromTo(['.kh-badge', '.kh-scroll-text'], 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.4 }, 
        0.8
      );

      tl.fromTo('.kh-line2-fill', 
        { clipPath: 'inset(0 100% 0 0)' }, 
        { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power3.inOut' }, 
        1.0
      );

      tl.fromTo('.kh-desc', 
        { opacity: 0, y: 10 }, 
        { opacity: 1, y: 0, duration: 0.5 }, 
        1.1
      );

      tl.fromTo('.kh-cta', 
        { opacity: 0, y: 10 }, 
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }, 
        1.3
      );

      if (!isMobile) {
        tl.fromTo('.kh-bottom', 
          { opacity: 0 }, 
          { opacity: 1, duration: 0.5 }, 
          1.6
        );

        tl.fromTo('.kh-count', 
          { innerText: 0 }, 
          { 
            innerText: 60, 
            duration: 1.2, 
            snap: { innerText: 1 }, 
            ease: 'power2.out',
            onUpdate: function() {
              const targets = document.querySelectorAll('.kh-count');
              targets.forEach(t => {
                t.textContent = Math.round(Number(t.textContent || '0')) + '+';
              });
            }
          }, 
          1.6
        );
      }

      tl.to({}, { duration: 3 });
      tl.to(['.kh-badge', '.kh-scroll-text', '.kh-desc', '.kh-cta', '.kh-bottom'], 
        { opacity: 0, duration: 0.4 }, '+=0'
      );
      tl.to('.kh-line-inner', { y: '-100%', duration: 0.5, stagger: 0.05 }, '-=0.2');
      tl.to('.kh-line2-fill', { clipPath: 'inset(0 100% 0 0)', duration: 0.3 }, '-=0.4');
      if (!isMobile) {
        tl.to('.kh-shape', { scale: 0, opacity: 0, duration: 0.4, stagger: 0.05 }, '-=0.3');
      }

      if (!isMobile) {
        gsap.to('.kh-s1', { y: -20, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to('.kh-s2', { rotation: 360, duration: 12, repeat: -1, ease: 'none' });
        gsap.to('.kh-s2', { y: -14, duration: 5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to('.kh-s3', { y: -18, duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1 });
        gsap.to('.kh-s4', { rotation: 360, duration: 30, repeat: -1, ease: 'none' });
      }

      gsap.to('.kh-dot', { opacity: 0, duration: 1, repeat: -1, yoyo: true, ease: 'power2.inOut' });

      if (!isMobile && shape1Ref.current) {
        quickX1.current = gsap.quickTo(shape1Ref.current, 'x', { duration: 0.6, ease: 'power3.out' });
        quickY1.current = gsap.quickTo(shape1Ref.current, 'y', { duration: 0.6, ease: 'power3.out' });
      }
      if (!isMobile && shape3Ref.current) {
        quickX3.current = gsap.quickTo(shape3Ref.current, 'x', { duration: 0.8, ease: 'power3.out' });
        quickY3.current = gsap.quickTo(shape3Ref.current, 'y', { duration: 0.8, ease: 'power3.out' });
      }
    }, ref);

    const handleMouse = (e: MouseEvent) => {
      if (!ref.current || isMobile) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;

      quickX1.current?.(cx * 30);
      quickY1.current?.(cy * 30);
      quickX3.current?.(cx * 20);
      quickY3.current?.(cy * 20);
    };

    if (!isMobile) {
      ref.current?.addEventListener('mousemove', handleMouse);
    }
    const el = ref.current;

    return () => {
      el?.removeEventListener('mousemove', handleMouse);
      ctx.revert();
    };
  }, [isMobile]);

  const headingStyle: React.CSSProperties = isMobile
    ? { fontSize: 'clamp(1.8rem, 7vw, 2.4rem)', letterSpacing: '-0.01em', lineHeight: 1.1 }
    : { fontSize: 'clamp(1.6rem, 4vw, 3.2rem)', letterSpacing: '-0.01em', lineHeight: 1.1 };

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: 'var(--theme-bg-panel)', pointerEvents: 'none' }}
    >
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 70% at 30% 50%, rgba(124,58,237,0.1), transparent)',
      }} />

      {/* Dot grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, var(--theme-border) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* Floating geometry — hidden on mobile */}
      {!isMobile && (
        <div>
          <div ref={shape1Ref} className="kh-shape kh-s1 absolute pointer-events-none" style={{
            width: 78, height: 78,
            border: '1.5px solid rgba(124,58,237,0.25)',
            top: '15%', right: '20%', zIndex: 1,
          }} />
          <div className="kh-shape kh-s2 absolute pointer-events-none rounded-full" style={{
            width: 52, height: 52,
            border: '1.5px solid rgba(167,139,250,0.2)',
            top: '55%', right: '35%', zIndex: 1,
          }} />
          <div ref={shape3Ref} className="kh-shape kh-s3 absolute pointer-events-none" style={{
            width: 39, height: 39,
            border: '1.5px solid rgba(124,58,237,0.15)',
            top: '25%', right: '42%', zIndex: 1,
            transform: 'rotate(45deg)',
          }} />
          <div className="kh-shape kh-s4 absolute pointer-events-none rounded-full" style={{
            width: 130, height: 130,
            border: '1px solid rgba(124,58,237,0.06)',
            top: '35%', right: '15%', zIndex: 1,
          }} />
        </div>
      )}

      {/* Main content */}
      <div className="relative z-[2] flex flex-col justify-center" style={{ padding: isMobile ? '24px 20px' : '48px 16px' }}>
        <div className="relative z-[2] flex flex-col justify-center" style={{ padding: isMobile ? '0' : '48px 64px' }}>
          <div style={{ maxWidth: isMobile ? '100%' : '65%' }}>
            {/* Top row */}
            <div className="flex items-center justify-between mb-3">
              <div className="kh-badge opacity-0 flex items-center gap-2 rounded" style={{
                border: '1px solid rgba(124,58,237,0.2)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: isMobile ? 9 : 10,
                color: 'var(--theme-accent-light)',
                padding: isMobile ? '4px 8px' : '4px 12px',
              }}>
                <span className="kh-dot inline-block rounded-full" style={{ width: 6, height: 6, background: '#22c55e' }} />
                AVAILABLE FOR WORK
              </div>
              {!isMobile && (
                <div className="kh-scroll-text opacity-0" style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 9, color: 'var(--theme-text-very-dim)',
                  letterSpacing: '0.2em',
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}>
                  SCROLL TO EXPLORE
                </div>
              )}
            </div>

            {/* Heading */}
            <div>
              <div className="overflow-hidden">
                <div className="kh-line-inner font-syne font-extrabold tracking-tight" style={{ ...headingStyle, color: 'var(--theme-text-primary)' }}>
                  BUILD BOLD.
                </div>
              </div>
              <div className="overflow-hidden relative">
                <div className="kh-line-inner font-syne font-extrabold tracking-tight" style={{ ...headingStyle, WebkitTextStroke: '2px var(--theme-text-primary)', color: 'transparent' }}>
                  SHIP FAST.
                </div>
                <div className="kh-line2-fill absolute inset-0 font-syne font-extrabold tracking-tight" style={{ ...headingStyle, color: 'var(--theme-text-primary)', clipPath: 'inset(0 100% 0 0)' }}>
                  SHIP FAST.
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="kh-line-inner font-syne font-extrabold tracking-tight" style={{ ...headingStyle, color: 'var(--theme-accent)' }}>
                  LOOK STUNNING.
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="kh-desc opacity-0 font-inter font-light" style={{
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              color: 'var(--theme-text-muted)',
              maxWidth: isMobile ? '100%' : 480,
              lineHeight: 1.7,
              marginTop: isMobile ? 12 : 20,
            }}>
              Craft interfaces that stop people mid-scroll.<br />
              GSAP-powered. React-ready. Copy and ship.
            </p>

            {/* CTA Row */}
            <div className="flex gap-2" style={{
              flexDirection: isMobile ? 'column' : 'row',
              marginTop: isMobile ? 20 : 24,
              alignItems: isMobile ? 'stretch' : 'center',
            }}>
              <button
                className="kh-cta opacity-0 font-syne font-semibold rounded-md text-white text-center"
                style={{
                  background: 'var(--theme-accent)',
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  padding: isMobile ? '10px 0' : '12px 28px',
                  width: isMobile ? '100%' : 'auto',
                  pointerEvents: 'auto',
                }}
              >
                Get Started
              </button>
              <button
                className="kh-cta opacity-0 font-inter rounded-md text-center"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--theme-border-hover)',
                  color: 'var(--theme-text-muted)',
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  padding: isMobile ? '10px 0' : '12px 28px',
                  width: isMobile ? '100%' : 'auto',
                  pointerEvents: 'auto',
                }}
              >
                View Components →
              </button>
            </div>

            {/* Social proof row — mobile only shows wrapped items without separator */}
            {isMobile && (
              <div className="flex flex-wrap gap-2 mt-4" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--theme-text-very-dim)' }}>
                {['GH', 'TW', 'LI'].map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar — hidden on mobile */}
      {!isMobile && (
        <div className="kh-bottom opacity-0 w-full z-[2] flex items-center justify-between px-12 py-3" style={{
          borderTop: '1px solid var(--theme-border)',
        }}>
          <div className="flex items-center" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--theme-text-dim)' }}>
            <span><span className="kh-count">60+</span> Components</span>
            <span className="mx-4" style={{ width: 1, height: 16, background: 'var(--theme-border)', display: 'inline-block' }} />
            <span>Pure GSAP</span>
            <span className="mx-4" style={{ width: 1, height: 16, background: 'var(--theme-border)', display: 'inline-block' }} />
            <span>MIT License</span>
          </div>
          <div className="flex items-center gap-1" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--theme-text-very-dim)' }}>
            {['GH', 'TW', 'LI'].map((label, i) => (
              <span key={label}>
                <span className="cursor-pointer">{label}</span>
                {i < 2 && <span className="mx-1">·</span>}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KineticHero;

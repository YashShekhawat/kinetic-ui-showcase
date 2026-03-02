import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const KineticHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const shape1Ref = useRef<HTMLDivElement>(null);
  const shape3Ref = useRef<HTMLDivElement>(null);
  const quickX1 = useRef<gsap.QuickToFunc | null>(null);
  const quickY1 = useRef<gsap.QuickToFunc | null>(null);
  const quickX3 = useRef<gsap.QuickToFunc | null>(null);
  const quickY3 = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 3, defaults: { ease: 'power4.out' } });

      // 0.0s — Geometry shapes scale in
      tl.fromTo('.kh-shape', 
        { scale: 0, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'elastic.out(1,0.5)' }, 
        0
      );

      // 0.3s — Heading lines stagger up
      tl.fromTo('.kh-line-inner', 
        { y: '100%' }, 
        { y: '0%', duration: 0.7, stagger: 0.08 }, 
        0.3
      );

      // 0.8s — Badge + rotated text
      tl.fromTo(['.kh-badge', '.kh-scroll-text'], 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.4 }, 
        0.8
      );

      // 1.0s — Line 2 outline fill (clip-path reveal)
      tl.fromTo('.kh-line2-fill', 
        { clipPath: 'inset(0 100% 0 0)' }, 
        { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power3.inOut' }, 
        1.0
      );

      // 1.1s — Description
      tl.fromTo('.kh-desc', 
        { opacity: 0, y: 10 }, 
        { opacity: 1, y: 0, duration: 0.5 }, 
        1.1
      );

      // 1.3s — CTA buttons
      tl.fromTo('.kh-cta', 
        { opacity: 0, y: 10 }, 
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }, 
        1.3
      );

      // 1.6s — Bottom bar
      tl.fromTo('.kh-bottom', 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.5 }, 
        1.6
      );

      // Count-up for numbers
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

      // Hold then fade out for loop
      tl.to({}, { duration: 3 });
      tl.to(['.kh-badge', '.kh-scroll-text', '.kh-desc', '.kh-cta', '.kh-bottom'], 
        { opacity: 0, duration: 0.4 }, '+=0'
      );
      tl.to('.kh-line-inner', { y: '-100%', duration: 0.5, stagger: 0.05 }, '-=0.2');
      tl.to('.kh-line2-fill', { clipPath: 'inset(0 100% 0 0)', duration: 0.3 }, '-=0.4');
      tl.to('.kh-shape', { scale: 0, opacity: 0, duration: 0.4, stagger: 0.05 }, '-=0.3');

      // Floating animations (persistent)
      gsap.to('.kh-s1', { y: -20, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.kh-s2', { rotation: 360, duration: 12, repeat: -1, ease: 'none' });
      gsap.to('.kh-s2', { y: -14, duration: 5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.kh-s3', { y: -18, duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1 });
      gsap.to('.kh-s4', { rotation: 360, duration: 30, repeat: -1, ease: 'none' });

      // Blinking dot
      gsap.to('.kh-dot', { opacity: 0, duration: 1, repeat: -1, yoyo: true, ease: 'power2.inOut' });

      // quickTo for mousemove shapes
      if (shape1Ref.current) {
        quickX1.current = gsap.quickTo(shape1Ref.current, 'x', { duration: 0.6, ease: 'power3.out' });
        quickY1.current = gsap.quickTo(shape1Ref.current, 'y', { duration: 0.6, ease: 'power3.out' });
      }
      if (shape3Ref.current) {
        quickX3.current = gsap.quickTo(shape3Ref.current, 'x', { duration: 0.8, ease: 'power3.out' });
        quickY3.current = gsap.quickTo(shape3Ref.current, 'y', { duration: 0.8, ease: 'power3.out' });
      }
    }, ref);

    const handleMouse = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;

      quickX1.current?.(cx * 30);
      quickY1.current?.(cy * 30);
      quickX3.current?.(cx * 20);
      quickY3.current?.(cy * 20);
    };

    ref.current?.addEventListener('mousemove', handleMouse);
    const el = ref.current;

    return () => {
      el?.removeEventListener('mousemove', handleMouse);
      ctx.revert();
    };
  }, []);

  const headingStyle = {
    fontSize: 'clamp(1.6rem, 4vw, 3.2rem)',
    letterSpacing: '-0.01em',
    lineHeight: 1.1,
  };

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#0e0e14' }}
    >
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 70% at 30% 50%, rgba(124,58,237,0.1), transparent)',
      }} />

      {/* Dot grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #181828 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* Floating geometry — reduced by 35%, hidden on mobile */}
      <div className="hidden md:block">
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

      {/* Main content — reduced padding */}
      <div className="relative z-[2] flex flex-col justify-center px-6 md:px-16" style={{ padding: '48px 16px', paddingLeft: undefined, paddingRight: undefined }}>
        <div className="relative z-[2] flex flex-col justify-center px-6 md:px-16 py-12">
          <div className="md:max-w-[65%]">
            {/* Top row */}
            <div className="flex items-center justify-between mb-3">
              <div className="kh-badge opacity-0 flex items-center gap-2 px-3 py-1 rounded" style={{
                border: '1px solid rgba(124,58,237,0.2)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10, color: '#a78bfa',
              }}>
                <span className="kh-dot inline-block rounded-full" style={{ width: 6, height: 6, background: '#22c55e' }} />
                AVAILABLE FOR WORK
              </div>
              <div className="kh-scroll-text opacity-0 hidden md:block" style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 9, color: '#404050',
                letterSpacing: '0.2em',
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}>
                SCROLL TO EXPLORE
              </div>
            </div>

            {/* Heading */}
            <div>
              {/* Line 1 */}
              <div className="overflow-hidden">
                <div className="kh-line-inner font-syne font-extrabold tracking-tight" style={{
                  ...headingStyle,
                  color: '#f0ede8',
                }}>
                  BUILD BOLD.
                </div>
              </div>
              {/* Line 2 — outline with fill */}
              <div className="overflow-hidden relative">
                <div className="kh-line-inner font-syne font-extrabold tracking-tight" style={{
                  ...headingStyle,
                  WebkitTextStroke: '2px #f0ede8',
                  color: 'transparent',
                }}>
                  SHIP FAST.
                </div>
                {/* Fill overlay */}
                <div className="kh-line2-fill absolute inset-0 font-syne font-extrabold tracking-tight" style={{
                  ...headingStyle,
                  color: '#f0ede8',
                  clipPath: 'inset(0 100% 0 0)',
                }}>
                  SHIP FAST.
                </div>
              </div>
              {/* Line 3 */}
              <div className="overflow-hidden">
                <div className="kh-line-inner font-syne font-extrabold tracking-tight" style={{
                  ...headingStyle,
                  color: '#7c3aed',
                }}>
                  LOOK STUNNING.
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="kh-desc opacity-0 font-inter font-light mt-5" style={{
              fontSize: '0.9rem', color: '#707080',
              maxWidth: 480, lineHeight: 1.7,
            }}>
              Craft interfaces that stop people mid-scroll.<br />
              GSAP-powered. React-ready. Copy and ship.
            </p>

            {/* CTA Row */}
            <div className="flex flex-col md:flex-row gap-3 mt-6 items-start md:items-center">
              <button
                className="kh-cta opacity-0 font-syne font-semibold text-sm px-7 py-3 rounded-md text-white w-full md:w-auto"
                style={{ background: '#7c3aed' }}
                onMouseEnter={e => gsap.to(e.currentTarget, { background: '#8b47ff', scale: 1.03, boxShadow: '0 0 30px rgba(124,58,237,0.35)', duration: 0.2 })}
                onMouseLeave={e => gsap.to(e.currentTarget, { background: '#7c3aed', scale: 1, boxShadow: 'none', duration: 0.2 })}
              >
                Get Started
              </button>
              <button
                className="kh-cta opacity-0 font-inter text-sm px-7 py-3 rounded-md w-full md:w-auto"
                style={{ background: 'transparent', border: '1px solid #2a2a3e', color: '#707080' }}
                onMouseEnter={e => gsap.to(e.currentTarget, { borderColor: '#a78bfa', color: '#f0ede8', duration: 0.2 })}
                onMouseLeave={e => gsap.to(e.currentTarget, { borderColor: '#2a2a3e', color: '#707080', duration: 0.2 })}
              >
                View Components →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="kh-bottom opacity-0 w-full z-[2] flex items-center justify-between px-4 md:px-12 py-3" style={{
        borderTop: '1px solid #1a1a2a',
      }}>
        {/* Stats — hidden on mobile */}
        <div className="hidden md:flex items-center" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#505060' }}>
          <span><span className="kh-count">60+</span> Components</span>
          <span className="mx-4" style={{ width: 1, height: 16, background: '#1a1a2a', display: 'inline-block' }} />
          <span>Pure GSAP</span>
          <span className="mx-4" style={{ width: 1, height: 16, background: '#1a1a2a', display: 'inline-block' }} />
          <span>MIT License</span>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-1" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#404050' }}>
          {['GH', 'TW', 'LI'].map((label, i) => (
            <span key={label}>
              <span
                className="cursor-pointer"
                onMouseEnter={e => gsap.to(e.currentTarget, { color: '#f0ede8', duration: 0.2 })}
                onMouseLeave={e => gsap.to(e.currentTarget, { color: '#404050', duration: 0.2 })}
              >
                {label}
              </span>
              {i < 2 && <span className="mx-1">·</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KineticHero;

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

const PARTICLE_POSITIONS = [
  { top: '20%', left: '30%' },
  { top: '70%', left: '20%' },
  { top: '15%', left: '70%' },
  { top: '80%', left: '75%' },
  { top: '40%', left: '85%' },
  { top: '55%', left: '15%' },
];

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const strokeRef = useRef<HTMLSpanElement>(null);
  const socialLineRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const primaryOrbRef = useRef<HTMLDivElement>(null);
  const secondaryOrbRef = useRef<HTMLDivElement>(null);
  const accentOrbRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const ring3Ref = useRef<HTMLDivElement>(null);
  const orbitDotRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo('.hero-divider', { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: 'power2.out' }, 0);
      tl.fromTo('.sh-badge', { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.5 }, 0.3);
      tl.fromTo('.sh-line-inner', { y: '100%' }, { y: '0%', duration: 0.8, stagger: 0.1 }, 0.6);
      tl.fromTo('.sh-sub', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 1.1);
      tl.fromTo('.sh-cta', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 1.3);
      tl.fromTo('.sh-social', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.5);
      tl.fromTo('.sh-scroll', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.8);
      gsap.to('.sh-scroll-dot', { y: 8, duration: 1.2, repeat: -1, yoyo: true, ease: 'power2.inOut' });

      if (socialLineRef.current) {
        tl.fromTo(socialLineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, 2.0);
      }

      if (strokeRef.current) {
        gsap.to(strokeRef.current, {
          WebkitTextStrokeColor: '#a78bfa',
          repeat: -1, yoyo: true, duration: 2, ease: 'sine.inOut',
        });
      }

      // Right panel animations
      if (rightPanelRef.current) {
        gsap.fromTo(rightPanelRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.3 });
      }
      if (primaryOrbRef.current) {
        gsap.to(primaryOrbRef.current, { scale: 1.15, opacity: 0.8, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      }
      if (secondaryOrbRef.current) {
        gsap.to(secondaryOrbRef.current, { x: -20, y: 15, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      }
      if (accentOrbRef.current) {
        gsap.to(accentOrbRef.current, { x: 15, y: -20, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      }
      if (ring1Ref.current) {
        gsap.to(ring1Ref.current, { rotation: 360, duration: 30, ease: 'none', repeat: -1, transformOrigin: 'center center' });
      }
      if (ring2Ref.current) {
        gsap.to(ring2Ref.current, { rotation: -360, duration: 20, ease: 'none', repeat: -1, transformOrigin: 'center center' });
      }
      if (ring3Ref.current) {
        gsap.to(ring3Ref.current, { rotation: 360, duration: 12, ease: 'none', repeat: -1, transformOrigin: 'center center' });
      }

      // Particles
      particlesRef.current.forEach((p, i) => {
        if (!p) return;
        gsap.to(p, {
          y: -12 + Math.random() * 24,
          x: -8 + Math.random() * 16,
          opacity: 0.3 + Math.random() * 0.5,
          duration: 3 + Math.random() * 3,
          ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.4,
        });
      });
    }, sectionRef);

    // Orbiting dot ticker
    let tickerFn: (() => void) | null = null;
    if (orbitDotRef.current) {
      const startTime = Date.now();
      tickerFn = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const angle = (elapsed / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 130;
        const y = Math.sin(angle) * 130;
        if (orbitDotRef.current) {
          orbitDotRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        }
      };
      gsap.ticker.add(tickerFn);
    }

    return () => {
      ctx.revert();
      if (tickerFn) gsap.ticker.remove(tickerFn);
    };
  }, []);

  // Cursor glow
  useEffect(() => {
    const isFineCursor = window.matchMedia('(pointer: fine)').matches;
    if (!isFineCursor || !sectionRef.current || !cursorGlowRef.current) return;
    const section = sectionRef.current;
    const glow = cursorGlowRef.current;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      gsap.to(glow, { x: e.clientX - rect.left - 200, y: e.clientY - rect.top - 200, duration: 0.6, ease: 'power2.out' });
    };
    const onEnter = () => { gsap.to(glow, { opacity: 1, duration: 0.3 }); };
    const onLeave = () => { gsap.to(glow, { opacity: 0, duration: 0.3 }); };

    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseenter', onEnter);
    section.addEventListener('mouseleave', onLeave);
    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseenter', onEnter);
      section.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const hoverCta = (e: React.MouseEvent, enter: boolean) => {
    gsap.to(e.currentTarget, { scale: enter ? 1.03 : 1, duration: 0.2 });
  };

  const avatars = ['JD', 'KL', 'MR', 'AS', 'PT'];

  return (
    <section ref={sectionRef} className="relative flex flex-col md:flex-row" style={{ minHeight: '100dvh', background: '#0e0e14' }}>
      {/* Cursor glow */}
      <div ref={cursorGlowRef} className="absolute pointer-events-none" style={{ width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)', opacity: 0, zIndex: 0 }} />

      {/* Noise grain */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, opacity: 0.03, mixBlendMode: 'overlay', backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }} />

      {/* ── LEFT SIDE ── */}
      <div className="relative flex flex-col justify-center items-start px-6 md:px-14" style={{ flex: isMobile ? 'none' : '0 0 55%', minHeight: isMobile ? 'auto' : '100dvh', paddingTop: isMobile ? 100 : 0, paddingBottom: isMobile ? 40 : 0, zIndex: 2 }}>
        {[
          { w: 300, h: 300, color: 'rgba(124,58,237,0.15)', left: '10%', top: '20%' },
          { w: 400, h: 250, color: 'rgba(167,139,250,0.08)', left: '40%', top: '50%' },
        ].map((b, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none" style={{ width: b.w, height: b.h, left: b.left, top: b.top, background: `radial-gradient(circle, ${b.color}, transparent)`, filter: 'blur(60px)', opacity: 0.4 }} />
        ))}

        <div className="sh-badge opacity-0 inline-flex items-center font-mono text-[11px] px-4 py-1.5 rounded-full" style={{ color: '#c4b5fd', border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.1)' }}>
          ✦ Pure GSAP · Zero Framer Motion
        </div>

        <div className="mt-6">
          {[
            { text: 'Stop fighting', color: '#707080', stroke: false },
            { text: 'your animations.', color: '#f0ede8', stroke: false },
            { text: 'Start shipping.', color: 'transparent', stroke: true },
          ].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <span ref={line.stroke ? strokeRef : undefined} className="sh-line-inner block font-syne font-extrabold" style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', color: line.color, WebkitTextStroke: line.stroke ? '1.5px #7c3aed' : undefined, lineHeight: 1.15 }}>
                {line.text}
              </span>
            </div>
          ))}
        </div>

        <p className="sh-sub opacity-0 mt-6 font-inter font-light" style={{ fontSize: '1rem', color: '#707080', lineHeight: 1.7, maxWidth: 360 }}>
          60+ GSAP components for React. Copy the code. Drop it in. Done in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 mt-8 w-full sm:w-auto">
          <button className="sh-cta opacity-0 font-inter font-semibold text-[13px] px-6 py-3 rounded-md text-white transition-all" style={{ background: '#7c3aed' }} onClick={() => navigate('/components')}
            onMouseEnter={e => { hoverCta(e, true); (e.currentTarget as HTMLElement).style.background = '#8b47ff'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(124,58,237,0.35)'; }}
            onMouseLeave={e => { hoverCta(e, false); (e.currentTarget as HTMLElement).style.background = '#7c3aed'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
            Browse Components →
          </button>
          <button className="sh-cta opacity-0 font-inter font-semibold text-[13px] px-6 py-3 rounded-md transition-all" style={{ border: '1px solid #222235', color: '#707080', background: 'transparent' }} onClick={() => navigate('/blocks')}
            onMouseEnter={e => { hoverCta(e, true); (e.currentTarget as HTMLElement).style.borderColor = '#2a2a3e'; (e.currentTarget as HTMLElement).style.color = '#f0ede8'; }}
            onMouseLeave={e => { hoverCta(e, false); (e.currentTarget as HTMLElement).style.borderColor = '#222235'; (e.currentTarget as HTMLElement).style.color = '#707080'; }}>
            View Blocks
          </button>
        </div>

        {/* Social proof */}
        <div className="sh-social opacity-0 flex flex-col mt-10">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center">
              {avatars.map((initials, i) => (
                <div key={i} className="flex items-center justify-center rounded-full font-mono text-[9px]" style={{ width: 28, height: 28, border: '2px solid #0e0e14', background: 'linear-gradient(135deg, #1a1a28, #252540)', color: '#7c3aed', marginLeft: i === 0 ? 0 : -8, zIndex: avatars.length - i }}>
                  {initials}
                </div>
              ))}
            </div>
            <span className="font-inter font-light text-[12px]" style={{ color: '#686878' }}>
              Loved by <span className="font-syne font-bold" style={{ color: '#f0ede8' }}>2,400+</span> developers worldwide
            </span>
            <div className="hidden sm:block" style={{ width: 1, height: 16, background: '#1a1a2a' }} />
            <div className="flex items-center gap-1.5">
              <span style={{ color: '#7c3aed', fontSize: 12 }}>★★★★★</span>
              <span className="font-mono text-[11px]" style={{ color: '#686878' }}>4.9/5</span>
            </div>
          </div>
          <div ref={socialLineRef} style={{ width: 200, height: 1, marginTop: 8, background: 'linear-gradient(to right, #7c3aed, transparent)', transformOrigin: 'left', transform: 'scaleX(0)' }} />
          <div className="mt-3 font-mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: '#404050' }}>
            Built for{' '}<span style={{ color: '#606070' }}>React</span> ·{' '}<span style={{ color: '#606070' }}>Next.js</span> ·{' '}<span style={{ color: '#606070' }}>Vite</span> ·{' '}<span style={{ color: '#606070' }}>Remix</span>
          </div>
        </div>

        <div className="sh-scroll opacity-0 absolute bottom-8 left-6 md:left-14 flex items-center gap-2">
          <div className="w-5 h-8 rounded-full flex justify-center pt-2" style={{ border: '1.5px solid #404050' }}>
            <div className="sh-scroll-dot w-[3px] h-[3px] rounded-full" style={{ background: '#7c3aed' }} />
          </div>
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="hero-divider hidden md:block origin-top" style={{ width: 1, background: '#1a1a2a', alignSelf: 'stretch', zIndex: 2 }} />

      {/* ── RIGHT SIDE — Abstract Motion Graphic ── */}
      {!isMobile && (
        <div ref={rightPanelRef} className="relative overflow-hidden" style={{ flex: '0 0 45%', minHeight: '100dvh', opacity: 0, zIndex: 2 }}>
          {/* Layer 1 — Primary orb */}
          <div ref={primaryOrbRef} className="absolute rounded-full pointer-events-none" style={{ width: 520, height: 520, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.06) 40%, transparent 70%)', filter: 'blur(40px)' }} />

          {/* Layer 2 — Secondary orb */}
          <div ref={secondaryOrbRef} className="absolute rounded-full pointer-events-none" style={{ width: 280, height: 280, top: '5%', right: '5%', background: 'radial-gradient(circle, rgba(167,139,250,0.14) 0%, transparent 70%)', filter: 'blur(30px)' }} />

          {/* Layer 3 — Accent orb */}
          <div ref={accentOrbRef} className="absolute rounded-full pointer-events-none" style={{ width: 200, height: 200, bottom: '10%', left: '10%', background: 'radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%)', filter: 'blur(24px)' }} />

          {/* Layer 4 — Mesh grid */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)' }} />

          {/* Layer 5 — Ring 1 */}
          <div ref={ring1Ref} className="absolute rounded-full pointer-events-none" style={{ width: 400, height: 400, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', border: '1px solid rgba(124,58,237,0.12)' }} />

          {/* Layer 6 — Ring 2 */}
          <div ref={ring2Ref} className="absolute rounded-full pointer-events-none" style={{ width: 260, height: 260, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', border: '1px solid rgba(124,58,237,0.08)' }} />

          {/* Layer 7 — Ring 3 */}
          <div ref={ring3Ref} className="absolute rounded-full pointer-events-none" style={{ width: 140, height: 140, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', border: '1px solid rgba(124,58,237,0.15)' }} />

          {/* Layer 8 — Center dot */}
          <div className="absolute rounded-full pointer-events-none" style={{ width: 6, height: 6, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#7c3aed', boxShadow: '0 0 20px rgba(124,58,237,0.8), 0 0 40px rgba(124,58,237,0.4)' }} />

          {/* Layer 9 — Orbiting dot */}
          <div ref={orbitDotRef} className="absolute rounded-full pointer-events-none" style={{ width: 4, height: 4, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#a78bfa', boxShadow: '0 0 8px rgba(167,139,250,0.8)' }} />

          {/* Layer 10 — Particles */}
          {PARTICLE_POSITIONS.map((pos, i) => (
            <div key={i} ref={el => { particlesRef.current[i] = el; }} className="absolute rounded-full pointer-events-none" style={{ width: 2, height: 2, top: pos.top, left: pos.left, background: 'rgba(124,58,237,0.6)' }} />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;

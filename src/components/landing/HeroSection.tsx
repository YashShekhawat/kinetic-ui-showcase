import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';
import ParticleField from '@/components/ui-showcase/components/backgrounds/ParticleField';
import PulseRingLoader from '@/components/ui-showcase/components/loaders/PulseRingLoader';
import InfiniteGallery from '@/components/ui-showcase/components/images/InfiniteGallery';
import AuroraBackground from '@/components/ui-showcase/components/backgrounds/AuroraBackground';

/* ── Mini text animations for Card B ── */

const TextRevealMini = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>('.trm-word');
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
      tl.fromTo(words, { y: '100%' }, { y: '0%', duration: 0.8, stagger: 0.12, ease: 'power4.out' });
      tl.to(words, { y: '-100%', duration: 0.6, stagger: 0.08, ease: 'power3.in' }, '+=1.5');
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={ref} className="flex gap-2 items-center justify-center">
      {['KINETIC', 'UI'].map((w, i) => (
        <div key={i} className="overflow-hidden">
          <span className="trm-word block font-mono text-2xl font-medium text-kinetic-text tracking-wider">{w}</span>
        </div>
      ))}
    </div>
  );
};

const ScrambleMini = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg0123456789';
  const target = 'KINETIC UI';
  const [text, setText] = useState(target);
  useEffect(() => {
    const scramble = () => {
      const obj = { progress: 0 };
      gsap.to(obj, {
        progress: 1, duration: 1.2, ease: 'none',
        onUpdate: () => {
          const p = obj.progress;
          const resolved = Math.floor(p * target.length);
          let result = '';
          for (let i = 0; i < target.length; i++) {
            if (target[i] === ' ') { result += ' '; continue; }
            result += i < resolved ? target[i] : chars[Math.floor(Math.random() * chars.length)];
          }
          setText(result);
        },
      });
    };
    scramble();
    const interval = setInterval(scramble, 3000);
    return () => clearInterval(interval);
  }, []);
  return <div className="font-mono text-2xl font-medium text-kinetic-text tracking-wider">{text}</div>;
};

const TypewriterMini = () => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const phrases = ['KINETIC UI', 'MOTION LIB', 'GSAP REACT'];
    const tl = gsap.timeline({ repeat: -1 });
    phrases.forEach(phrase => {
      tl.call(() => { el.textContent = ''; });
      phrase.split('').forEach((_, i) => {
        tl.call(() => { el.textContent = phrase.slice(0, i + 1); }, [], `+=${0.06}`);
      });
      tl.to({}, { duration: 1.5 });
      for (let i = phrase.length; i >= 0; i--) {
        tl.call(() => { el.textContent = phrase.slice(0, i); }, [], `+=${0.03}`);
      }
      tl.to({}, { duration: 0.3 });
    });
    return () => { tl.kill(); };
  }, []);
  return (
    <div className="font-mono text-2xl font-medium text-kinetic-text tracking-wider">
      <span ref={ref}></span>
      <span className="inline-block w-0.5 h-5 bg-kinetic-accent ml-0.5 animate-pulse" />
    </div>
  );
};

/* ── Mini preview components ── */


const PulseRingMini = () => {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ringRef.current) return;
    const t = gsap.fromTo(ringRef.current,
      { scale: 1, opacity: 1 },
      { scale: 1.8, opacity: 0, duration: 1.5, ease: 'power2.out', repeat: -1 }
    );
    return () => { t.kill(); };
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 40, height: 40 }}>
      <div ref={ringRef} className="absolute" style={{
        width: 32, height: 32, borderRadius: '50%',
        border: '1px solid rgba(124,58,237,0.5)',
        boxShadow: '0 0 20px rgba(124,58,237,0.3)',
      }} />
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#7c3aed' }} />
    </div>
  );
};

const MarqueeMini = () => {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r1 = row1Ref.current;
    const r2 = row2Ref.current;
    if (!r1 || !r2) return;
    r1.innerHTML += r1.innerHTML;
    r2.innerHTML += r2.innerHTML;
    const t1 = gsap.to(r1, { xPercent: -50, duration: 20, ease: 'none', repeat: -1 });
    const t2 = gsap.fromTo(r2, { xPercent: -50 }, { xPercent: 0, duration: 25, ease: 'none', repeat: -1 });
    return () => { t1.kill(); t2.kill(); };
  }, []);

  return (
    <div style={{ overflow: 'hidden', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
      <div ref={row1Ref} className="flex w-max whitespace-nowrap">
        <span className="font-syne font-bold" style={{ fontSize: 14, color: '#c0c0cc', letterSpacing: '0.04em' }}>
          KINETIC UI · GSAP · REACT · MOTION ·&nbsp;
        </span>
      </div>
      <div ref={row2Ref} className="flex w-max whitespace-nowrap">
        <span className="font-mono" style={{ fontSize: 10, color: '#606070', letterSpacing: '0.12em' }}>
          OPEN SOURCE · COMPONENTS · ANIMATIONS ·&nbsp;
        </span>
      </div>
    </div>
  );
};


const InfiniteStripMini = () => {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stripRef.current) return;
    stripRef.current.innerHTML += stripRef.current.innerHTML;
    const t = gsap.to(stripRef.current, { y: '-50%', duration: 8, ease: 'none', repeat: -1 });
    return () => { t.kill(); };
  }, []);

  return (
    <div style={{ overflow: 'hidden', height: '100%', width: '100%' }}>
      <div ref={stripRef} className="flex flex-col gap-1.5">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} style={{ height: 28, background: '#13131f', borderRadius: 4, width: '100%' }} />
        ))}
      </div>
    </div>
  );
};

/* ── Main Hero ── */

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const strokeRef = useRef<HTMLSpanElement>(null);
  const socialLineRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<(HTMLDivElement | null)[]>([]);
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
          WebkitTextStrokeColor: '#a78bfa', repeat: -1, yoyo: true, duration: 2, ease: 'sine.inOut',
        });
      }

      // Bento entry
      const validCards = bentoRef.current.filter(Boolean);
      if (validCards.length) {
        gsap.fromTo(validCards,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.5 }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
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

  const cardStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: '#0d0d12',
    border: '1px solid #1e1e2e',
    borderTop: '1px solid rgba(124,58,237,0.4)',
    borderRadius: 12,
    padding: 0,
    overflow: 'hidden',
    opacity: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    transition: 'border-color 0.2s ease',
    ...extra,
  });

  const labelStyle: React.CSSProperties = {
    fontFamily: 'monospace', fontSize: 9, color: '#909098', letterSpacing: '0.15em', textTransform: 'uppercase' as const,
    position: 'absolute' as const, bottom: 8, left: 12,
    background: 'rgba(10,10,18,0.8)', padding: '3px 8px', borderRadius: 4,
  };

  return (
    <section ref={sectionRef} className="relative flex flex-col md:flex-row md:items-center" style={{ minHeight: '100dvh', background: '#0e0e14', gap: 40 }}>
      {/* Cursor glow */}
      <div ref={cursorGlowRef} className="absolute pointer-events-none" style={{ width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)', opacity: 0, zIndex: 0 }} />

      {/* Noise grain */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, opacity: 0.03, mixBlendMode: 'overlay', backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }} />

      {/* ── LEFT SIDE ── */}
      <div className="relative flex flex-col justify-center items-start px-6 md:px-14" style={{ flex: isMobile ? 'none' : '0 0 45%', maxWidth: isMobile ? '100%' : '45%', minHeight: isMobile ? 'auto' : '100dvh', paddingTop: isMobile ? 100 : 0, paddingBottom: isMobile ? 40 : 0, zIndex: 2 }}>
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
            { text: 'Stop fighting', color: '#909098', stroke: false },
            { text: 'your animations.', color: '#f0ede8', stroke: false },
            { text: 'Start shipping.', color: '#7c3aed', stroke: true },
          ].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <span
                ref={line.stroke ? strokeRef : undefined}
                className={`sh-line-inner block font-syne font-extrabold ${line.stroke ? 'italic' : ''}`}
                style={{
                  fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
                  color: line.color,
                  lineHeight: 1.15,
                }}
              >
                {line.text}
              </span>
            </div>
          ))}
        </div>

        <p className="sh-sub opacity-0 mt-6 font-inter font-light" style={{ fontSize: '0.95rem', color: '#909098', lineHeight: 1.7, maxWidth: 380 }}>
          GSAP-powered React components. Copy the code, drop it in your project. No config. No Framer Motion.
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

      {/* ── RIGHT SIDE — Bento Grid ── */}
      {!isMobile && (
        <div className="flex items-center justify-center" style={{ flex: 1, minHeight: '100dvh', overflow: 'hidden', zIndex: 2 }}>
          <div style={{
            width: 550, height: 580,
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gridTemplateRows: '210px 120px 110px 110px',
            gap: 10,
            overflow: 'hidden',
          }}>
            {/* Card A — Infinite Gallery (tall, left, spans 2 rows) */}
            <div
              ref={el => { bentoRef.current[0] = el; }}
              style={{ ...cardStyle({ gridColumn: '1', gridRow: '1 / span 2', position: 'relative' }) }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(124,58,237,0.35)'; el.style.borderTopColor = 'rgba(124,58,237,0.4)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#1e1e2e'; el.style.borderTopColor = 'rgba(124,58,237,0.4)'; }}
            >
              <div style={{ flex: 1, overflow: 'hidden', width: '100%' }}>
                <div style={{ transform: 'scale(0.8)', transformOrigin: 'center top', overflow: 'hidden', marginTop: 42, width: '200%', marginLeft: '-50%' }}>
                  <InfiniteGallery />
                </div>
              </div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(124,58,237,0.06) 100%)', pointerEvents: 'none', borderRadius: 12 }} />
              <div style={labelStyle}>Infinite Gallery</div>
            </div>

            {/* Card B — Text Reveal (top right) */}
            <div
              ref={el => { bentoRef.current[1] = el; }}
              style={{ ...cardStyle({ gridColumn: '2', gridRow: '1', position: 'relative' }) }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(124,58,237,0.35)'; el.style.borderTopColor = 'rgba(124,58,237,0.4)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#1e1e2e'; el.style.borderTopColor = 'rgba(124,58,237,0.4)'; }}
            >
              <div style={{ flex: 1, overflow: 'hidden', width: '100%', background: '#13131f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 21, borderRadius: '12px' }}>
                <div style={{ transform: 'scale(0.75)', transformOrigin: 'center' }}>
                  <TextRevealMini />
                </div>
                <div style={{ transform: 'scale(0.75)', transformOrigin: 'center' }}>
                  <ScrambleMini />
                </div>
                <div style={{ transform: 'scale(0.75)', transformOrigin: 'center' }}>
                  <TypewriterMini />
                </div>
              </div>
              <div style={labelStyle}>Text Reveal</div>
            </div>

            {/* Card C — Pulse Ring (middle right) */}
            <div
              ref={el => { bentoRef.current[2] = el; }}
              style={{ ...cardStyle({ gridColumn: '2', gridRow: '2', position: 'relative' }) }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(124,58,237,0.35)'; el.style.borderTopColor = 'rgba(124,58,237,0.4)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#1e1e2e'; el.style.borderTopColor = 'rgba(124,58,237,0.4)'; }}
            >
              <div style={{ flex: 1, overflow: 'hidden', width: '100%', background: '#13131f', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                <div style={{ transform: 'scale(1)', transformOrigin: 'center' }}>
                  <PulseRingLoader />
                </div>
              </div>
              <div style={labelStyle}>Pulse Ring</div>
            </div>

            {/* Card D — Smooth Marquee (bottom left) */}
            <div
              ref={el => { bentoRef.current[3] = el; }}
              style={{ ...cardStyle({ gridColumn: '1', gridRow: '3', position: 'relative' }) }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(124,58,237,0.35)'; el.style.borderTopColor = 'rgba(124,58,237,0.4)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#1e1e2e'; el.style.borderTopColor = 'rgba(124,58,237,0.4)'; }}
            >
              <div style={{ flex: 1, overflow: 'hidden', width: '100%', background: '#13131f', display: 'flex', alignItems: 'center', borderRadius: '12px' }}>
                <MarqueeMini />
              </div>
              <div style={labelStyle}>Smooth Marquee</div>
            </div>

            {/* Card E — Aurora Background (bottom right, spans 2 rows) */}
            <div
              ref={el => { bentoRef.current[4] = el; }}
              style={{ ...cardStyle({ gridColumn: '2', gridRow: '3 / span 2', position: 'relative' }) }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(124,58,237,0.35)'; el.style.borderTopColor = 'rgba(124,58,237,0.4)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#1e1e2e'; el.style.borderTopColor = 'rgba(124,58,237,0.4)'; }}
            >
              <div style={{ flex: 1, overflow: 'hidden', width: '100%', position: 'relative', borderRadius: '12px' }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                  <AuroraBackground />
                </div>
              </div>
              <div style={labelStyle}>Aurora Background</div>
            </div>

            {/* Card F — Particle Field (bottom left) */}
            <div
              ref={el => { bentoRef.current[5] = el; }}
              style={{ ...cardStyle({ gridColumn: '1', gridRow: '4', position: 'relative' }) }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(124,58,237,0.35)'; el.style.borderTopColor = 'rgba(124,58,237,0.4)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#1e1e2e'; el.style.borderTopColor = 'rgba(124,58,237,0.4)'; }}
            >
              <div style={{ flex: 1, overflow: 'hidden', width: '100%', position: 'relative', borderRadius: '12px' }}>
                <ParticleField />
              </div>
              <div style={labelStyle}>Particle Field</div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;

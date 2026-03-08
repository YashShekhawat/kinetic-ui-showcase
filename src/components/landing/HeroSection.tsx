import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

/* ── Inline mini-components for right panel ── */

const ScrambleTextMini = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg0123456789';
  const target = 'KINETIC UI';
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const scramble = () => {
      const obj = { progress: 0 };
      gsap.to(obj, {
        progress: 1, duration: 1.2, ease: 'none',
        onUpdate: () => {
          const resolved = Math.floor(obj.progress * target.length);
          let r = '';
          for (let i = 0; i < target.length; i++) {
            if (target[i] === ' ') { r += ' '; continue; }
            r += i < resolved ? target[i] : chars[Math.floor(Math.random() * chars.length)];
          }
          if (ref.current) ref.current.textContent = r;
        },
      });
    };
    scramble();
    const id = setInterval(scramble, 3000);
    return () => clearInterval(id);
  }, []);

  return <div ref={ref} className="font-syne font-bold" style={{ fontSize: '1.1rem', color: '#f0ede8' }}>{target}</div>;
};

const CounterMini = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const run = () => {
      gsap.fromTo(ref.current, { textContent: '0' }, {
        textContent: 2400, duration: 2, snap: { textContent: 1 }, ease: 'power2.out',
        onUpdate() {
          const v = parseInt(ref.current?.textContent || '0');
          if (ref.current) ref.current.textContent = v.toLocaleString() + '+';
        },
      });
    };
    run();
    const id = setInterval(run, 5000);
    return () => clearInterval(id);
  }, []);

  return <div ref={ref} className="font-syne font-extrabold text-center" style={{ fontSize: '1.8rem', color: '#f0ede8' }}>0</div>;
};

const GradientTextMini = () => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, { backgroundPosition: '200% center', duration: 3, repeat: -1, ease: 'none' });
  }, []);

  return (
    <span ref={ref} className="font-syne font-extrabold" style={{
      fontSize: '1.4rem',
      background: 'linear-gradient(90deg, #7c3aed, #a78bfa, #e879f9, #7c3aed)',
      backgroundSize: '200% auto',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    }}>
      Beautiful.
    </span>
  );
};

const PulseRingMini = () => {
  const ringsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tweens = ringsRef.current.map((ring, i) => {
      if (!ring) return null;
      return gsap.fromTo(ring,
        { scale: 1, opacity: 0.7 },
        { scale: 2.5, opacity: 0, duration: 2, ease: 'power1.out', repeat: -1, delay: i * 0.6 }
      );
    });
    return () => tweens.forEach(t => t?.kill());
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
      {[0, 1, 2].map(i => (
        <div key={i} ref={el => { ringsRef.current[i] = el; }} className="absolute rounded-full" style={{ width: 28, height: 28, border: '1px solid #9b5de5' }} />
      ))}
      <div className="relative flex items-center justify-center rounded-full font-syne font-bold text-[8px]" style={{ width: 28, height: 28, border: '1px solid #9b5de5', color: '#f0ede8' }}>KU</div>
    </div>
  );
};

/* ── Floating Card wrapper with hover effects ── */
interface FloatingCardProps {
  className: string;
  style: React.CSSProperties;
  children: React.ReactNode;
  floatClass: string;
}

const FloatingCard = ({ className, style, children, floatClass }: FloatingCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (!cardRef.current) return;
    // Pause float by finding the tween
    const floatEl = cardRef.current.closest(`.${floatClass}`) || cardRef.current;
    gsap.getTweensOf(floatEl).forEach(t => t.pause());
    gsap.to(cardRef.current, { scale: 1.05, boxShadow: '0 0 20px rgba(124,58,237,0.3)', duration: 0.25 });
    if (barRef.current) gsap.to(barRef.current, { width: '100%', duration: 0.25 });
  };

  const handleLeave = () => {
    if (!cardRef.current) return;
    const floatEl = cardRef.current.closest(`.${floatClass}`) || cardRef.current;
    gsap.getTweensOf(floatEl).forEach(t => t.resume());
    gsap.to(cardRef.current, { scale: 1, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', duration: 0.25 });
    if (barRef.current) gsap.to(barRef.current, { width: '0%', duration: 0.25 });
  };

  return (
    <div
      ref={cardRef}
      className={className}
      style={style}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Violet top bar */}
      <div ref={barRef} style={{ position: 'absolute', top: 0, left: 0, width: '0%', height: 2, background: '#7c3aed', borderRadius: '8px 8px 0 0' }} />
      {children}
    </div>
  );
};

/* ── Main Hero ── */

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const strokeRef = useRef<HTMLSpanElement>(null);
  const socialLineRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
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
      tl.fromTo('.sh-card', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' }, 1.0);

      // Social proof underline draw
      if (socialLineRef.current) {
        tl.fromTo(socialLineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, 2.0);
      }

      // Floating cards
      gsap.to('.sh-float-0', { y: -12, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.sh-float-1', { y: -16, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
      gsap.to('.sh-float-2', { y: -10, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 });
      gsap.to('.sh-float-3', { y: -14, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5 });

      // CHANGE 1 — Stroke glow pulse
      if (strokeRef.current) {
        gsap.to(strokeRef.current, {
          WebkitTextStrokeColor: '#a78bfa',
          repeat: -1,
          yoyo: true,
          duration: 2,
          ease: 'sine.inOut',
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // CHANGE 5 — Cursor glow (desktop only)
  useEffect(() => {
    const isFineCursor = window.matchMedia('(pointer: fine)').matches;
    if (!isFineCursor || !sectionRef.current || !cursorGlowRef.current) return;
    const section = sectionRef.current;
    const glow = cursorGlowRef.current;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.to(glow, { x: x - 200, y: y - 200, duration: 0.6, ease: 'power2.out' });
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
      {/* CHANGE 5 — Cursor glow */}
      <div
        ref={cursorGlowRef}
        className="absolute pointer-events-none"
        style={{
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)',
          opacity: 0, zIndex: 0,
        }}
      />

      {/* CHANGE 4 — Noise grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          opacity: 0.03,
          mixBlendMode: 'overlay',
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── LEFT SIDE ── */}
      <div className="relative flex flex-col justify-center items-start px-6 md:px-14" style={{ flex: isMobile ? 'none' : '0 0 55%', minHeight: isMobile ? 'auto' : '100dvh', paddingTop: isMobile ? 100 : 0, paddingBottom: isMobile ? 40 : 0, zIndex: 2 }}>
        {[
          { w: 300, h: 300, color: 'rgba(124,58,237,0.15)', left: '10%', top: '20%' },
          { w: 400, h: 250, color: 'rgba(167,139,250,0.08)', left: '40%', top: '50%' },
        ].map((b, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none" style={{
            width: b.w, height: b.h, left: b.left, top: b.top,
            background: `radial-gradient(circle, ${b.color}, transparent)`,
            filter: 'blur(60px)', opacity: 0.4,
          }} />
        ))}

        <div className="sh-badge opacity-0 inline-flex items-center font-mono text-[11px] px-4 py-1.5 rounded-full"
          style={{ color: '#c4b5fd', border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.1)' }}>
          ✦ Pure GSAP · Zero Framer Motion
        </div>

        <div className="mt-6">
          {[
            { text: 'Stop fighting', color: '#707080', stroke: false },
            { text: 'your animations.', color: '#f0ede8', stroke: false },
            { text: 'Start shipping.', color: 'transparent', stroke: true },
          ].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <span
                ref={line.stroke ? strokeRef : undefined}
                className="sh-line-inner block font-syne font-extrabold"
                style={{
                  fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
                  color: line.color,
                  WebkitTextStroke: line.stroke ? '1.5px #7c3aed' : undefined,
                  lineHeight: 1.15,
                }}
              >
                {line.text}
              </span>
            </div>
          ))}
        </div>

        <p className="sh-sub opacity-0 mt-6 font-inter font-light" style={{ fontSize: '1rem', color: '#707080', lineHeight: 1.7, maxWidth: 360 }}>
          60+ GSAP components for React. Copy the code. Drop it in. Done in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 mt-8 w-full sm:w-auto">
          <button
            className="sh-cta opacity-0 font-inter font-semibold text-[13px] px-6 py-3 rounded-md text-white transition-all"
            style={{ background: '#7c3aed' }}
            onClick={() => navigate('/components')}
            onMouseEnter={e => { hoverCta(e, true); (e.currentTarget as HTMLElement).style.background = '#8b47ff'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(124,58,237,0.35)'; }}
            onMouseLeave={e => { hoverCta(e, false); (e.currentTarget as HTMLElement).style.background = '#7c3aed'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
          >
            Browse Components →
          </button>
          <button
            className="sh-cta opacity-0 font-inter font-semibold text-[13px] px-6 py-3 rounded-md transition-all"
            style={{ border: '1px solid #222235', color: '#707080', background: 'transparent' }}
            onClick={() => navigate('/blocks')}
            onMouseEnter={e => { hoverCta(e, true); (e.currentTarget as HTMLElement).style.borderColor = '#2a2a3e'; (e.currentTarget as HTMLElement).style.color = '#f0ede8'; }}
            onMouseLeave={e => { hoverCta(e, false); (e.currentTarget as HTMLElement).style.borderColor = '#222235'; (e.currentTarget as HTMLElement).style.color = '#707080'; }}
          >
            View Blocks
          </button>
        </div>

        {/* CHANGE 2 — Upgraded social proof */}
        <div className="sh-social opacity-0 flex flex-col mt-10">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center">
              {avatars.map((initials, i) => (
                <div key={i} className="flex items-center justify-center rounded-full font-mono text-[9px]" style={{
                  width: 28, height: 28,
                  border: '2px solid #0e0e14',
                  background: 'linear-gradient(135deg, #1a1a28, #252540)',
                  color: '#7c3aed',
                  marginLeft: i === 0 ? 0 : -8,
                  zIndex: avatars.length - i,
                }}>
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
          {/* Animated underline */}
          <div
            ref={socialLineRef}
            style={{
              width: 200, height: 1, marginTop: 8,
              background: 'linear-gradient(to right, #7c3aed, transparent)',
              transformOrigin: 'left', transform: 'scaleX(0)',
            }}
          />
          {/* Tech stack logos */}
          <div className="mt-3 font-mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: '#404050' }}>
            Built for{' '}
            <span style={{ color: '#606070' }}>React</span> ·{' '}
            <span style={{ color: '#606070' }}>Next.js</span> ·{' '}
            <span style={{ color: '#606070' }}>Vite</span> ·{' '}
            <span style={{ color: '#606070' }}>Remix</span>
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
      <div className="block md:hidden" style={{ height: 1, background: '#1a1a2a', width: '100%', zIndex: 2 }} />

      {/* ── RIGHT SIDE ── */}
      <div className="relative overflow-hidden" style={{ flex: isMobile ? 'none' : '0 0 45%', height: isMobile ? 300 : 'auto', background: '#111119', zIndex: 2 }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 60% 50%, rgba(124,58,237,0.07), transparent 65%)' }} />

        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #181828 1px, transparent 1px)',
          backgroundSize: '24px 24px', opacity: 0.6,
        }} />

        {!isMobile && (
          <>
            <FloatingCard
              floatClass="sh-float-0"
              className="sh-card sh-float-0 opacity-0 absolute"
              style={{ left: '15%', top: '12%', width: 200, background: '#1a1a28', border: '1px solid #2a2a3e', borderRadius: 8, padding: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', position: 'absolute', overflow: 'hidden' }}
            >
              <ScrambleTextMini />
              <div className="font-mono text-[9px] mt-2" style={{ color: '#686878' }}>Scramble Text</div>
            </FloatingCard>

            <FloatingCard
              floatClass="sh-float-1"
              className="sh-card sh-float-1 opacity-0 absolute"
              style={{ left: '45%', top: '30%', width: 180, background: '#1a1a28', border: '1px solid #2a2a3e', borderRadius: 8, padding: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', position: 'absolute', overflow: 'hidden' }}
            >
              <CounterMini />
              <div className="font-mono text-[9px] mt-2 text-center" style={{ color: '#686878' }}>Counter</div>
            </FloatingCard>

            <FloatingCard
              floatClass="sh-float-2"
              className="sh-card sh-float-2 opacity-0 absolute"
              style={{ left: '10%', top: '58%', width: 220, background: '#1a1a28', border: '1px solid #2a2a3e', borderRadius: 8, padding: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', position: 'absolute', overflow: 'hidden' }}
            >
              <GradientTextMini />
              <div className="font-mono text-[9px] mt-2" style={{ color: '#686878' }}>Gradient Text</div>
            </FloatingCard>

            <FloatingCard
              floatClass="sh-float-3"
              className="sh-card sh-float-3 opacity-0 absolute flex flex-col items-center"
              style={{ left: '42%', top: '65%', width: 160, background: '#1a1a28', border: '1px solid #2a2a3e', borderRadius: 8, padding: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', position: 'absolute', overflow: 'hidden' }}
            >
              <PulseRingMini />
              <div className="font-mono text-[9px] mt-2" style={{ color: '#686878' }}>Pulse Ring</div>
            </FloatingCard>

            {[
              { left: '38%', top: '24%' },
              { left: '28%', top: '50%' },
              { left: '55%', top: '58%' },
            ].map((d, i) => (
              <div key={i} className="absolute rounded-full pointer-events-none" style={{ left: d.left, top: d.top, width: 4, height: 4, background: '#222235' }} />
            ))}
          </>
        )}

        {isMobile && (
          <div className="flex items-center justify-center gap-3 h-full px-4">
            <div className="sh-card opacity-0 flex flex-col items-center" style={{ width: 150, background: '#1a1a28', border: '1px solid #2a2a3e', borderRadius: 8, padding: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              <ScrambleTextMini />
              <div className="font-mono text-[9px] mt-2" style={{ color: '#686878' }}>Scramble Text</div>
            </div>
            <div className="sh-card opacity-0 flex flex-col items-center" style={{ width: 150, background: '#1a1a28', border: '1px solid #2a2a3e', borderRadius: 8, padding: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              <PulseRingMini />
              <div className="font-mono text-[9px] mt-2" style={{ color: '#686878' }}>Pulse Ring</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;

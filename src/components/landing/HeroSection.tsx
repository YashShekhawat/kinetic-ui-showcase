import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

/* ── Mini preview components for showcase cards ── */

const TextRevealMini = () => {
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const word = 'KINETIC';

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0.5 });
    tl.fromTo(
      lettersRef.current.filter(Boolean),
      { opacity: 0 },
      { opacity: 1, stagger: 0.08, duration: 0.3, ease: 'power2.out' }
    );
    return () => { tl.kill(); };
  }, []);

  return (
    <div className="font-syne font-extrabold" style={{ fontSize: '1.2rem', color: '#f0ede8' }}>
      {word.split('').map((ch, i) => (
        <span key={i} ref={el => { lettersRef.current[i] = el; }} style={{ opacity: 0 }}>{ch}</span>
      ))}
    </div>
  );
};

const ScrambleMini = () => {
  const ref = useRef<HTMLDivElement>(null);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const words = ['REACT', 'GSAP', 'MOTION', 'KINETIC'];

  useEffect(() => {
    if (!ref.current) return;
    let idx = 0;
    const scramble = () => {
      const target = words[idx % words.length];
      idx++;
      const obj = { progress: 0 };
      gsap.to(obj, {
        progress: 1, duration: 0.8, ease: 'none',
        onUpdate: () => {
          const resolved = Math.floor(obj.progress * target.length);
          let r = '';
          for (let i = 0; i < target.length; i++) {
            r += i < resolved ? target[i] : chars[Math.floor(Math.random() * chars.length)];
          }
          if (ref.current) ref.current.textContent = r;
        },
      });
    };
    scramble();
    const id = setInterval(scramble, 1500);
    return () => clearInterval(id);
  }, []);

  return <div ref={ref} className="font-syne font-bold" style={{ fontSize: '1.1rem', color: '#f0ede8' }}>REACT</div>;
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
    const id = setInterval(run, 3000);
    return () => clearInterval(id);
  }, []);

  return <div ref={ref} className="font-syne font-extrabold" style={{ fontSize: '1.8rem', color: '#7c3aed' }}>0</div>;
};

const BorderGlowMini = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const t = gsap.to(ref.current, {
      boxShadow: '0 0 20px rgba(124,58,237,0.4), inset 0 0 20px rgba(124,58,237,0.1)',
      duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1,
    });
    return () => { t.kill(); };
  }, []);

  return (
    <div ref={ref} style={{
      width: 80, height: 50, borderRadius: 6,
      border: '1px solid rgba(124,58,237,0.4)',
      boxShadow: '0 0 12px rgba(124,58,237,0.2), inset 0 0 12px rgba(124,58,237,0.05)',
    }} />
  );
};

const CARDS = [
  { name: 'Text Reveal', col: 0 },
  { name: 'Magnetic Button', col: 1 },
  { name: 'Gradient Text', col: 0 },
  { name: 'Scramble Text', col: 1 },
  { name: 'Border Glow', col: 0 },
  { name: 'Counting Numbers', col: 1 },
];

const FLOAT_CONFIGS = [
  { y: -8, duration: 3 },
  { y: -6, duration: 3.5 },
  { y: -10, duration: 4 },
  { y: -7, duration: 2.8 },
  { y: -9, duration: 3.2 },
  { y: -6, duration: 3.8 },
];

/* ── Main Hero ── */

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const strokeRef = useRef<HTMLSpanElement>(null);
  const socialLineRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
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

      // Card entry + float
      const validCards = cardsRef.current.filter(Boolean);
      if (validCards.length) {
        gsap.fromTo(validCards, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.4 });
        validCards.forEach((card, i) => {
          const cfg = FLOAT_CONFIGS[i];
          gsap.to(card, { y: cfg.y, duration: cfg.duration, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        });
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

  const renderCardPreview = (index: number) => {
    switch (index) {
      case 0: return <TextRevealMini />;
      case 1: return (
        <button className="font-mono" style={{ fontSize: 10, padding: '8px 16px', borderRadius: 4, background: '#7c3aed', color: '#fff', border: 'none', cursor: 'default' }}>
          HOVER ME
        </button>
      );
      case 2: return (
        <span className="font-syne font-extrabold" style={{
          fontSize: '1.1rem',
          background: 'linear-gradient(90deg, #7c3aed, #a78bfa, #e879f9)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          Beautiful.
        </span>
      );
      case 3: return <ScrambleMini />;
      case 4: return <BorderGlowMini />;
      case 5: return <CounterMini />;
      default: return null;
    }
  };

  const leftCol = CARDS.filter(c => c.col === 0);
  const rightCol = CARDS.filter(c => c.col === 1);
  let cardIdx = 0;

  const renderCard = (card: typeof CARDS[0], globalIndex: number) => (
    <div
      key={card.name}
      ref={el => { cardsRef.current[globalIndex] = el; }}
      className="pointer-events-auto"
      style={{
        width: 200, background: '#0d0d12', border: '1px solid #1e1e2e', borderRadius: 12, padding: 16,
        opacity: 0, transition: 'border-color 0.2s ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2a2a3e'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1e1e2e'; }}
    >
      <div className="font-mono" style={{ fontSize: 10, color: '#606070', letterSpacing: '0.1em', marginBottom: 8 }}>
        {card.name}
      </div>
      <div style={{ height: 80, borderRadius: 8, background: '#13131f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {renderCardPreview(globalIndex)}
      </div>
    </div>
  );

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
            { text: '60+ Animated', color: 'transparent', stroke: true },
            { text: 'Components &', color: '#f0ede8', stroke: false },
            { text: 'Blocks.', color: '#7c3aed', stroke: false },
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

      {/* ── RIGHT SIDE — Component Preview Grid ── */}
      {!isMobile && (
        <div className="relative flex items-center justify-center" style={{
          flex: '0 0 45%', minHeight: '100dvh', overflow: 'hidden', zIndex: 2,
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 80%, transparent 100%)',
        }}>
          <div className="flex gap-4 items-start">
            {/* Left column */}
            <div className="flex flex-col gap-4">
              {[0, 2, 4].map(i => renderCard(CARDS[i], i))}
            </div>
            {/* Right column — offset down */}
            <div className="flex flex-col gap-4" style={{ marginTop: 48 }}>
              {[1, 3, 5].map(i => renderCard(CARDS[i], i))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;

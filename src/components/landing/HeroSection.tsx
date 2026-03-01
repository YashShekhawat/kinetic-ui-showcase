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

  return <div ref={ref} className="font-syne font-bold" style={{ fontSize: '1.1rem', color: '#ededed' }}>{target}</div>;
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

  return <div ref={ref} className="font-syne font-extrabold text-center" style={{ fontSize: '1.8rem', color: '#ededed' }}>0</div>;
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
      <div className="relative flex items-center justify-center rounded-full font-syne font-bold text-[8px]" style={{ width: 28, height: 28, border: '1px solid #9b5de5', color: '#ededed' }}>KU</div>
    </div>
  );
};

/* ── Main Hero ── */

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // Divider draw
      tl.fromTo('.hero-divider', { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: 'power2.out' }, 0);

      // Badge
      tl.fromTo('.sh-badge', { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.5 }, 0.3);

      // Heading lines
      tl.fromTo('.sh-line-inner', { y: '100%' }, { y: '0%', duration: 0.8, stagger: 0.1 }, 0.6);

      // Subtext
      tl.fromTo('.sh-sub', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 1.1);

      // CTAs
      tl.fromTo('.sh-cta', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 1.3);

      // Social proof
      tl.fromTo('.sh-social', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.5);

      // Scroll indicator
      tl.fromTo('.sh-scroll', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.8);
      gsap.to('.sh-scroll-dot', { y: 8, duration: 1.2, repeat: -1, yoyo: true, ease: 'power2.inOut' });

      // Right-side cards
      tl.fromTo('.sh-card', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' }, 1.0);

      // Floating cards
      gsap.to('.sh-float-0', { y: -12, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.sh-float-1', { y: -16, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
      gsap.to('.sh-float-2', { y: -10, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 });
      gsap.to('.sh-float-3', { y: -14, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const hoverCta = (e: React.MouseEvent, enter: boolean) => {
    gsap.to(e.currentTarget, { scale: enter ? 1.03 : 1, duration: 0.2 });
  };

  const avatars = ['JD', 'KL', 'MR', 'AS', 'PT'];

  return (
    <section ref={sectionRef} className="relative flex flex-col md:flex-row" style={{ minHeight: '100dvh', background: '#060608' }}>
      {/* ── LEFT SIDE ── */}
      <div className="relative flex flex-col justify-center items-start px-6 md:px-14" style={{ flex: isMobile ? 'none' : '0 0 55%', minHeight: isMobile ? 'auto' : '100dvh', paddingTop: isMobile ? 100 : 0, paddingBottom: isMobile ? 40 : 0 }}>
        {/* Aurora blobs (left only) */}
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

        {/* Badge */}
        <div className="sh-badge opacity-0 inline-flex items-center font-mono text-[11px] px-4 py-1.5 rounded-full"
          style={{ color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.06)' }}>
          ✦ Pure GSAP · Zero Framer Motion
        </div>

        {/* Heading */}
        <div className="mt-6">
          {[
            { text: 'Stop fighting', color: '#606070', stroke: false },
            { text: 'your animations.', color: '#ededed', stroke: false },
            { text: 'Start shipping.', color: 'transparent', stroke: true },
          ].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <span className="sh-line-inner block font-syne font-extrabold" style={{
                fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
                color: line.color,
                WebkitTextStroke: line.stroke ? '1.5px #7c3aed' : undefined,
                lineHeight: 1.15,
              }}>
                {line.text}
              </span>
            </div>
          ))}
        </div>

        {/* Subtext */}
        <p className="sh-sub opacity-0 mt-6 font-inter font-light" style={{ fontSize: '1rem', color: '#606070', lineHeight: 1.7, maxWidth: 360 }}>
          60+ GSAP components for React. Copy the code. Drop it in. Done in seconds.
        </p>

        {/* CTAs */}
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
            style={{ border: '1px solid #1a1a2e', color: '#606070', background: 'transparent' }}
            onClick={() => navigate('/blocks')}
            onMouseEnter={e => { hoverCta(e, true); (e.currentTarget as HTMLElement).style.borderColor = '#252538'; (e.currentTarget as HTMLElement).style.color = '#ededed'; }}
            onMouseLeave={e => { hoverCta(e, false); (e.currentTarget as HTMLElement).style.borderColor = '#1a1a2e'; (e.currentTarget as HTMLElement).style.color = '#606070'; }}
          >
            View Blocks
          </button>
        </div>

        {/* Social proof */}
        <div className="sh-social opacity-0 flex flex-wrap items-center gap-5 mt-10">
          {/* Avatars */}
          <div className="flex items-center">
            {avatars.map((initials, i) => (
              <div key={i} className="flex items-center justify-center rounded-full font-mono text-[9px]" style={{
                width: 28, height: 28,
                border: '2px solid #060608',
                background: 'linear-gradient(135deg, #1a1a2e, #252540)',
                color: '#7c3aed',
                marginLeft: i === 0 ? 0 : -8,
                zIndex: avatars.length - i,
              }}>
                {initials}
              </div>
            ))}
          </div>
          <span className="font-inter font-light text-[12px]" style={{ color: '#505060' }}>Loved by 2,400+ developers</span>

          <div className="hidden sm:block" style={{ width: 1, height: 16, background: '#1a1a2e' }} />

          <div className="flex items-center gap-1.5">
            <span style={{ color: '#7c3aed', fontSize: 12 }}>★★★★★</span>
            <span className="font-mono text-[11px]" style={{ color: '#505060' }}>4.9/5</span>
          </div>
        </div>

        {/* Scroll indicator (bottom-left) */}
        <div className="sh-scroll opacity-0 absolute bottom-8 left-6 md:left-14 flex items-center gap-2">
          <div className="w-5 h-8 rounded-full flex justify-center pt-2" style={{ border: '1.5px solid #303040' }}>
            <div className="sh-scroll-dot w-[3px] h-[3px] rounded-full" style={{ background: '#7c3aed' }} />
          </div>
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="hero-divider hidden md:block origin-top" style={{ width: 1, background: '#1a1a2e', alignSelf: 'stretch' }} />
      {/* Mobile horizontal rule */}
      <div className="block md:hidden" style={{ height: 1, background: '#1a1a2e', width: '100%' }} />

      {/* ── RIGHT SIDE ── */}
      <div className="relative overflow-hidden" style={{ flex: isMobile ? 'none' : '0 0 45%', height: isMobile ? 300 : 'auto', background: '#080810' }}>
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 60% 50%, rgba(124,58,237,0.07), transparent 65%)' }} />

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #111120 1px, transparent 1px)',
          backgroundSize: '24px 24px', opacity: 0.6,
        }} />

        {/* Floating cards */}
        {!isMobile && (
          <>
            {/* Card 1 – Scramble Text */}
            <div className="sh-card sh-float-0 opacity-0 absolute pointer-events-none" style={{ left: '15%', top: '12%', width: 200, background: '#0d0d16', border: '1px solid #1a1a2e', borderRadius: 8, padding: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              <ScrambleTextMini />
              <div className="font-mono text-[9px] mt-2" style={{ color: '#505060' }}>Scramble Text</div>
            </div>

            {/* Card 2 – Counter */}
            <div className="sh-card sh-float-1 opacity-0 absolute pointer-events-none" style={{ left: '45%', top: '30%', width: 180, background: '#0d0d16', border: '1px solid #1a1a2e', borderRadius: 8, padding: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              <CounterMini />
              <div className="font-mono text-[9px] mt-2 text-center" style={{ color: '#505060' }}>Counter</div>
            </div>

            {/* Card 3 – Gradient Text */}
            <div className="sh-card sh-float-2 opacity-0 absolute pointer-events-none" style={{ left: '10%', top: '58%', width: 220, background: '#0d0d16', border: '1px solid #1a1a2e', borderRadius: 8, padding: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              <GradientTextMini />
              <div className="font-mono text-[9px] mt-2" style={{ color: '#505060' }}>Gradient Text</div>
            </div>

            {/* Card 4 – Pulse Ring */}
            <div className="sh-card sh-float-3 opacity-0 absolute pointer-events-none flex flex-col items-center" style={{ left: '42%', top: '65%', width: 160, background: '#0d0d16', border: '1px solid #1a1a2e', borderRadius: 8, padding: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              <PulseRingMini />
              <div className="font-mono text-[9px] mt-2" style={{ color: '#505060' }}>Pulse Ring</div>
            </div>

            {/* Connecting dots */}
            {[
              { left: '38%', top: '24%' },
              { left: '28%', top: '50%' },
              { left: '55%', top: '58%' },
            ].map((d, i) => (
              <div key={i} className="absolute rounded-full pointer-events-none" style={{ left: d.left, top: d.top, width: 4, height: 4, background: '#1a1a2e' }} />
            ))}
          </>
        )}

        {/* Mobile: show 2 cards in a row */}
        {isMobile && (
          <div className="flex items-center justify-center gap-3 h-full px-4">
            <div className="sh-card opacity-0 flex flex-col items-center" style={{ width: 150, background: '#0d0d16', border: '1px solid #1a1a2e', borderRadius: 8, padding: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              <ScrambleTextMini />
              <div className="font-mono text-[9px] mt-2" style={{ color: '#505060' }}>Scramble Text</div>
            </div>
            <div className="sh-card opacity-0 flex flex-col items-center" style={{ width: 150, background: '#0d0d16', border: '1px solid #1a1a2e', borderRadius: 8, padding: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              <PulseRingMini />
              <div className="font-mono text-[9px] mt-2" style={{ color: '#505060' }}>Pulse Ring</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;

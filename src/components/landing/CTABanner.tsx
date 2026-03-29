import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CTABanner = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.cta-line-inner').forEach((el, i) => {
        gsap.fromTo(el, { y: '100%' }, {
          y: '0%', duration: 0.8, delay: i * 0.12, ease: 'power4.out',
          scrollTrigger: { trigger: el.parentElement!, start: 'top 95%', once: true },
          onComplete: () => {
            // CHANGE 1 — Line 2 stroke pulse
            if (i === 1 && line2Ref.current) {
              gsap.to(line2Ref.current, {
                WebkitTextStrokeColor: '#a78bfa',
                repeat: -1, yoyo: true, duration: 2.5, ease: 'sine.inOut',
              });
            }
            // CHANGE 1 — Line 3 scale pop
            if (i === 2 && line3Ref.current) {
              gsap.from(line3Ref.current, { scale: 0.95, duration: 0.4, ease: 'back.out(2)' });
            }
          },
        });
      });

      // Pricing line animate in
      if (pricingRef.current) {
        gsap.fromTo(pricingRef.current, { opacity: 0, y: 8 }, {
          opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { trigger: pricingRef.current, start: 'top 95%', once: true },
        });
      }

      // CHANGE 2 — Orb drift animations
      const orbConfigs = [
        { x: 30, y: -20, duration: 7, delay: 0 },
        { x: -20, y: 30, duration: 9, delay: 2 },
        { x: 15, y: 20, duration: 6, delay: 4 },
      ];
      orbRefs.current.forEach((orb, i) => {
        if (!orb || !orbConfigs[i]) return;
        gsap.to(orb, {
          x: orbConfigs[i].x, y: orbConfigs[i].y,
          repeat: -1, yoyo: true,
          duration: orbConfigs[i].duration,
          ease: 'sine.inOut',
          delay: orbConfigs[i].delay,
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const hoverCta = (e: React.MouseEvent, enter: boolean) => {
    gsap.to(e.currentTarget, { scale: enter ? 1.03 : 1, duration: 0.2 });
  };

  const orbData = [
    { size: 180, color: '#7c3aed', opacity: 0.12, left: '10%', top: '20%' },
    { size: 140, color: '#a78bfa', opacity: 0.08, left: '70%', top: '60%' },
    { size: 200, color: '#6d28d9', opacity: 0.1, left: '50%', top: '30%' },
  ];

  return (
    <section ref={sectionRef} className="relative flex flex-col items-center justify-center overflow-hidden px-5" style={{ minHeight: '100vh', background: '#13131e' }}>
      {orbData.map((o, i) => (
        <div
          key={i}
          ref={el => { orbRefs.current[i] = el; }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: o.size, height: o.size, left: o.left, top: o.top,
            background: o.color, opacity: o.opacity, filter: 'blur(50px)',
          }}
        />
      ))}

      <div className="relative z-10 text-center w-full">
        {['Start building.', 'Ship faster.', 'Look better.'].map((line, i) => (
          <div key={i} className="overflow-hidden">
            <div
              ref={i === 1 ? line2Ref : i === 2 ? line3Ref : undefined}
              className="cta-line-inner font-syne font-extrabold"
              style={{
                fontSize: 'clamp(2.5rem, 11vw, 6rem)', lineHeight: 1.05,
                ...(i === 0 ? { color: '#f0ede8' } :
                  i === 1 ? { WebkitTextStroke: '1.5px #7c3aed', color: 'transparent' } :
                    { color: '#7c3aed' }),
              }}
            >
              {line}
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-12 w-full">
          <button
            className="font-syne font-bold text-sm px-6 py-3.5 sm:py-3 rounded-md w-full sm:w-auto"
            style={{ border: '1px solid #7c3aed', color: '#a78bfa', background: 'transparent' }}
            onClick={() => navigate('/components')}
            onMouseEnter={e => {
              hoverCta(e, true);
              (e.currentTarget as HTMLElement).style.background = '#7c3aed';
              (e.currentTarget as HTMLElement).style.color = '#fff';
            }}
            onMouseLeave={e => {
              hoverCta(e, false);
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = '#a78bfa';
            }}
          >
            Browse Components
          </button>
          <button
            className="font-inter font-medium text-sm px-6 py-3.5 sm:py-3 rounded-md w-full sm:w-auto"
            style={{ border: '1px solid #222235', color: '#707080', background: 'transparent' }}
            onClick={() => navigate('/blocks')}
            onMouseEnter={e => {
              hoverCta(e, true);
              (e.currentTarget as HTMLElement).style.borderColor = '#2a2a3e';
              (e.currentTarget as HTMLElement).style.color = '#f0ede8';
            }}
            onMouseLeave={e => {
              hoverCta(e, false);
              (e.currentTarget as HTMLElement).style.borderColor = '#222235';
              (e.currentTarget as HTMLElement).style.color = '#707080';
            }}
          >
            View Blocks
          </button>
        </div>

        {/* CHANGE 3 — Pricing info */}
        <div ref={pricingRef} className="flex flex-wrap items-center justify-center gap-3 mt-8 opacity-0">
          <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.15em', color: '#404050' }}>
            One-time payment · $49 lifetime · No subscription
          </span>
          <button
            className="font-mono"
            style={{ fontSize: 10, letterSpacing: '0.15em', color: '#7c3aed', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => navigate('/pricing')}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#a78bfa'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#7c3aed'; }}
          >
            View pricing →
          </button>
        </div>

        {/* CHANGE 4 — Updated footer note */}
        <p className="font-mono text-[11px] mt-10 text-center" style={{ color: '#404050' }}>
          Free components forever · Pro access from $49 · No subscription
        </p>
      </div>
    </section>
  );
};

export default CTABanner;

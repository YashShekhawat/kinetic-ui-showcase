import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

const FREE_FEATURES = [
  'All free components',
  'All free blocks',
  'Copy-paste ready',
  'TypeScript support',
  'Community support',
  'MIT license',
];

const PRO_FEATURES = [
  'Everything in Free',
  'All pro components',
  'All pro blocks',
  'Future additions included',
  'AI prompt buttons',
  'Commercial license',
  'Priority support',
];

const MONTHLY = { free: '$0', pro: '$49', period: 'one-time', badge: 'LIFETIME' };
const YEARLY  = { free: '$0', pro: '$39', period: 'limited offer', badge: 'SAVE 20%' };

// ── Animated tick-in feature list
const FeatureList = ({
  features,
  accent,
  delay = 0,
}: {
  features: string[];
  accent: string;
  delay?: number;
}) => {
  const listRef = useRef<HTMLUListElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    gsap.set(items, { opacity: 0, x: -12 });

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          gsap.to(items, {
            opacity: 1, x: 0,
            duration: 0.45,
            stagger: 0.07,
            ease: 'power3.out',
            delay,
          });
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <ul ref={listRef} style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {features.map((f, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Checkmark box */}
          <span style={{
            width: 18, height: 18, borderRadius: 4, flexShrink: 0,
            background: `${accent}18`,
            border: `1px solid ${accent}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="font-inter" style={{ fontSize: '0.8rem', color: '#909098', lineHeight: 1.4 }}>
            {i === 0 && f.startsWith('Everything')
              ? <><span style={{ color: accent, fontWeight: 600 }}>{f.split(' in ')[0]}</span>{' in ' + f.split(' in ')[1]}</>
              : f
            }
          </span>
        </li>
      ))}
    </ul>
  );
};

// ── Price display with morph animation
const PriceDisplay = ({ value, period, accent }: { value: string; period: string; accent: string }) => {
  const numRef  = useRef<HTMLSpanElement>(null);
  const prevVal = useRef(value);

  useEffect(() => {
    if (!numRef.current || value === prevVal.current) return;
    gsap.fromTo(numRef.current,
      { opacity: 0, y: -16, scale: 0.85 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(2)' }
    );
    prevVal.current = value;
  }, [value]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span className="font-syne font-extrabold" style={{ fontSize: '0.9rem', color: '#606070' }}>
          {value === '$0' ? '' : 'USD'}
        </span>
        <span
          ref={numRef}
          className="font-syne font-extrabold"
          style={{ fontSize: '3rem', color: value === '$0' ? '#f0ede8' : accent, lineHeight: 1 }}
        >
          {value}
        </span>
      </div>
      <span className="font-mono" style={{ fontSize: '9px', color: '#404050', letterSpacing: '0.15em' }}>
        {period.toUpperCase()}
      </span>
    </div>
  );
};

// ── Toggle
const BillingToggle = ({ yearly, onToggle }: { yearly: boolean; onToggle: () => void }) => {
  const knobRef    = useRef<HTMLSpanElement>(null);
  const badgeRef   = useRef<HTMLSpanElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!knobRef.current || !trackRef.current) return;
    const trackW = trackRef.current.offsetWidth;
    gsap.to(knobRef.current, {
      x: yearly ? trackW - 28 : 2,
      duration: 0.35, ease: 'power3.inOut',
    });
    gsap.to(trackRef.current, {
      background: yearly ? 'rgba(124,58,237,0.25)' : 'rgba(30,30,46,1)',
      duration: 0.3,
    });
  }, [yearly]);

  useEffect(() => {
    if (!badgeRef.current) return;
    gsap.fromTo(badgeRef.current,
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: yearly ? 1 : 0, duration: 0.3, ease: 'back.out(2)' }
    );
  }, [yearly]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 40, flexWrap: 'nowrap', width: '100%' }}>
      <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.12em', color: !yearly ? '#f0ede8' : '#404050' }}>
        MONTHLY
      </span>

      <div
        ref={trackRef}
        onClick={onToggle}
        style={{
          width: 52, height: 26, borderRadius: 13,
          background: '#1e1e2e',
          border: '1px solid #2a2a3e',
          position: 'relative', cursor: 'pointer',
          transition: 'border-color 0.3s',
        }}
      >
        <span
          ref={knobRef}
          style={{
            position: 'absolute', top: 2, left: 2,
            width: 20, height: 20, borderRadius: '50%',
            background: '#7c3aed',
            display: 'block',
            boxShadow: '0 0 8px rgba(124,58,237,0.5)',
          }}
        />
      </div>

      <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.12em', color: yearly ? '#f0ede8' : '#404050' }}>
        YEARLY
      </span>

      <span
        ref={badgeRef}
        className="font-mono"
        style={{
          fontSize: '9px', letterSpacing: '0.15em',
          color: '#7c3aed', border: '1px solid rgba(124,58,237,0.35)',
          background: 'rgba(124,58,237,0.1)',
          padding: '2px 8px', borderRadius: 20, opacity: 0,
        }}
      >
        SAVE 20%
      </span>
    </div>
  );
};

// ── CTA button with shimmer
const CTAButton = ({ primary, label, accent }: { primary: boolean; label: string; accent: string }) => {
  const btnRef     = useRef<HTMLButtonElement>(null);
  const shimmerRef = useRef<HTMLSpanElement>(null);

  const onEnter = () => {
    if (!primary || !shimmerRef.current) return;
    gsap.fromTo(shimmerRef.current,
      { x: '-110%', opacity: 1 },
      { x: '110%', duration: 0.55, ease: 'power2.inOut' }
    );
  };

  return (
    <button
      ref={btnRef}
      onMouseEnter={onEnter}
      style={{
        width: '100%',
        padding: '13px 20px',
        borderRadius: 10,
        border: primary ? 'none' : `1px solid #2a2a3e`,
        background: primary ? accent : 'transparent',
        color: primary ? '#fff' : '#909098',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'inherit',
      }}
    >
      <span className="font-syne font-bold" style={{ fontSize: '0.85rem', position: 'relative', zIndex: 2 }}>
        {label}
      </span>
      {primary && (
        <span
          ref={shimmerRef}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
            pointerEvents: 'none', zIndex: 1,
          }}
        />
      )}
    </button>
  );
};

// ── Main block
const GlowPricingBlock = () => {
  const isMobile      = useIsMobile();
  const [yearly, setYearly] = useState(false);
  const rootRef       = useRef<HTMLDivElement>(null);
  const headerRef     = useRef<HTMLDivElement>(null);
  const toggleRef     = useRef<HTMLDivElement>(null);
  const leftRef       = useRef<HTMLDivElement>(null);
  const rightRef      = useRef<HTMLDivElement>(null);
  const dividerRef    = useRef<HTMLDivElement>(null);
  const orb1Ref       = useRef<HTMLDivElement>(null);
  const orb2Ref       = useRef<HTMLDivElement>(null);
  const hasEntered    = useRef(false);

  const pricing = yearly ? YEARLY : MONTHLY;

  // Entrance animation
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasEntered.current) {
        hasEntered.current = true;
        const tl = gsap.timeline();

        tl.fromTo(headerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
          .fromTo(toggleRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.2')
          .fromTo(leftRef.current, { opacity: 0, x: isMobile ? 0 : -30, y: isMobile ? 20 : 0 }, { opacity: 1, x: 0, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.1')
          .fromTo(dividerRef.current, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.5, ease: 'power3.inOut', transformOrigin: 'top' }, '-=0.3')
          .fromTo(rightRef.current, { opacity: 0, x: isMobile ? 0 : 30, y: isMobile ? 20 : 0 }, { opacity: 1, x: 0, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
      }
    }, { threshold: 0.1 });

    obs.observe(root);
    return () => obs.disconnect();
  }, [isMobile]);

  // Orb drift
  useEffect(() => {
    if (orb1Ref.current) {
      gsap.to(orb1Ref.current, { x: 20, y: -15, repeat: -1, yoyo: true, duration: 6, ease: 'sine.inOut' });
    }
    if (orb2Ref.current) {
      gsap.to(orb2Ref.current, { x: -15, y: 20, repeat: -1, yoyo: true, duration: 8, ease: 'sine.inOut', delay: 2 });
    }
  }, []);

  const cardBase: React.CSSProperties = {
    flex: isMobile ? 'none' : '1 1 0',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    padding: isMobile ? '24px 20px' : '32px 28px',
    position: 'relative',
    overflow: 'visible',
  };

  return (
    <div
      data-preview="true"
      ref={rootRef}
      style={{ background: '#0e0e14', width: '100%', boxSizing: 'border-box', padding: isMobile ? '32px 16px 36px' : '40px 32px 44px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background orbs */}
      <div ref={orb1Ref} style={{ position: 'absolute', top: '10%', left: '20%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
      <div ref={orb2Ref} style={{ position: 'absolute', bottom: '10%', right: '15%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.06), transparent 70%)', filter: 'blur(24px)', pointerEvents: 'none' }} />

      {/* Header */}
      <div ref={headerRef} style={{ textAlign: 'center', marginBottom: 28, opacity: 0 }}>
        <span className="font-mono inline-block" style={{ fontSize: '10px', color: '#a78bfa', letterSpacing: '0.2em', border: '1px solid rgba(124,58,237,0.25)', background: 'rgba(124,58,237,0.07)', padding: '3px 12px', borderRadius: 20, marginBottom: 14 }}>
          SIMPLE PRICING
        </span>
        <h2 className="font-syne font-extrabold" style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', color: '#f0ede8', lineHeight: 1.1, margin: 0 }}>
          One price.{' '}
          <span style={{ color: 'transparent', WebkitTextStroke: '1.5px #7c3aed' }}>
            Everything.
          </span>
        </h2>
        <p className="font-inter font-light" style={{ fontSize: '0.82rem', color: '#606070', marginTop: 10, lineHeight: 1.6 }}>
          No subscription. No hidden fees. Own it forever.
        </p>
      </div>

      {/* Toggle */}
      <div ref={toggleRef} style={{ opacity: 0 }}>
        <BillingToggle yearly={yearly} onToggle={() => setYearly(y => !y)} />
      </div>

      {/* Cards wrapper */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 0 : 0,
        border: '1px solid #1e1e2e',
        borderRadius: 16,
        overflow: isMobile ? 'visible' : 'hidden',
        position: 'relative',
        background: '#0d0d12',
      }}>

        {/* ── FREE card */}
        <div ref={leftRef} style={{ ...cardBase, opacity: 0 }}>
          {/* Subtle top gradient */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, #2a2a3e, transparent)' }} />

          <div style={{ marginBottom: 6 }}>
            <span className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#606070' }}>FREE</span>
          </div>
          <h3 className="font-syne font-extrabold" style={{ fontSize: '1.3rem', color: '#f0ede8', marginBottom: 4 }}>Starter</h3>
          <p className="font-inter font-light" style={{ fontSize: '0.75rem', color: '#606070', marginBottom: 20, lineHeight: 1.5 }}>
            Everything you need to get started building with GSAP.
          </p>

          <PriceDisplay value={pricing.free} period="forever free" accent="#a78bfa" />

          <div style={{ flex: 1, marginBottom: 24 }}>
            <FeatureList features={FREE_FEATURES} accent="#a78bfa" delay={0.3} />
          </div>

          <CTAButton primary={false} label="Browse Free Components" accent="#a78bfa" />
        </div>

        {/* ── DIVIDER */}
        {!isMobile && (
          <div ref={dividerRef} style={{
            width: 1, flexShrink: 0,
            background: 'linear-gradient(to bottom, transparent, #7c3aed60, #7c3aed, #7c3aed60, transparent)',
            opacity: 0,
            alignSelf: 'stretch',
            position: 'relative',
          }}>
            {/* Center dot on divider */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 8, height: 8, borderRadius: '50%',
              background: '#7c3aed',
              boxShadow: '0 0 12px #7c3aed',
            }} />
          </div>
        )}

        {/* Mobile divider */}
        {isMobile && (
          <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #7c3aed, transparent)', margin: '0 20px' }} />
        )}

        {/* ── PRO card */}
        <div ref={rightRef} style={{ ...cardBase, opacity: 0, position: 'relative' }}>
          {/* Violet glow top */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, #7c3aed, transparent)' }} />
          <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 40, background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#7c3aed' }}>PRO</span>
            <span className="font-mono" style={{
              fontSize: '8px', letterSpacing: '0.15em', color: '#7c3aed',
              border: '1px solid rgba(124,58,237,0.35)', background: 'rgba(124,58,237,0.1)',
              padding: '1px 7px', borderRadius: 10,
            }}>
              {pricing.badge}
            </span>
          </div>

          <h3 className="font-syne font-extrabold" style={{ fontSize: '1.3rem', color: '#f0ede8', marginBottom: 4 }}>Pro Access</h3>
          <p className="font-inter font-light" style={{ fontSize: '0.75rem', color: '#606070', marginBottom: 20, lineHeight: 1.5 }}>
            Every component, every block, every future addition. Yours forever.
          </p>

          <PriceDisplay value={pricing.pro} period={pricing.period} accent="#7c3aed" />

          <div style={{ flex: 1, marginBottom: 24 }}>
            <FeatureList features={PRO_FEATURES} accent="#7c3aed" delay={0.5} />
          </div>

          <CTAButton primary={true} label="Get Lifetime Access" accent="#7c3aed" />

          <p className="font-mono" style={{ fontSize: '9px', color: '#404050', textAlign: 'center', marginTop: 12, letterSpacing: '0.08em' }}>
            Already purchased?{' '}
            <span style={{ color: '#7c3aed', cursor: 'pointer' }}>Enter license key →</span>
          </p>
        </div>
      </div>

      {/* Footer note */}
      <p className="font-mono" style={{ textAlign: 'center', fontSize: '9px', color: '#2a2a3e', letterSpacing: '0.15em', marginTop: 20 }}>
        KINETIC UI — GLOW PRICING
      </p>
    </div>
  );
};

export default GlowPricingBlock;
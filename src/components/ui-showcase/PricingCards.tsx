import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

const plans = [
  {
    name: 'Starter',
    desc: 'Perfect for side projects and personal use.',
    monthly: 0,
    annual: 0,
    freeTag: true,
    features: [
      '5 components per project',
      'Basic GSAP animations',
      'Community support',
      'MIT License',
      'Documentation access',
    ],
    checkColor: '#22c55e',
    recommended: false,
    btnStyle: 'outline' as const,
  },
  {
    name: 'Pro',
    desc: 'For professional developers and small teams.',
    monthly: 12,
    annual: 9,
    freeTag: false,
    features: [
      'Unlimited components',
      'All GSAP animations',
      'Priority support',
      'Commercial license',
      'Early access to new components',
    ],
    checkColor: '#7c3aed',
    recommended: true,
    btnStyle: 'primary' as const,
  },
  {
    name: 'Team',
    desc: 'For growing teams that need more power and control.',
    monthly: 39,
    annual: 29,
    freeTag: false,
    features: [
      'Everything in Pro',
      'Team license (10 seats)',
      'Custom animations',
      'Dedicated support',
      'Private Discord access',
    ],
    checkColor: '#22c55e',
    recommended: false,
    btnStyle: 'outline' as const,
  },
];

const PricingCards = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRefs = useRef<HTMLElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const priceRefs = useRef<HTMLSpanElement[]>([]);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const proGlowRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const ctx = gsap.context(() => {
      headerRefs.current.forEach((el, i) => {
        if (el) gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: i * 0.1, ease: 'power3.out' });
      });
      cardRefs.current.forEach((el, i) => {
        if (el) gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.4 + i * 0.1, ease: 'power3.out' });
      });
      if (proGlowRef.current) {
        gsap.to(proGlowRef.current, {
          boxShadow: '0 0 0 1px rgba(124,58,237,0.6)',
          duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut',
        });
      }
      if (bottomRef.current) {
        gsap.fromTo(bottomRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 1 });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleToggle = (annual: boolean) => {
    if (annual === isAnnual) return;
    if (indicatorRef.current) {
      gsap.to(indicatorRef.current, { x: annual ? '100%' : '0%', duration: 0.3, ease: 'power2.out' });
    }
    priceRefs.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, {
        yPercent: -100, opacity: 0, duration: 0.2, ease: 'power2.in',
        onComplete: () => {
          setIsAnnual(annual);
          gsap.set(el, { yPercent: 100, opacity: 0 });
          gsap.to(el, { yPercent: 0, opacity: 1, duration: 0.2, ease: 'power2.out' });
        },
      });
    });
  };

  const handleCardEnter = (el: HTMLDivElement, isRec: boolean) => {
    gsap.to(el, { y: -4, duration: 0.25, ease: 'power2.out', boxShadow: isRec ? '0 12px 40px rgba(124,58,237,0.15)' : '0 12px 40px rgba(0,0,0,0.3)' });
  };
  const handleCardLeave = (el: HTMLDivElement) => {
    gsap.to(el, { y: 0, duration: 0.2, boxShadow: 'none' });
  };

  return (
    <div ref={containerRef} className="w-full" style={{ background: '#0a0a12', padding: isMobile ? '16px 14px' : '48px 40px', minHeight: 460, pointerEvents: 'none' }}>
      {/* Header */}
      <div className="text-center">
        <span
          ref={el => { if (el) headerRefs.current[0] = el; }}
          className="font-mono text-[10px] inline-block px-3 py-1 rounded mb-4"
          style={{ color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.06)' }}
        >
          PRICING
        </span>
        <h2
          ref={el => { if (el) headerRefs.current[1] = el; }}
          className="font-syne font-extrabold"
          style={{ fontSize: isMobile ? 'clamp(1.4rem, 6vw, 2rem)' : 'clamp(2rem, 5vw, 2.8rem)', color: '#ededed' }}
        >
          Simple pricing.
        </h2>
        <p
          ref={el => { if (el) headerRefs.current[2] = el; }}
          className="font-inter font-light mt-3 mx-auto"
          style={{ fontSize: isMobile ? '0.75rem' : 14, color: '#606070', maxWidth: 400 }}
        >
          No hidden fees. No surprises. Cancel anytime.
        </p>
      </div>

      {/* Toggle */}
      <div className="flex justify-center mt-8">
        <div
          className="relative inline-flex"
          style={{ border: '1px solid #1a1a2e', borderRadius: 6, background: '#080810', padding: isMobile ? 2 : undefined }}
        >
          <div
            ref={indicatorRef}
            className="absolute top-0.5 left-0.5"
            style={{
              width: 'calc(50% - 2px)', height: 'calc(100% - 4px)',
              background: '#0d0d16', border: '1px solid #1a1a2e', borderRadius: 4, transition: 'none',
            }}
          />
          <button
            onClick={() => handleToggle(false)}
            className="relative z-[1] font-inter font-medium cursor-pointer"
            style={{ color: !isAnnual ? '#ededed' : '#505060', background: 'transparent', border: 'none', fontSize: isMobile ? 11 : 13, padding: isMobile ? '6px 12px' : '8px 20px', pointerEvents: 'auto' }}
          >
            Monthly
          </button>
          <button
            onClick={() => handleToggle(true)}
            className="relative z-[1] font-inter font-medium flex items-center gap-1.5 cursor-pointer"
            style={{ color: isAnnual ? '#ededed' : '#505060', background: 'transparent', border: 'none', fontSize: isMobile ? 11 : 13, padding: isMobile ? '6px 12px' : '8px 20px', pointerEvents: 'auto' }}
          >
            Annually
            <span
              className="font-mono px-2 py-0.5 rounded"
              style={{ fontSize: 9, color: '#22c55e', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
            >
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div
        className="mt-8 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        style={{ maxWidth: 900, alignItems: 'start', gap: isMobile ? 10 : 12 }}
      >
        {plans.map((plan, i) => (
          <div
            key={i}
            ref={el => { if (el) { cardRefs.current[i] = el; if (plan.recommended) proGlowRef.current = el; } }}
            className={`opacity-0 relative overflow-hidden ${plan.recommended ? 'md:col-span-1' : ''} ${i === 2 ? 'md:col-span-2 lg:col-span-1' : ''}`}
            style={{
              background: plan.recommended ? '#0f0f1e' : '#0d0d16',
              border: plan.recommended ? '1px solid rgba(124,58,237,0.3)' : '1px solid #1a1a2e',
              borderRadius: 8,
              padding: isMobile ? 16 : '28px 24px',
            }}
            onMouseEnter={e => handleCardEnter(e.currentTarget, plan.recommended)}
            onMouseLeave={e => handleCardLeave(e.currentTarget)}
          >
            {plan.recommended && (
              <span
                className="absolute font-mono text-white"
                style={{
                  top: -1, left: '50%', transform: 'translateX(-50%)',
                  background: '#7c3aed', borderRadius: '0 0 4px 4px', letterSpacing: '0.1em',
                  fontSize: isMobile ? 8 : 9,
                  padding: isMobile ? '2px 12px' : '4px 16px',
                }}
              >
                RECOMMENDED
              </span>
            )}

            <h3
              className="font-syne font-bold"
              style={{ fontSize: isMobile ? '0.9rem' : '1rem', color: '#ededed', marginTop: plan.recommended ? 16 : 0, marginBottom: 8 }}
            >
              {plan.name}
            </h3>
            <p className="font-inter font-light" style={{ fontSize: 12, color: '#606070', marginBottom: 20 }}>
              {plan.desc}
            </p>

            <div className="overflow-hidden" style={{ height: isMobile ? '3rem' : '3.5rem' }}>
              <span ref={el => { if (el) priceRefs.current[i] = el; }} className="flex items-baseline">
                <span className="font-syne font-extrabold" style={{ fontSize: isMobile ? 'clamp(1.6rem, 6vw, 2.2rem)' : '2.8rem', color: '#ededed' }}>
                  ${isAnnual ? plan.annual : plan.monthly}
                </span>
                <span className="font-inter font-light text-[13px] ml-1" style={{ color: '#505060' }}>/mo</span>
              </span>
            </div>

            {plan.freeTag && (
              <span className="font-mono text-[10px] block mt-1" style={{ color: '#22c55e' }}>Free forever</span>
            )}
            {plan.recommended && isAnnual && plan.monthly !== plan.annual && (
              <span className="font-inter font-light text-[12px] line-through ml-1" style={{ color: '#505060' }}>
                ${plan.monthly}/mo
              </span>
            )}

            <div style={{ height: 1, background: plan.recommended ? 'rgba(124,58,237,0.15)' : '#1a1a2e', margin: '20px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 8 : 10 }}>
              {plan.features.map((feat, fi) => (
                <div key={fi} className="flex items-start gap-2">
                  <span style={{ color: plan.checkColor, fontSize: 12, lineHeight: '18px' }}>✓</span>
                  <span className="font-inter font-light" style={{ fontSize: isMobile ? '0.75rem' : 12, color: '#606070' }}>{feat}</span>
                </div>
              ))}
            </div>

            <button
              className="w-full mt-5 font-inter font-medium rounded-md cursor-pointer"
              style={{
                ...(plan.btnStyle === 'primary'
                  ? { background: '#7c3aed', color: 'white', border: 'none' }
                  : { background: 'transparent', border: '1px solid #1a1a2e', color: '#606070' }),
                fontSize: isMobile ? '0.8rem' : '0.8125rem',
                padding: isMobile ? '8px 0' : '10px 0',
                pointerEvents: 'auto',
              }}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingCards;

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { PRO_CONFIG } from '@/config/proConfig';
import AuthModal from '@/components/AuthModal';
import { usePro } from '@/hooks/usePro';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';
import { blocks, blockCategories } from '@/config/components.config';
import { useIsMobile } from '@/hooks/use-mobile';

const faqItems = [
  {
    q: 'Is this a one-time payment?',
    a: 'Yes. Pay once and get lifetime access to every current and future Pro component. No subscriptions, no renewals.',
  },
  {
    q: 'Do I get future components included?',
    a: 'Absolutely. Every new component and block we release is included in your Pro license at no extra cost.',
  },
  {
    q: 'Can I use this in client projects?',
    a: 'Yes. Your Pro license includes a commercial license. Use the components in unlimited personal and client projects.',
  },
  {
    q: 'What counts as commercial use?',
    a: 'Any project you get paid for — freelance work, agency projects, SaaS products, startup MVPs. All covered.',
  },
  {
    q: 'How do I activate my license?',
    a: 'After purchase, sign in with your email using a magic link. Your Pro access will be activated automatically.',
  },
  {
    q: 'What if I need a refund?',
    a: 'We offer a 14-day money-back guarantee. If you\'re not satisfied, contact us and we\'ll process your refund promptly.',
  },
];

const FREE_FEATURES = [
  'All free components',
  'All free blocks',
  'Copy-paste ready',
  'TypeScript support',
  'Community support',
];

const PRO_FEATURES = [
  'Everything in Free',
  'All pro components',
  'All pro blocks',
  'One-click AI prompts for Lovable, Bolt and v0',
  'Every future addition included',
  'Commercial license',
  'Priority support',
];

// ── Animated tick-in feature list
const FeatureList = ({ features, accent, delay = 0 }: { features: string[]; accent: string; delay?: number }) => {
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const items = Array.from(el.children) as HTMLElement[];
      gsap.set(items, { opacity: 0, x: -12 });
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(items, { opacity: 1, x: 0, duration: 0.45, stagger: 0.07, ease: 'power3.out', delay });
          obs.disconnect();
        }
      }, { threshold: 0.2 });
      obs.observe(el);
      return () => obs.disconnect();
    }, listRef);
    return () => ctx.revert();
  }, [delay]);

  return (
    <ul ref={listRef} style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {features.map((f, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 18, height: 18, borderRadius: 4, flexShrink: 0,
            background: `${accent}18`, border: `1px solid ${accent}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="font-inter" style={{ fontSize: '0.8rem', color: '#b0b0c0', lineHeight: 1.4 }}>
            {i === 0 && f.startsWith('Everything')
              ? <><span style={{ color: accent, fontWeight: 600 }}>{f.split(' in ')[0]}</span>{' in ' + f.split(' in ')[1]}</>
              : f}
          </span>
        </li>
      ))}
    </ul>
  );
};

const PricingPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isPro } = usePro();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    if (!cardsWrapperRef.current) return;
    const ctx = gsap.context(() => {
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          const tl = gsap.timeline();
          tl.fromTo(headerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
            .fromTo(leftRef.current, { opacity: 0, x: isMobile ? 0 : -30, y: isMobile ? 20 : 0 }, { opacity: 1, x: 0, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.1')
            .fromTo(dividerRef.current, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.5, ease: 'power3.inOut', transformOrigin: 'top' }, '-=0.3')
            .fromTo(rightRef.current, { opacity: 0, x: isMobile ? 0 : 30, y: isMobile ? 20 : 0 }, { opacity: 1, x: 0, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
          obs.disconnect();
        }
      }, { threshold: 0.1 });
      obs.observe(cardsWrapperRef.current!);
      return () => obs.disconnect();
    }, cardsWrapperRef);
    return () => ctx.revert();
  }, [isMobile]);

  // Orb drift
  useEffect(() => {
    if (orb1Ref.current) gsap.to(orb1Ref.current, { x: 20, y: -15, repeat: -1, yoyo: true, duration: 6, ease: 'sine.inOut' });
    if (orb2Ref.current) gsap.to(orb2Ref.current, { x: -15, y: 20, repeat: -1, yoyo: true, duration: 8, ease: 'sine.inOut', delay: 2 });
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
    <div className="min-h-screen" style={{ background: '#060608' }}>
      <TopBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search..."
        rightText="Pricing"
        items={blocks}
        categories={blockCategories}
      />

      <div className="pt-20 pb-24 px-4" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background orbs */}
        <div ref={orb1Ref} style={{ position: 'absolute', top: '10%', left: '20%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
        <div ref={orb2Ref} style={{ position: 'absolute', bottom: '10%', right: '15%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.06), transparent 70%)', filter: 'blur(24px)', pointerEvents: 'none' }} />

        {/* Header */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-12" style={{ opacity: 0 }}>
          <span
            className="font-mono text-[10px] uppercase inline-block px-3 py-1 rounded-full mb-5"
            style={{
              color: '#a78bfa',
              border: '1px solid rgba(124,58,237,0.3)',
              background: 'rgba(124,58,237,0.07)',
              letterSpacing: '0.2em',
            }}
          >
            SIMPLE PRICING
          </span>
          <h1
            className="font-syne font-extrabold leading-[1.05] mb-4"
            style={{ fontSize: isMobile ? '1.8rem' : '3rem', color: '#f0ede8' }}
          >
            One price.{' '}
            <span style={{ color: 'transparent', WebkitTextStroke: '1.5px #7c3aed' }}>
              Everything.
            </span>
          </h1>
          <p className="font-inter font-light text-[15px]" style={{ color: '#909098' }}>
            No subscription. No hidden fees. Own it forever.
          </p>
        </div>

        {/* Glow Pricing Cards */}
        <div
          ref={cardsWrapperRef}
          className="max-w-3xl mx-auto mb-24"
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            border: '1px solid #1a1a2e',
            borderRadius: 16,
            overflow: isMobile ? 'visible' : 'hidden',
            position: 'relative',
            background: '#10101a',
          }}
        >
          {/* FREE card */}
          <div ref={leftRef} style={{ ...cardBase, opacity: 0 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, #2a2a3e, transparent)' }} />

            <div style={{ marginBottom: 6 }}>
              <span className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#707080' }}>FREE</span>
            </div>
            <h3 className="font-syne font-extrabold" style={{ fontSize: '1.3rem', color: '#f0ede8', marginBottom: 4 }}>Starter</h3>
            <p className="font-inter font-light" style={{ fontSize: '0.75rem', color: '#707080', marginBottom: 20, lineHeight: 1.5 }}>
              Everything you need to get started building with GSAP.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
              <span className="font-syne font-extrabold" style={{ fontSize: '3rem', color: '#f0ede8', lineHeight: 1 }}>$0</span>
              <span className="font-mono" style={{ fontSize: '9px', color: '#404050', letterSpacing: '0.15em' }}>FOREVER FREE</span>
            </div>

            <div style={{ flex: 1, marginBottom: 24 }}>
              <FeatureList features={FREE_FEATURES} accent="#a78bfa" delay={0.3} />
            </div>

            <button
              onClick={() => navigate('/components')}
              className="font-syne font-bold"
              style={{
                width: '100%', padding: '13px 20px', borderRadius: 10,
                border: '1px solid #2a2a3e', background: 'transparent',
                color: '#b0b0c0', cursor: 'pointer', fontSize: '0.85rem',
              }}
            >
              Browse Free Components
            </button>
          </div>

          {/* Divider */}
          {!isMobile && (
            <div ref={dividerRef} style={{
              width: 1, flexShrink: 0,
              background: 'linear-gradient(to bottom, transparent, #7c3aed60, #7c3aed, #7c3aed60, transparent)',
              opacity: 0, alignSelf: 'stretch', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 8, height: 8, borderRadius: '50%',
                background: '#7c3aed', boxShadow: '0 0 12px #7c3aed',
              }} />
            </div>
          )}
          {isMobile && (
            <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #7c3aed, transparent)', margin: '0 20px' }} />
          )}

          {/* PRO card */}
          <div ref={rightRef} style={{ ...cardBase, opacity: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, #7c3aed, transparent)' }} />
            <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 40, background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#7c3aed' }}>PRO</span>
              <span className="font-mono" style={{
                fontSize: '8px', letterSpacing: '0.15em', color: '#7c3aed',
                border: '1px solid rgba(124,58,237,0.35)', background: 'rgba(124,58,237,0.1)',
                padding: '1px 7px', borderRadius: 10,
              }}>
                LIFETIME
              </span>
            </div>

            <h3 className="font-syne font-extrabold" style={{ fontSize: '1.3rem', color: '#f0ede8', marginBottom: 4 }}>Pro Access</h3>
            <p className="font-inter font-light" style={{ fontSize: '0.75rem', color: '#707080', marginBottom: 20, lineHeight: 1.5 }}>
              Every component, every block, every future addition. Yours forever.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="font-syne font-extrabold" style={{ fontSize: '0.9rem', color: '#707080' }}>USD</span>
                <span className="font-syne font-extrabold" style={{ fontSize: '3rem', color: '#7c3aed', lineHeight: 1 }}>$49</span>
              </div>
              <span className="font-mono" style={{ fontSize: '9px', color: '#404050', letterSpacing: '0.15em' }}>ONE-TIME PAYMENT</span>
            </div>

            <div style={{ flex: 1, marginBottom: 24 }}>
              <FeatureList features={PRO_FEATURES} accent="#7c3aed" delay={0.5} />
            </div>

            {isPro ? (
              <div className="text-center py-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span className="font-syne font-bold text-[16px]" style={{ color: '#22c55e' }}>
                    You have Pro access
                  </span>
                </div>
                <p className="font-inter text-[13px]" style={{ color: '#909098' }}>
                  You're all set. Every component and block is unlocked.
                </p>
              </div>
            ) : (
              <>
                <a
                  href={PRO_CONFIG.checkoutUrl}
                  className="lemonsqueezy-button font-syne font-bold"
                  style={{
                    width: '100%', padding: '13px 20px', borderRadius: 10,
                    background: '#7c3aed', color: '#fff', cursor: 'pointer',
                    fontSize: '0.85rem', textAlign: 'center', display: 'block',
                    position: 'relative', overflow: 'hidden', textDecoration: 'none',
                  }}
                >
                  Get Lifetime Access — $49
                </a>
                <p className="font-inter" style={{ fontSize: '13px', color: '#909098', textAlign: 'center', marginTop: 14 }}>
                  Already purchased?{' '}
                  <span
                    onClick={() => setModalOpen(true)}
                    style={{ color: '#a78bfa', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}
                  >
                    Sign in →
                  </span>
                </p>
              </>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-syne font-bold text-xl mb-8 text-center" style={{ color: '#f0ede8' }}>
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-2">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden"
                style={{ background: '#13131e', border: '1px solid #1e1e2e' }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  style={{ background: 'transparent', border: 'none' }}
                >
                  <span className="font-inter font-medium text-[14px]" style={{ color: '#f0ede8' }}>
                    {item.q}
                  </span>
                  <span
                    className="font-mono text-[16px] transition-transform duration-200"
                    style={{ color: '#7c3aed', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="font-inter font-light text-[13px] leading-relaxed" style={{ color: '#909098' }}>
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <Footer />
    </div>
  );
};

export default PricingPage;

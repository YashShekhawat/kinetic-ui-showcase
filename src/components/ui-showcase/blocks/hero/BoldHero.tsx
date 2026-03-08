import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

const BoldHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // Badge fade
      tl.fromTo('.bh-badge', { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0);

      // Blinking dot
      gsap.to('.bh-dot', { opacity: 0, duration: 1, repeat: -1, yoyo: true, ease: 'power2.inOut' });

      // Heading lines reveal
      tl.fromTo('.bh-heading-line', { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 0.7, stagger: 0.1 }, 0.2);

      // Horizontal rule draws left→right
      tl.fromTo('.bh-rule', { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power2.out', transformOrigin: 'left center' }, 0.6);

      // Description
      tl.fromTo('.bh-desc', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 0.9);

      // Stats + CTAs
      tl.fromTo('.bh-cta-row', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 1.1);

      // Marquee
      tl.fromTo('.bh-marquee-wrap', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.3);

      // Marquee scroll
      const inner = ref.current?.querySelector('.bh-marquee-inner') as HTMLDivElement | null;
      if (inner) {
        inner.innerHTML += inner.innerHTML;
        gsap.to(inner, { xPercent: -50, duration: 30, repeat: -1, ease: 'none' });
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  const isSmall = isMobile; // below 768px via useIsMobile

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{
        background: '#0e0e14',
        padding: isSmall ? '28px 20px' : '48px 40px',
        pointerEvents: 'none',
      }}
    >
      {/* Badge */}
      <div
        className="bh-badge opacity-0 flex items-center gap-2 mb-6"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#a78bfa' }}
      >
        <span className="bh-dot inline-block rounded-full" style={{ width: 6, height: 6, background: '#22c55e' }} />
        AVAILABLE FOR WORK
      </div>

      {/* Heading */}
      <div>
        <div className="overflow-hidden">
          <span
            className="bh-heading-line block font-syne font-extrabold"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', color: '#f0ede8', lineHeight: 1.1, letterSpacing: '-0.01em' }}
          >
            We build
          </span>
        </div>
        <div className="overflow-hidden">
          <span
            className="bh-heading-line block font-syne font-extrabold"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
              WebkitTextStroke: '2px #f0ede8',
              color: 'transparent',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
            }}
          >
            the future.
          </span>
        </div>
      </div>

      {/* Horizontal rule */}
      <div className="bh-rule w-full h-px mt-5" style={{ background: '#2a2a3e', transform: 'scaleX(0)' }} />

      {/* Description */}
      <p
        className="bh-desc opacity-0 font-inter font-light"
        style={{
          fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
          color: '#707080',
          maxWidth: 480,
          lineHeight: 1.7,
          marginTop: 16,
        }}
      >
        Craft interfaces that stop people mid-scroll. GSAP-powered. React-ready. Copy and ship.
      </p>

      {/* CTA + Stats row */}
      <div
        className="bh-cta-row opacity-0"
        style={{
          display: 'flex',
          flexDirection: isSmall ? 'column' : 'row',
          alignItems: isSmall ? 'stretch' : 'center',
          gap: isSmall ? 16 : 0,
          marginTop: isSmall ? 20 : 24,
        }}
      >
        {/* On mobile: stats first, then buttons */}
        {isSmall && (
          <div className="flex items-center justify-between">
            {[
              { val: '60+', label: 'Components' },
              { val: '100%', label: 'Open Source' },
              { val: 'Free', label: 'Forever' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <span className="block font-syne font-bold" style={{ fontSize: '1.2rem', color: '#ededed' }}>{s.val}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#505060' }}>{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: isSmall ? 'column' : 'row',
            gap: 8,
            width: isSmall ? '100%' : '60%',
          }}
        >
          <button
            className="font-syne font-semibold rounded-md text-white text-center"
            style={{
              background: '#7c3aed',
              fontSize: 'clamp(0.8rem, 1.2vw, 0.875rem)',
              padding: '10px 28px',
              width: isSmall ? '100%' : 'auto',
              pointerEvents: 'auto',
            }}
          >
            Get Started
          </button>
          <button
            className="font-inter rounded-md text-center"
            style={{
              background: 'transparent',
              border: '1px solid #2a2a3e',
              color: '#707080',
              fontSize: 'clamp(0.8rem, 1.2vw, 0.875rem)',
              padding: '10px 28px',
              width: isSmall ? '100%' : 'auto',
              pointerEvents: 'auto',
            }}
          >
            View Components →
          </button>
        </div>

        {/* Desktop stats */}
        {!isSmall && (
          <div className="flex items-center gap-6 ml-auto">
            {[
              { val: '60+', label: 'Components' },
              { val: '100%', label: 'Open Source' },
              { val: 'Free', label: 'Forever' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <span className="block font-syne font-bold" style={{ fontSize: '1.2rem', color: '#ededed' }}>{s.val}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#505060' }}>{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom marquee */}
      <div
        className="bh-marquee-wrap opacity-0 overflow-hidden"
        style={{ marginTop: 32, borderTop: '1px solid #1a1a2e', paddingTop: 16 }}
      >
        <div className="bh-marquee-inner flex w-max whitespace-nowrap">
          <span
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#303040', marginRight: 8 }}
          >
            GSAP · REACT · MOTION · OPEN SOURCE · GSAP · REACT · MOTION · OPEN SOURCE ·{' '}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BoldHero;

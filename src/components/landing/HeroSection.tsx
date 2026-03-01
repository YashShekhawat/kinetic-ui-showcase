import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo('.lh-badge', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5 }, 0.2);
      tl.fromTo('.lh-line-inner', { y: '100%' }, { y: '0%', duration: 0.9, stagger: 0.1 }, 0.5);
      tl.fromTo('.lh-sub', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, 0.9);
      tl.fromTo('.lh-cta', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 1.2);
      tl.fromTo('.lh-stats', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 1.4);

      tl.add(() => {
        const el = document.querySelector('.lh-count') as HTMLElement;
        if (el) {
          gsap.to(el, { textContent: 60, duration: 1.5, snap: { textContent: 1 }, ease: 'power2.out' });
        }
      }, 1.5);

      tl.fromTo('.lh-scroll', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.8);
      gsap.to('.lh-scroll-dot', { y: 10, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const hoverCta = (e: React.MouseEvent, enter: boolean) => {
    gsap.to(e.currentTarget, { scale: enter ? 1.03 : 1, duration: 0.2 });
  };

  // Reduce aurora blob sizes on mobile
  const blobs = [
    { w: isMobile ? 280 : 400, h: isMobile ? 280 : 400, color: 'rgba(124,58,237,0.2)', left: '20%', top: '20%' },
    { w: isMobile ? 350 : 500, h: isMobile ? 210 : 300, color: 'rgba(167,139,250,0.12)', left: '50%', top: '40%' },
    { w: isMobile ? 245 : 350, h: isMobile ? 245 : 350, color: 'rgba(232,121,249,0.1)', left: '70%', top: '60%' },
  ];

  return (
    <section ref={sectionRef} className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: '100dvh', background: '#060608' }}>
      {/* Aurora orbs */}
      {blobs.map((b, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none" style={{
          width: b.w, height: b.h, left: b.left, top: b.top,
          background: `radial-gradient(circle, ${b.color}, transparent)`,
          filter: 'blur(60px)', opacity: 0.5,
        }} />
      ))}

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #0e0e1a 1px, transparent 1px)',
        backgroundSize: '24px 24px', opacity: 0.5,
      }} />

      <div className="relative z-10 text-center max-w-[720px] px-5 md:px-6">
        {/* Badge */}
        <div className="lh-badge opacity-0 inline-flex items-center font-mono text-[10px] md:text-[11px] px-3 md:px-4 py-1 md:py-1.5 rounded-full mb-8 text-center flex-wrap justify-center"
          style={{ color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.06)', maxWidth: '90vw' }}>
          ✦ GSAP Powered · Zero Framer Motion
        </div>

        {/* Heading */}
        <div className="mb-6">
          <div className="overflow-hidden">
            <div className="lh-line-inner font-syne font-extrabold leading-[1.15] md:leading-[1.1]" style={{ fontSize: 'clamp(2.2rem, 9vw, 4.5rem)', color: '#ededed' }}>
              Animated components
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="lh-line-inner font-syne font-extrabold leading-[1.15] md:leading-[1.1]" style={{ fontSize: 'clamp(2.2rem, 9vw, 4.5rem)' }}>
              <span style={{ color: '#ededed' }}>for the </span>
              <span style={{ color: '#a78bfa' }}>modern web.</span>
            </div>
          </div>
        </div>

        {/* Sub */}
        <p className="lh-sub opacity-0 font-inter font-light leading-[1.7] max-w-[480px] mx-auto px-2 text-[0.9rem] md:text-[1.05rem]" style={{ color: '#606070' }}>
          Copy-paste GSAP animations into your React project. No Framer Motion. No framework lock-in. Just pure motion.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 w-full">
          <button
            className="lh-cta opacity-0 relative overflow-hidden font-syne font-bold text-sm px-6 py-3.5 sm:py-3 rounded-md w-full sm:w-auto"
            style={{ border: '1px solid #7c3aed', background: 'transparent', color: '#a78bfa' }}
            onClick={() => navigate('/components')}
            onMouseEnter={e => {
              hoverCta(e, true);
              (e.currentTarget as HTMLElement).style.background = '#7c3aed';
              (e.currentTarget as HTMLElement).style.color = '#ffffff';
            }}
            onMouseLeave={e => {
              hoverCta(e, false);
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = '#a78bfa';
            }}
          >
            Browse Components →
          </button>
          <button
            className="lh-cta opacity-0 font-inter font-medium text-sm px-6 py-3.5 sm:py-3 rounded-md w-full sm:w-auto"
            style={{ border: '1px solid #1a1a2e', color: '#606070', background: 'transparent' }}
            onClick={() => navigate('/blocks')}
            onMouseEnter={e => {
              hoverCta(e, true);
              (e.currentTarget as HTMLElement).style.borderColor = '#252538';
              (e.currentTarget as HTMLElement).style.color = '#ededed';
            }}
            onMouseLeave={e => {
              hoverCta(e, false);
              (e.currentTarget as HTMLElement).style.borderColor = '#1a1a2e';
              (e.currentTarget as HTMLElement).style.color = '#606070';
            }}
          >
            View Blocks
          </button>
        </div>

        {/* Stats */}
        <div className="lh-stats opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 mt-14">
          {[
            { display: <><span className="lh-count">0</span>+</>, label: 'Components' },
            { display: '100%', label: 'Pure GSAP' },
            { display: 'Free', label: 'Open Source' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="font-syne font-bold text-2xl" style={{ color: '#ededed' }}>{s.display}</span>
              <span className="font-mono text-[10px] mt-1" style={{ color: '#505060' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="lh-scroll opacity-0 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="w-5 h-8 rounded-full flex justify-center pt-2" style={{ border: '1.5px solid #303040' }}>
          <div className="lh-scroll-dot w-[3px] h-[3px] rounded-full" style={{ background: '#7c3aed' }} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

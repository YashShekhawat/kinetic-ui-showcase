import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // Badge
      tl.fromTo('.hero-badge', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6 });

      // Heading lines
      tl.fromTo('.hero-line-inner', { y: '100%' }, { y: '0%', duration: 0.9, stagger: 0.1 }, '-=0.3');

      // Subheading
      tl.fromTo('.hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3');

      // CTAs
      tl.fromTo('.hero-cta', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.3');

      // Stats
      tl.fromTo('.hero-stats', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2');

      // Count up stats
      tl.add(() => {
        document.querySelectorAll('.hero-count').forEach(el => {
          const target = parseInt(el.getAttribute('data-target') || '0');
          gsap.to(el, {
            textContent: target,
            duration: 1.5,
            snap: { textContent: 1 },
            ease: 'power2.out',
          });
        });
      }, '-=0.5');

      // Scroll indicator
      tl.fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '+=0.3');

      // Floating particles
      gsap.utils.toArray<HTMLElement>('.hero-particle').forEach((p, i) => {
        gsap.to(p, {
          y: '-=20',
          duration: 4 + i * 0.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

      // Scroll indicator dot animation
      gsap.to('.scroll-dot', {
        y: 8,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const onHoverCta = (e: React.MouseEvent, enter: boolean) => {
    gsap.to(e.currentTarget, { scale: enter ? 1.03 : 1, duration: 0.2 });
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

      {/* Radial glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Particles */}
      {[
        { left: '15%', top: '20%', size: 4 },
        { left: '80%', top: '30%', size: 3 },
        { left: '25%', top: '70%', size: 5 },
        { left: '70%', top: '75%', size: 3 },
        { left: '50%', top: '15%', size: 4 },
        { left: '90%', top: '60%', size: 3 },
      ].map((p, i) => (
        <div
          key={i}
          className="hero-particle absolute rounded-full pointer-events-none"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: '#7c3aed',
            opacity: 0.3,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 text-center max-w-[800px] px-6">
        {/* Badge */}
        <div className="hero-badge opacity-0 inline-flex items-center gap-1 font-mono text-[11px] text-kinetic-accent-light px-4 py-1.5 rounded-full mb-8"
          style={{
            border: '1px solid rgba(124,58,237,0.25)',
            background: 'rgba(124,58,237,0.06)',
          }}
        >
          ✦ GSAP Powered Components
        </div>

        {/* Heading */}
        <div className="mb-6">
          <div className="overflow-hidden">
            <div className="hero-line-inner font-syne font-extrabold text-kinetic-text leading-[1.1]" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}>
              Animated components
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="hero-line-inner font-syne font-extrabold leading-[1.1]" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}>
              <span className="text-kinetic-text">for the </span>
              <span className="text-kinetic-accent-light">modern web.</span>
            </div>
          </div>
        </div>

        {/* Subheading */}
        <p className="hero-sub opacity-0 font-inter font-light text-lg text-kinetic-text-muted leading-relaxed max-w-[520px] mx-auto">
          Copy-paste GSAP animations into your React project.
          No dependencies. No Framer Motion. Just pure motion.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            className="hero-cta opacity-0 font-inter font-medium text-sm px-6 py-3 rounded-lg text-white transition-shadow"
            style={{ background: '#7c3aed' }}
            onMouseEnter={(e) => {
              onHoverCta(e, true);
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(124,58,237,0.35)';
            }}
            onMouseLeave={(e) => {
              onHoverCta(e, false);
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            Browse Components
          </button>
          <button
            className="hero-cta opacity-0 font-inter font-medium text-sm px-6 py-3 rounded-lg text-kinetic-text-muted transition-colors"
            style={{ border: '1px solid #1a1a1a' }}
            onMouseEnter={(e) => {
              onHoverCta(e, true);
              (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a';
              (e.currentTarget as HTMLElement).style.color = '#ededed';
            }}
            onMouseLeave={(e) => {
              onHoverCta(e, false);
              (e.currentTarget as HTMLElement).style.borderColor = '#1a1a1a';
              (e.currentTarget as HTMLElement).style.color = '#505050';
            }}
          >
            View on GitHub
          </button>
        </div>

        {/* Stats */}
        <div className="hero-stats opacity-0 flex items-center justify-center gap-12 mt-16">
          {[
            { value: 15, suffix: '+', label: 'Components' },
            { value: 100, suffix: '%', label: 'GSAP' },
            { value: 0, suffix: '', label: 'Free & Open Source', isText: true },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              {s.isText ? (
                <span className="font-mono text-xs text-kinetic-text">Free & Open Source</span>
              ) : (
                <span className="font-mono text-xs text-kinetic-text">
                  <span className="hero-count" data-target={s.value}>0</span>{s.suffix} {s.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll opacity-0 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-5 h-8 rounded-full border border-kinetic-border flex justify-center pt-1.5">
          <div className="scroll-dot w-1 h-1 rounded-full bg-kinetic-accent" />
        </div>
      </div>
    </section>
  );
};

export default Hero;

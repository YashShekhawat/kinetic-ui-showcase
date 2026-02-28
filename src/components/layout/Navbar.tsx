import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    ScrollTrigger.create({
      start: 100,
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });

    if (btnRef.current) {
      const btn = btnRef.current;
      const onEnter = () => gsap.to(btn, { scale: 1.04, duration: 0.2 });
      const onLeave = () => gsap.to(btn, { scale: 1, duration: 0.2 });
      btn.addEventListener('mouseenter', onEnter);
      btn.addEventListener('mouseleave', onLeave);
      return () => {
        btn.removeEventListener('mouseenter', onEnter);
        btn.removeEventListener('mouseleave', onLeave);
      };
    }
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 w-full h-14 flex items-center justify-between px-8 z-[100] transition-colors duration-300"
      style={{
        background: 'rgba(3,3,3,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled
          ? '1px solid rgba(124,58,237,0.2)'
          : '1px solid #1a1a1a',
      }}
    >
      {/* Left - Logo */}
      <div className="flex items-center gap-2">
        <span className="font-syne font-extrabold text-lg text-kinetic-text">
          KINETIC
        </span>
        <span className="font-syne font-extrabold text-lg text-kinetic-accent">
          UI
        </span>
        <span
          className="font-mono text-[9px] text-kinetic-accent px-2 py-0.5 rounded ml-1"
          style={{ border: '1px solid rgba(124,58,237,0.3)' }}
        >
          BETA
        </span>
      </div>

      {/* Center - Nav links */}
      <div className="hidden md:flex items-center gap-6">
      {[
          { label: 'Components', target: 'text' },
          { label: 'Docs', target: 'getting-started' },
          { label: 'Examples', target: 'hero' },
        ].map(link => (
          <button
            key={link.label}
            onClick={() => {
              const el = document.getElementById(link.target);
              if (el) {
                const lenis = (window as any).__lenis;
                if (lenis) lenis.scrollTo(el, { duration: 1.2 });
                else el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="font-inter font-medium text-[13px] text-kinetic-text-muted hover:text-kinetic-text transition-colors duration-200"
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <a
          href="#"
          className="hidden md:flex items-center gap-1.5 font-inter font-medium text-[13px] text-kinetic-text-muted hover:text-kinetic-text transition-colors duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          GitHub
        </a>
        <span className="hidden md:block text-kinetic-border">|</span>
        <button
          ref={btnRef}
          className="font-inter font-semibold text-xs px-4 py-1.5 rounded-md text-white transition-all duration-200"
          style={{
            background: '#7c3aed',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.background = '#8b47ff';
            (e.target as HTMLElement).style.boxShadow = '0 0 20px rgba(124,58,237,0.4)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.background = '#7c3aed';
            (e.target as HTMLElement).style.boxShadow = 'none';
          }}
        >
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

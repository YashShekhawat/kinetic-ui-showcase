import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';

const navLinks = [
  { label: 'Components', path: '/components' },
  { label: 'Blocks', path: '/blocks' },
  { label: 'Docs', path: '/docs' },
  { label: 'Pricing', path: '/pricing' },
];

const LandingNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logoRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<HTMLButtonElement[]>([]);

  // CHANGE 4 — Scroll behavior: shrink logo
  useEffect(() => {
    let lastScrolled = false;
    const onScroll = () => {
      const scrolled = window.scrollY > 100;
      if (scrolled === lastScrolled) return;
      lastScrolled = scrolled;
      if (logoRef.current) {
        gsap.to(logoRef.current, { scale: scrolled ? 0.9 : 1, duration: 0.3, ease: 'power2.out' });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMenu = () => {
    const opening = !menuOpen;
    setMenuOpen(opening);

    if (line1Ref.current && line2Ref.current) {
      if (opening) {
        gsap.to(line1Ref.current, { rotation: 45, y: 3.5, duration: 0.3, ease: 'power2.out' });
        gsap.to(line2Ref.current, { rotation: -45, y: -3.5, duration: 0.3, ease: 'power2.out' });
      } else {
        gsap.to(line1Ref.current, { rotation: 0, y: 0, duration: 0.3, ease: 'power2.out' });
        gsap.to(line2Ref.current, { rotation: 0, y: 0, duration: 0.3, ease: 'power2.out' });
      }
    }

    if (overlayRef.current) {
      if (opening) {
        overlayRef.current.style.display = 'flex';
        gsap.fromTo(overlayRef.current, { xPercent: 100 }, { xPercent: 0, duration: 0.4, ease: 'power3.out' });
        linkRefs.current.forEach((link, i) => {
          if (link) {
            gsap.fromTo(link, { clipPath: 'inset(100% 0 0 0)' }, {
              clipPath: 'inset(0% 0 0 0)', duration: 0.4, delay: 0.15 + i * 0.08, ease: 'power3.out',
            });
          }
        });
      } else {
        gsap.to(overlayRef.current, { xPercent: 100, duration: 0.3, ease: 'power2.in', onComplete: () => {
          if (overlayRef.current) overlayRef.current.style.display = 'none';
        }});
      }
    }
  };

  const navAndClose = (path: string) => {
    setMenuOpen(false);
    if (overlayRef.current) {
      gsap.to(overlayRef.current, { xPercent: 100, duration: 0.3, ease: 'power2.in', onComplete: () => {
        if (overlayRef.current) overlayRef.current.style.display = 'none';
      }});
    }
    if (line1Ref.current && line2Ref.current) {
      gsap.to(line1Ref.current, { rotation: 0, y: 0, duration: 0.3 });
      gsap.to(line2Ref.current, { rotation: 0, y: 0, duration: 0.3 });
    }
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className="fixed top-0 w-full h-14 flex items-center justify-between px-5 md:px-8 z-[100]"
        style={{
          background: 'rgba(14,14,20,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #222235',
        }}
      >
        {/* CHANGE 4 — Logo with ref for scale */}
        <div ref={logoRef} className="flex items-center gap-1" style={{ transformOrigin: 'left center' }}>
          <span className="font-syne font-extrabold text-[16px]" style={{ color: '#f0ede8' }}>KINETIC</span>
          <span className="font-syne font-extrabold text-[16px]" style={{ color: '#7c3aed' }}>UI</span>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded ml-1" style={{ color: '#7c3aed', border: '1px solid rgba(124,58,237,0.3)' }}>BETA</span>
        </div>

        {/* CHANGE 1 — Desktop nav links with active indicator */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className="font-inter font-medium text-[13px] relative flex flex-col items-center"
              style={{ color: isActive(link.path) ? '#f0ede8' : '#686878' }}
              onMouseEnter={e => { if (!isActive(link.path)) (e.currentTarget as HTMLElement).style.color = '#f0ede8'; }}
              onMouseLeave={e => { if (!isActive(link.path)) (e.currentTarget as HTMLElement).style.color = '#686878'; }}
            >
              {link.label}
              {isActive(link.path) && (
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#7c3aed', marginTop: 4, position: 'absolute', bottom: -8 }} />
              )}
            </button>
          ))}
          <a
            href="#"
            className="font-inter font-medium text-[13px] transition-colors duration-200"
            style={{ color: '#686878' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f0ede8'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#686878'; }}
          >
            GitHub
          </a>
        </div>

        {/* CHANGE 2 — Pro CTA button */}
        <button
          onClick={() => navigate('/pricing')}
          className="hidden md:block font-syne font-bold text-[13px] px-[18px] py-2 rounded-lg text-white"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
          onMouseEnter={e => {
            gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 });
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(124,58,237,0.4)';
          }}
          onMouseLeave={e => {
            gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          Get Pro — $49
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col items-center justify-center gap-[5px] w-8 h-8 z-[201]"
          aria-label="Menu"
        >
          <div ref={line1Ref} className="w-5 h-[2px] rounded-full" style={{ background: '#ededed' }} />
          <div ref={line2Ref} className="w-5 h-[2px] rounded-full" style={{ background: '#ededed' }} />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8 md:hidden"
        style={{ background: '#0e0e14', display: 'none' }}
      >
        {[
          ...navLinks,
          { label: 'GitHub', path: '#' },
        ].map((link, i) => (
          <button
            key={link.label}
            ref={el => { if (el) linkRefs.current[i] = el; }}
            onClick={() => link.path === '#' ? undefined : navAndClose(link.path)}
            className="font-syne font-bold text-center"
            style={{
              fontSize: '2rem',
              color: link.label === 'GitHub' ? '#686878' : '#f0ede8',
              clipPath: 'inset(100% 0 0 0)',
            }}
          >
            {link.label}
          </button>
        ))}
        <span className="absolute bottom-8 font-mono text-[10px]" style={{ color: '#404050' }}>
          © 2025 Kinetic UI
        </span>
      </div>
    </>
  );
};

export default LandingNavbar;

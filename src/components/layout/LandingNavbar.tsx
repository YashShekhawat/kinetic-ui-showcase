import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { usePro } from '@/hooks/usePro';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';

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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<HTMLButtonElement[]>([]);
  const { isPro: proUnlocked } = usePro();
  const { user, signOut } = useAuth();

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

  const closeMenu = () => {
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
  };

  const navAndClose = (path: string) => {
    closeMenu();
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
        {/* Logo */}
        <div ref={logoRef} className="flex items-center gap-1" style={{ transformOrigin: 'left center' }}>
          <span className="font-syne font-extrabold text-[16px]" style={{ color: '#f0ede8' }}>KINETIC</span>
          <span className="font-syne font-extrabold text-[16px]" style={{ color: '#7c3aed' }}>UI</span>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded ml-1" style={{ color: '#7c3aed', border: '1px solid rgba(124,58,237,0.3)' }}>BETA</span>
        </div>

        {/* Desktop nav links */}
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

        {/* Desktop right — avatar or CTA */}
        <div className="hidden md:flex items-center gap-3">
          {proUnlocked && user ? (
            <div className="relative group">
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full font-syne font-bold text-[12px]"
                style={{
                  background: '#7c3aed',
                  color: '#fff',
                  border: '2px solid #7c3aed',
                  boxShadow: '0 0 0 3px rgba(124,58,237,0.25)',
                }}
                title={user.email ?? 'Pro user'}
                onClick={() => signOut()}
              >
                {user.email ? user.email[0].toUpperCase() : 'P'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="font-inter font-medium text-[13px] transition-colors duration-200"
                style={{ color: '#686878' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#f0ede8'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#686878'}
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="font-syne font-bold text-[13px] px-[18px] py-2 rounded-lg text-white"
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
            </div>
          )}
        </div>

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
        {/* Close button */}
        <button
          onClick={closeMenu}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center z-[201]"
          aria-label="Close menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f0ede8" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

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

        {/* Auth actions in mobile menu */}
        <div className="flex flex-col items-center gap-4 mt-4">
          {proUnlocked && user ? (
            <button
              onClick={() => { signOut(); closeMenu(); }}
              className="font-mono text-[13px] px-6 py-2 rounded-lg"
              style={{ color: '#909098', border: '1px solid #2a2a3e' }}
            >
              Sign Out
            </button>
          ) : (
            <>
              <button
                onClick={() => { closeMenu(); setAuthModalOpen(true); }}
                className="font-mono text-[13px]"
                style={{ color: '#909098' }}
              >
                Sign In
              </button>
              <button
                onClick={() => navAndClose('/pricing')}
                className="font-syne font-bold text-[14px] px-6 py-2 rounded-lg text-white"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
              >
                Get Pro — $49
              </button>
            </>
          )}
        </div>

        <span className="absolute bottom-8 font-mono text-[10px]" style={{ color: '#404050' }}>
          © 2025 Kinetic UI
        </span>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};

export default LandingNavbar;

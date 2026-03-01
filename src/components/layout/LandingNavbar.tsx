import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const LandingNavbar = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<HTMLButtonElement[]>([]);

  const toggleMenu = () => {
    const opening = !menuOpen;
    setMenuOpen(opening);

    // Hamburger morph
    if (line1Ref.current && line2Ref.current) {
      if (opening) {
        gsap.to(line1Ref.current, { rotation: 45, y: 3.5, duration: 0.3, ease: 'power2.out' });
        gsap.to(line2Ref.current, { rotation: -45, y: -3.5, duration: 0.3, ease: 'power2.out' });
      } else {
        gsap.to(line1Ref.current, { rotation: 0, y: 0, duration: 0.3, ease: 'power2.out' });
        gsap.to(line2Ref.current, { rotation: 0, y: 0, duration: 0.3, ease: 'power2.out' });
      }
    }

    // Overlay
    if (overlayRef.current) {
      if (opening) {
        gsap.set(overlayRef.current, { display: 'flex', xPercent: 100 });
        gsap.to(overlayRef.current, { xPercent: 0, duration: 0.4, ease: 'power3.out' });
        // Stagger links
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

  return (
    <>
      <nav
        className="fixed top-0 w-full h-14 flex items-center justify-between px-5 md:px-8 z-[100]"
        style={{
          background: 'rgba(6,6,8,0.8)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #1a1a2e',
        }}
      >
        <div className="flex items-center gap-1">
          <span className="font-syne font-extrabold text-[16px]" style={{ color: '#ededed' }}>KINETIC</span>
          <span className="font-syne font-extrabold text-[16px]" style={{ color: '#7c3aed' }}>UI</span>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded ml-1" style={{ color: '#7c3aed', border: '1px solid rgba(124,58,237,0.3)' }}>BETA</span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { label: 'Components', path: '/components' },
            { label: 'Blocks', path: '/blocks' },
          ].map(link => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className="font-inter font-medium text-[13px] transition-colors duration-200"
              style={{ color: '#606070' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = '#ededed'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = '#606070'; }}
            >
              {link.label}
            </button>
          ))}
          <a
            href="#"
            className="font-inter font-medium text-[13px] transition-colors duration-200"
            style={{ color: '#606070' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ededed'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#606070'; }}
          >
            GitHub
          </a>
        </div>

        {/* Desktop CTA */}
        <button
          ref={btnRef}
          onClick={() => navigate('/components')}
          className="hidden md:block font-inter font-medium text-xs px-4 py-1.5 rounded-md text-white"
          style={{ background: '#7c3aed' }}
          onMouseEnter={e => {
            gsap.to(e.currentTarget, { scale: 1.03, duration: 0.2 });
            (e.currentTarget as HTMLElement).style.background = '#8b47ff';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(124,58,237,0.4)';
          }}
          onMouseLeave={e => {
            gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
            (e.currentTarget as HTMLElement).style.background = '#7c3aed';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          Browse Components
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col items-center justify-center gap-[5px] w-8 h-8"
          aria-label="Menu"
        >
          <div ref={line1Ref} className="w-5 h-[2px] rounded-full" style={{ background: '#ededed' }} />
          <div ref={line2Ref} className="w-5 h-[2px] rounded-full" style={{ background: '#ededed' }} />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[200] flex-col items-center justify-center gap-8 md:hidden"
        style={{ background: '#060608', display: 'none', transform: 'translateX(100%)' }}
      >
        {[
          { label: 'Components', path: '/components' },
          { label: 'Blocks', path: '/blocks' },
          { label: 'GitHub', path: '#' },
        ].map((link, i) => (
          <button
            key={link.label}
            ref={el => { if (el) linkRefs.current[i] = el; }}
            onClick={() => link.path === '#' ? undefined : navAndClose(link.path)}
            className="font-syne font-bold text-center"
            style={{
              fontSize: '2rem',
              color: link.label === 'GitHub' ? '#606070' : '#ededed',
              clipPath: 'inset(100% 0 0 0)',
            }}
          >
            {link.label}
          </button>
        ))}
        <span className="absolute bottom-8 font-mono text-[10px]" style={{ color: '#303040' }}>
          © 2025 Kinetic UI
        </span>
      </div>
    </>
  );
};

export default LandingNavbar;

import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const LandingNavbar = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  return (
    <nav
      className="fixed top-0 w-full h-14 flex items-center justify-between px-8 z-[100]"
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

      <button
        ref={btnRef}
        onClick={() => navigate('/components')}
        className="font-inter font-medium text-xs px-4 py-1.5 rounded-md text-white"
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
    </nav>
  );
};

export default LandingNavbar;

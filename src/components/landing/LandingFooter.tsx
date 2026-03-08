import { useNavigate } from 'react-router-dom';

const LandingFooter = () => {
  const navigate = useNavigate();

  const linkStyle: React.CSSProperties = { color: '#404050', background: 'none', border: 'none', cursor: 'pointer' };

  return (
    <footer className="w-full" style={{ background: '#0b0b14', borderTop: '1px solid #1a1a2a' }}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-5 md:py-6 md:px-10 text-center md:text-left">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="font-syne font-bold text-[14px]" style={{ color: '#f0ede8' }}>KINETIC</span>
            <span className="font-syne font-bold text-[14px]" style={{ color: '#7c3aed' }}>UI</span>
          </div>
          <button
            className="font-mono text-[11px] transition-colors"
            style={linkStyle}
            onClick={() => navigate('/docs')}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#909098'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#404050'; }}
          >
            Docs
          </button>
          <button
            className="font-mono text-[11px] transition-colors"
            style={linkStyle}
            onClick={() => navigate('/pricing')}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#909098'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#404050'; }}
          >
            Pricing
          </button>
        </div>
        <span className="font-mono text-[11px]" style={{ color: '#686878' }}>© 2025 Kinetic UI · MIT License</span>
        <a
          href="#"
          className="font-mono text-[11px] transition-colors"
          style={{ color: '#686878' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f0ede8'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#686878'; }}
        >
          GitHub
        </a>
      </div>
    </footer>
  );
};

export default LandingFooter;

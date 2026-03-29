import { Link } from 'react-router-dom';

const Footer = () => {
  const linkClass = 'font-inter text-[13px] transition-colors duration-200 block py-0.5';
  const labelClass = 'font-mono text-[10px] tracking-[0.2em] uppercase mb-3';

  return (
    <footer className="pt-16 pb-10" style={{ background: '#08080f', borderTop: '1px solid #1a1a2e' }}>
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-1">
              <span className="font-syne font-extrabold text-xl text-kinetic-text">KINETIC</span>
              <span className="font-syne font-extrabold text-xl text-kinetic-accent-light">UI</span>
            </div>
            <p className="font-inter font-light text-[13px] mt-3 leading-relaxed" style={{ color: '#606070' }}>
              GSAP-powered components for React developers.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <div className={labelClass} style={{ color: '#353548' }}>COMPONENTS</div>
            {['Text', 'Cards', 'Buttons', 'Images', 'Scroll', 'Loaders', 'Cursor', 'Hero', 'Backgrounds'].map(l => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className={linkClass}
                style={{ color: '#505060' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#c0c0d0'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#505060'; }}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Col 3 */}
          <div>
            <div className={labelClass} style={{ color: '#353548' }}>RESOURCES</div>
            {['GitHub', 'Documentation', 'Changelog', 'License'].map(l => (
              <a
                key={l}
                href="#"
                className={linkClass}
                style={{ color: '#505060' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#c0c0d0'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#505060'; }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 flex flex-col items-center gap-3" style={{ borderTop: '1px solid #1a1a2e' }}>
          <span className="font-mono text-[11px]" style={{ color: '#404050' }}>
            © 2025 Kinetic UI. Built by Yash Shekhawat.
          </span>
          <div className="flex items-center gap-1 font-mono text-[11px]">
            {[
              { label: 'License', to: '/license' },
              { label: 'Terms', to: '/terms' },
              { label: 'Privacy', to: '/privacy' },
              { label: 'Refunds', to: '/refunds' },
            ].map((link, i) => (
              <span key={link.to} className="flex items-center gap-1">
                {i > 0 && <span style={{ color: '#404050' }}>·</span>}
                <Link
                  to={link.to}
                  className="transition-colors duration-200"
                  style={{ color: '#404050' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#909098'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#404050'; }}
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

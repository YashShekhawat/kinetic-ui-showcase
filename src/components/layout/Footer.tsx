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

        <div className="mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2" style={{ borderTop: '1px solid #1a1a2e' }}>
          <span className="font-mono text-[11px]" style={{ color: '#505060' }}>
            © 2025 Kinetic UI. MIT License.
          </span>
          <span className="font-mono text-[11px]" style={{ color: '#505060' }}>
            Built with GSAP + React ♥
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

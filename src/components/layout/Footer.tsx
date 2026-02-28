const Footer = () => {
  const linkClass = 'font-inter text-[13px] text-kinetic-text-muted hover:text-kinetic-text transition-colors duration-200 block py-0.5';
  const labelClass = 'font-mono text-[10px] text-kinetic-text-dim tracking-[0.2em] uppercase mb-3';

  return (
    <footer className="border-t border-kinetic-border bg-kinetic-bg pt-16 pb-10">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-1">
              <span className="font-syne font-extrabold text-xl text-kinetic-text">KINETIC</span>
              <span className="font-syne font-extrabold text-xl text-kinetic-accent">UI</span>
            </div>
            <p className="font-inter font-light text-[13px] text-kinetic-text-muted mt-3 leading-relaxed">
              GSAP-powered components for React developers.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <div className={labelClass}>COMPONENTS</div>
            {['Text', 'Cards', 'Images', 'Scroll', 'Cursor', 'Hero'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className={linkClass}>{l}</a>
            ))}
          </div>

          {/* Col 3 */}
          <div>
            <div className={labelClass}>RESOURCES</div>
            {['GitHub', 'Documentation', 'Changelog', 'License'].map(l => (
              <a key={l} href="#" className={linkClass}>{l}</a>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-kinetic-border flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="font-mono text-[11px] text-kinetic-text-dim">
            © 2025 Kinetic UI. MIT License.
          </span>
          <span className="font-mono text-[11px] text-kinetic-text-dim">
            Built with GSAP + React ♥
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

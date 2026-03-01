const LandingFooter = () => (
  <footer className="w-full" style={{ background: '#060608', borderTop: '1px solid #1a1a2e' }}>
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-5 md:py-6 md:px-10 text-center md:text-left">
      <div className="flex items-center gap-1">
        <span className="font-syne font-bold text-[14px]" style={{ color: '#ededed' }}>KINETIC</span>
        <span className="font-syne font-bold text-[14px]" style={{ color: '#7c3aed' }}>UI</span>
      </div>
      <span className="font-mono text-[11px]" style={{ color: '#303040' }}>© 2025 Kinetic UI · MIT License</span>
      <a
        href="#"
        className="font-mono text-[11px] transition-colors"
        style={{ color: '#505060' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ededed'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#505060'; }}
      >
        GitHub
      </a>
    </div>
  </footer>
);

export default LandingFooter;

import { Link } from 'react-router-dom';

const columns = [
  {
    label: 'PRODUCT',
    links: [
      { name: 'Components', to: '/components' },
      { name: 'Blocks', to: '/blocks' },
      { name: 'Pricing', to: '/pricing' },
      { name: 'Docs', to: '/docs' },
      { name: 'Changelog', to: '/changelog' },
    ],
  },
  {
    label: 'RESOURCES',
    links: [
      { name: 'GitHub', to: 'https://github.com', external: true },
      { name: 'License', to: '/license' },
      { name: 'Terms', to: '/terms' },
    ],
  },
  {
    label: 'LEGAL',
    links: [
      { name: 'Privacy', to: '/privacy' },
      { name: 'Refunds', to: '/refunds' },
    ],
  },
];

const legalLinks = [
  { label: 'License', to: '/license' },
  { label: 'Terms', to: '/terms' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Refunds', to: '/refunds' },
];

const Footer = () => {
  return (
    <footer style={{ background: '#08080f' }}>
      {/* Top section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-10 px-6 py-12 md:px-10 md:py-16">
        {/* Left - Brand */}
        <div>
          <div className="flex items-center gap-1">
            <span className="font-syne font-extrabold" style={{ fontSize: '1.1rem', color: '#f0ede8' }}>KINETIC</span>
            <span className="font-syne font-extrabold" style={{ fontSize: '1.1rem', color: '#7c3aed' }}>UI</span>
          </div>
          <p className="font-inter mt-2" style={{ fontSize: '0.8rem', color: '#606070' }}>
            GSAP-powered components for React.
          </p>
          <a
            href="https://x.com/kineticui"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono mt-4 inline-block transition-colors duration-200"
            style={{ fontSize: '11px', color: '#404050' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#909098'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#404050'; }}
          >
            @kineticui
          </a>
        </div>

        {/* Right - Nav columns */}
        <div className="flex flex-wrap gap-8 md:gap-16">
          {columns.map(col => (
            <div key={col.label}>
              <div
                className="font-mono uppercase mb-4"
                style={{ fontSize: '10px', letterSpacing: '0.15em', color: '#404050' }}
              >
                {col.label}
              </div>
              <div className="flex flex-col gap-2.5">
                {col.links.map(link =>
                  link.external ? (
                    <a
                      key={link.name}
                      href={link.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-inter transition-colors duration-200"
                      style={{ fontSize: '0.85rem', color: '#606070' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f0ede8'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#606070'; }}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.to}
                      className="font-inter transition-colors duration-200"
                      style={{ fontSize: '0.85rem', color: '#606070' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f0ede8'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#606070'; }}
                    >
                      {link.name}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-3 px-6 py-6 md:px-10"
        style={{ borderTop: '1px solid #1e1e2e' }}
      >
        <span className="font-mono" style={{ fontSize: '11px', color: '#404050' }}>
          © 2025 Kinetic UI. Built by Yash Shekhawat.
        </span>
        <div className="flex items-center gap-6">
          {legalLinks.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-mono transition-colors duration-200"
              style={{ fontSize: '11px', color: '#404050' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#909098'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#404050'; }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

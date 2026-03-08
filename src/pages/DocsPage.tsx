import { useState, useEffect, useRef } from 'react';
import { ClipboardCopy, CheckCheck } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';

const sidebarSections = [
  {
    label: 'GETTING STARTED',
    items: ['Introduction', 'Installation', 'How it works'],
  },
  {
    label: 'USAGE',
    items: ['Copy a component', 'Using with Next.js', 'Using with Vite', 'Using with Remix'],
  },
  {
    label: 'ANIMATIONS',
    items: ['GSAP basics', 'Lenis scroll', 'Custom timing'],
  },
  {
    label: 'FAQ',
    items: ['Common questions'],
  },
];

const toId = (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const DocsPage = () => {
  const [active, setActive] = useState('introduction');
  const [search, setSearch] = useState('');

  const handleNav = (item: string) => {
    const id = toId(item);
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#0e0e14' }}>
      <TopBar search={search} onSearchChange={setSearch} placeholder="Search docs..." items={[]} categories={[]} />

      {/* Sidebar */}
      <aside
        className="hidden lg:block fixed top-12 left-0 bottom-0"
        style={{
          width: 240,
          background: '#0d0d14',
          borderRight: '1px solid #1e1e2e',
          padding: '32px 0',
          overflowY: 'auto',
          zIndex: 40,
        }}
      >
        <div style={{ padding: '0 24px', marginBottom: 24 }}>
          <span className="font-mono font-bold text-[13px]" style={{ color: '#7c3aed', letterSpacing: '0.12em' }}>
            DOCS
          </span>
        </div>

        {sidebarSections.map((section) => (
          <div key={section.label}>
            <div
              className="font-mono text-[9px] uppercase"
              style={{ color: '#404050', letterSpacing: '0.2em', padding: '16px 24px 6px' }}
            >
              {section.label}
            </div>
            {section.items.map((item) => {
              const id = toId(item);
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNav(item)}
                  className="block w-full text-left font-inter text-[13px] transition-colors duration-150"
                  style={{
                    padding: '6px 24px',
                    color: isActive ? '#f0ede8' : '#606070',
                    borderLeft: isActive ? '2px solid #7c3aed' : '2px solid transparent',
                    background: isActive ? 'rgba(124,58,237,0.05)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = '#a0a0b8';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = '#606070';
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        ))}
      </aside>

      {/* Content */}
      <main
        className="lg:ml-[240px]"
        style={{ maxWidth: 740, padding: '48px 48px 96px' }}
      >
        <div className="pt-12">
          {/* Hero */}
          <span
            className="inline-block font-mono text-[10px] uppercase px-3 py-1 rounded mb-5"
            style={{
              color: '#a78bfa',
              border: '1px solid rgba(124,58,237,0.3)',
              letterSpacing: '0.2em',
            }}
          >
            DOCUMENTATION
          </span>

          <h1
            className="font-syne font-extrabold leading-[1.1]"
            style={{ fontSize: '2.4rem', color: '#f0ede8' }}
          >
            Get started in minutes.
          </h1>

          <p
            className="font-inter font-light"
            style={{
              color: '#909098',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              maxWidth: 540,
              marginTop: 12,
            }}
          >
            Kinetic UI is copy-paste. No package to install, no CLI, no config.
            Find a component you like, copy the code, drop it in your project.
          </p>
        </div>
      </main>

      {/* Mobile responsive override */}
      <style>{`
        @media (max-width: 1023px) {
          main.lg\\:ml-\\[240px\\] {
            margin-left: 0 !important;
            padding: 24px 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DocsPage;

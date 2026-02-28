import { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import clsx from 'clsx';

gsap.registerPlugin(ScrollTrigger);

interface SidebarProps {
  sections: { id: string; label: string; category?: string }[];
}

const Sidebar = ({ sections }: SidebarProps) => {
  const [active, setActive] = useState('');

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActive(s.id),
          onEnterBack: () => setActive(s.id),
        })
      );
    });
    return () => triggers.forEach(t => t.kill());
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(el, { duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  let lastCat = '';

  return (
    <aside
      className="hidden lg:block fixed left-0 top-14 w-[220px] h-[calc(100vh-56px)] overflow-y-auto py-6 px-4 z-50"
      style={{ background: '#08080f', borderRight: '1px solid #1a1a2e' }}
    >
      {sections.map(s => {
        const showCat = s.category && s.category !== lastCat;
        if (s.category) lastCat = s.category;
        return (
          <div key={s.id}>
            {showCat && (
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase mt-4 mb-2 first:mt-0" style={{ color: '#353548' }}>
                {s.category}
              </div>
            )}
            <button
              onClick={() => scrollTo(s.id)}
              className={clsx(
                'block w-full text-left font-inter text-[13px] py-1.5 px-3 rounded transition-all duration-200',
                active === s.id
                  ? 'text-kinetic-accent-light border-l-2 border-kinetic-accent'
                  : 'border-l-2 border-transparent'
              )}
              style={
                active === s.id
                  ? { background: 'rgba(124,58,237,0.08)' }
                  : { color: '#606070' }
              }
              onMouseEnter={e => {
                if (active !== s.id) {
                  (e.currentTarget as HTMLElement).style.background = '#0f0f1a';
                  (e.currentTarget as HTMLElement).style.color = '#c0c0d0';
                }
              }}
              onMouseLeave={e => {
                if (active !== s.id) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#606070';
                }
              }}
            >
              {s.label}
            </button>
          </div>
        );
      })}
    </aside>
  );
};

export default Sidebar;

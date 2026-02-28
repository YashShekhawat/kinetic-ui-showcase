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
      // Use lenis if available on window
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
    <aside className="hidden lg:block fixed left-0 top-14 w-[220px] h-[calc(100vh-56px)] overflow-y-auto py-6 px-4 border-r border-kinetic-border bg-kinetic-bg z-50">
      {sections.map(s => {
        const showCat = s.category && s.category !== lastCat;
        if (s.category) lastCat = s.category;
        return (
          <div key={s.id}>
            {showCat && (
              <div className="font-mono text-[10px] text-kinetic-text-dim tracking-[0.2em] uppercase mt-4 mb-2 first:mt-0">
                {s.category}
              </div>
            )}
            <button
              onClick={() => scrollTo(s.id)}
              className={clsx(
                'block w-full text-left font-inter text-[13px] py-1.5 px-3 rounded transition-all duration-200',
                active === s.id
                  ? 'text-kinetic-accent-light bg-[rgba(124,58,237,0.06)] border-l-2 border-kinetic-accent'
                  : 'text-kinetic-text-muted hover:bg-kinetic-bg-hover hover:text-kinetic-text border-l-2 border-transparent'
              )}
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

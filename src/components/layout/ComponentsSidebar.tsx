import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ComponentConfig, categoryLabels } from '@/config/components.config';

gsap.registerPlugin(ScrollTrigger);

interface ComponentsSidebarProps {
  items: ComponentConfig[];
  isBlocks?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const ComponentsSidebar = ({ items, isBlocks = false, isOpen, onClose }: ComponentsSidebarProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [activeId, setActiveId] = useState('');
  const sidebarRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Group items by category
  const grouped = items.reduce<Record<string, ComponentConfig[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Expand first category by default
  useEffect(() => {
    const cats = Object.keys(grouped);
    if (cats.length > 0 && Object.keys(expanded).length === 0) {
      setExpanded({ [cats[0]]: true });
    }
  }, []);

  // Mobile slide animation
  useEffect(() => {
    if (!sidebarRef.current) return;
    if (window.innerWidth < 1024) {
      gsap.to(sidebarRef.current, {
        x: isOpen ? 0 : -280,
        duration: 0.35,
        ease: isOpen ? 'power3.out' : 'power2.in',
      });
      if (backdropRef.current) {
        gsap.to(backdropRef.current, {
          opacity: isOpen ? 1 : 0,
          duration: 0.3,
          onStart: () => { if (isOpen && backdropRef.current) backdropRef.current.style.display = 'block'; },
          onComplete: () => { if (!isOpen && backdropRef.current) backdropRef.current.style.display = 'none'; },
        });
      }
    }
  }, [isOpen]);

  // Track active section on scroll
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    items.forEach(item => {
      const el = document.getElementById(item.id);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveId(item.id),
          onEnterBack: () => setActiveId(item.id),
        })
      );
    });
    return () => triggers.forEach(t => t.kill());
  }, [items]);

  const toggleCategory = (cat: string) => {
    setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const scrollTo = (id: string, category: string) => {
    // Close sidebar on mobile first
    if (window.innerWidth < 1024) onClose();
    
    // Try the exact component id first, then fall back to category section id
    setTimeout(() => {
      const el = document.getElementById(id) || document.getElementById(category);
      if (el) {
        const lenis = (window as any).__lenis;
        if (lenis) lenis.scrollTo(el, { duration: 1.2, offset: -60 });
        else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, window.innerWidth < 1024 ? 100 : 0);
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 z-[199] lg:hidden"
        style={{ background: 'rgba(0,0,0,0.6)', display: 'none', opacity: 0 }}
        onClick={onClose}
      />

      <aside
        ref={sidebarRef}
        className="fixed left-0 top-12 w-[280px] lg:w-[220px] h-[calc(100vh-48px)] overflow-y-auto py-5 z-[200]"
        style={{
          background: '#060608',
          borderRight: '1px solid #1a1a2e',
          scrollbarWidth: 'none',
          transform: window.innerWidth < 1024 ? 'translateX(-280px)' : 'translateX(0)',
        }}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 font-mono text-[12px] flex items-center gap-1"
          style={{ color: '#606070' }}
        >
          ✕ Close
        </button>

        {Object.entries(grouped).map(([cat, catItems]) => (
          <div key={cat} className="mb-1">
            {/* Category header */}
            <button
              onClick={() => toggleCategory(cat)}
              className="w-full flex items-center gap-2 px-4 py-2 cursor-pointer"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ededed'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = expanded[cat] ? '#a78bfa' : '#505060'; }}
              style={{ color: expanded[cat] ? '#a78bfa' : '#505060' }}
            >
              <svg
                width="6" height="6" viewBox="0 0 6 6" fill="currentColor"
                style={{
                  transform: expanded[cat] ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s ease',
                  color: expanded[cat] ? '#7c3aed' : '#303040',
                }}
              >
                <path d="M1 0L5 3L1 6Z" />
              </svg>
              <span className="font-inter font-medium text-[12px] uppercase tracking-[0.05em] flex-1 text-left">
                {categoryLabels[cat] || cat}
              </span>
              <span className="font-mono text-[9px] ml-auto" style={{ color: '#303040' }}>{catItems.length}</span>
              {isBlocks && (
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" style={{ opacity: 0.6 }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
            </button>

            {/* Children */}
            <div style={{ height: expanded[cat] ? 'auto' : 0, overflow: 'hidden', transition: 'height 0.3s ease' }}>
              {catItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id, item.category)}
                  className="block w-full text-left font-inter text-[12px] py-1.5 px-8 transition-all cursor-pointer"
                  style={{
                    color: activeId === item.id ? '#a78bfa' : '#505060',
                    borderLeft: activeId === item.id ? '2px solid #7c3aed' : '2px solid transparent',
                    paddingLeft: activeId === item.id ? '30px' : '32px',
                    background: activeId === item.id ? 'rgba(124,58,237,0.04)' : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (activeId !== item.id) {
                      (e.currentTarget as HTMLElement).style.color = '#ededed';
                      (e.currentTarget as HTMLElement).style.background = '#0a0a12';
                    }
                  }}
                  onMouseLeave={e => {
                    if (activeId !== item.id) {
                      (e.currentTarget as HTMLElement).style.color = '#505060';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }
                  }}
                >
                  <span className="flex items-center gap-2">
                    {item.name}
                    {item.isNew && !isBlocks && (
                      <span className="font-mono text-[8px] px-1.5 py-0.5 rounded" style={{ color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>NEW</span>
                    )}
                    {isBlocks && (
                      <span className="font-mono text-[8px] px-1.5 py-0.5 rounded ml-auto" style={{ color: '#7c3aed', border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.06)' }}>PRO</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </aside>
    </>
  );
};

export default ComponentsSidebar;

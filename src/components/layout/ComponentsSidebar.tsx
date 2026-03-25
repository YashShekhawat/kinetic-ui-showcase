import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ComponentConfig, categoryLabels } from '@/config/components.config';
import { PRO_CONFIG } from '@/config/proConfig';
import { useAuth } from '@/contexts/AuthContext';

gsap.registerPlugin(ScrollTrigger);

interface ComponentsSidebarProps {
  items: ComponentConfig[];
  isBlocks?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const ComponentsSidebar = ({
  items,
  isBlocks = false,
  isOpen,
  onClose,
}: ComponentsSidebarProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [activeId, setActiveId] = useState('');
  const sidebarRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const grouped = items.reduce<Record<string, ComponentConfig[]>>(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {},
  );

  useEffect(() => {
    const cats = Object.keys(grouped);
    if (cats.length > 0) {
      const newExpanded: Record<string, boolean> = {};
      cats.forEach((cat) => {
        newExpanded[cat] = true;
      });
      setExpanded(newExpanded);
    }
  }, [items]);

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
          onStart: () => {
            if (isOpen && backdropRef.current)
              backdropRef.current.style.display = 'block';
          },
          onComplete: () => {
            if (!isOpen && backdropRef.current)
              backdropRef.current.style.display = 'none';
          },
        });
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveId(item.id),
          onEnterBack: () => setActiveId(item.id),
        }),
      );
    });
    return () => triggers.forEach((t) => t.kill());
  }, [items]);

  const toggleCategory = (cat: string) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const scrollTo = (id: string, category: string) => {
    if (window.innerWidth < 1024) onClose();

    setTimeout(
      () => {
        const el =
          document.getElementById(id) || document.getElementById(category);
        if (el) {
          const lenis = (window as any).__lenis;
          if (lenis) lenis.scrollTo(el, { duration: 1.2, offset: -60 });
          else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      },
      window.innerWidth < 1024 ? 100 : 0,
    );
  };

  const handleItemClick = (item: ComponentConfig) => {
    if (isBlocks && location.pathname === '/blocks') {
      navigate(`/blocks/${item.category}`);
      if (window.innerWidth < 1024) onClose();
      return;
    }

    scrollTo(item.id, item.category);
  };

  return (
    <>
      <div
        ref={backdropRef}
        className="fixed inset-0 z-[199] lg:hidden"
        style={{ background: 'rgba(0,0,0,0.6)', display: 'none', opacity: 0 }}
        onClick={onClose}
      />

      <aside
        ref={sidebarRef}
        className="fixed left-0 top-12 w-[280px] lg:w-[220px] h-[calc(100vh-48px)] flex flex-col py-5 z-[200]"
        style={{
          background: '#0b0b14',
          borderRight: '1px solid #1f1f30',
          scrollbarWidth: 'none',
          transform:
            window.innerWidth < 1024 ? 'translateX(-280px)' : 'translateX(0)',
        }}
      >
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 font-mono text-[12px] flex items-center gap-1"
          style={{ color: '#686878' }}
        >
          ✕ Close
        </button>

        <div className="flex-1 overflow-y-auto">
          {/* Pricing link */}
          <button
            onClick={() => {
              navigate('/pricing');
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center gap-2 px-4 py-2 cursor-pointer mb-1"
            style={{ color: location.pathname === '/pricing' ? '#a78bfa' : '#686878' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#f0ede8'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = location.pathname === '/pricing' ? '#a78bfa' : '#686878'; }}
          >
            <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor" style={{ color: location.pathname === '/pricing' ? '#7c3aed' : '#404050' }}>
              <circle cx="3" cy="3" r="2.5" />
            </svg>
            <span className="font-inter font-medium text-[12px] uppercase tracking-[0.05em]">
              Pricing
            </span>
          </button>

          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat} className="mb-1">
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center gap-2 px-4 py-2 cursor-pointer"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#f0ede8';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = expanded[cat]
                    ? '#a78bfa'
                    : '#686878';
                }}
                style={{ color: expanded[cat] ? '#a78bfa' : '#686878' }}
              >
                <svg
                  width="6"
                  height="6"
                  viewBox="0 0 6 6"
                  fill="currentColor"
                  style={{
                    transform: expanded[cat] ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                    color: expanded[cat] ? '#7c3aed' : '#404050',
                  }}
                >
                  <path d="M1 0L5 3L1 6Z" />
                </svg>
                <span className="font-inter font-medium text-[12px] uppercase tracking-[0.05em] flex-1 text-left">
                  {categoryLabels[cat] || cat}
                </span>
                <span
                  className="font-mono text-[9px] ml-auto"
                  style={{ color: '#404050' }}
                >
                  {catItems.length}
                </span>
                {isBlocks && PRO_CONFIG.proModeEnabled && (
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="2"
                    style={{ opacity: 0.6 }}
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                )}
              </button>

              <div
                style={{
                  height: expanded[cat] ? 'auto' : 0,
                  overflow: 'hidden',
                  transition: 'height 0.3s ease',
                }}
              >
                {catItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="block w-full text-left font-inter text-[12px] py-1.5 px-8 transition-all cursor-pointer"
                    style={{
                      color: activeId === item.id ? '#a78bfa' : '#686878',
                      borderLeft:
                        activeId === item.id
                          ? '2px solid #7c3aed'
                          : '2px solid transparent',
                      paddingLeft: activeId === item.id ? '30px' : '32px',
                      background:
                        activeId === item.id
                          ? 'rgba(124,58,237,0.1)'
                          : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (activeId !== item.id) {
                        (e.currentTarget as HTMLElement).style.color = '#f0ede8';
                        (e.currentTarget as HTMLElement).style.background =
                          '#111119';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeId !== item.id) {
                        (e.currentTarget as HTMLElement).style.color = '#686878';
                        (e.currentTarget as HTMLElement).style.background =
                          'transparent';
                      }
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {item.name}
                      {item.isNew && !isBlocks && (
                        <span
                          className="font-mono text-[8px] px-1.5 py-0.5 rounded"
                          style={{
                            color: '#22c55e',
                            border: '1px solid rgba(34,197,94,0.2)',
                          }}
                        >
                          NEW
                        </span>
                      )}
                      {isBlocks && PRO_CONFIG.proModeEnabled && item.isPro && (
                        <span
                          className="font-mono text-[8px] px-1.5 py-0.5 rounded ml-auto"
                          style={{
                            color: '#7c3aed',
                            border: '1px solid rgba(124,58,237,0.2)',
                            background: 'rgba(124,58,237,0.06)',
                          }}
                        >
                          PRO
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sign Out at bottom */}
        {user && (
          <div
            className="px-4 py-3"
            style={{ borderTop: '1px solid #1e1e2e', marginTop: 'auto' }}
          >
            <button
              onClick={() => {
                signOut();
                onClose();
              }}
              className="font-mono text-[12px] transition-colors duration-200"
              style={{ color: '#909098' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#f0ede8'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#909098'; }}
            >
              Sign Out
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default ComponentsSidebar;

import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ComponentConfig, categoryLabels } from '@/config/components.config';

interface SmartSearchDropdownProps {
  search: string;
  onSearchChange: (val: string) => void;
  items: ComponentConfig[];
  categories: string[];
  placeholder?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}

interface SearchResult {
  type: 'category' | 'component';
  id: string;
  label: string;
  category: string;
}

const SmartSearchDropdown = ({
  search,
  onSearchChange,
  items,
  categories,
  placeholder = 'Search components...',
  inputRef: externalInputRef,
}: SmartSearchDropdownProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeResult, setActiveResult] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRefToUse = externalInputRef || internalInputRef;
  const wrapperRef = useRef<HTMLDivElement>(null);

  const q = search.toLowerCase().trim();

  // Build results
  const results: SearchResult[] = [];
  if (q.length > 1) {
    // Tier 1: category matches
    categories.forEach(cat => {
      const label = categoryLabels[cat] || cat;
      if (label.toLowerCase().includes(q) || cat.toLowerCase().includes(q)) {
        results.push({ type: 'category', id: cat, label, category: cat });
      }
    });

    // Tier 2: component name matches
    items.forEach(item => {
      if (item.name.toLowerCase().includes(q)) {
        results.push({
          type: 'component',
          id: item.id,
          label: item.name,
          category: item.category,
        });
      }
    });
  }

  const limited = results.slice(0, 6);
  const categoryResults = limited.filter(r => r.type === 'category');
  const componentResults = limited.filter(r => r.type === 'component');

  // Show/hide dropdown
  useEffect(() => {
    setShowDropdown(q.length > 1);
    setActiveResult(0);
  }, [q]);

  // Click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getScrollOffset = useCallback((target: 'section' | 'component') => {
    const topBar = document.querySelector('[data-topbar="main"]') as HTMLElement | null;
    const mobileSwitcher = document.querySelector('[data-topbar="switcher"]') as HTMLElement | null;
    const proBanner = document.querySelector('[data-pro-banner="blocks"]') as HTMLElement | null;

    const topBarHeight = topBar?.offsetHeight ?? 0;
    const switcherHeight =
      mobileSwitcher && getComputedStyle(mobileSwitcher).display !== 'none'
        ? mobileSwitcher.offsetHeight
        : 0;
    const proBannerHeight = proBanner ? proBanner.offsetHeight : 0;
    const breathingRoom = target === 'component' ? 76 : 12;

    return -(topBarHeight + switcherHeight + proBannerHeight + breathingRoom);
  }, []);

  const scrollToSection = useCallback((catId: string) => {
    const sectionId = catId.startsWith('cat-') ? catId : `cat-${catId}`;
    const el = document.getElementById(sectionId) || document.getElementById(catId);
    if (!el) return;

    const offset = getScrollOffset('section');
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(el, { duration: 1.2, offset });
    else {
      const y = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

    // Flash header
    const header = el.querySelector('[data-section-header]') || el.querySelector('h2, h3, span');
    if (header) {
      gsap.fromTo(header, { color: '#a78bfa' }, { color: '#ededed', duration: 0.8, ease: 'power2.out' });
    }
  }, [getScrollOffset]);

  const scrollToComponent = useCallback((componentId: string) => {
    const card =
      document.querySelector(`[data-component-id="${componentId}"]`) ||
      document.getElementById(componentId) ||
      document.querySelector(`[data-component="${items.find(i => i.id === componentId)?.name || ''}"]`);
    if (!card) return;

    const offset = getScrollOffset('component');
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(card as HTMLElement, { duration: 1.2, offset });
    else {
      const y = (card as HTMLElement).getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

    // Brief border highlight
    const el = card as HTMLElement;
    const origBorder = el.style.borderColor;
    gsap.fromTo(el,
      { borderColor: '#7c3aed', boxShadow: '0 0 12px rgba(124,58,237,0.3)' },
      { borderColor: origBorder || '#2a2a3e', boxShadow: 'none', duration: 1, ease: 'power2.out', delay: 0.3 }
    );
  }, [getScrollOffset, items]);

  const handleSelect = useCallback((result: SearchResult) => {
    // Clear search first so GSAP restores all sections, then run a double-pass scroll
    // to account for layout shifts while hidden sections animate back in.
    setShowDropdown(false);
    onSearchChange('');

    const scrollToResult = () => {
      if (result.type === 'category') {
        scrollToSection(result.id);
      } else {
        scrollToComponent(result.id);
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(scrollToResult, 360);
        setTimeout(scrollToResult, 920);
      });
    });
  }, [scrollToSection, scrollToComponent, onSearchChange]);

  // Keyboard nav
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showDropdown || limited.length === 0) {
      if (e.key === 'Escape') {
        onSearchChange('');
        setShowDropdown(false);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveResult(prev => (prev + 1) % limited.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveResult(prev => (prev - 1 + limited.length) % limited.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (limited[activeResult]) handleSelect(limited[activeResult]);
        break;
      case 'Escape':
        e.preventDefault();
        onSearchChange('');
        setShowDropdown(false);
        break;
    }
  }, [showDropdown, limited, activeResult, handleSelect, onSearchChange]);

  return (
    <div ref={wrapperRef} className="flex-1 min-w-0 relative" style={{ maxWidth: 280 }}>
      <input
        ref={inputRefToUse as React.RefObject<HTMLInputElement>}
        type="text"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => { if (q.length > 1) setShowDropdown(true); }}
        placeholder={placeholder}
        className="w-full py-1.5 px-3 pr-8 rounded-md font-mono text-[11px] sm:text-[12px] outline-none"
        style={{
          background: '#111119',
          border: '1px solid #222235',
          color: '#f0ede8',
        }}
        onMouseEnter={e => {
          if (document.activeElement !== e.currentTarget)
            e.currentTarget.style.borderColor = '#333345';
        }}
        onMouseLeave={e => {
          if (document.activeElement !== e.currentTarget)
            e.currentTarget.style.borderColor = '#222235';
        }}
      />

      {/* Clear button */}
      {search && (
        <button
          onClick={() => { onSearchChange(''); setShowDropdown(false); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[12px] leading-none transition-colors"
          style={{ color: '#606070' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f0ede8'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#606070'; }}
        >
          ✕
        </button>
      )}

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full mt-1 rounded-md overflow-hidden"
          style={{
            zIndex: 200,
            background: '#0d0d16',
            border: '1px solid #222235',
            borderRadius: 6,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          {limited.length === 0 ? (
            <div className="px-4 py-3">
              <span className="font-inter font-light text-[13px]" style={{ color: '#505060' }}>
                Nothing found
              </span>
            </div>
          ) : (
            <>
              {categoryResults.map((r, i) => {
                const globalIdx = limited.indexOf(r);
                return (
                  <button
                    key={`cat-${r.id}`}
                    onClick={() => handleSelect(r)}
                    onMouseEnter={() => setActiveResult(globalIdx)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                    style={{
                      background: activeResult === globalIdx ? '#1a1a2e' : '#151520',
                    }}
                  >
                    {/* Grid icon */}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="1" width="5" height="5" rx="1" fill="#7c3aed" />
                      <rect x="8" y="1" width="5" height="5" rx="1" fill="#7c3aed" opacity="0.5" />
                      <rect x="1" y="8" width="5" height="5" rx="1" fill="#7c3aed" opacity="0.5" />
                      <rect x="8" y="8" width="5" height="5" rx="1" fill="#7c3aed" opacity="0.3" />
                    </svg>
                    <span className="font-inter font-medium text-[13px] flex-1" style={{ color: '#ededed' }}>
                      {r.label}
                    </span>
                    <span className="font-mono text-[10px]" style={{ color: '#505060' }}>
                      Jump to section
                    </span>
                  </button>
                );
              })}

              {categoryResults.length > 0 && componentResults.length > 0 && (
                <div className="h-px" style={{ background: '#1a1a2a' }} />
              )}

              {componentResults.map((r) => {
                const globalIdx = limited.indexOf(r);
                return (
                  <button
                    key={`comp-${r.id}`}
                    onClick={() => handleSelect(r)}
                    onMouseEnter={() => setActiveResult(globalIdx)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                    style={{
                      background: activeResult === globalIdx ? '#1a1a2e' : 'transparent',
                    }}
                  >
                    {/* Dot */}
                    <div
                      className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                      style={{ background: '#a78bfa' }}
                    />
                    <span className="font-inter text-[13px] flex-1" style={{ color: '#ededed' }}>
                      {r.label}
                    </span>
                    <span className="font-mono text-[10px]" style={{ color: '#505060' }}>
                      {categoryLabels[r.category] || r.category}
                    </span>
                  </button>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearchDropdown;

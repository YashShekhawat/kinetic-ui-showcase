import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import TopBar from '@/components/layout/TopBar';
import ComponentsSidebar from '@/components/layout/ComponentsSidebar';
import { components, componentCategories, categoryLabels } from '@/config/components.config';
import GettingStarted from '@/components/sections/GettingStarted';
import TextSection from '@/components/sections/TextSection';
import CardsSection from '@/components/sections/CardsSection';
import ButtonsSection from '@/components/sections/ButtonsSection';
import ImagesSection from '@/components/sections/ImagesSection';
import ScrollSection from '@/components/sections/ScrollSection';
import LoadersSection from '@/components/sections/LoadersSection';
import CursorSection from '@/components/sections/CursorSection';
import BackgroundsSection from '@/components/sections/BackgroundsSection';

const categoryPills = ['all', ...componentCategories];

const ComponentsPage = () => {
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const mainRef = useRef<HTMLElement>(null);

  // GSAP search filtering
  useEffect(() => {
    if (!mainRef.current) return;
    const cards = mainRef.current.querySelectorAll<HTMLElement>('[data-component]');
    const q = search.toLowerCase().trim();

    cards.forEach(card => {
      const name = (card.getAttribute('data-component') || '').toLowerCase();
      const cat = (card.getAttribute('data-category') || '').toLowerCase();
      const match = !q || name.includes(q) || cat.includes(q);

      gsap.to(card, {
        opacity: match ? 1 : 0.15,
        scale: match ? 1 : 0.97,
        duration: 0.3,
        ease: 'power2.out',
        pointerEvents: match ? 'auto' : 'none',
      });
    });
  }, [search]);

  const scrollToCategory = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(`cat-${cat}`);
    if (el) {
      const lenis = (window as any).__lenis;
      if (lenis) lenis.scrollTo(el, { duration: 1.2, offset: -60 });
      else el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#060608' }}>
      <TopBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search components..."
        rightText={`${components.length} components`}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <ComponentsSidebar
        items={components}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content - add extra top padding on mobile for switcher bar */}
      <div className="lg:ml-[220px] pt-[88px] sm:pt-12">
        {/* Mobile category pills */}
        <div className="lg:hidden overflow-x-auto flex gap-2 px-4 py-3" style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
          {categoryPills.map(cat => (
            <button
              key={cat}
              onClick={() => scrollToCategory(cat)}
              className="flex-shrink-0 font-mono text-[10px] px-3 py-1.5 rounded-full transition-all"
              style={{
                scrollSnapAlign: 'start',
                border: activeCategory === cat ? '1px solid rgba(124,58,237,0.3)' : '1px solid #1a1a2e',
                background: activeCategory === cat ? 'rgba(124,58,237,0.1)' : 'transparent',
                color: activeCategory === cat ? '#a78bfa' : '#606070',
              }}
            >
              {categoryLabels[cat] || 'All'}
            </button>
          ))}
        </div>

        <main ref={mainRef} className="max-w-5xl mx-auto px-4 md:px-8 pb-24 pt-4 md:pt-8">
          <GettingStarted />
          <TextSection />
          <CardsSection />
          <ButtonsSection />
          <ImagesSection />
          <ScrollSection />
          <LoadersSection />
          <CursorSection />
          <BackgroundsSection />
        </main>
      </div>
    </div>
  );
};

export default ComponentsPage;

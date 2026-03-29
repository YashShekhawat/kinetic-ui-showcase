import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import TopBar from '@/components/layout/TopBar';
import ComponentsSidebar from '@/components/layout/ComponentsSidebar';
import {
  components,
  componentCategories,
  categoryLabels,
} from '@/config/components.config';
import TextSection from '@/components/sections/TextSection';
import CardsSection from '@/components/sections/CardsSection';
import ButtonsSection from '@/components/sections/ButtonsSection';
import ImagesSection from '@/components/sections/ImagesSection';
import ScrollSection from '@/components/sections/ScrollSection';
import LoadersSection from '@/components/sections/LoadersSection';
import CursorSection from '@/components/sections/CursorSection';
import BackgroundsSection from '@/components/sections/BackgroundsSection';
import Footer from '@/components/layout/Footer';
const categoryPills = ['all', ...componentCategories];

const ComponentsPage = () => {
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const mainRef = useRef<HTMLElement>(null);
  const [hasResults, setHasResults] = useState(true);

  // GSAP search filtering — cards + entire sections
  useEffect(() => {
    if (!mainRef.current) return;
    const q = search.toLowerCase().trim();

    // Get all category sections (by id matching componentCategories)
    const sections =
      mainRef.current.querySelectorAll<HTMLElement>('section[id]');
    let totalMatches = 0;

    sections.forEach((section) => {
      const cards = section.querySelectorAll<HTMLElement>('[data-component]');
      let sectionMatches = 0;

      cards.forEach((card) => {
        const name = (card.getAttribute('data-component') || '').toLowerCase();
        const match = !q || name.includes(q);

        gsap.to(card, {
          opacity: match ? 1 : 0.2,
          scale: match ? 1 : 0.97,
          duration: 0.2,
          ease: 'power2.out',
          pointerEvents: match ? 'auto' : 'none',
        });

        if (match) sectionMatches++;
      });

      // Hide entire section if no matches (only when searching)
      if (q && cards.length > 0) {
        gsap.to(section, {
          opacity: sectionMatches > 0 ? 1 : 0,
          height: sectionMatches > 0 ? 'auto' : 0,
          overflow: 'hidden',
          duration: 0.2,
          ease: 'power2.out',
        });
      } else {
        gsap.to(section, { opacity: 1, height: 'auto', duration: 0.2 });
      }

      totalMatches += sectionMatches;
    });

    setHasResults(!q || totalMatches > 0);
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
        items={components}
        categories={componentCategories}
      />

      <ComponentsSidebar
        items={components}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content - add extra top padding on mobile for switcher bar */}
      <div className="lg:ml-[220px] pt-[88px] sm:pt-12">
        {/* Mobile category pills */}
        <div
          className="lg:hidden overflow-x-auto flex gap-2 px-4 py-3"
          style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}
        >
          {categoryPills.map((cat) => (
            <button
              key={cat}
              onClick={() => scrollToCategory(cat)}
              className="flex-shrink-0 font-mono text-[10px] px-3 py-1.5 rounded-full transition-all"
              style={{
                scrollSnapAlign: 'start',
                border:
                  activeCategory === cat
                    ? '1px solid rgba(124,58,237,0.3)'
                    : '1px solid #1a1a2e',
                background:
                  activeCategory === cat
                    ? 'rgba(124,58,237,0.1)'
                    : 'transparent',
                color: activeCategory === cat ? '#a78bfa' : '#606070',
              }}
            >
              {categoryLabels[cat] || 'All'}
            </button>
          ))}
        </div>

        <main
          ref={mainRef}
          className="max-w-5xl mx-auto px-4 md:px-8 pb-24 pt-4 md:pt-8"
        >
          {!hasResults && (
            <div className="flex flex-col items-center justify-center py-32">
              <p
                className="font-inter font-light text-[14px]"
                style={{ color: '#606070' }}
              >
                No results for "{search}"
              </p>
              <p
                className="font-mono text-[11px] mt-2"
                style={{ color: '#404050' }}
              >
                Try searching: text, buttons, cards
              </p>
            </div>
          )}
          <TextSection />
          <CardsSection />
          <ButtonsSection />
          <ImagesSection />
          <ScrollSection />
          <LoadersSection />
          <CursorSection />
          <BackgroundsSection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ComponentsPage;

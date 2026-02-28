import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import Cursor from '../components/layout/Cursor';
import Hero from '../components/sections/Hero';
import GettingStarted from '../components/sections/GettingStarted';
import TextSection from '../components/sections/TextSection';
import CardsSection from '../components/sections/CardsSection';
import ImagesSection from '../components/sections/ImagesSection';
import ScrollSection from '../components/sections/ScrollSection';
import CursorSection from '../components/sections/CursorSection';
import HeroComponentsSection from '../components/sections/HeroComponentsSection';
import ButtonsSection from '../components/sections/ButtonsSection';
import LoadersSection from '../components/sections/LoadersSection';
import BackgroundsSection from '../components/sections/BackgroundsSection';

gsap.registerPlugin(ScrollTrigger);

const sidebarSections = [
  { id: 'getting-started', label: 'Introduction', category: 'Getting Started' },
  { id: 'usage-guide', label: 'Usage Guide', category: 'Getting Started' },
  { id: 'text', label: 'Text', category: 'Components' },
  { id: 'cards', label: 'Cards', category: 'Components' },
  { id: 'buttons', label: 'Buttons', category: 'Components' },
  { id: 'images', label: 'Images', category: 'Components' },
  { id: 'scroll', label: 'Scroll', category: 'Components' },
  { id: 'loaders', label: 'Loaders', category: 'Components' },
  { id: 'cursor', label: 'Cursor', category: 'Components' },
  { id: 'hero', label: 'Hero', category: 'Components' },
  { id: 'backgrounds', label: 'Backgrounds', category: 'Components' },
];

const categories = ['All', 'Text', 'Cards', 'Buttons', 'Images', 'Scroll', 'Loaders', 'Cursor', 'Hero', 'Backgrounds'];

const Index = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const searchRef = useRef<HTMLInputElement>(null);

  // Filter logic
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('[data-component]');
    cards.forEach(card => {
      const name = card.getAttribute('data-component')?.toLowerCase() || '';
      const cat = card.getAttribute('data-category')?.toLowerCase() || '';
      const matchesSearch = !search || name.includes(search.toLowerCase());
      const matchesCat = activeCategory === 'All' || cat === activeCategory.toLowerCase();
      const show = matchesSearch && matchesCat;
      gsap.to(card, { opacity: show ? 1 : 0.15, scale: show ? 1 : 0.98, duration: 0.3 });
    });
  }, [search, activeCategory]);

  // Search focus animation
  const onFocus = () => {
    if (searchRef.current) {
      gsap.to(searchRef.current, { scale: 1.01, duration: 0.2 });
    }
  };
  const onBlur = () => {
    if (searchRef.current) {
      gsap.to(searchRef.current, { scale: 1, duration: 0.2 });
    }
  };

  // Stats count up
  useEffect(() => {
    ScrollTrigger.create({
      trigger: '#stats-banner',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        document.querySelectorAll<HTMLElement>('.stat-num').forEach(el => {
          const target = parseInt(el.getAttribute('data-val') || '0');
          gsap.to(el, {
            textContent: target,
            duration: 1.5,
            snap: { textContent: 1 },
            ease: 'power2.out',
          });
        });
      },
    });
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#060608' }}>
      <Cursor />
      <Navbar />
      
      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-[998]" style={{ opacity: 0.025 }}>
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <Sidebar sections={sidebarSections} />

      <div className="lg:ml-[220px]">
        <Hero />

        {/* Stats banner */}
        <div id="stats-banner" className="py-5" style={{ background: '#0a0a12', borderTop: '1px solid #1a1a2e', borderBottom: '1px solid #1a1a2e' }}>
          <div className="max-w-5xl mx-auto px-8 flex items-center justify-evenly">
            {[
              { val: 42, label: 'Components' },
              { val: 9, label: 'Categories' },
              { val: 100, label: '% GSAP' },
              { val: 0, label: 'MIT License', isText: true },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                {i > 0 && <div className="absolute -left-6 h-6 w-px hidden md:block" style={{ background: '#1a1a2e' }} />}
                {s.isText ? (
                  <span className="font-syne font-bold text-lg text-kinetic-text">MIT</span>
                ) : (
                  <span className="font-syne font-bold text-lg text-kinetic-text">
                    <span className="stat-num" data-val={s.val}>0</span>
                    {s.label === '% GSAP' ? '%' : ''}
                  </span>
                )}
                <span className="font-mono text-[10px] mt-1" style={{ color: '#606070' }}>
                  {s.isText ? 'License' : s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="max-w-5xl mx-auto px-8 pt-12 pb-4">
          <div className="flex justify-center">
            <div className="relative w-full max-w-[480px]">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-kinetic-text-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search components..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                className="w-full py-3 pl-11 pr-4 rounded-lg font-mono text-[13px] text-kinetic-text outline-none transition-all"
                style={{
                  background: '#0d0d14',
                  border: '1px solid #1f1f2e',
                  color: '#ededed',
                }}
                onFocusCapture={e => {
                  (e.target as HTMLElement).style.borderColor = '#7c3aed';
                  (e.target as HTMLElement).style.boxShadow = '0 0 0 3px rgba(124,58,237,0.12)';
                }}
                onBlurCapture={e => {
                  (e.target as HTMLElement).style.borderColor = '#1f1f2e';
                  (e.target as HTMLElement).style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-mono text-[11px] px-4 py-1.5 rounded-full transition-all cursor-pointer`}
                style={{
                  border: activeCategory === cat
                    ? '1px solid rgba(124,58,237,0.25)'
                    : '1px solid #1a1a2e',
                  background: activeCategory === cat
                    ? 'rgba(124,58,237,0.1)'
                    : '#0d0d14',
                  color: activeCategory === cat
                    ? '#c4b5fd'
                    : '#606070',
                }}
                onMouseEnter={e => {
                  if (activeCategory !== cat) {
                    (e.currentTarget as HTMLElement).style.background = '#13131e';
                    (e.currentTarget as HTMLElement).style.borderColor = '#252538';
                    (e.currentTarget as HTMLElement).style.color = '#c0c0d0';
                  }
                }}
                onMouseLeave={e => {
                  if (activeCategory !== cat) {
                    (e.currentTarget as HTMLElement).style.background = '#0d0d14';
                    (e.currentTarget as HTMLElement).style.borderColor = '#1a1a2e';
                    (e.currentTarget as HTMLElement).style.color = '#606070';
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <main className="max-w-5xl mx-auto px-8 pb-24">
          <GettingStarted />
          <TextSection />
          <CardsSection />
          <ButtonsSection />
          <ImagesSection />
          <ScrollSection />
          <LoadersSection />
          <CursorSection />
          <HeroComponentsSection />
          <BackgroundsSection />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Index;

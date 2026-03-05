import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import TopBar from '@/components/layout/TopBar';
import ComponentsSidebar from '@/components/layout/ComponentsSidebar';
import ComponentCard from '@/components/ComponentCard';
import { PRO_CONFIG } from '@/config/proConfig';
import { blocks, blockCategories, categoryLabels } from '@/config/components.config';
import { useIsMobile } from '@/hooks/use-mobile';

// Import block components
import CinematicHero from '@/components/ui-showcase/CinematicHero';
import BoldHero from '@/components/ui-showcase/BoldHero';
import MinimalHero from '@/components/ui-showcase/MinimalHero';
import BentoGridSection from '@/components/ui-showcase/BentoGridSection';
import FeatureListReveal from '@/components/ui-showcase/FeatureListReveal';
import TestimonialTicker from '@/components/ui-showcase/TestimonialTicker';
import PricingCards from '@/components/ui-showcase/PricingCards';
import ProcessStepsAccordion from '@/components/ui-showcase/ProcessStepsAccordion';
import MarqueeStatementSection from '@/components/ui-showcase/MarqueeStatementSection';
import CinematicTextImageReveal from '@/components/ui-showcase/CinematicTextImageReveal';
import DiagonalFeatureSplit from '@/components/ui-showcase/DiagonalFeatureSplit';
import KineticHero from '@/components/ui-showcase/KineticHero';

// Import raw source code
import kineticHeroCode from '@/components/ui-showcase/KineticHero.tsx?raw';
import cinematicHeroCode from '@/components/ui-showcase/CinematicHero.tsx?raw';
import boldHeroCode from '@/components/ui-showcase/BoldHero.tsx?raw';
import minimalHeroCode from '@/components/ui-showcase/MinimalHero.tsx?raw';
import bentoGridCode from '@/components/ui-showcase/BentoGridSection.tsx?raw';
import featureListCode from '@/components/ui-showcase/FeatureListReveal.tsx?raw';
import testimonialTickerCode from '@/components/ui-showcase/TestimonialTicker.tsx?raw';
import pricingCardsCode from '@/components/ui-showcase/PricingCards.tsx?raw';
import stepsAccordionCode from '@/components/ui-showcase/ProcessStepsAccordion.tsx?raw';
import marqueeStatementCode from '@/components/ui-showcase/MarqueeStatementSection.tsx?raw';
import cinematicSplitCode from '@/components/ui-showcase/CinematicTextImageReveal.tsx?raw';

const proPlaceholder = '// 🔒 Pro Component\n// Purchase Pro access to view the source code.';

const getCode = (source: string, isPro: boolean) => {
  if (PRO_CONFIG.proModeEnabled && isPro) return proPlaceholder;
  return source;
};

const blockComponentMap: Record<string, { component: React.ReactNode; code: string }> = {
  'kinetic-hero': { component: <KineticHero />, code: getCode(kineticHeroCode, true) },
  'cinematic-hero': { component: <CinematicHero />, code: getCode(cinematicHeroCode, true) },
  'bold-hero': { component: <BoldHero />, code: getCode(boldHeroCode, true) },
  'minimal-hero': { component: <MinimalHero />, code: getCode(minimalHeroCode, false) },
  'bento-grid': { component: <BentoGridSection />, code: getCode(bentoGridCode, true) },
  'feature-list': { component: <FeatureListReveal />, code: getCode(featureListCode, false) },
  'testimonial-ticker': { component: <TestimonialTicker />, code: getCode(testimonialTickerCode, true) },
  'pricing-cards': { component: <PricingCards />, code: getCode(pricingCardsCode, true) },
  'steps-accordion': { component: <ProcessStepsAccordion />, code: getCode(stepsAccordionCode, false) },
  'marquee-statement': { component: <MarqueeStatementSection />, code: getCode(marqueeStatementCode, true) },
  'cinematic-split': { component: <CinematicTextImageReveal />, code: getCode(cinematicSplitCode, true) },
};

const BlocksPage = () => {
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const mainRef = useRef<HTMLElement>(null);
  const [hasResults, setHasResults] = useState(true);
  const proEnabled = PRO_CONFIG.proModeEnabled;
  const proBlocks = blocks.filter(b => proEnabled && b.isPro);
  const freeBlocks = blocks.filter(b => !proEnabled || !b.isPro);

  // GSAP search filtering — cards + entire sections
  useEffect(() => {
    if (!mainRef.current) return;
    const q = search.toLowerCase().trim();

    const sections = mainRef.current.querySelectorAll<HTMLElement>('section[id]');
    let totalMatches = 0;

    sections.forEach(section => {
      const cards = section.querySelectorAll<HTMLElement>('[data-component]');
      let sectionMatches = 0;

      cards.forEach(card => {
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

  const grouped = blocks.reduce<Record<string, typeof blocks>>((acc, b) => {
    if (!acc[b.category]) acc[b.category] = [];
    acc[b.category].push(b);
    return acc;
  }, {});

  return (
    <div className="min-h-screen" style={{ background: '#060608' }}>
      <TopBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search blocks..."
        rightText={proEnabled ? <><span>{blocks.length} blocks · </span><span style={{ color: '#7c3aed' }}>PRO</span></> as any : `${blocks.length} blocks`}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        items={blocks}
        categories={blockCategories}
      />

      <ComponentsSidebar
        items={blocks}
        isBlocks
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Add extra top padding on mobile for switcher bar */}
      <div className="lg:ml-[220px] pt-[88px] sm:pt-12">
        {proEnabled && (
        <div
          className="sticky z-50"
          data-pro-banner="blocks"
          style={{
            top: isMobile ? 80 : 48,
            background: 'rgba(124,58,237,0.06)',
            borderBottom: '1px solid rgba(124,58,237,0.15)',
            padding: '10px 16px',
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0 max-w-[1000px] mx-auto text-center md:text-left">
            <div className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="font-inter font-light text-[12px]" style={{ color: '#a78bfa' }}>
                All blocks are Pro components. Previews are free.
              </span>
            </div>
            <button
              className="font-inter font-medium text-[12px] px-4 py-1.5 rounded text-white w-full md:w-auto"
              style={{ background: '#7c3aed' }}
              onClick={() => console.log('Pro payment coming soon')}
              onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.03, duration: 0.2 })}
              onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
            >
              Unlock All for {PRO_CONFIG.proPrice} →
            </button>
          </div>
        </div>
        )}

        <main ref={mainRef} className="max-w-[1000px] mx-auto px-4 md:px-8 pb-24 pt-8">
          {!hasResults && (
            <div className="flex flex-col items-center justify-center py-32">
              <p className="font-inter font-light text-[14px]" style={{ color: '#606070' }}>
                No results for "{search}"
              </p>
              <p className="font-mono text-[11px] mt-2" style={{ color: '#404050' }}>
                Try searching: hero, pricing, features
              </p>
            </div>
          )}
          {Object.entries(grouped).map(([cat, catBlocks]) => (
            <section key={cat} id={cat} className="mb-16">
              {/* Category header */}
              <div className="relative z-40 flex items-center gap-3 py-3 mb-6"
                style={{
                  background: 'rgba(6,6,8,0.95)',
                  backdropFilter: 'blur(8px)',
                  borderBottom: '1px solid #1a1a2e'
                }}>
                <span className="font-syne font-bold text-lg" style={{ color: '#ededed' }}>{categoryLabels[cat] || cat}</span>
                <span className="font-mono text-[10px]" style={{ color: '#404050' }}>{catBlocks.length}</span>
                <div className="flex-1 h-px" style={{ background: '#1a1a2e' }} />
              </div>

              <div className="flex flex-col gap-6">
                {catBlocks.map(block => {
                  const mapped = blockComponentMap[block.id];
                  if (!mapped) return null;
                  return (
                    <div key={block.id} id={block.id}>
                      <ComponentCard
                        name={block.name}
                        code={mapped.code}
                        category={block.category}
                        fullBleed
                        isBlock
                        isMobileBlock={isMobile}
                        blockCategory={categoryLabels[block.category] || block.category}
                      >
                        {mapped.component}
                      </ComponentCard>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default BlocksPage;
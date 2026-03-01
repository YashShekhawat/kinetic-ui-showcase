import { useState } from 'react';
import gsap from 'gsap';
import TopBar from '@/components/layout/TopBar';
import ComponentsSidebar from '@/components/layout/ComponentsSidebar';
import ComponentCard from '@/components/ComponentCard';
import ProGate from '@/components/ProGate';
import { blocks, categoryLabels } from '@/config/components.config';
import { useProAccess } from '@/hooks/useProAccess';
import { useIsMobile } from '@/hooks/use-mobile';

// Import block components
import CinematicHero from '@/components/ui-showcase/CinematicHero';
import SplitHero from '@/components/ui-showcase/SplitHero';
import MinimalHero from '@/components/ui-showcase/MinimalHero';
import BentoGridSection from '@/components/ui-showcase/BentoGridSection';
import FeatureListReveal from '@/components/ui-showcase/FeatureListReveal';
import TestimonialTicker from '@/components/ui-showcase/TestimonialTicker';
import PricingCards from '@/components/ui-showcase/PricingCards';
import ProcessStepsAccordion from '@/components/ui-showcase/ProcessStepsAccordion';
import MarqueeStatementSection from '@/components/ui-showcase/MarqueeStatementSection';
import CinematicTextImageReveal from '@/components/ui-showcase/CinematicTextImageReveal';
import DiagonalFeatureSplit from '@/components/ui-showcase/DiagonalFeatureSplit';

const blockComponentMap: Record<string, { component: React.ReactNode; code: string }> = {
  'cinematic-hero': { component: <CinematicHero />, code: '// Cinematic Hero component code\n// See /components page for full source' },
  'split-hero': { component: <SplitHero />, code: '// Split Hero component code' },
  'minimal-hero': { component: <MinimalHero />, code: '// Minimal Hero component code' },
  'bento-grid': { component: <BentoGridSection />, code: '// Bento Grid Section code' },
  'feature-list': { component: <FeatureListReveal />, code: '// Feature List Reveal code' },
  'testimonial-ticker': { component: <TestimonialTicker />, code: '// Testimonial Ticker code' },
  'pricing-cards': { component: <PricingCards />, code: '// Pricing Cards code' },
  'steps-accordion': { component: <ProcessStepsAccordion />, code: '// Process Steps Accordion code' },
  'marquee-statement': { component: <MarqueeStatementSection />, code: '// Marquee Statement Section code' },
  'cinematic-split': { component: <CinematicTextImageReveal />, code: '// Cinematic Text + Image Reveal code' },
};

const BlocksPage = () => {
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isPro } = useProAccess();
  const isMobile = useIsMobile();

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
        rightText={<><span>{blocks.length} blocks · </span><span style={{ color: '#7c3aed' }}>PRO</span></> as any}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <ComponentsSidebar
        items={blocks}
        isBlocks
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Add extra top padding on mobile for switcher bar */}
      <div className="lg:ml-[220px] pt-[88px] sm:pt-12">
        {/* Pro banner */}
        <div className="sticky top-12 z-50" style={{ background: 'rgba(124,58,237,0.06)', borderBottom: '1px solid rgba(124,58,237,0.15)', padding: '10px 16px' }}>
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
              Unlock All for $19 →
            </button>
          </div>
        </div>

        <main className="max-w-[1000px] mx-auto px-4 md:px-8 pb-24 pt-8">
          {Object.entries(grouped).map(([cat, catBlocks]) => (
            <section key={cat} id={cat} className="mb-16">
              {/* Category header */}
              <div className="sticky top-[100px] z-40 flex items-center gap-3 py-3 mb-6"
                style={{ background: 'rgba(6,6,8,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #1a1a2e' }}>
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

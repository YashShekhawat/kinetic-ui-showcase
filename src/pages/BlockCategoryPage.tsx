import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import TopBar from '@/components/layout/TopBar';
import ComponentsSidebar from '@/components/layout/ComponentsSidebar';
import horizonalScrollSectionCode from '@/components/ui-showcase/HorizontalScrollSection.tsx?raw';
import HorizontalScrollSection from '@/components/ui-showcase/HorizontalScrollSection';
import ComponentCard from '@/components/ComponentCard';
import LazyBlockPreview from '@/components/LazyBlockPreview';
import { PRO_CONFIG } from '@/config/proConfig';
import {
  blocks,
  blockCategories,
  categoryLabels,
} from '@/config/components.config';
import { useIsMobile } from '@/hooks/use-mobile';

// ── Lazy imports ───────────────────────────────────────────────────────────
const CinematicHero = lazy(
  () => import('@/components/ui-showcase/CinematicHero'),
);
const BoldHero = lazy(() => import('@/components/ui-showcase/BoldHero'));
const MinimalHero = lazy(() => import('@/components/ui-showcase/MinimalHero'));
const KineticHero = lazy(() => import('@/components/ui-showcase/KineticHero'));
const BentoGridSection = lazy(
  () => import('@/components/ui-showcase/BentoGridSection'),
);
const FeatureListReveal = lazy(
  () => import('@/components/ui-showcase/FeatureListReveal'),
);
const StatsShowcase = lazy(
  () => import('@/components/ui-showcase/StatsShowcase'),
);
const TestimonialTicker = lazy(
  () => import('@/components/ui-showcase/TestimonialTicker'),
);
const TestimonialWall = lazy(
  () => import('@/components/ui-showcase/TestimonialWall'),
);
const PricingCards = lazy(
  () => import('@/components/ui-showcase/PricingCards'),
);
const ProcessStepsAccordion = lazy(
  () => import('@/components/ui-showcase/ProcessStepsAccordion'),
);
const MarqueeStatementSection = lazy(
  () => import('@/components/ui-showcase/MarqueeStatementSection'),
);
const CinematicTextImageReveal = lazy(
  () => import('@/components/ui-showcase/CinematicTextImageReveal'),
);
const DiagonalFeatureSplit = lazy(
  () => import('@/components/ui-showcase/DiagonalFeatureSplit'),
);
const PortfolioShowcase = lazy(
  () => import('@/components/ui-showcase/PortfolioShowcase'),
);
const ImageReveal = lazy(() => import('@/components/ui-showcase/ImageReveal'));
const TextImageScroll = lazy(() => import('@/components/ui-showcase/TextImageScroll'));

// ── Raw source imports ─────────────────────────────────────────────────────
import kineticHeroCode from '@/components/ui-showcase/KineticHero.tsx?raw';
import cinematicHeroCode from '@/components/ui-showcase/CinematicHero.tsx?raw';
import boldHeroCode from '@/components/ui-showcase/BoldHero.tsx?raw';
import minimalHeroCode from '@/components/ui-showcase/MinimalHero.tsx?raw';
import bentoGridCode from '@/components/ui-showcase/BentoGridSection.tsx?raw';
import featureListCode from '@/components/ui-showcase/FeatureListReveal.tsx?raw';
import statsShowcaseCode from '@/components/ui-showcase/StatsShowcase.tsx?raw';
import testimonialTickerCode from '@/components/ui-showcase/TestimonialTicker.tsx?raw';
import testimonialWallCode from '@/components/ui-showcase/TestimonialWall.tsx?raw';
import pricingCardsCode from '@/components/ui-showcase/PricingCards.tsx?raw';
import stepsAccordionCode from '@/components/ui-showcase/ProcessStepsAccordion.tsx?raw';
import marqueeStatementCode from '@/components/ui-showcase/MarqueeStatementSection.tsx?raw';
import cinematicSplitCode from '@/components/ui-showcase/CinematicTextImageReveal.tsx?raw';
import diagonalFeatureSplitCode from '@/components/ui-showcase/DiagonalFeatureSplit.tsx?raw';
import portfolioShowcaseCode from '@/components/ui-showcase/PortfolioShowcase.tsx?raw';
import imageRevealCode from '@/components/ui-showcase/ImageReveal.tsx?raw';
import ParallaxScrollerCode from '@/components/ui-showcase/ParallaxScroller.tsx?raw';
import textImageScrollCode from '@/components/ui-showcase/TextImageScroll.tsx?raw';
import ParallaxScroller from '@/components/ui-showcase/ParallaxScroller';

const proPlaceholder =
  '// 🔒 Pro Component\n// Purchase Pro access to view the source code.';
const getCode = (source: string, isPro: boolean) =>
  PRO_CONFIG.proModeEnabled && isPro ? proPlaceholder : source;

const blockComponentMap: Record<
  string,
  { component: React.ReactNode; code: string }
> = {
  'kinetic-hero': {
    component: <KineticHero />,
    code: getCode(kineticHeroCode, true),
  },
  'cinematic-hero': {
    component: <CinematicHero />,
    code: getCode(cinematicHeroCode, true),
  },
  'bold-hero': { component: <BoldHero />, code: getCode(boldHeroCode, true) },
  'minimal-hero': {
    component: <MinimalHero />,
    code: getCode(minimalHeroCode, false),
  },
  'bento-grid': {
    component: <BentoGridSection />,
    code: getCode(bentoGridCode, true),
  },
  'feature-list': {
    component: <FeatureListReveal />,
    code: getCode(featureListCode, false),
  },
  'stats-showcase': {
    component: <StatsShowcase />,
    code: getCode(statsShowcaseCode, true),
  },
  'testimonial-ticker': {
    component: <TestimonialTicker />,
    code: getCode(testimonialTickerCode, true),
  },
  'testimonial-wall': {
    component: <TestimonialWall />,
    code: getCode(testimonialWallCode, true),
  },
  'pricing-cards': {
    component: <PricingCards />,
    code: getCode(pricingCardsCode, true),
  },
  'steps-accordion': {
    component: <ProcessStepsAccordion />,
    code: getCode(stepsAccordionCode, false),
  },
  'marquee-statement': {
    component: <MarqueeStatementSection />,
    code: getCode(marqueeStatementCode, true),
  },
  'cinematic-split': {
    component: <CinematicTextImageReveal />,
    code: getCode(cinematicSplitCode, true),
  },
  'diagonal-feature': {
    component: <DiagonalFeatureSplit />,
    code: getCode(diagonalFeatureSplitCode, true),
  },
  'portfolio-showcase': {
    component: <PortfolioShowcase />,
    code: getCode(portfolioShowcaseCode, true),
  },
  'image-reveal': {
    component: <ImageReveal />,
    code: getCode(imageRevealCode, true),
  },
  'parallax-scroller': {
    component: <ParallaxScroller />,
    code: getCode(ParallaxScrollerCode, true),
  },
  'horizontal-scroll-section': {
    component: <HorizontalScrollSection />,
    code: getCode(horizonalScrollSectionCode, true),
  },
  'text-image-scroll': { component: <TextImageScroll />, code: getCode(textImageScrollCode, true) },
};

const SuspenseSkeleton = () => (
  <div
    style={{
      height: 480,
      width: '100%',
      borderRadius: 8,
      background: '#0d0d12',
      border: '1px solid #1a1a2e',
    }}
  />
);

const BlockCategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth >= 1024,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const didAutoScroll = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const catBlocks = blocks.filter(
    (b) =>
      b.category === category &&
      (!search || b.name.toLowerCase().includes(search.toLowerCase())),
  );

  const proEnabled = PRO_CONFIG.proModeEnabled;
  const label = categoryLabels[category ?? ''] ?? category;

  // Redirect if invalid category
  useEffect(() => {
    if (category && !blockCategories.includes(category)) {
      navigate('/blocks');
    }
  }, [category, navigate]);

  // Header entrance — only y, no x to prevent slide animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current?.querySelectorAll('[data-anim]') ?? [],
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: 'power3.out' },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [category]);

  // Sidebar nav items — all blocks in this category
  const navItems = blocks.filter((b) => b.category === category);

  return (
    <div
      ref={containerRef}
      className="min-h-screen"
      style={{ background: '#060608' }}
    >
      <TopBar
        search={search}
        onSearchChange={setSearch}
        placeholder={`Search ${label} blocks...`}
        rightText={
          proEnabled
            ? ((
                <>
                  <span>{catBlocks.length} blocks · </span>
                  <span style={{ color: '#7c3aed' }}>PRO</span>
                </>
              ) as any)
            : `${catBlocks.length} blocks`
        }
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        items={navItems}
        categories={blockCategories}
      />

      {/* Sidebar — restored */}
      <ComponentsSidebar
        items={navItems}
        isBlocks
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-[220px] pt-[88px] sm:pt-12">
        {/* Pro banner */}
        {proEnabled && (
          <div
            className="sticky z-50"
            style={{
              top: isMobile ? 80 : 48,
              background: 'rgba(124,58,237,0.06)',
              borderBottom: '1px solid rgba(124,58,237,0.15)',
              padding: '10px 16px',
            }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 max-w-[1000px] mx-auto text-center md:text-left">
              <div className="flex items-center gap-2">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span
                  className="font-inter font-light text-[12px]"
                  style={{ color: '#a78bfa' }}
                >
                  All blocks are Pro components. Previews are free.
                </span>
              </div>
              <button
                className="font-inter font-medium text-[12px] px-4 py-1.5 rounded text-white w-full md:w-auto"
                style={{ background: '#7c3aed' }}
                onMouseEnter={(e) =>
                  gsap.to(e.currentTarget, { scale: 1.03, duration: 0.2 })
                }
                onMouseLeave={(e) =>
                  gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
                }
              >
                Unlock All for {PRO_CONFIG.proPrice} →
              </button>
            </div>
          </div>
        )}

        <main className="max-w-[1000px] mx-auto px-4 md:px-8 pb-24 pt-8">
          {/* Back + header */}
          <div ref={headerRef} style={{ marginBottom: 28 }}>
            <button
              data-anim
              onClick={() => navigate('/blocks')}
              className="flex items-center gap-2 font-mono"
              style={{
                fontSize: '11px',
                color: '#505060',
                letterSpacing: '0.08em',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                marginBottom: 18,
              }}
              onMouseEnter={(e) =>
                gsap.to(e.currentTarget, {
                  x: -3,
                  color: '#a78bfa',
                  duration: 0.2,
                })
              }
              onMouseLeave={(e) =>
                gsap.to(e.currentTarget, {
                  x: 0,
                  color: '#505060',
                  duration: 0.2,
                })
              }
            >
              ← All Categories
            </button>

            <div className="flex items-end justify-between flex-wrap gap-3">
              <div>
                <span
                  data-anim
                  className="font-mono inline-block"
                  style={{
                    fontSize: '10px',
                    color: '#a78bfa',
                    letterSpacing: '0.2em',
                    border: '1px solid rgba(124,58,237,0.2)',
                    background: 'rgba(124,58,237,0.06)',
                    padding: '3px 10px',
                    borderRadius: 4,
                    marginBottom: 10,
                  }}
                >
                  {(category ?? '').toUpperCase().replace('-', ' ')}
                </span>
                <h1
                  data-anim
                  className="font-syne font-extrabold"
                  style={{
                    fontSize: isMobile ? '1.6rem' : '2.2rem',
                    color: '#f0ede8',
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  {label} Blocks
                </h1>
              </div>
              <span
                data-anim
                className="font-mono"
                style={{
                  fontSize: '9px',
                  color: '#404050',
                  letterSpacing: '0.1em',
                }}
              >
                {blocks.filter((b) => b.category === category).length}{' '}
                {blocks.filter((b) => b.category === category).length === 1
                  ? 'BLOCK'
                  : 'BLOCKS'}
              </span>
            </div>

            {/* Category switcher pills */}
            <div
              data-anim
              className="flex flex-wrap gap-2"
              style={{
                marginTop: 18,
                paddingTop: 18,
                borderTop: '1px solid #1a1a2e',
              }}
            >
              {blockCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => navigate(`/blocks/${cat}`)}
                  className="font-mono"
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.1em',
                    padding: '4px 10px',
                    borderRadius: 4,
                    border:
                      cat === category
                        ? '1px solid rgba(124,58,237,0.4)'
                        : '1px solid #1a1a2e',
                    background:
                      cat === category
                        ? 'rgba(124,58,237,0.08)'
                        : 'transparent',
                    color: cat === category ? '#a78bfa' : '#404050',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Empty state */}
          {catBlocks.length === 0 && (
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
                Try a different search term
              </p>
            </div>
          )}

          {/* Block list — lazy mounted */}
          <div className="flex flex-col gap-8">
            {catBlocks.map((block) => {
              const mapped = blockComponentMap[block.id];
              if (!mapped) return null;
              return (
                <div key={block.id} id={block.id}>
                  <LazyBlockPreview>
                    <Suspense fallback={<SuspenseSkeleton />}>
                      <ComponentCard
                        name={block.name}
                        code={mapped.code}
                        category={block.category}
                        fullBleed
                        isBlock
                        isMobileBlock={isMobile}
                        blockCategory={
                          categoryLabels[block.category] || block.category
                        }
                      >
                        {mapped.component}
                      </ComponentCard>
                    </Suspense>
                  </LazyBlockPreview>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BlockCategoryPage;

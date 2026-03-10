import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import TopBar from '@/components/layout/TopBar';
import ComponentsSidebar from '@/components/layout/ComponentsSidebar';
import horizonalScrollSectionCode from '@/components/ui-showcase/blocks/content/HorizontalScrollSection.tsx?raw';
import HorizontalScrollSection from '@/components/ui-showcase/blocks/content/HorizontalScrollSection';
import ComponentCard from '@/components/ComponentCard';
import LazyBlockPreview from '@/components/LazyBlockPreview';
import { PRO_CONFIG } from '@/config/proConfig';
import { usePro } from '@/hooks/usePro';
import {
  blocks,
  blockCategories,
  categoryLabels,
} from '@/config/components.config';
import { useIsMobile } from '@/hooks/use-mobile';

// ── Lazy imports ───────────────────────────────────────────────────────────
const CinematicHero = lazy(() => import('@/components/ui-showcase/blocks/hero/CinematicHero'));
const BoldHero = lazy(() => import('@/components/ui-showcase/blocks/hero/BoldHero'));
const MinimalHero = lazy(() => import('@/components/ui-showcase/blocks/hero/MinimalHero'));
const KineticHero = lazy(() => import('@/components/ui-showcase/blocks/hero/KineticHero'));
const BentoGridSection = lazy(() => import('@/components/ui-showcase/blocks/features/BentoGridSection'));
const FeatureListReveal = lazy(() => import('@/components/ui-showcase/blocks/features/FeatureListReveal'));
const StatsShowcase = lazy(() => import('@/components/ui-showcase/blocks/features/StatsShowcase'));
const TestimonialTicker = lazy(() => import('@/components/ui-showcase/blocks/social-proof/TestimonialTicker'));
const TestimonialWall = lazy(() => import('@/components/ui-showcase/blocks/social-proof/TestimonialWall'));
const PricingCards = lazy(() => import('@/components/ui-showcase/blocks/pricing/PricingCards'));
const ProcessStepsAccordion = lazy(() => import('@/components/ui-showcase/blocks/process/ProcessStepsAccordion'));
const MarqueeStatementSection = lazy(() => import('@/components/ui-showcase/blocks/content/MarqueeStatementSection'));
const CinematicTextImageReveal = lazy(() => import('@/components/ui-showcase/blocks/content/CinematicTextImageReveal'));
const DiagonalFeatureSplit = lazy(() => import('@/components/ui-showcase/blocks/features/DiagonalFeatureSplit'));
const PortfolioShowcase = lazy(() => import('@/components/ui-showcase/blocks/content/PortfolioShowcase'));
const ImageReveal = lazy(() => import('@/components/ui-showcase/blocks/content/ImageReveal'));
const TextImageScroll = lazy(() => import('@/components/ui-showcase/blocks/process/TextImageScroll'));
const GlowPricingBlock = lazy(() => import('@/components/ui-showcase/blocks/pricing/GlowPricingBlock'));
const TypographyHero = lazy(() => import('@/components/ui-showcase/blocks/hero/TypographyHero'));

// ── Raw source imports ─────────────────────────────────────────────────────
import kineticHeroCode from '@/components/ui-showcase/blocks/hero/KineticHero.tsx?raw';
import cinematicHeroCode from '@/components/ui-showcase/blocks/hero/CinematicHero.tsx?raw';
import boldHeroCode from '@/components/ui-showcase/blocks/hero/BoldHero.tsx?raw';
import minimalHeroCode from '@/components/ui-showcase/blocks/hero/MinimalHero.tsx?raw';
import bentoGridCode from '@/components/ui-showcase/blocks/features/BentoGridSection.tsx?raw';
import featureListCode from '@/components/ui-showcase/blocks/features/FeatureListReveal.tsx?raw';
import statsShowcaseCode from '@/components/ui-showcase/blocks/features/StatsShowcase.tsx?raw';
import testimonialTickerCode from '@/components/ui-showcase/blocks/social-proof/TestimonialTicker.tsx?raw';
import testimonialWallCode from '@/components/ui-showcase/blocks/social-proof/TestimonialWall.tsx?raw';
import pricingCardsCode from '@/components/ui-showcase/blocks/pricing/PricingCards.tsx?raw';
import stepsAccordionCode from '@/components/ui-showcase/blocks/process/ProcessStepsAccordion.tsx?raw';
import marqueeStatementCode from '@/components/ui-showcase/blocks/content/MarqueeStatementSection.tsx?raw';
import cinematicSplitCode from '@/components/ui-showcase/blocks/content/CinematicTextImageReveal.tsx?raw';
import diagonalFeatureSplitCode from '@/components/ui-showcase/blocks/features/DiagonalFeatureSplit.tsx?raw';
import portfolioShowcaseCode from '@/components/ui-showcase/blocks/content/PortfolioShowcase.tsx?raw';
import imageRevealCode from '@/components/ui-showcase/blocks/content/ImageReveal.tsx?raw';
import ParallaxScrollerCode from '@/components/ui-showcase/blocks/content/ParallaxScroller.tsx?raw';
import textImageScrollCode from '@/components/ui-showcase/blocks/process/TextImageScroll.tsx?raw';
import glowPricingBlockCode from '@/components/ui-showcase/blocks/pricing/GlowPricingBlock.tsx?raw';
import typographyHeroCode from '@/components/ui-showcase/blocks/hero/TypographyHero.tsx?raw';
import ParallaxScroller from '@/components/ui-showcase/blocks/content/ParallaxScroller';

const proPlaceholder =
  '// 🔒 Pro Component\n// Purchase Pro access to view the source code.';
const getCode = (source: string, isPro: boolean, proUnlocked: boolean) =>
  PRO_CONFIG.proModeEnabled && isPro && !proUnlocked ? proPlaceholder : source;

const buildBlockComponentMap = (proUnlocked: boolean): Record<
  string,
  { component: React.ReactNode; code: string }
> => ({
  'kinetic-hero': {
    component: <KineticHero />,
    code: getCode(kineticHeroCode, true, proUnlocked),
  },
  'cinematic-hero': {
    component: <CinematicHero />,
    code: getCode(cinematicHeroCode, true, proUnlocked),
  },
  'bold-hero': { component: <BoldHero />, code: getCode(boldHeroCode, true, proUnlocked) },
  'minimal-hero': {
    component: <MinimalHero />,
    code: getCode(minimalHeroCode, false, proUnlocked),
  },
  'bento-grid': {
    component: <BentoGridSection />,
    code: getCode(bentoGridCode, true, proUnlocked),
  },
  'feature-list': {
    component: <FeatureListReveal />,
    code: getCode(featureListCode, false, proUnlocked),
  },
  'stats-showcase': {
    component: <StatsShowcase />,
    code: getCode(statsShowcaseCode, true, proUnlocked),
  },
  'testimonial-ticker': {
    component: <TestimonialTicker />,
    code: getCode(testimonialTickerCode, true, proUnlocked),
  },
  'testimonial-wall': {
    component: <TestimonialWall />,
    code: getCode(testimonialWallCode, true, proUnlocked),
  },
  'pricing-cards': {
    component: <PricingCards />,
    code: getCode(pricingCardsCode, true, proUnlocked),
  },
  'steps-accordion': {
    component: <ProcessStepsAccordion />,
    code: getCode(stepsAccordionCode, false, proUnlocked),
  },
  'marquee-statement': {
    component: <MarqueeStatementSection />,
    code: getCode(marqueeStatementCode, true, proUnlocked),
  },
  'cinematic-split': {
    component: <CinematicTextImageReveal />,
    code: getCode(cinematicSplitCode, true, proUnlocked),
  },
  'diagonal-feature': {
    component: <DiagonalFeatureSplit />,
    code: getCode(diagonalFeatureSplitCode, true, proUnlocked),
  },
  'portfolio-showcase': {
    component: <PortfolioShowcase />,
    code: getCode(portfolioShowcaseCode, true, proUnlocked),
  },
  'image-reveal': {
    component: <ImageReveal />,
    code: getCode(imageRevealCode, true, proUnlocked),
  },
  'parallax-scroller': {
    component: <ParallaxScroller />,
    code: getCode(ParallaxScrollerCode, true, proUnlocked),
  },
  'horizontal-scroll-section': {
    component: <HorizontalScrollSection />,
    code: getCode(horizonalScrollSectionCode, true, proUnlocked),
  },
  'text-image-scroll': { component: <TextImageScroll />, code: getCode(textImageScrollCode, true, proUnlocked) },
  'glow-pricing-block': { component: <GlowPricingBlock />, code: getCode(glowPricingBlockCode, true, proUnlocked) },
  'typography-hero': {
    component: <TypographyHero />,
    code: getCode(typographyHeroCode, true, proUnlocked),
  },
});

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
  const { isPro: proUnlocked } = usePro();
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

  // Auto-scroll to matched block from URL search param
  useEffect(() => {
    const initialSearch = searchParams.get('search');
    if (!initialSearch || didAutoScroll.current) return;
    didAutoScroll.current = true;

    // Clean URL
    setSearchParams({}, { replace: true });

    // Wait for lazy components to render, then scroll & highlight
    setTimeout(() => {
      const q = initialSearch.toLowerCase();
      const matchedBlock = blocks.find(
        (b) => b.category === category && b.name.toLowerCase().includes(q),
      );
      if (!matchedBlock) return;

      const el = document.getElementById(matchedBlock.id);
      if (!el) return;

      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      gsap.fromTo(
        el,
        { boxShadow: '0 0 0 2px #7c3aed' },
        { boxShadow: '0 0 0 2px transparent', duration: 1.5, ease: 'power2.out', delay: 0.4 },
      );
    }, 400);
  }, [category, searchParams, setSearchParams]);

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
          proEnabled && !proUnlocked
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
              background: proUnlocked ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.06)',
              borderBottom: '1px solid rgba(124,58,237,0.15)',
              padding: '10px 16px',
            }}
          >
            {proUnlocked ? (
              <div className="flex items-center gap-2 max-w-[1000px] mx-auto">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="font-inter font-light text-[12px]" style={{ color: '#a78bfa' }}>
                  You have access to all Pro blocks. Happy coding! 🚀
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between max-w-[1000px] mx-auto">
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
                <a
                  href={PRO_CONFIG.checkoutUrl}
                  className="lemonsqueezy-button font-inter font-medium text-[12px] px-4 py-1.5 rounded text-white text-center inline-block flex-shrink-0"
                  style={{ background: '#7c3aed' }}
                >
                  Unlock All for {PRO_CONFIG.proPrice} →
                </a>
              </div>
            )}
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
              const mapped = buildBlockComponentMap(proUnlocked)[block.id];
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
                        isPro={block.isPro}
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

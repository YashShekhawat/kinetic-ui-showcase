import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import TopBar from '@/components/layout/TopBar';
import ComponentsSidebar from '@/components/layout/ComponentsSidebar';
import {
  blocks,
  blockCategories,
  categoryLabels,
} from '@/config/components.config';
import { useIsMobile } from '@/hooks/use-mobile';
import { PRO_CONFIG } from '@/config/proConfig';

const categoryMeta: Record<
  string,
  { description: string; icon: string; preview: string }
> = {
  hero: {
    description:
      'Full-width landing sections with bold typography and GSAP entrance animations.',
    icon: '⬡',
    preview: '/src/assets/block-previews/hero.jpg',
  },
  features: {
    description:
      'Showcase your product features with bento grids, stats, and animated lists.',
    icon: '◈',
    preview: '/src/assets/block-previews/features.jpg',
  },
  'social-proof': {
    description:
      'Testimonial tickers, walls, and review sections to build trust.',
    icon: '◎',
    preview: '/src/assets/block-previews/social-proof.jpg',
  },
  pricing: {
    description:
      'Pricing tables with toggles, highlights, and smooth transitions.',
    icon: '◇',
    preview: '/src/assets/block-previews/pricing.jpg',
  },
  process: {
    description: 'Step-by-step accordions and process flows for onboarding.',
    icon: '⬢',
    preview: '/src/assets/block-previews/process.jpg',
  },
  content: {
    description:
      'Marquee statements, image reveals, portfolio showcases and more.',
    icon: '▣',
    preview: '/src/assets/block-previews/content.jpg',
  },
};

const BlocksPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const grouped = blocks.reduce<Record<string, typeof blocks>>((acc, b) => {
    if (!acc[b.category]) acc[b.category] = [];
    acc[b.category].push(b);
    return acc;
  }, {});

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Only y fade — no x movement to avoid slide animation
      gsap.fromTo(
        headerRef.current?.querySelectorAll('[data-anim]') ?? [],
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
      );
      gsap.fromTo(
        cardRefs.current.filter(Boolean),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: 'power3.out',
          delay: 0.2,
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleCardEnter = (i: number) => {
    gsap.to(cardRefs.current[i], {
      y: -3,
      borderColor: 'rgba(124,58,237,0.4)',
      duration: 0.25,
      ease: 'power2.out',
    });
    gsap.to(imgRefs.current[i], {
      scale: 1.05,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleCardLeave = (i: number) => {
    gsap.to(cardRefs.current[i], {
      y: 0,
      borderColor: '#1a1a2e',
      duration: 0.25,
      ease: 'power2.out',
    });
    gsap.to(imgRefs.current[i], {
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen"
      style={{ background: '#060608' }}
    >
      <TopBar
        search=""
        onSearchChange={() => {}}
        placeholder="Browse blocks..."
        rightText={
          PRO_CONFIG.proModeEnabled
            ? ((
                <>
                  <span>{blocks.length} blocks · </span>
                  <span style={{ color: '#7c3aed' }}>PRO</span>
                </>
              ) as any)
            : `${blocks.length} blocks`
        }
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        items={blocks}
        categories={blockCategories}
      />

      {/* Sidebar — same as original BlocksPage */}
      <ComponentsSidebar
        items={blocks}
        isBlocks
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-[220px] pt-[88px] sm:pt-12">
        <main className="max-w-[1000px] mx-auto px-4 md:px-8 pb-24 pt-10">
          {/* Header */}
          <div ref={headerRef} style={{ marginBottom: isMobile ? 28 : 40 }}>
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
                marginBottom: 12,
              }}
            >
              BLOCKS
            </span>
            <h1
              data-anim
              className="font-syne font-extrabold"
              style={{
                fontSize: isMobile ? '1.8rem' : '2.4rem',
                color: '#f0ede8',
                lineHeight: 1.1,
                marginBottom: 10,
              }}
            >
              Production-ready sections.
            </h1>
            <p
              data-anim
              className="font-inter font-light"
              style={{
                fontSize: '0.875rem',
                color: '#606070',
                maxWidth: 420,
                lineHeight: 1.7,
              }}
            >
              Full-width page sections with GSAP animations. Pick a category to
              explore.
            </p>

            {/* Stats */}
            <div
              data-anim
              className="flex items-center gap-6 flex-wrap"
              style={{
                marginTop: 20,
                paddingTop: 20,
                borderTop: '1px solid #1a1a2e',
              }}
            >
              {[
                { num: blocks.length, label: 'Total Blocks' },
                { num: blockCategories.length, label: 'Categories' },
                {
                  num: blocks.filter((b) => b.isNew).length,
                  label: 'New This Month',
                },
              ].map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-2">
                  <span
                    className="font-syne font-extrabold"
                    style={{ fontSize: '1.3rem', color: '#f0ede8' }}
                  >
                    {stat.num}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '9px',
                      color: '#404050',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {stat.label.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '10px',
            }}
          >
            {blockCategories.map((cat, i) => {
              const catBlocks = grouped[cat] ?? [];
              const proCount = catBlocks.filter((b) => b.isPro).length;
              const meta = categoryMeta[cat];

              return (
                <div
                  key={cat}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  onClick={() => navigate(`/blocks/${cat}`)}
                  onMouseEnter={() => handleCardEnter(i)}
                  onMouseLeave={() => handleCardLeave(i)}
                  className="relative overflow-hidden rounded-lg cursor-pointer"
                  style={{ background: '#0d0d12', border: '1px solid #1a1a2e' }}
                >
                  {/* Top accent line */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 1,
                      zIndex: 2,
                      background:
                        'linear-gradient(to right, transparent, rgba(124,58,237,0.25), transparent)',
                    }}
                  />

                  {/* Preview image */}
                  <div
                    className="overflow-hidden"
                    style={{
                      height: isMobile ? 160 : 200,
                      background: '#13131e',
                      position: 'relative',
                    }}
                  >
                    <img
                      ref={(el) => {
                        imgRefs.current[i] = el;
                      }}
                      src={meta?.preview}
                      alt={categoryLabels[cat]}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top',
                        display: 'block',
                        willChange: 'transform',
                        filter: 'brightness(0.85)',
                      }}
                      onError={(e) => {
                        // Hide broken image, show placeholder
                        (e.currentTarget as HTMLImageElement).style.display =
                          'none';
                      }}
                    />
                    {/* Gradient fade at bottom of image */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 60,
                        background:
                          'linear-gradient(to top, #0d0d12, transparent)',
                        pointerEvents: 'none',
                      }}
                    />
                    {/* Category label overlaid on image */}
                    <div style={{ position: 'absolute', top: 12, left: 12 }}>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: '8px',
                          color: '#a78bfa',
                          letterSpacing: '0.15em',
                          background: 'rgba(13,13,18,0.85)',
                          border: '1px solid rgba(124,58,237,0.2)',
                          padding: '3px 8px',
                          borderRadius: 3,
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        {cat.toUpperCase().replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: isMobile ? '16px' : '18px' }}>
                    <div
                      className="flex items-start justify-between"
                      style={{ marginBottom: 8 }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          style={{
                            fontSize: '1rem',
                            color: '#7c3aed',
                            lineHeight: 1,
                          }}
                        >
                          {meta?.icon}
                        </span>
                        <span
                          className="font-syne font-bold"
                          style={{ fontSize: '0.95rem', color: '#f0ede8' }}
                        >
                          {categoryLabels[cat]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {PRO_CONFIG.proModeEnabled && proCount > 0 && (
                          <span
                            className="font-mono"
                            style={{
                              fontSize: '8px',
                              color: '#7c3aed',
                              letterSpacing: '0.1em',
                              border: '1px solid rgba(124,58,237,0.25)',
                              background: 'rgba(124,58,237,0.06)',
                              padding: '2px 6px',
                              borderRadius: 3,
                            }}
                          >
                            PRO
                          </span>
                        )}
                        <span
                          className="font-mono"
                          style={{
                            fontSize: '9px',
                            color: '#404050',
                            letterSpacing: '0.1em',
                          }}
                        >
                          {catBlocks.length}{' '}
                          {catBlocks.length === 1 ? 'BLOCK' : 'BLOCKS'}
                        </span>
                      </div>
                    </div>

                    <p
                      className="font-inter font-light"
                      style={{
                        fontSize: '0.78rem',
                        color: '#606070',
                        lineHeight: 1.6,
                        marginBottom: 14,
                      }}
                    >
                      {meta?.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {catBlocks.slice(0, 3).map((b) => (
                          <span
                            key={b.id}
                            className="font-mono"
                            style={{
                              fontSize: '8px',
                              color: '#505060',
                              border: '1px solid #1a1a2e',
                              background: '#13131e',
                              padding: '2px 8px',
                              borderRadius: 3,
                              letterSpacing: '0.05em',
                            }}
                          >
                            {b.name}
                          </span>
                        ))}
                        {catBlocks.length > 3 && (
                          <span
                            className="font-mono"
                            style={{
                              fontSize: '8px',
                              color: '#404050',
                              padding: '2px 4px',
                            }}
                          >
                            +{catBlocks.length - 3} more
                          </span>
                        )}
                      </div>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: '11px',
                          color: '#2a2a3e',
                          flexShrink: 0,
                          marginLeft: 8,
                        }}
                      >
                        →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BlocksPage;

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '@/hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85',
    label: 'Alpine Heights',
    sub: 'Switzerland · 2024',
    speed: -60,
    mobileSpeed: -25,
    wide: true,
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&q=85',
    label: 'Midnight Sky',
    sub: 'Iceland · 2024',
    speed: -90,
    mobileSpeed: -35,
    wide: false,
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=85',
    label: 'Deep Waters',
    sub: 'Maldives · 2023',
    speed: -45,
    mobileSpeed: -18,
    wide: false,
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=85',
    label: 'Ancient Forest',
    sub: 'Canada · 2023',
    speed: -75,
    mobileSpeed: -30,
    wide: true,
  },
];

const ParallaxScroller = () => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Header line draw
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      // ── Header text reveal
      const headerWords =
        headerRef.current?.querySelectorAll('[data-word]') ?? [];
      gsap.fromTo(
        headerWords,
        { y: '110%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      // ── Card reveal on scroll
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, clipPath: 'inset(20% 0% 20% 0%)' },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });

      // ── Parallax on images
      imgRefs.current.forEach((img, i) => {
        if (!img) return;
        const speed = isMobile ? items[i].mobileSpeed : items[i].speed;
        gsap.fromTo(
          img,
          { y: -Math.abs(speed) * 0.5 },
          {
            y: Math.abs(speed),
            ease: 'none',
            scrollTrigger: {
              trigger: cardRefs.current[i],
              start: 'top bottom',
              end: 'bottom top',
              scrub: isMobile ? 1.5 : 1,
            },
          },
        );
      });

      // ── Labels slide in
      labelRefs.current.forEach((label, i) => {
        if (!label) return;
        gsap.fromTo(
          label,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardRefs.current[i],
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      data-preview="true"
      className="w-full"
      style={{
        background: '#0e0e14',
        boxSizing: 'border-box',
        pointerEvents: 'none',
        overflowX: 'hidden',
        overflowY: 'visible',
      }}
    >
      {/* ── Header */}
      <div
        ref={headerRef}
        style={{
          padding: isMobile ? '40px 20px 32px' : '64px 48px 48px',
        }}
      >
        <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
          <span
            className="font-mono"
            style={{
              fontSize: '10px',
              color: '#a78bfa',
              letterSpacing: '0.2em',
              border: '1px solid rgba(124,58,237,0.2)',
              background: 'rgba(124,58,237,0.06)',
              padding: '3px 10px',
              borderRadius: 4,
            }}
          >
            VISUAL JOURNAL
          </span>
          <div
            ref={lineRef}
            style={{ flex: 1, height: 1, background: '#1a1a2e', maxWidth: 120 }}
          />
        </div>

        <div style={{ overflow: 'hidden' }}>
          <div
            className="flex flex-wrap"
            style={{ gap: isMobile ? '0 8px' : '0 12px' }}
          >
            {['Places', 'that', 'move', 'you.'].map((word, i) => (
              <div key={i} style={{ overflow: 'hidden' }}>
                <span
                  data-word
                  className="font-syne font-extrabold inline-block"
                  style={{
                    fontSize: isMobile ? '2rem' : '3.2rem',
                    color: i === 3 ? 'transparent' : '#f0ede8',
                    WebkitTextStroke: i === 3 ? '1.5px #f0ede8' : undefined,
                    lineHeight: 1.1,
                  }}
                >
                  {word}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p
          className="font-inter font-light"
          style={{
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            color: '#606070',
            marginTop: 12,
            lineHeight: 1.6,
            maxWidth: 380,
          }}
        >
          A curated collection of places that inspire. Scroll to explore.
        </p>
      </div>

      {/* ── Desktop: 2-col asymmetric rows */}
      {!isMobile && (
        <div style={{ padding: '0 48px 64px' }}>
          {/* Row 1: wide + narrow */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: '1.6fr 1fr',
              gap: 10,
              marginBottom: 10,
            }}
          >
            {[0, 1].map((i) => (
              <div
                key={items[i].id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="relative overflow-hidden rounded-lg"
                style={{
                  height: i === 0 ? 420 : 320,
                  border: '1px solid #2a2a3e',
                }}
              >
                <img
                  ref={(el) => {
                    imgRefs.current[i] = el;
                  }}
                  src={items[i].src}
                  alt={items[i].label}
                  style={{
                    width: '100%',
                    height: '130%',
                    objectFit: 'cover',
                    display: 'block',
                    willChange: 'transform',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    position: 'absolute',
                    top: '-15%',
                    left: 0,
                  }}
                  draggable={false}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(6,6,8,0.8) 0%, rgba(6,6,8,0.1) 60%, transparent 100%)',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  ref={(el) => {
                    labelRefs.current[i] = el;
                  }}
                  style={{
                    position: 'absolute',
                    bottom: 18,
                    left: 18,
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    className="font-syne font-bold"
                    style={{
                      fontSize: '1.05rem',
                      color: '#f0ede8',
                      marginBottom: 3,
                    }}
                  >
                    {items[i].label}
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: '9px',
                      color: '#a78bfa',
                      letterSpacing: '0.12em',
                    }}
                  >
                    {items[i].sub}
                  </div>
                </div>
                {/* Index */}
                <div
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    pointerEvents: 'none',
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '9px',
                      color: 'rgba(255,255,255,0.25)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    0{i + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: narrow + wide */}
          <div
            className="grid"
            style={{ gridTemplateColumns: '1fr 1.6fr', gap: 10 }}
          >
            {[2, 3].map((itemI, colI) => (
              <div
                key={items[itemI].id}
                ref={(el) => {
                  cardRefs.current[itemI] = el;
                }}
                className="relative overflow-hidden rounded-lg"
                style={{
                  height: colI === 1 ? 400 : 300,
                  border: '1px solid #2a2a3e',
                }}
              >
                <img
                  ref={(el) => {
                    imgRefs.current[itemI] = el;
                  }}
                  src={items[itemI].src}
                  alt={items[itemI].label}
                  style={{
                    width: '100%',
                    height: '130%',
                    objectFit: 'cover',
                    display: 'block',
                    willChange: 'transform',
                    pointerEvents: 'none',
                    position: 'absolute',
                    top: '-15%',
                    left: 0,
                  }}
                  draggable={false}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(6,6,8,0.8) 0%, rgba(6,6,8,0.1) 60%, transparent 100%)',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  ref={(el) => {
                    labelRefs.current[itemI] = el;
                  }}
                  style={{
                    position: 'absolute',
                    bottom: 18,
                    left: 18,
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    className="font-syne font-bold"
                    style={{
                      fontSize: '1.05rem',
                      color: '#f0ede8',
                      marginBottom: 3,
                    }}
                  >
                    {items[itemI].label}
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: '9px',
                      color: '#a78bfa',
                      letterSpacing: '0.12em',
                    }}
                  >
                    {items[itemI].sub}
                  </div>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    pointerEvents: 'none',
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '9px',
                      color: 'rgba(255,255,255,0.25)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    0{itemI + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Mobile: single column stack */}
      {isMobile && (
        <div
          style={{
            padding: '0 20px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="relative overflow-hidden rounded-lg"
              style={{
                height: i % 2 === 0 ? 240 : 200,
                border: '1px solid #2a2a3e',
              }}
            >
              <img
                ref={(el) => {
                  imgRefs.current[i] = el;
                }}
                src={item.src}
                alt={item.label}
                style={{
                  width: '100%',
                  height: '130%',
                  objectFit: 'cover',
                  display: 'block',
                  willChange: 'transform',
                  pointerEvents: 'none',
                  position: 'absolute',
                  top: '-15%',
                  left: 0,
                }}
                draggable={false}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(6,6,8,0.85) 0%, transparent 65%)',
                  pointerEvents: 'none',
                }}
              />
              <div
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                style={{
                  position: 'absolute',
                  bottom: 14,
                  left: 14,
                  pointerEvents: 'none',
                }}
              >
                <div
                  className="font-syne font-bold"
                  style={{
                    fontSize: '0.9rem',
                    color: '#f0ede8',
                    marginBottom: 2,
                  }}
                >
                  {item.label}
                </div>
                <div
                  className="font-mono"
                  style={{
                    fontSize: '8px',
                    color: '#a78bfa',
                    letterSpacing: '0.12em',
                  }}
                >
                  {item.sub}
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  pointerEvents: 'none',
                }}
              >
                <span
                  className="font-mono"
                  style={{ fontSize: '8px', color: 'rgba(255,255,255,0.2)' }}
                >
                  0{i + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Footer */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: isMobile ? '0 20px 28px' : '0 48px 40px',
          borderTop: '1px solid #0f0f1a',
          paddingTop: 16,
        }}
      >
        <span
          className="font-mono"
          style={{ fontSize: '8px', color: '#1e1e2e', letterSpacing: '0.15em' }}
        >
          KINETIC UI — PARALLAX BLOCK
        </span>
        <span
          className="font-mono"
          style={{ fontSize: '8px', color: '#303040', letterSpacing: '0.1em' }}
        >
          {items.length} IMAGES
        </span>
      </div>
    </div>
  );
};

export default ParallaxScroller;

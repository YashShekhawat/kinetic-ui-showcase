import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '@/hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    id: 1,
    num: '01',
    tag: 'FOUNDATION',
    title: 'Built for\nperformance.',
    body: 'Every component is GPU-accelerated. No layout thrashing, no jank — just silky 60fps animations that your users will actually feel.',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    accent: '#7c3aed',
  },
  {
    id: 2,
    num: '02',
    tag: 'DESIGN',
    title: 'Dark by\ndefault.',
    body: 'Crafted for modern dark-mode interfaces. Every token, every shadow, every glow is purpose-built for depth and contrast.',
    image:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    accent: '#a78bfa',
  },
  {
    id: 3,
    num: '03',
    tag: 'ANIMATION',
    title: 'GSAP\nat the core.',
    body: 'Not CSS transitions dressed up. Real GSAP timelines, ScrollTrigger contexts, and cleanup on every unmount.',
    image:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    accent: '#7c3aed',
  },
  {
    id: 4,
    num: '04',
    tag: 'WORKFLOW',
    title: 'Copy.\nPaste.\nShip.',
    body: 'Zero config. Drop any component into your project and it works. No fighting with dependencies or broken peer packages.',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    accent: '#a78bfa',
  },
];

const HorizontalScrollSection = () => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const numRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile) return; // mobile uses vertical layout

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const slideWidth = track.scrollWidth - window.innerWidth;

      // ── Main horizontal scroll pin
      const mainTween = gsap.to(track, {
        x: -slideWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${slideWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Update progress bar
            if (progressRef.current) {
              gsap.set(progressRef.current, { scaleX: self.progress });
            }
          },
        },
      });

      // ── Parallax on each image (moves slower than card = depth effect)
      imgRefs.current.forEach((img) => {
        if (!img) return;
        gsap.fromTo(
          img,
          { x: -60 },
          {
            x: 60,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => `+=${slideWidth}`,
              scrub: 1.5,
            },
          },
        );
      });

      // ── Slide number counting animation per slide
      slideRefs.current.forEach((slide, i) => {
        if (!slide || !numRefs.current[i]) return;

        gsap.fromTo(
          numRefs.current[i],
          { opacity: 0.15, scale: 0.85 },
          {
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: () => `top top-=${(i / slides.length) * slideWidth * 0.8}`,
              end: () =>
                `top top-=${((i + 1) / slides.length) * slideWidth * 0.8}`,
              scrub: 0.8,
              containerAnimation: mainTween,
            },
          },
        );
      });

      // ── Header entrance
      gsap.fromTo(
        headerRef.current?.querySelectorAll('[data-anim]') ?? [],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isMobile]);

  // ── DESKTOP layout
  if (!isMobile) {
    return (
      <div
        ref={sectionRef}
        data-preview="true"
        className="w-full"
        style={{
          background: '#0e0e14',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Progress bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: '#1a1a2e',
            zIndex: 10,
          }}
        >
          <div
            ref={progressRef}
            style={{
              height: '100%',
              background: 'linear-gradient(to right, #7c3aed, #a78bfa)',
              transformOrigin: 'left center',
              scaleX: 0,
            }}
          />
        </div>

        {/* Header row — shown above the pinned track */}
        <div
          ref={headerRef}
          style={{
            padding: '40px 48px 32px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 5,
          }}
        >
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
                marginBottom: 12,
              }}
            >
              HORIZONTAL SCROLL
            </span>
            <h2
              data-anim
              className="font-syne font-extrabold"
              style={{
                fontSize: '2.2rem',
                color: '#f0ede8',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Why Kinetic UI.
            </h2>
          </div>
          <div
            data-anim
            className="flex items-center gap-2"
            style={{ paddingBottom: 6 }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: '9px',
                color: '#404050',
                letterSpacing: '0.1em',
              }}
            >
              SCROLL TO EXPLORE
            </span>
            <svg width="24" height="8" viewBox="0 0 24 8" fill="none">
              <path
                d="M0 4h22M18 1l4 3-4 3"
                stroke="#404050"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Slides track */}
        <div
          ref={trackRef}
          className="flex"
          style={{
            padding: '0 48px 48px',
            gap: 16,
            willChange: 'transform',
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className="flex-shrink-0 relative overflow-hidden rounded-xl"
              style={{
                width: '70vw',
                height: '58vh',
                minHeight: 380,
                maxHeight: 520,
                border: '1px solid #2a2a3e',
                background: '#0d0d12',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              {/* Image fills full card */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ borderRadius: 'inherit' }}
              >
                <img
                  ref={(el) => {
                    imgRefs.current[i] = el;
                  }}
                  src={slide.image}
                  alt={slide.title}
                  style={{
                    width: '110%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    filter: 'brightness(0.35)',
                    willChange: 'transform',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    marginLeft: '-5%',
                  }}
                  draggable={false}
                />
                {/* Gradient overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(135deg, ${slide.accent}22 0%, transparent 60%, rgba(6,6,8,0.9) 100%)`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(6,6,8,0.95) 0%, transparent 55%)',
                  }}
                />
              </div>

              {/* Big number — top right */}
              <div
                ref={(el) => {
                  numRefs.current[i] = el;
                }}
                className="absolute font-syne font-extrabold"
                style={{
                  top: 24,
                  right: 28,
                  fontSize: '5rem',
                  lineHeight: 1,
                  color: 'transparent',
                  WebkitTextStroke: `1px ${slide.accent}55`,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                {slide.num}
              </div>

              {/* Tag */}
              <div style={{ position: 'absolute', top: 24, left: 24 }}>
                <span
                  className="font-mono"
                  style={{
                    fontSize: '9px',
                    color: slide.accent,
                    letterSpacing: '0.18em',
                    border: `1px solid ${slide.accent}33`,
                    background: `${slide.accent}11`,
                    padding: '3px 10px',
                    borderRadius: 4,
                  }}
                >
                  {slide.tag}
                </span>
              </div>

              {/* Bottom content */}
              <div
                style={{
                  position: 'relative',
                  padding: '0 28px 28px',
                  zIndex: 2,
                }}
              >
                <h3
                  className="font-syne font-extrabold"
                  style={{
                    fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)',
                    color: '#f0ede8',
                    lineHeight: 1.15,
                    marginBottom: 12,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {slide.title}
                </h3>
                <p
                  className="font-inter font-light"
                  style={{
                    fontSize: '0.85rem',
                    color: '#909098',
                    lineHeight: 1.7,
                    maxWidth: 340,
                  }}
                >
                  {slide.body}
                </p>

                {/* Progress dots */}
                <div
                  className="flex items-center gap-1.5"
                  style={{ marginTop: 20 }}
                >
                  {slides.map((_, j) => (
                    <div
                      key={j}
                      style={{
                        width: i === j ? 16 : 4,
                        height: 3,
                        borderRadius: 2,
                        background: i === j ? slide.accent : '#2a2a3e',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* End card */}
          <div
            className="flex-shrink-0 rounded-xl flex flex-col items-center justify-center"
            style={{
              width: '30vw',
              height: '58vh',
              minHeight: 380,
              maxHeight: 520,
              border: '1px solid #1a1a2e',
              background: '#0d0d12',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '1px solid #2a2a3e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: '#7c3aed', fontSize: '1.1rem' }}>↗</span>
            </div>
            <p
              className="font-syne font-bold"
              style={{
                fontSize: '1rem',
                color: '#f0ede8',
                textAlign: 'center',
              }}
            >
              Explore all
              <br />
              components
            </p>
            <span
              className="font-mono"
              style={{
                fontSize: '9px',
                color: '#404050',
                letterSpacing: '0.1em',
              }}
            >
              60+ BLOCKS & COMPONENTS
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── MOBILE: vertical stacked cards
  return (
    <div
      data-preview="true"
      className="w-full"
      style={{
        background: '#0e0e14',
        padding: '32px 20px 40px',
        boxSizing: 'border-box',
        pointerEvents: 'none',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <span
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
          HORIZONTAL SCROLL
        </span>
        <h2
          className="font-syne font-extrabold"
          style={{
            fontSize: '1.7rem',
            color: '#f0ede8',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Why Kinetic UI.
        </h2>
      </div>

      {/* Stacked cards */}
      <div className="flex flex-col" style={{ gap: 10 }}>
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className="relative overflow-hidden rounded-xl"
            style={{
              height: 220,
              border: '1px solid #2a2a3e',
              background: '#0d0d12',
            }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.3)',
                pointerEvents: 'none',
              }}
              draggable={false}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(6,6,8,0.95) 0%, transparent 60%)',
              }}
            />

            {/* Tag top-left */}
            <div style={{ position: 'absolute', top: 14, left: 14 }}>
              <span
                className="font-mono"
                style={{
                  fontSize: '8px',
                  color: slide.accent,
                  letterSpacing: '0.15em',
                  border: `1px solid ${slide.accent}33`,
                  background: `${slide.accent}11`,
                  padding: '2px 8px',
                  borderRadius: 3,
                }}
              >
                {slide.tag}
              </span>
            </div>

            {/* Number top-right */}
            <div
              className="absolute font-syne font-extrabold"
              style={{
                top: 10,
                right: 16,
                fontSize: '3.5rem',
                lineHeight: 1,
                color: 'transparent',
                WebkitTextStroke: `1px ${slide.accent}44`,
              }}
            >
              {slide.num}
            </div>

            {/* Content */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '0 16px 16px',
              }}
            >
              <h3
                className="font-syne font-extrabold"
                style={{
                  fontSize: '1.2rem',
                  color: '#f0ede8',
                  lineHeight: 1.15,
                  marginBottom: 6,
                  whiteSpace: 'pre-line',
                }}
              >
                {slide.title}
              </h3>
              <p
                className="font-inter font-light"
                style={{
                  fontSize: '0.75rem',
                  color: '#808090',
                  lineHeight: 1.6,
                }}
              >
                {slide.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalScrollSection;

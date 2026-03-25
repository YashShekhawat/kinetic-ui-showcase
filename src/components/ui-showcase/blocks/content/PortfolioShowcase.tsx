import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

const projects = [
  {
    id: 1,
    title: 'Brand Identity',
    category: 'BRANDING',
    year: '2024',
    image:
      'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=600&q=80',
    accent: 'var(--theme-accent)',
  },
  {
    id: 2,
    title: 'Mobile App UI',
    category: 'UI DESIGN',
    year: '2024',
    image:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
    accent: 'var(--theme-accent-light)',
  },
  {
    id: 3,
    title: 'E-Commerce Platform',
    category: 'WEB DESIGN',
    year: '2023',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    accent: 'var(--theme-accent)',
  },
  {
    id: 4,
    title: 'Motion Graphics',
    category: 'ANIMATION',
    year: '2024',
    image:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80',
    accent: 'var(--theme-accent-light)',
  },
  {
    id: 5,
    title: 'Dashboard Design',
    category: 'PRODUCT',
    year: '2023',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    accent: 'var(--theme-accent)',
  },
];

const PortfolioShowcase = () => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const dragState = useRef({
    startX: 0,
    isDragging: false,
    trackX: 0,
    lastX: 0,
    velocity: 0,
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerEls =
        headerRef.current?.querySelectorAll('[data-anim]') ?? [];
      gsap.set(cardRefs.current.filter(Boolean), {
        opacity: 0,
        y: 40,
        scale: 0.96,
      });
      gsap.set(overlayRefs.current.filter(Boolean), { y: '100%' });
      gsap.set(headerEls, { opacity: 0, y: 16 });

      gsap.to(headerEls, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      });
      gsap.to(cardRefs.current.filter(Boolean), {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.3,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Desktop: mouse drag on track
  useEffect(() => {
    const track = trackRef.current;
    if (!track || isMobile) return;

    let startX = 0;
    let trackX = 0;
    let isDragging = false;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX;
      trackX = dragState.current.trackX;
      track.style.cursor = 'grabbing';
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const delta = e.clientX - startX;
      const newX = trackX + delta;
      const maxX = 0;
      const minX = -(projects.length - 1) * (260 + 12);
      const clamped = Math.max(minX - 40, Math.min(maxX + 40, newX));
      gsap.set(track, { x: clamped });
    };

    const onMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;
      isDragging = false;
      track.style.cursor = 'grab';
      const delta = e.clientX - startX;
      const cardW = 260 + 12;
      let newIndex = activeIndex;
      if (delta < -60 && activeIndex < projects.length - 1)
        newIndex = activeIndex + 1;
      else if (delta > 60 && activeIndex > 0) newIndex = activeIndex - 1;
      snapToIndex(newIndex);
    };

    track.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    track.style.cursor = 'grab';

    return () => {
      track.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isMobile, activeIndex]);

  const snapToIndex = (i: number) => {
    if (!trackRef.current) return;
    const cardW = isMobile ? window.innerWidth * 0.72 + 12 : 272;
    const newX = -i * cardW;
    gsap.to(trackRef.current, { x: newX, duration: 0.45, ease: 'power3.out' });
    dragState.current.trackX = newX;
    setActiveIndex(i);
    if (counterRef.current) {
      gsap.to(
        { val: activeIndex + 1 },
        {
          val: i + 1,
          duration: 0.3,
          onUpdate: function () {
            if (counterRef.current)
              counterRef.current.textContent = String(
                Math.round(this.targets()[0].val),
              ).padStart(2, '0');
          },
        },
      );
    }
  };

  // Mobile touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    dragState.current.startX = e.touches[0].clientX;
    dragState.current.isDragging = true;
    dragState.current.lastX = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragState.current.isDragging || !trackRef.current) return;
    const delta = e.touches[0].clientX - dragState.current.startX;
    dragState.current.velocity = e.touches[0].clientX - dragState.current.lastX;
    dragState.current.lastX = e.touches[0].clientX;
    gsap.set(trackRef.current, { x: dragState.current.trackX + delta });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!dragState.current.isDragging) return;
    dragState.current.isDragging = false;
    const delta = e.changedTouches[0].clientX - dragState.current.startX;
    let newIndex = activeIndex;
    if (delta < -50 && activeIndex < projects.length - 1)
      newIndex = activeIndex + 1;
    else if (delta > 50 && activeIndex > 0) newIndex = activeIndex - 1;
    snapToIndex(newIndex);
  };

  const handleMouseEnter = (i: number) => {
    if (isMobile) return;
    gsap.to(imgRefs.current[i], {
      scale: 1.08,
      duration: 0.5,
      ease: 'power2.out',
    });
    gsap.to(overlayRefs.current[i], {
      y: '0%',
      duration: 0.4,
      ease: 'power3.out',
    });
  };

  const handleMouseLeave = (i: number) => {
    if (isMobile) return;
    gsap.to(imgRefs.current[i], {
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
    });
    gsap.to(overlayRefs.current[i], {
      y: '100%',
      duration: 0.35,
      ease: 'power2.in',
    });
  };

  return (
    <div
      ref={containerRef}
      data-preview="true"
      className="w-full overflow-hidden"
      style={{
        background: 'var(--theme-bg-panel)',
        padding: isMobile ? '24px 0' : '40px 0',
        boxSizing: 'border-box',
        // No pointerEvents: none on root — needed for drag/hover
      }}
    >
      {/* Header — non-interactive, no pointer events needed */}
      <div
        ref={headerRef}
        style={{
          padding: isMobile ? '0 20px 20px' : '0 36px 28px',
          pointerEvents: 'none',
        }}
      >
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <span
              data-anim
              className="font-mono inline-block"
              style={{
                fontSize: '10px',
                color: 'var(--theme-accent-light)',
                letterSpacing: '0.2em',
                border: '1px solid rgba(124,58,237,0.2)',
                background: 'rgba(124,58,237,0.06)',
                padding: '3px 10px',
                borderRadius: 4,
                marginBottom: 10,
              }}
            >
              SELECTED WORK
            </span>
            <h2
              data-anim
              className="font-syne font-extrabold"
              style={{
                fontSize: isMobile ? '1.6rem' : '2rem',
                color: 'var(--theme-text-primary)',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Recent projects.
            </h2>
          </div>
          <div data-anim className="flex items-center gap-3">
            <span
              className="font-mono"
              style={{
                fontSize: '9px',
                color: 'var(--theme-text-very-dim)',
                letterSpacing: '0.1em',
              }}
            >
              {projects.length} PROJECTS
            </span>
            <div style={{ width: 1, height: 16, background: '#1a1a2e' }} />
            <span
              className="font-mono"
              style={{
                fontSize: '9px',
                color: 'var(--theme-text-very-dim)',
                letterSpacing: '0.1em',
              }}
            >
              2023 — 2024
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable track — pointer events active */}
      <div
        className="overflow-hidden"
        style={{
          paddingLeft: isMobile ? '20px' : '36px',
          pointerEvents: 'auto',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={trackRef}
          className="flex"
          style={{ gap: '12px', willChange: 'transform', userSelect: 'none' }}
        >
          {projects.map((project, i) => (
            <div
              key={project.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="flex-shrink-0 relative overflow-hidden rounded-lg"
              style={{
                width: isMobile ? '72vw' : '260px',
                height: isMobile ? '320px' : '300px',
                border: '1px solid #2a2a3e',
                pointerEvents: 'auto',
              }}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={() => handleMouseLeave(i)}
            >
              <img
                ref={(el) => {
                  imgRefs.current[i] = el;
                }}
                src={project.image}
                alt={project.title}
                className="w-full h-full"
                style={{
                  objectFit: 'cover',
                  display: 'block',
                  willChange: 'transform',
                  pointerEvents: 'none',
                }}
                draggable={false}
              />

              {/* Bottom label — always visible */}
              <div
                className="absolute bottom-0 left-0 right-0 flex items-end justify-between"
                style={{
                  padding: '32px 14px 14px',
                  background:
                    'linear-gradient(to top, rgba(6,6,8,0.9), transparent)',
                  pointerEvents: 'none',
                }}
              >
                <div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: '9px',
                      color: project.accent,
                      letterSpacing: '0.15em',
                      marginBottom: 3,
                    }}
                  >
                    {project.category}
                  </div>
                  <div
                    className="font-syne font-bold"
                    style={{ fontSize: '0.9rem', color: 'var(--theme-text-primary)' }}
                  >
                    {project.title}
                  </div>
                </div>
                <div
                  className="font-mono"
                  style={{ fontSize: '9px', color: '#505060' }}
                >
                  {project.year}
                </div>
              </div>

              {/* Hover overlay */}
              <div
                ref={(el) => {
                  overlayRefs.current[i] = el;
                }}
                className="absolute inset-0 flex flex-col justify-end"
                style={{
                  background: `linear-gradient(160deg, ${project.accent}e0, rgba(6,6,8,0.96))`,
                  padding: '20px',
                  transform: 'translateY(100%)',
                  pointerEvents: 'none',
                }}
              >
                <div
                  className="font-mono"
                  style={{
                    fontSize: '9px',
                    color: 'rgba(255,255,255,0.45)',
                    letterSpacing: '0.15em',
                    marginBottom: 8,
                  }}
                >
                  {project.category} · {project.year}
                </div>
                <div
                  className="font-syne font-extrabold"
                  style={{
                    fontSize: '1.1rem',
                    color: '#fff',
                    marginBottom: 8,
                    lineHeight: 1.2,
                  }}
                >
                  {project.title}
                </div>
                <div
                  className="font-inter font-light"
                  style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.6)',
                    lineHeight: 1.6,
                    marginBottom: 14,
                  }}
                >
                  A complete end-to-end project delivered with attention to
                  detail and purpose-driven design.
                </div>
                <div
                  className="font-mono inline-flex items-center gap-1.5"
                  style={{ fontSize: '10px', color: '#fff' }}
                >
                  View Case Study <span style={{ fontSize: '12px' }}>↗</span>
                </div>
              </div>
            </div>
          ))}
          <div style={{ width: isMobile ? '20px' : '36px', flexShrink: 0 }} />
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between flex-wrap gap-3"
        style={{
          padding: isMobile ? '16px 20px 0' : '20px 36px 0',
          pointerEvents: 'none',
        }}
      >
        <div className="flex items-center gap-2">
          {projects.map((_, i) => (
            <div
              key={i}
              style={{
                width: activeIndex === i ? 20 : 4,
                height: 4,
                borderRadius: 2,
                background: activeIndex === i ? 'var(--theme-accent)' : 'var(--theme-border-hover)',
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span
            ref={counterRef}
            className="font-syne font-bold"
            style={{ fontSize: '1rem', color: 'var(--theme-text-primary)' }}
          >
            01
          </span>
          <span
            className="font-mono"
            style={{ fontSize: '9px', color: '#303040' }}
          >
            /
          </span>
          <span
            className="font-mono"
            style={{ fontSize: '9px', color: 'var(--theme-text-very-dim)' }}
          >
            {String(projects.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PortfolioShowcase;

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

const images = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    label: 'Mountains',
    tag: '01',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&q=80',
    label: 'Starlight',
    tag: '02',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80',
    label: 'Ocean',
    tag: '03',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    label: 'Forest',
    tag: '04',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    label: 'Valley',
    tag: '05',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=800&q=80',
    label: 'Desert',
    tag: '06',
  },
];

const ImageReveal = () => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const clipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const isTouch = useRef(false);

  useEffect(() => {
    isTouch.current = window.matchMedia('(hover: none)').matches;

    const ctx = gsap.context(() => {
      gsap.set(clipRefs.current.filter(Boolean), {
        clipPath: 'inset(100% 0% 0% 0%)',
      });
      gsap.set(cardRefs.current.filter(Boolean), { opacity: 0 });
      gsap.set(labelRefs.current.filter(Boolean), { opacity: 0, y: 10 });

      gsap.to(cardRefs.current.filter(Boolean), {
        opacity: 1,
        duration: 0.01,
        stagger: 0.1,
        delay: 0.1,
      });

      gsap.to(clipRefs.current.filter(Boolean), {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.9,
        stagger: 0.12,
        ease: 'power4.inOut',
        delay: 0.2,
        onComplete: () => {
          gsap.to(labelRefs.current.filter(Boolean), {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: 'power2.out',
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent, i: number) => {
    if (isTouch.current || activeId !== null) return;
    const card = cardRefs.current[i];
    const img = imgRefs.current[i];
    if (!card || !img) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: x * 12,
      rotateX: -y * 12,
      transformPerspective: 900,
      duration: 0.35,
      ease: 'power2.out',
    });
    gsap.to(img, {
      x: x * 10,
      y: y * 10,
      scale: 1.06,
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = (i: number) => {
    if (isTouch.current || activeId !== null) return;
    gsap.to(cardRefs.current[i], {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.6)',
    });
    gsap.to(imgRefs.current[i], {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleClick = (id: number, i: number) => {
    if (activeId === id) {
      setActiveId(null);
      gsap.to(cardRefs.current[i], {
        scale: 1,
        zIndex: 1,
        duration: 0.5,
        ease: 'power3.inOut',
      });
      gsap.to(imgRefs.current[i], {
        scale: 1,
        duration: 0.5,
        ease: 'power3.inOut',
      });
      cardRefs.current.forEach((c, j) => {
        if (j === i || !c) return;
        gsap.to(c, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
      });
      const lbl = labelRefs.current[i];
      if (lbl) {
        gsap.to(lbl.querySelector('.irg-close'), {
          opacity: 0,
          duration: 0.15,
        });
        gsap.to(lbl.querySelector('.irg-name'), { opacity: 1, duration: 0.2 });
      }
    } else {
      if (activeId !== null) {
        const prevI = images.findIndex((img) => img.id === activeId);
        if (prevI !== -1) {
          gsap.to(cardRefs.current[prevI], {
            scale: 1,
            zIndex: 1,
            duration: 0.4,
          });
          gsap.to(imgRefs.current[prevI], { scale: 1, duration: 0.4 });
          const pl = labelRefs.current[prevI];
          if (pl) {
            gsap.to(pl.querySelector('.irg-close'), {
              opacity: 0,
              duration: 0.15,
            });
            gsap.to(pl.querySelector('.irg-name'), {
              opacity: 1,
              duration: 0.2,
            });
          }
        }
      }
      setActiveId(id);
      cardRefs.current.forEach((c, j) => {
        if (j === i || !c) return;
        gsap.to(c, {
          opacity: 0.25,
          scale: 0.97,
          duration: 0.4,
          ease: 'power2.out',
        });
      });
      gsap.to(cardRefs.current[i], {
        scale: 1.04,
        zIndex: 10,
        duration: 0.5,
        ease: 'power3.out',
      });
      gsap.to(imgRefs.current[i], {
        scale: 1.1,
        duration: 0.6,
        ease: 'power3.out',
      });
      const lbl = labelRefs.current[i];
      if (lbl) {
        gsap.to(lbl.querySelector('.irg-name'), { opacity: 0, duration: 0.15 });
        gsap.to(lbl.querySelector('.irg-close'), {
          opacity: 1,
          duration: 0.25,
          delay: 0.1,
        });
      }
    }
  };

  // Grid layout: 3 cols desktop, 2 cols mobile
  // Row 1: tall | short | tall  (alternating heights)
  // Row 2: short | tall | short
  const getAspect = (i: number) => {
    const pattern = ['3/4', '4/5', '3/4', '4/5', '3/4', '4/5'];
    return isMobile ? (i % 2 === 0 ? '4/5' : '3/4') : pattern[i];
  };

  return (
    <div
      ref={containerRef}
      data-preview="true"
      className="w-full overflow-hidden"
      style={{
        background: '#0e0e14',
        boxSizing: 'border-box',
        pointerEvents: 'none',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: isMobile ? '28px 20px 20px' : '40px 40px 28px',
          pointerEvents: 'none',
        }}
      >
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
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
              IMAGE GALLERY
            </span>
            <h2
              className="font-syne font-extrabold"
              style={{
                fontSize: isMobile ? '1.6rem' : '2.2rem',
                color: '#f0ede8',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Visual stories.
            </h2>
          </div>
          <p
            className="font-inter font-light"
            style={{ fontSize: '0.8rem', color: '#606070', lineHeight: 1.6 }}
          >
            {isTouch.current
              ? 'Tap to expand'
              : 'Hover to tilt · click to expand'}
          </p>
        </div>
      </div>

      {/* Full-width grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: isMobile ? '6px' : '8px',
          padding: isMobile ? '0 20px' : '0 40px',
          pointerEvents: 'auto',
        }}
      >
        {images.map((img, i) => (
          <div
            key={img.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="relative overflow-hidden rounded-lg"
            style={{
              aspectRatio: getAspect(i),
              cursor: 'pointer',
              border: '1px solid #2a2a3e',
              transformStyle: 'preserve-3d',
              willChange: 'transform',
              position: 'relative',
            }}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseLeave={() => handleMouseLeave(i)}
            onClick={() => handleClick(img.id, i)}
          >
            {/* Clip reveal wrapper */}
            <div
              ref={(el) => {
                clipRefs.current[i] = el;
              }}
              className="absolute inset-0"
              style={{ willChange: 'clip-path' }}
            >
              <img
                ref={(el) => {
                  imgRefs.current[i] = el;
                }}
                src={img.src}
                alt={img.label}
                className="w-full h-full"
                style={{
                  objectFit: 'cover',
                  display: 'block',
                  willChange: 'transform',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
                draggable={false}
              />
              {/* Gradient overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(6,6,8,0.75) 0%, transparent 55%)',
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* Purple tint on reveal */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to bottom, rgba(124,58,237,0.05), transparent)',
                pointerEvents: 'none',
                mixBlendMode: 'screen',
              }}
            />

            {/* Active border */}
            {activeId === img.id && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: '1px solid rgba(124,58,237,0.55)',
                  borderRadius: 8,
                  pointerEvents: 'none',
                  boxShadow: '0 0 24px rgba(124,58,237,0.15) inset',
                }}
              />
            )}

            {/* Label */}
            <div
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              className="absolute bottom-0 left-0 right-0 flex items-end justify-between"
              style={{
                padding: isMobile ? '24px 12px 12px' : '32px 16px 14px',
                pointerEvents: 'none',
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="font-mono"
                  style={{
                    fontSize: '8px',
                    color: '#7c3aed',
                    letterSpacing: '0.12em',
                  }}
                >
                  {img.tag}
                </span>
                <span
                  className="font-syne font-bold irg-name"
                  style={{
                    fontSize: isMobile ? '0.75rem' : '0.9rem',
                    color: '#f0ede8',
                  }}
                >
                  {img.label}
                </span>
                <span
                  className="font-mono irg-close"
                  style={{ fontSize: '8px', color: '#a78bfa', opacity: 0 }}
                >
                  ✕ close
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="flex justify-center"
        style={{
          padding: isMobile ? '16px 20px' : '20px 40px',
          pointerEvents: 'none',
        }}
      >
        <span
          className="font-mono"
          style={{ fontSize: '8px', color: '#1e1e2e', letterSpacing: '0.15em' }}
        >
          KINETIC UI — IMAGE BLOCK
        </span>
      </div>
    </div>
  );
};

export default ImageReveal;

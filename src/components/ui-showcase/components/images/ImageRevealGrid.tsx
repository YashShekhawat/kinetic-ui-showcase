import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

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

const ImageRevealGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const clipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Detect touch device
  const isTouch = useRef(false);
  useEffect(() => {
    isTouch.current = window.matchMedia('(hover: none)').matches;
    setIsMounted(true);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!isMounted) return;
    const ctx = gsap.context(() => {
      // Set initial clip-path on all clip wrappers
      gsap.set(clipRefs.current.filter(Boolean), {
        clipPath: 'inset(100% 0% 0% 0%)',
      });
      gsap.set(cardRefs.current.filter(Boolean), {
        opacity: 0,
      });
      gsap.set(labelRefs.current.filter(Boolean), {
        opacity: 0,
        y: 10,
      });

      // Stagger reveal — clip-path wipes up
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
        delay: 0.15,
        onComplete: () => {
          // Labels fade in after reveal
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
  }, [isMounted]);

  // 3D tilt on mouse move (desktop only)
  const handleMouseMove = (e: React.MouseEvent, i: number) => {
    if (isTouch.current || activeId !== null) return;
    const card = cardRefs.current[i];
    const img = imgRefs.current[i];
    if (!card || !img) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 14,
      rotateX: -y * 14,
      transformPerspective: 800,
      duration: 0.4,
      ease: 'power2.out',
    });

    gsap.to(img, {
      x: x * 12,
      y: y * 12,
      scale: 1.06,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = (i: number) => {
    if (isTouch.current || activeId !== null) return;
    const card = cardRefs.current[i];
    const img = imgRefs.current[i];
    if (!card || !img) return;

    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.6)',
    });
    gsap.to(img, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  // Click / tap to expand
  const handleClick = (id: number, i: number) => {
    if (activeId === id) {
      // Collapse
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
      // Fade others back in
      cardRefs.current.forEach((c, j) => {
        if (j === i || !c) return;
        gsap.to(c, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
      });
      // Hide label close hint
      const label = labelRefs.current[i];
      if (label) {
        gsap.to(label.querySelector('.ps-close'), {
          opacity: 0,
          duration: 0.2,
        });
        gsap.to(label.querySelector('.ps-name'), { opacity: 1, duration: 0.2 });
      }
    } else {
      // Reset any previously active
      if (activeId !== null) {
        const prevI = images.findIndex((img) => img.id === activeId);
        if (prevI !== -1) {
          gsap.to(cardRefs.current[prevI], {
            scale: 1,
            zIndex: 1,
            duration: 0.4,
            ease: 'power3.inOut',
          });
          gsap.to(imgRefs.current[prevI], { scale: 1, duration: 0.4 });
          const prevLabel = labelRefs.current[prevI];
          if (prevLabel) {
            gsap.to(prevLabel.querySelector('.ps-close'), {
              opacity: 0,
              duration: 0.2,
            });
            gsap.to(prevLabel.querySelector('.ps-name'), {
              opacity: 1,
              duration: 0.2,
            });
          }
        }
      }

      setActiveId(id);

      // Dim others
      cardRefs.current.forEach((c, j) => {
        if (j === i || !c) return;
        gsap.to(c, {
          opacity: 0.3,
          scale: 0.97,
          duration: 0.4,
          ease: 'power2.out',
        });
      });

      // Scale up active
      gsap.to(cardRefs.current[i], {
        scale: 1.06,
        zIndex: 10,
        duration: 0.5,
        ease: 'power3.out',
      });
      gsap.to(imgRefs.current[i], {
        scale: 1.12,
        duration: 0.6,
        ease: 'power3.out',
      });

      // Show close hint
      const label = labelRefs.current[i];
      if (label) {
        gsap.to(label.querySelector('.ps-name'), {
          opacity: 0,
          duration: 0.15,
        });
        gsap.to(label.querySelector('.ps-close'), {
          opacity: 1,
          duration: 0.25,
          delay: 0.1,
        });
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{
        background: '#0e0e14',
        padding: 'clamp(20px, 4%, 36px)',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 'clamp(14px, 3%, 24px)' }}
      >
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
          IMAGE GALLERY
        </span>
        <span
          className="font-mono"
          style={{ fontSize: '9px', color: '#303040', letterSpacing: '0.1em' }}
        >
          {isTouch.current ? 'TAP TO EXPAND' : 'HOVER · CLICK TO EXPAND'}
        </span>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(6px, 1.5%, 10px)',
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
              aspectRatio: i % 3 === 1 ? '3/4' : '4/5',
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
            {/* Clip wrapper for reveal animation */}
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

              {/* Overlay gradient */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(6,6,8,0.7) 0%, transparent 50%)',
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* Scan line effect on reveal */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to bottom, rgba(124,58,237,0.06), transparent)',
                pointerEvents: 'none',
                mixBlendMode: 'screen',
              }}
            />

            {/* Label */}
            <div
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              className="absolute bottom-0 left-0 right-0 flex items-end justify-between"
              style={{ padding: 'clamp(8px, 2%, 12px)', pointerEvents: 'none' }}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="font-mono ps-tag"
                  style={{
                    fontSize: '8px',
                    color: '#7c3aed',
                    letterSpacing: '0.1em',
                  }}
                >
                  {img.tag}
                </span>
                <span
                  className="font-syne font-bold ps-name"
                  style={{
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                    color: '#f0ede8',
                  }}
                >
                  {img.label}
                </span>
                <span
                  className="font-mono ps-close"
                  style={{ fontSize: '8px', color: '#a78bfa', opacity: 0 }}
                >
                  ✕ close
                </span>
              </div>
            </div>

            {/* Active border glow */}
            {activeId === img.id && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: '1px solid rgba(124,58,237,0.6)',
                  borderRadius: 8,
                  pointerEvents: 'none',
                  boxShadow: '0 0 20px rgba(124,58,237,0.2) inset',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Bottom hint */}
      <div
        className="flex justify-center"
        style={{ marginTop: 'clamp(10px, 2%, 16px)' }}
      >
        <span
          className="font-mono"
          style={{ fontSize: '8px', color: '#252535', letterSpacing: '0.15em' }}
        >
          KINETIC UI — IMAGE COMPONENT
        </span>
      </div>
    </div>
  );
};

export default ImageRevealGrid;

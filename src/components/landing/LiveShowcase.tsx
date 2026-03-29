import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollRevealChildren } from '@/hooks/useScrollReveal';

// Import live components
import AuroraBackground from '@/components/ui-showcase/components/backgrounds/AuroraBackground';
import TextReveal from '@/components/ui-showcase/components/text/TextReveal';
import CountingNumbers from '@/components/ui-showcase/components/text/CountingNumbers';
import ImageStackReveal from '@/components/ui-showcase/components/images/ImageStackReveal';
import OrbitLoader from '@/components/ui-showcase/components/loaders/OrbitLoader';
import ParticleField from '@/components/ui-showcase/components/backgrounds/ParticleField';
import GradientText from '@/components/ui-showcase/components/text/GradientText';
import PulseRingLoader from '@/components/ui-showcase/components/loaders/PulseRingLoader';
import TextProgressLoader from '@/components/ui-showcase/components/loaders/TextProgressLoader';
import DNAStrandLoader from '@/components/ui-showcase/components/loaders/DNAStrandLoader';

const MarqueeInline = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML += el.innerHTML;
    const tween = gsap.to(el, { xPercent: -50, duration: 12, repeat: -1, ease: 'none' });
    return () => { tween.kill(); };
  }, []);
  return (
    <div className="w-full overflow-hidden">
      <div ref={ref} className="flex w-max whitespace-nowrap">
        <span className="font-syne font-bold text-xl mr-4" style={{ color: '#f0ede8' }}>
          GSAP · REACT · MOTION · KINETIC UI ·&nbsp;
        </span>
      </div>
    </div>
  );
};

const allCells = [
  { span: 'col-span-2 row-span-2', name: 'Aurora Background', cat: 'backgrounds', Component: AuroraBackground, mobileShow: true },
  { span: 'col-span-1 row-span-1', name: 'Text Reveal', cat: 'text', Component: TextReveal, mobileShow: false },
  { span: 'col-span-1 row-span-1', name: 'Counting Numbers', cat: 'text', Component: CountingNumbers, mobileShow: false },
  { span: 'col-span-1 row-span-1', name: 'Image Stack Reveal', cat: 'images', Component: ImageStackReveal, mobileShow: true, interactive: true },
  { span: 'col-span-1 row-span-1', name: 'DNA Strand', cat: 'loaders', Component: DNAStrandLoader, mobileShow: false },
  { span: 'col-span-2 row-span-1', name: 'Marquee', cat: 'scroll', Component: null, isMarquee: true, mobileShow: false },
  { span: 'col-span-1 row-span-1', name: 'Text Progress Loader', cat: 'loaders', Component: TextProgressLoader, mobileShow: false },
  { span: 'col-span-1 row-span-1', name: 'Orbit Loader', cat: 'loaders', Component: OrbitLoader, mobileShow: true },
  { span: 'col-span-2 row-span-1', name: 'Particle Field', cat: 'backgrounds', Component: ParticleField, mobileShow: true },
  { span: 'col-span-1 row-span-1', name: 'Gradient Text', cat: 'text', Component: GradientText, mobileShow: true },
  { span: 'col-span-1 row-span-1', name: 'Pulse Ring', cat: 'loaders', Component: PulseRingLoader, mobileShow: false },
];

const LiveShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const viewAllRef = useRef<HTMLButtonElement>(null);
  const scrollStripRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const mobileCells = allCells.filter(c => c.mobileShow);

  // Heading clip-path reveal
  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const words = el.querySelectorAll('.sh-word');
    gsap.set(el, { clipPath: 'inset(0 100% 0 0)' });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(el, {
              clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power4.out',
              onComplete: () => {
                words.forEach((word, i) => {
                  gsap.fromTo(word, { color: '#404050' }, {
                    color: '#f0ede8', duration: 0.4, delay: i * 0.12, ease: 'power2.out',
                  });
                });
              },
            });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    const safety = setTimeout(() => { gsap.set(el, { clipPath: 'inset(0 0% 0 0)' }); gsap.set(words, { color: '#f0ede8' }); }, 4000);
    return () => { observer.disconnect(); clearTimeout(safety); };
  }, []);

  // Grid cells reveal
  useScrollRevealChildren(containerRef, '.showcase-cell', { y: 30, stagger: 0.05 });

  // View all reveal
  useEffect(() => {
    const el = viewAllRef.current;
    if (!el) return;
    gsap.set(el, { opacity: 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(el, { opacity: 1, duration: 0.5, delay: 0.4, ease: 'power2.out' });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    const safety = setTimeout(() => { gsap.set(el, { opacity: 1 }); }, 5000);
    return () => { observer.disconnect(); clearTimeout(safety); };
  }, []);

  // Mobile dots animated width
  useEffect(() => {
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return;
      if (i === activeIndex) {
        gsap.to(dot, { width: 18, borderRadius: 3, background: '#7c3aed', duration: 0.3, ease: 'power2.out' });
      } else {
        gsap.to(dot, { width: 6, borderRadius: '50%', background: '#222235', duration: 0.3, ease: 'power2.out' });
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    if (!isMobile || !scrollStripRef.current) return;
    const cards = scrollStripRef.current.querySelectorAll('.mobile-showcase-card');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            setActiveIndex(idx);
          }
        });
      },
      { root: scrollStripRef.current, threshold: 0.6 }
    );
    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [isMobile]);

  // Cell hover
  const handleCellEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    gsap.to(el, { y: -2, duration: 0.2 });
    el.style.borderColor = 'rgba(124,58,237,0.3)';
    el.style.background = '#1c1c2a';
    el.style.boxShadow = 'inset 0 0 30px rgba(124,58,237,0.04)';
    const arrow = el.querySelector('.cell-arrow');
    if (arrow) gsap.to(arrow, { x: 4, duration: 0.2 });
    const dot = el.querySelector('.cell-dot');
    if (dot) gsap.to(dot, { opacity: 1, scale: 1, duration: 0.2 });
  };

  const handleCellLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    gsap.to(el, { y: 0, duration: 0.2 });
    el.style.borderColor = '#222235';
    el.style.background = '#151520';
    el.style.boxShadow = 'none';
    const arrow = el.querySelector('.cell-arrow');
    if (arrow) gsap.to(arrow, { x: 0, duration: 0.2 });
    const dot = el.querySelector('.cell-dot');
    if (dot) gsap.to(dot, { opacity: 0, scale: 0, duration: 0.2 });
  };

  const renderCell = (cell: typeof allCells[0], i: number) => (
    <div
      key={i}
      className={`showcase-cell ${!isMobile ? cell.span : ''} relative overflow-hidden rounded-lg cursor-pointer group`}
      style={{ background: '#151520', border: '1px solid #222235', minHeight: 160 }}
      onClick={() => navigate(`/components?category=${cell.cat}`)}
      onMouseEnter={handleCellEnter}
      onMouseLeave={handleCellLeave}
    >
      <div className="w-full h-full flex items-center justify-center overflow-hidden" style={{ minHeight: 'inherit' }}>
        {cell.isMarquee ? (
          <MarqueeInline />
        ) : cell.Component ? (
          <div className={`${cell.interactive ? '' : 'pointer-events-none'} w-full h-full flex items-center justify-center`} style={{ transform: cell.span.includes('row-span-2') ? 'scale(0.85)' : 'none' }}>
            <cell.Component />
          </div>
        ) : null}
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 ${isMobile ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'} transition-transform duration-200`}
        style={{ height: 36, background: 'rgba(14,14,20,0.9)', backdropFilter: 'blur(8px)', borderTop: '1px solid #1a1a2a' }}
      >
        <span className="font-mono text-[10px]" style={{ color: '#a78bfa' }}>{cell.name}</span>
        <span className="font-mono text-[10px] flex items-center gap-1.5" style={{ color: '#686878' }}>
          <span className="cell-dot rounded-full" style={{ width: 4, height: 4, background: '#7c3aed', opacity: 0, transform: 'scale(0)' }} />
          <span className="cell-arrow inline-block">View →</span>
        </span>
      </div>
    </div>
  );

  return (
    <section ref={containerRef} className="pt-8 pb-16 md:py-24 px-5 md:px-10" style={{ background: '#0e0e14' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block font-mono text-[11px] tracking-[0.15em] uppercase mb-3 px-3 py-1 rounded"
            style={{ color: '#c4b5fd', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            COMPONENTS
          </span>
          <h2 ref={headingRef} className="font-syne font-extrabold" style={{ fontSize: 'clamp(1.8rem, 6vw, 3.2rem)', color: '#f0ede8' }}>
            {['See', 'them', 'in', 'action.'].map((word, i) => (
              <span key={i} className="sh-word" style={{ color: '#404050' }}>
                {word}{i < 3 ? ' ' : ''}
              </span>
            ))}
          </h2>
          <p className="font-inter font-light mt-3 mx-auto" style={{ fontSize: 15, color: '#707080', maxWidth: 400 }}>
            Every component live. Every animation real. Click any to explore.
          </p>
        </div>

        {isMobile ? (
          <>
            <div
              ref={scrollStripRef}
              className="flex gap-3 overflow-x-auto pb-4"
              style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
            >
              {mobileCells.map((cell, i) => (
                <div
                  key={i}
                  data-index={i}
                  className="mobile-showcase-card flex-shrink-0 relative overflow-hidden rounded-lg cursor-pointer"
                  style={{
                    width: '80vw', height: 200, background: '#151520', border: '1px solid #222235',
                    scrollSnapAlign: 'center',
                  }}
                  onClick={() => navigate(`/components?category=${cell.cat}`)}
                >
                  <div className="w-full h-full flex items-center justify-center overflow-hidden">
                    {cell.Component && (
                      <div className="pointer-events-none w-full h-full flex items-center justify-center">
                        <cell.Component />
                      </div>
                    )}
                  </div>
                  <div
                    className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3"
                    style={{ height: 36, background: 'rgba(14,14,20,0.9)', backdropFilter: 'blur(8px)', borderTop: '1px solid #1a1a2a' }}
                  >
                    <span className="font-mono text-[10px]" style={{ color: '#a78bfa' }}>{cell.name}</span>
                    <span className="font-mono text-[10px]" style={{ color: '#686878' }}>View →</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
              {mobileCells.map((_, i) => (
                <div
                  key={i}
                  ref={el => { dotRefs.current[i] = el; }}
                  style={{
                    width: i === 0 ? 18 : 6,
                    height: 6,
                    background: i === 0 ? '#7c3aed' : '#222235',
                    borderRadius: i === 0 ? 3 : '50%',
                    transition: 'none',
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {allCells.map((cell, i) => renderCell(cell, i))}
          </div>
        )}

        <div className="text-center mt-10">
          <button
            ref={viewAllRef}
            className="font-inter text-[14px]"
            style={{ color: '#7c3aed', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => navigate('/components')}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#a78bfa'; (e.currentTarget as HTMLElement).style.textDecoration = 'underline'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#7c3aed'; (e.currentTarget as HTMLElement).style.textDecoration = 'none'; }}
          >
            View all 60+ components →
          </button>
        </div>
      </div>
    </section>
  );
};

export default LiveShowcase;

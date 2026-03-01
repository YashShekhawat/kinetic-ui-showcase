import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '@/hooks/use-mobile';

// Import live components
import AuroraBackground from '@/components/ui-showcase/AuroraBackground';
import TextReveal from '@/components/ui-showcase/TextReveal';
import CountingNumbers from '@/components/ui-showcase/CountingNumbers';
import ImageStackReveal from '@/components/ui-showcase/ImageStackReveal';
import OrbitLoader from '@/components/ui-showcase/OrbitLoader';
import ParticleField from '@/components/ui-showcase/ParticleField';
import GradientText from '@/components/ui-showcase/GradientText';
import PulseRingLoader from '@/components/ui-showcase/PulseRingLoader';
import TextProgressLoader from '@/components/ui-showcase/TextProgressLoader';
import DNAStrandLoader from '@/components/ui-showcase/DNAStrandLoader';

gsap.registerPlugin(ScrollTrigger);

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
  const scrollStripRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);

  const mobileCells = allCells.filter(c => c.mobileShow);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(headingRef.current, { clipPath: 'inset(0 100% 0 0)' }, {
          clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power4.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true },
        });
      }

      gsap.utils.toArray<HTMLElement>('.showcase-cell').forEach((cell, i) => {
        gsap.fromTo(cell, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.5, delay: i * 0.05, ease: 'power2.out',
          scrollTrigger: { trigger: cell, start: 'top 80%', once: true },
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, [isMobile]);

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

  const renderCell = (cell: typeof allCells[0], i: number) => (
    <div
      key={i}
      className={`showcase-cell ${!isMobile ? cell.span : ''} opacity-0 relative overflow-hidden rounded-lg cursor-pointer group`}
      style={{ background: '#151520', border: '1px solid #222235', minHeight: 160 }}
      onClick={() => navigate(`/components?category=${cell.cat}`)}
      onMouseEnter={e => {
        gsap.to(e.currentTarget, { y: -2, duration: 0.2 });
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.3)';
        (e.currentTarget as HTMLElement).style.background = '#1c1c2a';
      }}
      onMouseLeave={e => {
        gsap.to(e.currentTarget, { y: 0, duration: 0.2 });
        (e.currentTarget as HTMLElement).style.borderColor = '#222235';
        (e.currentTarget as HTMLElement).style.background = '#151520';
      }}
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
        <span className="font-mono text-[10px]" style={{ color: '#686878' }}>View →</span>
      </div>
    </div>
  );

  return (
    <section ref={containerRef} className="py-16 md:py-24 px-5 md:px-10" style={{ background: '#0e0e14' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block font-mono text-[11px] tracking-[0.15em] uppercase mb-3 px-3 py-1 rounded"
            style={{ color: '#c4b5fd', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            COMPONENTS
          </span>
          <h2 ref={headingRef} className="font-syne font-extrabold" style={{ fontSize: 'clamp(1.8rem, 6vw, 3.2rem)', color: '#f0ede8' }}>
            See them in action.
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
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: activeIndex === i ? 16 : 6,
                    height: 6,
                    background: activeIndex === i ? '#7c3aed' : '#222235',
                    borderRadius: activeIndex === i ? 3 : '50%',
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
      </div>
    </section>
  );
};

export default LiveShowcase;

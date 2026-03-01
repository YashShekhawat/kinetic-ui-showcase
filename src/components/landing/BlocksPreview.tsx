import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

// Import block components for miniature previews
import CinematicHero from '@/components/ui-showcase/CinematicHero';
import BentoGridSection from '@/components/ui-showcase/BentoGridSection';
import TestimonialTicker from '@/components/ui-showcase/TestimonialTicker';
import ProcessStepsAccordion from '@/components/ui-showcase/ProcessStepsAccordion';
import PricingCards from '@/components/ui-showcase/PricingCards';
import MarqueeStatementSection from '@/components/ui-showcase/MarqueeStatementSection';
import FeatureListReveal from '@/components/ui-showcase/FeatureListReveal';
import CinematicTextImageReveal from '@/components/ui-showcase/CinematicTextImageReveal';

const blockPreviews = [
  { name: 'Bento Grid', Component: BentoGridSection },
  { name: 'Pricing Cards', Component: PricingCards },
  { name: 'Testimonial Ticker', Component: TestimonialTicker },
  { name: 'Steps Accordion', Component: ProcessStepsAccordion },
  { name: 'Cinematic Hero', Component: CinematicHero },
  { name: 'Marquee Statement', Component: MarqueeStatementSection },
  { name: 'Feature List', Component: FeatureListReveal },
  { name: 'Cinematic Split', Component: CinematicTextImageReveal },
];

const BlocksPreview = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.style.cursor = 'grabbing';
    };
    const onUp = () => { isDown = false; el.style.cursor = 'grab'; };
    const onMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft - (x - startX);
    };

    el.addEventListener('mousedown', onDown);
    el.addEventListener('mouseup', onUp);
    el.addEventListener('mouseleave', onUp);
    el.addEventListener('mousemove', onMove);
    return () => {
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('mouseup', onUp);
      el.removeEventListener('mouseleave', onUp);
      el.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <section className="py-24" style={{ background: '#060608' }}>
      {/* Header */}
      <div className="px-10 mb-16 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="font-mono text-[11px] tracking-[0.15em] uppercase px-3 py-1 rounded"
            style={{ color: '#a78bfa', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}>
            BLOCKS
          </span>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded"
            style={{ color: '#7c3aed', border: '1px solid rgba(124,58,237,0.3)' }}>
            PRO
          </span>
        </div>
        <h2 className="font-syne font-extrabold" style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: '#ededed' }}>
          Full page sections.
        </h2>
        <p className="font-inter font-light mt-3 mx-auto" style={{ fontSize: 15, color: '#606070', maxWidth: 400 }}>
          Production-ready animated sections for your next project.
        </p>
      </div>

      {/* Scroll strip */}
      <div
        ref={scrollRef}
        className="flex gap-4 px-10 overflow-x-auto"
        style={{ scrollbarWidth: 'none', cursor: 'grab' }}
      >
        {blockPreviews.map((block, i) => (
          <div
            key={i}
            className="flex-shrink-0 relative overflow-hidden rounded-lg cursor-pointer"
            style={{ width: 320, height: 220, background: '#0a0a12', border: '1px solid #1a1a2e' }}
            onClick={() => navigate('/blocks')}
            onMouseEnter={e => {
              gsap.to(e.currentTarget, { y: -3, borderColor: 'rgba(124,58,237,0.3)', duration: 0.2 });
            }}
            onMouseLeave={e => {
              gsap.to(e.currentTarget, { y: 0, borderColor: '#1a1a2e', duration: 0.2 });
            }}
          >
            {/* Miniature preview */}
            <div className="pointer-events-none origin-top-left" style={{ transform: 'scale(0.35)', width: `${100 / 0.35}%` }}>
              <block.Component />
            </div>

            {/* Overlay bar */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-3.5 pb-2.5"
              style={{ height: 48, background: 'linear-gradient(to top, #0a0a12, transparent)' }}>
              <span className="font-syne font-semibold text-[12px]" style={{ color: '#ededed' }}>{block.name}</span>
              <span className="font-mono text-[9px] px-2 py-0.5 rounded"
                style={{ color: '#7c3aed', border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.08)' }}>
                PRO
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-10 px-10">
        <button
          onClick={() => navigate('/blocks')}
          className="inline-flex font-syne font-bold text-lg px-6 py-3 rounded-md"
          style={{ color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.06)' }}
          onMouseEnter={e => {
            gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 });
            (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.1)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.35)';
          }}
          onMouseLeave={e => {
            gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
            (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.06)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.2)';
          }}
        >
          Unlock all blocks →
        </button>
      </div>
    </section>
  );
};

export default BlocksPreview;

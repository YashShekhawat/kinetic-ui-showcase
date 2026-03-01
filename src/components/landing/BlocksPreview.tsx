import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onDown = (e: MouseEvent) => { isDown = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; el.style.cursor = 'grabbing'; };
    const onUp = () => { isDown = false; el.style.cursor = 'grab'; };
    const onMove = (e: MouseEvent) => { if (!isDown) return; e.preventDefault(); const x = e.pageX - el.offsetLeft; el.scrollLeft = scrollLeft - (x - startX); };

    el.addEventListener('mousedown', onDown);
    el.addEventListener('mouseup', onUp);
    el.addEventListener('mouseleave', onUp);
    el.addEventListener('mousemove', onMove);
    return () => { el.removeEventListener('mousedown', onDown); el.removeEventListener('mouseup', onUp); el.removeEventListener('mouseleave', onUp); el.removeEventListener('mousemove', onMove); };
  }, []);

  const cardW = isMobile ? 260 : 320;
  const cardH = isMobile ? 180 : 220;
  const previewScale = isMobile ? 0.28 : 0.35;

  return (
    <section className="py-16 md:py-24" style={{ background: '#0e0e14' }}>
      <div className="px-5 md:px-10 mb-16 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="font-mono text-[11px] tracking-[0.15em] uppercase px-3 py-1 rounded"
            style={{ color: '#c4b5fd', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            BLOCKS
          </span>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded"
            style={{ color: '#7c3aed', border: '1px solid rgba(124,58,237,0.3)' }}>
            PRO
          </span>
        </div>
        <h2 className="font-syne font-extrabold" style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)', color: '#f0ede8' }}>
          Full page sections.
        </h2>
        <p className="font-inter font-light mt-3 mx-auto" style={{ fontSize: 15, color: '#707080', maxWidth: 400 }}>
          Production-ready animated sections for your next project.
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 px-5 md:px-10 overflow-x-auto"
        style={{ scrollbarWidth: 'none', cursor: 'grab' }}
      >
        {blockPreviews.map((block, i) => (
          <div
            key={i}
            className="flex-shrink-0 relative overflow-hidden rounded-lg cursor-pointer"
            style={{ width: cardW, height: cardH, background: '#151520', border: '1px solid #222235' }}
            onClick={() => navigate('/blocks')}
            onMouseEnter={e => {
              gsap.to(e.currentTarget, { y: -3, duration: 0.2 });
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.3)';
              (e.currentTarget as HTMLElement).style.background = '#1c1c2a';
            }}
            onMouseLeave={e => {
              gsap.to(e.currentTarget, { y: 0, duration: 0.2 });
              (e.currentTarget as HTMLElement).style.borderColor = '#222235';
              (e.currentTarget as HTMLElement).style.background = '#151520';
            }}
          >
            <div className="pointer-events-none origin-top-left" style={{ transform: `scale(${previewScale})`, width: `${100 / previewScale}%` }}>
              <block.Component />
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-3.5 pb-2.5"
              style={{ height: 48, background: 'linear-gradient(to top, #151520, transparent)' }}>
              <span className="font-syne font-semibold text-[12px]" style={{ color: '#f0ede8' }}>{block.name}</span>
              <span className="font-mono text-[9px] px-2 py-0.5 rounded"
                style={{ color: '#7c3aed', border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.08)' }}>
                PRO
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10 px-5 md:px-10">
        <button
          onClick={() => navigate('/blocks')}
          className="font-syne font-bold text-lg px-6 py-3 rounded-md w-full sm:w-auto inline-flex justify-center"
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

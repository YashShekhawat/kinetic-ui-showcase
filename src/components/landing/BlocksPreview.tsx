import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '@/hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

import CinematicHero from '@/components/ui-showcase/blocks/hero/CinematicHero';
import BentoGridSection from '@/components/ui-showcase/blocks/features/BentoGridSection';
import TestimonialTicker from '@/components/ui-showcase/blocks/social-proof/TestimonialTicker';
import ProcessStepsAccordion from '@/components/ui-showcase/blocks/process/ProcessStepsAccordion';
import PricingCards from '@/components/ui-showcase/blocks/pricing/PricingCards';
import MarqueeStatementSection from '@/components/ui-showcase/blocks/content/MarqueeStatementSection';
import FeatureListReveal from '@/components/ui-showcase/blocks/features/FeatureListReveal';
import CinematicTextImageReveal from '@/components/ui-showcase/blocks/content/CinematicTextImageReveal';

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
  const progressRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  // Section entrance animation
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current!, { opacity: 0, y: 32 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 95%', once: true },
      });
    });
    return () => ctx.revert();
  }, []);

  const updateProgress = useCallback(() => {
    const el = scrollRef.current;
    const fill = progressRef.current;
    if (!el || !fill) return;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = max > 0 ? el.scrollLeft / max : 0;
    gsap.set(fill, { scaleX: Math.max(0.01, ratio) });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onDown = (e: MouseEvent) => { isDown = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; el.style.cursor = 'grabbing'; };
    const onUp = () => { isDown = false; el.style.cursor = 'grab'; };
    const onMove = (e: MouseEvent) => { if (!isDown) return; e.preventDefault(); const x = e.pageX - el.offsetLeft; el.scrollLeft = scrollLeft - (x - startX); updateProgress(); };
    const onScroll = () => updateProgress();

    el.addEventListener('mousedown', onDown);
    el.addEventListener('mouseup', onUp);
    el.addEventListener('mouseleave', onUp);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('scroll', onScroll);
    updateProgress();
    return () => { el.removeEventListener('mousedown', onDown); el.removeEventListener('mouseup', onUp); el.removeEventListener('mouseleave', onUp); el.removeEventListener('mousemove', onMove); el.removeEventListener('scroll', onScroll); };
  }, [updateProgress]);

  const cardW = isMobile ? 260 : 320;
  const cardH = isMobile ? 180 : 220;
  const previewScale = isMobile ? 0.28 : 0.35;

  const handleCardEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const preview = card.querySelector('.block-preview-inner') as HTMLElement;
    const overlay = card.querySelector('.block-overlay') as HTMLElement;
    gsap.to(card, { y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', duration: 0.3 });
    card.style.borderColor = 'rgba(124,58,237,0.3)';
    card.style.background = '#1c1c2a';
    if (preview) gsap.to(preview, { scale: 0.38, duration: 0.3 });
    if (overlay) gsap.to(overlay, { opacity: 0.7, duration: 0.3 });
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const preview = card.querySelector('.block-preview-inner') as HTMLElement;
    const overlay = card.querySelector('.block-overlay') as HTMLElement;
    gsap.to(card, { y: 0, boxShadow: 'none', duration: 0.3 });
    card.style.borderColor = '#222235';
    card.style.background = '#151520';
    if (preview) gsap.to(preview, { scale: previewScale, duration: 0.3 });
    if (overlay) gsap.to(overlay, { opacity: 1, duration: 0.3 });
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-24 opacity-0" style={{ background: '#0e0e14' }}>
      <div className="px-5 md:px-10 mb-16 text-center">
        {/* CHANGE 1 — Eyebrow badge above heading */}
        <div className="mb-3">
          <span className="font-mono uppercase px-2.5 py-1 rounded"
            style={{ fontSize: 9, letterSpacing: '0.2em', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.06)' }}>
            FULL PAGE SECTIONS
          </span>
        </div>
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
            onMouseEnter={handleCardEnter}
            onMouseLeave={handleCardLeave}
          >
            {/* CHANGE 2 — Preview with animated scale */}
            <div className="block-preview-inner pointer-events-none origin-top-left" style={{ transform: `scale(${previewScale})`, width: `${100 / previewScale}%` }}>
              <block.Component />
            </div>

            <div className="block-overlay absolute bottom-0 left-0 right-0 flex items-end justify-between px-3.5 pb-2.5"
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

      {/* CHANGE 3 — Progress bar */}
      <div className="px-5 md:px-10 mt-4">
        <div style={{ width: '100%', height: 2, background: '#1a1a2a', borderRadius: 1 }}>
          <div
            ref={progressRef}
            style={{
              width: '100%', height: '100%', borderRadius: 1,
              background: 'linear-gradient(to right, #7c3aed, #a78bfa)',
              transformOrigin: 'left', transform: 'scaleX(0.01)',
            }}
          />
        </div>
      </div>

      {/* CHANGE 4 — Shimmer CTA button */}
      <div className="text-center mt-10 px-5 md:px-10">
        <button
          onClick={() => navigate('/blocks')}
          className="font-syne font-bold text-lg px-6 py-3 rounded-md w-full sm:w-auto inline-flex justify-center relative overflow-hidden"
          style={{ color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.06)' }}
          onMouseEnter={e => {
            gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 });
            (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.1)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.35)';
            const shimmer = e.currentTarget.querySelector('.shimmer-sweep') as HTMLElement;
            if (shimmer) gsap.fromTo(shimmer, { x: '-200%' }, { x: '200%', duration: 0.6, ease: 'power1.inOut' });
          }}
          onMouseLeave={e => {
            gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
            (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.06)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.2)';
          }}
        >
          <span className="shimmer-sweep absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
          }} />
          <span className="relative z-10">Unlock all blocks →</span>
        </button>
      </div>
    </section>
  );
};

export default BlocksPreview;

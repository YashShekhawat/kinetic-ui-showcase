import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import Marquee from '../ui-showcase/components/scroll/Marquee';
import ScrollProgressBar from '../ui-showcase/components/scroll/ScrollProgressBar';
import StickyScrollReveal from '../ui-showcase/components/scroll/StickyScrollReveal';

const scrollComponents = [
  {
    name: 'Smooth Marquee',
    component: <Marquee />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Marquee = () => {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r1 = row1Ref.current!;
    const r2 = row2Ref.current!;
    r1.innerHTML += r1.innerHTML;
    r2.innerHTML += r2.innerHTML;

    const tl1 = gsap.to(r1, { xPercent: -50, duration: 15, repeat: -1, ease: 'none' });
    const tl2 = gsap.fromTo(r2, { xPercent: -50 }, { xPercent: 0, duration: 20, repeat: -1, ease: 'none' });

    const c = containerRef.current!;
    const pause = () => { tl1.timeScale(0); tl2.timeScale(0); };
    const play = () => { gsap.to(tl1, { timeScale: 1, duration: 0.5 }); gsap.to(tl2, { timeScale: 1, duration: 0.5 }); };
    c.addEventListener('mouseenter', pause);
    c.addEventListener('mouseleave', play);

    return () => {
      tl1.kill(); tl2.kill();
      c.removeEventListener('mouseenter', pause);
      c.removeEventListener('mouseleave', play);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-hidden space-y-4">
      <div ref={row1Ref} className="flex w-max whitespace-nowrap">
        <span className="font-syne font-bold text-xl text-[#ededed] mr-4">
          KINETIC UI · GSAP · REACT · MOTION ·&nbsp;
        </span>
      </div>
      <div ref={row2Ref} className="flex w-max whitespace-nowrap">
        <span className="font-mono text-[11px] text-[#a0a0b0] tracking-[0.2em] mr-4">
          COMPONENTS · ANIMATIONS · OPEN SOURCE ·&nbsp;
        </span>
      </div>
    </div>
  );
};

export default Marquee;`,
  },
  {
    name: 'Sticky Scroll Reveal',
    component: <StickyScrollReveal />,
    code: `import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const items = [
  { title: 'Design', desc: 'Craft beautiful interfaces with intention and precision.' },
  { title: 'Develop', desc: 'Build with modern tools and frameworks that scale.' },
  { title: 'Animate', desc: 'Add motion that feels natural and purposeful.' },
  { title: 'Ship', desc: 'Deploy with confidence and iterate quickly.' },
];

const StickyScrollReveal = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.ssr-item').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveIndex(i),
          onEnterBack: () => setActiveIndex(i),
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-2 gap-8 min-h-[400px]">
      <div className="sticky top-32 h-fit">
        <div className="overflow-hidden">
          <h3 key={activeIndex} className="font-syne font-extrabold text-4xl text-[#ededed]"
            style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
            {items[activeIndex]?.title}
          </h3>
        </div>
        <p className="font-inter font-light text-sm text-[#a0a0b0] mt-3">
          {items[activeIndex]?.desc}
        </p>
        <style>{\`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(20px); clip-path: inset(0 0 100% 0); }
            to { opacity: 1; transform: translateY(0); clip-path: inset(0 0 0% 0); }
          }
        \`}</style>
      </div>
      <div className="flex flex-col gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="ssr-item p-6 rounded-lg min-h-[160px] transition-colors"
            style={{
              background: activeIndex === i ? '#0f0f0f' : '#0a0a0a',
              border: \`1px solid \${activeIndex === i ? 'rgba(124,58,237,0.2)' : '#1a1a1a'}\`,
            }}
          >
            <span className="font-mono text-[11px] text-[#7c3aed]">{String(i + 1).padStart(2, '0')}</span>
            <h4 className="font-inter font-semibold text-[#ededed] mt-2">{item.title}</h4>
            <p className="font-inter font-light text-sm text-[#a0a0b0] mt-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StickyScrollReveal;`,
  },
  {
    name: 'Scroll Progress Bar',
    component: <ScrollProgressBar />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollProgressBar = () => {
  const bar1Ref = useRef<HTMLDivElement>(null);
  const bar2Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bar1Ref.current!, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current!,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
      gsap.to(bar2Ref.current!, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current!,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full space-y-8">
      <div>
        <span className="font-mono text-[11px] text-[#a0a0b0] mb-2 block">Accent / 2px</span>
        <div className="w-full h-[2px] rounded-full overflow-hidden" style={{ background: '#1a1a2e' }}>
          <div ref={bar1Ref} className="h-full origin-left" style={{ background: '#7c3aed', transform: 'scaleX(0.3)' }} />
        </div>
      </div>
      <div>
        <span className="font-mono text-[11px] text-[#a0a0b0] mb-2 block">Gradient / 4px</span>
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: '#1a1a2e' }}>
          <div
            ref={bar2Ref}
            className="h-full origin-left"
            style={{
              background: 'linear-gradient(90deg, #7c3aed, #a78bfa, #e879f9)',
              transform: 'scaleX(0.6)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScrollProgressBar;`,
  },
];

const ScrollSection = () => (
  <section id="scroll" className="py-24">
    <SectionHeader label="SCROLL" heading="Scroll-Driven Motion" />
    <div className="grid grid-cols-1 gap-6">
      {scrollComponents.map(c => (
        <ComponentCard key={c.name} name={c.name} code={c.code} category="scroll">
          {c.component}
        </ComponentCard>
      ))}
    </div>
  </section>
);

export default ScrollSection;

import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import CinematicHero from '../ui-showcase/CinematicHero';
import SplitHero from '../ui-showcase/SplitHero';
import MinimalHero from '../ui-showcase/MinimalHero';

const heroComponents = [
  {
    name: 'Cinematic Hero',
    component: <CinematicHero />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CinematicHero = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2, defaults: { ease: 'power4.out' } });
      tl.fromTo('.ch-badge', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4 });
      tl.fromTo('.ch-line', { y: '100%' }, { y: '0%', duration: 0.7, stagger: 0.1 }, '-=0.2');
      tl.fromTo('.ch-sub', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');
      tl.fromTo('.ch-btn', { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 }, '-=0.2');
      tl.to({}, { duration: 2 });
      tl.to(['.ch-badge', '.ch-sub', '.ch-btn'], { opacity: 0, y: -10, duration: 0.4 });
      tl.to('.ch-line', { y: '-100%', duration: 0.5, stagger: 0.05 }, '-=0.2');
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="relative w-full h-full min-h-[400px] flex items-center justify-center text-center">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] h-[300px]" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)' }} />
      </div>
      <div className="relative z-10">
        <div className="ch-badge opacity-0 inline-block font-mono text-[10px] text-[#c4b5fd] px-3 py-1 rounded-full mb-4"
          style={{ border: '1px solid rgba(124,58,237,0.25)', background: 'rgba(124,58,237,0.06)' }}>
          ✦ Cinematic
        </div>
        <div className="overflow-hidden"><div className="ch-line font-syne font-extrabold text-2xl text-[#ededed]">Stunning visuals</div></div>
        <div className="overflow-hidden"><div className="ch-line font-syne font-extrabold text-2xl text-[#a78bfa]">for every project.</div></div>
        <p className="ch-sub opacity-0 font-inter font-light text-xs text-[#a0a0b0] mt-3 max-w-[280px] mx-auto">
          Production-ready hero components built with GSAP.
        </p>
        <div className="flex gap-2 mt-4 justify-center">
          <button className="ch-btn opacity-0 font-inter text-xs px-4 py-2 rounded-md text-white" style={{ background: '#7c3aed' }}>Get Started</button>
          <button className="ch-btn opacity-0 font-inter text-xs px-4 py-2 rounded-md text-[#a0a0b0]" style={{ border: '1px solid #1a1a1a' }}>Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default CinematicHero;`,
  },
  {
    name: 'Split Hero',
    component: <SplitHero />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const SplitHero = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
      tl.fromTo('.sh-word', { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power4.out' });
      tl.to('.sh-word', { y: '-100%', opacity: 0, duration: 0.5, stagger: 0.05 }, '+=2');

      gsap.fromTo('.sh-line', { scaleY: 0 }, { scaleY: 1, duration: 1, ease: 'power3.out' });
      gsap.to('.sh-outer', { rotation: 360, duration: 12, repeat: -1, ease: 'none' });
      gsap.to('.sh-inner', { rotation: -360, duration: 8, repeat: -1, ease: 'none' });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="w-full h-full min-h-[400px] flex items-center">
      <div className="flex-1 pr-8">
        {['Build', 'Something', 'Beautiful'].map((w, i) => (
          <div key={i} className="overflow-hidden">
            <span className="sh-word block font-syne font-extrabold text-3xl text-[#ededed]">{w}</span>
          </div>
        ))}
      </div>
      <div className="sh-line w-px h-[200px] origin-top" style={{ background: '#1a1a2e' }} />
      <div className="flex-1 flex items-center justify-center pl-8">
        <div className="sh-outer w-[120px] h-[120px] flex items-center justify-center" style={{ border: '1px solid #1a1a1a' }}>
          <div className="sh-inner w-[60px] h-[60px]" style={{ border: '1px solid rgba(124,58,237,0.4)' }} />
        </div>
      </div>
    </div>
  );
};

export default SplitHero;`,
  },
  {
    name: 'Minimal Hero',
    component: <MinimalHero />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const words = ['DESIGN', 'BUILD', 'SHIP'];

const MinimalHero = () => {
  const wordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let idx = 0;
    const el = wordRef.current!;
    
    const cycle = () => {
      gsap.to(el, {
        y: '-100%',
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.6,
        ease: 'power4.inOut',
        onComplete: () => {
          idx = (idx + 1) % words.length;
          el.textContent = words[idx];
          gsap.set(el, { y: '100%', clipPath: 'inset(100% 0 0 0)' });
          gsap.to(el, { y: '0%', clipPath: 'inset(0% 0 0% 0)', duration: 0.6, ease: 'power4.inOut' });
        },
      });
    };

    const interval = setInterval(cycle, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center">
      <div className="overflow-hidden h-[80px] flex items-center">
        <div ref={wordRef} className="font-syne font-extrabold text-6xl text-[#ededed]">
          DESIGN
        </div>
      </div>
      <p className="font-inter font-light text-sm text-[#a0a0b0] mt-4">
        One word. Infinite possibilities.
      </p>
    </div>
  );
};

export default MinimalHero;`,
  },
];

const HeroComponentsSection = () => (
  <section id="hero" className="py-24">
    <SectionHeader label="HERO" heading="First Impressions, Perfected" />
    <div className="grid grid-cols-1 gap-6">
      {heroComponents.map(c => (
        <ComponentCard key={c.name} name={c.name} code={c.code} category="hero">
          {c.component}
        </ComponentCard>
      ))}
    </div>
  </section>
);

export default HeroComponentsSection;

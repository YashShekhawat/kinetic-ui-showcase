import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import ParallaxImage from '../ui-showcase/ParallaxImage';
import HoverRevealImage from '../ui-showcase/HoverRevealImage';
import InfiniteGallery from '../ui-showcase/InfiniteGallery';
import ImageStackReveal from '../ui-showcase/ImageStackReveal';

const imageComponents = [
  {
    name: 'Parallax Image',
    component: <ParallaxImage />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ParallaxImage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current!, 
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current!, start: 'top 85%', once: true }
        }
      );
      gsap.to(imgRef.current!, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current!,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[300px] rounded-lg overflow-hidden relative" style={{ transform: 'scale(1.15)' }}>
      <div
        ref={imgRef}
        className="absolute inset-0 w-full h-[140%]"
        style={{
          background: 'linear-gradient(135deg, #13131f 0%, #1a1a2e 50%, #7c3aed30 100%)',
        }}
      />
    </div>
  );
};

export default ParallaxImage;`,
  },
  {
    name: 'Hover Reveal Image',
    component: <HoverRevealImage />,
    code: `import { useRef, useState } from 'react';
import gsap from 'gsap';

const items = ['Brand Identity', 'Web Design', 'Motion Graphics', 'Development'];

const HoverRevealImage = () => {
  const imgRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    gsap.to(imgRef.current, {
      x: e.clientX - imgRef.current.parentElement!.getBoundingClientRect().left - 120,
      y: e.clientY - imgRef.current.parentElement!.getBoundingClientRect().top - 80,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const onEnter = () => {
    setVisible(true);
    gsap.to(imgRef.current!, { opacity: 1, scale: 1, duration: 0.3 });
  };

  const onLeave = () => {
    gsap.to(imgRef.current!, { opacity: 0, scale: 0.95, duration: 0.2, onComplete: () => setVisible(false) });
  };

  return (
    <div className="relative w-full" onMouseMove={onMove}>
      <div
        ref={imgRef}
        className="absolute w-[240px] h-[160px] rounded-lg pointer-events-none z-10 opacity-0"
        style={{
          background: 'linear-gradient(135deg, #7c3aed30, #10101a)',
          border: '1px solid #252535',
          transform: 'scale(0.95)',
        }}
      />
      <div className="flex flex-col gap-0">
        {items.map((item, i) => (
          <div
            key={i}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            className="font-syne font-bold text-2xl text-[#ededed] py-4 cursor-pointer hover:text-[#a78bfa] transition-colors"
            style={{ borderBottom: '1px solid #1a1a2e' }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HoverRevealImage;`,
  },
  {
    name: 'Infinite Gallery',
    component: <InfiniteGallery />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const InfiniteGallery = () => {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r1 = row1Ref.current!;
    const r2 = row2Ref.current!;

    r1.innerHTML += r1.innerHTML;
    r2.innerHTML += r2.innerHTML;

    const tl1 = gsap.to(r1, { xPercent: -50, duration: 20, repeat: -1, ease: 'none' });
    const tl2 = gsap.fromTo(r2, { xPercent: -50 }, { xPercent: 0, duration: 25, repeat: -1, ease: 'none' });

    const container = containerRef.current!;
    const onEnter = () => { tl1.pause(); tl2.pause(); };
    const onLeave = () => { tl1.resume(); tl2.resume(); };
    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);

    return () => {
      tl1.kill();
      tl2.kill();
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const items = Array.from({ length: 6 }, (_, i) => (
    <div
      key={i}
      className="flex-shrink-0 w-[200px] h-[140px] rounded-lg flex items-center justify-center font-mono text-sm text-[#a0a0b0] mx-2"
      style={{
        background: 'linear-gradient(135deg, #13131f, #1a1a2e)',
        border: '1px solid #252535',
      }}
    >
      {String(i + 1).padStart(2, '0')}
    </div>
  ));

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div ref={row1Ref} className="flex mb-4 w-max">{items}</div>
      <div ref={row2Ref} className="flex w-max">{items}</div>
    </div>
  );
};

export default InfiniteGallery;`,
  },
  {
    name: 'Image Stack Reveal',
    component: <ImageStackReveal />,
    code: `import { useRef } from 'react';
import gsap from 'gsap';

const ImageStackReveal = () => {
  const cardsRef = useRef<HTMLDivElement>(null);

  const onEnter = () => {
    const cards = cardsRef.current!.children;
    gsap.to(cards[0], { rotation: -15, x: -80, duration: 0.5, ease: 'power3.out' });
    gsap.to(cards[1], { rotation: 0, x: 0, y: -10, duration: 0.5, ease: 'power3.out' });
    gsap.to(cards[2], { rotation: 15, x: 80, duration: 0.5, ease: 'power3.out' });
  };

  const onLeave = () => {
    const cards = cardsRef.current!.children;
    gsap.to(cards[0], { rotation: -3, x: -6, duration: 0.4 });
    gsap.to(cards[1], { rotation: 0, x: 0, y: 0, duration: 0.4 });
    gsap.to(cards[2], { rotation: 3, x: 6, duration: 0.4 });
  };

  return (
    <div
      className="relative w-[240px] h-[200px] cursor-pointer"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div ref={cardsRef} className="relative w-full h-full flex items-center justify-center">
        {[
          { rot: -3, x: -6, bg: 'linear-gradient(135deg, #13131f, #1a1a2e)' },
          { rot: 0, x: 0, bg: 'linear-gradient(135deg, #7c3aed25, #10101a)' },
          { rot: 3, x: 6, bg: 'linear-gradient(135deg, #13131f, #1a1a2e)' },
        ].map((c, i) => (
          <div
            key={i}
            className="absolute w-[160px] h-[120px] rounded-lg"
            style={{
              background: c.bg,
              border: '1px solid #252535',
              transform: \`rotate(\${c.rot}deg) translateX(\${c.x}px)\`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageStackReveal;`,
  },
];

const ImagesSection = () => (
  <section id="images" className="py-24">
    <SectionHeader label="IMAGES" heading="Images That Move" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {imageComponents.map(c => (
        <ComponentCard key={c.name} name={c.name} code={c.code} category="images">
          {c.component}
        </ComponentCard>
      ))}
    </div>
  </section>
);

export default ImagesSection;

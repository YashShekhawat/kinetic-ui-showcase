import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import ParallaxImage from '../ui-showcase/components/images/ParallaxImage';
import HoverRevealImage from '../ui-showcase/components/images/HoverRevealImage';
import InfiniteGallery from '../ui-showcase/components/images/InfiniteGallery';
import ImageStackReveal from '../ui-showcase/components/images/ImageStackReveal';
import ImageRevealGrid from '../ui-showcase/components/images/ImageRevealGrid';
import imageRevealGridCode from '../ui-showcase/components/images/ImageRevealGrid.tsx?raw';

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
  const imgRef = useRef<HTMLImageElement>(null);

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
    <div ref={containerRef} className="w-full h-[300px] rounded-lg overflow-hidden relative">
      {/* Replace src with your own image */}
      <img
        ref={imgRef}
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"
        alt="Mountain landscape"
        className="absolute inset-0 w-full h-[140%] object-cover"
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

// Replace labels and image URLs with your own content
const items = [
  { label: 'Brand Identity', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=480&q=80' },
  { label: 'Web Design', image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=480&q=80' },
  { label: 'Motion Graphics', image: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=480&q=80' },
  { label: 'Development', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=480&q=80' },
];

const HoverRevealImage = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState(items[0].image);

  const onMove = (e: React.MouseEvent) => {
    if (!wrapRef.current) return;
    gsap.to(wrapRef.current, {
      x: e.clientX - wrapRef.current.parentElement!.getBoundingClientRect().left - 120,
      y: e.clientY - wrapRef.current.parentElement!.getBoundingClientRect().top - 80,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const onEnter = (image: string) => {
    setCurrentImage(image);
    gsap.to(wrapRef.current!, { opacity: 1, scale: 1, duration: 0.3 });
  };

  const onLeave = () => {
    gsap.to(wrapRef.current!, { opacity: 0, scale: 0.95, duration: 0.2 });
  };

  return (
    <div className="relative w-full" onMouseMove={onMove}>
      <div
        ref={wrapRef}
        className="absolute w-[240px] h-[160px] rounded-lg pointer-events-none z-10 opacity-0 overflow-hidden"
        style={{ transform: 'scale(0.95)', border: '1px solid #252535' }}
      >
        <img src={currentImage} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col gap-0">
        {items.map((item, i) => (
          <div
            key={i}
            onMouseEnter={() => onEnter(item.image)}
            onMouseLeave={onLeave}
            className="font-bold text-2xl py-4 cursor-pointer transition-colors"
          >
            {item.label}
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

// Replace with your own images
const images = [
  { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80', alt: 'Mountains' },
  { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80', alt: 'Valley' },
  { src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&q=80', alt: 'Forest' },
  { src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80', alt: 'Waterfall' },
  { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80', alt: 'Fog' },
  { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80', alt: 'Trees' },
];

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

  const items = images.map((img, i) => (
    <div
      key={i}
      className="flex-shrink-0 w-[200px] h-[140px] rounded-lg overflow-hidden mx-2"
      style={{ border: '1px solid #252535' }}
    >
      <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
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
import gsap from 'gsap';

// Replace with your own images
const stackImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=320&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=320&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=320&q=80',
];

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
        {stackImages.map((src, i) => (
          <div
            key={i}
            className="absolute w-[160px] h-[120px] rounded-lg overflow-hidden"
            style={{
              border: '1px solid #252535',
              transform: \`rotate(\${[-3, 0, 3][i]}deg) translateX(\${[-6, 0, 6][i]}px)\`,
            }}
          >
            <img src={src} alt={\`Stack image \${i + 1}\`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageStackReveal;`,
  },
  {
    name: 'Image Reveal Grid',
    component: <ImageRevealGrid />,
    code: imageRevealGridCode,
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

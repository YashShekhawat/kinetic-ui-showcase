import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ParallaxImage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Clip-path reveal
      gsap.fromTo(containerRef.current!, 
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current!, start: 'top 85%', once: true }
        }
      );
      // Parallax
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

export default ParallaxImage;

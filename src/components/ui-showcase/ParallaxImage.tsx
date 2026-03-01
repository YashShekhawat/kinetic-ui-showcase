import { useEffect, useRef } from 'react';
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
      <img
        ref={imgRef}
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"
        alt="Mountain landscape"
        className="absolute inset-0 w-full h-[140%] object-cover"
      />
    </div>
  );
};

export default ParallaxImage;

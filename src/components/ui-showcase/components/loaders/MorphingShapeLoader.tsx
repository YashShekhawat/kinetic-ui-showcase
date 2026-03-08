import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const MorphingShapeLoader = () => {
  const shapeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = shapeRef.current;
    if (!el) return;

    const tl = gsap.timeline({ repeat: -1 });

    // Circle
    tl.to(el, { borderRadius: '50%', rotation: 0, clipPath: 'none', duration: 0.5, ease: 'power2.inOut' });
    tl.to({}, { duration: 0.8 });

    // Square
    tl.to(el, { borderRadius: '0%', rotation: '+=90', duration: 0.5, ease: 'power2.inOut' });
    tl.to({}, { duration: 0.8 });

    // Diamond
    tl.to(el, { borderRadius: '0%', rotation: '+=45', duration: 0.5, ease: 'power2.inOut' });
    tl.to({}, { duration: 0.8 });

    // Back to circle
    tl.to(el, { borderRadius: '50%', rotation: '+=85', duration: 0.5, ease: 'power2.inOut' });
    tl.to({}, { duration: 0.8 });

    return () => { tl.kill(); };
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div
        ref={shapeRef}
        className="w-12 h-12"
        style={{ background: '#7c3aed', borderRadius: '50%' }}
      />
    </div>
  );
};

export default MorphingShapeLoader;

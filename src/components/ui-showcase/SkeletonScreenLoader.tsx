import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const SkeletonScreenLoader = () => {
  const shimmerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = shimmerRef.current;
    if (!el) return;
    const tween = gsap.fromTo(el, { x: '-100%' }, { x: '200%', duration: 1.5, ease: 'none', repeat: -1 });
    return () => { tween.kill(); };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg p-5 w-[260px]" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
      <div
        ref={shimmerRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)',
          width: '100%',
        }}
      />
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full" style={{ background: '#1a1a1a' }} />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-3 rounded" style={{ background: '#1a1a1a', width: '70%' }} />
          <div className="h-2.5 rounded" style={{ background: '#1a1a1a', width: '50%' }} />
        </div>
      </div>
      <div className="h-24 rounded mb-3" style={{ background: '#1a1a1a' }} />
      <div className="flex gap-2">
        <div className="h-5 rounded-full" style={{ background: '#1a1a1a', width: 60 }} />
        <div className="h-5 rounded-full" style={{ background: '#1a1a1a', width: 48 }} />
      </div>
    </div>
  );
};

export default SkeletonScreenLoader;

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const text = '60+ Components · Pure GSAP · Zero Dependencies · MIT License · React 18+ · Free Forever · Copy Paste Ready · ';

const MovingStatsBar = () => {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    inner.innerHTML += inner.innerHTML;
    const tw = gsap.to(inner, { xPercent: -50, duration: 40, repeat: -1, ease: 'none' });
    return () => { tw.kill(); };
  }, []);

  return (
    <div className="w-full overflow-hidden" style={{ borderTop: '1px solid #1a1a2e', borderBottom: '1px solid #1a1a2e', background: '#080810', padding: '14px 0' }}>
      <div ref={innerRef} className="flex w-max whitespace-nowrap">
        <span className="font-mono text-[12px] tracking-[0.15em]" style={{ color: '#404055' }}>{text}</span>
      </div>
    </div>
  );
};

export default MovingStatsBar;

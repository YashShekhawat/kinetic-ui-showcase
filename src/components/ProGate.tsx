import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { PRO_CONFIG } from '@/config/proConfig';

interface ProGateProps {
  children: React.ReactNode;
  isPro: boolean;
}

const ProGate = ({ children, isPro }: ProGateProps) => {
  const lockRef = useRef<SVGSVGElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const isLocked = PRO_CONFIG.proModeEnabled && isPro;

  useEffect(() => {
    if (isLocked && lockRef.current) {
      gsap.fromTo(lockRef.current, { scale: 0 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    }
  }, [isLocked]);

  if (!isLocked) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
        style={{
          background: 'rgba(6,6,8,0.85)',
          backdropFilter: 'blur(8px)',
          borderRadius: '0 0 8px 8px',
        }}
      >
        <svg ref={lockRef} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="font-syne font-bold text-base" style={{ color: '#ededed' }}>Pro Component</span>
        <span className="font-inter font-light text-[13px]" style={{ color: '#606070' }}>Unlock all blocks for {PRO_CONFIG.proPrice}</span>
        <button
          ref={btnRef}
          onClick={() => console.log('Pro payment coming soon')}
          className="font-inter font-medium text-[13px] px-5 py-2 rounded-md text-white mt-1"
          style={{ background: '#7c3aed' }}
          onMouseEnter={e => {
            gsap.to(e.currentTarget, { scale: 1.03, duration: 0.2 });
            (e.currentTarget as HTMLElement).style.background = '#8b47ff';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(124,58,237,0.3)';
          }}
          onMouseLeave={e => {
            gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
            (e.currentTarget as HTMLElement).style.background = '#7c3aed';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          Get Pro Access →
        </button>
      </div>
    </div>
  );
};

export default ProGate;

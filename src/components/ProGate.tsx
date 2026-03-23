import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { PRO_CONFIG } from '@/config/proConfig';
import AuthModal from './AuthModal';

interface ProGateProps {
  children: React.ReactNode;
  isLocked: boolean;
}

const ProGate = ({ children, isLocked }: ProGateProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isLocked && badgeRef.current) {
      gsap.fromTo(badgeRef.current, { scale: 0 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    }
  }, [isLocked]);

  if (!isLocked) return <>{children}</>;

  return (
    <>
      <div
        className="flex flex-col items-center justify-center gap-3 py-16 px-6"
        style={{ background: 'rgba(10,10,20,0.85)', backdropFilter: 'blur(2px)', minHeight: 240 }}
      >
        <span
          ref={badgeRef}
          className="font-mono text-[10px] uppercase px-3 py-1 rounded-full"
          style={{ background: '#7c3aed', color: '#fff', letterSpacing: '0.15em' }}
        >
          PRO
        </span>

        <span className="font-syne font-bold text-base text-center" style={{ color: '#f0ede8' }}>
          Purchase Pro to access the source code
        </span>

        <span className="font-inter font-light text-[13px] text-center" style={{ color: '#909098' }}>
          Previews are always free. The full source code is available with Pro access.
        </span>

        <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
          <a
            href={PRO_CONFIG.checkoutUrl}
            className="lemonsqueezy-button font-inter font-medium text-[13px] px-5 py-2.5 rounded-lg text-white text-center w-full inline-block"
            style={{ background: '#7c3aed' }}
          >
            Get Pro Access — {PRO_CONFIG.proPrice}
          </a>

          <button
            onClick={() => setModalOpen(true)}
            className="font-inter text-[13px] px-5 py-2.5 rounded-lg w-full transition-colors"
            style={{ color: '#a78bfa', border: '1px solid #7c3aed', background: 'transparent' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.1)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            Already have a key?
          </button>
        </div>
      </div>

      <LicenseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUnlock={(key) => onUnlock?.(key)}
      />
    </>
  );
};

export default ProGate;

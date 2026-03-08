import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { PRO_CONFIG } from '@/config/proConfig';
import LicenseModal from './LicenseModal';

interface ProGateProps {
  children: React.ReactNode;
  isLocked: boolean;
  onUnlock?: (key: string) => void;
}

const ProGate = ({ children, isLocked, onUnlock }: ProGateProps) => {
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
      <div className="relative">
        <div style={{ filter: 'blur(3px) brightness(0.4)', pointerEvents: 'none' }}>
          {children}
        </div>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
          style={{ background: 'rgba(6,6,8,0.6)' }}
        >
          <span
            ref={badgeRef}
            className="font-mono text-[10px] uppercase px-3 py-1 rounded-full"
            style={{ background: '#7c3aed', color: '#fff', letterSpacing: '0.15em' }}
          >
            PRO
          </span>

          <span className="font-syne font-bold text-base" style={{ color: '#f0ede8' }}>
            Unlock this component
          </span>

          <a
            href={PRO_CONFIG.checkoutUrl}
            className="lemonsqueezy-button font-inter font-medium text-[13px] px-6 py-2.5 rounded-md text-white mt-1 inline-block"
            style={{ background: '#7c3aed' }}
          >
            Get Pro Access — {PRO_CONFIG.proPrice}
          </a>

          <button
            onClick={() => setModalOpen(true)}
            className="font-inter text-[12px] px-4 py-1.5 rounded-md mt-1"
            style={{ color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)', background: 'transparent' }}
          >
            Enter License Key
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

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useToast } from '@/hooks/use-toast';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: (key: string) => void;
}

const LicenseModal = ({ isOpen, onClose, onUnlock }: LicenseModalProps) => {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(panelRef.current, { opacity: 0, y: 20, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleVerify = async () => {
    if (!key.trim()) {
      setError('Please enter a license key');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('https://api.lemonsqueezy.com/v1/licenses/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: key.trim(), instance_name: 'kinetic-ui-web' }),
      });
      const data = await res.json();
      if (data.activated || data.data?.activated) {
        onUnlock(key.trim());
        onClose();
        toast({ title: 'Pro unlocked!', description: 'Refresh to see all components.' });
      } else {
        setError('Invalid or already used license key');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-md mx-4 rounded-lg p-6"
        style={{ background: '#0e0e14', border: '1px solid #2a2a3e' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-syne font-bold text-lg" style={{ color: '#f0ede8' }}>
            Activate License
          </h3>
          <button
            onClick={onClose}
            className="font-mono text-[14px]"
            style={{ color: '#707080' }}
          >
            ✕
          </button>
        </div>

        <p className="font-inter text-[13px] mb-4" style={{ color: '#909098' }}>
          Enter the license key from your purchase email.
        </p>

        <input
          type="text"
          value={key}
          onChange={(e) => { setKey(e.target.value); setError(''); }}
          placeholder="Enter your license key..."
          className="w-full px-4 py-3 rounded-md font-mono text-[13px] mb-3 outline-none"
          style={{
            background: '#13131e',
            border: error ? '1px solid #ef4444' : '1px solid #2a2a3e',
            color: '#f0ede8',
          }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleVerify(); }}
        />

        {error && (
          <p className="font-inter text-[12px] mb-3" style={{ color: '#ef4444' }}>
            {error}
          </p>
        )}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-3 rounded-md font-inter font-medium text-[14px] text-white transition-opacity"
          style={{ background: '#7c3aed', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
              </svg>
              Verifying...
            </span>
          ) : (
            'Verify & Unlock'
          )}
        </button>
      </div>
    </div>
  );
};

export default LicenseModal;

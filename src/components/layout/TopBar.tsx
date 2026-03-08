import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import SmartSearchDropdown from './SmartSearchDropdown';
import { ComponentConfig } from '@/config/components.config';
import { PRO_CONFIG, isProUnlocked, getLicenseKey, revokeLicense } from '@/config/proConfig';

interface TopBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  placeholder?: string;
  rightText?: React.ReactNode;
  onMenuToggle?: () => void;
  items?: ComponentConfig[];
  categories?: string[];
}

const TopBar = ({
  search,
  onSearchChange,
  placeholder = 'Search components...',
  rightText = '42 components',
  onMenuToggle,
  items = [],
  categories = [],
}: TopBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isBlocks = location.pathname.startsWith('/blocks');
  const isPricing = location.pathname === '/pricing';
  const proUnlocked = isProUnlocked();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const maskKey = (key: string) => {
    if (key.length <= 8) return '••••-••••';
    return key.slice(0, 4) + '-' + key.slice(4, 8) + '-••••-••••';
  };

  return (
    <>
      <div
        data-topbar="main"
        className="fixed top-0 w-full h-12 flex items-center gap-3 px-3 sm:px-5 z-[100]"
        style={{
          background: 'rgba(14,14,20,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #222235',
        }}
      >
        <button
          onClick={onMenuToggle}
          className="lg:hidden font-mono text-[12px] flex-shrink-0"
          style={{ color: '#686878' }}
        >
          ☰
        </button>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-mono text-[12px] transition-colors flex-shrink-0"
          style={{ color: '#686878' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#f0ede8';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#686878';
          }}
        >
          <span>←</span>
          <span className="font-syne font-bold hidden sm:inline">
            KINETIC UI
          </span>
        </button>

        <div
          className="hidden sm:inline-flex items-center p-[3px] rounded-md flex-shrink-0"
          style={{ background: '#111119', border: '1px solid #222235' }}
        >
          <button
            onClick={() => navigate('/components')}
            className="font-mono text-[11px] px-4 py-1.5 rounded cursor-pointer transition-colors"
            style={{
              background: !isBlocks && !isPricing ? '#151520' : 'transparent',
              color: !isBlocks && !isPricing ? '#f0ede8' : '#686878',
              border: !isBlocks && !isPricing ? '1px solid #222235' : '1px solid transparent',
            }}
          >
            Components
          </button>
          <button
            onClick={() => navigate('/blocks')}
            className="font-mono text-[11px] px-4 py-1.5 rounded cursor-pointer transition-colors flex items-center gap-1.5"
            style={{
              background: isBlocks ? '#151520' : 'transparent',
              color: isBlocks ? '#f0ede8' : '#686878',
              border: isBlocks ? '1px solid #222235' : '1px solid transparent',
            }}
          >
            Blocks
            {PRO_CONFIG.proModeEnabled && !proUnlocked && (
              <span
                className="font-mono text-[8px] px-1.5 py-0.5 rounded"
                style={{
                  color: '#7c3aed',
                  border: '1px solid rgba(124,58,237,0.3)',
                }}
              >
                PRO
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="font-mono text-[11px] px-4 py-1.5 rounded cursor-pointer transition-colors"
            style={{
              background: isPricing ? '#151520' : 'transparent',
              color: isPricing ? '#f0ede8' : '#686878',
              border: isPricing ? '1px solid #222235' : '1px solid transparent',
            }}
          >
            Pricing
          </button>
        </div>

        <SmartSearchDropdown
          search={search}
          onSearchChange={onSearchChange}
          items={items}
          categories={categories}
          placeholder={placeholder}
        />

        {/* Pro status / upgrade button */}
        <div className="flex-shrink-0 hidden md:flex items-center gap-3">
          <span
            className="font-mono text-[11px]"
            style={{ color: '#404050' }}
          >
            {rightText}
          </span>

          {proUnlocked ? (
            <div className="relative">
              <button
                onClick={() => setPopoverOpen(!popoverOpen)}
                className="font-mono text-[9px] uppercase px-2.5 py-1 rounded-full"
                style={{ background: '#7c3aed', color: '#fff', letterSpacing: '0.1em' }}
              >
                PRO
              </button>
              {popoverOpen && (
                <>
                  <div className="fixed inset-0 z-[200]" onClick={() => setPopoverOpen(false)} />
                  <div
                    className="absolute top-full right-0 mt-2 z-[201] rounded-lg p-4 w-56"
                    style={{ background: '#0e0e14', border: '1px solid #2a2a3e' }}
                  >
                    <p className="font-mono text-[11px] mb-1" style={{ color: '#707080' }}>License Key</p>
                    <p className="font-mono text-[12px] mb-3" style={{ color: '#f0ede8' }}>
                      {maskKey(getLicenseKey())}
                    </p>
                    <button
                      onClick={() => {
                        revokeLicense();
                        window.location.reload();
                      }}
                      className="w-full py-2 rounded-md font-inter text-[12px]"
                      style={{ border: '1px solid #ef4444', color: '#ef4444', background: 'transparent' }}
                    >
                      Revoke License
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : PRO_CONFIG.proModeEnabled ? (
            <button
              onClick={() => navigate('/pricing')}
              className="font-mono text-[10px] px-3 py-1 rounded"
              style={{ color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)', background: 'transparent' }}
            >
              Upgrade to Pro
            </button>
          ) : null}
        </div>
      </div>

      <div
        data-topbar="switcher"
        className="fixed top-12 left-0 w-full z-[99] sm:hidden flex"
        style={{ background: '#111119', borderBottom: '1px solid #1a1a2a' }}
      >
        <button
          onClick={() => navigate('/components')}
          className="flex-1 font-mono text-[11px] py-2 cursor-pointer text-center transition-colors"
          style={{
            background: !isBlocks && !isPricing ? '#151520' : 'transparent',
            color: !isBlocks && !isPricing ? '#f0ede8' : '#686878',
          }}
        >
          Components
        </button>
        <button
          onClick={() => navigate('/blocks')}
          className="flex-1 font-mono text-[11px] py-2 cursor-pointer text-center transition-colors flex items-center justify-center gap-1.5"
          style={{
            background: isBlocks ? '#151520' : 'transparent',
            color: isBlocks ? '#f0ede8' : '#686878',
          }}
        >
          Blocks
          {PRO_CONFIG.proModeEnabled && !proUnlocked && (
            <span
              className="font-mono text-[8px] px-1.5 py-0.5 rounded"
              style={{
                color: '#7c3aed',
                border: '1px solid rgba(124,58,237,0.3)',
              }}
            >
              PRO
            </span>
          )}
        </button>
        <button
          onClick={() => navigate('/pricing')}
          className="flex-1 font-mono text-[11px] py-2 cursor-pointer text-center transition-colors"
          style={{
            background: isPricing ? '#151520' : 'transparent',
            color: isPricing ? '#f0ede8' : '#686878',
          }}
        >
          Pricing
        </button>
      </div>
    </>
  );
};

export default TopBar;

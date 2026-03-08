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

const NavLink = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="relative font-mono text-[13px] tracking-[0.05em] transition-colors duration-200 pb-1"
    style={{ color: active ? '#f0ede8' : '#606070' }}
    onMouseEnter={(e) => {
      if (!active) (e.currentTarget as HTMLElement).style.color = '#a0a0b8';
    }}
    onMouseLeave={(e) => {
      if (!active) (e.currentTarget as HTMLElement).style.color = '#606070';
    }}
  >
    {label}
    {active && (
      <span
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
        style={{ background: '#7c3aed' }}
      />
    )}
  </button>
);

const TopBar = ({
  search,
  onSearchChange,
  placeholder = 'Search...',
  onMenuToggle,
  items = [],
  categories = [],
}: TopBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isComponents = location.pathname.startsWith('/components');
  const isBlocks = location.pathname.startsWith('/blocks');
  const isDocs = location.pathname === '/docs';
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
        className="fixed top-0 w-full flex items-center justify-between z-[100]"
        style={{
          height: 48,
          padding: '0 24px',
          background: '#0a0a0f',
          borderBottom: '1px solid #1a1a2a',
        }}
      >
        {/* LEFT — Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onMenuToggle}
            className="lg:hidden font-mono text-[12px] mr-2"
            style={{ color: '#606070' }}
          >
            ☰
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <span
              className="w-[3px] h-4 rounded-sm"
              style={{ background: '#7c3aed' }}
            />
            <span className="font-syne font-bold text-[14px]" style={{ color: '#f0ede8' }}>
              KINETIC UI
            </span>
          </button>
        </div>

        {/* CENTER — Nav links */}
        <div className="hidden sm:flex items-center gap-6">
          <NavLink
            label="Components"
            active={isComponents}
            onClick={() => navigate('/components')}
          />
          <NavLink
            label="Blocks"
            active={isBlocks}
            onClick={() => navigate('/blocks')}
          />
          <NavLink
            label="Docs"
            active={isDocs}
            onClick={() => navigate('/docs')}
          />
          <NavLink
            label="Pricing"
            active={isPricing}
            onClick={() => navigate('/pricing')}
          />
        </div>

        {/* RIGHT — Search + status */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div style={{ maxWidth: 200 }}>
            <SmartSearchDropdown
              search={search}
              onSearchChange={onSearchChange}
              items={items}
              categories={categories}
              placeholder={placeholder}
            />
          </div>

          <div className="hidden md:flex items-center">
            {proUnlocked ? (
              <div className="relative">
                <button
                  onClick={() => setPopoverOpen(!popoverOpen)}
                  className="font-mono text-[10px] uppercase rounded-full"
                  style={{
                    background: '#7c3aed',
                    color: '#fff',
                    padding: '3px 10px',
                    borderRadius: 20,
                    letterSpacing: '0.08em',
                  }}
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
                className="font-mono text-[11px] transition-colors duration-200"
                style={{
                  color: '#a78bfa',
                  border: '1px solid #7c3aed',
                  background: 'transparent',
                  padding: '4px 12px',
                  borderRadius: 6,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                Upgrade
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile nav switcher */}
      <div
        data-topbar="switcher"
        className="fixed top-12 left-0 w-full z-[99] sm:hidden flex"
        style={{ background: '#0a0a0f', borderBottom: '1px solid #1a1a2a' }}
      >
        {['Components', 'Blocks', 'Docs', 'Pricing'].map((label) => {
          const path = `/${label.toLowerCase()}`;
          const active =
            label === 'Components' ? isComponents :
            label === 'Blocks' ? isBlocks :
            label === 'Docs' ? isDocs : isPricing;
          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex-1 font-mono text-[11px] py-2 text-center transition-colors relative"
              style={{
                color: active ? '#f0ede8' : '#606070',
                background: active ? '#111119' : 'transparent',
              }}
            >
              {label}
              {active && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: '#7c3aed' }}
                />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default TopBar;

import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SmartSearchDropdown from './SmartSearchDropdown';
import { ComponentConfig } from '@/config/components.config';
import { PRO_CONFIG } from '@/config/proConfig';
import { usePro } from '@/hooks/usePro';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';

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
  const { isPro: proUnlocked } = usePro();
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <div className="hidden sm:block" style={{ maxWidth: 200 }}>
            <SmartSearchDropdown
              search={search}
              onSearchChange={onSearchChange}
              items={items}
              categories={categories}
              placeholder={placeholder}
            />
          </div>

          {/* Mobile avatar for logged-in pro users */}
          <div className="sm:hidden flex items-center">
            {proUnlocked && user ? (
              <div className="relative">
                <button
                  className="relative flex items-center justify-center w-7 h-7 rounded-full font-syne font-bold text-[11px]"
                  style={{
                    background: '#7c3aed',
                    color: '#fff',
                    border: '2px solid #7c3aed',
                    boxShadow: '0 0 0 3px rgba(124,58,237,0.25)',
                  }}
                  title={user?.email ?? 'Pro user'}
                >
                  {user?.email ? user.email[0].toUpperCase() : 'P'}
                  <span
                    className="absolute font-mono"
                    style={{
                      bottom: -6,
                      right: -6,
                      fontSize: 8,
                      letterSpacing: '0.08em',
                      background: '#7c3aed',
                      color: '#fff',
                      padding: '1px 4px',
                      borderRadius: 4,
                      lineHeight: 1.4,
                    }}
                  >
                    PRO
                  </span>
                </button>
              </div>
            ) : null}
          </div>

          <div className="hidden md:flex items-center">
            {proUnlocked ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className="relative flex items-center justify-center w-7 h-7 rounded-full font-syne font-bold text-[11px] transition-opacity duration-200"
                  style={{
                    background: '#7c3aed',
                    color: '#fff',
                    border: '2px solid #7c3aed',
                    boxShadow: '0 0 0 3px rgba(124,58,237,0.25)',
                  }}
                  title={user?.email ?? 'Pro user'}
                >
                  {user?.email ? user.email[0].toUpperCase() : 'P'}
                  <span
                    className="absolute font-mono"
                    style={{
                      bottom: -6,
                      right: -6,
                      fontSize: 8,
                      letterSpacing: '0.08em',
                      background: '#7c3aed',
                      color: '#fff',
                      padding: '1px 4px',
                      borderRadius: 4,
                      lineHeight: 1.4,
                    }}
                  >
                    PRO
                  </span>
                </button>
                {dropdownOpen && (
                  <div
                    className="absolute right-0 top-10 w-48 rounded-xl overflow-hidden z-[200]"
                    style={{
                      background: '#0e0e14',
                      border: '1px solid #1e1e2e',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }}
                  >
                    <div
                      className="px-4 py-3 font-mono text-[10px] truncate"
                      style={{
                        color: '#606070',
                        borderBottom: '1px solid #1e1e2e',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {user?.email}
                    </div>
                    <button
                      onClick={() => { signOut(); setDropdownOpen(false) }}
                      className="w-full text-left px-4 py-3 font-mono text-[11px] transition-colors duration-200"
                      style={{ color: '#909098' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#f0ede8'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#909098'}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : PRO_CONFIG.proModeEnabled ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="font-mono text-[11px] transition-colors duration-200"
                  style={{
                    color: '#909098',
                    background: 'transparent',
                    border: 'none',
                    padding: '4px 8px',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#f0ede8'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#909098'}
                >
                  Sign In
                </button>
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
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.1)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  Upgrade
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Pro status banner */}
      {proUnlocked && user && (
        <div
          className="fixed w-full z-[99] flex items-center justify-center"
          style={{
            top: 48,
            height: 28,
            background: 'linear-gradient(90deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05))',
            borderBottom: '1px solid rgba(124,58,237,0.2)',
          }}
        >
          <span
            className="font-mono text-[10px] tracking-[0.12em]"
            style={{ color: '#a78bfa' }}
          >
            PRO ACCESS ACTIVE
          </span>
        </div>
      )}

      {/* Mobile nav switcher */}
      <div
        data-topbar="switcher"
        className="fixed top-12 left-0 w-full z-[99] sm:hidden flex"
        style={{ background: '#0a0a0f', borderBottom: '1px solid #1a1a2a' }}
      >
        {['Components', 'Blocks', 'Docs', 'Pricing'].map((label) => {
          // Hide Pricing tab on mobile when logged in
          if (label === 'Pricing' && proUnlocked && user) return null;
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

      {/* Mobile search row below nav switcher */}
      <div
        data-topbar="mobile-search"
        className="fixed left-0 w-full z-[98] block sm:hidden"
        style={{
          top: proUnlocked && user ? 76 + 28 : 80,
          background: '#0a0a0f',
          borderBottom: '1px solid #1a1a2a',
          padding: '8px 16px',
        }}
      >
        <SmartSearchDropdown
          search={search}
          onSearchChange={onSearchChange}
          items={items}
          categories={categories}
          placeholder={placeholder}
        />
      </div>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};

export default TopBar;

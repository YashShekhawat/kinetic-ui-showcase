import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SmartSearchDropdown from './SmartSearchDropdown';
import { ComponentConfig } from '@/config/components.config';
import { PRO_CONFIG } from '@/config/proConfig';
import { usePro } from '@/hooks/usePro';
import { useAuth } from '@/contexts/AuthContext';

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
              <span
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
              </span>
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

import { useNavigate, useLocation } from 'react-router-dom';
import SmartSearchDropdown from './SmartSearchDropdown';
import { ComponentConfig } from '@/config/components.config';

interface TopBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  placeholder?: string;
  rightText?: React.ReactNode;
  onMenuToggle?: () => void;
  items?: ComponentConfig[];
  categories?: string[];
}

const TopBar = ({ search, onSearchChange, placeholder = 'Search components...', rightText = '42 components', onMenuToggle, items = [], categories = [] }: TopBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isBlocks = location.pathname === '/blocks';

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
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f0ede8'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#686878'; }}
        >
          <span>←</span>
          <span className="font-syne font-bold hidden sm:inline">KINETIC UI</span>
        </button>

        <div
          className="hidden sm:inline-flex items-center p-[3px] rounded-md flex-shrink-0"
          style={{ background: '#111119', border: '1px solid #222235' }}
        >
          <button
            onClick={() => navigate('/components')}
            className="font-mono text-[11px] px-4 py-1.5 rounded cursor-pointer transition-colors"
            style={{
              background: !isBlocks ? '#151520' : 'transparent',
              color: !isBlocks ? '#f0ede8' : '#686878',
              border: !isBlocks ? '1px solid #222235' : '1px solid transparent',
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
            <span
              className="font-mono text-[8px] px-1.5 py-0.5 rounded"
              style={{ color: '#7c3aed', border: '1px solid rgba(124,58,237,0.3)' }}
            >
              PRO
            </span>
          </button>
        </div>

        <SmartSearchDropdown
          search={search}
          onSearchChange={onSearchChange}
          items={items}
          categories={categories}
          placeholder={placeholder}
        />

        <span className="font-mono text-[11px] flex-shrink-0 hidden md:block" style={{ color: '#404050' }}>{rightText}</span>
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
            background: !isBlocks ? '#151520' : 'transparent',
            color: !isBlocks ? '#f0ede8' : '#686878',
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
          <span
            className="font-mono text-[8px] px-1.5 py-0.5 rounded"
            style={{ color: '#7c3aed', border: '1px solid rgba(124,58,237,0.3)' }}
          >
            PRO
          </span>
        </button>
      </div>
    </>
  );
};

export default TopBar;
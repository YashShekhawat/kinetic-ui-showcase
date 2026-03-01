import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface TopBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  placeholder?: string;
  rightText?: string;
  onMenuToggle?: () => void;
}

const TopBar = ({ search, onSearchChange, placeholder = 'Search components...', rightText = '42 components', onMenuToggle }: TopBarProps) => {
  const navigate = useNavigate();
  const [searchExpanded, setSearchExpanded] = useState(false);

  return (
    <div
      className="fixed top-0 w-full h-12 flex items-center justify-between px-5 z-[100]"
      style={{
        background: 'rgba(6,6,8,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1a1a2e',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden font-mono text-[12px]"
          style={{ color: '#606070' }}
        >
          ☰
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-mono text-[12px] transition-colors"
          style={{ color: '#606070' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ededed'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#606070'; }}
        >
          <span>←</span>
          <span className="font-syne font-bold">KINETIC UI</span>
        </button>
      </div>

      {/* Desktop search */}
      <div className="hidden md:block">
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-[280px] py-1.5 px-3 rounded-md font-mono text-[12px] outline-none"
          style={{
            background: '#0a0a12',
            border: '1px solid #1a1a2e',
            color: '#ededed',
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = '#7c3aed';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.1)';
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = '#1a1a2e';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Mobile search icon */}
      <button
        onClick={() => setSearchExpanded(!searchExpanded)}
        className="md:hidden font-mono text-[12px]"
        style={{ color: '#606070' }}
      >
        🔍
      </button>

      <span className="font-mono text-[11px]" style={{ color: '#404050' }}>{rightText}</span>

      {/* Mobile search expanded */}
      {searchExpanded && (
        <div className="absolute top-12 left-0 w-full p-3 md:hidden" style={{ background: '#060608', borderBottom: '1px solid #1a1a2e' }}>
          <input
            type="text"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full py-2 px-3 rounded-md font-mono text-[12px] outline-none"
            style={{ background: '#0a0a12', border: '1px solid #1a1a2e', color: '#ededed' }}
            autoFocus
          />
        </div>
      )}
    </div>
  );
};

export default TopBar;

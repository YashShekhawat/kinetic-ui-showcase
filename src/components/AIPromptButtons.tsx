import { useState, useRef } from 'react';
import { ClipboardCopy, CheckCheck, Zap, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AIPromptButtonsProps {
  name: string;
  code: string | null;
  isPro: boolean;
  isUnlocked: boolean;
}

const AIPromptButtons = ({ name, code, isPro, isUnlocked }: AIPromptButtonsProps) => {
  const isLocked = isPro && !isUnlocked;
  const navigate = useNavigate();

  const prompt = code
    ? `Integrate this Kinetic UI component into my project. It is built with GSAP and Tailwind CSS.

Component: ${name}
Source: kineticui.com

${code}

Dependencies required: gsap, tailwindcss
After adding it, make it work in my existing React + Tailwind project.`
    : '';

  const encodedPrompt = encodeURIComponent(prompt);
  const boltUrl = `https://bolt.new/?prompt=${encodedPrompt}`;
  const v0Url = `https://v0.dev/chat?q=${encodedPrompt}`;

  const [copied, setCopied] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showLockedToast = () => {
    toast({
      title: 'AI prompts are a Pro feature',
      description: 'Upgrade for $49',
      action: (
        <button
          onClick={() => navigate('/pricing')}
          className="font-mono text-xs underline"
          style={{ color: '#a78bfa' }}
        >
          Upgrade Now
        </button>
      ),
    });
  };

  const handleCopy = () => {
    if (isLocked) return showLockedToast();
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    if (copyTimeout.current) clearTimeout(copyTimeout.current);
    copyTimeout.current = setTimeout(() => setCopied(false), 2000);
  };

  const handleBolt = () => {
    if (isLocked) return showLockedToast();
    if (encodedPrompt.length > 2000) {
      toast({ title: 'Prompt too long', description: 'Use Copy instead' });
      return;
    }
    window.open(boltUrl, '_blank');
  };

  const handleV0 = () => {
    if (isLocked) return showLockedToast();
    if (encodedPrompt.length > 2000) {
      toast({ title: 'Prompt too long', description: 'Use Copy instead' });
      return;
    }
    window.open(v0Url, '_blank');
  };

  const lockedStyle: React.CSSProperties = {
    color: '#303040',
    opacity: 0.4,
    cursor: 'not-allowed',
  };

  const activeStyle = (id: string): React.CSSProperties => ({
    color: hoveredBtn === id ? '#a78bfa' : '#606070',
    transition: 'color 0.2s',
    cursor: 'pointer',
  });

  const btnBase: React.CSSProperties = {
    width: 28,
    height: 28,
    background: 'transparent',
    border: '1px solid #1e1e2e',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: 6,
    background: '#1a1a2e',
    color: '#a78bfa',
    fontFamily: 'monospace',
    fontSize: 10,
    padding: '4px 8px',
    borderRadius: 4,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    zIndex: 50,
  };

  const buttons = [
    {
      id: 'copy',
      icon: copied ? <CheckCheck size={13} /> : <ClipboardCopy size={13} />,
      tooltip: isLocked ? 'Unlock Pro to use AI prompts' : 'Copy Lovable prompt',
      onClick: handleCopy,
    },
    {
      id: 'bolt',
      icon: <Zap size={13} />,
      tooltip: isLocked ? 'Unlock Pro to use AI prompts' : 'Open in Bolt',
      onClick: handleBolt,
    },
    {
      id: 'v0',
      icon: <Sparkles size={13} />,
      tooltip: isLocked ? 'Unlock Pro to use AI prompts' : 'Open in v0',
      onClick: handleV0,
    },
  ];

  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {buttons.map((btn) => (
        <button
          key={btn.id}
          style={{ ...btnBase, ...(isLocked ? lockedStyle : activeStyle(btn.id)) }}
          onClick={btn.onClick}
          onMouseEnter={() => setHoveredBtn(btn.id)}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          {btn.icon}
          {hoveredBtn === btn.id && <div style={tooltipStyle}>{btn.tooltip}</div>}
        </button>
      ))}
    </div>
  );
};

export default AIPromptButtons;

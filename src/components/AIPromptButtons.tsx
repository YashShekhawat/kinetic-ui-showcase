import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Lock } from 'lucide-react';
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
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [btnHovered, setBtnHovered] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const componentCode = code ?? '';

  // Generate fileName from component name (e.g., "Curtain Preloader" → "CurtainPreloader.tsx")
  const fileName = `${name.split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1)).join('')}.tsx`;

  const lovablePrompt = `You are given a task to integrate a React component into your codebase.

Please verify your project has the following setup:

- React 18 or higher

- TypeScript

- Tailwind CSS

- GSAP installed (npm install gsap)

If any of these are missing, provide instructions to install them before continuing.

Determine the default path for components in this project.

If no components folder exists, create one at src/components/

Copy-paste this component to your components folder:

File name: ${fileName}

${componentCode}

After adding the file:

1. Import and use the component wherever needed

2. Make sure gsap is imported at the top of the file

3. Do not modify the animation logic unless asked`;

  const boltPrompt = `You are given a task to integrate a React component into your codebase.

Please verify your project has the following setup:

- React 18 or higher

- TypeScript

- Tailwind CSS

- GSAP (run: npm install gsap)

If any of these are missing, install them before continuing.

Save this component as src/components/${fileName}:

${componentCode}

Then import and render it where needed. Do not change any animation or timing logic.`;

  const v0Prompt = `Integrate this animated React component into the project.

Requirements:

- React 18+, TypeScript, Tailwind CSS

- GSAP for animations (npm install gsap)

Save as src/components/${fileName} and render it where appropriate.

Keep all GSAP animation logic, timing, easing, and class names exactly as written — do not simplify or replace animations with CSS transitions.

Component code:

${componentCode}`;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

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

  const handleTrigger = () => {
    if (isLocked) {
      showLockedToast();
      return;
    }
    setOpen((v) => !v);
  };

  const copyPrompt = (promptText: string, label: string) => {
    if (!componentCode) return;
    navigator.clipboard.writeText(promptText);
    toast({ title: `Copied ${label} prompt!`, duration: 2000 } as any);
    setOpen(false);
  };

  const items = [
    {
      id: 'lovable',
      label: 'Lovable',
      icon: (
        <div
          style={{
            width: 24, height: 24, borderRadius: 6,
            background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 13, fontFamily: 'Inter, sans-serif',
          }}
        >
          L
        </div>
      ),
      onClick: () => copyPrompt(lovablePrompt, 'Lovable'),
    },
    {
      id: 'bolt',
      label: 'Bolt',
      icon: (
        <div
          style={{
            width: 24, height: 24, borderRadius: 6,
            background: '#1a1a2e', border: '1px solid #2a2a3e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'monospace',
          }}
        >
          b
        </div>
      ),
      onClick: () => copyPrompt(boltPrompt, 'Bolt'),
    },
    {
      id: 'v0',
      label: 'v0',
      icon: (
        <div
          style={{
            width: 24, height: 24, borderRadius: 6,
            background: '#000', border: '1px solid #333',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 11, fontFamily: 'monospace',
          }}
        >
          v0
        </div>
      ),
      onClick: () => copyPrompt(v0Prompt, 'v0'),
    },
  ];

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <button
        onClick={handleTrigger}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          height: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          background: '#13131f',
          border: `1px solid ${!isLocked && btnHovered ? '#7c3aed' : '#1e1e2e'}`,
          borderRadius: 8,
          fontFamily: 'monospace',
          fontSize: 12,
          color: isLocked ? '#404050' : (btnHovered ? '#f0ede8' : '#a0a0b8'),
          cursor: isLocked ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
        }}
      >
        {isLocked && <Lock size={10} />}
        Copy prompt
        <ChevronDown
          size={12}
          style={{
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            background: '#0d0d14',
            border: '1px solid #1e1e2e',
            borderRadius: 8,
            padding: 6,
            minWidth: 160,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            zIndex: 50,
            animation: 'aiDropIn 0.15s ease-out',
          }}
        >
          <style>{`@keyframes aiDropIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }`}</style>
          {items.map((item) => (
            <div
              key={item.id}
              onClick={item.onClick}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 6,
                cursor: 'pointer',
                background: hovered === item.id ? 'rgba(124,58,237,0.08)' : 'transparent',
                transition: 'background 0.15s',
              }}
            >
              {item.icon}
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 13,
                  color: hovered === item.id ? '#f0ede8' : '#c0c0d0',
                  transition: 'color 0.15s',
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIPromptButtons;

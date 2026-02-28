import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

gsap.registerPlugin(ScrollTrigger);

interface ComponentCardProps {
  name: string;
  code: string;
  children: React.ReactNode;
  category?: string;
  fullBleed?: boolean;
}

const ComponentCard = ({ name, code, children, category, fullBleed }: ComponentCardProps) => {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const copyBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    gsap.fromTo(el,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }
    );
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (copyBtnRef.current) {
      gsap.fromTo(copyBtnRef.current, { scale: 0.9 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      ref={cardRef}
      data-component={name}
      data-category={category}
      className="rounded-[10px] overflow-hidden opacity-0"
      style={{
        background: '#0d0d12',
        border: '1px solid #1f1f2e',
        boxShadow: '0 0 0 1px rgba(124,58,237,0.05), 0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.02)',
      }}
    >
      {/* Top bar */}
      <div
        className="h-11 flex items-center justify-between px-4"
        style={{ background: '#111118', borderBottom: '1px solid #1f1f2e' }}
      >
        <span className="font-inter font-medium text-[13px] text-kinetic-text">{name}</span>
        <div className="flex gap-1">
          {(['preview', 'code'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-mono text-[11px] px-2 py-0.5 rounded transition-colors ${
                tab === t ? 'text-kinetic-text' : 'text-kinetic-text-muted hover:text-kinetic-text'
              }`}
            >
              {t === 'preview' ? 'Preview' : 'Code'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {tab === 'preview' ? (
        <div
          className={`min-h-[280px] flex items-center justify-center ${fullBleed ? '' : 'p-8 dot-grid'}`}
          style={{ background: '#080810' }}
        >
          {children}
        </div>
      ) : (
        <div className="relative max-h-[320px] overflow-y-auto" data-code style={{ borderTop: '1px solid #1f1f2e' }}>
          <button
            ref={copyBtnRef}
            onClick={handleCopy}
            className={`absolute top-3 right-3 font-mono text-[11px] px-3 py-1 rounded z-10 transition-colors ${
              copied ? 'text-kinetic-green border-kinetic-green' : 'text-kinetic-text-muted'
            }`}
            style={{ border: '1px solid #1f1f2e' }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <SyntaxHighlighter
            language="tsx"
            style={atomDark}
            customStyle={{
              background: '#07070e',
              margin: 0,
              padding: '20px',
              fontSize: '13px',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};

export default ComponentCard;

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
  isMobileBlock?: boolean;
  blockCategory?: string;
  isBlock?: boolean;
}

const ComponentCard = ({ name, code, children, category, fullBleed, isMobileBlock, blockCategory, isBlock }: ComponentCardProps) => {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const copyBtnRef = useRef<HTMLButtonElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isBlock || !previewRef.current) return;
    const el = previewRef.current;
    const check = () => setShowScrollHint(el.scrollHeight > el.clientHeight);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isBlock, tab]);

  useEffect(() => {
    const el = codeRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop === 0 && e.deltaY < 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight && e.deltaY > 0;
      if (!atTop && !atBottom) {
        e.stopPropagation();
      }
      e.preventDefault();
      el.scrollTop += e.deltaY;
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [tab]);

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
        background: '#1a1a28',
        border: '1px solid #2a2a3e',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Top bar */}
      <div
        className="h-11 flex items-center justify-between px-4"
        style={{ background: '#1e1e2e', borderBottom: '1px solid #2a2a3e' }}
      >
        <span className="font-inter font-medium text-[13px] truncate" style={{ color: '#f0ede8' }}>{name}</span>
        <div className="flex gap-1">
          {(['preview', 'code'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="font-mono text-[11px] px-2 py-0.5 rounded transition-colors"
              style={{ color: tab === t ? '#f0ede8' : '#707080' }}
            >
              {t === 'preview' ? 'Preview' : 'Code'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {tab === 'preview' ? (
        isMobileBlock ? (
          <div
            className="flex flex-col items-center justify-center text-center p-6"
            style={{ minHeight: 400, background: '#12121e' }}
          >
            <span className="font-mono text-[10px] mb-2" style={{ color: '#a78bfa' }}>{blockCategory}</span>
            <span className="font-syne font-bold text-xl mb-4" style={{ color: '#f0ede8' }}>{name}</span>
            <div className="flex flex-col items-center gap-2 mb-5">
              <div className="h-1 rounded-full" style={{ width: '70%', maxWidth: 200, background: '#222235' }} />
              <div className="h-1 rounded-full" style={{ width: '50%', maxWidth: 140, background: '#222235' }} />
              <div className="h-1 rounded-full" style={{ width: '60%', maxWidth: 170, background: '#222235' }} />
            </div>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded mb-3" style={{ color: '#7c3aed', border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.08)' }}>PRO</span>
            <span className="font-mono text-[9px]" style={{ color: '#404050' }}>Preview on desktop for full experience</span>
          </div>
        ) : isBlock ? (
          <div className="relative">
            <div
              ref={previewRef}
              className="w-full overflow-y-auto overflow-x-hidden relative block-preview-scroll"
              style={{
                height: isMobileBlock ? 400 : 600,
                background: '#0e0e14',
                scrollbarWidth: 'thin',
                scrollbarColor: '#2a2a3e #0a0a12',
              }}
            >
              {children}
            </div>
            {(showScrollHint || isMobileBlock) && (
              <span
                className="absolute bottom-3 right-3 pointer-events-none z-10"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  color: '#404050',
                }}
              >
                Scroll to explore ↓
              </span>
            )}
          </div>
        ) : (
          <div
            className="flex items-center justify-center min-h-[240px] md:min-h-[280px] p-4 md:p-8 dot-grid"
            style={{ background: '#12121e' }}
          >
            {children}
          </div>
        )
      ) : (
        <div ref={codeRef} className="relative max-h-[240px] md:max-h-[320px] overflow-y-auto overflow-x-auto overscroll-contain" data-code style={{ borderTop: '1px solid #2a2a3e' }}>
          <button
            ref={copyBtnRef}
            onClick={handleCopy}
            className={`absolute top-3 right-3 font-mono text-[11px] px-3 py-1 rounded z-10 transition-colors ${
              copied ? 'text-kinetic-green border-kinetic-green' : ''
            }`}
            style={{ border: '1px solid #2a2a3e', color: copied ? undefined : '#707080' }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <SyntaxHighlighter
            language="tsx"
            style={atomDark}
            customStyle={{
              background: '#0e0e14',
              margin: 0,
              padding: '20px',
              fontSize: '11px',
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

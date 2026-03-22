import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ProGate from './ProGate';
import AIPromptButtons from './AIPromptButtons';
import { usePro } from '@/hooks/usePro';
import { toFramerCode } from '@/lib/toFramerCode';
import type { FramerProp } from '@/lib/toFramerCode';
import { toast } from '@/hooks/use-toast';

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
  isPro?: boolean;
}

const ComponentCard = ({ name, code, children, category, fullBleed, isMobileBlock, blockCategory, isBlock, isPro: isProBlock }: ComponentCardProps) => {
  const { isPro: proUnlocked, unlock } = usePro();
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const copyBtnRef = useRef<HTMLButtonElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const restartIconRef = useRef<SVGSVGElement>(null);
  const restartBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isBlock || !previewRef.current) return;
    const el = previewRef.current;
    const check = () => setShowScrollHint(el.scrollHeight > el.clientHeight);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isBlock, tab, restartKey]);

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

  const handleRestart = () => {
    if (restartIconRef.current) {
      gsap.to(restartIconRef.current, {
        rotation: '-=360',
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          setRestartKey(k => k + 1);
        },
      });
    } else {
      setRestartKey(k => k + 1);
    }
  };

  const handleRestartHover = () => {
    if (restartIconRef.current) {
      gsap.to(restartIconRef.current, { rotation: '-=180', duration: 0.4, ease: 'power2.out' });
    }
    if (restartBtnRef.current) {
      gsap.to(restartBtnRef.current, { borderColor: '#2a2a3e', duration: 0.2 });
    }
  };

  const handleRestartLeave = () => {
    if (restartBtnRef.current) {
      gsap.to(restartBtnRef.current, { borderColor: '#1a1a2e', duration: 0.2 });
    }
  };

  return (
    <div
      ref={cardRef}
      data-component={name}
      data-category={category}
      className="rounded-[10px] overflow-visible opacity-0"
      style={{
        background: '#1a1a28',
        border: '1px solid #2a2a3e',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      <div
        style={{ background: '#1e1e2e', borderRadius: '10px 10px 0 0', overflow: 'visible', position: 'relative', zIndex: 10 }}
      >
        {/* Row 1: Component name */}
        <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid #1a1a2a' }}>
          <span className="font-inter font-medium text-[13px]" style={{ color: '#f0ede8' }}>{name}</span>
        </div>

        {/* Row 2: Controls — AI buttons left, tabs right */}
        <div
          className="flex items-center justify-between"
          style={{ padding: '8px 12px', borderBottom: '1px solid #2a2a3e' }}
        >
          <div className="flex items-center gap-1 flex-1 sm:flex-none min-w-0">
            <AIPromptButtons name={name} code={isProBlock && !proUnlocked ? null : code} isPro={!!isProBlock} isUnlocked={proUnlocked} />
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {isBlock && tab === 'preview' && (
              <div className="relative group">
                <button
                  ref={restartBtnRef}
                  onClick={handleRestart}
                  onMouseEnter={handleRestartHover}
                  onMouseLeave={handleRestartLeave}
                  className="flex items-center justify-center cursor-pointer"
                  style={{ width: 28, height: 28, border: '1px solid #1a1a2e', borderRadius: 4, background: 'transparent', color: '#505060', padding: 0 }}
                >
                  <svg ref={restartIconRef} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                  </svg>
                </button>
                <div className="absolute z-[100] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ top: '100%', right: 0, marginTop: 6, whiteSpace: 'nowrap', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#ededed', background: '#0d0d16', border: '1px solid #1a1a2e', padding: '4px 8px', borderRadius: 4 }}>
                  Restart animation
                </div>
              </div>
            )}
            {(['preview', 'code'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className="font-mono text-[11px] px-2 py-0.5 rounded transition-colors" style={{ color: tab === t ? '#f0ede8' : '#707080' }}>
                {t === 'preview' ? 'Preview' : 'Code'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-hidden" style={{ borderRadius: '0 0 10px 10px' }}>
      {tab === 'preview' ? (
        isBlock ? (
          <div className="relative">
            <div
              ref={previewRef}
              data-preview="true"
              className="w-full overflow-y-auto overflow-x-hidden relative block-preview-scroll"
              style={{
                height: 'auto',
                background: '#0e0e14',
                scrollbarWidth: 'thin',
                scrollbarColor: '#2a2a3e #0a0a12',
              }}
            >
              <div key={restartKey}>
                {children}
              </div>
            </div>
            {showScrollHint && (
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
        <ProGate isLocked={!!isProBlock && !proUnlocked} onUnlock={unlock}>
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
        </ProGate>
      )}
      </div>
    </div>
  );
};

export default ComponentCard;

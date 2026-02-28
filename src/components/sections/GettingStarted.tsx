import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import gsap from 'gsap';
import { useRef } from 'react';

const installCode = `npm install gsap @gsap/react @studio-freight/lenis`;

const setupCode = `import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

useEffect(() => {
  const lenis = new Lenis({ duration: 1.3 })
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove()
    lenis.destroy()
  }
}, [])`;

const CodeBlock = ({ code, label }: { code: string; label: string }) => {
  const [copied, setCopied] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (btnRef.current) gsap.fromTo(btnRef.current, { scale: 0.9 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-6">
      <span className="font-mono text-[11px] text-kinetic-text-muted mb-2 block">{label}</span>
      <div className="relative rounded-lg overflow-hidden" style={{ border: '1px solid #1a1a1a' }}>
        <button
          ref={btnRef}
          onClick={handleCopy}
          className={`absolute top-3 right-3 font-mono text-[11px] px-3 py-1 rounded z-10 transition-colors ${
            copied ? 'text-kinetic-green' : 'text-kinetic-text-muted'
          }`}
          style={{ border: '1px solid #1a1a1a' }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter
          language="bash"
          style={atomDark}
          customStyle={{
            background: '#0a0a0a',
            margin: 0,
            padding: '20px',
            fontSize: '13px',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

const GettingStarted = () => (
  <section id="getting-started" className="py-24">
    <div className="font-mono text-[11px] text-kinetic-accent tracking-[0.15em] uppercase mb-3">
      GETTING STARTED
    </div>
    <h2 className="font-syne font-extrabold text-4xl text-kinetic-text mb-3">Quick Setup</h2>
    <p className="font-inter font-light text-[15px] text-kinetic-text-muted mb-8">
      Three steps to add motion to your React project.
    </p>
    <div className="border-b border-kinetic-border mb-12" />

    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-xs text-kinetic-accent px-2 py-0.5 rounded" style={{ border: '1px solid rgba(124,58,237,0.3)' }}>1</span>
        <span className="font-inter font-medium text-sm text-kinetic-text">Install dependencies</span>
      </div>
      <CodeBlock code={installCode} label="" />

      <div className="flex items-center gap-3 mb-4 mt-8">
        <span className="font-mono text-xs text-kinetic-accent px-2 py-0.5 rounded" style={{ border: '1px solid rgba(124,58,237,0.3)' }}>2</span>
        <span className="font-inter font-medium text-sm text-kinetic-text">Setup in App.jsx</span>
      </div>
      <CodeBlock code={setupCode} label="" />

      <div className="flex items-center gap-3 mt-8">
        <span className="font-mono text-xs text-kinetic-accent px-2 py-0.5 rounded" style={{ border: '1px solid rgba(124,58,237,0.3)' }}>3</span>
        <span className="font-inter font-medium text-sm text-kinetic-text">Copy any component</span>
      </div>
      <p className="font-inter font-light text-sm text-kinetic-text-muted mt-2 ml-8">
        Browse the components below, click "Code", copy and paste into your project.
      </p>
    </div>
  </section>
);

export default GettingStarted;

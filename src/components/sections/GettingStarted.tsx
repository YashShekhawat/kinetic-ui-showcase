import { useState } from 'react'; // force rebuild
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import gsap from 'gsap';
import { useRef } from 'react';

const installCodeRequired = `# Required — powers all components
npm install gsap @gsap/react`;

const installCodeOptional = `# Optional — only needed for smooth scrolling components
npm install @studio-freight/lenis`;

const setupCode = `// Optional: Add smooth scrolling to your App.tsx
// Only needed if you're using scroll-based components
// (e.g. StickyScrollReveal, HorizontalScroll, ScrollProgressBar)

import Lenis from '@studio-freight/lenis'
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

const usageCode = `// 1. Copy the component file into your project
//    e.g. src/components/animations/TextReveal.tsx

// 2. Import it in your page or layout
import TextReveal from './components/animations/TextReveal';

// 3. Use it in your JSX
export default function HomePage() {
  return (
    <section className="py-24">
      <TextReveal />
    </section>
  );
}`;

const customizationBefore = `// Default TextReveal timing
const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
tl.fromTo(words, 
  { y: '100%' }, 
  { y: '0%', duration: 0.8, stagger: 0.12, ease: 'power4.out' }
);`;

const customizationAfter = `// Customized: slower, bouncier, different delay
const tl = gsap.timeline({ repeat: -1, repeatDelay: 4 });
tl.fromTo(words, 
  { y: '100%' }, 
  { y: '0%', duration: 1.2, stagger: 0.2, ease: 'elastic.out(1, 0.5)' }
);`;

const cleanupCode = `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const MyComponent = () => {
  const ref = useRef(null);

  useEffect(() => {
    // gsap.context scopes all animations to the ref
    const ctx = gsap.context(() => {
      gsap.to('.my-element', { x: 100, duration: 1 });
    }, ref);

    // On unmount, ctx.revert() kills ALL animations
    // created inside this context — no manual cleanup
    return () => ctx.revert();
  }, []);

  return <div ref={ref}>...</div>;
};`;

const structureCode = `src/
├── components/
│   └── animations/
│       ├── TextReveal.tsx
│       ├── SpotlightCard.tsx
│       ├── LiquidFillButton.tsx
│       ├── ParticleField.tsx
│       └── ...
├── pages/
│   └── index.tsx
└── App.tsx`;

const CodeBlock = ({ code, label, language = 'tsx' }: { code: string; label: string; language?: string }) => {
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
      {label && <span className="font-mono text-[11px] text-kinetic-text-muted mb-2 block">{label}</span>}
      <div className="relative rounded-lg overflow-hidden" style={{ border: '1px solid #1a1a2e' }}>
        <button
          ref={btnRef}
          onClick={handleCopy}
          className={`absolute top-3 right-3 font-mono text-[11px] px-3 py-1 rounded z-10 transition-colors ${
            copied ? 'text-kinetic-green' : 'text-kinetic-text-muted'
          }`}
          style={{ border: '1px solid #1a1a2e' }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter
          language={language}
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
    </div>
  );
};

const StepNumber = ({ num }: { num: number }) => (
  <span
    className="font-mono text-xs text-kinetic-accent px-2 py-0.5 rounded"
    style={{ border: '1px solid rgba(124,58,237,0.3)' }}
  >
    {num}
  </span>
);

const GettingStarted = () => (
  <section id="getting-started" className="py-24">
    <div className="font-mono text-[11px] text-kinetic-accent tracking-[0.15em] uppercase mb-3">
      GETTING STARTED
    </div>
    <h2 className="font-syne font-extrabold text-4xl text-kinetic-text mb-3">Quick Setup</h2>
    <p className="font-inter font-light text-[15px] text-kinetic-text-muted mb-8">
      Everything you need to start using Kinetic UI components in your React project.
    </p>
    <div className="border-b mb-12" style={{ borderImage: 'linear-gradient(to right, transparent, #2a2a3e, transparent) 1' }} />

    <div className="max-w-2xl">
      {/* Step 1 */}
      <div className="flex items-center gap-3 mb-4">
        <StepNumber num={1} />
        <span className="font-inter font-medium text-sm text-kinetic-text">Install dependencies</span>
      </div>
      <CodeBlock code={installCodeRequired} label="Required" language="bash" />
      <CodeBlock code={installCodeOptional} label="Optional — for smooth scrolling" language="bash" />

      {/* Step 2 */}
      <div className="flex items-center gap-3 mb-4 mt-10">
        <StepNumber num={2} />
        <span className="font-inter font-medium text-sm text-kinetic-text">Setup smooth scroll (optional)</span>
      </div>
      <p className="font-inter font-light text-sm text-kinetic-text-muted mb-4 ml-8">
        This step is <strong className="text-kinetic-text">only needed if you use scroll-based components</strong> like StickyScrollReveal, HorizontalScroll, or ScrollProgressBar.
        Most components (buttons, cards, text animations, loaders, etc.) work without it.
      </p>
      <CodeBlock code={setupCode} label="" />

      {/* Step 3 — NEW: How to use a component */}
      <div id="usage-guide" className="flex items-center gap-3 mb-4 mt-10">
        <StepNumber num={3} />
        <span className="font-inter font-medium text-sm text-kinetic-text">How to use a component</span>
      </div>
      <p className="font-inter font-light text-sm text-kinetic-text-muted mb-4 ml-8">
        Every component is a <strong className="text-kinetic-text">self-contained React file</strong> — no wrappers, providers, or context needed.
        Just copy the component file, import it, and render. Each component only depends on <code className="font-mono text-xs text-kinetic-accent-light px-1.5 py-0.5 rounded" style={{ background: 'rgba(124,58,237,0.08)' }}>gsap</code> which you already installed in Step 1.
      </p>
      <p className="font-inter font-light text-sm text-kinetic-text-muted mb-4 ml-8">
        Browse any component below, click the <strong className="text-kinetic-text">"Code"</strong> tab, and copy the full source code. Here's an example workflow:
      </p>
      <CodeBlock code={usageCode} label="Example: Using TextReveal in your project" />

      {/* Step 4 — NEW: Customization */}
      <div className="flex items-center gap-3 mb-4 mt-10">
        <StepNumber num={4} />
        <span className="font-inter font-medium text-sm text-kinetic-text">Customize animations</span>
      </div>
      <p className="font-inter font-light text-sm text-kinetic-text-muted mb-4 ml-8">
        Every animation is plain GSAP — tweak <code className="font-mono text-xs text-kinetic-accent-light px-1.5 py-0.5 rounded" style={{ background: 'rgba(124,58,237,0.08)' }}>duration</code>,{' '}
        <code className="font-mono text-xs text-kinetic-accent-light px-1.5 py-0.5 rounded" style={{ background: 'rgba(124,58,237,0.08)' }}>stagger</code>,{' '}
        <code className="font-mono text-xs text-kinetic-accent-light px-1.5 py-0.5 rounded" style={{ background: 'rgba(124,58,237,0.08)' }}>ease</code>, colors, and text directly in the component file.
      </p>
      <CodeBlock code={customizationBefore} label="Before — default timing" />
      <CodeBlock code={customizationAfter} label="After — customized timing" />

      <p className="font-inter font-light text-sm text-kinetic-text-muted mb-4 ml-8 mt-4">
        <strong className="text-kinetic-text">GSAP cleanup pattern:</strong> All components use <code className="font-mono text-xs text-kinetic-accent-light px-1.5 py-0.5 rounded" style={{ background: 'rgba(124,58,237,0.08)' }}>gsap.context()</code> to scope animations and clean them up on unmount. This prevents memory leaks and animation conflicts.
      </p>
      <CodeBlock code={cleanupCode} label="The gsap.context cleanup pattern" />

      {/* Step 5 — NEW: Project structure */}
      <div className="flex items-center gap-3 mb-4 mt-10">
        <StepNumber num={5} />
        <span className="font-inter font-medium text-sm text-kinetic-text">Recommended project structure</span>
      </div>
      <p className="font-inter font-light text-sm text-kinetic-text-muted mb-4 ml-8">
        We recommend placing all animation components in a dedicated folder. All components are fully typed with TypeScript.
      </p>
      <CodeBlock code={structureCode} label="Suggested folder structure" language="bash" />

      <div className="mt-10 p-4 rounded-lg" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
        <p className="font-inter text-sm text-kinetic-text-muted">
          <span className="text-kinetic-accent-light font-medium">💡 Tip:</span> Every component's "Code" tab below contains the{' '}
          <strong className="text-kinetic-text">complete, copy-pasteable source code</strong> — not just a snippet. Copy it directly into your project and it will work out of the box.
        </p>
      </div>
    </div>
  </section>
);

export default GettingStarted;

import { useState, useEffect, useRef, useCallback } from 'react';
import { ClipboardCopy, CheckCheck, ChevronDown, Lightbulb } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';

const sidebarSections = [
  {
    label: 'GETTING STARTED',
    items: ['Introduction', 'Installation', 'How it works'],
  },
  {
    label: 'USAGE',
    items: ['Copy a component', 'Using with Next.js', 'Using with Vite', 'Using with Remix'],
  },
  {
    label: 'ANIMATIONS',
    items: ['GSAP basics', 'Lenis scroll', 'Custom timing'],
  },
  {
    label: 'FAQ',
    items: ['Common questions'],
  },
];

const toId = (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      className="relative mt-4"
      style={{
        background: '#0a0a0f',
        border: '1px solid #1e1e2e',
        borderRadius: 8,
        padding: '16px 20px',
      }}
    >
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 flex items-center justify-center"
        style={{ color: copied ? '#22c55e' : '#505060', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        {copied ? <CheckCheck size={14} /> : <ClipboardCopy size={14} />}
      </button>
      <pre className="font-mono text-[13px]" style={{ color: '#a78bfa', margin: 0, whiteSpace: 'pre-wrap' }}>
        {code}
      </pre>
    </div>
  );
};

const mobilePills = [
  { label: 'Introduction', id: 'introduction' },
  { label: 'Installation', id: 'installation' },
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Copy a component', id: 'copy-a-component' },
  { label: 'Next.js', id: 'using-with-nextjs' },
  { label: 'Vite', id: 'using-with-vite' },
  { label: 'Remix', id: 'using-with-remix' },
  { label: 'GSAP basics', id: 'gsap-basics' },
  { label: 'Lenis', id: 'lenis-scroll' },
  { label: 'Custom timing', id: 'custom-timing' },
  { label: 'FAQ', id: 'common-questions' },
];

const allSectionIds = mobilePills.map((p) => p.id);

const faqItems = [
  { q: 'Is this a package or copy-paste?', a: 'Copy-paste only. There is no npm package to install. You copy the component source code directly into your project and own it completely.' },
  { q: 'Do I need to know GSAP?', a: 'No. Just copy and paste the component. If you want to customize animations later, the GSAP docs are excellent and all components are well commented.' },
  { q: 'Will this work with TypeScript?', a: 'Yes. Every component is written in TypeScript with full type safety.' },
  { q: 'Can I use this in a commercial project?', a: 'Free components can be used in any project. Pro components require a Pro license which includes commercial use.' },
  { q: 'What if a component breaks after a GSAP update?', a: 'GSAP has an excellent track record for backwards compatibility. If you do hit an issue, all components pin to a specific GSAP version in their import.' },
  { q: 'Do I need to credit Kinetic UI?', a: 'No attribution required, though it\'s always appreciated.' },
  { q: 'What React version is required?', a: 'React 18 or higher. All components use modern React patterns including hooks and concurrent features.' },
];

const DocsPage = () => {
  const [active, setActive] = useState('introduction');
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const isManualScroll = useRef(false);

  const handleNav = useCallback((item: string) => {
    const id = typeof item === 'string' && item.includes('-') ? item : toId(item);
    isManualScroll.current = true;
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { isManualScroll.current = false; }, 1000);
  }, []);

  // scroll active pill into view
  useEffect(() => {
    if (!pillsRef.current) return;
    const activeEl = pillsRef.current.querySelector(`[data-pill="${active}"]`) as HTMLElement;
    if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [active]);

  useEffect(() => {
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
  }, []);

  // IntersectionObserver for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    allSectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#0e0e14' }}>
      <TopBar search={search} onSearchChange={setSearch} placeholder="Search docs..." items={[]} categories={[]} />

      {/* Sidebar */}
      <aside
        className="hidden lg:block fixed top-12 left-0 bottom-0"
        style={{
          width: 240,
          background: '#0d0d14',
          borderRight: '1px solid #1e1e2e',
          padding: '32px 0',
          overflowY: 'auto',
          zIndex: 40,
        }}
      >
        <div style={{ padding: '0 24px', marginBottom: 24 }}>
          <span className="font-mono font-bold text-[13px]" style={{ color: '#7c3aed', letterSpacing: '0.12em' }}>
            DOCS
          </span>
        </div>

        {sidebarSections.map((section) => (
          <div key={section.label}>
            <div
              className="font-mono text-[9px] uppercase"
              style={{ color: '#404050', letterSpacing: '0.2em', padding: '16px 24px 6px' }}
            >
              {section.label}
            </div>
            {section.items.map((item) => {
              const id = toId(item);
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNav(item)}
                  className="block w-full text-left font-inter text-[13px] transition-colors duration-150"
                  style={{
                    padding: '6px 24px',
                    color: isActive ? '#f0ede8' : '#606070',
                    borderLeft: isActive ? '2px solid #7c3aed' : '2px solid transparent',
                    background: isActive ? 'rgba(124,58,237,0.05)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = '#a0a0b8';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = '#606070';
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        ))}
      </aside>

      {/* Content */}
      <main
        className="lg:ml-[240px] docs-main"
        style={{ maxWidth: 740, padding: '48px 48px 96px' }}
      >
        {/* Mobile pill nav */}
        <div
          ref={pillsRef}
          className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-8 -mx-1 px-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {mobilePills.map((pill) => {
            const isActive = active === pill.id;
            return (
              <button
                key={pill.id}
                data-pill={pill.id}
                onClick={() => handleNav(pill.id)}
                className="font-mono text-[10px] whitespace-nowrap flex-shrink-0"
                style={{
                  letterSpacing: '0.1em',
                  padding: '4px 12px',
                  borderRadius: 20,
                  background: isActive ? 'rgba(124,58,237,0.15)' : '#0d0d14',
                  border: `1px solid ${isActive ? '#7c3aed' : '#1e1e2e'}`,
                  color: isActive ? '#a78bfa' : '#606070',
                  transition: 'all 0.2s',
                }}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        <div className="pt-12 lg:pt-12">
          {/* Hero */}
          <span
            className="inline-block font-mono text-[10px] uppercase px-3 py-1 rounded mb-5"
            style={{
              color: '#a78bfa',
              border: '1px solid rgba(124,58,237,0.3)',
              letterSpacing: '0.2em',
            }}
          >
            DOCUMENTATION
          </span>

          <h1
            className="font-syne font-extrabold leading-[1.1]"
            style={{ fontSize: '2.4rem', color: '#f0ede8' }}
          >
            Get started in minutes.
          </h1>

          <p
            className="font-inter font-light"
            style={{
              color: '#909098',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              maxWidth: 540,
              marginTop: 12,
            }}
          >
            Kinetic UI is copy-paste. No package to install, no CLI, no config.
            Find a component you like, copy the code, drop it in your project.
          </p>
        </div>

        {/* Introduction */}
        <section id="introduction" style={{ marginTop: 48, scrollMarginTop: 80 }}>
          <span
            className="font-mono text-[10px] uppercase"
            style={{ color: '#a78bfa', letterSpacing: '0.2em' }}
          >
            GETTING STARTED
          </span>
          <h2 className="font-syne font-bold" style={{ fontSize: '1.5rem', color: '#f0ede8', marginTop: 12 }}>
            What is Kinetic UI?
          </h2>
          <p className="font-inter font-light" style={{ color: '#909098', fontSize: '0.95rem', lineHeight: 1.7, marginTop: 12 }}>
            Kinetic UI is a collection of animated React components and page blocks powered by GSAP. Every component is copy-paste ready — there is no npm package. You pick what you need, copy the source code, and drop it directly into your project.
          </p>
          <p className="font-inter font-light" style={{ color: '#909098', fontSize: '0.95rem', lineHeight: 1.7, marginTop: 12 }}>
            All components are built with React, GSAP, and Tailwind CSS. They work with any React framework including Next.js, Vite, Remix, and Astro.
          </p>
        </section>

        {/* Installation */}
        <section id="installation" style={{ marginTop: 48, scrollMarginTop: 80 }}>
          <h2 className="font-syne font-bold" style={{ fontSize: '1.5rem', color: '#f0ede8' }}>
            Installation
          </h2>
          <p className="font-inter font-light" style={{ color: '#909098', fontSize: '0.95rem', lineHeight: 1.7, marginTop: 12 }}>
            You only need two dependencies. Install them once and every Kinetic UI component will work.
          </p>
          <CodeBlock code={'npm install gsap\nnpm install tailwindcss'} />
          <div className="flex items-center gap-4 my-4">
            <div style={{ flex: 1, height: 1, background: '#1e1e2e' }} />
            <span className="font-mono text-[11px]" style={{ color: '#404050' }}>or using yarn</span>
            <div style={{ flex: 1, height: 1, background: '#1e1e2e' }} />
          </div>
          <CodeBlock code={'yarn add gsap\nyarn add tailwindcss'} />
          <p className="font-inter font-light" style={{ color: '#606070', fontSize: '0.85rem', lineHeight: 1.6, marginTop: 12 }}>
            If you already have Tailwind set up in your project, you only need to install gsap.
          </p>
        </section>

        {/* How it works */}
        <section id="how-it-works" style={{ marginTop: 48, scrollMarginTop: 80 }}>
          <h2 className="font-syne font-bold" style={{ fontSize: '1.5rem', color: '#f0ede8' }}>
            How it works
          </h2>
          <div className="flex flex-col gap-6 mt-6">
            {[
              { n: '1', title: 'Find a component', desc: 'Browse the Components or Blocks section. Preview every component live before copying.' },
              { n: '2', title: 'Copy the code', desc: 'Click the Code tab on any component. Copy the full source code with one click.' },
              { n: '3', title: 'Drop it in your project', desc: 'Paste the component file into your project. Import it wherever you need it. Done.' },
            ].map((step) => (
              <div key={step.n} className="flex items-start gap-5">
                <span
                  className="font-syne font-extrabold text-[2rem] leading-none flex-shrink-0"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '1.5px #7c3aed',
                  }}
                >
                  {step.n}
                </span>
                <div>
                  <span className="font-syne font-bold text-[15px]" style={{ color: '#f0ede8' }}>
                    {step.title}
                  </span>
                  <p className="font-inter font-light" style={{ color: '#909098', fontSize: '0.9rem', lineHeight: 1.6, marginTop: 4 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Copy a component */}
        <section id="copy-a-component" style={{ marginTop: 48, scrollMarginTop: 80 }}>
          <span
            className="font-mono text-[10px] uppercase"
            style={{ color: '#a78bfa', letterSpacing: '0.2em' }}
          >
            USAGE
          </span>
          <h2 className="font-syne font-bold" style={{ fontSize: '1.5rem', color: '#f0ede8', marginTop: 12 }}>
            Copying a component
          </h2>
          <p className="font-inter font-light" style={{ color: '#909098', fontSize: '0.95rem', lineHeight: 1.7, marginTop: 12 }}>
            Every component on Kinetic UI has a Code tab. Click it to see the full source code, then click Copy to copy it to your clipboard.
          </p>

          {/* Mock ComponentCard diagram */}
          <div
            className="mt-6 relative"
            style={{
              background: '#0d0d12',
              border: '1px solid #2a2a3e',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {/* Mock header */}
            <div
              className="flex items-center justify-between px-4"
              style={{ height: 44, background: '#1e1e2e', borderBottom: '1px solid #2a2a3e' }}
            >
              <span className="font-inter font-medium text-[13px]" style={{ color: '#f0ede8' }}>
                Example Component
              </span>
              <div className="flex items-center gap-1 relative">
                <span className="font-mono text-[11px] px-2 py-0.5 rounded" style={{ color: '#707080' }}>
                  Preview
                </span>
                <span
                  className="font-mono text-[11px] px-2 py-0.5 rounded"
                  style={{
                    color: '#f0ede8',
                    boxShadow: '0 0 0 1px #7c3aed, 0 0 8px rgba(124,58,237,0.3)',
                    borderRadius: 4,
                  }}
                >
                  Code
                </span>
                {/* Arrow */}
                <div
                  className="absolute font-mono text-[10px]"
                  style={{
                    top: -28,
                    right: -8,
                    color: '#a78bfa',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ← Click here
                </div>
              </div>
            </div>
            {/* Mock code lines */}
            <div style={{ padding: '16px 20px' }}>
              {[
                'import { useEffect, useRef } from "react";',
                'import gsap from "gsap";',
                '',
                'const AnimatedBox = () => {',
                '  const ref = useRef<HTMLDivElement>(null);',
                '  useEffect(() => {',
                '    gsap.to(ref.current, { y: -20 });',
                '  }, []);',
                '  return <div ref={ref} />;',
                '};',
              ].map((line, i) => (
                <div key={i} className="font-mono text-[11px]" style={{ color: line ? '#606070' : 'transparent', lineHeight: 1.8 }}>
                  {line || '\u00A0'}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Using with Next.js */}
        <section id="using-with-nextjs" style={{ marginTop: 48, scrollMarginTop: 80 }}>
          <h2 className="font-syne font-bold" style={{ fontSize: '1.5rem', color: '#f0ede8' }}>
            Using with Next.js
          </h2>
          <p className="font-inter font-light" style={{ color: '#909098', fontSize: '0.95rem', lineHeight: 1.7, marginTop: 12 }}>
            Kinetic UI components work with Next.js App Router and Pages Router. Because components use browser APIs (GSAP, window), add the <code className="font-mono text-[13px]" style={{ color: '#a78bfa' }}>'use client'</code> directive at the top of any file that uses them.
          </p>
          <CodeBlock code={`'use client';

import KineticHero from '@/components/KineticHero';

export default function Page() {
  return <KineticHero />;
}`} />
          <p className="font-inter font-light" style={{ color: '#606070', fontSize: '0.85rem', lineHeight: 1.6, marginTop: 12 }}>
            You do not need to add 'use client' to layout.tsx or page.tsx if you import the component into a separate client component file.
          </p>
        </section>

        {/* Using with Vite */}
        <section id="using-with-vite" style={{ marginTop: 48, scrollMarginTop: 80 }}>
          <h2 className="font-syne font-bold" style={{ fontSize: '1.5rem', color: '#f0ede8' }}>
            Using with Vite
          </h2>
          <p className="font-inter font-light" style={{ color: '#909098', fontSize: '0.95rem', lineHeight: 1.7, marginTop: 12 }}>
            Vite is the simplest setup. Components work out of the box with no extra configuration needed.
          </p>
          <CodeBlock code={`import KineticHero from './components/KineticHero';

function App() {
  return <KineticHero />;
}`} />
        </section>

        {/* Using with Remix */}
        <section id="using-with-remix" style={{ marginTop: 48, scrollMarginTop: 80 }}>
          <h2 className="font-syne font-bold" style={{ fontSize: '1.5rem', color: '#f0ede8' }}>
            Using with Remix
          </h2>
          <p className="font-inter font-light" style={{ color: '#909098', fontSize: '0.95rem', lineHeight: 1.7, marginTop: 12 }}>
            In Remix, GSAP animations that rely on window or document need to run inside useEffect to avoid SSR errors. All Kinetic UI components already handle this — they check for window before initializing GSAP.
          </p>
          <CodeBlock code={`import KineticHero from '~/components/KineticHero';

export default function Index() {
  return <KineticHero />;
}`} />
        </section>

        {/* GSAP basics */}
        <section id="gsap-basics" style={{ marginTop: 48, scrollMarginTop: 80 }}>
          <span
            className="font-mono text-[10px] uppercase"
            style={{ color: '#a78bfa', letterSpacing: '0.2em' }}
          >
            ANIMATIONS
          </span>
          <h2 className="font-syne font-bold" style={{ fontSize: '1.5rem', color: '#f0ede8', marginTop: 12 }}>
            GSAP basics
          </h2>
          <p className="font-inter font-light" style={{ color: '#909098', fontSize: '0.95rem', lineHeight: 1.7, marginTop: 12 }}>
            All animations in Kinetic UI use GSAP. You do not need to know GSAP to use the components — just copy and paste. But if you want to customize the animations, here are the key concepts.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {[
              { title: 'gsap.to()', desc: 'Animates an element to a set of values. The most common GSAP method.', code: "gsap.to(element, { opacity: 1, y: 0, duration: 0.6 });" },
              { title: 'gsap.fromTo()', desc: 'Animates from a starting state to an ending state. Used for entrance animations.', code: "gsap.fromTo(el, { opacity: 0 }, { opacity: 1 });" },
              { title: 'useGSAP()', desc: 'React hook from @gsap/react that handles cleanup automatically on unmount.', code: "useGSAP(() => { gsap.to(ref.current, { x: 100 }); }, []);" },
              { title: 'ScrollTrigger', desc: 'GSAP plugin that triggers animations based on scroll position.', code: "gsap.to(el, { scrollTrigger: el, opacity: 1 });" },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: '#0d0d12',
                  border: '1px solid #1e1e2e',
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <span className="font-syne font-bold text-[14px]" style={{ color: '#f0ede8' }}>
                  {card.title}
                </span>
                <p className="font-inter font-light" style={{ color: '#909098', fontSize: '0.8rem', lineHeight: 1.6, marginTop: 6 }}>
                  {card.desc}
                </p>
                <pre
                  className="font-mono text-[11px] mt-3"
                  style={{
                    color: '#a78bfa',
                    background: '#0a0a0f',
                    border: '1px solid #1e1e2e',
                    borderRadius: 6,
                    padding: '8px 12px',
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                  }}
                >
                  {card.code}
                </pre>
              </div>
            ))}
          </div>
        </section>

        {/* Lenis scroll */}
        <section id="lenis-scroll" style={{ marginTop: 48, scrollMarginTop: 80 }}>
          <h2 className="font-syne font-bold" style={{ fontSize: '1.5rem', color: '#f0ede8' }}>
            Lenis smooth scroll
          </h2>
          <p className="font-inter font-light" style={{ color: '#909098', fontSize: '0.95rem', lineHeight: 1.7, marginTop: 12 }}>
            Some Kinetic UI blocks use Lenis for smooth scrolling. If a block requires Lenis, install it:
          </p>
          <CodeBlock code="npm install lenis" />
          <p className="font-inter font-light" style={{ color: '#909098', fontSize: '0.95rem', lineHeight: 1.7, marginTop: 12 }}>
            Wrap your app with the Lenis provider or initialize it in your root layout. All scroll-based animations will automatically become smoother.
          </p>
        </section>

        {/* Custom timing */}
        <section id="custom-timing" style={{ marginTop: 48, scrollMarginTop: 80 }}>
          <h2 className="font-syne font-bold" style={{ fontSize: '1.5rem', color: '#f0ede8' }}>
            Custom timing
          </h2>
          <p className="font-inter font-light" style={{ color: '#909098', fontSize: '0.95rem', lineHeight: 1.7, marginTop: 12 }}>
            Every animation in Kinetic UI can be customized. The two most common things you will want to change are duration and easing.
          </p>

          {/* Duration */}
          <h3 className="font-syne font-semibold" style={{ fontSize: '1.1rem', color: '#f0ede8', marginTop: 24 }}>
            Duration
          </h3>
          <p className="font-inter font-light" style={{ color: '#909098', fontSize: '0.95rem', lineHeight: 1.7, marginTop: 8 }}>
            Duration controls how long an animation takes in seconds. Lower values feel snappy, higher values feel cinematic.
          </p>
          <CodeBlock code={`// Fast — snappy micro-interaction
gsap.to(element, { opacity: 1, duration: 0.2 });

// Medium — standard UI transition  
gsap.to(element, { y: 0, duration: 0.6 });

// Slow — cinematic entrance
gsap.to(element, { scale: 1, duration: 1.2 });`} />

          {/* Easing */}
          <h3 className="font-syne font-semibold" style={{ fontSize: '1.1rem', color: '#f0ede8', marginTop: 24 }}>
            Easing
          </h3>
          <p className="font-inter font-light" style={{ color: '#909098', fontSize: '0.95rem', lineHeight: 1.7, marginTop: 8 }}>
            Easing controls the acceleration curve of an animation. GSAP has a rich set of built-in eases. These are the ones used most in Kinetic UI:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {[
              { label: 'power3.out', desc: 'Starts fast, decelerates smoothly. The default for most entrance animations.', tag: 'Entrances' },
              { label: 'power3.inOut', desc: 'Slow start, fast middle, slow end. Great for elements moving across the screen.', tag: 'Transitions' },
              { label: 'back.out(1.7)', desc: 'Overshoots slightly then settles. Adds personality to buttons and cards.', tag: 'Micro-interactions' },
              { label: 'expo.out', desc: 'Explosive start that decelerates sharply. Used for dramatic reveals.', tag: 'Hero animations' },
            ].map((card) => (
              <div
                key={card.label}
                style={{
                  background: '#0a0a0f',
                  border: '1px solid #1e1e2e',
                  borderRadius: 8,
                  padding: '14px 16px',
                }}
              >
                <span className="font-mono text-[13px]" style={{ color: '#a78bfa' }}>
                  {card.label}
                </span>
                <p className="font-inter font-light" style={{ color: '#909098', fontSize: '0.8rem', lineHeight: 1.6, marginTop: 6 }}>
                  {card.desc}
                </p>
                <span
                  className="font-mono text-[9px] uppercase inline-block"
                  style={{
                    letterSpacing: '0.15em',
                    color: '#7c3aed',
                    border: '1px solid rgba(124,58,237,0.2)',
                    background: 'rgba(124,58,237,0.06)',
                    padding: '2px 8px',
                    borderRadius: 3,
                    marginTop: 8,
                  }}
                >
                  {card.tag}
                </span>
              </div>
            ))}
          </div>

          {/* Stagger */}
          <h3 className="font-syne font-semibold" style={{ fontSize: '1.1rem', color: '#f0ede8', marginTop: 24 }}>
            Stagger
          </h3>
          <p className="font-inter font-light" style={{ color: '#909098', fontSize: '0.95rem', lineHeight: 1.7, marginTop: 8 }}>
            Stagger delays each element in a list by a set amount, creating a cascade effect. Used heavily in Kinetic UI for lists, grids, and word-by-word text reveals.
          </p>
          <CodeBlock code={`// Animate a list of cards one after another
gsap.from('.card', {
  opacity: 0,
  y: 24,
  duration: 0.6,
  stagger: 0.08,
  ease: 'power3.out',
});

// Words in a headline
gsap.from(words, {
  y: '110%',
  duration: 0.7,
  stagger: 0.1,
  ease: 'power4.out',
});`} />

          {/* Overriding */}
          <h3 className="font-syne font-semibold" style={{ fontSize: '1.1rem', color: '#f0ede8', marginTop: 24 }}>
            Overriding animations
          </h3>
          <p className="font-inter font-light" style={{ color: '#909098', fontSize: '0.95rem', lineHeight: 1.7, marginTop: 8 }}>
            Since you own the code, changing any animation is just editing the values directly. Look for the gsap.to() or gsap.fromTo() calls in the component and adjust duration, ease, or stagger to match your brand feel.
          </p>
          <div
            className="flex items-start gap-3"
            style={{
              background: 'rgba(124,58,237,0.06)',
              borderLeft: '3px solid #7c3aed',
              borderRadius: '0 6px 6px 0',
              padding: '12px 16px',
              marginTop: 16,
            }}
          >
            <Lightbulb size={14} style={{ color: '#a78bfa', flexShrink: 0, marginTop: 2 }} />
            <p className="font-inter font-light" style={{ color: '#b0b0c0', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
              A good rule of thumb — if your brand is energetic use durations between 0.3-0.5s with power4.out. If your brand is premium and refined use 0.7-1.2s with power3.inOut.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="common-questions" style={{ marginTop: 48, scrollMarginTop: 80 }}>
          <span
            className="font-mono text-[10px] uppercase"
            style={{ color: '#a78bfa', letterSpacing: '0.2em' }}
          >
            FAQ
          </span>
          <h2 className="font-syne font-bold" style={{ fontSize: '1.5rem', color: '#f0ede8', marginTop: 12 }}>
            Common questions
          </h2>
          <div className="mt-6">
            {faqItems.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} style={{ borderBottom: '1px solid #1e1e2e', padding: '16px 0' }}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between text-left"
                    style={{ background: 'none', border: 'none' }}
                  >
                    <span className="font-syne font-medium" style={{ color: '#f0ede8', fontSize: '0.95rem' }}>
                      {item.q}
                    </span>
                    <ChevronDown
                      size={16}
                      style={{
                        color: '#7c3aed',
                        transition: 'transform 0.2s',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        flexShrink: 0,
                        marginLeft: 12,
                      }}
                    />
                  </button>
                  {isOpen && (
                    <p className="font-inter font-light" style={{ color: '#909098', fontSize: '0.85rem', lineHeight: 1.7, marginTop: 10 }}>
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Mobile responsive override */}
      <style>{`
        @media (max-width: 1023px) {
          .docs-main {
            margin-left: 0 !important;
            padding: 80px 20px 96px !important;
          }
        }
        @media (max-width: 639px) {
          .docs-main {
            padding: 100px 20px 96px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DocsPage;

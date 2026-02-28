import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import LiquidFillButton from '../ui-showcase/LiquidFillButton';
import ArrowSlideButton from '../ui-showcase/ArrowSlideButton';
import MagneticPillButton from '../ui-showcase/MagneticPillButton';
import ShatterButton from '../ui-showcase/ShatterButton';
import BorderDrawButton from '../ui-showcase/BorderDrawButton';
import LoadingButton from '../ui-showcase/LoadingButton';

const buttonComponents = [
  {
    name: 'Liquid Fill Button',
    component: <LiquidFillButton />,
    code: `import { useRef } from 'react';
import gsap from 'gsap';

const LiquidFillButton = () => {
  const fillRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const onEnter = () => {
    gsap.fromTo(fillRef.current, { y: '100%' }, { y: '0%', duration: 0.4, ease: 'power2.out' });
    gsap.to(textRef.current, { color: '#ffffff', duration: 0.3 });
  };

  const onLeave = () => {
    gsap.to(fillRef.current, { y: '-100%', duration: 0.35, ease: 'power2.in' });
    gsap.to(textRef.current, { color: '#a78bfa', duration: 0.3 });
  };

  return (
    <button
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative overflow-hidden font-syne font-bold text-sm px-8 py-3 rounded-md"
      style={{ border: '1px solid #7c3aed', background: 'transparent' }}
    >
      <div
        ref={fillRef}
        className="absolute inset-0 pointer-events-none"
        style={{ background: '#7c3aed', transform: 'translateY(100%)', borderRadius: 'inherit' }}
      />
      <span ref={textRef} className="relative z-10" style={{ color: '#a78bfa' }}>
        Get Started
      </span>
    </button>
  );
};

export default LiquidFillButton;`,
  },
  {
    name: 'Arrow Slide Button',
    component: <ArrowSlideButton />,
    code: `import { useRef } from 'react';
import gsap from 'gsap';

const ArrowSlideButton = () => {
  const currentRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const onEnter = () => {
    gsap.to(currentRef.current, { x: '-110%', opacity: 0, duration: 0.25, ease: 'power2.out' });
    gsap.fromTo(cloneRef.current, { x: '110%', opacity: 0 }, { x: '0%', opacity: 1, duration: 0.25, ease: 'power2.out' });
    if (btnRef.current) btnRef.current.style.borderColor = '#7c3aed';
  };

  const onLeave = () => {
    gsap.to(currentRef.current, { x: '0%', opacity: 1, duration: 0.25, ease: 'power2.out' });
    gsap.to(cloneRef.current, { x: '110%', opacity: 0, duration: 0.25, ease: 'power2.out' });
    if (btnRef.current) btnRef.current.style.borderColor = '#1a1a1a';
  };

  return (
    <button
      ref={btnRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative overflow-hidden font-inter font-medium text-sm px-6 py-3 rounded-md text-[#ededed] transition-colors"
      style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
    >
      <div ref={currentRef} className="flex items-center gap-2">
        <span>Explore Components</span>
        <span>→</span>
      </div>
      <div ref={cloneRef} className="absolute inset-0 flex items-center justify-center gap-2" style={{ opacity: 0 }}>
        <span>Explore Components</span>
        <span>→</span>
      </div>
    </button>
  );
};

export default ArrowSlideButton;`,
  },
  {
    name: 'Magnetic Pill Button',
    component: <MagneticPillButton />,
    code: `import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const MagneticPillButton = () => {
  const btnRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const qx = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const qy = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const qtx = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const qty = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    if (!btnRef.current || !textRef.current) return;
    qx.current = gsap.quickTo(btnRef.current, 'x', { duration: 0.3, ease: 'power2.out' });
    qy.current = gsap.quickTo(btnRef.current, 'y', { duration: 0.3, ease: 'power2.out' });
    qtx.current = gsap.quickTo(textRef.current, 'x', { duration: 0.5, ease: 'power2.out' });
    qty.current = gsap.quickTo(textRef.current, 'y', { duration: 0.5, ease: 'power2.out' });
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const rect = btnRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      const factor = (1 - dist / 100) * 18;
      const nx = (dx / dist) * factor;
      const ny = (dy / dist) * factor;
      qx.current?.(nx);
      qy.current?.(ny);
      qtx.current?.(nx * 0.5);
      qty.current?.(ny * 0.5);
    }
  };

  const onLeave = () => {
    gsap.to(btnRef.current, { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1,0.4)' });
    gsap.to(textRef.current, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,0.4)' });
    if (btnRef.current) {
      btnRef.current.style.boxShadow = 'none';
      btnRef.current.style.background = '#7c3aed';
    }
  };

  const onEnter = () => {
    gsap.to(btnRef.current, { scale: 1.05, duration: 0.3 });
    if (btnRef.current) {
      btnRef.current.style.boxShadow = '0 0 50px rgba(124,58,237,0.4)';
      btnRef.current.style.background = '#8b47ff';
    }
  };

  return (
    <div onMouseMove={onMove} onMouseLeave={onLeave} className="flex items-center justify-center py-8" style={{ minHeight: 120 }}>
      <div
        ref={btnRef}
        onMouseEnter={onEnter}
        className="font-syne font-bold text-base px-10 py-4 rounded-full text-white cursor-pointer select-none"
        style={{ background: '#7c3aed' }}
      >
        <span ref={textRef} className="inline-block">Let's Build →</span>
      </div>
    </div>
  );
};

export default MagneticPillButton;`,
  },
  {
    name: 'Shatter Button',
    component: <ShatterButton />,
    code: `import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const ShatterButton = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const text = 'Click Me';
    const chars = text.split('');

    const runCycle = () => {
      container.innerHTML = '';
      const spans: HTMLSpanElement[] = [];
      chars.forEach(ch => {
        const span = document.createElement('span');
        span.textContent = ch === ' ' ? '\\u00A0' : ch;
        span.style.display = 'inline-block';
        span.style.position = 'relative';
        span.className = 'font-syne font-bold text-sm text-[#ededed]';
        container.appendChild(span);
        spans.push(span);
      });

      const tl = gsap.timeline({
        onComplete: () => { gsap.delayedCall(1.5, runCycle); },
      });
      tlRef.current = tl;

      tl.to(spans, {
        x: () => gsap.utils.random(-150, 150),
        y: () => gsap.utils.random(-150, 150),
        rotation: () => gsap.utils.random(-180, 180),
        opacity: 0, scale: 0,
        stagger: 0.02, duration: 0.6, ease: 'power2.in',
      });

      tl.to(spans, {
        x: 0, y: 0, rotation: 0, opacity: 1, scale: 1,
        stagger: 0.03, duration: 0.8, ease: 'elastic.out(1,0.5)',
      }, '+=0.1');
    };

    runCycle();

    return () => {
      tlRef.current?.kill();
      gsap.killTweensOf(container.children);
    };
  }, []);

  return (
    <div
      className="relative overflow-visible px-6 py-3 rounded-md cursor-pointer inline-flex items-center justify-center"
      style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', minWidth: 140, minHeight: 44 }}
    >
      <div ref={containerRef} className="whitespace-nowrap" />
    </div>
  );
};

export default ShatterButton;`,
  },
  {
    name: 'Border Draw Button',
    component: <BorderDrawButton />,
    code: `import { useRef } from 'react';
import gsap from 'gsap';

const BorderDrawButton = () => {
  const topRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const onEnter = () => {
    tlRef.current?.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;
    tl.fromTo(topRef.current, { width: '0%' }, { width: '100%', duration: 0.15, ease: 'none' });
    tl.fromTo(rightRef.current, { height: '0%' }, { height: '100%', duration: 0.15, ease: 'none' }, '-=0.07');
    tl.fromTo(bottomRef.current, { width: '0%' }, { width: '100%', duration: 0.15, ease: 'none' }, '-=0.07');
    tl.fromTo(leftRef.current, { height: '0%' }, { height: '100%', duration: 0.15, ease: 'none' }, '-=0.07');
  };

  const onLeave = () => {
    tlRef.current?.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;
    tl.to(leftRef.current, { height: '0%', duration: 0.12, ease: 'none' });
    tl.to(bottomRef.current, { width: '0%', duration: 0.12, ease: 'none' }, '-=0.06');
    tl.to(rightRef.current, { height: '0%', duration: 0.12, ease: 'none' }, '-=0.06');
    tl.to(topRef.current, { width: '0%', duration: 0.12, ease: 'none' }, '-=0.06');
  };

  return (
    <button
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative px-6 py-3 font-inter font-medium text-sm text-[#ededed] cursor-pointer"
      style={{ background: 'transparent' }}
    >
      <div ref={topRef} className="absolute top-0 left-0 h-[1.5px] bg-[#7c3aed]" style={{ width: 0 }} />
      <div ref={rightRef} className="absolute top-0 right-0 w-[1.5px] bg-[#7c3aed]" style={{ height: 0 }} />
      <div ref={bottomRef} className="absolute bottom-0 right-0 h-[1.5px] bg-[#7c3aed]" style={{ width: 0 }} />
      <div ref={leftRef} className="absolute bottom-0 left-0 w-[1.5px] bg-[#7c3aed]" style={{ height: 0 }} />
      View Docs
    </button>
  );
};

export default BorderDrawButton;`,
  },
  {
    name: 'Loading Button',
    component: <LoadingButton />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const LoadingButton = () => {
  const btnRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<HTMLSpanElement>(null);
  const doneRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const run = () => {
      const btn = btnRef.current!;
      const text = textRef.current!;
      const dots = dotsRef.current!;
      const check = checkRef.current!;
      const done = doneRef.current!;

      const tl = gsap.timeline({ onComplete: () => gsap.delayedCall(1.5, run) });
      tlRef.current = tl;

      tl.set(text, { opacity: 1 });
      tl.set(dots, { opacity: 0, display: 'none' });
      tl.set(check, { opacity: 0, scale: 0 });
      tl.set(done, { opacity: 0 });
      tl.set(btn, { background: '#7c3aed' });

      tl.to(text, { opacity: 0, duration: 0.2 }, '+=1');
      tl.set(dots, { display: 'flex', opacity: 1 });
      tl.to(btn, { background: '#5b21b6', duration: 0.3 }, '<');

      const dotEls = dots.children;
      tl.fromTo(dotEls, { scale: 0.5, opacity: 0.3 }, {
        scale: 1, opacity: 1, stagger: { each: 0.15, repeat: 3, yoyo: true },
        duration: 0.3, ease: 'sine.inOut',
      });

      tl.to(dots, { opacity: 0, duration: 0.2 });
      tl.to(btn, { background: '#22c55e', duration: 0.3 }, '<');
      tl.fromTo(check, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'elastic.out(1,0.5)' });
      tl.to(done, { opacity: 1, duration: 0.2 }, '-=0.2');

      tl.to({}, { duration: 1 });
      tl.to([check, done], { opacity: 0, duration: 0.2 });
      tl.to(btn, { background: '#7c3aed', duration: 0.2 });
      tl.to(text, { opacity: 1, duration: 0.2 });
    };

    run();
    return () => { tlRef.current?.kill(); };
  }, []);

  return (
    <div
      ref={btnRef}
      className="relative inline-flex items-center justify-center px-6 py-3 rounded-md text-white cursor-pointer select-none overflow-hidden"
      style={{ background: '#7c3aed', minWidth: 160, height: 44 }}
    >
      <span ref={textRef} className="font-inter font-medium text-sm">Submit Project</span>
      <div ref={dotsRef} className="absolute flex gap-1.5" style={{ display: 'none', opacity: 0 }}>
        <div className="w-2 h-2 rounded-full bg-white" />
        <div className="w-2 h-2 rounded-full bg-white" />
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>
      <span ref={checkRef} className="absolute text-white text-lg font-bold" style={{ opacity: 0 }}>✓</span>
      <span ref={doneRef} className="absolute text-white font-inter font-medium text-sm mt-6" style={{ opacity: 0 }}>Done!</span>
    </div>
  );
};

export default LoadingButton;`,
  },
];

const ButtonsSection = () => (
  <section id="buttons" className="py-24">
    <SectionHeader label="BUTTONS" heading="Every Click, Intentional" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {buttonComponents.map(c => (
        <ComponentCard key={c.name} name={c.name} code={c.code} category="buttons">
          {c.component}
        </ComponentCard>
      ))}
    </div>
  </section>
);

export default ButtonsSection;

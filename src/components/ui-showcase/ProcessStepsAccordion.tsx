import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

const steps = [
  {
    num: '01',
    title: 'Install',
    desc: 'Run a single npm command to add GSAP to your project. No other dependencies needed.',
    tags: ['npm', 'gsap', '@gsap/react'],
  },
  {
    num: '02',
    title: 'Import',
    desc: 'Import any component directly into your React file. Each component is fully isolated.',
    tags: ['import', 'React', 'ESM'],
  },
  {
    num: '03',
    title: 'Customize',
    desc: 'Every animation value is exposed as a prop. Adjust duration, easing, delay and colors.',
    tags: ['props', 'config', 'tokens'],
  },
  {
    num: '04',
    title: 'Ship',
    desc: 'Production optimized. All timelines cleaned up on unmount. No memory leaks, ever.',
    tags: ['performance', 'cleanup', 'prod'],
  },
];

const ProcessStepsAccordion = () => {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<HTMLDivElement[]>([]);
  const rowRefs = useRef<HTMLDivElement[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const switchTo = useCallback((next: number) => {
    if (next === activeStep) return;
    const prev = activeStep;

    // Close prev content
    const prevContent = contentRefs.current[prev];
    if (prevContent) {
      gsap.to(prevContent, { height: 0, duration: 0.3, ease: 'power2.in', overflow: 'hidden' });
    }
    // Prev row colors
    const prevRow = rowRefs.current[prev];
    if (prevRow) {
      gsap.to(prevRow.querySelector('.step-num')!, { color: '#303040', duration: 0.2 });
      gsap.to(prevRow.querySelector('.step-title')!, { color: '#606070', duration: 0.2 });
      gsap.to(prevRow.querySelector('.step-icon')!, { rotation: 0, duration: 0.3, ease: 'power2.out' });
    }

    // Open next content
    const nextContent = contentRefs.current[next];
    if (nextContent) {
      // Measure
      gsap.set(nextContent, { height: 'auto', overflow: 'hidden' });
      const h = nextContent.scrollHeight;
      gsap.fromTo(nextContent, { height: 0 }, { height: h, duration: 0.4, ease: 'power2.out' });
      // Fade in inner text
      const inner = nextContent.querySelector('.step-inner');
      if (inner) {
        gsap.fromTo(inner, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, delay: 0.2, ease: 'power2.out' });
      }
    }
    // Next row colors
    const nextRow = rowRefs.current[next];
    if (nextRow) {
      gsap.to(nextRow.querySelector('.step-num')!, { color: '#7c3aed', duration: 0.2 });
      gsap.to(nextRow.querySelector('.step-title')!, { color: '#ededed', duration: 0.2 });
      gsap.to(nextRow.querySelector('.step-icon')!, { rotation: 45, duration: 0.3, ease: 'power2.out' });
    }

    // Counter flip
    if (counterRef.current) {
      gsap.to(counterRef.current, {
        yPercent: -100, duration: 0.2, ease: 'power2.in',
        onComplete: () => {
          setActiveStep(next);
          gsap.set(counterRef.current!, { yPercent: 100 });
          gsap.to(counterRef.current!, { yPercent: 0, duration: 0.2, ease: 'power2.out' });
        },
      });
    } else {
      setActiveStep(next);
    }

    // Progress
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        height: `${((next + 1) / steps.length) * 100}%`,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, [activeStep]);

  // Auto-advance
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveStep(prev => {
        const next = (prev + 1) % steps.length;
        switchTo(next);
        return prev;
      });
    }, 3500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [switchTo]);

  const handleClick = (i: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    switchTo(i);
    intervalRef.current = setInterval(() => {
      setActiveStep(prev => {
        const next = (prev + 1) % steps.length;
        switchTo(next);
        return prev;
      });
    }, 3500);
  };

  // Entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(headingRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'power4.out' });
      }
      if (descRef.current) {
        gsap.fromTo(descRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.5 });
      }
      rowRefs.current.forEach((row, i) => {
        if (row) gsap.fromTo(row, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.4, delay: 0.4 + i * 0.08, ease: 'power2.out' });
      });
      // Open first step
      const first = contentRefs.current[0];
      if (first) {
        gsap.set(first, { height: 'auto' });
      }
      // First step styles
      const firstRow = rowRefs.current[0];
      if (firstRow) {
        gsap.set(firstRow.querySelector('.step-num')!, { color: '#7c3aed' });
        gsap.set(firstRow.querySelector('.step-title')!, { color: '#ededed' });
        gsap.set(firstRow.querySelector('.step-icon')!, { rotation: 45 });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full" style={{ background: '#0a0a12', padding: '48px 40px', minHeight: 460 }}>
      <div className="flex gap-12" style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Left column */}
        <div className="flex-shrink-0" style={{ width: '40%' }}>
          <span
            className="font-mono text-[10px] inline-block px-3 py-1 rounded mb-4"
            style={{ color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.06)' }}
          >
            PROCESS
          </span>
          <div className="overflow-hidden">
            <div ref={headingRef}>
              <h2 className="font-syne font-extrabold" style={{ fontSize: '2.4rem', color: '#ededed', lineHeight: 1.1 }}>
                How it works.
              </h2>
            </div>
          </div>
          <p ref={descRef} className="font-inter font-light mt-4 opacity-0" style={{ fontSize: 13, color: '#606070', lineHeight: 1.7, maxWidth: 240 }}>
            Four simple steps from installation to a production-ready animated interface.
          </p>

          {/* Counter */}
          <div className="mt-8 overflow-hidden" style={{ height: '5rem' }}>
            <span ref={counterRef} className="font-syne font-extrabold block" style={{ fontSize: '5rem', color: '#ededed', lineHeight: 1 }}>
              {String(activeStep + 1).padStart(2, '0')}
            </span>
          </div>
          <span className="font-syne" style={{ fontSize: '1.5rem', color: '#303040' }}>/ 04</span>

          {/* Progress line */}
          <div className="mt-6" style={{ width: 2, height: 80, background: '#1a1a2e', borderRadius: 1, position: 'relative' }}>
            <div
              ref={progressRef}
              style={{ width: '100%', height: '25%', background: '#7c3aed', borderRadius: 1, position: 'absolute', top: 0 }}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={el => { if (el) rowRefs.current[i] = el; }}
              className="opacity-0 cursor-pointer"
              style={{
                borderTop: '1px solid #1a1a2e',
                ...(i === steps.length - 1 ? { borderBottom: '1px solid #1a1a2e' } : {}),
              }}
              onClick={() => handleClick(i)}
            >
              <div className="flex items-center gap-4" style={{ padding: '20px 0' }}>
                <span className="step-num font-mono text-[11px]" style={{ color: '#303040' }}>{step.num}</span>
                <span className="step-title font-syne font-semibold flex-1" style={{ fontSize: '1rem', color: '#606070' }}>{step.title}</span>
                <div className="step-icon relative" style={{ width: 16, height: 16 }}>
                  <div className="absolute" style={{ top: '50%', left: 0, width: 16, height: 1, background: '#303040', transform: 'translateY(-50%)' }} />
                  <div className="absolute" style={{ left: '50%', top: 0, width: 1, height: 16, background: '#303040', transform: 'translateX(-50%)' }} />
                </div>
              </div>
              <div
                ref={el => { if (el) contentRefs.current[i] = el; }}
                style={{ height: i === 0 ? 'auto' : 0, overflow: 'hidden' }}
              >
                <div className="step-inner" style={{ paddingLeft: 32, paddingBottom: 28 }}>
                  <p className="font-inter font-light" style={{ fontSize: 13, color: '#606070', lineHeight: 1.7, maxWidth: 340, marginBottom: 16 }}>
                    {step.desc}
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    {step.tags.map(tag => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] inline-flex px-2 py-1 rounded"
                        style={{ color: '#505060', border: '1px solid #1a1a2e' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessStepsAccordion;

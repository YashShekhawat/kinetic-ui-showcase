import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

const steps = [
  { num: '01', title: 'Install', desc: 'Run a single npm command to add GSAP to your project. No other dependencies needed.', tags: ['npm', 'gsap', '@gsap/react'] },
  { num: '02', title: 'Import', desc: 'Import any component directly into your React file. Each component is fully isolated.', tags: ['import', 'React', 'ESM'] },
  { num: '03', title: 'Customize', desc: 'Every animation value is exposed as a prop. Adjust duration, easing, delay and colors.', tags: ['props', 'config', 'tokens'] },
  { num: '04', title: 'Ship', desc: 'Production optimized. All timelines cleaned up on unmount. No memory leaks, ever.', tags: ['performance', 'cleanup', 'prod'] },
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
  const isMobile = useIsMobile();

  const switchTo = useCallback((next: number) => {
    if (next === activeStep) return;
    const prev = activeStep;

    const prevContent = contentRefs.current[prev];
    if (prevContent) gsap.to(prevContent, { height: 0, duration: 0.3, ease: 'power2.in', overflow: 'hidden' });
    const prevRow = rowRefs.current[prev];
    if (prevRow) {
      gsap.to(prevRow.querySelector('.step-num')!, { color: '#303040', duration: 0.2 });
      gsap.to(prevRow.querySelector('.step-title')!, { color: '#606070', duration: 0.2 });
      gsap.to(prevRow.querySelector('.step-icon')!, { rotation: 0, duration: 0.3, ease: 'power2.out' });
    }

    const nextContent = contentRefs.current[next];
    if (nextContent) {
      gsap.set(nextContent, { height: 'auto', overflow: 'hidden' });
      const h = nextContent.scrollHeight;
      gsap.fromTo(nextContent, { height: 0 }, { height: h, duration: 0.4, ease: 'power2.out' });
      const inner = nextContent.querySelector('.step-inner');
      if (inner) gsap.fromTo(inner, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, delay: 0.2, ease: 'power2.out' });
    }
    const nextRow = rowRefs.current[next];
    if (nextRow) {
      gsap.to(nextRow.querySelector('.step-num')!, { color: '#7c3aed', duration: 0.2 });
      gsap.to(nextRow.querySelector('.step-title')!, { color: '#ededed', duration: 0.2 });
      gsap.to(nextRow.querySelector('.step-icon')!, { rotation: 45, duration: 0.3, ease: 'power2.out' });
    }

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

    if (progressRef.current) {
      gsap.to(progressRef.current, { height: `${((next + 1) / steps.length) * 100}%`, duration: 0.4, ease: 'power2.out' });
    }
  }, [activeStep]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveStep(prev => { const next = (prev + 1) % steps.length; switchTo(next); return prev; });
    }, 3500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [switchTo]);

  const handleClick = (i: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    switchTo(i);
    intervalRef.current = setInterval(() => {
      setActiveStep(prev => { const next = (prev + 1) % steps.length; switchTo(next); return prev; });
    }, 3500);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) gsap.fromTo(headingRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'power4.out' });
      if (descRef.current) gsap.fromTo(descRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.5 });
      rowRefs.current.forEach((row, i) => {
        if (row) gsap.fromTo(row, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.4, delay: 0.4 + i * 0.08, ease: 'power2.out' });
      });
      const first = contentRefs.current[0];
      if (first) gsap.set(first, { height: 'auto' });
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
    <div ref={containerRef} className="w-full" style={{ background: '#0a0a12', padding: '48px 20px', pointerEvents: 'none' }}>
      <div className="flex flex-col md:flex-row gap-8 md:gap-12" style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Left column — hidden on mobile, replaced by compact header */}
        {isMobile ? (
          <div style={{ marginBottom: 16 }}>
            <span
              className="font-mono text-[10px] inline-block px-3 py-1 rounded"
              style={{ color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.06)', marginBottom: 8, display: 'inline-block' }}
            >
              PROCESS
            </span>
            <div className="overflow-hidden">
              <div ref={headingRef}>
                <h2 className="font-syne font-extrabold" style={{ fontSize: 'clamp(1.2rem, 5vw, 1.6rem)', color: '#ededed', lineHeight: 1.1 }}>
                  How it works.
                </h2>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-shrink-0 w-full md:w-[40%] flex flex-col">
            <span
              className="font-mono text-[10px] inline-block px-3 py-1 rounded self-start"
              style={{ color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.06)' }}
            >
              PROCESS
            </span>
            <div style={{ height: 12 }} />
            <div className="overflow-hidden">
              <div ref={headingRef}>
                <h2 className="font-syne font-extrabold" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', color: '#ededed', lineHeight: 1.1 }}>
                  How it works.
                </h2>
              </div>
            </div>
            <div style={{ height: 12 }} />
            <p ref={descRef} className="font-inter font-light opacity-0" style={{ fontSize: 13, color: '#606070', lineHeight: 1.7, maxWidth: 240 }}>
              Four simple steps from installation to a production-ready animated interface.
            </p>
            <div style={{ height: 24 }} />
            <div className="overflow-hidden" style={{ height: '4rem' }}>
              <span ref={counterRef} className="font-syne font-extrabold block" style={{ fontSize: '4rem', color: '#ededed', lineHeight: 1 }}>
                {String(activeStep + 1).padStart(2, '0')}
              </span>
            </div>
            <span className="font-syne text-lg" style={{ color: '#303040' }}>/ 04</span>
            <div style={{ height: 16 }} />
            <div style={{ width: 2, background: '#1a1a2e', borderRadius: 1, position: 'relative', flexGrow: 1, minHeight: 40 }}>
              <div ref={progressRef} style={{ width: '100%', height: '25%', background: '#7c3aed', borderRadius: 1, position: 'absolute', top: 0 }} />
            </div>
          </div>
        )}

        {/* Right column — full width on mobile */}
        <div className="flex-1">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={el => { if (el) rowRefs.current[i] = el; }}
              className="opacity-0 cursor-pointer"
              style={{
                borderTop: '1px solid #1a1a2e',
                ...(i === steps.length - 1 ? { borderBottom: '1px solid #1a1a2e' } : {}),
                pointerEvents: 'auto',
              }}
              onClick={() => handleClick(i)}
            >
              <div className="flex items-center gap-4" style={{ padding: isMobile ? '14px 0' : '20px 0' }}>
                <span className="step-num font-mono" style={{ fontSize: isMobile ? '0.7rem' : 11, color: '#303040' }}>{step.num}</span>
                <span className="step-title font-syne font-semibold flex-1" style={{ fontSize: isMobile ? '0.9rem' : '1rem', color: '#606070' }}>{step.title}</span>
                <div className="step-icon relative" style={{ width: 16, height: 16 }}>
                  <div className="absolute" style={{ top: '50%', left: 0, width: 16, height: 1, background: '#303040', transform: 'translateY(-50%)' }} />
                  <div className="absolute" style={{ left: '50%', top: 0, width: 1, height: 16, background: '#303040', transform: 'translateX(-50%)' }} />
                </div>
              </div>
              <div
                ref={el => { if (el) contentRefs.current[i] = el; }}
                style={{ height: i === 0 ? 'auto' : 0, overflow: 'hidden' }}
              >
                <div className="step-inner" style={{ paddingLeft: isMobile ? 24 : 32, paddingBottom: isMobile ? 20 : 28 }}>
                  <p className="font-inter font-light" style={{ fontSize: isMobile ? '0.75rem' : 13, color: '#606070', lineHeight: 1.7, maxWidth: 340, marginBottom: 16 }}>
                    {step.desc}
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    {step.tags.map(tag => (
                      <span
                        key={tag}
                        className="font-mono inline-flex rounded"
                        style={{ fontSize: isMobile ? 9 : 10, color: '#505060', border: '1px solid #1a1a2e', padding: isMobile ? '2px 6px' : '4px 8px' }}
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

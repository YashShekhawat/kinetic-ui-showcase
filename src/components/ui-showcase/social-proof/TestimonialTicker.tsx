import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

const testimonials = [
  { quote: "This is the first component library that actually made our animations feel intentional. We shipped 3x faster.", name: "Alex Johnson", role: "Frontend Lead at Vercel", initials: "AJ" },
  { quote: "Kinetic UI replaced our entire custom animation system. The GSAP integration is flawless.", name: "Sarah Chen", role: "Creative Director", initials: "SC" },
  { quote: "Finally a library that respects both performance and aesthetics. Every component is production ready.", name: "Marcus Webb", role: "Senior Engineer", initials: "MW" },
  { quote: "I rebuilt our entire landing page using Kinetic UI in a weekend. The results speak for themselves.", name: "Priya Sharma", role: "Indie Developer", initials: "PS" },
  { quote: "The code quality alone is worth it. Clean, documented, and actually understandable by our whole team.", name: "Daniel Torres", role: "Tech Lead", initials: "DT" },
];

const tickerNames = "Alex Johnson · Sarah Chen · Marcus Webb · Priya Sharma · Daniel Torres · James Liu · Anna Kowalski · Ben Foster · ";

const TestimonialTicker = () => {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<HTMLButtonElement[]>([]);
  const tickerInnerRef = useRef<HTMLDivElement>(null);
  const tickerTweenRef = useRef<gsap.core.Tween | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isAnimating = useRef(false);
  const isMobile = useIsMobile();

  const goTo = useCallback((next: number) => {
    if (isAnimating.current || next === active) return;
    isAnimating.current = true;

    const el = quoteRef.current;
    if (!el) return;

    dotRefs.current.forEach((d, i) => {
      if (!d) return;
      gsap.to(d, { width: i === next ? 20 : 4, backgroundColor: i === next ? '#7c3aed' : '#1a1a2e', duration: 0.3 });
    });

    gsap.to(el, {
      clipPath: 'inset(0 0 0 100%)', opacity: 0, duration: 0.4, ease: 'power2.in',
      onComplete: () => {
        setActive(next);
        gsap.set(el, { clipPath: 'inset(0 100% 0 0)', opacity: 0 });
        gsap.to(el, { clipPath: 'inset(0 0 0 0)', opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.05, onComplete: () => { isAnimating.current = false; } });
      },
    });
  }, [active]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive(prev => { const next = (prev + 1) % testimonials.length; goTo(next); return prev; });
    }, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [goTo]);

  const handleDotClick = (i: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    goTo(i);
    intervalRef.current = setInterval(() => {
      setActive(prev => { const next = (prev + 1) % testimonials.length; goTo(next); return prev; });
    }, 4000);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (quoteRef.current) gsap.fromTo(quoteRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power2.out' });
      dotRefs.current.forEach((d, i) => { if (d) gsap.fromTo(d, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.6 + i * 0.05 }); });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const inner = tickerInnerRef.current;
    if (!inner) return;
    inner.innerHTML = `<span>${tickerNames}</span>`.repeat(4);
    const tween = gsap.to(inner, { xPercent: -50, duration: 30, repeat: -1, ease: 'none' });
    tickerTweenRef.current = tween;
    const strip = inner.parentElement;
    if (strip) {
      strip.addEventListener('mouseenter', () => gsap.to(tween, { timeScale: 0, duration: 0.4 }));
      strip.addEventListener('mouseleave', () => gsap.to(tween, { timeScale: 1, duration: 0.4 }));
    }
    return () => { tween.kill(); };
  }, []);

  const t = testimonials[active];

  return (
    <div ref={containerRef} className="w-full" style={{ background: '#0a0a12', padding: isMobile ? '20px 16px' : '48px 40px', pointerEvents: 'none' }}>
      <span className="font-mono text-[10px] inline-block px-3 py-1 rounded mb-10" style={{ color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.06)' }}>
        TESTIMONIALS
      </span>

      <div className="relative">
        <span
          className="font-syne font-extrabold absolute top-0 left-0 pointer-events-none select-none"
          style={{ fontSize: isMobile ? '4rem' : '8rem', color: 'rgba(124,58,237,0.08)', lineHeight: 1, opacity: isMobile ? 0.06 : undefined }}
        >
          &ldquo;
        </span>

        <div ref={quoteRef} className="relative z-[1]" style={{ paddingLeft: 24, borderLeft: '2px solid #7c3aed', clipPath: 'inset(0 0 0 0)' }}>
          <p className="font-inter font-light italic" style={{ fontSize: isMobile ? '0.85rem' : '1.2rem', color: '#ededed', lineHeight: isMobile ? 1.6 : 1.7, maxWidth: 620 }}>
            {t.quote}
          </p>
          <div className="flex items-center gap-3 mt-6">
            <div
              className="flex items-center justify-center font-mono"
              style={{
                width: isMobile ? 28 : 36, height: isMobile ? 28 : 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #1a1a2e, #252540)',
                border: '1px solid #252535', color: '#7c3aed', fontSize: isMobile ? 9 : 11,
              }}
            >
              {t.initials}
            </div>
            <div>
              <span className="font-inter font-medium block" style={{ fontSize: isMobile ? '0.8rem' : '0.8125rem', color: '#ededed' }}>{t.name}</span>
              <span className="font-mono block mt-0.5" style={{ fontSize: isMobile ? '0.7rem' : 10, color: '#505060' }}>{t.role}</span>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex gap-1.5 mt-6" style={{ paddingLeft: 24 }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              ref={el => { if (el) dotRefs.current[i] = el; }}
              onClick={() => handleDotClick(i)}
              className="block rounded-full cursor-pointer"
              style={{ width: i === 0 ? 20 : 4, height: 4, background: i === 0 ? '#7c3aed' : '#1a1a2e', border: 'none', padding: 0, transition: 'none', pointerEvents: 'auto' }}
            />
          ))}
        </div>
      </div>

      {/* Ticker strip — hidden below 480px */}
      <div
        className="w-full overflow-hidden mt-6"
        style={{
          borderTop: '1px solid #1a1a2e', borderBottom: '1px solid #1a1a2e',
          background: '#080810', padding: '14px 0',
          display: isMobile ? 'none' : undefined,
        }}
      >
        <div ref={tickerInnerRef} className="flex w-max whitespace-nowrap font-mono text-[11px]" style={{ color: '#303040', letterSpacing: '0.15em' }} />
      </div>
    </div>
  );
};

export default TestimonialTicker;

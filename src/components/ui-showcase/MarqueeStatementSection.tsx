import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

const marqueeLines = [
  { text: 'PRECISION · MOTION · DETAIL · ', speed: 35, direction: -1, style: 'filled' as const },
  { text: 'CRAFT · INTENTION · FLOW · ', speed: 28, direction: 1, style: 'outline' as const },
  { text: 'BUILD · DESIGN · SHIP · ', speed: 45, direction: -1, style: 'accent' as const },
];

const MarqueeStatementSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingLinesRef = useRef<HTMLDivElement[]>([]);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const marqueeTweens = useRef<gsap.core.Tween[]>([]);
  const hrRefs = useRef<HTMLDivElement[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    const ctx = gsap.context(() => {
      headingLinesRef.current.forEach((line, i) => {
        if (line) gsap.fromTo(line, { yPercent: 100 }, { yPercent: 0, duration: 0.8, delay: i * 0.1, ease: 'power4.out' });
      });
      if (bodyRef.current) gsap.fromTo(bodyRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: 'power2.out' });
      hrRefs.current.forEach((hr, i) => {
        if (hr) gsap.fromTo(hr, { scaleX: 0 }, { scaleX: 1, duration: 0.8, delay: 0.2 + i * 0.15, ease: 'power2.out', transformOrigin: 'left center' });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const rows = containerRef.current?.querySelectorAll<HTMLDivElement>('.mq-row');
    if (!rows) return;

    rows.forEach((row, i) => {
      const inner = row.querySelector<HTMLDivElement>('.mq-inner');
      if (!inner) return;
      inner.innerHTML += inner.innerHTML;

      const dir = marqueeLines[i].direction;
      const speed = marqueeLines[i].speed;

      const tween = gsap.to(inner, { xPercent: dir === -1 ? -50 : 0, duration: speed, repeat: -1, ease: 'none' });
      if (dir === 1) {
        gsap.set(inner, { xPercent: -50 });
        tween.vars.xPercent = 0;
        tween.invalidate().restart();
      }

      marqueeTweens.current[i] = tween;

      row.addEventListener('mouseenter', () => gsap.to(tween, { timeScale: 0.3, duration: 0.6 }));
      row.addEventListener('mouseleave', () => gsap.to(tween, { timeScale: 1, duration: 0.6 }));
    });

    return () => { marqueeTweens.current.forEach(t => t?.kill()); };
  }, []);

  const getLineStyle = (style: 'filled' | 'outline' | 'accent'): React.CSSProperties => {
    if (style === 'outline') return { WebkitTextStroke: '1px #333344', color: 'transparent' };
    if (style === 'accent') return { color: '#7c3aed', opacity: 0.4 };
    return { color: '#ededed' };
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col md:flex-row" style={{ background: '#0a0a12', minHeight: isMobile ? undefined : 480, pointerEvents: 'none' }}>
      {/* Left column */}
      <div
        className="flex-shrink-0 flex flex-col justify-center"
        style={{
          width: isMobile ? '100%' : '35%',
          padding: isMobile ? '20px 16px 0 16px' : '0 40px',
          position: isMobile ? 'static' : 'sticky',
          top: isMobile ? undefined : '40%',
          alignSelf: isMobile ? undefined : 'start',
          marginBottom: isMobile ? 0 : undefined,
        }}
      >
        <span
          className="font-mono text-[10px] inline-block px-3 py-1 rounded mb-6"
          style={{ color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)', width: 'fit-content' }}
        >
          ABOUT
        </span>

        <div className="mb-5">
          {['We obsess over', 'the details.'].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <div ref={el => { if (el) headingLinesRef.current[i] = el; }}>
                <span className="font-syne font-extrabold block" style={{
                  fontSize: isMobile ? 'clamp(1.2rem, 5vw, 1.8rem)' : 'clamp(1.6rem, 3vw, 2.2rem)',
                  color: '#ededed', lineHeight: 1.1,
                }}>
                  {line}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p
          ref={bodyRef}
          className="font-inter font-light opacity-0"
          style={{ color: '#606070', lineHeight: 1.8, maxWidth: isMobile ? '100%' : 260, fontSize: isMobile ? '0.75rem' : '0.875rem' }}
        >
          From micro-interactions to full page transitions — every detail is considered, nothing is accidental.
        </p>

        <a
          ref={linkRef}
          href="#"
          className="font-mono mt-8 inline-block relative group"
          style={{ color: '#a78bfa', width: 'fit-content', fontSize: isMobile ? '0.75rem' : '0.8125rem', pointerEvents: 'auto' }}
        >
          Learn more →
          <span
            className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
            style={{ background: '#a78bfa' }}
          />
        </a>
      </div>

      {/* Right column — marquees */}
      <div
        className="flex flex-col justify-center"
        style={{ width: isMobile ? '100%' : '65%', padding: isMobile ? '16px 0 24px' : '40px 0' }}
      >
        {marqueeLines.map((line, i) => (
          <div key={i}>
            {i > 0 && (
              <div
                ref={el => { if (el) hrRefs.current[i - 1] = el; }}
                className="w-full h-px"
                style={{ background: '#1a1a2e', transform: 'scaleX(0)' }}
              />
            )}
            <div className="mq-row overflow-hidden cursor-default" style={{ padding: isMobile ? '8px 0' : '12px 0' }}>
              <div className="mq-inner flex w-max whitespace-nowrap">
                <span
                  className="font-syne font-extrabold mr-2"
                  style={{ fontSize: isMobile ? 'clamp(1rem, 5vw, 1.8rem)' : 'clamp(1.8rem, 7vw, 5.5vw)', ...getLineStyle(line.style), lineHeight: 1.1 }}
                >
                  {line.text}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeStatementSection;

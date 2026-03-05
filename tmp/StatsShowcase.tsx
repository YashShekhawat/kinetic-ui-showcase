import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

const stats = [
  { id: 1, value: 60, suffix: '+', label: 'Components', sublabel: 'Ready to use', color: '#7c3aed', barWidth: 75 },
  { id: 2, value: 100, suffix: '%', label: 'Pure GSAP', sublabel: 'Zero Framer Motion', color: '#a78bfa', barWidth: 100 },
  { id: 3, value: 11, suffix: 'M+', label: 'GSAP Users', sublabel: 'Industry standard', color: '#7c3aed', barWidth: 88 },
  { id: 4, value: 0, suffix: '', label: 'Dependencies', sublabel: 'Just gsap + react', color: '#22c55e', barWidth: 5 },
];

const chartPoints = [12, 28, 18, 42, 35, 55, 48, 70, 62, 85, 78, 95];

const buildChartPath = (pts: number[], w: number, h: number) =>
  pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i / (pts.length - 1)) * w} ${h - (p / 100) * h}`).join(' ');

const StatsShowcase = () => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerEls = headerRef.current?.querySelectorAll('[data-anim]') ?? [];

      // Reset
      gsap.set(cardRefs.current.filter(Boolean), { opacity: 0, y: 30 });
      gsap.set(barRefs.current.filter(Boolean), { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(headerEls, { opacity: 0, y: 16 });
      gsap.set(chartRef.current, { opacity: 0 });

      // Header
      gsap.to(headerEls, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
      });

      // Cards
      gsap.to(cardRefs.current.filter(Boolean), {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.2,
        onComplete: () => {
          // Bars
          gsap.to(barRefs.current.filter(Boolean), {
            scaleX: 1, duration: 0.8, stagger: 0.07, ease: 'power3.out',
          });

          // Counters
          counterRefs.current.forEach((el, i) => {
            if (!el) return;
            const s = stats[i];
            if (!s) return;
            gsap.to({ val: 0 }, {
              val: s.value,
              duration: 1.2,
              ease: 'power2.out',
              delay: i * 0.08,
              onUpdate: function () {
                el.textContent = Math.round(this.targets()[0].val) + s.suffix;
              },
            });
          });

          // Chart
          gsap.to(chartRef.current, {
            opacity: 1, duration: 0.5,
            onComplete: () => {
              const line = lineRef.current;
              const dot = dotRef.current;
              if (!line || !dot) return;
              const length = line.getTotalLength();
              gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
              gsap.to(line, {
                strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut',
                onUpdate: function () {
                  const offset = gsap.getProperty(line, 'strokeDashoffset') as number;
                  const progress = 1 - offset / length;
                  const pt = line.getPointAtLength(progress * length);
                  gsap.set(dot, { attr: { cx: pt.x, cy: pt.y } });
                },
              });
            },
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const W = 340, H = 80;
  const path = buildChartPath(chartPoints, W, H);
  const lastY = H - (chartPoints[chartPoints.length - 1] / 100) * H;

  return (
    <div
      ref={containerRef}
      data-preview="true"
      className="w-full overflow-hidden"
      style={{
        background: '#0e0e14',
        padding: isMobile ? '28px 20px' : '48px 40px',
        boxSizing: 'border-box',
        pointerEvents: 'none',
      }}
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="flex items-end justify-between flex-wrap gap-3"
        style={{ marginBottom: isMobile ? '20px' : '32px' }}
      >
        <div>
          <span
            data-anim
            className="font-mono inline-block mb-3"
            style={{
              fontSize: '10px',
              color: '#a78bfa',
              letterSpacing: '0.2em',
              border: '1px solid rgba(124,58,237,0.2)',
              background: 'rgba(124,58,237,0.06)',
              padding: '3px 10px',
              borderRadius: 4,
            }}
          >
            BY THE NUMBERS
          </span>
          <h2
            data-anim
            className="font-syne font-extrabold leading-none"
            style={{
              fontSize: isMobile ? '1.8rem' : '2.4rem',
              color: '#f0ede8',
            }}
          >
            Built to perform.
          </h2>
        </div>
        {!isMobile && (
          <p
            data-anim
            className="font-inter font-light text-right"
            style={{ fontSize: '0.85rem', color: '#707080', maxWidth: 240, lineHeight: 1.6 }}
          >
            Every number reflects real performance. No marketing fluff.
          </p>
        )}
      </div>

      {/* Stat Cards */}
      <div
        className="grid gap-2.5"
        style={{
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          marginBottom: '10px',
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={stat.id}
            ref={el => { cardRefs.current[i] = el; }}
            className="relative overflow-hidden rounded-lg"
            style={{ background: '#0d0d12', border: '1px solid #1a1a2e', padding: isMobile ? '14px' : '18px' }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: `linear-gradient(to right, transparent, ${stat.color}55, transparent)`,
            }} />
            <span
              ref={el => { counterRefs.current[i] = el; }}
              className="font-syne font-extrabold block"
              style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', color: stat.color, lineHeight: 1, marginBottom: 4 }}
            >
              0{stat.suffix}
            </span>
            <div className="font-inter font-medium text-kinetic-text" style={{ fontSize: '0.8rem', marginBottom: 2 }}>
              {stat.label}
            </div>
            <div className="font-mono text-kinetic-text-muted" style={{ fontSize: '9px', marginBottom: 10 }}>
              {stat.sublabel}
            </div>
            <div className="rounded-sm overflow-hidden" style={{ height: 2, background: '#1a1a2e' }}>
              <div
                ref={el => { barRefs.current[i] = el; }}
                style={{ height: '100%', width: `${stat.barWidth}%`, background: stat.color, borderRadius: 1 }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div
        className="grid gap-2.5"
        style={{ gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}
      >
        {/* Chart Card */}
        <div
          ref={el => { cardRefs.current[4] = el; }}
          className="rounded-lg overflow-hidden"
          style={{ background: '#0d0d12', border: '1px solid #1a1a2e', padding: isMobile ? '14px' : '18px' }}
        >
          <div className="font-mono text-kinetic-text-muted" style={{ fontSize: '9px', letterSpacing: '0.1em', marginBottom: 4 }}>
            ADOPTION GROWTH
          </div>
          <div className="font-syne font-bold text-kinetic-text" style={{ fontSize: '1rem', marginBottom: 12 }}>
            Growing every week
          </div>
          <div ref={chartRef} className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} preserveAspectRatio="none">
              <defs>
                <linearGradient id="ss-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75].map(p => (
                <line key={p} x1="0" y1={H * p} x2={W} y2={H * p} stroke="#1a1a2e" strokeWidth="1" />
              ))}
              <path d={`${path} L ${W} ${H} L 0 ${H} Z`} fill="url(#ss-grad)" />
              <path ref={lineRef} d={path} fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle ref={dotRef} cx={W} cy={lastY} r="3" fill="#a78bfa" />
            </svg>
          </div>
          <div className="flex justify-between mt-1">
            {['Jan', 'Apr', 'Jul', 'Oct', 'Dec'].map(m => (
              <span key={m} className="font-mono" style={{ fontSize: '8px', color: '#303040' }}>{m}</span>
            ))}
          </div>
        </div>

        {/* Right Cards */}
        <div className="flex flex-col gap-2.5">
          {/* Bundle size */}
          <div
            ref={el => { cardRefs.current[5] = el; }}
            className="relative rounded-lg overflow-hidden flex-1"
            style={{ background: '#0d0d12', border: '1px solid #1a1a2e', padding: isMobile ? '14px' : '18px' }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: 'linear-gradient(to right, transparent, rgba(124,58,237,0.4), transparent)',
            }} />
            <div className="font-mono text-kinetic-text-muted" style={{ fontSize: '9px', letterSpacing: '0.1em', marginBottom: 8 }}>
              BUNDLE IMPACT
            </div>
            <div className="flex items-baseline gap-1.5" style={{ marginBottom: 10 }}>
              <span className="font-syne font-extrabold" style={{ fontSize: '1.4rem', color: '#22c55e' }}>~4kb</span>
              <span className="font-mono text-kinetic-text-muted" style={{ fontSize: '9px' }}>per component gzipped</span>
            </div>
            {[
              { label: 'GSAP core', w: 72, color: '#7c3aed', idx: 0 },
              { label: 'Component avg', w: 8, color: '#22c55e', idx: 1 },
            ].map(b => (
              <div key={b.label} style={{ marginBottom: 6 }}>
                <div className="flex justify-between" style={{ marginBottom: 3 }}>
                  <span className="font-mono" style={{ fontSize: '8px', color: '#404050' }}>{b.label}</span>
                  <span className="font-mono" style={{ fontSize: '8px', color: b.color }}>{b.w}kb</span>
                </div>
                <div className="overflow-hidden rounded-sm" style={{ height: 2, background: '#1a1a2e' }}>
                  <div
                    ref={el => { barRefs.current[4 + b.idx] = el; }}
                    style={{ height: '100%', width: `${b.w}%`, background: b.color, borderRadius: 1 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* FPS card */}
          <div
            ref={el => { cardRefs.current[6] = el; }}
            className="rounded-lg flex items-center justify-between gap-3 flex-1"
            style={{ background: '#0d0d12', border: '1px solid #1a1a2e', padding: isMobile ? '14px' : '18px' }}
          >
            <div>
              <div className="font-mono text-kinetic-text-muted" style={{ fontSize: '9px', letterSpacing: '0.1em', marginBottom: 4 }}>
                RENDER PERFORMANCE
              </div>
              <p className="font-inter font-light text-kinetic-text-muted" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                Hardware accelerated.<br />Will-change optimized.
              </p>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="font-syne font-extrabold" style={{ fontSize: '2rem', color: '#7c3aed', lineHeight: 1 }}>60</div>
              <div className="font-mono text-kinetic-text-muted" style={{ fontSize: '9px' }}>fps</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsShowcase;
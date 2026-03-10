import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Split text into letter spans
const LetterSplit = ({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <span className={className} style={{ display: 'inline-block', ...style }}>
    {text.split('').map((ch, i) => (
      <span
        key={i}
        data-char
        style={{
          display: 'inline-block',
          willChange: 'transform, opacity',
          whiteSpace: ch === ' ' ? 'pre' : 'normal',
        }}
      >
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    ))}
  </span>
);

// ── Running ticker
const Ticker = ({ items }: { items: string[] }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const anim = gsap.to(el, { xPercent: -50, duration: 22, ease: 'none', repeat: -1 });
    return () => { anim.kill(); };
  }, []);
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: 'hidden', width: '100%', borderTop: '1px solid #1a1a2a', padding: '10px 0', background: '#0a0a10' }}>
      <div ref={trackRef} style={{ display: 'flex', gap: 0, width: 'max-content' }}>
        {doubled.map((item, i) => (
          <span key={i} className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#303040', padding: '0 20px', borderRight: '1px solid #1a1a2a', whiteSpace: 'nowrap' }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const TypographyHero = () => {
  const rootRef     = useRef<HTMLDivElement>(null);
  const bgLetterRef = useRef<HTMLDivElement>(null);
  const eyebrowRef  = useRef<HTMLDivElement>(null);
  const line1Ref    = useRef<HTMLDivElement>(null);
  const line2Ref    = useRef<HTMLDivElement>(null);
  const line3Ref    = useRef<HTMLDivElement>(null);
  const subRef      = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const metaRef     = useRef<HTMLDivElement>(null);
  const rulerRef    = useRef<HTMLDivElement>(null);
  const lineVRef    = useRef<HTMLDivElement>(null);
  const orbRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const getChars = (ref: React.RefObject<HTMLDivElement>) =>
      ref.current ? Array.from(ref.current.querySelectorAll('[data-char]')) as HTMLElement[] : [];

    const eyebrowChars = getChars(eyebrowRef);
    const line1Chars   = getChars(line1Ref);
    const line2Chars   = getChars(line2Ref);
    const line3Chars   = getChars(line3Ref);

    // Initial states
    gsap.set(bgLetterRef.current, { opacity: 0, scale: 1.4, rotation: -8 });
    gsap.set(eyebrowChars,        { opacity: 0, y: 20, rotationX: 90 });
    gsap.set(line1Chars,          { opacity: 0, y: 80, rotation: gsap.utils.wrap([-6, -3, 0, 3, 6]) });
    gsap.set(line2Chars,          { opacity: 0, x: (i: number) => (i % 2 === 0 ? -60 : 60), scale: 0.4 });
    gsap.set(line3Chars,          { opacity: 0, y: -50, skewX: 20 });
    gsap.set(subRef.current,      { opacity: 0, y: 24 });
    gsap.set(ctaRef.current,      { opacity: 0, y: 16 });
    gsap.set(metaRef.current,     { opacity: 0 });
    gsap.set(rulerRef.current,    { scaleX: 0, transformOrigin: 'left' });
    gsap.set(lineVRef.current,    { scaleY: 0, transformOrigin: 'top' });

    // Master timeline
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.to(bgLetterRef.current, { opacity: 1, scale: 1, rotation: 0, duration: 1.4, ease: 'expo.out' }, 0)
      .to(eyebrowChars, { opacity: 1, y: 0, rotationX: 0, duration: 0.5, stagger: 0.025 }, 0.2)
      .to(rulerRef.current, { scaleX: 1, duration: 0.6, ease: 'power3.inOut' }, 0.4)
      .to(line1Chars, { opacity: 1, y: 0, rotation: 0, duration: 0.7, stagger: 0.03, ease: 'back.out(1.4)' }, 0.5)
      .to(lineVRef.current, { scaleY: 1, duration: 0.5, ease: 'power3.inOut' }, 0.8)
      .to(line2Chars, { opacity: 1, x: 0, scale: 1, duration: 0.6, stagger: { amount: 0.4, from: 'center' }, ease: 'expo.out' }, 0.9)
      .to(line3Chars, { opacity: 1, y: 0, skewX: 0, duration: 0.55, stagger: 0.04, ease: 'power3.out' }, 1.1)
      .to(subRef.current,  { opacity: 1, y: 0, duration: 0.5 }, 1.4)
      .to(ctaRef.current,  { opacity: 1, y: 0, duration: 0.45 }, 1.55)
      .to(metaRef.current, { opacity: 1, duration: 0.4 }, 1.7);

    // Orb float
    const orbAnim = gsap.to(orbRef.current, { x: 30, y: -20, repeat: -1, yoyo: true, duration: 7, ease: 'sine.inOut' });

    // Scroll parallax on bg letter
    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        if (bgLetterRef.current) {
          gsap.set(bgLetterRef.current, { y: self.progress * 120 });
        }
      },
    });

    // Letter hover on line 2
    const line2El = line2Ref.current;
    const handlers: Array<[HTMLElement, () => void]> = [];
    if (line2El) {
      const chars = Array.from(line2El.querySelectorAll('[data-char]')) as HTMLElement[];
      chars.forEach((ch) => {
        const fn = () => {
          gsap.to(ch, { y: -8, color: '#a78bfa', duration: 0.15, ease: 'power2.out' });
          gsap.to(ch, { y: 0, color: '', duration: 0.3, delay: 0.15, ease: 'bounce.out' });
        };
        ch.addEventListener('mouseenter', fn);
        handlers.push([ch, fn]);
      });
    }

    return () => {
      tl.kill();
      orbAnim.kill();
      st.kill();
      handlers.forEach(([el, fn]) => el.removeEventListener('mouseenter', fn));
    };
  }, []);

  const onCtaEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, { scale: 1.04, duration: 0.2, ease: 'power2.out' });
  };
  const onCtaLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: 'elastic.out(1,0.5)' });
  };

  return (
    <div
      data-preview="true"
      ref={rootRef}
      style={{ background: '#0e0e14', minHeight: '100vh', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
    >
      {/* Noise overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.025, mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 5,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* Ambient orb */}
      <div ref={orbRef} style={{ position: 'absolute', top: '15%', right: '8%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 1 }} />

      {/* Giant architectural background letter */}
      <div ref={bgLetterRef} style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(220px, 38vw, 460px)',
        fontFamily: 'Syne, sans-serif', fontWeight: 800,
        color: 'transparent',
        WebkitTextStroke: '1px rgba(124,58,237,0.07)',
        lineHeight: 1, pointerEvents: 'none',
        userSelect: 'none', zIndex: 1,
        letterSpacing: '-0.05em',
      }}>
        K
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(20px, 5vw, 64px) clamp(20px, 6vw, 72px)', position: 'relative', zIndex: 10 }}>

        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div ref={rulerRef} style={{ height: 1, width: 48, background: 'linear-gradient(to right, #7c3aed, transparent)', flexShrink: 0 }} />
          <div ref={eyebrowRef}>
            <LetterSplit
              text="EDITORIAL · MOTION · TYPOGRAPHY"
              className="font-mono"
              style={{ fontSize: 'clamp(8px, 1.2vw, 10px)', letterSpacing: '0.25em', color: '#505060' }}
            />
          </div>
        </div>

        {/* Headline */}
        <div style={{ position: 'relative' }}>
          {/* Vertical rule */}
          <div ref={lineVRef} style={{
            position: 'absolute', left: -20, top: 0, bottom: 0,
            width: 1,
            background: 'linear-gradient(to bottom, #7c3aed, rgba(124,58,237,0.1), transparent)',
          }} />

          {/* Line 1 */}
          <div ref={line1Ref} style={{ lineHeight: 0.9, marginBottom: 4, overflow: 'hidden' }}>
            <LetterSplit
              text="DESIGN"
              className="font-syne"
              style={{
                fontSize: 'clamp(3rem, 9.5vw, 8.5rem)',
                fontWeight: 800,
                color: '#f0ede8',
                letterSpacing: '-0.04em',
                display: 'block',
              }}
            />
          </div>

          {/* Line 2 — interactive outline */}
          <div ref={line2Ref} style={{ lineHeight: 0.9, marginBottom: 4 }}>
            <LetterSplit
              text="WITHOUT"
              className="font-syne"
              style={{
                fontSize: 'clamp(3rem, 9.5vw, 8.5rem)',
                fontWeight: 800,
                color: 'transparent',
                WebkitTextStroke: 'clamp(1px, 0.12vw, 2px) #7c3aed',
                letterSpacing: '-0.04em',
                display: 'block',
                cursor: 'default',
              }}
            />
          </div>

          {/* Line 3 — violet */}
          <div ref={line3Ref} style={{ lineHeight: 0.9 }}>
            <LetterSplit
              text="LIMITS."
              className="font-syne"
              style={{
                fontSize: 'clamp(3rem, 9.5vw, 8.5rem)',
                fontWeight: 800,
                color: '#7c3aed',
                letterSpacing: '-0.04em',
                display: 'block',
              }}
            />
          </div>
        </div>

        {/* Sub + CTA */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 28, marginTop: 36 }}>
          <div ref={subRef} style={{ maxWidth: 300 }}>
            <p className="font-inter font-light" style={{ fontSize: '0.82rem', color: '#606070', lineHeight: 1.8, margin: 0 }}>
              Motion-first components built with GSAP. Copy the code, own the animation, ship the product.
            </p>
          </div>

          <div ref={ctaRef} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onMouseEnter={onCtaEnter}
              onMouseLeave={onCtaLeave}
              style={{ padding: '13px 28px', background: '#7c3aed', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.03em' }}
            >
              Explore Components
            </button>
            <button
              onMouseEnter={onCtaEnter}
              onMouseLeave={onCtaLeave}
              style={{ padding: '13px 28px', background: 'transparent', border: '1px solid #2a2a3e', borderRadius: 8, color: '#909098', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.03em' }}
            >
              View Blocks →
            </button>
          </div>
        </div>

        {/* Meta row */}
        <div ref={metaRef} style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 44, flexWrap: 'wrap', rowGap: 16 }}>
          {[{ num: '60+', label: 'Components' }, { num: '15+', label: 'Blocks' }, { num: '4.9★', label: 'Rating' }].map(({ num, label }, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span className="font-syne font-extrabold" style={{ fontSize: '1.3rem', color: '#f0ede8', lineHeight: 1 }}>{num}</span>
              <span className="font-mono" style={{ fontSize: '8px', color: '#404050', letterSpacing: '0.2em' }}>{label.toUpperCase()}</span>
            </div>
          ))}

          <div style={{ height: 28, width: 1, background: '#1a1a2a' }} />

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {['R', 'M', 'A', 'J', 'S'].map((initial, i) => (
              <div key={i} style={{ width: 24, height: 24, borderRadius: '50%', background: `hsl(${260 + i * 15}, 60%, ${28 + i * 5}%)`, border: '1.5px solid #0e0e14', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: i > 0 ? -8 : 0, fontSize: '8px', color: '#f0ede8', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
                {initial}
              </div>
            ))}
            <span className="font-inter font-light" style={{ fontSize: '11px', color: '#505060', marginLeft: 10 }}>2,400+ devs</span>
          </div>
        </div>
      </div>

      {/* Bottom ticker */}
      <Ticker items={['PURE GSAP', 'COPY PASTE READY', 'DARK BY DEFAULT', 'REACT 18+', 'TYPESCRIPT', 'TAILWIND CSS', 'MIT LICENSE', 'NO FRAMER MOTION', '$49 LIFETIME']} />
    </div>
  );
};

export default TypographyHero;
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

const testimonials = [
  {
    id: 1,
    text: 'Kinetic UI replaced our entire custom animation system. The GSAP integration is flawless and the code quality is exceptional.',
    name: 'Sarah Chen',
    role: 'Creative Director',
    initials: 'SC',
    accent: 'var(--theme-accent)',
    col: 1,
  },
  {
    id: 2,
    text: 'Finally a library that respects both performance and aesthetics. We shipped 3x faster.',
    name: 'Alex Johnson',
    role: 'Frontend Lead at Vercel',
    initials: 'AJ',
    accent: 'var(--theme-accent-light)',
    col: 2,
  },
  {
    id: 3,
    text: "The best GSAP component library I've used. Clean code, zero config, and every animation feels intentional.",
    name: 'Marcus Webb',
    role: 'Senior Engineer',
    initials: 'MW',
    accent: 'var(--theme-accent)',
    col: 3,
  },
  {
    id: 4,
    text: 'I rebuilt our entire landing page using Kinetic UI in a weekend. The results speak for themselves.',
    name: 'Priya Sharma',
    role: 'Indie Developer',
    initials: 'PS',
    accent: 'var(--theme-accent-light)',
    col: 1,
  },
  {
    id: 5,
    text: 'Every component is production ready. No hacky workarounds, no memory leaks. Just solid GSAP code.',
    name: 'Daniel Torres',
    role: 'Tech Lead',
    initials: 'DT',
    accent: 'var(--theme-accent)',
    col: 2,
  },
  {
    id: 6,
    text: 'Switched from Framer Motion to Kinetic UI and never looked back. Performance is night and day.',
    name: 'James Liu',
    role: 'UI Engineer',
    initials: 'JL',
    accent: 'var(--theme-accent-light)',
    col: 3,
  },
  {
    id: 7,
    text: 'The scramble text and magnetic cursor components alone are worth it. Our bounce rate dropped 40%.',
    name: 'Anna Kowalski',
    role: 'Product Designer',
    initials: 'AK',
    accent: 'var(--theme-accent)',
    col: 1,
  },
  {
    id: 8,
    text: 'Copy paste and it works. No configuration, no fighting with dependencies. Exactly what I needed.',
    name: 'Ben Foster',
    role: 'Freelance Developer',
    initials: 'BF',
    accent: 'var(--theme-accent-light)',
    col: 2,
  },
];

const col1 = testimonials.filter((t) => t.col === 1);
const col2 = testimonials.filter((t) => t.col === 2);
const col3 = testimonials.filter((t) => t.col === 3);

const refMap: Record<number, number> = {};
[...col1, ...col2, ...col3].forEach((t, i) => {
  refMap[t.id] = i;
});

const TestimonialWall = () => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const floatTweensRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerEls =
        headerRef.current?.querySelectorAll('[data-anim]') ?? [];

      gsap.set(cardsRef.current.filter(Boolean), { opacity: 0, y: 30 });
      gsap.set(headerEls, { opacity: 0, y: 16 });

      gsap.to(headerEls, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      });

      gsap.to(cardsRef.current.filter(Boolean), {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: { amount: 0.7, from: 'start' },
        ease: 'power3.out',
        delay: 0.2,
        onComplete: () => {
          cardsRef.current.forEach((card) => {
            if (!card) return;
            const tween = gsap.to(card, {
              y: gsap.utils.random(-6, -12),
              duration: gsap.utils.random(3, 5),
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              delay: gsap.utils.random(0, 2),
            });
            floatTweensRef.current.push(tween);
          });
        },
      });
    }, containerRef);

    return () => {
      floatTweensRef.current.forEach((t) => t.kill());
      floatTweensRef.current = [];
      ctx.revert();
    };
  }, []);

  const getRef = (id: number) => (el: HTMLDivElement | null) => {
    cardsRef.current[refMap[id]] = el;
  };

  const Card = ({ t }: { t: (typeof testimonials)[0] }) => (
    <div
      ref={getRef(t.id)}
      className="relative overflow-hidden rounded-lg"
      style={{
        background: 'var(--theme-bg-card)',
        border: '1px solid var(--theme-border-hover)',
        padding: '16px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(to right, transparent, ${t.accent}66, transparent)`,
        }}
      />

      <div style={{ marginBottom: 10 }}>
        {'★★★★★'.split('').map((s, i) => (
          <span
            key={i}
            style={{ color: t.accent, fontSize: '10px', marginRight: 1 }}
          >
            {s}
          </span>
        ))}
      </div>

      <p
        className="font-inter font-light"
        style={{
          fontSize: '0.8rem',
          color: 'var(--theme-text-muted)',
          lineHeight: 1.7,
          marginBottom: 14,
        }}
      >
        "{t.text}"
      </p>

      <div
        className="flex items-center gap-2"
        style={{ borderTop: '1px solid var(--theme-border)', paddingTop: 12 }}
      >
        <div
          className="flex items-center justify-center flex-shrink-0 rounded-full"
          style={{
            width: 28,
            height: 28,
            background: 'var(--theme-bg-surface)',
            border: `1px solid ${t.accent}55`,
          }}
        >
          <span
            className="font-mono"
            style={{ fontSize: '8px', color: t.accent }}
          >
            {t.initials}
          </span>
        </div>
        <div>
          <div
            className="font-inter font-medium"
            style={{ fontSize: '0.75rem', color: 'var(--theme-text-primary)' }}
          >
            {t.name}
          </div>
          <div
            className="font-mono"
            style={{ fontSize: '8px', color: 'var(--theme-text-dim)', marginTop: 1 }}
          >
            {t.role}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      data-preview="true"
      className="w-full overflow-hidden"
      style={{
        background: 'var(--theme-bg-panel)',
        padding: isMobile ? '24px 16px' : '40px 36px',
        boxSizing: 'border-box',
        pointerEvents: 'none',
      }}
    >
      {/* Header */}
      <div ref={headerRef} style={{ marginBottom: isMobile ? '20px' : '28px' }}>
        <div
          className="flex items-center justify-between flex-wrap gap-3"
          style={{ marginBottom: 10 }}
        >
          <span
            data-anim
            className="font-mono"
            style={{
              fontSize: '10px',
              color: 'var(--theme-accent-light)',
              letterSpacing: '0.2em',
              border: '1px solid rgba(124,58,237,0.2)',
              background: 'rgba(124,58,237,0.06)',
              padding: '3px 10px',
              borderRadius: 4,
              display: 'inline-block',
            }}
          >
            TESTIMONIALS
          </span>
          {!isMobile && (
            <p
              data-anim
              className="font-inter font-light"
              style={{ fontSize: '0.8rem', color: 'var(--theme-text-dim)' }}
            >
              Trusted by developers worldwide.
            </p>
          )}
        </div>
        <h2
          data-anim
          className="font-syne font-extrabold"
          style={{
            fontSize: isMobile ? '1.6rem' : '2rem',
            color: 'var(--theme-text-primary)',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Loved by developers.
        </h2>
      </div>

      {/* Grid */}
      {isMobile ? (
        <div className="flex flex-col gap-3">
          {testimonials.slice(0, 4).map((t) => (
            <Card key={t.id} t={t} />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            alignItems: 'start',
          }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            {col1.map((t) => (
              <Card key={t.id} t={t} />
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginTop: '24px',
            }}
          >
            {col2.map((t) => (
              <Card key={t.id} t={t} />
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginTop: '48px',
            }}
          >
            {col3.map((t) => (
              <Card key={t.id} t={t} />
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div
        className="flex justify-center flex-wrap"
        style={{
          gap: '40px',
          marginTop: '28px',
          borderTop: '1px solid var(--theme-border)',
          paddingTop: '20px',
        }}
      >
        {[
          { num: '2,400+', label: 'DEVELOPERS' },
          { num: '4.9 / 5', label: 'AVERAGE RATING' },
          { num: '98%', label: 'WOULD RECOMMEND' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div
              className="font-syne font-extrabold"
              style={{
                fontSize: isMobile ? '1.4rem' : '1.6rem',
                color: 'var(--theme-text-primary)',
                lineHeight: 1,
              }}
            >
              {stat.num}
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: '9px',
                color: 'var(--theme-text-dim)',
                marginTop: 4,
                letterSpacing: '0.12em',
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialWall;

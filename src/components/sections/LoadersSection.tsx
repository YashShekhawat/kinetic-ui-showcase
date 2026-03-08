import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import DNAStrandLoader from '../ui-showcase/loaders/DNAStrandLoader';
import MorphingShapeLoader from '../ui-showcase/loaders/MorphingShapeLoader';
import OrbitLoader from '../ui-showcase/loaders/OrbitLoader';
import TextProgressLoader from '../ui-showcase/loaders/TextProgressLoader';
import PulseRingLoader from '../ui-showcase/loaders/PulseRingLoader';
import SkeletonScreenLoader from '../ui-showcase/loaders/SkeletonScreenLoader';

const loaderComponents = [
  {
    name: 'DNA Strand Loader',
    component: <DNAStrandLoader />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const DNAStrandLoader = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const dots1 = el.querySelectorAll('.dna-top');
    const dots2 = el.querySelectorAll('.dna-bot');

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(dots1, { y: 20, stagger: 0.08, duration: 0.6, ease: 'sine.inOut' }, 0);
    tl.to(dots2, { y: -20, stagger: 0.08, duration: 0.6, ease: 'sine.inOut' }, 0);

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-1">
      <div className="flex gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="dna-top w-2 h-2 rounded-full" style={{ background: '#9b5de5' }} />
        ))}
      </div>
      <div className="flex gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="dna-bot w-2 h-2 rounded-full" style={{ background: '#c77dff' }} />
        ))}
      </div>
    </div>
  );
};

export default DNAStrandLoader;`,
  },
  {
    name: 'Morphing Shape Loader',
    component: <MorphingShapeLoader />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const MorphingShapeLoader = () => {
  const shapeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = shapeRef.current;
    if (!el) return;

    const tl = gsap.timeline({ repeat: -1 });

    tl.to(el, { borderRadius: '50%', rotation: 0, duration: 0.5, ease: 'power2.inOut' });
    tl.to({}, { duration: 0.8 });
    tl.to(el, { borderRadius: '0%', rotation: '+=90', duration: 0.5, ease: 'power2.inOut' });
    tl.to({}, { duration: 0.8 });
    tl.to(el, { borderRadius: '0%', rotation: '+=45', duration: 0.5, ease: 'power2.inOut' });
    tl.to({}, { duration: 0.8 });
    tl.to(el, { borderRadius: '50%', rotation: '+=85', duration: 0.5, ease: 'power2.inOut' });
    tl.to({}, { duration: 0.8 });

    return () => { tl.kill(); };
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div
        ref={shapeRef}
        className="w-12 h-12"
        style={{ background: '#7c3aed', borderRadius: '50%' }}
      />
    </div>
  );
};

export default MorphingShapeLoader;`,
  },
  {
    name: 'Orbit Loader',
    component: <OrbitLoader />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const orbitData = [
  { radius: 20, size: 6, color: '#7c3aed', speed: 1.2, offset: 0 },
  { radius: 35, size: 5, color: '#a78bfa', speed: 1.8, offset: (2 * Math.PI) / 3 },
  { radius: 50, size: 4, color: '#6d28d9', speed: 2.4, offset: (4 * Math.PI) / 3 },
];

const OrbitLoader = () => {
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const startTime = performance.now();
    const fn = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      orbitData.forEach((o, i) => {
        const dot = dotsRef.current[i];
        if (!dot) return;
        const angle = o.offset + (elapsed / o.speed) * Math.PI * 2;
        dot.style.transform = \`translate(\${Math.cos(angle) * o.radius}px, \${Math.sin(angle) * o.radius}px)\`;
      });
    };
    gsap.ticker.add(fn);
    return () => { gsap.ticker.remove(fn); };
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
      <div className="w-3 h-3 rounded-full" style={{ background: '#ededed' }} />
      {orbitData.map((o, i) => (
        <div
          key={i}
          ref={el => { dotsRef.current[i] = el; }}
          className="absolute rounded-full"
          style={{
            width: o.size, height: o.size,
            background: o.color,
            boxShadow: \`0 0 8px \${o.color}\`,
          }}
        />
      ))}
    </div>
  );
};

export default OrbitLoader;`,
  },
  {
    name: 'Text Progress Loader',
    component: <TextProgressLoader />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const lines = [
  { text: 'Initializing components...', color: '#505050' },
  { text: 'Loading animations...', color: '#505050' },
  { text: 'Mounting GSAP plugins...', color: '#505050' },
  { text: 'Ready. ✓', color: '#22c55e' },
];

const TextProgressLoader = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const run = () => {
      container.innerHTML = '';
      const tl = gsap.timeline({ onComplete: () => gsap.delayedCall(1.5, run) });
      tlRef.current = tl;

      lines.forEach((line) => {
        const div = document.createElement('div');
        div.className = 'font-mono text-xs leading-relaxed';
        div.style.color = line.color;
        div.style.minHeight = '1.4em';
        container.appendChild(div);

        const chars = line.text.split('');
        chars.forEach((ch, ci) => {
          tl.call(() => { div.textContent = line.text.slice(0, ci + 1) + '|'; }, [], \`+=\${0.04}\`);
        });
        tl.call(() => { div.textContent = line.text; });
        tl.to({}, { duration: 0.3 });
      });

      tl.to({}, { duration: 1.5 });
      tl.to(container.children, { opacity: 0, duration: 0.4, stagger: 0.05 });
    };

    run();
    return () => { tlRef.current?.kill(); };
  }, []);

  return <div ref={containerRef} className="flex flex-col gap-1" style={{ minWidth: 240 }} />;
};

export default TextProgressLoader;`,
  },
  {
    name: 'Pulse Ring Loader',
    component: <PulseRingLoader />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const PulseRingLoader = () => {
  const ringsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tweens = ringsRef.current.map((ring, i) => {
      if (!ring) return null;
      return gsap.fromTo(ring,
        { scale: 1, opacity: 0.7 },
        { scale: 2.5, opacity: 0, duration: 2, ease: 'power1.out', repeat: -1, delay: i * 0.6 }
      );
    });
    return () => tweens.forEach(t => t?.kill());
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          ref={el => { ringsRef.current[i] = el; }}
          className="absolute rounded-full"
          style={{ width: 40, height: 40, border: '1px solid #9b5de5' }}
        />
      ))}
      <div
        className="relative flex items-center justify-center rounded-full font-syne font-bold text-xs text-[#ededed]"
        style={{ width: 40, height: 40, border: '1px solid #9b5de5' }}
      >
        KU
      </div>
    </div>
  );
};

export default PulseRingLoader;`,
  },
  {
    name: 'Skeleton Screen Loader',
    component: <SkeletonScreenLoader />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const SkeletonScreenLoader = () => {
  const shimmerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = shimmerRef.current;
    if (!el) return;
    const tween = gsap.fromTo(el, { x: '-100%' }, { x: '200%', duration: 1.5, ease: 'none', repeat: -1 });
    return () => { tween.kill(); };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg p-5 w-[260px]" style={{ background: '#10101a', border: '1px solid #252535' }}>
      <div
        ref={shimmerRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%)',
          width: '100%',
        }}
      />
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full" style={{ background: '#1a1a2a' }} />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-3 rounded" style={{ background: '#1a1a2a', width: '70%' }} />
          <div className="h-2.5 rounded" style={{ background: '#1a1a2a', width: '50%' }} />
        </div>
      </div>
      <div className="h-24 rounded mb-3" style={{ background: '#1a1a2a' }} />
      <div className="flex gap-2">
        <div className="h-5 rounded-full" style={{ background: '#1a1a2a', width: 60 }} />
        <div className="h-5 rounded-full" style={{ background: '#1a1a2a', width: 48 }} />
      </div>
    </div>
  );
};

export default SkeletonScreenLoader;`,
  },
];

const LoadersSection = () => (
  <section id="loaders" className="py-24">
    <SectionHeader label="LOADERS" heading="Wait, Beautifully" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {loaderComponents.map(c => (
        <ComponentCard key={c.name} name={c.name} code={c.code} category="loaders">
          {c.component}
        </ComponentCard>
      ))}
    </div>
  </section>
);

export default LoadersSection;

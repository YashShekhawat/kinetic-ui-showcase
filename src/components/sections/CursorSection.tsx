import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import MagneticButton from '../ui-showcase/MagneticButton';
import SpotlightCursor from '../ui-showcase/SpotlightCursor';
import CursorTrail from '../ui-showcase/CursorTrail';

const cursorComponents = [
  {
    name: 'Magnetic Button',
    component: <MagneticButton />,
    code: `import { useRef } from 'react';
import gsap from 'gsap';

const sizes = [
  { label: 'SM', px: 'px-4 py-2 text-sm' },
  { label: 'MD', px: 'px-6 py-3 text-base' },
  { label: 'LG', px: 'px-8 py-4 text-lg' },
];

const MagneticButton = () => {
  return (
    <div className="flex items-center gap-6 flex-wrap">
      {sizes.map((s) => (
        <MagBtn key={s.label} label={s.label} className={s.px} />
      ))}
    </div>
  );
};

const MagBtn = ({ label, className }: { label: string; className: string }) => {
  const ref = useRef<HTMLButtonElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const btn = ref.current!;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
  };

  const onLeave = () => {
    gsap.to(ref.current!, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,0.3)' });
  };

  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={\`font-inter font-medium rounded-lg transition-colors \${className}\`}
      style={{
        background: label === 'MD' ? '#7c3aed' : 'transparent',
        color: label === 'MD' ? '#fff' : '#ededed',
        border: label === 'LG' ? 'none' : '1px solid #1a1a1a',
      }}
    >
      {label}
    </button>
  );
};

export default MagneticButton;`,
  },
  {
    name: 'Spotlight Cursor',
    component: <SpotlightCursor />,
    code: `import { useRef } from 'react';
import gsap from 'gsap';

const SpotlightCursor = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gsap.to(spotRef.current!, {
      background: \`radial-gradient(200px circle at \${x}px \${y}px, rgba(124,58,237,0.12), transparent)\`,
      duration: 0.1,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      className="relative w-full h-[280px] rounded-lg overflow-hidden cursor-none flex items-center justify-center"
      style={{ background: '#050505', border: '1px solid #1a1a1a' }}
    >
      <div ref={spotRef} className="absolute inset-0 pointer-events-none" />
      <div className="text-center opacity-30 hover:opacity-100 transition-opacity pointer-events-none">
        <h3 className="font-syne font-bold text-2xl text-[#ededed]">Hidden Content</h3>
        <p className="font-inter text-sm text-[#a0a0b0] mt-2">Move your cursor to reveal</p>
      </div>
    </div>
  );
};

export default SpotlightCursor;`,
  },
  {
    name: 'Cursor Trail',
    component: <CursorTrail />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CursorTrail = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const dots = dotsRef.current;
    if (!dots.length) return;

    const xTos = dots.map((_, i) => gsap.quickTo(dots[i], 'x', { duration: 0.1 + i * 0.09, ease: 'power2.out' }));
    const yTos = dots.map((_, i) => gsap.quickTo(dots[i], 'y', { duration: 0.1 + i * 0.09, ease: 'power2.out' }));

    const onMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left - 3;
      const y = e.clientY - rect.top - 3;
      xTos.forEach(fn => fn(x));
      yTos.forEach(fn => fn(y));
    };

    const container = containerRef.current!;
    container.addEventListener('mousemove', onMove);
    return () => container.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[280px] rounded-lg overflow-hidden cursor-none"
      style={{ background: '#050505', border: '1px solid #1a1a1a' }}
    >
      <p className="absolute top-4 left-4 font-mono text-[11px] text-[#606070]">Move cursor here</p>
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          ref={el => { if (el) dotsRef.current[i] = el; }}
          className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{
            background: i === 0 ? '#7c3aed' : \`rgba(167, 139, 250, \${1 - i * 0.1})\`,
            opacity: 1 - i * 0.09,
          }}
        />
      ))}
    </div>
  );
};

export default CursorTrail;`,
  },
];

const CursorSection = () => (
  <section id="cursor" className="py-24">
    <SectionHeader label="CURSOR" heading="Cursors That Command Attention" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {cursorComponents.map(c => (
        <ComponentCard key={c.name} name={c.name} code={c.code} category="cursor">
          {c.component}
        </ComponentCard>
      ))}
    </div>
  </section>
);

export default CursorSection;

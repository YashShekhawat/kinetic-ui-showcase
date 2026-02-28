import { useRef } from 'react';
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
      className={`font-inter font-medium rounded-lg transition-colors ${className}`}
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

export default MagneticButton;

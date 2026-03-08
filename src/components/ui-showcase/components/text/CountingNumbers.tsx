import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 2400, suffix: '+', label: 'Users' },
  { value: 99.7, suffix: '%', label: 'Uptime', decimals: 1 },
  { value: 15000, suffix: '+', label: 'Downloads', format: true },
];

const CountingNumbers = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.cn-num').forEach(el => {
        const target = parseFloat(el.getAttribute('data-val') || '0');
        const dec = parseInt(el.getAttribute('data-dec') || '0');
        gsap.fromTo(el, { textContent: '0' }, {
          textContent: target,
          duration: 2,
          snap: dec ? { textContent: 0.1 } : { textContent: 1 },
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate() {
            const v = parseFloat(el.textContent || '0');
            if (el.getAttribute('data-fmt') === '1' && v >= 1000) {
              el.textContent = (v / 1000).toFixed(1) + 'K';
            } else if (dec) {
              el.textContent = v.toFixed(dec);
            }
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="flex gap-10 items-end">
      {stats.map((s, i) => (
        <div key={i} className="text-center">
          <div className="font-syne font-extrabold text-5xl text-kinetic-text">
            <span className="cn-num" data-val={s.value} data-dec={s.decimals || 0} data-fmt={s.format ? '1' : '0'}>0</span>
            <span className="text-kinetic-accent-light">{s.suffix}</span>
          </div>
          <div className="font-inter font-light text-xs text-kinetic-text-muted mt-2">{s.label}</div>
        </div>
      ))}
    </div>
  );
};

export default CountingNumbers;

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionHeaderProps {
  label: string;
  heading: string;
  subtext?: string;
}

const SectionHeader = ({ label, heading, subtext }: SectionHeaderProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const h = el.querySelector('.sh-heading') as HTMLElement;
    if (h) {
      gsap.fromTo(h,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.8,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      );
    }
  }, []);

  return (
    <div ref={ref} className="mb-12">
      <span
        className="inline-block font-mono text-[11px] tracking-[0.15em] uppercase mb-3 px-3 py-1 rounded"
        style={{
          color: '#c4b5fd',
          background: 'rgba(124,58,237,0.1)',
          border: '1px solid rgba(124,58,237,0.2)',
        }}
      >
        {label}
      </span>
      <h2
        className="sh-heading font-syne font-extrabold text-4xl"
        style={{ color: '#f0ede8', textShadow: '0 0 40px rgba(124,58,237,0.15)' }}
      >
        {heading}
      </h2>
      {subtext && (
        <p className="font-inter font-light text-[15px] mt-3" style={{ color: '#b0b0c0' }}>
          {subtext}
        </p>
      )}
      <div
        className="mt-8 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, #2a2a3e, transparent)',
        }}
      />
    </div>
  );
};

export default SectionHeader;

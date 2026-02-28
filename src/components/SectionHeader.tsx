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
      <div className="font-mono text-[11px] text-kinetic-accent tracking-[0.15em] uppercase mb-3">
        {label}
      </div>
      <h2 className="sh-heading font-syne font-extrabold text-4xl text-kinetic-text">
        {heading}
      </h2>
      {subtext && (
        <p className="font-inter font-light text-[15px] text-kinetic-text-muted mt-3">
          {subtext}
        </p>
      )}
      <div className="border-b border-kinetic-border mt-8" />
    </div>
  );
};

export default SectionHeader;

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const items = [
  { title: 'Design', desc: 'Craft beautiful interfaces with intention and precision.' },
  { title: 'Develop', desc: 'Build with modern tools and frameworks that scale.' },
  { title: 'Animate', desc: 'Add motion that feels natural and purposeful.' },
  { title: 'Ship', desc: 'Deploy with confidence and iterate quickly.' },
];

const StickyScrollReveal = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.ssr-item').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveIndex(i),
          onEnterBack: () => setActiveIndex(i),
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-2 gap-8 min-h-[400px]">
      {/* Sticky left */}
      <div className="sticky top-32 h-fit">
        <div className="overflow-hidden">
          <h3
            key={activeIndex}
            className="font-syne font-extrabold text-4xl text-kinetic-text"
            style={{ animation: 'fadeSlideIn 0.4s ease-out' }}
          >
            {items[activeIndex]?.title}
          </h3>
        </div>
        <p className="font-inter font-light text-sm text-kinetic-text-muted mt-3">
          {items[activeIndex]?.desc}
        </p>
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(20px); clip-path: inset(0 0 100% 0); }
            to { opacity: 1; transform: translateY(0); clip-path: inset(0 0 0% 0); }
          }
        `}</style>
      </div>

      {/* Scrolling right */}
      <div className="flex flex-col gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="ssr-item p-6 rounded-lg min-h-[160px] transition-colors"
            style={{
              background: activeIndex === i ? '#0f0f0f' : '#0a0a0a',
              border: `1px solid ${activeIndex === i ? 'rgba(124,58,237,0.2)' : '#1a1a1a'}`,
            }}
          >
            <span className="font-mono text-[11px] text-kinetic-accent">{String(i + 1).padStart(2, '0')}</span>
            <h4 className="font-inter font-semibold text-kinetic-text mt-2">{item.title}</h4>
            <p className="font-inter font-light text-sm text-kinetic-text-muted mt-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StickyScrollReveal;

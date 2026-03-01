import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import live components
import AuroraBackground from '@/components/ui-showcase/AuroraBackground';
import TextReveal from '@/components/ui-showcase/TextReveal';
import CountingNumbers from '@/components/ui-showcase/CountingNumbers';
import TiltCard from '@/components/ui-showcase/TiltCard';
import SpotlightCard from '@/components/ui-showcase/SpotlightCard';
import OrbitLoader from '@/components/ui-showcase/OrbitLoader';
import ParticleField from '@/components/ui-showcase/ParticleField';
import GradientText from '@/components/ui-showcase/GradientText';
import PulseRingLoader from '@/components/ui-showcase/PulseRingLoader';
import BeamOfLight from '@/components/ui-showcase/BeamOfLight';

gsap.registerPlugin(ScrollTrigger);

const cells = [
  { span: 'col-span-2 row-span-2', name: 'Aurora Background', cat: 'backgrounds', Component: AuroraBackground },
  { span: 'col-span-1 row-span-1', name: 'Text Reveal', cat: 'text', Component: TextReveal },
  { span: 'col-span-1 row-span-1', name: 'Counting Numbers', cat: 'text', Component: CountingNumbers },
  { span: 'col-span-1 row-span-2', name: 'Tilt Card', cat: 'cards', Component: TiltCard },
  { span: 'col-span-2 row-span-1', name: 'Marquee', cat: 'scroll', Component: null, isMarquee: true },
  { span: 'col-span-1 row-span-1', name: 'Spotlight Card', cat: 'cards', Component: SpotlightCard },
  { span: 'col-span-1 row-span-1', name: 'Orbit Loader', cat: 'loaders', Component: OrbitLoader },
  { span: 'col-span-2 row-span-1', name: 'Particle Field', cat: 'backgrounds', Component: ParticleField },
  { span: 'col-span-1 row-span-1', name: 'Gradient Text', cat: 'text', Component: GradientText },
  { span: 'col-span-1 row-span-1', name: 'Pulse Ring', cat: 'loaders', Component: PulseRingLoader },
  { span: 'col-span-2 row-span-1', name: 'Beam of Light', cat: 'backgrounds', Component: BeamOfLight },
];

const LiveShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(headingRef.current, { clipPath: 'inset(0 100% 0 0)' }, {
          clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power4.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true },
        });
      }

      gsap.utils.toArray<HTMLElement>('.showcase-cell').forEach((cell, i) => {
        gsap.fromTo(cell, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.5, delay: i * 0.05, ease: 'power2.out',
          scrollTrigger: { trigger: cell, start: 'top 80%', once: true },
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 px-10" style={{ background: '#060608' }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block font-mono text-[11px] tracking-[0.15em] uppercase mb-3 px-3 py-1 rounded"
            style={{ color: '#a78bfa', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}>
            COMPONENTS
          </span>
          <h2 ref={headingRef} className="font-syne font-extrabold" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#ededed' }}>
            See them in action.
          </h2>
          <p className="font-inter font-light mt-3 mx-auto" style={{ fontSize: 15, color: '#606070', maxWidth: 400 }}>
            Every component live. Every animation real. Click any to explore.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {cells.map((cell, i) => (
            <div
              key={i}
              className={`showcase-cell ${cell.span} opacity-0 relative overflow-hidden rounded-lg cursor-pointer group`}
              style={{ background: '#0a0a12', border: '1px solid #1a1a2e', minHeight: 160 }}
              onClick={() => navigate(`/components?category=${cell.cat}`)}
              onMouseEnter={e => {
                gsap.to(e.currentTarget, { y: -2, borderColor: 'rgba(124,58,237,0.3)', duration: 0.2 });
              }}
              onMouseLeave={e => {
                gsap.to(e.currentTarget, { y: 0, borderColor: '#1a1a2e', duration: 0.2 });
              }}
            >
              {/* Live component */}
              <div className="w-full h-full flex items-center justify-center overflow-hidden" style={{ minHeight: 'inherit' }}>
                {cell.isMarquee ? (
                  <div className="w-full overflow-hidden">
                    <div className="font-syne font-bold text-xl whitespace-nowrap" style={{ color: '#ededed' }}>
                      GSAP · REACT · MOTION · GSAP · REACT · MOTION ·&nbsp;
                    </div>
                  </div>
                ) : cell.Component ? (
                  <div className="pointer-events-none w-full h-full flex items-center justify-center" style={{ transform: cell.span.includes('row-span-2') ? 'scale(0.85)' : 'none' }}>
                    <cell.Component />
                  </div>
                ) : null}
              </div>

              {/* Hover bar */}
              <div
                className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200"
                style={{ height: 36, background: 'rgba(6,6,8,0.9)', backdropFilter: 'blur(8px)', borderTop: '1px solid #1a1a2e' }}
              >
                <span className="font-mono text-[10px]" style={{ color: '#a78bfa' }}>{cell.name}</span>
                <span className="font-mono text-[10px]" style={{ color: '#505060' }}>View →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveShowcase;

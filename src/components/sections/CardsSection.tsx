import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import SpotlightCard from '../ui-showcase/SpotlightCard';
import TiltCard from '../ui-showcase/TiltCard';
import BorderGlowCard from '../ui-showcase/BorderGlowCard';
import MagneticCard from '../ui-showcase/MagneticCard';

const cardComponents = [
  {
    name: 'Spotlight Card',
    component: <SpotlightCard />,
    code: `import { useRef } from 'react';
import gsap from 'gsap';

const SpotlightCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const rect = cardRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gsap.to(glowRef.current!, {
      background: \`radial-gradient(300px circle at \${x}px \${y}px, rgba(124,58,237,0.08), transparent)\`,
      duration: 0.3,
    });
  };

  const onLeave = () => {
    gsap.to(glowRef.current!, { opacity: 0, duration: 0.3 });
  };

  const onEnter = () => {
    gsap.to(glowRef.current!, { opacity: 1, duration: 0.3 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onEnter}
      className="relative w-[280px] h-[320px] rounded-lg overflow-hidden p-6 flex flex-col"
      style={{ background: '#10101a', border: '1px solid #252535' }}
    >
      <div ref={glowRef} className="absolute inset-0 opacity-0 pointer-events-none" />
      <div className="w-10 h-10 rounded-md mb-4" style={{ background: '#1a1a2e' }} />
      <h3 className="font-inter font-semibold text-[#ededed] text-base mb-2">Spotlight Card</h3>
      <p className="font-inter font-light text-sm text-[#a0a0b0] leading-relaxed">
        Move your cursor around to see the spotlight effect follow your mouse.
      </p>
    </div>
  );
};

export default SpotlightCard;`,
  },
  {
    name: 'Tilt Card',
    component: <TiltCard />,
    code: `import { useRef } from 'react';
import gsap from 'gsap';

const TiltCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const rect = cardRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(cardRef.current!, {
      rotateY: x * 15,
      rotateX: -y * 15,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
    });
    gsap.to(glareRef.current!, {
      opacity: 0.15,
      x: x * 100,
      y: y * 100,
      duration: 0.3,
    });
  };

  const onLeave = () => {
    gsap.to(cardRef.current!, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1,0.5)' });
    gsap.to(glareRef.current!, { opacity: 0, duration: 0.3 });
  };

  return (
    <div style={{ perspective: '1000px' }}>
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative w-[280px] h-[320px] rounded-lg overflow-hidden p-6 flex flex-col"
        style={{ background: '#10101a', border: '1px solid #252535', transformStyle: 'preserve-3d' }}
      >
        <div
          ref={glareRef}
          className="absolute inset-0 opacity-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)',
          }}
        />
        <div className="w-10 h-10 rounded-md mb-4" style={{ background: '#1a1a2e' }} />
        <h3 className="font-inter font-semibold text-[#ededed] text-base mb-2">Tilt Card</h3>
        <p className="font-inter font-light text-sm text-[#a0a0b0] leading-relaxed">
          Hover to see the 3D tilt effect with glare overlay.
        </p>
      </div>
    </div>
  );
};

export default TiltCard;`,
  },
  {
    name: 'Border Glow Card',
    component: <BorderGlowCard />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const BorderGlowCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.bgc-rotate', {
        rotation: 360,
        duration: 4,
        repeat: -1,
        ease: 'none',
      });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  const onEnter = () => {
    gsap.to(cardRef.current!, { y: -4, duration: 0.3 });
    if (borderRef.current) gsap.to(borderRef.current, { opacity: 1, duration: 0.3 });
  };
  const onLeave = () => {
    gsap.to(cardRef.current!, { y: 0, duration: 0.3 });
    if (borderRef.current) gsap.to(borderRef.current, { opacity: 0.5, duration: 0.3 });
  };

  return (
    <div className="relative w-[280px] h-[320px]" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div
        ref={borderRef}
        className="absolute inset-[-1px] rounded-lg overflow-hidden opacity-50"
      >
        <div
          className="bgc-rotate absolute inset-[-50%] w-[200%] h-[200%]"
          style={{
            background: 'conic-gradient(from 0deg, transparent, #7c3aed, transparent, #a78bfa, transparent)',
          }}
        />
      </div>
      <div
        ref={cardRef}
        className="relative w-full h-full rounded-lg overflow-hidden p-6 flex flex-col"
        style={{ background: '#10101a' }}
      >
        <div className="w-10 h-10 rounded-md mb-4" style={{ background: '#1a1a2e' }} />
        <h3 className="font-inter font-semibold text-[#ededed] text-base mb-2">Border Glow</h3>
        <p className="font-inter font-light text-sm text-[#a0a0b0] leading-relaxed">
          Animated conic gradient border that rotates continuously.
        </p>
      </div>
    </div>
  );
};

export default BorderGlowCard;`,
  },
  {
    name: 'Magnetic Card',
    component: <MagneticCard />,
    code: `import { useRef } from 'react';
import gsap from 'gsap';

const MagneticCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const rect = cardRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const dist = Math.sqrt(x * x + y * y);
    if (dist < 120) {
      gsap.to(cardRef.current!, { x: x * 0.15, y: y * 0.15, duration: 0.3 });
    }
  };

  const onLeave = () => {
    gsap.to(cardRef.current!, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,0.3)' });
  };

  return (
    <div className="p-8" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div
        ref={cardRef}
        className="w-[260px] rounded-lg p-6 flex flex-col items-center text-center"
        style={{ background: '#10101a', border: '1px solid #252535' }}
      >
        <div className="w-12 h-12 rounded-full mb-3" style={{ background: '#1a1a2e' }} />
        <h3 className="font-inter font-semibold text-[#ededed] text-sm">Alex Chen</h3>
        <p className="font-inter text-xs text-[#a0a0b0] mt-1">UI Engineer</p>
      </div>
    </div>
  );
};

export default MagneticCard;`,
  },
];

const CardsSection = () => (
  <section id="cards" className="py-24">
    <SectionHeader label="CARDS" heading="Cards Worth Clicking" />
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {cardComponents.map(c => (
        <ComponentCard key={c.name} name={c.name} code={c.code} category="cards">
          {c.component}
        </ComponentCard>
      ))}
    </div>
  </section>
);

export default CardsSection;

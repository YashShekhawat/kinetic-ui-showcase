import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import ParticleField from '../ui-showcase/backgrounds/ParticleField';
import AuroraBackground from '../ui-showcase/backgrounds/AuroraBackground';
import AnimatedGridLines from '../ui-showcase/backgrounds/AnimatedGridLines';
import FloatingOrbs from '../ui-showcase/backgrounds/FloatingOrbs';
import BeamOfLight from '../ui-showcase/backgrounds/BeamOfLight';
import MatrixRain from '../ui-showcase/backgrounds/MatrixRain';

const bgComponents = [
  {
    name: 'Particle Field',
    component: <ParticleField />,
    code: `import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number; vx: number; vy: number; size: number; opacity: number; color: string;
}

const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let w = canvas.parentElement!.clientWidth;
    let h = canvas.parentElement!.clientHeight;
    canvas.width = w;
    canvas.height = h;

    const particles: Particle[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: 1 + Math.random() * 1.5,
      opacity: 0.35 + Math.random() * 0.55,
      color: Math.random() > 0.3 ? '#ededed' : '#7c3aed',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particles.forEach(p => {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80 && dist > 0) {
          const force = (80 - dist) / 80 * 2;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = \`rgba(124,58,237,\${0.3 * (1 - dist / 100)})\`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      w = canvas.parentElement!.clientWidth;
      h = canvas.parentElement!.clientHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      className="relative w-full h-full"
      style={{ minHeight: 320, background: '#030303' }}
      onMouseMove={e => {
        const rect = canvasRef.current!.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }}
      onMouseLeave={() => { mouseRef.current = { x: -999, y: -999 }; }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

export default ParticleField;`,
    fullBleed: true,
  },
  {
    name: 'Aurora Background',
    component: <AuroraBackground />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const blobs = [
  { w: 400, h: 400, color: 'rgba(124,58,237,0.38)', x: 80, y: 40, dx: 80, dy: 60, ds: 1.3, dur: 8 },
  { w: 500, h: 300, color: 'rgba(167,139,250,0.28)', x: 280, y: 100, dx: -60, dy: 80, ds: 1.2, dur: 11 },
  { w: 350, h: 350, color: 'rgba(232,121,249,0.23)', x: 160, y: 220, dx: 40, dy: -50, ds: 1.1, dur: 9 },
];

const AuroraBackground = () => {
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tweens = blobRefs.current.map((el, i) => {
      if (!el) return null;
      const b = blobs[i];
      return gsap.to(el, {
        x: b.dx, y: b.dy, scale: b.ds,
        duration: b.dur, yoyo: true, repeat: -1, ease: 'sine.inOut',
      });
    });
    return () => tweens.forEach(t => t?.kill());
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: 320, background: '#030303' }}>
      {blobs.map((b, i) => (
        <div
          key={i}
          ref={el => { blobRefs.current[i] = el; }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: b.w, height: b.h,
            left: b.x, top: b.y,
            background: \`radial-gradient(circle, \${b.color}, transparent)\`,
            filter: 'blur(60px)',
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-syne font-extrabold text-2xl text-[#ededed]" style={{ opacity: 0.9 }}>KINETIC UI</span>
      </div>
    </div>
  );
};

export default AuroraBackground;`,
    fullBleed: true,
  },
  {
    name: 'Animated Grid Lines',
    component: <AnimatedGridLines />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CELL = 40;

const AnimatedGridLines = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cellsRef = useRef<HTMLDivElement[]>([]);
  const intervalRef = useRef<number>(0);

  useEffect(() => {
    const lineTween = gsap.to(lineRef.current, {
      top: '100%', duration: 4, ease: 'none', repeat: -1,
    });

    intervalRef.current = window.setInterval(() => {
      const idx = Math.floor(Math.random() * cellsRef.current.length);
      const cell = cellsRef.current[idx];
      if (cell) {
        gsap.fromTo(cell, { background: 'rgba(124,58,237,0.1)' }, { background: 'transparent', duration: 0.8 });
      }
    }, 300);

    return () => {
      lineTween.kill();
      clearInterval(intervalRef.current);
    };
  }, []);

  const w = 400;
  const h = 320;
  const cols = Math.floor(w / CELL);
  const rows = Math.floor(h / CELL);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{
        minHeight: 320,
        background: '#060608',
        backgroundImage: \`linear-gradient(#131320 1px, transparent 1px), linear-gradient(90deg, #131320 1px, transparent 1px)\`,
        backgroundSize: \`\${CELL}px \${CELL}px\`,
      }}
      onMouseMove={e => {
        const rect = containerRef.current!.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        cellsRef.current.forEach(cell => {
          const cr = cell.getBoundingClientRect();
          const cx = cr.left - rect.left + CELL / 2;
          const cy = cr.top - rect.top + CELL / 2;
          const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
          if (dist < 80) {
            cell.style.background = \`rgba(124,58,237,\${0.12 * (1 - dist / 80)})\`;
          }
        });
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div
          key={i}
          ref={el => { if (el) cellsRef.current[i] = el; }}
          className="absolute"
          style={{
            width: CELL, height: CELL,
            left: (i % cols) * CELL,
            top: Math.floor(i / cols) * CELL,
          }}
        />
      ))}
      <div
        ref={lineRef}
        className="absolute left-0 w-full"
        style={{ top: 0, height: 1, background: '#7c3aed', opacity: 0.5 }}
      />
    </div>
  );
};

export default AnimatedGridLines;`,
    fullBleed: true,
  },
  {
    name: 'Floating Orbs',
    component: <FloatingOrbs />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const orbData = [
  { size: 180, color: '#7c3aed', opacity: 0.2, blur: 40, x: '10%', y: '10%', dx: 60, dy: 40, dur: 8 },
  { size: 140, color: '#a78bfa', opacity: 0.15, blur: 50, x: '45%', y: '40%', dx: -40, dy: 50, dur: 10 },
  { size: 200, color: '#6d28d9', opacity: 0.18, blur: 35, x: '70%', y: '60%', dx: -50, dy: -30, dur: 7 },
  { size: 100, color: '#e879f9', opacity: 0.12, blur: 45, x: '75%', y: '15%', dx: 30, dy: 40, dur: 11 },
  { size: 160, color: '#7c3aed', opacity: 0.1, blur: 55, x: '20%', y: '65%', dx: 50, dy: -40, dur: 9 },
];

const FloatingOrbs = () => {
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tweens = orbRefs.current.map((el, i) => {
      if (!el) return null;
      const o = orbData[i];
      return gsap.to(el, {
        x: o.dx, y: o.dy, scale: 1.2,
        duration: o.dur, yoyo: true, repeat: -1, ease: 'sine.inOut',
        delay: i * 0.5,
      });
    });
    return () => tweens.forEach(t => t?.kill());
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: 320, background: '#030303' }}>
      {orbData.map((o, i) => (
        <div
          key={i}
          ref={el => { orbRefs.current[i] = el; }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: o.size, height: o.size,
            left: o.x, top: o.y,
            background: o.color,
            opacity: o.opacity,
            filter: \`blur(\${o.blur}px)\`,
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-lg px-6 py-4 text-center" style={{ background: 'rgba(3,3,3,0.7)', border: '1px solid #1a1a1a' }}>
          <h3 className="font-syne font-bold text-[#ededed] text-base">Floating Orbs</h3>
          <p className="font-inter text-xs text-[#a0a0b0] mt-1">Ambient background effect</p>
        </div>
      </div>
    </div>
  );
};

export default FloatingOrbs;`,
    fullBleed: true,
  },
  {
    name: 'Beam of Light',
    component: <BeamOfLight />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const BeamOfLight = () => {
  const beamRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
    tl.fromTo([beamRef.current, glowRef.current],
      { x: -30 },
      { x: '100%', duration: 2.5, ease: 'none' }
    );
    return () => { tl.kill(); };
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: 320, background: '#030303' }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-syne font-extrabold" style={{ fontSize: '7rem', color: '#181825', lineHeight: 1 }}>
          SWEEP
        </span>
      </div>
      <div
        ref={glowRef}
        className="absolute top-0 h-full pointer-events-none"
        style={{
          width: 30,
          background: 'linear-gradient(to bottom, transparent, rgba(124,58,237,0.15), rgba(167,139,250,0.08), transparent)',
          filter: 'blur(15px)',
        }}
      />
      <div
        ref={beamRef}
        className="absolute top-0 h-full pointer-events-none"
        style={{
          width: 2,
          background: 'linear-gradient(to bottom, transparent, rgba(124,58,237,1), rgba(167,139,250,0.5), transparent)',
          filter: 'blur(3px)',
        }}
      />
    </div>
  );
};

export default BeamOfLight;`,
    fullBleed: true,
  },
  {
    name: 'Matrix Rain',
    component: <MatrixRain />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ·×+—/\\\\|';
const COL_W = 16;

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const speedRef = useRef(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let w = containerRef.current!.clientWidth;
    let h = containerRef.current!.clientHeight;
    canvas.width = w;
    canvas.height = h;

    const cols = Math.floor(w / COL_W);
    const drops = new Array(cols).fill(0).map(() => Math.random() * -h);
    const speeds = new Array(cols).fill(0).map(() => 1 + Math.random() * 3);

    gsap.fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 1 });

    const draw = () => {
      ctx.fillStyle = 'rgba(3,3,3,0.15)';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < cols; i++) {
        const x = i * COL_W;
        const y = drops[i];
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];

        ctx.fillStyle = '#c4b5fd';
        ctx.font = '13px JetBrains Mono';
        ctx.fillText(ch, x, y);

        for (let t = 1; t < 8; t++) {
          const ty = y - t * COL_W;
          if (ty < 0) break;
          const tc = CHARS[Math.floor(Math.random() * CHARS.length)];
          ctx.fillStyle = \`rgba(155,93,229,\${0.5 - t * 0.06})\`;
          ctx.fillText(tc, x, ty);
        }

        drops[i] += speeds[i] * speedRef.current;
        if (drops[i] > h + 50) {
          drops[i] = Math.random() * -40;
          speeds[i] = 1 + Math.random() * 3;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      w = containerRef.current!.clientWidth;
      h = containerRef.current!.clientHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ minHeight: 320, background: '#030303' }}
      onMouseEnter={() => { gsap.to(speedRef, { current: 2, duration: 0.3 }); }}
      onMouseLeave={() => { gsap.to(speedRef, { current: 1, duration: 0.5 }); }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

export default MatrixRain;`,
    fullBleed: true,
  },
];

const BackgroundsSection = () => (
  <section id="backgrounds" className="py-24">
    <SectionHeader label="BACKGROUNDS" heading="Scenes That Set the Stage" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {bgComponents.map(c => (
        <ComponentCard key={c.name} name={c.name} code={c.code} category="backgrounds" fullBleed={c.fullBleed}>
          {c.component}
        </ComponentCard>
      ))}
    </div>
  </section>
);

export default BackgroundsSection;

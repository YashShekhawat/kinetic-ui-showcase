import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import ParticleField from '../ui-showcase/ParticleField';
import AuroraBackground from '../ui-showcase/AuroraBackground';
import AnimatedGridLines from '../ui-showcase/AnimatedGridLines';
import FloatingOrbs from '../ui-showcase/FloatingOrbs';
import BeamOfLight from '../ui-showcase/BeamOfLight';
import MatrixRain from '../ui-showcase/MatrixRain';

const bgComponents = [
  {
    name: 'Particle Field',
    component: <ParticleField />,
    code: `// 80 particles with connection lines
// Mouse repels particles within 80px
const dx = p.x - mx;
const dist = Math.sqrt(dx*dx + dy*dy);
if (dist < 80) {
  const force = (80 - dist) / 80 * 2;
  p.x += (dx / dist) * force;
}
// Lines between particles within 100px
ctx.strokeStyle = \`rgba(124,58,237,\${0.2 * (1 - dist/100)})\`;`,
    fullBleed: true,
  },
  {
    name: 'Aurora Background',
    component: <AuroraBackground />,
    code: `// 3 blurred gradient blobs floating
gsap.to(blob, {
  x: 80, y: 60, scale: 1.3,
  duration: 8, yoyo: true, repeat: -1,
  ease: 'sine.inOut',
});
// Each blob: filter blur(60px), radial-gradient`,
    fullBleed: true,
  },
  {
    name: 'Animated Grid Lines',
    component: <AnimatedGridLines />,
    code: `// Random cells pulse + scanning line
setInterval(() => {
  gsap.fromTo(randomCell,
    { background: 'rgba(124,58,237,0.06)' },
    { background: 'transparent', duration: 0.8 });
}, 300);
gsap.to(scanLine, { top: '100%', duration: 4,
  ease: 'none', repeat: -1 });`,
    fullBleed: true,
  },
  {
    name: 'Floating Orbs',
    component: <FloatingOrbs />,
    code: `// 5 soft orbs with unique motion paths
gsap.to(orb, {
  x: 60, y: 40, scale: 1.2,
  duration: 8, yoyo: true, repeat: -1,
  ease: 'sine.inOut', delay: i * 0.5,
});
// Each: unique size, color, blur, opacity`,
    fullBleed: true,
  },
  {
    name: 'Beam of Light',
    component: <BeamOfLight />,
    code: `// Glowing beam sweeps across the preview
gsap.fromTo([beam, glow], { x: -30 },
  { x: '100%', duration: 2.5, ease: 'none',
    repeat: -1, repeatDelay: 1.5 });
// "SWEEP" text illuminated as beam passes`,
    fullBleed: true,
  },
  {
    name: 'Matrix Rain',
    component: <MatrixRain />,
    code: `// Canvas-based character rain in #7c3aed
// Head character: #a78bfa, trail fades out
ctx.fillStyle = '#a78bfa';
ctx.fillText(char, x, y);
// On hover: speed doubles
onMouseEnter: speedRef.current = 2;
onMouseLeave: gsap.to(speedRef, { current: 1 });`,
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

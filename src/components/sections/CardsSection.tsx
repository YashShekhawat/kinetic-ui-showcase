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
    code: `// Track mouse position relative to card
const onMove = (e) => {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  gsap.to(glow, {
    background: \`radial-gradient(300px at \${x}px \${y}px, rgba(124,58,237,0.08), transparent)\`,
  });
};`,
  },
  {
    name: 'Tilt Card',
    component: <TiltCard />,
    code: `// 3D tilt toward cursor
const x = (e.clientX - rect.left) / rect.width - 0.5;
const y = (e.clientY - rect.top) / rect.height - 0.5;
gsap.to(card, {
  rotateY: x * 15,
  rotateX: -y * 15,
  scale: 1.02,
  duration: 0.3,
});`,
  },
  {
    name: 'Border Glow Card',
    component: <BorderGlowCard />,
    code: `// Rotating conic-gradient border
gsap.to('.border-rotate', {
  rotation: 360,
  duration: 4,
  repeat: -1,
  ease: 'none',
});
// Lift on hover
gsap.to(card, { y: -4, duration: 0.3 });`,
  },
  {
    name: 'Magnetic Card',
    component: <MagneticCard />,
    code: `// Card follows cursor within radius
const dist = Math.sqrt(x * x + y * y);
if (dist < 120) {
  gsap.to(card, { x: x * 0.15, y: y * 0.15, duration: 0.3 });
}
// Elastic return on leave
gsap.to(card, { x: 0, y: 0, ease: 'elastic.out(1,0.3)' });`,
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

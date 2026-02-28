import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import DNAStrandLoader from '../ui-showcase/DNAStrandLoader';
import MorphingShapeLoader from '../ui-showcase/MorphingShapeLoader';
import OrbitLoader from '../ui-showcase/OrbitLoader';
import TextProgressLoader from '../ui-showcase/TextProgressLoader';
import PulseRingLoader from '../ui-showcase/PulseRingLoader';
import SkeletonScreenLoader from '../ui-showcase/SkeletonScreenLoader';

const loaderComponents = [
  {
    name: 'DNA Strand Loader',
    component: <DNAStrandLoader />,
    code: `// Two rows of dots crossing like DNA helix
gsap.to(dotsTop, { y: 20, stagger: 0.08, duration: 0.6,
  yoyo: true, repeat: -1, ease: 'sine.inOut' });
gsap.to(dotsBot, { y: -20, stagger: 0.08, duration: 0.6,
  yoyo: true, repeat: -1, ease: 'sine.inOut' });`,
  },
  {
    name: 'Morphing Shape Loader',
    component: <MorphingShapeLoader />,
    code: `// Shape morphs between circle, square, diamond
tl.to(el, { borderRadius: '50%', rotation: '+=90',
  duration: 0.5, ease: 'power2.inOut' });
tl.to(el, { borderRadius: '0%', rotation: '+=90',
  duration: 0.5, ease: 'power2.inOut' });`,
  },
  {
    name: 'Orbit Loader',
    component: <OrbitLoader />,
    code: `// Three dots orbit at different radii and speeds
gsap.ticker.add(() => {
  const angle = offset + (elapsed / speed) * Math.PI * 2;
  dot.style.transform = \`translate(
    \${Math.cos(angle) * radius}px,
    \${Math.sin(angle) * radius}px)\`;
});`,
  },
  {
    name: 'Text Progress Loader',
    component: <TextProgressLoader />,
    code: `// Lines type in sequentially, character by character
lines.forEach(line => {
  line.split('').forEach((ch, i) => {
    tl.call(() => {
      el.textContent = line.slice(0, i + 1) + '|';
    }, [], \`+=\${0.04}\`);
  });
});`,
  },
  {
    name: 'Pulse Ring Loader',
    component: <PulseRingLoader />,
    code: `// Sonar rings pulse outward from center
gsap.fromTo(ring, { scale: 1, opacity: 0.6 },
  { scale: 2.5, opacity: 0, duration: 2,
    ease: 'power1.out', repeat: -1, delay: i * 0.6 });`,
  },
  {
    name: 'Skeleton Screen Loader',
    component: <SkeletonScreenLoader />,
    code: `// Shimmer highlight sweeps across skeleton
gsap.fromTo(shimmer, { x: '-100%' },
  { x: '200%', duration: 1.5,
    ease: 'none', repeat: -1 });`,
  },
];

const LoadersSection = () => (
  <section id="loaders" className="py-24">
    <SectionHeader label="LOADERS" heading="Wait, Beautifully" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {loaderComponents.map(c => (
        <ComponentCard key={c.name} name={c.name} code={c.code} category="loaders">
          {c.component}
        </ComponentCard>
      ))}
    </div>
  </section>
);

export default LoadersSection;

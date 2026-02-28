import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import MagneticButton from '../ui-showcase/MagneticButton';
import SpotlightCursor from '../ui-showcase/SpotlightCursor';
import CursorTrail from '../ui-showcase/CursorTrail';

const cursorComponents = [
  {
    name: 'Magnetic Button',
    component: <MagneticButton />,
    code: `const onMove = (e) => {
  const rect = btn.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
};
const onLeave = () => {
  gsap.to(btn, { x: 0, y: 0, ease: 'elastic.out(1,0.3)' });
};`,
  },
  {
    name: 'Spotlight Cursor',
    component: <SpotlightCursor />,
    code: `const onMove = (e) => {
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  gsap.to(spotlight, {
    background: \`radial-gradient(200px at \${x}px \${y}px, rgba(124,58,237,0.12), transparent)\`,
  });
};`,
  },
  {
    name: 'Cursor Trail',
    component: <CursorTrail />,
    code: `// Create quickTo for each dot with increasing delay
const dots = Array.from({ length: 10 });
const xTos = dots.map((_, i) =>
  gsap.quickTo(dotElements[i], 'x', { duration: 0.1 + i * 0.09 })
);
const yTos = dots.map((_, i) =>
  gsap.quickTo(dotElements[i], 'y', { duration: 0.1 + i * 0.09 })
);
// On mousemove, update all dots
xTos.forEach(fn => fn(mouseX));
yTos.forEach(fn => fn(mouseY));`,
  },
];

const CursorSection = () => (
  <section id="cursor" className="py-24">
    <SectionHeader label="CURSOR" heading="Cursors That Command Attention" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {cursorComponents.map(c => (
        <ComponentCard key={c.name} name={c.name} code={c.code} category="cursor">
          {c.component}
        </ComponentCard>
      ))}
    </div>
  </section>
);

export default CursorSection;

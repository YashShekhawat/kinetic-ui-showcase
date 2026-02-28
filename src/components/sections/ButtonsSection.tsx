import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import LiquidFillButton from '../ui-showcase/LiquidFillButton';
import ArrowSlideButton from '../ui-showcase/ArrowSlideButton';
import MagneticPillButton from '../ui-showcase/MagneticPillButton';
import ShatterButton from '../ui-showcase/ShatterButton';
import BorderDrawButton from '../ui-showcase/BorderDrawButton';
import LoadingButton from '../ui-showcase/LoadingButton';

const buttonComponents = [
  {
    name: 'Liquid Fill Button',
    component: <LiquidFillButton />,
    code: `// Liquid fill from bottom on hover
const onEnter = () => {
  gsap.fromTo(fill, { y: '100%' }, { y: '0%', duration: 0.4, ease: 'power2.out' });
  gsap.to(text, { color: '#ffffff', duration: 0.3 });
};
const onLeave = () => {
  gsap.to(fill, { y: '-100%', duration: 0.35, ease: 'power2.in' });
  gsap.to(text, { color: '#a78bfa', duration: 0.3 });
};`,
  },
  {
    name: 'Arrow Slide Button',
    component: <ArrowSlideButton />,
    code: `// Text slides out left, clone slides in from right
gsap.to(current, { x: '-110%', opacity: 0, duration: 0.25 });
gsap.fromTo(clone, { x: '110%', opacity: 0 },
  { x: '0%', opacity: 1, duration: 0.25, ease: 'power2.out' });`,
  },
  {
    name: 'Magnetic Pill Button',
    component: <MagneticPillButton />,
    code: `// Magnetic pull toward cursor within 100px radius
const qx = gsap.quickTo(btn, 'x', { duration: 0.3 });
const qy = gsap.quickTo(btn, 'y', { duration: 0.3 });
// Text moves at half distance for parallax depth
const qtx = gsap.quickTo(text, 'x', { duration: 0.5 });
// On leave: elastic snap back
gsap.to(btn, { x: 0, y: 0, ease: 'elastic.out(1,0.4)' });`,
  },
  {
    name: 'Shatter Button',
    component: <ShatterButton />,
    code: `// Each letter flies off randomly
gsap.to(chars, {
  x: () => gsap.utils.random(-150, 150),
  y: () => gsap.utils.random(-150, 150),
  rotation: () => gsap.utils.random(-180, 180),
  opacity: 0, scale: 0,
  stagger: 0.02, duration: 0.6, ease: 'power2.in',
});
// Reassemble with elastic ease
gsap.to(chars, {
  x: 0, y: 0, rotation: 0, opacity: 1, scale: 1,
  stagger: 0.03, ease: 'elastic.out(1,0.5)',
});`,
  },
  {
    name: 'Border Draw Button',
    component: <BorderDrawButton />,
    code: `// 4 border lines draw clockwise on hover
const tl = gsap.timeline();
tl.fromTo(top, { width: '0%' }, { width: '100%', duration: 0.15 });
tl.fromTo(right, { height: '0%' }, { height: '100%', duration: 0.15 }, '-=0.07');
tl.fromTo(bottom, { width: '0%' }, { width: '100%', duration: 0.15 }, '-=0.07');
tl.fromTo(left, { height: '0%' }, { height: '100%', duration: 0.15 }, '-=0.07');`,
  },
  {
    name: 'Loading Button',
    component: <LoadingButton />,
    code: `// State machine: Default → Loading → Success → Default
// Loading: three dots pulse with stagger
gsap.fromTo(dots, { scale: 0.5 }, {
  scale: 1, stagger: { each: 0.15, repeat: 3, yoyo: true },
});
// Success: checkmark scales in with elastic
gsap.fromTo(check, { scale: 0 }, {
  scale: 1, ease: 'elastic.out(1,0.5)',
});`,
  },
];

const ButtonsSection = () => (
  <section id="buttons" className="py-24">
    <SectionHeader label="BUTTONS" heading="Every Click, Intentional" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {buttonComponents.map(c => (
        <ComponentCard key={c.name} name={c.name} code={c.code} category="buttons">
          {c.component}
        </ComponentCard>
      ))}
    </div>
  </section>
);

export default ButtonsSection;

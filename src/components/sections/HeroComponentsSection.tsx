import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import CinematicHero from '../ui-showcase/CinematicHero';
import SplitHero from '../ui-showcase/SplitHero';
import MinimalHero from '../ui-showcase/MinimalHero';

const heroComponents = [
  {
    name: 'Cinematic Hero',
    component: <CinematicHero />,
    code: `const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
tl.fromTo('.badge', { opacity: 0, y: -10 }, { opacity: 1, y: 0 });
tl.fromTo('.heading-line', { y: '100%' }, { y: '0%', stagger: 0.1 });
tl.fromTo('.subtext', { opacity: 0, y: 10 }, { opacity: 1, y: 0 });
tl.fromTo('.cta', { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.1 });`,
  },
  {
    name: 'Split Hero',
    component: <SplitHero />,
    code: `// Left: staggered word reveal
tl.fromTo('.word', { y: '100%' }, 
  { y: '0%', stagger: 0.1, ease: 'power4.out' });
// Center: animated split line
gsap.fromTo('.line', { scaleY: 0 }, { scaleY: 1 });
// Right: counter-rotating shapes
gsap.to('.outer', { rotation: 360, repeat: -1, ease: 'none' });
gsap.to('.inner', { rotation: -360, repeat: -1, ease: 'none' });`,
  },
  {
    name: 'Minimal Hero',
    component: <MinimalHero />,
    code: `const words = ['DESIGN', 'BUILD', 'SHIP'];
let idx = 0;
setInterval(() => {
  gsap.to(el, {
    y: '-100%',
    clipPath: 'inset(0 0 100% 0)',
    onComplete: () => {
      idx = (idx + 1) % words.length;
      el.textContent = words[idx];
      gsap.set(el, { y: '100%', clipPath: 'inset(100% 0 0 0)' });
      gsap.to(el, { y: '0%', clipPath: 'inset(0% 0 0% 0)' });
    },
  });
}, 2000);`,
  },
];

const HeroComponentsSection = () => (
  <section id="hero" className="py-24">
    <SectionHeader label="HERO" heading="First Impressions, Perfected" />
    <div className="grid grid-cols-1 gap-6">
      {heroComponents.map(c => (
        <ComponentCard key={c.name} name={c.name} code={c.code} category="hero">
          {c.component}
        </ComponentCard>
      ))}
    </div>
  </section>
);

export default HeroComponentsSection;

import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import Marquee from '../ui-showcase/Marquee';
import ScrollProgressBar from '../ui-showcase/ScrollProgressBar';
import StickyScrollReveal from '../ui-showcase/StickyScrollReveal';

const scrollComponents = [
  {
    name: 'Smooth Marquee',
    component: <Marquee />,
    code: `// Duplicate items for seamless loop
row.innerHTML += row.innerHTML;
const tl = gsap.to(row, {
  xPercent: -50, duration: 15, repeat: -1, ease: 'none'
});
// Pause on hover
container.addEventListener('mouseenter', () => tl.timeScale(0));
container.addEventListener('mouseleave', () => {
  gsap.to(tl, { timeScale: 1, duration: 0.5 });
});`,
  },
  {
    name: 'Sticky Scroll Reveal',
    component: <StickyScrollReveal />,
    code: `// Left side stays sticky
<div className="sticky top-32 h-fit">
  <h3>{items[activeIndex].title}</h3>
</div>
// ScrollTrigger updates active index
ScrollTrigger.create({
  trigger: rightItem,
  start: 'top center',
  onEnter: () => setActiveIndex(i),
  onEnterBack: () => setActiveIndex(i),
});`,
  },
  {
    name: 'Scroll Progress Bar',
    component: <ScrollProgressBar />,
    code: `gsap.to(progressBar, {
  scaleX: 1,
  ease: 'none',
  scrollTrigger: {
    trigger: container,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
  },
});`,
  },
];

const ScrollSection = () => (
  <section id="scroll" className="py-24">
    <SectionHeader label="SCROLL" heading="Scroll-Driven Motion" />
    <div className="grid grid-cols-1 gap-6">
      {scrollComponents.map(c => (
        <ComponentCard key={c.name} name={c.name} code={c.code} category="scroll">
          {c.component}
        </ComponentCard>
      ))}
    </div>
  </section>
);

export default ScrollSection;

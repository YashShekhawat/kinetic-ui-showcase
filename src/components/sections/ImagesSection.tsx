import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import ParallaxImage from '../ui-showcase/ParallaxImage';
import HoverRevealImage from '../ui-showcase/HoverRevealImage';
import InfiniteGallery from '../ui-showcase/InfiniteGallery';
import ImageStackReveal from '../ui-showcase/ImageStackReveal';

const imageComponents = [
  {
    name: 'Parallax Image',
    component: <ParallaxImage />,
    code: `gsap.to(image, {
  yPercent: -20,
  ease: 'none',
  scrollTrigger: {
    trigger: container,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  },
});`,
  },
  {
    name: 'Hover Reveal Image',
    component: <HoverRevealImage />,
    code: `// Float image follows cursor on hover
gsap.to(floatingImg, {
  x: mouseX - 120,
  y: mouseY - 80,
  duration: 0.3,
  ease: 'power2.out',
});
// Show/hide with scale
gsap.to(floatingImg, { opacity: 1, scale: 1, duration: 0.3 });`,
  },
  {
    name: 'Infinite Gallery',
    component: <InfiniteGallery />,
    code: `// Duplicate content for seamless loop
row.innerHTML += row.innerHTML;
// Continuous horizontal movement
gsap.to(row, {
  xPercent: -50,
  duration: 20,
  repeat: -1,
  ease: 'none',
});
// Pause on hover
container.addEventListener('mouseenter', () => tl.pause());`,
  },
  {
    name: 'Image Stack Reveal',
    component: <ImageStackReveal />,
    code: `// Fan out cards on hover
gsap.to(cards[0], { rotation: -15, x: -80, duration: 0.5 });
gsap.to(cards[1], { rotation: 0, y: -10, duration: 0.5 });
gsap.to(cards[2], { rotation: 15, x: 80, duration: 0.5 });
// Reverse on mouse leave`,
  },
];

const ImagesSection = () => (
  <section id="images" className="py-24">
    <SectionHeader label="IMAGES" heading="Images That Move" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {imageComponents.map(c => (
        <ComponentCard key={c.name} name={c.name} code={c.code} category="images">
          {c.component}
        </ComponentCard>
      ))}
    </div>
  </section>
);

export default ImagesSection;

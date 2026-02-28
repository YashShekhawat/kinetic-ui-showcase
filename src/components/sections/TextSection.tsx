import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import TextReveal from '../ui-showcase/TextReveal';
import ScrambleText from '../ui-showcase/ScrambleText';
import GradientText from '../ui-showcase/GradientText';
import CountingNumbers from '../ui-showcase/CountingNumbers';
import WordByWordReveal from '../ui-showcase/WordByWordReveal';
import Typewriter from '../ui-showcase/Typewriter';

const textComponents = [
  {
    name: 'Text Reveal',
    component: <TextReveal />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const TextReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray('.tr-word-inner');
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
      tl.fromTo(words, { y: '100%' }, 
        { y: '0%', duration: 0.8, stagger: 0.12, ease: 'power4.out' });
      tl.to(words, { y: '-100%', duration: 0.6, stagger: 0.08 }, '+=1.5');
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={ref} className="flex gap-3">
      {['Every', 'word.', 'A', 'moment.'].map((w, i) => (
        <div key={i} className="overflow-hidden">
          <span className="tr-word-inner block">{w}</span>
        </div>
      ))}
    </div>
  );
};`,
  },
  {
    name: 'Scramble Text',
    component: <ScrambleText />,
    code: `import { useEffect, useState } from 'react';
import gsap from 'gsap';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const ScrambleText = ({ text = 'KINETIC UI' }) => {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    const scramble = () => {
      const obj = { progress: 0 };
      gsap.to(obj, {
        progress: 1, duration: 1.2,
        onUpdate: () => {
          const resolved = Math.floor(obj.progress * text.length);
          let result = '';
          for (let i = 0; i < text.length; i++) {
            result += i < resolved ? text[i] : chars[Math.floor(Math.random() * chars.length)];
          }
          setDisplay(result);
        },
      });
    };
    scramble();
    const iv = setInterval(scramble, 3000);
    return () => clearInterval(iv);
  }, [text]);
  return <span>{display}</span>;
};`,
  },
  {
    name: 'Gradient Text',
    component: <GradientText />,
    code: `const GradientText = ({ children }) => (
  <span style={{
    background: 'linear-gradient(90deg, #7c3aed, #a78bfa, #e879f9, #7c3aed)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'gradient 3s linear infinite',
  }}>
    {children}
  </span>
);`,
  },
  {
    name: 'Counting Numbers',
    component: <CountingNumbers />,
    code: `import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Count up number when scrolled into view
gsap.to(element, {
  textContent: targetValue,
  duration: 2,
  snap: { textContent: 1 },
  ease: 'power2.out',
  scrollTrigger: {
    trigger: element,
    start: 'top 90%',
    once: true,
  },
});`,
  },
  {
    name: 'Word by Word Reveal',
    component: <WordByWordReveal />,
    code: `const words = text.split(' ');
const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
tl.fromTo('.word', 
  { opacity: 0, y: 15 }, 
  { opacity: 1, y: 0, duration: 0.4, stagger: 0.04 }
);
tl.to('.word', 
  { opacity: 0, y: -10, duration: 0.3, stagger: 0.02 }, 
  '+=2'
);`,
  },
  {
    name: 'Typewriter',
    component: <Typewriter />,
    code: `const phrases = ['React Developer.', 'UI Engineer.', 'Motion Designer.'];
const tl = gsap.timeline({ repeat: -1 });

phrases.forEach(phrase => {
  // Type each character
  phrase.split('').forEach((char, i) => {
    tl.call(() => { el.textContent = phrase.slice(0, i + 1); }, [], \`+=\${0.06}\`);
  });
  tl.to({}, { duration: 1.5 }); // Pause
  // Delete
  for (let i = phrase.length; i >= 0; i--) {
    tl.call(() => { el.textContent = phrase.slice(0, i); }, [], \`+=\${0.03}\`);
  }
});`,
  },
];

const TextSection = () => (
  <section id="text" className="py-24">
    <SectionHeader label="TEXT" heading="Typography in Motion" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {textComponents.map(c => (
        <ComponentCard key={c.name} name={c.name} code={c.code} category="text">
          {c.component}
        </ComponentCard>
      ))}
    </div>
  </section>
);

export default TextSection;

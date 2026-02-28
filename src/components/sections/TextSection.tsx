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
};

export default TextReveal;`,
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
};

export default ScrambleText;`,
  },
  {
    name: 'Gradient Text',
    component: <GradientText />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const GradientText = () => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      backgroundPosition: '200% center',
      duration: 3,
      repeat: -1,
      ease: 'none',
    });
  }, []);

  return (
    <span
      ref={ref}
      className="font-syne font-extrabold text-4xl"
      style={{
        background: 'linear-gradient(90deg, #7c3aed, #a78bfa, #e879f9, #7c3aed)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      Beautiful interfaces
    </span>
  );
};

export default GradientText;`,
  },
  {
    name: 'Counting Numbers',
    component: <CountingNumbers />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 2400, suffix: '+', label: 'Users' },
  { value: 99.7, suffix: '%', label: 'Uptime', decimals: 1 },
  { value: 15000, suffix: '+', label: 'Downloads', format: true },
];

const CountingNumbers = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.cn-num').forEach(el => {
        const target = parseFloat(el.getAttribute('data-val') || '0');
        const dec = parseInt(el.getAttribute('data-dec') || '0');
        gsap.fromTo(el, { textContent: '0' }, {
          textContent: target,
          duration: 2,
          snap: dec ? { textContent: 0.1 } : { textContent: 1 },
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate() {
            const v = parseFloat(el.textContent || '0');
            if (el.getAttribute('data-fmt') === '1' && v >= 1000) {
              el.textContent = (v / 1000).toFixed(1) + 'K';
            } else if (dec) {
              el.textContent = v.toFixed(dec);
            }
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="flex gap-10 items-end">
      {stats.map((s, i) => (
        <div key={i} className="text-center">
          <div className="font-syne font-extrabold text-5xl text-[#ededed]">
            <span className="cn-num" data-val={s.value} data-dec={s.decimals || 0} data-fmt={s.format ? '1' : '0'}>0</span>
            <span className="text-[#a78bfa]">{s.suffix}</span>
          </div>
          <div className="font-inter font-light text-xs text-[#a0a0b0] mt-2">{s.label}</div>
        </div>
      ))}
    </div>
  );
};

export default CountingNumbers;`,
  },
  {
    name: 'Word by Word Reveal',
    component: <WordByWordReveal />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const words = 'Craft interfaces that feel inevitable and impossible to forget'.split(' ');

const WordByWordReveal = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>('.wbw-word');
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
      tl.fromTo(els, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power3.out' });
      tl.to(els, { opacity: 0, y: -10, duration: 0.3, stagger: 0.02 }, '+=2');
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="font-inter font-light text-lg text-[#ededed] leading-relaxed max-w-[400px] text-center">
      {words.map((w, i) => (
        <span key={i} className="wbw-word inline-block mr-1.5 opacity-0">{w}</span>
      ))}
    </div>
  );
};

export default WordByWordReveal;`,
  },
  {
    name: 'Typewriter',
    component: <Typewriter />,
    code: `import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const phrases = ['React Developer.', 'UI Engineer.', 'Motion Designer.'];

const Typewriter = () => {
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textRef.current!;
    const tl = gsap.timeline({ repeat: -1 });

    // Blinking cursor
    gsap.to(cursorRef.current, { opacity: 0, duration: 0.5, repeat: -1, yoyo: true });

    phrases.forEach(phrase => {
      // Type each character
      phrase.split('').forEach((char, i) => {
        tl.call(() => { el.textContent = phrase.slice(0, i + 1); }, [], \`+=\${0.06}\`);
      });
      tl.to({}, { duration: 1.5 }); // Pause
      // Delete each character
      for (let i = phrase.length; i >= 0; i--) {
        tl.call(() => { el.textContent = phrase.slice(0, i); }, [], \`+=\${0.03}\`);
      }
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <div className="font-inter text-lg text-[#ededed]">
      I'm a <span ref={textRef} className="text-[#a78bfa]"></span>
      <span ref={cursorRef} className="text-[#7c3aed]">|</span>
    </div>
  );
};

export default Typewriter;`,
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

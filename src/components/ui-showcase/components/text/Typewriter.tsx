import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const phrases = ['React Developer.', 'UI Engineer.', 'Motion Designer.'];

const Typewriter = () => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const tl = gsap.timeline({ repeat: -1 });

    phrases.forEach(phrase => {
      // Type
      tl.call(() => { el.textContent = ''; });
      phrase.split('').forEach((char, i) => {
        tl.call(() => { el.textContent = phrase.slice(0, i + 1); }, [], `+=${0.06}`);
      });
      tl.to({}, { duration: 1.5 }); // Pause
      // Delete
      for (let i = phrase.length; i >= 0; i--) {
        tl.call(() => { el.textContent = phrase.slice(0, i); }, [], `+=${0.03}`);
      }
      tl.to({}, { duration: 0.3 }); // Small pause
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <div className="font-mono text-xl text-kinetic-text">
      <span ref={ref}></span>
      <span className="inline-block w-0.5 h-5 bg-kinetic-accent ml-0.5 animate-pulse" />
    </div>
  );
};

export default Typewriter;

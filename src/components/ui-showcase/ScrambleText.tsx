import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg0123456789';
const target = 'KINETIC UI';

const ScrambleText = () => {
  const [text, setText] = useState(target);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scramble = () => {
      const obj = { progress: 0 };
      gsap.to(obj, {
        progress: 1,
        duration: 1.2,
        ease: 'none',
        onUpdate: () => {
          const p = obj.progress;
          const resolved = Math.floor(p * target.length);
          let result = '';
          for (let i = 0; i < target.length; i++) {
            if (target[i] === ' ') { result += ' '; continue; }
            result += i < resolved ? target[i] : chars[Math.floor(Math.random() * chars.length)];
          }
          setText(result);
        },
      });
    };

    scramble();
    const interval = setInterval(scramble, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={ref} className="font-mono text-2xl font-medium text-kinetic-text tracking-wider">
      {text}
    </div>
  );
};

export default ScrambleText;

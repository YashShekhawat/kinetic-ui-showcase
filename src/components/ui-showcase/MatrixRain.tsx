import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ·×+—/\\|';
const COL_W = 16;

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const speedRef = useRef(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let w = containerRef.current!.clientWidth;
    let h = containerRef.current!.clientHeight;
    canvas.width = w;
    canvas.height = h;

    const cols = Math.floor(w / COL_W);
    const drops = new Array(cols).fill(0).map(() => Math.random() * -h);
    const speeds = new Array(cols).fill(0).map(() => 1 + Math.random() * 3);

    gsap.fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 1 });

    const draw = () => {
      ctx.fillStyle = 'rgba(3,3,3,0.15)';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < cols; i++) {
        const x = i * COL_W;
        const y = drops[i];
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];

        // Head
        ctx.fillStyle = '#c4b5fd';
        ctx.font = '13px JetBrains Mono';
        ctx.fillText(ch, x, y);

        // Trail
        for (let t = 1; t < 8; t++) {
          const ty = y - t * COL_W;
          if (ty < 0) break;
          const tc = CHARS[Math.floor(Math.random() * CHARS.length)];
          ctx.fillStyle = `rgba(155,93,229,${0.5 - t * 0.06})`;
          ctx.fillText(tc, x, ty);
        }

        drops[i] += speeds[i] * speedRef.current;
        if (drops[i] > h + 50) {
          drops[i] = Math.random() * -40;
          speeds[i] = 1 + Math.random() * 3;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      w = containerRef.current!.clientWidth;
      h = containerRef.current!.clientHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ minHeight: 320, background: '#030303' }}
      onMouseEnter={() => { gsap.to(speedRef, { current: 2, duration: 0.3 }); }}
      onMouseLeave={() => { gsap.to(speedRef, { current: 1, duration: 0.5 }); }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

export default MatrixRain;

import gsap from 'gsap';
import { useEffect, useRef } from 'react';

const row1Text =
  '60+ Components · Pure GSAP · Dark by Default · Copy Paste Ready · React 18+ · $9 Lifetime · No Subscription · TypeScript · Tailwind CSS · MIT License · Awwwards Inspired · Zero Config · ';
const row2Text =
  'Hero Blocks · Pricing Sections · Testimonials · Feature Grids · Parallax · Scroll Animations · Bento Grid · Stats Showcase · Image Reveal · Horizontal Scroll · Text Splits · Marquee · ';

const MovingStatsBar = () => {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const tween1Ref = useRef<gsap.core.Tween | null>(null);
  const tween2Ref = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const r1 = row1Ref.current;
    const r2 = row2Ref.current;
    if (!r1 || !r2) return;
    r1.innerHTML += r1.innerHTML;
    r2.innerHTML += r2.innerHTML;
    tween1Ref.current = gsap.to(r1, {
      xPercent: -50,
      duration: 40,
      repeat: -1,
      ease: 'none',
    });
    tween2Ref.current = gsap.to(r2, {
      xPercent: -50,
      duration: 35,
      repeat: -1,
      ease: 'none',
    });
    // Reverse row 2
    if (tween2Ref.current) {
      gsap.set(r2, { xPercent: -50 });
      tween2Ref.current.kill();
      tween2Ref.current = gsap.to(r2, {
        xPercent: 0,
        duration: 35,
        repeat: -1,
        ease: 'none',
      });
    }
    return () => {
      tween1Ref.current?.kill();
      tween2Ref.current?.kill();
    };
  }, []);

  const pauseRow =
    (tweenRef: React.MutableRefObject<gsap.core.Tween | null>) => () => {
      tweenRef.current?.pause();
    };
  const resumeRow =
    (tweenRef: React.MutableRefObject<gsap.core.Tween | null>) => () => {
      tweenRef.current?.resume();
    };

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        borderTop: '1px solid #1a1a2a',
        borderBottom: '1px solid #1a1a2a',
        background: '#111119',
        padding: '10px 0',
      }}
    >
      {/* Row 1 */}
      <div
        className="overflow-hidden"
        onMouseEnter={pauseRow(tween1Ref)}
        onMouseLeave={resumeRow(tween1Ref)}
      >
        <div ref={row1Ref} className="flex w-max whitespace-nowrap">
          <span
            className="font-mono text-[10px] md:text-[12px] tracking-[0.15em]"
            style={{ color: '#686878' }}
          >
            {row1Text}
          </span>
        </div>
      </div>
      {/* Row 2 — reverse direction */}
      <div
        className="overflow-hidden mt-1.5"
        onMouseEnter={pauseRow(tween2Ref)}
        onMouseLeave={resumeRow(tween2Ref)}
      >
        <div ref={row2Ref} className="flex w-max whitespace-nowrap">
          <span
            className="font-mono text-[10px] md:text-[12px] tracking-[0.15em]"
            style={{ color: '#808090' }}
          >
            {row2Text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovingStatsBar;

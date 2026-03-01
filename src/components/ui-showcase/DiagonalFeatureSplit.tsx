import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const features = [
  { num: '01', title: 'Zero Config', desc: 'Drop in any component and it works. No setup, no config files, no surprises.' },
  { num: '02', title: 'GSAP Native', desc: 'Every animation uses GSAP under the hood — the industry standard for professional motion.' },
  { num: '03', title: 'Copy Paste Ready', desc: 'Each component is self-contained. Copy the code, paste it in, done. No dependencies.' },
  { num: '04', title: 'Fully Customizable', desc: 'Every value is a variable. Colors, speeds, easings — all exposed and documented.' },
];

const DiagonalFeatureSplit = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement[]>([]);
  const headingRef = useRef<HTMLDivElement>(null);
  const vertTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading clip reveal
      if (headingRef.current) {
        gsap.fromTo(headingRef.current, { clipPath: 'inset(0 100% 0 0)' }, {
          clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power3.out',
        });
      }

      // Stagger blocks in
      blocksRef.current.forEach((block, i) => {
        if (!block) return;
        gsap.fromTo(block, { opacity: 0, x: -30, y: 20 }, {
          opacity: 1, x: 0, y: 0, duration: 0.7, delay: 0.3 + i * 0.15, ease: 'power3.out',
        });

        // Count up number
        const numEl = block.querySelector<HTMLElement>('.df-num');
        if (numEl) {
          const target = i + 1;
          gsap.to(numEl, {
            textContent: target, duration: 0.8, delay: 0.3 + i * 0.15,
            snap: { textContent: 1 }, ease: 'power2.out',
            onUpdate() {
              numEl.textContent = '0' + Math.round(parseFloat(numEl.textContent || '0'));
            },
          });
        }

        // Line draw
        const line = block.querySelector<HTMLElement>('.df-line');
        if (line) {
          gsap.fromTo(line, { scaleX: 0 }, {
            scaleX: 1, duration: 0.6, delay: 0.3 + i * 0.15, ease: 'power2.out',
            transformOrigin: 'left center',
          });
        }
      });

      // Vertical text drift
      if (vertTextRef.current) {
        gsap.to(vertTextRef.current, {
          y: -20, duration: 8, yoyo: true, repeat: -1, ease: 'sine.inOut',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleBlockEnter = (i: number) => {
    const block = blocksRef.current[i];
    if (!block) return;
    const title = block.querySelector<HTMLElement>('.df-title');
    const line = block.querySelector<HTMLElement>('.df-line');
    const num = block.querySelector<HTMLElement>('.df-num');
    if (title) gsap.to(title, { x: 8, duration: 0.25, ease: 'power2.out' });
    if (line) {
      gsap.to(line, { borderColor: '#7c3aed', duration: 0.15 });
      gsap.to(line, { borderColor: '#1a1a2e', duration: 0.3, delay: 0.15 });
    }
    if (num) gsap.to(num, { opacity: 0.3, duration: 0.3 });
  };

  const handleBlockLeave = (i: number) => {
    const block = blocksRef.current[i];
    if (!block) return;
    const title = block.querySelector<HTMLElement>('.df-title');
    const num = block.querySelector<HTMLElement>('.df-num');
    if (title) gsap.to(title, { x: 0, duration: 0.25, ease: 'power2.out' });
    if (num) gsap.to(num, { opacity: 0.15, duration: 0.3 });
  };

  const totalH = 270 + 80; // last block top + block height approx

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden" style={{ background: '#0a0a12', padding: '80px 40px', minHeight: 480 }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <span
          className="font-mono text-[10px] inline-block px-3 py-1 rounded mb-4"
          style={{ color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)', width: 'fit-content' }}
        >
          FEATURES
        </span>
        <div ref={headingRef} style={{ clipPath: 'inset(0 100% 0 0)' }}>
          <h2 className="font-syne font-extrabold" style={{ fontSize: '3.5rem', color: '#ededed' }}>
            Built different.
          </h2>
        </div>

        {/* Diagonal blocks */}
        <div className="relative mt-16" style={{ height: totalH }}>
          {features.map((f, i) => (
            <div
              key={i}
              ref={el => { if (el) blocksRef.current[i] = el; }}
              className="absolute opacity-0 cursor-default"
              style={{ width: 340, left: i * 120, top: i * 90 }}
              onMouseEnter={() => handleBlockEnter(i)}
              onMouseLeave={() => handleBlockLeave(i)}
            >
              <div className="df-line w-full h-px mb-5" style={{ borderTop: '1px solid #1a1a2e', transformOrigin: 'left center' }} />
              <span className="df-num font-syne font-extrabold block" style={{ fontSize: '4rem', color: 'rgba(124,58,237,0.15)' }}>
                00
              </span>
              <h3 className="df-title font-syne font-bold mt-1" style={{ fontSize: '1.3rem', color: '#ededed' }}>
                {f.title}
              </h3>
              <p className="font-inter font-light mt-2" style={{ fontSize: 13, color: '#606070', lineHeight: 1.7, maxWidth: 280 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative vertical text */}
      <div
        ref={vertTextRef}
        className="absolute hidden lg:block font-syne font-extrabold"
        style={{
          right: 40, top: '50%', transform: 'translateY(-50%) rotate(90deg)',
          fontSize: '5rem', color: '#0f0f1a', transformOrigin: 'center center',
          whiteSpace: 'nowrap', pointerEvents: 'none',
        }}
      >
        FEATURES
      </div>
    </div>
  );
};

export default DiagonalFeatureSplit;

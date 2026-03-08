import { useRef } from 'react';
import gsap from 'gsap';

const SpotlightCursor = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gsap.to(spotRef.current!, {
      background: `radial-gradient(200px circle at ${x}px ${y}px, rgba(124,58,237,0.12), transparent)`,
      duration: 0.1,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      className="relative w-full h-[280px] rounded-lg overflow-hidden cursor-none flex items-center justify-center"
      style={{ background: '#050505', border: '1px solid #1a1a1a' }}
    >
      <div ref={spotRef} className="absolute inset-0 pointer-events-none" />
      <div className="text-center opacity-30 hover:opacity-100 transition-opacity pointer-events-none">
        <h3 className="font-syne font-bold text-2xl text-kinetic-text">Hidden Content</h3>
        <p className="font-inter text-sm text-kinetic-text-muted mt-2">Move your cursor to reveal</p>
      </div>
    </div>
  );
};

export default SpotlightCursor;

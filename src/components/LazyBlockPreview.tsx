import { useEffect, useRef, useState } from 'react';

const BlockSkeleton = () => (
  <div
    className="w-full rounded-lg overflow-hidden relative"
    style={{ height: 480, background: '#0d0d12', border: '1px solid #1a1a2e' }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.04) 50%, transparent 100%)',
        animation: 'skeletonShimmer 2s ease-in-out infinite',
      }}
    />
    <div style={{ padding: 28 }}>
      <div
        style={{
          width: 72,
          height: 10,
          borderRadius: 4,
          background: '#1a1a2e',
          marginBottom: 16,
        }}
      />
      <div
        style={{
          width: '45%',
          height: 24,
          borderRadius: 4,
          background: '#1a1a2e',
          marginBottom: 10,
        }}
      />
      <div
        style={{
          width: '30%',
          height: 14,
          borderRadius: 4,
          background: '#13131e',
          marginBottom: 32,
        }}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}
      >
        {[120, 160, 140].map((h, i) => (
          <div
            key={i}
            style={{
              height: h,
              borderRadius: 6,
              background: '#13131e',
              border: '1px solid #1a1a2e',
            }}
          />
        ))}
      </div>
    </div>
    <style>{`
      @keyframes skeletonShimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
      }
    `}</style>
  </div>
);

interface LazyBlockPreviewProps {
  children: React.ReactNode;
  rootMargin?: string;
}

const LazyBlockPreview = ({
  children,
  rootMargin = '300px',
}: LazyBlockPreviewProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={wrapperRef} style={{ minHeight: 480 }}>
      {shouldRender ? children : <BlockSkeleton />}
    </div>
  );
};

export default LazyBlockPreview;

import { useEffect, useRef, useState } from 'react';

const BlockSkeleton = () => (
  <div
    className="w-full animate-pulse"
    style={{
      minHeight: 400,
      background: '#0e0e14',
      borderRadius: 8,
    }}
  >
    <div className="p-6 space-y-4">
      <div style={{ height: 12, width: '40%', background: '#1e1e2e', borderRadius: 4 }} />
      <div style={{ height: 12, width: '70%', background: '#1e1e2e', borderRadius: 4 }} />
      <div style={{ height: 12, width: '55%', background: '#1e1e2e', borderRadius: 4 }} />
      <div style={{ height: 200, width: '100%', background: '#1e1e2e', borderRadius: 8, marginTop: 24 }} />
      <div style={{ height: 12, width: '60%', background: '#1e1e2e', borderRadius: 4 }} />
      <div style={{ height: 12, width: '45%', background: '#1e1e2e', borderRadius: 4 }} />
    </div>
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

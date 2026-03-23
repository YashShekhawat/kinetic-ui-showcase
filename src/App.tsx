import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Cursor from './components/layout/Cursor';
import { useIsTouch } from './hooks/use-mobile';
import PageTransition from './components/layout/PageTransition';
import ScrollToTop from './components/layout/ScrollToTop';
import ScrollToTopButton from './components/layout/ScrollToTopButton';
import LandingPage from './pages/LandingPage';
import ComponentsPage from './pages/ComponentsPage';
import BlocksPage from './pages/BlocksPage';
import BlockCategoryPage from './pages/BlockCategoryPage';
import PricingPage from './pages/PricingPage';
import NotFound from './pages/NotFound';
import AdminPage from './pages/AdminPage';
import DocsPage from './pages/DocsPage';

gsap.registerPlugin(ScrollTrigger);

const queryClient = new QueryClient();

const AppContent = () => {
  const isTouch = useIsTouch();

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.3 });
    (window as any).__lenis = lenis;

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {!isTouch && <Cursor />}
      <PageTransition />
      <ScrollToTop />
      <ScrollToTopButton />

      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[998]"
        style={{ opacity: 0.025 }}
      >
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.68"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/components" element={<ComponentsPage />} />
        <Route path="/blocks" element={<BlocksPage />} />
        <Route path="/blocks/:category" element={<BlockCategoryPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

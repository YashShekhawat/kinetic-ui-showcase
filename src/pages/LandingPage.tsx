import LandingNavbar from '@/components/layout/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import MovingStatsBar from '@/components/landing/MovingStatsBar';
import LiveShowcase from '@/components/landing/LiveShowcase';
import WhyKineticUI from '@/components/landing/WhyKineticUI';
import BlocksPreview from '@/components/landing/BlocksPreview';
import CTABanner from '@/components/landing/CTABanner';
import LandingFooter from '@/components/landing/LandingFooter';

const LandingPage = () => {

  return (
  <div className="min-h-screen" style={{ background: '#0e0e14' }}>
    {/* 1. Thin violet top line */}
    <div style={{ height: 2, background: 'linear-gradient(to right, transparent 0%, #7c3aed 30%, #a78bfa 70%, transparent 100%)' }} />
    <LandingNavbar />
    <HeroSection />
    <MovingStatsBar />
    <LiveShowcase />
    <WhyKineticUI />
    <BlocksPreview />
    <CTABanner />
    <LandingFooter />
  </div>
  );
};

export default LandingPage;

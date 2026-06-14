import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';

const RefundPage = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen" style={{ background: '#060608' }}>
      <TopBar search={search} onSearchChange={setSearch} placeholder="Search..." />
      <main className="max-w-[720px] mx-auto px-6" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <h1 className="font-syne font-extrabold text-[2.4rem]" style={{ color: '#f0ede8' }}>Refund Policy</h1>
        <p className="font-mono text-[11px] mb-12" style={{ color: '#404050' }}>Last updated: January 2025</p>

        <p className="font-inter text-[0.9rem] leading-[1.8]" style={{ color: '#909098' }}>
          Our policy regarding refunds for Kinetic UI Pro purchases.
        </p>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <p className="font-inter text-[0.9rem] leading-[1.8]" style={{ color: '#909098' }}>
            Due to the nature of our digital products, we do not offer refunds for Kinetic UI Pro purchases. Once the order is confirmed and access is granted, the purchase is final.
          </p>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            We encourage you to explore the free components thoroughly before upgrading to Pro. All Pro component previews are visible without a purchase so you can evaluate them before buying.
          </p>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            If you are facing any problems with our products or have any questions, we are here to help. Please reach out to us at support@kineticui.com and we will do our best to resolve your issue.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPage;

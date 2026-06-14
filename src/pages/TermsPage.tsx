import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';

const TermsPage = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen" style={{ background: '#060608' }}>
      <TopBar search={search} onSearchChange={setSearch} placeholder="Search..." />
      <main className="max-w-[720px] mx-auto px-6" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <h1 className="font-syne font-extrabold text-[2.4rem]" style={{ color: '#f0ede8' }}>Terms and Conditions</h1>
        <p className="font-mono text-[11px] mb-12" style={{ color: '#404050' }}>Last updated: January 2025</p>

        <p className="font-inter text-[0.9rem] leading-[1.8]" style={{ color: '#909098' }}>
          Please read these terms and conditions carefully before using Kinetic UI.
        </p>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>Overview</h2>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            These terms and conditions outline the rules and regulations for the use of Kinetic UI's website. By accessing this website, we assume you accept these terms and conditions. Do not continue to use Kinetic UI if you do not agree to all of the terms stated on this page.
          </p>
        </div>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>Cookies</h2>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            The website uses cookies to maintain your authentication session. By accessing Kinetic UI, you agree to the use of required cookies.
          </p>
        </div>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>License</h2>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            Unless otherwise stated, Yash Shekhawat and/or licensors own the intellectual property rights for all material on Kinetic UI. All intellectual property rights are reserved. Free components are available under the MIT License. Pro components are protected under a commercial license. Please refer to the License page for full details.
          </p>
        </div>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>You must not</h2>
          <ul className="font-inter text-[0.9rem] leading-[1.8] pl-5 list-disc mt-4" style={{ color: '#909098' }}>
            <li>Republish or redistribute pro component source code</li>
            <li>Sell, rent, or sub-license pro components from Kinetic UI</li>
            <li>Use Kinetic UI to build a competing component library</li>
            <li>Attempt to gain unauthorized access to any part of the service</li>
          </ul>
        </div>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>Purchases</h2>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            All purchases are processed securely through our payment provider. By completing a purchase you agree to provide accurate information and accept that all sales are final. Please refer to our Refund Policy for more details.
          </p>
        </div>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>Disclaimer</h2>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            Kinetic UI is provided as is without warranty of any kind. We do not guarantee the service will be uninterrupted or error-free. We are not responsible for any issues arising from the use of components in your projects.
          </p>
        </div>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>Limitation of Liability</h2>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            To the maximum extent permitted by law, Yash Shekhawat shall not be liable for any indirect, incidental, or consequential damages arising from your use of Kinetic UI.
          </p>
        </div>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>Governing Law</h2>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in India.
          </p>
        </div>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>Changes to Terms</h2>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            We reserve the right to update these terms at any time. Continued use of the service after changes constitutes acceptance of the updated terms.
          </p>
        </div>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>Contact</h2>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            For questions about these terms, contact us at support@kineticui.com
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;

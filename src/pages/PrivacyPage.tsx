import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';

const PrivacyPage = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen" style={{ background: '#060608' }}>
      <TopBar search={search} onSearchChange={setSearch} placeholder="Search..." />
      <main className="max-w-[720px] mx-auto px-6" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <h1 className="font-syne font-extrabold text-[2.4rem]" style={{ color: '#f0ede8' }}>Privacy Policy</h1>
        <p className="font-mono text-[11px] mb-12" style={{ color: '#404050' }}>Last updated: January 2025</p>

        <p className="font-inter text-[0.9rem] leading-[1.8]" style={{ color: '#909098' }}>
          This Privacy Policy describes how Kinetic UI collects, uses, and protects your personal information when you use our website and services. By using Kinetic UI, you agree to the collection and use of information in accordance with this policy.
        </p>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>Information We Collect</h2>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            <span style={{ color: '#f0ede8', fontWeight: 700 }}>Personal Data</span> — While using Kinetic UI, we may collect the following personally identifiable information: Email address — collected when you sign in or purchase a Pro license. Used to manage your account and deliver sign-in links.
          </p>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            <span style={{ color: '#f0ede8', fontWeight: 700 }}>Usage Data</span> — We may collect information on how the service is accessed and used. This may include pages visited, time spent on pages, and other diagnostic data. This data does not identify you personally.
          </p>
        </div>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>How We Use Your Information</h2>
          <ul className="font-inter text-[0.9rem] leading-[1.8] pl-5 list-disc mt-4" style={{ color: '#909098' }}>
            <li>To provide and maintain our service</li>
            <li>To manage your account and Pro license</li>
            <li>To send you sign-in links and account-related emails</li>
            <li>To detect and prevent fraudulent or unauthorized access</li>
            <li>To improve and monitor the performance of our service</li>
          </ul>
        </div>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>Cookies</h2>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            We use cookies to maintain your authentication session and improve your experience on our website.
          </p>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            <span style={{ color: '#f0ede8', fontWeight: 700 }}>Essential cookies</span> — required to authenticate users and keep you signed in. Without these, the service cannot function.
          </p>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            <span style={{ color: '#f0ede8', fontWeight: 700 }}>Preference cookies</span> — used to remember your settings and preferences across sessions.
          </p>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            You can instruct your browser to refuse all cookies. However, some parts of the service may not function properly without them.
          </p>
        </div>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>Data Retention</h2>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            We retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy. You may request deletion of your account and associated data at any time by contacting us.
          </p>
        </div>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>Data Security</h2>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            The security of your data is important to us. We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure and we cannot guarantee absolute security.
          </p>
        </div>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>Your Rights</h2>
          <ul className="font-inter text-[0.9rem] leading-[1.8] pl-5 list-disc mt-4" style={{ color: '#909098' }}>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your personal data</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            To exercise any of these rights, contact us at support@kineticui.com
          </p>
        </div>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>Children's Privacy</h2>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            Kinetic UI is not directed at anyone under the age of 13. We do not knowingly collect personal information from children under 13.
          </p>
        </div>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>Changes to This Policy</h2>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by updating the date at the top of this page. Continued use of the service after changes constitutes your acceptance of the updated policy.
          </p>
        </div>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>Contact</h2>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            If you have any questions about this Privacy Policy, contact us at support@kineticui.com
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;

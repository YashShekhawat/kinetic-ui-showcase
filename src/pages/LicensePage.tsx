import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';

const LicensePage = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen" style={{ background: '#060608' }}>
      <TopBar search={search} onSearchChange={setSearch} placeholder="Search..." />
      <main className="max-w-[720px] mx-auto px-6" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <h1 className="font-syne font-extrabold text-[2.4rem]" style={{ color: '#f0ede8' }}>License</h1>

        <p className="font-inter text-[0.9rem] leading-[1.8] mt-6" style={{ color: '#909098' }}>
          Please read the license agreement below to understand what you can and cannot do with Kinetic UI components.
        </p>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>Free Components</h2>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            All free components on Kinetic UI are open source and available under the MIT License.
          </p>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            You are free to use in personal and commercial projects, modify and adapt the code, and distribute copies. The only requirement is that the copyright notice is retained in substantial copies.
          </p>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#f0ede8' }}>
            Copyright (c) 2025 Yash Shekhawat
          </p>
        </div>

        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #1e1e2e' }}>
          <h2 className="font-syne font-bold text-[1.1rem]" style={{ color: '#f0ede8' }}>Pro Components</h2>
          <p className="font-inter text-[0.9rem] leading-[1.8] mt-4" style={{ color: '#909098' }}>
            Pro components are available under a commercial license. By purchasing a Kinetic UI Pro license, you agree to the following:
          </p>

          <p className="font-inter text-[0.9rem] leading-[1.8] mt-6" style={{ color: '#f0ede8' }}>You may:</p>
          <ul className="font-inter text-[0.9rem] leading-[1.8] pl-5 list-disc mt-2" style={{ color: '#909098' }}>
            <li>Use pro components in unlimited personal projects</li>
            <li>Use pro components in unlimited commercial projects</li>
            <li>Modify the code for your own use</li>
            <li>Use in projects delivered to clients</li>
          </ul>

          <p className="font-inter text-[0.9rem] leading-[1.8] mt-6" style={{ color: '#f0ede8' }}>You may not:</p>
          <ul className="font-inter text-[0.9rem] leading-[1.8] pl-5 list-disc mt-2" style={{ color: '#909098' }}>
            <li>Redistribute, resell, or publicly share pro component source code</li>
            <li>Publish pro components in any open source repository</li>
            <li>Build a competing component library using pro source code</li>
            <li>Transfer your license to another person or organization</li>
          </ul>
        </div>

        <p className="font-mono text-[11px] mt-8" style={{ color: '#404050' }}>
          Each purchase grants one personal, non-transferable license tied to the email address used at checkout.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default LicensePage;

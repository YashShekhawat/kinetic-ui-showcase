import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRO_CONFIG } from '@/config/proConfig';
import AuthModal from '@/components/AuthModal';
import { usePro } from '@/hooks/usePro';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';
import { blocks, blockCategories } from '@/config/components.config';

const faqItems = [
  {
    q: 'Is this a one-time payment?',
    a: 'Yes. Pay once and get lifetime access to every current and future Pro component. No subscriptions, no renewals.',
  },
  {
    q: 'Do I get future components included?',
    a: 'Absolutely. Every new component and block we release is included in your Pro license at no extra cost.',
  },
  {
    q: 'Can I use this in client projects?',
    a: 'Yes. Your Pro license includes a commercial license. Use the components in unlimited personal and client projects.',
  },
  {
    q: 'What counts as commercial use?',
    a: 'Any project you get paid for — freelance work, agency projects, SaaS products, startup MVPs. All covered.',
  },
  {
    q: 'How do I activate my license?',
    a: 'After purchase, you\'ll receive a license key via email. Enter it on the site to unlock all Pro components instantly.',
  },
  {
    q: 'What if I need a refund?',
    a: 'We offer a 14-day money-back guarantee. If you\'re not satisfied, contact us and we\'ll process your refund promptly.',
  },
];

const freeFeatures = ['All free components', 'All free blocks', 'Copy-paste ready', 'Community support'];
const proFeatures = [
  'Everything in Free',
  'All pro components',
  'All pro blocks',
  'One-click AI prompts for Lovable, Bolt and v0',
  'Every future addition included',
  'Commercial license',
  'Priority support',
];

const PricingPage = () => {
  const navigate = useNavigate();
  const { isPro } = usePro();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ background: '#060608' }}>
      <TopBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search..."
        rightText="Pricing"
        items={blocks}
        categories={blockCategories}
      />

      <div className="pt-20 pb-24 px-4">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span
            className="font-mono text-[10px] uppercase inline-block px-3 py-1 rounded mb-5"
            style={{
              color: '#a78bfa',
              border: '1px solid rgba(124,58,237,0.3)',
              letterSpacing: '0.2em',
            }}
          >
            SIMPLE PRICING
          </span>
          <h1
            className="font-syne font-extrabold text-[2.5rem] md:text-[3.5rem] leading-[1.05] mb-4"
            style={{ color: '#f0ede8' }}
          >
            One price. Everything unlocked.
          </h1>
          <p className="font-inter font-light text-[15px]" style={{ color: '#909098' }}>
            Lifetime access. No subscription. No hidden fees.
          </p>
        </div>

        {/* Cards */}
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6 mb-24">
          {/* FREE */}
          <div
            className="rounded-lg p-6"
            style={{ background: '#1a1a28', border: '1px solid #2a2a3e' }}
          >
            <span
              className="font-mono text-[10px] uppercase"
              style={{ color: '#707080', letterSpacing: '0.15em' }}
            >
              FREE
            </span>
            <div className="mt-3 mb-6">
              <span className="font-syne font-extrabold text-[2.5rem]" style={{ color: '#f0ede8' }}>
                $0
              </span>
            </div>
            <ul className="flex flex-col gap-3 mb-8">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 font-inter text-[13px]" style={{ color: '#b0b0c0' }}>
                  <span style={{ color: '#707080' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/components')}
              className="w-full py-3 rounded-md font-inter font-medium text-[14px]"
              style={{ border: '1px solid #2a2a3e', color: '#f0ede8', background: 'transparent' }}
            >
              Browse Components
            </button>
          </div>

          {/* PRO */}
          <div
            className="rounded-lg p-6 relative"
            style={{
              background: '#1a1a28',
              border: '1px solid #7c3aed',
              boxShadow: '0 0 0 1px #7c3aed, 0 0 24px rgba(124,58,237,0.2)',
            }}
          >
            <span
              className="font-mono text-[10px] uppercase"
              style={{ color: '#a78bfa', letterSpacing: '0.15em' }}
            >
              PRO
            </span>
            <div className="mt-3 mb-1">
              <span className="font-syne font-extrabold text-[2.5rem]" style={{ color: '#f0ede8' }}>
                $49
              </span>
            </div>
            <p className="font-inter text-[12px] mb-6" style={{ color: '#707080' }}>
              one-time payment
            </p>
            <ul className="flex flex-col gap-3 mb-8">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 font-inter text-[13px]" style={{ color: '#b0b0c0' }}>
                  <span style={{ color: '#7c3aed' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            {isPro ? (
              <div className="text-center py-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span className="font-syne font-bold text-[16px]" style={{ color: '#22c55e' }}>
                    You have Pro access
                  </span>
                </div>
                <p className="font-inter text-[13px]" style={{ color: '#909098' }}>
                  You're all set. Every component and block is unlocked.
                </p>
              </div>
            ) : (
              <>
                <a
                  href={PRO_CONFIG.checkoutUrl}
                  className="lemonsqueezy-button w-full py-3 rounded-md font-inter font-medium text-[14px] text-white text-center block"
                  style={{ background: '#7c3aed' }}
                >
                  Get Lifetime Access — $49
                </a>
                 <div className="text-center mt-4">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="font-inter text-[12px]"
                    style={{ color: '#707080', background: 'none', border: 'none' }}
                  >
                    Already purchased?{' '}
                    <span style={{ color: '#a78bfa', textDecoration: 'underline' }}>Sign in with magic link</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-syne font-bold text-xl mb-8 text-center" style={{ color: '#f0ede8' }}>
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-2">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden"
                style={{ background: '#13131e', border: '1px solid #1e1e2e' }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  style={{ background: 'transparent', border: 'none' }}
                >
                  <span className="font-inter font-medium text-[14px]" style={{ color: '#f0ede8' }}>
                    {item.q}
                  </span>
                  <span
                    className="font-mono text-[16px] transition-transform duration-200"
                    style={{
                      color: '#7c3aed',
                      transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="font-inter font-light text-[13px] leading-relaxed" style={{ color: '#909098' }}>
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <Footer />
    </div>
  );
};

export default PricingPage;

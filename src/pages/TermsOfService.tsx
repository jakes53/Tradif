import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <>
      <Navbar />

      <section className="pt-32 pb-20 px-6 md:px-20 bg-crypto-dark-blue text-white min-h-screen">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-crypto-bright-teal">Terms of Service</h1>

          <p className="mb-6 text-lg">
            These Terms of Service (“Terms”) govern your access to and use of the TraDify platform and services.
            By using TraDify, you agree to these Terms. If you do not agree, you may not use our platform.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4 text-crypto-electric-blue">1. Eligibility</h2>
          <p className="mb-6">
            You must be at least 18 years old to use TraDify. By registering an account, you confirm that you meet this requirement.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4 text-crypto-electric-blue">2. Account Responsibility</h2>
          <p className="mb-6">
            You are responsible for maintaining the confidentiality of your account credentials. All activities under your account are your responsibility. Notify us immediately if you suspect unauthorized access.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4 text-crypto-electric-blue">3. Prohibited Activities</h2>
          <p className="mb-6">
            You agree not to engage in activities that are illegal, abusive, or harmful to the platform or its users.
            This includes but is not limited to money laundering, phishing, market manipulation, or exploiting software vulnerabilities.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4 text-crypto-electric-blue">4. Risk Disclaimer</h2>
          <p className="mb-6">
            Trading cryptocurrencies carries significant risk. Prices can fluctuate widely, and you may lose part or all of your investment.
            TraDify is not liable for losses incurred through your trades or investment decisions.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4 text-crypto-electric-blue">5. Modifications</h2>
          <p className="mb-6">
            We may modify these Terms at any time. Continued use of TraDify after changes means you accept the updated Terms.
            We encourage users to review this page regularly.
          </p>

          <p className="mt-10">
            For questions or concerns, contact our support team at <span className="text-crypto-bright-teal">support@tradify.com</span>.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default TermsOfService;

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LegalPrivacy = () => {
  return (
    <>
      <Navbar />

      <section className="pt-32 pb-20 px-6 md:px-20 bg-crypto-dark-blue text-white min-h-screen">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-crypto-bright-teal">Legal & Privacy</h1>

          <p className="mb-6 text-lg">
            At TraDify, we are committed to protecting your privacy and ensuring a secure and transparent trading environment. This page outlines the legal terms and privacy practices that govern your use of our platform.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4 text-crypto-electric-blue">Terms of Use</h2>
          <p className="mb-6">
            By accessing or using TraDify, you agree to comply with all applicable laws and our platform rules. Users must be at least 18 years old and are solely responsible for maintaining the confidentiality of their account credentials. Any misuse or fraudulent activity may result in account suspension or legal action.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4 text-crypto-electric-blue">Privacy Policy</h2>
          <p className="mb-6">
            We collect minimal personal information needed to provide our services, including email address, verification documents, and transaction data. This data is securely stored and never sold to third parties. We use encryption, two-factor authentication, and other security tools to protect your information.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4 text-crypto-electric-blue">Data Usage & Third Parties</h2>
          <p className="mb-6">
            We may share anonymized analytics with trusted service providers to improve platform functionality. Any data sharing is done under strict agreements that ensure confidentiality and compliance with international data protection regulations.
          </p>

          <p className="mt-10">
            For more information or to request deletion of your data, contact our support team at <span className="text-crypto-bright-teal">support@tradify.com</span>.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LegalPrivacy;

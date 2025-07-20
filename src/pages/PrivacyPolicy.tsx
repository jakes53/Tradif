import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="bg-crypto-dark-blue text-white min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-24 flex-grow">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>

        <section className="mb-12 space-y-6">
          <p>
            At TraDify, we are committed to protecting your personal data and maintaining your privacy. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our platform or use our services.
          </p>

          <h2 className="text-2xl font-semibold mt-6">1. Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email address, phone number, and government-issued ID for KYC purposes. Additionally, we collect usage data, IP addresses, browser type, and access times to improve platform functionality and security.
          </p>

          <h2 className="text-2xl font-semibold mt-6">2. How We Use Your Data</h2>
          <p>
            Your data is used to verify your identity, provide and improve services, process transactions, comply with legal obligations, and offer personalized trading experiences. We may also use anonymized data for analytics and research.
          </p>

          <h2 className="text-2xl font-semibold mt-6">3. Sharing Your Information</h2>
          <p>
            We do not sell your personal information. We may share it with trusted third parties such as payment processors, KYC providers, and regulatory authorities where required by law. All third parties are bound by confidentiality agreements and data protection standards.
          </p>

          <h2 className="text-2xl font-semibold mt-6">4. Data Security</h2>
          <p>
            We implement advanced encryption, secure servers, and strict access controls to protect your data. All sensitive information, including financial and identity data, is stored and transmitted securely in accordance with global standards.
          </p>

          <h2 className="text-2xl font-semibold mt-6">5. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal data. You may also request a copy of your stored data by contacting our support team at <a href="mailto:support@tradify.com" className="text-crypto-electric-blue underline">support@tradify.com</a>.
          </p>

          <h2 className="text-2xl font-semibold mt-6">6. Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically to reflect changes in regulations or platform features. Any updates will be posted here, and significant changes will be communicated to you directly.
          </p>

          <p className="mt-8">
            By using TraDify, you agree to the terms outlined in this Privacy Policy. For questions or concerns, please reach out to our team.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

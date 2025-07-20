import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CookiePolicy = () => {
  return (
    <>
      <Navbar />
      <section className="py-20 px-6 md:px-24 bg-crypto-dark-blue text-white min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Cookie Policy</h1>

          <p className="mb-4">
            At TraDify, we use cookies and similar tracking technologies to enhance your browsing
            experience, personalize content, and analyze our platform’s performance.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">What Are Cookies?</h2>
          <p className="mb-4">
            Cookies are small data files placed on your device when you visit a website. They help
            us remember your preferences, login sessions, and usage patterns to improve your
            overall experience on TraDify.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">Types of Cookies We Use</h2>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>
              <strong>Essential Cookies:</strong> Required for platform functionality, such as
              authentication and security.
            </li>
            <li>
              <strong>Performance Cookies:</strong> Used to collect information on how you use the
              site so we can improve performance.
            </li>
            <li>
              <strong>Functionality Cookies:</strong> Store user preferences like language and
              layout.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand usage behavior through tools
              like Google Analytics.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-3">Managing Cookies</h2>
          <p className="mb-4">
            You can manage or disable cookies through your browser settings. Note that disabling
            essential cookies may affect the functionality of TraDify.
          </p>

          <p className="mb-4">
            By continuing to use TraDify, you consent to our use of cookies as described in this
            policy.
          </p>

          <p className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CookiePolicy;

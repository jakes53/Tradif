import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AmlPolicy = () => {
  return (
    <>
      <Navbar />
      <section className="bg-crypto-dark-blue text-white py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-crypto-bright-teal mb-8">
            Anti-Money Laundering (AML) Policy
          </h1>

          <p className="mb-6 text-lg leading-relaxed">
            At TraDify, we are committed to maintaining the highest standards of Anti-Money Laundering (AML) and combating the financing of terrorism (CFT). This AML Policy outlines the procedures and controls we implement to prevent, detect, and report any suspicious activity on our platform in accordance with international regulations and industry best practices.
          </p>

          <h2 className="text-2xl font-semibold text-crypto-electric-blue mb-4">User Verification (KYC)</h2>
          <p className="mb-6 text-lg">
            All users are required to complete Know Your Customer (KYC) verification before they can access full trading functionality. This includes submission of valid government-issued identification and address verification documents. Users who deposit $15,000 or more are required to undergo full KYC and pay the applicable service fees associated with their selected investment package on our platform.

TraDify offers a Free Package that allows users to make deposits up to $5,000 and provides access to basic trading features, including limited withdrawals. Higher-tier packages unlock increased deposit and withdrawal limits, premium trading tools, and support services. We use secure third-party verification providers to handle sensitive information while ensuring full compliance with international privacy and anti-money laundering regulations.


          </p>

          <h2 className="text-2xl font-semibold text-crypto-electric-blue mb-4">Transaction Monitoring</h2>
          <p className="mb-6 text-lg">
            TraDify monitors all transactions using advanced algorithms to detect patterns associated with money laundering or other illicit activities. Unusual behaviors such as rapid large transfers, inconsistent trading patterns, or the use of multiple accounts will be flagged for manual review by our compliance team.
          </p>

          <h2 className="text-2xl font-semibold text-crypto-electric-blue mb-4">Reporting Suspicious Activity</h2>
          <p className="mb-6 text-lg">
            In cases where suspicious activity is identified, TraDify reserves the right to freeze accounts and report the activity to the appropriate financial authorities. We fully cooperate with law enforcement agencies in any investigations pertaining to money laundering or fraudulent use of our services.
          </p>

          <h2 className="text-2xl font-semibold text-crypto-electric-blue mb-4">Ongoing Training & Policy Updates</h2>
          <p className="mb-6 text-lg">
            Our team undergoes regular training to stay informed about the latest AML threats and compliance protocols. We continuously review and update our AML policy to align with evolving legal frameworks and technological developments.
          </p>

          <p className="text-lg">
            If you have questions about this policy or suspect suspicious activity, please contact our compliance team at <a href="mailto:compliance@tradify.com" className="text-crypto-bright-teal underline">compliance@tradify.com</a>.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AmlPolicy;

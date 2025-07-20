import React from "react";
import { ShieldCheck, Lock, KeyRound, ServerCrash } from "lucide-react";
import { Link } from "react-router-dom";

const BankSecurity = () => {
  return (
    <section className="min-h-screen py-20 bg-crypto-dark-blue text-white px-6 md:px-24">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
        Bank-Grade Security
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-8">
        At TraDify, we protect your crypto assets using the highest security standards in the industry.
      </p>

      <div className="grid md:grid-cols-2 gap-10 mb-12">
        <div className="bg-crypto-deep-blue p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <Lock className="text-crypto-bright-teal w-6 h-6 mr-3" />
            <h2 className="text-xl font-semibold">Military-Grade Encryption</h2>
          </div>
          <p className="text-gray-300">
            All sensitive data is encrypted using AES-256 encryption, the same standard used by national defense systems.
          </p>
        </div>

        <div className="bg-crypto-deep-blue p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <KeyRound className="text-crypto-bright-teal w-6 h-6 mr-3" />
            <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
          </div>
          <p className="text-gray-300">
            Secure your account with an additional layer of protection using 2FA via authenticator apps or SMS.
          </p>
        </div>

        <div className="bg-crypto-deep-blue p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <ServerCrash className="text-crypto-bright-teal w-6 h-6 mr-3" />
            <h2 className="text-xl font-semibold">Cold Storage</h2>
          </div>
          <p className="text-gray-300">
            95% of all digital assets are stored offline in air-gapped cold wallets—safe from cyber attacks.
          </p>
        </div>

        <div className="bg-crypto-deep-blue p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <ShieldCheck className="text-crypto-bright-teal w-6 h-6 mr-3" />
            <h2 className="text-xl font-semibold">Always Audited</h2>
          </div>
          <p className="text-gray-300">
            Regular third-party audits ensure the highest compliance and transparency in how we protect your funds.
          </p>
        </div>
      </div>

      <Link
        to="/create-account"
        className="inline-block px-6 py-3 bg-crypto-bright-teal text-white font-semibold rounded-lg hover:bg-crypto-electric-blue transition"
      >
        Secure My Account
      </Link>
    </section>
  );
};

export default BankSecurity;

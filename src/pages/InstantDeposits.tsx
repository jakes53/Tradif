import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CreditCard, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InstantDeposits = () => {
  return (
    <div className="min-h-screen bg-crypto-dark-blue">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-28 pb-20 md:pt-36 md:pb-32 bg-hero-pattern relative overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-crypto-electric-blue/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-crypto-bright-teal/10 rounded-full filter blur-3xl" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <CreditCard className="inline-block h-16 w-16 text-crypto-bright-teal mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="gradient-text">Instant</span> Fiat Deposits
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Deposit funds instantly via credit card, bank transfer, or e-wallets. Start trading within minutes of creating your account.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Multiple Deposit Options</h2>
            <p className="text-gray-300 mb-4">
              Whether you prefer using your debit/credit card, a local bank transfer(wire transfers), or an e-wallet like PayPal or Skrill, fiat currency, crypto tokens, we've got you covered.
            </p>
            <p className="text-gray-300 mb-4">
              Funds are credited to your account instantly, so you can start trading without delays.
            </p>
            <Button className="crypto-button" size="lg" onClick={() => window.location.href = '/login'}>
              Start Trading Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="crypto-card p-8">
            <ul className="space-y-4 text-gray-300">
              <li>✓ Visa, Mastercard & UnionPay supported</li>
              <li>✓ Instant settlement with major banks</li>
              <li>✓ No deposit fees for verified users</li>
              <li>✓ Secure processing via encrypted gateways</li>
              <li>✓ 24/7 support for deposit issues</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InstantDeposits;

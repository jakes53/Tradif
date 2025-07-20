import React from 'react';
import { WalletCards, DollarSign, Coins, Send } from 'lucide-react';

const paymentItems = [
  { type: 'img', src: '/applepay.svg' },
  { type: 'img', src: '/gpay.png' },
  { type: 'img', src: '/visa.png' },
  { type: 'img', src: '/revolut.svg' },
  { type: 'icon', icon: <Send className="h-10 w-10 text-crypto-bright-teal mb-2" />, label: 'Cash App' },
  { type: 'icon', icon: <Coins className="h-10 w-10 text-crypto-bright-teal mb-2" />, label: 'Crypto' },
  { type: 'icon', icon: <DollarSign className="h-10 w-10 text-crypto-bright-teal mb-2" />, label: 'Bank Transfer' },
  { type: 'icon', icon: <WalletCards className="h-10 w-10 text-crypto-bright-teal mb-2" />, label: 'E-Wallets' },
];

const PaymentPartners = () => {
  return (
    <section className="py-20 bg-crypto-darker-blue relative">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-crypto-dark-blue to-transparent"></div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Multiple <span className="bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-transparent bg-clip-text">Payment Options</span>
          </h2>
          <p className="text-white text-lg md:text-xl section-subtitle">
            We support various payment methods to make deposits and withdrawals easy and convenient.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 mb-16 place-items-center">
          {paymentItems.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-white">
              {item.type === 'img' ? (
                <img src={item.src} alt="Payment Logo" className="h-10 w-auto object-contain" />
              ) : (
                <>
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="crypto-card">
            <h3 className="text-xl font-bold text-white mb-3">Fast Deposits</h3>
            <p className="text-gray-300">
              Most deposit methods are instant or take less than 15 minutes to process. Get trading quickly with our efficient payment system.
            </p>
          </div>
          <div className="crypto-card">
            <h3 className="text-xl font-bold text-white mb-3">Global Coverage</h3>
            <p className="text-gray-300">
              Our platform supports payment methods available in over 170 countries, making crypto accessible globally.
            </p>
          </div>
          <div className="crypto-card">
            <h3 className="text-xl font-bold text-white mb-3">Secure Transactions</h3>
            <p className="text-gray-300">
              All payment methods are integrated with industry-leading security protocols to ensure your funds are always safe.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentPartners;

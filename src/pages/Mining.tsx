// src/pages/Mining.tsx

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ServerCog } from 'lucide-react';

const Mining = () => {
  return (
    <div className="min-h-screen bg-crypto-dark-blue text-white">
      <Navbar />

      <div className="pt-28 pb-20 md:pt-36 md:pb-32 bg-hero-pattern relative overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-crypto-electric-blue/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-crypto-bright-teal/10 rounded-full filter blur-3xl" />
        <div className="container mx-auto px-6 md:px-24 relative z-10 text-center">
          <ServerCog className="inline-block h-16 w-16 text-crypto-bright-teal mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Crypto Mining</span> Made Simple
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Invest in listed tokens and earn daily through our professionally managed mining infrastructure.
          </p>
        </div>
      </div>

      <div className="py-16 px-6 md:px-24 max-w-6xl mx-auto space-y-8 text-gray-300">
        <p>
          We believe that cryptocurrency mining should be accessible to everyone, not just those with technical expertise or substantial capital. That’s why TraDify has built a platform that handles the complexity of mining operations for you. Instead of worrying about power consumption, cooling, or hardware management, users can simply invest in listed mining tokens and start earning daily rewards automatically.
        </p>
        <p>
          Our state-of-the-art mining facilities are equipped with the latest ASIC and GPU miners. These machines are optimized for maximum efficiency and profitability. TraDify supports mining for a wide range of cryptocurrencies including Bitcoin, Ethereum, Litecoin, and more. By diversifying mining operations across multiple blockchains, we aim to deliver consistent and maximized returns for our investors.
        </p>
        <p>
          Security and transparency are the cornerstones of our mining solution. We utilize industry-leading protocols to protect your data and funds at every step. With real-time tracking and clear breakdowns of your daily earnings, our platform ensures complete visibility into the performance of your mining investments. With TraDify, crypto mining becomes a secure, passive, and profitable opportunity for anyone.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default Mining;

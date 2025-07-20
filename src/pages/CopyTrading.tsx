// src/pages/CopyTrading.tsx

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Users } from 'lucide-react';

const CopyTrading = () => {
  return (
    <div className="min-h-screen bg-crypto-dark-blue text-white">
      <Navbar />

      <div className="pt-28 pb-20 md:pt-36 md:pb-32 bg-hero-pattern relative overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-crypto-electric-blue/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-crypto-bright-teal/10 rounded-full filter blur-3xl" />
        <div className="container mx-auto px-6 md:px-24 relative z-10 text-center">
          <Users className="inline-block h-16 w-16 text-crypto-bright-teal mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Copy Trading</span> on TraDify
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Automatically mirror the trades of top-performing traders with just one tap.
          </p>
        </div>
      </div>

      <div className="py-16 px-6 md:px-24 max-w-6xl mx-auto space-y-8 text-gray-300">
        <p>
          TraDify's Copy Trading feature empowers new and experienced traders alike to benefit from the strategies of top-performing professionals. Whether you're unsure where to start or looking to scale your gains with minimal effort, copy trading allows you to replicate successful trades in real-time. This hands-off approach makes it ideal for users who lack time or deep technical knowledge but still want to grow their portfolios with confidence.
        </p>
        <p>
          Our platform includes a leaderboard that showcases the most consistent and profitable traders on TraDify. Each trader’s performance metrics—such as ROI, risk rating, and trade history—are transparently displayed so that you can make informed decisions before copying. Once you follow a trader, every trade they make is automatically mirrored in your account proportionally, depending on your balance and settings.
        </p>
        <p>
          Safety and flexibility are at the core of our Copy Trading model. You can pause, unfollow, or switch traders at any time without penalty. You maintain full control over your funds and strategy preferences while enjoying passive exposure to the crypto market. TraDify makes professional-grade trading accessible to everyone, regardless of experience level.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default CopyTrading;

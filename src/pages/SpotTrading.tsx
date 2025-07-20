import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TrendingUp } from 'lucide-react';

const SpotTrading = () => {
  return (
    <div className="min-h-screen bg-crypto-dark-blue text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-28 pb-20 md:pt-36 md:pb-32 bg-hero-pattern relative overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-crypto-electric-blue/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-crypto-bright-teal/10 rounded-full filter blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <TrendingUp className="inline-block h-16 w-16 text-crypto-bright-teal mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Spot Trading
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time buying and selling of crypto assets at market price—made simple and secure on TraDify.
          </p>
        </div>
      </div>

      {/* Spot Trading Content */}
      <div className="container mx-auto px-6 md:px-24 py-16 space-y-8 text-gray-300">
        <p>
          Spot trading on the TraDify app allows users to buy and sell cryptocurrencies in real time at the current market price. Unlike futures or derivatives, where contracts are traded, spot trading involves direct ownership of the digital assets. This means when you buy Bitcoin on TraDify’s spot market, the crypto is immediately credited to your wallet. The platform is designed to make this process as seamless as possible, combining intuitive UI with reliable order execution speed. This ensures you never miss a trade, whether you're capturing a dip or riding a breakout.
        </p>
        <p>
          TraDify provides access to a wide range of spot trading pairs across major and emerging cryptocurrencies. Users can analyze market trends, review live price charts, and place market or limit orders directly from the trading interface. Whether you're holding for the long term or actively trading, the spot feature offers the flexibility to enter and exit positions anytime. Built with both beginner and advanced traders in mind, the TraDify spot market also includes essential tools such as price alerts, performance tracking, and a real-time order book.
        </p>
        <p>
          Security and transparency are at the core of TraDify’s spot trading system. Every trade is processed securely, and user funds are protected using multi-layered security protocols, including cold wallet storage and encrypted transactions. Additionally, spot trades settle instantly, meaning there’s no waiting period or risk of expiration. Whether you're trading from your mobile device or desktop, TraDify delivers a fast, responsive experience that ensures your orders are executed with precision, making it the ideal platform for spot traders at any experience level.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default SpotTrading;

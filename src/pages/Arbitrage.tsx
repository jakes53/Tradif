import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from "react-router-dom";

const Arbitrage = () => {
  return (
    <div className="min-h-screen bg-crypto-dark-blue">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-28 pb-20 md:pt-36 md:pb-32 bg-hero-pattern relative overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-crypto-electric-blue/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-crypto-bright-teal/10 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <TrendingUp className="inline-block h-16 w-16 text-crypto-bright-teal mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              <span className="gradient-text">Crypto Arbitrage</span> Trading
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Maximize your profits by taking advantage of price discrepancies across multiple exchanges with our advanced arbitrage tools.
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">What is Crypto Arbitrage?</h2>
              <p className="text-gray-300 mb-6">
                Crypto arbitrage is a trading strategy that takes advantage of price differences for the same cryptocurrency across different exchanges. Because crypto markets are still developing, these price discrepancies occur frequently.
              </p>
              <p className="text-gray-300 mb-6">
                With our platform, you can automatically identify and execute arbitrage opportunities across 20+ exchanges, often resulting in risk-free profits.
              </p>
              <Link to="/login">
  <Button className="crypto-button text-lg px-8 py-6" size="lg">
    Start Arbitrage Trading
  </Button>
</Link>
            </div>
            <div className="crypto-card p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="crypto-card">
                  <h4 className="text-lg font-bold text-white mb-2">Exchange A</h4>
                  <p className="text-2xl font-bold text-crypto-bright-teal">$39,245</p>
                  <p className="text-sm text-gray-400">BTC/USD</p>
                </div>
                <div className="crypto-card">
                  <h4 className="text-lg font-bold text-white mb-2">Exchange B</h4>
                  <p className="text-2xl font-bold text-crypto-bright-teal">$39,502</p>
                  <p className="text-sm text-gray-400">BTC/USD</p>
                </div>
                <div className="col-span-2 mt-4 bg-crypto-electric-blue/10 p-4 rounded-lg">
                  <p className="text-sm text-gray-300">Potential Profit:</p>
                  <p className="text-2xl font-bold text-crypto-bright-teal">+0.65% ($257)</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-10 text-center">How Arbitrage Trading Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="crypto-card">
                <div className="mb-6 bg-crypto-electric-blue/10 text-crypto-bright-teal font-bold text-3xl w-16 h-16 rounded-full flex items-center justify-center">01</div>
                <h3 className="text-xl font-bold text-white mb-3">Identify Opportunities</h3>
                <p className="text-gray-300">
                  Our algorithm continuously scans 20+ exchanges to identify price discrepancies for the same cryptocurrency.
                </p>
              </div>
              <div className="crypto-card">
                <div className="mb-6 bg-crypto-electric-blue/10 text-crypto-bright-teal font-bold text-3xl w-16 h-16 rounded-full flex items-center justify-center">02</div>
                <h3 className="text-xl font-bold text-white mb-3">Execute Trades</h3>
                <p className="text-gray-300">
                  When an opportunity is found, our system executes trades automatically, buying at the lower price and selling at the higher price.
                </p>
              </div>
              <div className="crypto-card">
                <div className="mb-6 bg-crypto-electric-blue/10 text-crypto-bright-teal font-bold text-3xl w-16 h-16 rounded-full flex items-center justify-center">03</div>
                <h3 className="text-xl font-bold text-white mb-3">Secure Profits</h3>
                <p className="text-gray-300">
                  The difference between buy and sell prices, minus transaction fees, becomes your profit - often with minimal risk.
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden mb-20">
  {/* Background Image and Overlay */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url('./cry3.png')" }} // Replace with your actual image path
  >
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
  </div>

  {/* Content */}
  <div className="relative z-10 p-8 md:p-12">
    <h2 className="text-3xl font-bold text-white mb-6 text-center">TraDify Arbitrage Advantage</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
      {[
        {
          title: "Automated Trading Bots",
          desc: "Fully automated bots that can execute trades in milliseconds when opportunities arise.",
        },
        {
          title: "Real-time Price Monitoring",
          desc: "Continuous scanning of all major exchanges to detect price differences instantly.",
        },
        {
          title: "Fee Optimization",
          desc: "Our system calculates all associated fees to ensure each arbitrage trade is truly profitable.",
        },
        {
          title: "Custom Alert System",
          desc: "Receive notifications when profitable arbitrage opportunities match your criteria.",
        },
      ].map((item, index) => (
        <div key={index} className="flex items-start">
          <div className="mr-4 mt-1">
            <div className="w-6 h-6 rounded-full bg-crypto-bright-teal flex items-center justify-center text-crypto-dark-blue font-bold">
              ✓
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-gray-300">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Arbitrage Trading?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Create your account today and start leveraging price differences across exchanges for maximum profits.
            </p>
            <Link to="/login">
  <Button className="crypto-button text-lg px-8 py-6" size="lg">
    Get Started Now
  </Button>
</Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Arbitrage;

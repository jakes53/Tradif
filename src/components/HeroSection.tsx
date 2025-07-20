import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from "react-router-dom";
import { Bitcoin, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative pt-28 pb-20 md:pt-36 md:pb-32 bg-hero-pattern overflow-hidden">
      {/* Abstract elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-crypto-electric-blue/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-crypto-bright-teal/10 rounded-full filter blur-3xl"></div>
      
      {/* Floating elements */}
      <div className="hidden md:block absolute top-32 right-20 animate-float">
        <div className="relative w-16 h-16 bg-crypto-medium-blue rounded-xl flex items-center justify-center rotate-12 shadow-lg">
          <Bitcoin className="w-10 h-10 text-yellow-400" />
        </div>
      </div>
      
      <div className="hidden md:block absolute bottom-20 left-32 animate-float" style={{ animationDelay: '1s' }}>
        <div className="relative w-16 h-16 bg-crypto-medium-blue rounded-xl flex items-center justify-center -rotate-12 shadow-lg">
          <Bitcoin className="w-10 h-10 text-yellow-400" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            <span className="gradient-text">Join the Evolution of Digital Trading</span> With Zero Limits
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Tradify offers a secure, intuitive platform for buying, selling, and trading cryptocurrencies with advanced tools for both beginners and experts.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/login">
  <Button className="text-lg px-8 py-6 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90 transition flex items-center">
    Start Trading Now
    <ArrowRight className="ml-2 h-5 w-5" />
  </Button>
</Link>

<Link to="/news">
<Button variant="outline" className="border-crypto-electric-blue text-crypto-electric-blue hover:bg-crypto-electric-blue/10 text-lg px-8 py-6" size="lg">
              Explore Markets
            </Button>
</Link>
          </div>
          
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              24/7 Trading
            </div>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              Global Access
            </div>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              Advanced and fast liquidity
            </div>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              Low Trading Fees
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-crypto-dark-blue to-crypto-darker-blue relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-crypto-electric-blue/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-crypto-bright-teal/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Start Your Crypto Trading Journey Today
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of traders worldwide who trust TraDify for their cryptocurrency trading needs.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/create-account">
  <Button className="text-lg px-8 py-6 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90 transition">
    Create Free Account
  </Button>
</Link>
            
            
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-crypto-bright-teal mb-2">1M+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-crypto-bright-teal mb-2">100+</div>
              <div className="text-gray-300">Cryptocurrencies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-crypto-bright-teal mb-2">$50B+</div>
              <div className="text-gray-300">Monthly Volume</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-crypto-bright-teal mb-2">170+</div>
              <div className="text-gray-300">Countries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

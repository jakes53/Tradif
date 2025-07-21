import React from 'react';
const PartnershipsSection = () => {
  return (
    <section id="partnerships" className="py-20 bg-crypto-dark-blue relative">
      {/* Top gradient decoration */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-crypto-darker-blue to-transparent"></div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Our{' '}
            <span className="bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-transparent bg-clip-text">
              Trading Partners
            </span>
          </h2>
          <p className="text-white text-lg md:text-xl">
            We collaborate with industry leaders to bring you the best trading experience.
          </p>
        </div>

        {/* Partner Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {[
            { name: 'Exchange A', role: 'Global Partner' },
            { name: 'Liquidity B', role: 'Liquidity Provider' },
            { name: 'Secure Pay', role: 'Payment Processor' },
            { name: 'CryptoVault', role: 'Security Partner' },
          ].map((partner, index) => (
            <div
              key={index}
              className="crypto-card flex items-center justify-center h-32 text-center"
            >
              <div>
                <div className="font-bold text-2xl text-crypto-bright-teal mb-1">
                  {partner.name}
                </div>
                <div className="text-sm text-gray-400">{partner.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div
          className="bg-feature-gradient rounded-2xl p-8 md:p-12 bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: "url('./geminipc.png')" }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl z-0"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Become a Partner</h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Join our network of global partners and grow your business with TraDify.
              We offer competitive rates and customized solutions for exchanges, payment providers, and more.
            </p>
            <a
              href="/trading-tools"
              className="inline-flex items-center text-lg px-8 py-6 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90 transition rounded-md shadow-md"
            >
              Explore Trading Tools
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipsSection;

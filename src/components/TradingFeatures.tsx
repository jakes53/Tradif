import React from 'react';
import { TrendingUp, WalletCards, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <TrendingUp className="h-10 w-10 text-crypto-bright-teal" />,
    title: "Crypto Arbitrage",
    description: "Take advantage of price differences across multiple exchanges. Our platform identifies arbitrage opportunities in real-time for maximum profit.",
    link: "/arbitrage"
  },
  {
    icon: <WalletCards className="h-10 w-10 text-crypto-bright-teal" />,
    title: "Margin Trading",
    description: "Trade with up to 100x leverage on select crypto pairs. Advanced risk management tools help protect your positions.",
    link: "/margin"
  },
  {
    icon: <CreditCard className="h-10 w-10 text-crypto-bright-teal" />,
    title: "Instant Fiat Deposits",
    description: "Deposit funds instantly via credit card, bank transfer, or e-wallets. Start trading within minutes of creating your account.",
    link: "/deposits"
  }
];

const TradingFeatures = () => {
  return (
    <section className="py-20 bg-crypto-darker-blue relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-crypto-dark-blue to-transparent"></div>
      
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-crypto-electric-blue/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-crypto-bright-teal/5 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center">
            Advanced <span className="bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-transparent bg-clip-text">Trading Features</span>
          </h2>

          <p className="text-white text-lg md:text-xl section-subtitle">
            Our powerful trading engine gives you the edge in today's competitive crypto market.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 grid-effect">
          {features.map((feature, index) => (
            <div key={index} className="crypto-card">
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
              <Link to={feature.link} className="inline-flex items-center text-crypto-bright-teal mt-5 font-medium hover:text-crypto-electric-blue">
                Learn more <span className="ml-1">→</span>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="bg-feature-gradient rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Advanced Charting Tools</h3>
              <p className="text-gray-300 mb-6">
                Get access to professional-grade technical analysis tools with over 50 indicators and drawing tools. 
                Our real-time charts help you make data-driven trading decisions.
              </p>
              <Link
                to="/tools"
                className="inline-flex items-center text-lg px-8 py-6 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90 transition rounded-md shadow-md"
              >
                Explore Trading Tools
              </Link>
            </div>

            <div className="relative h-60 md:h-auto">
              <div className="bg-crypto-dark-blue/50 rounded-xl w-full h-full backdrop-blur-sm border border-crypto-electric-blue/20">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-white font-bold">BTC/USD</div>
                    <div className="text-green-500">+2.45%</div>
                  </div>
                  <div className="h-40 w-full bg-crypto-electric-blue/10 rounded-lg flex items-end p-2">
                    <div className="h-1/3 w-6 bg-green-500 rounded-sm mx-0.5"></div>
                    <div className="h-1/2 w-6 bg-green-500 rounded-sm mx-0.5"></div>
                    <div className="h-1/4 w-6 bg-red-500 rounded-sm mx-0.5"></div>
                    <div className="h-3/4 w-6 bg-green-500 rounded-sm mx-0.5"></div>
                    <div className="h-2/3 w-6 bg-green-500 rounded-sm mx-0.5"></div>
                    <div className="h-1/3 w-6 bg-red-500 rounded-sm mx-0.5"></div>
                    <div className="h-1/2 w-6 bg-green-500 rounded-sm mx-0.5"></div>
                    <div className="h-3/5 w-6 bg-green-500 rounded-sm mx-0.5"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default TradingFeatures;

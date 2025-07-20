import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';

const featureItems = [
  {
    icon: <Wallet className="h-12 w-12 text-crypto-bright-teal" />,
    title: "Low Transaction Fees",
    description: "Save more with our competitive transaction fees, starting as low as 0.1% per trade with additional discounts for high-volume traders.",
    link: "/fees",
  },
  {
    icon: <TrendingUp className="h-12 w-12 text-crypto-bright-teal" />,
    title: "Advanced Trading Tools",
    description: "Access powerful trading tools including real-time charts, technical indicators, and trading bots to maximize your profits.",
    link: "/tools",
  },
  {
    icon: <ShieldCheck className="h-12 w-12 text-crypto-bright-teal" />,
    title: "Bank-grade Security",
    description: "Your assets are protected with military-grade encryption, two-factor authentication, and cold storage for 95% of all assets.",
    link: "/security",
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-crypto-dark-blue relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-4">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-crypto-bright-teal via-cyan-500 to-blue-600">TraDify</span>
          </h2>
          <p className="text-white text-lg md:text-xl font-medium">
            We combine industry expertise with cutting-edge technology to deliver a superior trading experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 grid-effect">
          {featureItems.map((item, index) => (
            <div key={index} className="crypto-card group relative">
              <div className="mb-6">{item.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-crypto-electric-blue/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <Link
                to={item.link}
                className="inline-flex items-center text-crypto-bright-teal mt-5 font-medium hover:text-crypto-electric-blue"
              >
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/features" className="inline-flex items-center text-crypto-electric-blue hover:text-crypto-bright-teal transition-colors font-medium">
            View all features <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

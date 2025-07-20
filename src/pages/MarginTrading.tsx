import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LineChart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MarginTrading = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-crypto-dark-blue">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-28 pb-20 md:pt-36 md:pb-32 bg-hero-pattern relative overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-crypto-electric-blue/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-crypto-bright-teal/10 rounded-full filter blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <LineChart className="inline-block h-16 w-16 text-crypto-bright-teal mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="gradient-text">Margin Trading</span> Power
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Amplify your trades with up to 100x leverage on top crypto pairs using robust tools and risk controls.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Why Margin Trade?</h2>
              <p className="text-gray-300 mb-6">
                Margin trading allows you to borrow funds to increase your buying power. With up to 100x leverage, you can enter larger positions with smaller capital, potentially increasing returns.
              </p>
              <p className="text-gray-300 mb-6">
                Our platform integrates advanced risk management systems to protect your funds and minimize liquidation risks.
              </p>
              <Button
                className="crypto-button"
                onClick={() => navigate("/login")}
              >
                Start Margin Trading <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="crypto-card p-8">
              <h4 className="text-lg font-bold text-white mb-4">Example Trade</h4>
              <p className="text-gray-300 mb-2">Leverage: <span className="text-white font-semibold">50x</span></p>
              <p className="text-gray-300 mb-2">Initial Capital: <span className="text-white font-semibold">$500</span></p>
              <p className="text-gray-300 mb-2">Trade Size: <span className="text-white font-semibold">$25,000</span></p>
              <p className="text-gray-300 mb-2">Profit on 2% Move: <span className="text-crypto-bright-teal font-semibold">$500</span></p>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-10 text-center">How Margin Trading Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Choose Leverage",
                  desc: "Select the leverage level that suits your risk appetite—up to 100x on supported pairs.",
                },
                {
                  step: "02",
                  title: "Open a Position",
                  desc: "Enter long or short trades with borrowed funds, increasing your exposure to market moves.",
                },
                {
                  step: "03",
                  title: "Manage Risk",
                  desc: "Use stop-loss, take-profit, and margin calls to manage your trades and avoid liquidation.",
                },
              ].map((item) => (
                <div key={item.step} className="crypto-card">
                  <div className="mb-6 bg-crypto-electric-blue/10 text-crypto-bright-teal font-bold text-3xl w-16 h-16 rounded-full flex items-center justify-center">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-feature-gradient rounded-2xl p-8 md:p-12 mb-20">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Why Trade with TraDify?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              {[
                "Up to 100x leverage on BTC, ETH, and more",
                "Advanced risk management and liquidation systems",
                "Integrated portfolio monitoring tools",
                "24/7 market access with fast execution",
              ].map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-4 mt-1">
                    <div className="w-6 h-6 rounded-full bg-crypto-bright-teal flex items-center justify-center text-crypto-dark-blue font-bold">✓</div>
                  </div>
                  <p className="text-white">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Start Leveraging Your Trades Today</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Sign up and access the full power of margin trading on a secure and trusted platform.
            </p>
            <Button
              className="crypto-button text-lg px-8 py-6"
              size="lg"
              onClick={() => navigate("/login")}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MarginTrading;

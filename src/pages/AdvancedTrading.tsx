import React from "react";
import { LineChart, ShieldCheck, Bot, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const AdvancedTrading = () => {
  return (
    <section
      className="relative min-h-screen py-20 text-white px-6 md:px-24 bg-cover bg-center"
      style={{ backgroundImage: "url('./cry4.jpg')" }} // Replace with your image path
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0 rounded-none md:rounded-xl"></div>

      {/* Main content */}
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          Advanced Trading Tools
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Elevate your trading game with TraDify's intelligent and intuitive tools
          designed for professionals and aspiring traders alike.
        </p>

        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <div className="bg-crypto-deep-blue p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <LineChart className="text-crypto-bright-teal w-6 h-6 mr-3" />
              <h2 className="text-xl font-semibold">Real-Time Charts</h2>
            </div>
            <p className="text-gray-300">
              View dynamic candlestick, line, and depth charts with live price feeds
              and zoom controls. Perfect for precision entries and exits.
            </p>
          </div>

          <div className="bg-crypto-deep-blue p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <Activity className="text-crypto-bright-teal w-6 h-6 mr-3" />
              <h2 className="text-xl font-semibold">Technical Indicators</h2>
            </div>
            <p className="text-gray-300">
              Leverage built-in tools like RSI, MACD, Bollinger Bands, and more to
              analyze market trends with confidence.
            </p>
          </div>

          <div className="bg-crypto-deep-blue p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <Bot className="text-crypto-bright-teal w-6 h-6 mr-3" />
              <h2 className="text-xl font-semibold">Automated Trading Bots</h2>
            </div>
            <p className="text-gray-300">
              Use or build your own bots with our strategy editor and backtest engine.
              Automate your trades with precision and reliability.
            </p>
          </div>

          <div className="bg-crypto-deep-blue p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <ShieldCheck className="text-crypto-bright-teal w-6 h-6 mr-3" />
              <h2 className="text-xl font-semibold">Security & Performance</h2>
            </div>
            <p className="text-gray-300">
              Built on secure cloud infrastructure with low-latency execution and
              global liquidity access—so your tools are always reliable.
            </p>
          </div>
        </div>

        <Link
          to="/create-account"
          className="inline-block px-6 py-3 bg-crypto-bright-teal text-white font-semibold rounded-lg hover:bg-crypto-electric-blue transition"
        >
          Start Trading with TraDify
        </Link>
      </div>
    </section>
  );
};

export default AdvancedTrading;

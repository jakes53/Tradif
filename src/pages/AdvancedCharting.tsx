import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LineChart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from "react-router-dom";

const AdvancedCharting = () => {
  return (
    <div className="min-h-screen bg-crypto-dark-blue">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-28 pb-20 md:pt-36 md:pb-32 bg-hero-pattern relative overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-crypto-electric-blue/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-crypto-bright-teal/10 rounded-full filter blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <LineChart className="inline-block h-16 w-16 text-crypto-bright-teal mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              <span className="gradient-text">Advanced Charting Tools</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Get access to professional-grade technical analysis tools with over 50 indicators and drawing tools. Our real-time charts help you make data-driven trading decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Why Use Advanced Charting?</h2>
              <p className="text-gray-300 mb-6">
                Whether you're a day trader or a long-term investor, our real-time charting suite provides the edge you need to analyze markets with precision.
              </p>
              <p className="text-gray-300 mb-6">
                Customize your views, apply dozens of technical indicators, and make informed trading decisions with our dynamic charting toolkit.
              </p>
              <Link to="/login">
                <Button className="crypto-button text-lg px-8 py-6" size="lg">
                  Explore Trading Tools
                </Button>
              </Link>
            </div>

            <div className="crypto-card p-8">
              <img src="./officejpg.png" alt="Advanced Chart Tools" className="rounded-xl w-full object-cover shadow-lg" />
            </div>
          </div>

          {/* Background Visual Feature Block */}
          <div className="relative rounded-2xl overflow-hidden mb-20">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('./tools-bg.png')" }}
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            </div>

            <div className="relative z-10 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Key Features You’ll Love</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                {[
                  {
                    title: "50+ Indicators",
                    desc: "From RSI to Fibonacci Retracements, access all the tools serious traders rely on.",
                  },
                  {
                    title: "Drawing & Annotation Tools",
                    desc: "Mark trends, support/resistance levels, and patterns with ease.",
                  },
                  {
                    title: "Real-Time Data",
                    desc: "Stay updated with streaming chart data for accurate, timely analysis.",
                  },
                  {
                    title: "Custom Layouts",
                    desc: "Save your favorite chart setups and access them anytime on any device.",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="w-6 h-6 rounded-full bg-crypto-bright-teal flex items-center justify-center text-crypto-dark-blue font-bold">✓</div>
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

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Unlock Powerful Charting Now</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join TraDify today to access the most advanced charting suite for crypto traders.
            </p>
            <Link to="/create-account">
              <Button className="crypto-button text-lg px-8 py-6" size="lg">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdvancedCharting;

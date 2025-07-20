import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRightCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-crypto-dark-blue text-gray-300">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-28 pb-16 md:pt-36 md:pb-24 text-center relative bg-hero-pattern">
        <div className="absolute top-24 left-10 w-64 h-64 bg-crypto-electric-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-crypto-bright-teal/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">All Features</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Explore the full suite of tools and features available to traders on TraDify.
          </p>
        </div>
      </div>

      {/* Copy Trading Feature Highlight */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Copy Trading from Our Experts</h2>
          <p className="mb-4">
            Don’t trade alone. Our Copy Trading feature lets you mirror trades from top-performing crypto traders on the platform. Whether you're a beginner or just want passive income, this tool can help you grow your portfolio effortlessly.
          </p>
          <p className="mb-4">
            Simply choose an expert based on their track record, and your account will automatically execute trades as they do — all in real-time and with full transparency.
          </p>
          <p>
            Gain confidence as you watch your portfolio grow by following the strategies of the best in the business.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <div className="text-center mb-20">
        <Link to="/create">
          <Button className="crypto-button text-lg px-8 py-6" size="lg">
            Get Started Now <ArrowRightCircle className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default FeaturesPage;

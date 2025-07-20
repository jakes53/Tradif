import React from 'react';
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button';

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description: "Sign up with your email address and secure your account with a strong password and 2FA authentication."
  },
  {
    number: "02",
    title: "Verify Your Identity",
    description: "Complete our streamlined KYC process by providing the required identification documents."
  },
  {
    number: "03",
    title: "Deposit Funds",
    description: "Add funds to your account using bank transfer, credit card, or one of our many supported payment methods."
  },
  {
    number: "04",
    title: "Start Trading",
    description: "Begin trading immediately with our intuitive platform, or practice with our demo account first."
  }
];

const GetStartedSteps = () => {
  return (
    <section className="py-20 bg-crypto-dark-blue relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center">
        How to Join <span className="bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-transparent bg-clip-text">TraDify</span>
</h2>
          
          <p className="text-white text-lg md:text-xl section-subtitle">
            Getting started with TraDify is easy. Follow these simple steps to begin your trading journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 grid-effect">
          {steps.map((step, index) => (
            <div key={index} className="crypto-card flex flex-col h-full">
              <div className="mb-6 bg-crypto-electric-blue/10 text-crypto-bright-teal font-bold text-3xl w-16 h-16 rounded-full flex items-center justify-center">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-300 flex-grow">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/create-account">
  <Button className="text-lg px-8 py-6 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90 transition">
    Create Your Account
  </Button>
</Link>
        </div>
      </div>
    </section>
  );
};

export default GetStartedSteps;

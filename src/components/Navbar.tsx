import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav className="fixed w-full top-0 z-50 bg-crypto-dark-blue/80 backdrop-blur-md border-b border-crypto-electric-blue/20 py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
  <Link to="/" className="flex items-center">
    <span className="text-crypto-bright-teal font-bold text-2xl">Tra</span>
    <span className="text-crypto-electric-blue font-bold text-2xl">Dify</span>
  </Link>

  {/* Mobile-only Home button */}
  <Link
    to="/"
    className="md:hidden flex items-center text-white text-sm font-semibold border border-white px-3 py-1 rounded"
  >
    Portal
  </Link>
</div>

        
        <div className="hidden md:flex space-x-8 text-sm font-medium">
          <Link to="/" className="text-white hover:text-crypto-bright-teal transition-colors">Home</Link>
          <Link to="/about" className="text-white hover:text-crypto-bright-teal transition-colors">About</Link>
          <Link to="/arbitrage" className="text-white hover:text-crypto-bright-teal transition-colors">Arbitrage</Link>
          <Link to="/news" className="text-white hover:text-crypto-bright-teal transition-colors">Markets</Link>

          {/* Smooth scroll to the partnerships section */}
          <a
            href="#partnerships"
            onClick={(e) => {
              e.preventDefault();
              const section = document.getElementById('partnerships');
              section?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-white hover:text-crypto-bright-teal transition-colors"
          >
            Partnerships
          </a>

          <Link to="/contact" className="text-white hover:text-crypto-bright-teal transition-colors">Contact</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="outline" className="hidden md:flex border-crypto-electric-blue text-crypto-electric-blue hover:bg-crypto-electric-blue/10">
              Sign In
            </Button>
          </Link>
          
          <Link to="/create-account">
            <Button className="bg-gradient-to-r from-crypto-bright-teal to-crypto-electric-blue hover:opacity-90 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

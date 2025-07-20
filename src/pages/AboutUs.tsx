// src/pages/AboutUs.tsx

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Users2 } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-crypto-dark-blue text-white">
      <Navbar />

      <div className="pt-28 pb-20 md:pt-36 md:pb-32 bg-hero-pattern relative overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-crypto-electric-blue/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-crypto-bright-teal/10 rounded-full filter blur-3xl" />
        <div className="container mx-auto px-6 md:px-24 relative z-10 text-center">
          <Users2 className="inline-block h-16 w-16 text-crypto-bright-teal mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">About</span> TraDify
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover what makes TraDify your trusted partner in the dynamic world of cryptocurrency.
          </p>
        </div>
      </div>

      <div className="py-16 px-6 md:px-24 max-w-6xl mx-auto space-y-8 text-gray-300">
        <p>
          Welcome to TraDify, your premier destination for a more accessible, secure, and comprehensive cryptocurrency trading experience. Founded by a dedicated team of industry experts, our mission is to empower users of all backgrounds—whether novice or professional—to explore the exciting opportunities within the digital asset landscape. We recognize the complexities and rapid evolution of crypto markets, and we’ve designed TraDify to break down these barriers with a user-centric approach.
        </p>

        <p>
          We are proud to offer an intuitive and information-rich platform that caters to the diverse needs of our growing community. At the core of our services is a real-time Dashboard, showcasing live account balances, profit/loss summaries, and a clear view of your portfolio’s performance. Underpinning these insights is our Real-Time Data & Charts feature, which provides low-latency market data, detailed candlestick charts, and key volume indicators—giving you the analytical edge to make smart decisions. Whether you're executing spot trades, exploring copy trading, investing in mining, or utilizing margin positions, our streamlined Order Placement interface makes it easy to act with confidence.
        </p>

        <p>
          To enhance your trading experience further, TraDify includes a fully customizable Watchlist, allowing you to track your favorite assets all in one place. You’ll also find a robust News and Insights section that collates the latest headlines and expert analyses, so you’re always informed about market-shaping events. Our integrated Alerts and Notifications help you stay on top of key price and volume changes. And thanks to our Responsive Design, TraDify works seamlessly across desktops, tablets, and mobile devices—so you can trade from anywhere, at any time.
        </p>

        <p>
          At TraDify, security stands at the forefront of everything we do. We offer strong Security Features such as two-factor authentication (2FA) and biometric login support to protect your data and digital assets. You can easily monitor your Trading History and Analytics through clean, user-friendly interfaces that help you evaluate past decisions and improve future strategies. Our Customizable UI options allow you to tailor your workspace to your preferences, including light/dark modes, resizable fonts, and drag-and-drop layout arrangements.
        </p>

        <p>
          We also equip traders with essential Integrated Tools like margin calculators, P/L estimators, and risk management modules to support informed decision-making. While our Customer Support Access is currently developing, we do offer live chat and ticketing systems directly within the platform—and we’re actively working to expand these offerings. Ultimately, our mission is to foster a secure and supportive environment where every trader—regardless of skill level—can thrive in the ever-evolving digital economy.
        </p>

        <p>
          Thank you for choosing TraDify. We are committed to guiding you through every step of your crypto journey and helping you unlock the full potential of copy trading, mining, spot markets, and margin trading.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;

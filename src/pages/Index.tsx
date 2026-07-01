import React, { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CryptoCard from "@/components/CryptoCard";
import WhyChooseUs from "@/components/WhyChooseUs";
import TradingFeatures from "@/components/TradingFeatures";
import GetStartedSteps from "@/components/GetStartedSteps";
import PaymentPartners from "@/components/PaymentPartners";
import PartnershipsSection from "@/components/PartnershipsSection";
import FaqSection from "@/components/FaqSection";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import { Cryptocurrency } from "@/types/crypto";
import { fetchCryptocurrencies } from "@/services/cryptoApi";

const Index = () => {
  const { data: cryptoData } = useQuery({
    queryKey: ["cryptocurrencies"],
    queryFn: fetchCryptocurrencies,
    refetchInterval: 60000,
  });

  const [updatedCryptos, setUpdatedCryptos] = useState<Cryptocurrency[]>([]);

  useEffect(() => {
    if (cryptoData?.length) {
      setUpdatedCryptos(cryptoData.slice(0, 4));
    }
  }, [cryptoData]);

  const updatePrices = useCallback(() => {
    setUpdatedCryptos((prev) =>
      prev.map((crypto) => {
        const changePercent = (Math.random() - 0.5) * 0.001;
        const newPrice = crypto.currentPrice * (1 + changePercent);
        return {
          ...crypto,
          currentPrice: newPrice,
          priceChangePercentage24h:
            crypto.priceChangePercentage24h + changePercent * 100,
          priceChange24h: newPrice - crypto.currentPrice,
        };
      })
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(updatePrices, 3000);
    return () => clearInterval(interval);
  }, [updatePrices]);

  return (
    <div className="min-h-screen bg-crypto-dark-blue">
      <Navbar />
      <HeroSection />

      <section className="my-8 px-4 md:px-16">
        <h2 className="text-white text-2xl font-semibold mb-4">
          Top Cryptocurrencies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {updatedCryptos.map((crypto) => (
            <CryptoCard key={crypto.id} crypto={crypto} />
          ))}
        </div>
      </section>

      <WhyChooseUs />
      <TradingFeatures />
      <GetStartedSteps />
      <PaymentPartners />
      <PartnershipsSection />
      <FaqSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
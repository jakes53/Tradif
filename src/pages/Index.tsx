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

// Extend window type safely
declare global {
  interface Window {
    Tawk_API?: {
      onLoad?: () => void;
      setAttributes?: (data: Record<string, string>, callback?: (error?: unknown) => void) => void;
      addEvent?: (name: string) => void;
    };
  }
}

const Index = () => {
  const { data: cryptoData, isLoading } = useQuery({
    queryKey: ["cryptocurrencies"],
    queryFn: fetchCryptocurrencies,
    refetchInterval: 60000,
  });

  const [updatedCryptos, setUpdatedCryptos] = useState<Cryptocurrency[]>([]);
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    if (cryptoData && cryptoData.length > 0) {
      setUpdatedCryptos([...cryptoData].slice(0, 4));
    }
  }, [cryptoData]);

  const updatePrices = useCallback(() => {
    if (updatedCryptos.length > 0) {
      const newCryptos = updatedCryptos.map((crypto) => {
        const changePercent = (Math.random() - 0.5) * 0.001;
        const newPrice = crypto.currentPrice * (1 + changePercent);
        return {
          ...crypto,
          currentPrice: newPrice,
          priceChangePercentage24h:
            crypto.priceChangePercentage24h + changePercent * 100,
          priceChange24h: newPrice - crypto.currentPrice,
        };
      });
      setUpdatedCryptos(newCryptos);
    }
  }, [updatedCryptos]);

  useEffect(() => {
    const interval = setInterval(updatePrices, 3000);
    return () => clearInterval(interval);
  }, [updatePrices]);

  // 🟢 Tawk.to Integration (Controlled by showChat)
  useEffect(() => {
    if (!showChat) return;

    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/683ea603ae5cb41912312011/1isqbgvfo";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.onLoad = function () {
      

      window.Tawk_API?.addEvent?.("trigger-message");

      setTimeout(() => {
        const iframe = document.querySelector<HTMLIFrameElement>('iframe[title="chat widget"]');
        const bubble = document.querySelector<HTMLDivElement>('[class*="tawk-custom-color"]');

        if (iframe?.style) {
          iframe.style.bottom = "auto";
          iframe.style.top = "calc(50% + 100px)";
          iframe.style.left = "24px";
          iframe.style.right = "auto";
        }

        if (bubble?.style) {
          bubble.style.bottom = "auto";
          bubble.style.top = "calc(50% + 140px)";
          bubble.style.left = "80px";
          bubble.style.right = "auto";
        }
      }, 3000);
    };
  }, [showChat]);

  if (isLoading) {
    return <div className="container mx-auto p-4">...</div>;
  }

  return (
    <div className="min-h-screen bg-crypto-dark-blue">
      <Navbar />
      <HeroSection />

      {/* Top Cryptocurrencies Section */}
      <section className="my-8 px-4 md:px-16">
        <h2 className="text-white text-2xl font-semibold mb-4">Top Cryptocurrencies</h2>
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

      

      {/* Floating Telegram Icon */}
      
    </div>
  );
};

export default Index;

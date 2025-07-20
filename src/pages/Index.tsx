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
      window.Tawk_API?.setAttributes?.(
        {
          welcomeMessage:
            "👋 Hi! Welcome to TraDify Support.",
        },
        function (error?: unknown) {
          if (error instanceof Error) {
            console.error("Tawk.to message error:", error.message);
          } else if (error) {
            console.error("Tawk.to message error:", error);
          }
        }
      );

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

      {/* Hide Chat Button */}
      {showChat && (
        <button
          onClick={() => {
            setShowChat(false);

            const tawkFrame = document.querySelector('iframe[title="chat widget"]');
            if (tawkFrame?.parentElement) tawkFrame.parentElement.remove();

            const tawkScript = document.querySelector('script[src*="tawk.to"]');
            if (tawkScript) tawkScript.remove();

            delete window.Tawk_API;
          }}
          className="fixed z-50 left-6 top-[calc(50%+200px)] bg-grey-600 hover:bg-grey-700 text-white px-2 py-1 rounded text-sm font-semibold shadow-md transition"
        >
          ✖ Hide Chat
        </button>
      )}

      {/* Floating Telegram Icon */}
      <a
        href="https://t.me/TraDifySupport"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed z-50 left-6 top-1/2 -translate-y-1/2 flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-2xl hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 ease-in-out animate-float-slow"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5 mr-2"
        >
          <path d="M9.036 15.52l-.369 5.207c.528 0 .757-.229 1.037-.504l2.484-2.387 5.15 3.766c.944.521 1.615.25 1.851-.872l3.358-15.812c.306-1.42-.526-1.976-1.444-1.628l-20.096 7.72c-1.37.521-1.357 1.267-.234 1.604l5.138 1.607 11.88-7.482c.561-.379 1.073-.169.652.209L9.036 15.52z" />
        </svg>
        <span className="font-medium text-sm">Join Telegram</span>
      </a>
    </div>
  );
};

export default Index;

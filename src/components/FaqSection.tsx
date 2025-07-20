import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "How do I create an account on TraDify?",
    answer: "Creating an account is simple. Click on the 'Get Started' button, fill out your email and password, verify your email address, and complete the KYC process to start trading immediately."
  },
  {
    question: "What cryptocurrencies can I trade on TraDify?",
    answer: "TraDify supports over 100 cryptocurrencies including Bitcoin, Ethereum, Solana, Cardano, XRP, and many more. We regularly add new coins based on market demand and thorough security audits."
  },
  {
    question: "How secure is TraDify?",
    answer: "Security is our top priority. We implement bank-level encryption, two-factor authentication, cold storage for 95% of assets, regular security audits, and insurance coverage for digital assets held in our custody."
  },
  {
    question: "What are the trading fees on TraDify?",
    answer: "Our trading fees start from 0.1% and decrease with higher trading volume. We offer additional discounts for users holding our platform token. There are no hidden fees, and all costs are transparently displayed before executing trades."
  },
  {
    question: "How does crypto arbitrage work?",
    answer: "Crypto arbitrage involves buying a cryptocurrency on one exchange where the price is lower and simultaneously selling it on another exchange where the price is higher. Our platform automates this process by identifying price discrepancies across multiple exchanges in real-time."
  },
  {
    question: "What deposit methods are available?",
    answer: "We support multiple deposit methods including bank transfers, credit/debit cards, Crypto, PayPal, and various local payment options. Most deposits are credited instantly or within 15 minutes, allowing you to start trading quickly."
  }
];

const FaqSection = () => {
  return (
    <section className="py-20 bg-crypto-darker-blue relative">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-crypto-dark-blue to-transparent"></div>
      
      {/* Background elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-crypto-electric-blue/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-crypto-bright-teal/5 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center">
        Frequently Asked <span className="bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-transparent bg-clip-text">Questions</span>
</h2>

<p className="text-white text-lg md:text-xl section-subtitle">
Find answers to common questions about TraDify and cryptocurrency trading.
</p>

        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-crypto-electric-blue/20">
                <AccordionTrigger className="text-white font-medium text-lg py-6 hover:text-crypto-bright-teal">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-300 mb-6">
            Still have questions? Our support team is available 24/7.
          </p>
          <a
  href="/contact"
  className="inline-flex items-center text-lg px-8 py-6 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90 transition rounded-md shadow-md"
>
Contact Support
</a>

        </div>
      </div>
    </section>
  );
};

export default FaqSection;

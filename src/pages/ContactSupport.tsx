import React from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';

const ContactSupport = () => {
  return (
    <section className="relative min-h-screen py-20 text-white px-6 md:px-24 bg-gray-900">
      <div className="absolute inset-0">
        
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Contact <span className="bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-transparent bg-clip-text">Support</span>
          </h2>
          <p className="text-gray-300 text-lg mt-4">
            Need help? Reach out to our support team through any of the options below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          <div className="crypto-card p-6">
            <Mail className="h-8 w-8 text-crypto-bright-teal mb-4" />
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <p>support@TraDify.com</p>
            <p>supportcenter@tradify.com</p>
            <p className="mt-2">Support Representative: jeffreycouture43@gmail.com</p>
          </div>

          <div className="crypto-card p-6">
            <Phone className="h-8 w-8 text-crypto-bright-teal mb-4" />
            <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
            <p>+1 (864) 501-7235</p>
            <p className="text-gray-400 text-sm mt-1">Support Admin</p>
          </div>

          <div className="crypto-card p-6">
            <MessageCircle className="h-8 w-8 text-crypto-bright-teal mb-4" />
            <h3 className="text-xl font-bold mb-2">Telegram</h3>
            <p>@TraDifysupport</p>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="login"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-white font-semibold rounded-md shadow-md hover:opacity-90 transition"
          >
            login
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSupport;

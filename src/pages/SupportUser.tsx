import React, { useEffect, useState } from 'react';
import { MessageCircle, PhoneCall, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const SupportUser = () => {
  const [whatsAppNumber, setWhatsAppNumber] = useState('');

  useEffect(() => {
    const fetchWhatsNumber = async () => {
      const { data, error } = await supabase
        .from('strategy_stats')
        .select('whats_no')
        .limit(1)
        .single();

      if (error) {
        console.error('Failed to fetch WhatsApp number:', error);
      } else {
        setWhatsAppNumber(data?.whats_no || '');
      }
    };

    fetchWhatsNumber();
  }, []);

  const whatsappLink = whatsAppNumber ? `https://wa.me/${whatsAppNumber.replace(/\D/g, '')}` : '#';

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Need Help?</h2>
      <p className="text-gray-600 mb-4">
        Our support team is available <span className="font-semibold text-green-600">24/7</span> to assist you with any issues.
      </p>

      <div className="mb-4 flex justify-center">
        <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
          <ShieldCheck size={14} /> 24/7 Secure Support
        </span>
      </div>

      <div className="text-sm text-gray-700 mb-6">
        <p>
          <strong>Support Representative:</strong>{' '}
          <span className="text-blue-600">jeffreycouture43@gmail.com</span>
        </p>
        {whatsAppNumber && (
          <p>
            <strong>WhatsApp Contact:</strong>{' '}
            <span className="text-green-600">{whatsAppNumber}</span>
          </p>
        )}
      </div>

      <div className="grid gap-4 mt-4">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-xl flex justify-center items-center gap-2 transition"
        >
          <PhoneCall size={18} />
          Chat on WhatsApp
        </a>

        <a
          href="https://t.me/TraDifySupport"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl flex justify-center items-center gap-2 transition"
        >
          <MessageCircle size={18} />
          Join on Telegram
        </a>
      </div>

      <p className="text-xs text-gray-500 mt-6">We’re here to help you trade with confidence.</p>
    </div>
  );
};

export default SupportUser;

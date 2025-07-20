import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import Tier2PurchaseDetails from "@/components/Tier2PurchaseDetails";
import Tier3PurchaseDetails from "@/components/Tier3PurchaseDetails";

const tiers = [
  {
    title: 'Free - Tier 1 (Default)',
    price: 'Free',
    dailyLimit: 'USD 76,000',
    monthlyLimit: 'USD 500,000',
    lifetimeLimit: 'USD 1,000,000',
    coinBuy: 'USD 76,000',
    payReceive: 'Unlimited',
    tierLevel: 1,
    default: true,
  },
  {
    title: 'Tier 2 - Pro',
    price: '$49 (one-time)',
    dailyLimit: 'USD 150,000',
    monthlyLimit: 'USD 1,000,000',
    lifetimeLimit: 'Unlimited',
    coinBuy: 'USD 150,000',
    payReceive: 'Unlimited',
    tierLevel: 2,
  },
  {
    title: 'Tier 3 - Elite',
    price: '$129 (one-time)',
    dailyLimit: 'USD 1,000,000',
    monthlyLimit: 'USD 10,000,000',
    lifetimeLimit: 'Unlimited',
    coinBuy: 'USD 1,000,000',
    payReceive: 'Unlimited',
    tierLevel: 3,
  },
  {
    title: 'Tier 4 - Institutional',
    price: '$299 (one-time)',
    dailyLimit: 'Unlimited',
    monthlyLimit: 'Unlimited',
    lifetimeLimit: 'Unlimited',
    coinBuy: 'Unlimited',
    payReceive: 'Unlimited',
    tierLevel: 4,
  },
];

const AccountLevelPackages = () => {
  const [showTier2, setShowTier2] = useState(false);
  const [showTier3, setShowTier3] = useState(false);

  if (showTier2) return <Tier2PurchaseDetails onBack={() => setShowTier2(false)} />;
  if (showTier3) return <Tier3PurchaseDetails onBack={() => setShowTier3(false)} />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Account Level Packages</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {tiers.map((tier) => (
          <div
            key={tier.tierLevel}
            className={`relative rounded-2xl border border-gray-200 shadow-xl p-6 bg-gradient-to-br ${
              tier.default
                ? 'from-white to-blue-50 ring-2 ring-blue-500'
                : 'from-white to-gray-50 hover:shadow-2xl'
            } transition`}
          >
            {tier.default && (
              <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                Default
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-800 mb-1">{tier.title}</h3>
            <p className="text-lg font-semibold text-green-600 mb-4">{tier.price}</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-blue-600" />
                <strong>Daily Limit:</strong> {tier.dailyLimit}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-blue-600" />
                <strong>Monthly Limit:</strong> {tier.monthlyLimit}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-blue-600" />
                <strong>Lifetime Limit:</strong> {tier.lifetimeLimit}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-blue-600" />
                <strong>Coin Buy Limit:</strong> {tier.coinBuy}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-blue-600" />
                <strong>Pay & Receive:</strong> {tier.payReceive}
              </li>
            </ul>

            {/* Action Buttons */}
            {!tier.default && tier.tierLevel === 2 && (
              <button
                onClick={() => setShowTier2(true)}
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition font-medium"
              >
                Upgrade to {tier.title}
              </button>
            )}

            {!tier.default && tier.tierLevel === 3 && (
              <button
                onClick={() => setShowTier3(true)}
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition font-medium"
              >
                Upgrade to {tier.title}
              </button>
            )}

            {!tier.default && tier.tierLevel === 4 && (
              <button
                className="mt-6 w-full bg-gray-500 text-white py-2 rounded-xl opacity-50 cursor-not-allowed"
                disabled
              >
                Upgrade Coming Soon
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountLevelPackages;

import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const TIER_COST = 99;
const REQUIRED_TIER_LEVEL = 3;

const Tier3PurchaseDetails = ({ onBack }) => {
  const [dashBalance, setDashBalance] = useState(0);
  const [currentTier, setCurrentTier] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('fiat_balance, account_tier')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Fetch error:', error.message);
      } else {
        setDashBalance(data.fiat_balance || 0);
        setCurrentTier(data.account_tier || 1);
      }
    };

    fetchUserData();
  }, []);

  const handlePurchase = async () => {
    if (!userId || dashBalance < TIER_COST || currentTier >= REQUIRED_TIER_LEVEL) return;

    setLoading(true);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        fiat_balance: dashBalance - TIER_COST,
        account_tier: REQUIRED_TIER_LEVEL,
      })
      .eq('id', userId);

    setLoading(false);

    if (updateError) {
      alert('Purchase failed: ' + updateError.message);
    } else {
      alert('Tier 3 purchase successful!');
      setCurrentTier(REQUIRED_TIER_LEVEL);
      setDashBalance((prev) => prev - TIER_COST);
    }
  };

  const alreadyUpgraded = currentTier >= REQUIRED_TIER_LEVEL;
  const insufficientFunds = dashBalance < TIER_COST;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10 border">
      <div className="flex items-center mb-4 text-blue-600 cursor-pointer" onClick={onBack}>
        <ArrowLeft size={18} />
        <span className="ml-2 text-sm font-medium">Back to Packages</span>
      </div>

      <h2 className="text-2xl font-bold mb-1 text-gray-800">Upgrade to Tier 3 – Expert</h2>
      <p className="text-gray-600 mb-4">One-time payment of <strong>${TIER_COST}</strong> unlocks advanced trading privileges.</p>

      <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md mb-4">
        <strong>Dash Balance:</strong> ${dashBalance.toFixed(2)}
      </div>

      {insufficientFunds && !alreadyUpgraded && (
        <div className="text-sm text-red-600 mb-4">
          You need to top up at least ${TIER_COST - dashBalance} to upgrade to Tier 3.
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 text-sm text-gray-700 mb-6">
        <div className="flex items-center gap-2">
          <CheckCircle size={18} className="text-green-600" />
          Daily Limit: <span className="font-medium">USD 500,000</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle size={18} className="text-green-600" />
          Monthly Limit: <span className="font-medium">USD 1,000,000</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle size={18} className="text-green-600" />
          Lifetime Limit: <span className="font-medium">Unlimited</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle size={18} className="text-green-600" />
          Coin Buy Limit: <span className="font-medium">USD 500,000</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle size={18} className="text-green-600" />
          Pay & Receive: <span className="font-medium">Unlimited</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-blue-500" />
          One-time payment — no recurring fees.
        </div>
      </div>

      <button
        onClick={handlePurchase}
        disabled={alreadyUpgraded || insufficientFunds || loading}
        className={`w-full py-3 rounded-xl text-lg font-semibold transition ${
          alreadyUpgraded
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : insufficientFunds
            ? 'bg-gray-300 text-white cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {alreadyUpgraded ? 'Already Upgraded' : `Purchase Tier 3 – $${TIER_COST}`}
      </button>
    </div>
  );
};

export default Tier3PurchaseDetails;

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Strategy = {
  id: number;
  name: string;
  capital: number;
  profitRange: [number, number];
  profitShare: number;
  maxTraders: number;
  durationHours: number;
  key: string;
  column: string;
};

const strategies: Strategy[] = [
  {
    id: 1,
    name: "Scalp Master",
    capital: 30,
    profitRange: [70, 150],
    profitShare: 10,
    maxTraders: 10000,
    durationHours: 24,
    key: "Scalp Master",
    column: "scalp_master",
  },
  {
    id: 2,
    name: "Swing Alpha",
    capital: 100,
    profitRange: [250, 400],
    profitShare: 10,
    maxTraders: 5000,
    durationHours: 18,
    key: "Swing Alpha",
    column: "swing_alpha",
  },
  {
    id: 3,
    name: "Trend Titan",
    capital: 250,
    profitRange: [600, 1200],
    profitShare: 10,
    maxTraders: 2000,
    durationHours: 12,
    key: "Trend Titan",
    column: "trend_titan",
  },
  {
    id: 4,
    name: "Momentum Vault",
    capital: 500,
    profitRange: [1500, 2500],
    profitShare: 10,
    maxTraders: 1000,
    durationHours: 24,
    key: "Momentum Vault",
    column: "momentum_vault",
  },
];

const CopyStrategySimulated: React.FC = () => {
  const [dashBalance, setDashBalance] = useState(0);
  const [strategyBalance, setStrategyBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [amounts, setAmounts] = useState<Record<number, string>>({});
  const [investedStrategies, setInvestedStrategies] = useState<Record<number, Date>>({});
  const [countdown, setCountdown] = useState<Record<number, string>>({});
  const [strategyStats, setStrategyStats] = useState<Record<string, number>>({
    scalp_master: 0,
    swing_alpha: 0,
    trend_titan: 0,
    momentum_vault: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      if (!userId) return;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("fiat_balance, strategy_balance, strategy_investment")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error loading profile:", profileError);
        return;
      }

      const { data: stats, error: statsError } = await supabase
        .from("strategy_stats")
        .select("scalp_master_users, swing_alpha_users, trend_titan_users, momentum_vault_users")
        .single();

      if (statsError) {
        console.error("Error loading strategy stats:", statsError);
        return;
      }

      setDashBalance(profile.fiat_balance || 0);
      setStrategyBalance(profile.strategy_balance || 0);
      setStrategyStats({
        scalp_master: stats.scalp_master_users || 0,
        swing_alpha: stats.swing_alpha_users || 0,
        trend_titan: stats.trend_titan_users || 0,
        momentum_vault: stats.momentum_vault_users || 0,
      });
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const updatedCountdown: Record<number, string> = {};

      for (const id in investedStrategies) {
        const endTime = investedStrategies[parseInt(id)];
        const diff = endTime.getTime() - now;

        if (diff <= 0) {
          updatedCountdown[parseInt(id)] = "Completed";
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          updatedCountdown[parseInt(id)] = `${hours}h ${minutes}m`;
        }
      }

      setCountdown(updatedCountdown);
    }, 60000);

    return () => clearInterval(interval);
  }, [investedStrategies]);

  const handleCopyTrade = async (strategy: Strategy) => {
    const amount = parseFloat(amounts[strategy.id]);
    if (isNaN(amount) || amount < strategy.capital)
      return alert(`Minimum investment is $${strategy.capital}`);
    if (investedStrategies[strategy.id])
      return alert("Already trading this strategy. Wait for it to complete.");
    if (amount > dashBalance) return alert("Insufficient dash balance.");
    if ((strategyStats[strategy.column] || 0) >= strategy.maxTraders)
      return alert("This strategy is currently full.");

    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    if (!userId) return alert("Not authenticated.");
    const { data: profileBefore } = await supabase
  .from("profiles")
  .select("user_invests")
  .eq("id", userId)
  .single();

const existingInvests = profileBefore?.user_invests || [];

const updatedInvests = Array.isArray(existingInvests)
  ? [...new Set([...existingInvests, strategy.key])]
  : [strategy.key]; // fallback if it's null or not an array

    // Fetch current strategy_investment
const { data: userProfile } = await supabase
  .from("profiles")
  .select("strategy_investment")
  .eq("id", userId)
  .single();

const prevInvestment = userProfile?.strategy_investment || 0;
const newInvestment = prevInvestment + amount;

const { error: updateError } = await supabase
  .from("profiles")
  .update({
    fiat_balance: dashBalance - amount,
    strategy_balance: strategyBalance + amount,
    strategy_investment: newInvestment,
    invest_strategy: strategy.key,
  })
  .eq("id", userId);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return alert("Failed to process investment.");
    }

    const updatedCount = (strategyStats[strategy.column] || 0) + 1;
    const { error: statError } = await supabase
      .from("strategy_stats")
      .update({ [`${strategy.column}_users`]: updatedCount })
      .eq("id", 1);

    if (statError) {
      console.error("Error updating stats:", statError);
      return alert("Failed to update strategy stats.");
    }

    setDashBalance((prev) => prev - amount);
    setStrategyBalance((prev) => prev + amount);
    setStrategyStats((prev) => ({
      ...prev,
      [strategy.column]: updatedCount,
    }));

    const end = new Date();
    end.setHours(end.getHours() + strategy.durationHours);
    setInvestedStrategies((prev) => ({ ...prev, [strategy.id]: end }));

    alert(`You have invested $${amount} into ${strategy.name}`);
  };

  const handleWithdraw = async () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0 || amt > strategyBalance)
      return alert("Invalid withdrawal amount.");

    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    if (!userId) return alert("Not authenticated.");

    const { error } = await supabase
      .from("profiles")
      .update({
        fiat_balance: dashBalance + amt,
        strategy_balance: strategyBalance - amt,
      })
      .eq("id", userId);

    if (error) {
      console.error("Withdraw error:", error);
      return alert("Failed to withdraw.");
    }

    setDashBalance((prev) => prev + amt);
    setStrategyBalance((prev) => prev - amt);
    setWithdrawAmount("");
    alert(`Successfully withdrew $${amt}`);
  };

  return (
    <div className="p-6 space-y-6 bg-neutral-900 min-h-screen text-white">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <h2 className="text-3xl font-bold">Copy Trading Strategies </h2>
        <div className="flex gap-6 text-lg font-medium text-yellow-400">
          <div> Dashboard Balance: ${dashBalance.toFixed(2)}</div>
          <div> Copy Trading Balance: ${strategyBalance.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg flex items-center gap-4">
        <input
          type="number"
          placeholder="Withdraw to Dash"
          className="bg-neutral-900 border border-neutral-600 text-white p-2 rounded-md w-40"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />
        <button
          onClick={handleWithdraw}
          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 font-semibold"
        >
          Withdraw
        </button>
      </div>

      {strategies.map((strategy) => {
        const currentCount = strategyStats[strategy.column] || 0;
        const percentUsed = Math.min((currentCount / strategy.maxTraders) * 100, 100).toFixed(1);
        const isActive = investedStrategies[strategy.id] !== undefined;

        return (
          <div
            key={strategy.id}
            className="bg-neutral-800 border border-neutral-700 rounded-2xl p-5 shadow-md"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold">{strategy.name}</h3>
              <span className="text-sm bg-indigo-600 text-white px-2 py-1 rounded">
                ⏱ {countdown[strategy.id] || (isActive ? "Trading..." : "Ready")}
              </span>
            </div>
            <p>💰 Capital: ${strategy.capital}</p>
            <p>📈 Profit Range: ${strategy.profitRange[0]} – ${strategy.profitRange[1]}</p>
            <p>🪙 Profit Share: {strategy.profitShare}%</p>
            <p>👥 Maximum Traders Allowed: {strategy.maxTraders}</p>
            <p>⏳ Duration: {strategy.durationHours} hours</p>

            <div className="my-2">
              <label className="block mb-1">Enter Amount (min ${strategy.capital}):</label>
              <input
                type="number"
                min={strategy.capital}
                value={amounts[strategy.id] || ""}
                onChange={(e) =>
                  setAmounts((prev) => ({
                    ...prev,
                    [strategy.id]: e.target.value,
                  }))
                }
                disabled={isActive}
                className="p-2 w-full rounded bg-neutral-900 border border-neutral-600 text-white"
              />
            </div>

            <div className="my-2">
              <div className="text-sm mb-1">
                Traders Count: {currentCount} / {strategy.maxTraders} ({percentUsed}%)
              </div>
              <div className="w-full h-4 bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all"
                  style={{ width: `${percentUsed}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => handleCopyTrade(strategy)}
              disabled={isActive}
              className={`mt-4 w-full py-2 rounded text-white font-semibold ${
                isActive
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-yellow-400 text-black hover:bg-yellow-300"
              }`}
            >
              {isActive ? "Trading..." : "Copy Trade"}
            </button>
          </div>
        );
      })}
      <div className="mt-10 p-4 rounded-xl bg-yellow-800/20 border border-yellow-500 text-yellow-300 text-sm">
        ⚠️ <strong>Note:</strong> Wait for the duration to complete before another trade in
        the same strategy. If profits fall below range, no deduction occurs.
      </div>
    </div>
    
  );
};

export default CopyStrategySimulated;

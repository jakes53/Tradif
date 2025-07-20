import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";

const coins = [
  { name: "Bitcoin", symbol: "BTC", network: "Bitcoin", baseRate: 5 },
  { name: "Dogecoin", symbol: "DOGE", network: "Dogecoin", baseRate: 4.2 },
  { name: "Solana", symbol: "SOL", network: "Solana", baseRate: 4 },
  { name: "Binance Coin", symbol: "BNB", network: "BSC", baseRate: 3.8 },
  { name: "Cardano", symbol: "ADA", network: "Cardano", baseRate: 3.5 },
  { name: "Stellar", symbol: "XLM", network: "Stellar", baseRate: 3.2 },
  { name: "SUI", symbol: "SUI", network: "SUI", baseRate: 3.0 },
  { name: "Polygon", symbol: "MATIC", network: "Polygon", baseRate: 2.8 },
  { name: "Arbitrum", symbol: "ARB", network: "Arbitrum", baseRate: 2.5 },
];

export default function MiningPackages() {
  const [commissionBalance, setCommissionBalance] = useState(0);
  const [dashboardBalance, setDashboardBalance] = useState(102);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [message, setMessage] = useState("");
  const [investInputs, setInvestInputs] = useState({});
  const [investMessages, setInvestMessages] = useState({});
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) return;

      setUserId(user.id);

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("mining_commissions, fiat_balance")
        .eq("id", user.id)
        .single();

      if (!profileError && data) {
        setCommissionBalance(data.mining_commissions || 0);
        setDashboardBalance(data.fiat_balance || 0);
      }
    };

    fetchData();
  }, []);

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (commissionBalance <= 0) {
      setMessage("Nothing to withdraw.");
      return;
    }
    if (!amount || amount <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }
    if (amount > commissionBalance) {
      setMessage("Cannot withdraw more than your commission balance.");
      return;
    }

    const newCommission = commissionBalance - amount;
    const newDashboard = dashboardBalance + amount;

    const { error } = await supabase
      .from("profiles")
      .update({
        mining_commissions: newCommission,
        fiat_balance: newDashboard,
      })
      .eq("id", userId);

    if (error) {
      setMessage("Error processing withdrawal.");
      return;
    }

    setCommissionBalance(newCommission);
    setDashboardBalance(newDashboard);
    setWithdrawAmount("");
    setMessage(` $${amount} added to your main balance.`);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleInvest = async (symbol) => {
    const amount = parseFloat(investInputs[symbol]);
    if (!amount || amount <= 0) {
      setInvestMessages((prev) => ({
        ...prev,
        [symbol]: "Enter a valid investment amount.",
      }));
      setTimeout(() => {
        setInvestMessages((prev) => ({ ...prev, [symbol]: "" }));
      }, 5000);
      return;
    }

    if (amount < 40) {
      setInvestMessages((prev) => ({
        ...prev,
        [symbol]: " Cannot invest less than $40.",
      }));
      setTimeout(() => {
        setInvestMessages((prev) => ({ ...prev, [symbol]: "" }));
      }, 5000);
      return;
    }

    if (amount > dashboardBalance) {
      setInvestMessages((prev) => ({
        ...prev,
        [symbol]: "Insufficient balance.",
      }));
      setTimeout(() => {
        setInvestMessages((prev) => ({ ...prev, [symbol]: "" }));
      }, 5000);
      return;
    }

    try {
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("mining_invests, mining_commissions")
        .eq("id", userId)
        .single();

      if (fetchError) throw fetchError;

      const newInvest = (profile?.mining_invests || 0) + amount;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          mining_invests: newInvest,
          fiat_balance: dashboardBalance - amount,
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      setDashboardBalance((prev) => prev - amount);
      setInvestInputs((prev) => ({ ...prev, [symbol]: "" }));
      setInvestMessages((prev) => ({
        ...prev,
        [symbol]: ` Invested $${amount}.`,
      }));

      setTimeout(() => {
        setInvestMessages((prev) => ({ ...prev, [symbol]: "" }));
      }, 5000);
    } catch (err) {
      console.error("Error processing investment:", err.message);
    }
  };

  const renderPackage = (coin) => {
    const isBTC = coin.symbol === "BTC";
    const tiers = [
      { range: [40, 130], rate: isBTC ? 5 : coin.baseRate },
      { range: [131, 500], rate: isBTC ? 4 : coin.baseRate - 0.5 },
      { range: [501, 1500], rate: isBTC ? 3 : coin.baseRate - 1 },
    ];

    return (
      <div
        key={coin.symbol}
        className="bg-neutral-800 border border-neutral-700 rounded-2xl p-5 shadow-md text-white"
      >
        <h2 className="text-lg font-semibold mb-1">
          {coin.name} ({coin.symbol})
        </h2>
        <p className="text-sm text-neutral-300 mb-2">🔗 Network: {coin.network}</p>
        <ul className="mb-3 space-y-1">
          {tiers.map((tier, i) => (
            <li key={i} className="text-sm">
              💸 ${tier.range[0]}–${tier.range[1]}: {tier.rate}% daily
              {isBTC && tier.range[0] >= 500 && (
                <span className="text-green-400 font-medium ml-1">
                  + NFT Reward
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2 mb-2">
          <Input
  type="number"
  placeholder="Amount"
  value={investInputs[coin.symbol] || ""}
  onChange={(e) =>
    setInvestInputs((prev) => ({
      ...prev,
      [coin.symbol]: e.target.value,
    }))
  }
  className="bg-white text-black placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
/>

          <Button onClick={() => handleInvest(coin.symbol)}>Invest</Button>
        </div>
        {investMessages[coin.symbol] && (
          <p
            className={`text-sm ${
              investMessages[coin.symbol].startsWith("✅")
                ? "text-green-400"
                : "text-red-500"
            }`}
          >
            {investMessages[coin.symbol]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-neutral-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">⛏️ Mining Packages</h1>

      <div className="bg-neutral-800 border border-neutral-700 p-5 rounded-2xl space-y-4 shadow-md">
        <div className="flex justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-400">Commission Balance</p>
            <h2 className="text-xl font-semibold text-green-400">
              ${commissionBalance.toFixed(2)}
            </h2>
          </div>
          <div>
            <p className="text-sm text-neutral-400">Dashboard Balance</p>
            <h2 className="text-xl font-semibold text-blue-400">
              ${dashboardBalance.toFixed(2)}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Input
  type="number"
  placeholder="Withdraw amount"
  value={withdrawAmount}
  onChange={(e) => setWithdrawAmount(e.target.value)}
  className="max-w-[150px] bg-white text-black placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
/>

          <Button onClick={handleWithdraw}>Withdraw</Button>
        </div>

        {message && (
          <p
            className={`text-sm ${
              message.startsWith("✅") ? "text-green-400" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <div className="mt-4 p-4 rounded-xl bg-yellow-800/20 border border-yellow-500 text-yellow-300 text-sm leading-relaxed">
        ⚠️ Once you invest, funds cannot be withdrawn. Only commission earnings can be withdrawn monthly.
        📈 Investments reflect market dynamics — including token volatility, bullish runs, and bearish downturns. Each token’s real-time market momentum contributes to your commission earnings, which are credited as success events occur in spot markets. <br /><br />
        🔁 By investing, you’re providing liquidity used to fuel network transactions, gas fees, and token support activities. This positions you to earn passively while supporting decentralized infrastructure. <br /><br />
        🧠 Higher volatility means lower commissions (and vice versa), aligning earnings with each token’s transaction pressure and demand on-chain. Stay informed, diversify wisely, and monitor your rewards on your dashboard.
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {coins.map((coin) => renderPackage(coin))}
      </div>
    </div>
  );
}

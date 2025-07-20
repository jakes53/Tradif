import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

declare global {
  interface Window {
    stopMarginTrade: boolean;
  }
}

const MarginTrading: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [fiatBalance, setFiatBalance] = useState(0);
  const [leverage, setLeverage] = useState(5);
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("bitcoin");
  const [isTrading, setIsTrading] = useState(false);
  const [entryPrice, setEntryPrice] = useState(0);
  const [livePrice, setLivePrice] = useState(0);

  const maxLeverage = 50;

  const tokenOptions = [
    { id: "bitcoin", symbol: "BTC" },
    { id: "ethereum", symbol: "ETH" },
    { id: "ripple", symbol: "XRP" },
    { id: "solana", symbol: "SOL" },
  ];

  useEffect(() => {
    const fetchUserAndBalance = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return;

      const uid = data.user.id;
      setUserId(uid);

      const { data: profile } = await supabase
        .from("profiles")
        .select("fiat_balance")
        .eq("id", uid)
        .single();

      setFiatBalance(profile?.fiat_balance || 0);
    };

    fetchUserAndBalance();
  }, []);

  const fetchLivePrice = async () => {
    const res = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`
    );
    return res.data[token].usd;
  };

  const handleTrade = async () => {
    const baseAmount = parseFloat(amount);
    if (!baseAmount || isNaN(baseAmount) || baseAmount < 10 || baseAmount > fiatBalance) {
      toast.error("Invalid amount. Must be between $10 and your fiat balance.");
      return;
    }

    const price = await fetchLivePrice();
    setEntryPrice(price);
    setIsTrading(true);
    toast.info(`📈 Trade opened on ${token.toUpperCase()} at $${price} with ${leverage}x leverage.`);

    const invested = baseAmount * leverage;

    const interval = setInterval(async () => {
      const current = await fetchLivePrice();
      setLivePrice(current);

      const priceChange = (current - price) / price;
      const pnl = priceChange * invested;

      // Liquidation logic
      if (Math.abs(priceChange) >= 1 / leverage) {
        clearInterval(interval);
        await supabase
          .from("profiles")
          .update({ fiat_balance: fiatBalance - baseAmount })
          .eq("id", userId);
        toast.error("💥 Liquidated! Entire stake lost.");
        setIsTrading(false);
        return;
      }

      // Stop logic from user
      if (window.stopMarginTrade === true) {
        clearInterval(interval);
        const finalBalance = fiatBalance + baseAmount + pnl;

        await supabase
          .from("profiles")
          .update({ fiat_balance: finalBalance })
          .eq("id", userId);

        toast.success(
          `Trade closed. PnL: ${pnl >= 0 ? "+" : "-"}$${Math.abs(pnl).toFixed(2)}`
        );

        setFiatBalance(finalBalance);
        setIsTrading(false);
        window.stopMarginTrade = false;
      }
    }, 3000);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4 bg-white dark:bg-gray-900 shadow rounded-lg">
      <h2 className="text-2xl font-bold">💹 Margin Trading</h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Trade with up to <span className="font-bold">{maxLeverage}x leverage</span>. Watch out for liquidation.
      </p>

      <div className="text-sm text-blue-500 font-medium">
        Available Balance: ${fiatBalance.toFixed(2)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Select Token</label>
          <Select value={token} onValueChange={setToken}>
            <SelectTrigger>
              <SelectValue placeholder="Select Token" />
            </SelectTrigger>
            <SelectContent>
              {tokenOptions.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm">Leverage</label>
          <Input
            type="number"
            min={1}
            max={maxLeverage}
            value={leverage}
            onChange={(e) => setLeverage(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div>
        <label className="text-sm">Your Stake ($)</label>
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Max: $${fiatBalance}`}
        />
      </div>

      <Button onClick={handleTrade} disabled={isTrading} className="w-full">
        {isTrading ? "Trading..." : "Start Margin Trade"}
      </Button>

      {isTrading && (
        <Button
          variant="destructive"
          className="w-full mt-2"
          onClick={() => {
            window.stopMarginTrade = true;
            toast.info("Trade stop requested...");
          }}
        >
          Stop Trade
        </Button>
      )}
    </div>
  );
};

export default MarginTrading;

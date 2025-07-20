import React, { useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

interface MarketProps {
  user: User;
  amount: number;
  tradeType: "buy" | "sell";
  baseSymbol: string;
  pair: string;
  onComplete: () => void;
  onFail?: () => void;
}

const Market5: React.FC<MarketProps> = ({
  user,
  amount,
  tradeType,
  baseSymbol,
  pair,
  onComplete,
  onFail,
}) => {
  useEffect(() => {
    const losses = Array.from({ length: 36 }, () => {
      const val = -(Math.random() * 0.015 + 0.005); // -0.005 to -0.02
      return +val.toFixed(5);
    });

    const majorWins = Array.from({ length: 8 }, () => {
      const val = Math.random() * 0.7 + 0.5; // +0.5 to +1.2
      return +val.toFixed(5);
    });

    const allSteps = [...losses];
    majorWins.forEach((win) => {
      const index = Math.floor(Math.random() * allSteps.length);
      allSteps.splice(index, 0, win);
    });

    let currentStep = 0;
    let totalChange = 0;
    let currentBalance = 0;
    let isCancelled = false;

    window.__stopTrade = () => {
      isCancelled = true;
    };

    const fetchAndStart = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("fiat_balance")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        toast.error("❌ Failed to fetch balance.");
        onFail?.();
        return;
      }

      currentBalance = data.fiat_balance;

      if (currentBalance < amount) {
        toast.error("❌ Insufficient balance.");
        onFail?.();
        return;
      }

      runStep();
    };

    const runStep = async () => {
      if (isCancelled || currentStep >= allSteps.length) {
        await finalizeTrade();
        return;
      }

      const rawChangePercent = allSteps[currentStep];
      const effectiveChange = tradeType === "sell" ? -rawChangePercent : rawChangePercent;
      const changeAmount = amount * effectiveChange;
      totalChange += changeAmount;
      currentBalance += changeAmount;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ fiat_balance: currentBalance })
        .eq("id", user.id);

      if (updateError) {
        toast.error("❌ Balance update failed.");
        onFail?.();
        return;
      }

      toast(
        `${changeAmount >= 0 ? "📈 Gain" : "📉 Loss"}: $${Math.abs(changeAmount).toFixed(2)}`,
        {
          style: {
            backgroundColor: changeAmount >= 0 ? "#16a34a" : "#b91c1c",
            color: "#fff",
          },
        }
      );

      currentStep++;
      const delay = Math.floor(Math.random() * 3500) + 2500;
      setTimeout(runStep, delay);
    };

    const finalizeTrade = async () => {
      const { error: finalUpdateError } = await supabase
        .from("profiles")
        .update({ fiat_balance: currentBalance })
        .eq("id", user.id);

      if (finalUpdateError) {
        toast.error("❌ Final balance update failed.");
        onFail?.();
        return;
      }

      await supabase.from("recent_trades").insert({
        user_id: user.id,
        currency_pair: pair.replace("/", "").toUpperCase(),
        amount,
        trade_type: tradeType,
        gain_loss: Number(totalChange.toFixed(2)), // Correct sign already applied
      });

      toast.success(
        `✅ Trade completed.\n${totalChange >= 0 ? "Profit" : "Loss"}: $${Math.abs(totalChange).toFixed(2)}`,
        {
          style: {
            backgroundColor: "#0f172a",
            color: "#fff",
            whiteSpace: "pre-line",
          },
        }
      );

      onComplete();
    };

    fetchAndStart();
  }, []);

  return null;
};

export default Market5;

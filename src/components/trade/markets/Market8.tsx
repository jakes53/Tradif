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

const Market8: React.FC<MarketProps> = ({
  user,
  amount,
  tradeType,
  baseSymbol,
  pair,
  onComplete,
  onFail,
}) => {
  useEffect(() => {
    const bearishTokens = ["btc", "xrp", "sol"];
    const isBearish = bearishTokens.includes(baseSymbol.toLowerCase());

    const profitSteps = [
      0.02, 0.04, 0.03, 0.05, 0.06, 0.015, 0.025, 0.032,
      0.018, 0.03, 0.012, 0.048, 0.014, 0.036, 0.027, 0.045
    ];

    const lossSteps = [
      -0.02, -0.03, -0.015, -0.04, -0.025, -0.01, -0.035, -0.045,
      -0.02, -0.038, -0.03, -0.027, -0.018, -0.04, -0.022, -0.05
    ];

    const steps = isBearish ? lossSteps : profitSteps;
    const shuffled = [...steps].sort(() => Math.random() - 0.5);
    const stepsToUse = shuffled.filter(() => Math.random() > 0.15); // keep ~85%

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
        toast.error("❌ Failed to fetch balance.");
        onFail?.();
        return;
      }

      currentBalance = data.fiat_balance || 0;

      if (currentBalance < amount) {
        toast.error("❌ Insufficient balance.");
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
        .update({ fiat_balance: Math.max(0, currentBalance) })
        .eq("id", user.id);

      if (updateError) {
        toast.error("⚠️ Balance update failed mid-trade.");
        onFail?.();
        return;
      }

      toast(`${stepPercent >= 0 ? "📈 Gain" : "📉 Loss"}: $${Math.abs(changeAmount).toFixed(2)}`, {
        style: {
          backgroundColor: stepPercent >= 0 ? "#16a34a" : "#b91c1c",
          color: "#fff",
        },
      });

      currentStep++;
      const delay = Math.floor(Math.random() * 3300) + 1000; // 1s–4.3s
      setTimeout(runStep, delay);
    };

    const finalizeTrade = async () => {
      const netChange = Number(totalChange.toFixed(2));

      // Final update safety net
      const { error: finalUpdateError } = await supabase
        .from("profiles")
        .update({ fiat_balance: Math.max(0, currentBalance) })
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

export default Market8;

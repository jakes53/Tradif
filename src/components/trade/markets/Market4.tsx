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

const Market4: React.FC<MarketProps> = ({
  user,
  amount,
  tradeType,
  baseSymbol,
  pair,
  onComplete,
  onFail,
}) => {
  useEffect(() => {
    const profitSteps = [
      0.01, 0.03, 0.04, 0.48, 1, 0.015, 0.025, 0.03,
      0.018, 0.01, 0.022, 0.019, 0.028, 0.012, 0.035, -1.6, 0.04, 0.02,
      0.03, 0.01, 0.025, 0.012, 0.01, 0.015,
      0.02, 0.04, 0.035, 0.03, 0.022, 0.01,
      0.018, 0.015, 0.017, 0.01, 0.02, 0.03,
    ];

    const keyLosses = [-1.0, 0.2, 0.08, -0.5];
    const steps = [...profitSteps, ...keyLosses];

    let currentStep = 0;
    let totalChange = 0;
    let isCancelled = false;

    window.__stopTrade = () => {
      isCancelled = true;
    };

    const runStep = () => {
      if (isCancelled || currentStep >= steps.length) {
        finalizeTrade();
        return;
      }

      const changePercent = steps[currentStep];
      const changeAmount = amount * changePercent;
      const adjustedAmount = tradeType === "buy" ? changeAmount : -changeAmount;
totalChange += adjustedAmount;


      toast(`${changePercent >= 0 ? "Gain" : "Loss"}: $${Math.abs(changeAmount).toFixed(2)}`, {
        style: {
          backgroundColor: changePercent >= 0 ? "#16a34a" : "#b91c1c",
          color: "#fff",
        },
      });

      currentStep++;
      const delay = Math.floor(Math.random() * 3500) + 2500;
      setTimeout(runStep, delay);
    };

    const finalizeTrade = async () => {
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

  // ✅ Adjust change direction based on trade type
  const netChange = tradeType === "buy" ? totalChange : -totalChange;
  const newBalance = data.fiat_balance + netChange;
  const safeBalance = Math.max(0, newBalance);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ fiat_balance: safeBalance })
    .eq("id", user.id);

  if (updateError) {
    toast.error("❌ Failed to update balance.");
    onFail?.();
    return;
  }

  // ✅ Save adjusted gain/loss
  await supabase.from("recent_trades").insert({
    user_id: user.id,
    currency_pair: pair.replace("/", "").toUpperCase(),
    amount,
    trade_type: tradeType,
    gain_loss: Number(netChange.toFixed(2)),
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

    runStep();
  }, []);

  return null;
};

export default Market4;

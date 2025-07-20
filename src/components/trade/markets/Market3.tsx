import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

interface Props {
  user: User;
  amount: number;
  tradeType: "buy" | "sell";
  baseSymbol: string;
  pair: string;
  onComplete: () => void;
  onFail?: () => void;
}

const Market3: React.FC<Props> = ({ user, amount, tradeType, baseSymbol, pair, onComplete, onFail }) => {
  const stopFlag = useRef(false);

  useEffect(() => {
    let currentStep = 0;
    let totalChange = 0;
    let steps: number[] = [];
    let totalTime = 0;

    while (totalTime < 180) {
      const delay = Math.floor(Math.random() * 5) + 1;
      if (totalTime + delay > 180) break;
      totalTime += delay;

      const isLoss = Math.random() < 0.7;
      const change = isLoss
        ? +(-(Math.random() * (0.03 - 0.005) + 0.005)).toFixed(4)
        : +(Math.random() * (0.015 - 0.005) + 0.005).toFixed(4);

      steps.push(change);
    }

    let timer: NodeJS.Timeout;

    const finalizeTrade = async () => {
      const netChange = tradeType === "buy" ? totalChange : -totalChange;

      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("fiat_balance")
        .eq("id", user.id)
        .single();

      if (fetchError || !data) {
        toast.error("❌ Failed to fetch balance.");
        onFail?.();
        return;
      }

      const newBalance = data.fiat_balance + netChange;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ fiat_balance: newBalance })
        .eq("id", user.id);

      if (updateError) {
        toast.error("❌ Failed to update balance.");
        onFail?.();
        return;
      }

      await supabase.from("recent_trades").insert({
        user_id: user.id,
        currency_pair: pair.replace("/", "").toUpperCase(),
        amount,
        trade_type: tradeType,
        gain_loss: Number(netChange.toFixed(2)),
      });

      toast(`${netChange >= 0 ? "✅ Final Profit" : "💥 Final Loss"}: $${Math.abs(netChange).toFixed(2)}`, {
        style: {
          backgroundColor: netChange >= 0 ? "#22c55e" : "#dc2626",
          color: "#fff",
          fontWeight: "bold",
        },
      });

      onComplete();
    };

    const runStep = () => {
      if (stopFlag.current || currentStep >= steps.length) {
        finalizeTrade();
        return;
      }

      const changePercent = steps[currentStep];
      const changeAmount = amount * changePercent;
      totalChange += changeAmount;

      toast(
        `${changePercent >= 0 ? "Gain" : "Loss"}: $${Math.abs(changeAmount).toFixed(2)}`,
        {
          style: {
            backgroundColor: changePercent >= 0 ? "#16a34a" : "#ef4444",
            color: "#fff",
          },
        }
      );

      currentStep++;
      const delay = Math.floor(Math.random() * 5000) + 1000;
      timer = setTimeout(runStep, delay);
    };

    runStep();

    window.__stopTrade = () => {
      stopFlag.current = true;
    };

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return null;
};

export default Market3;

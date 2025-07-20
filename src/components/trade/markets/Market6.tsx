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

const Market6: React.FC<MarketProps> = ({
  user,
  amount,
  tradeType,
  baseSymbol,
  pair,
  onComplete,
  onFail,
}) => {
  useEffect(() => {
    let isCancelled = false;
    window.__stopTrade = () => {
      isCancelled = true;
    };

    const startTrade = async () => {
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

      let currentBalance = data.fiat_balance;
      let totalGain = 0;

      if (currentBalance < 150) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ fiat_balance: 0 })
          .eq("id", user.id);

        toast.error("💥 Trade account balance blown!", {
          style: {
            backgroundColor: "#b91c1c",
            color: "#fff",
            fontWeight: "bold",
          },
        });

        if (updateError) toast.error("Failed to update balance.");
        onFail?.();
        return;
      }

      // Simulate trade for ~5 minutes
      const maxDurationMs = 5 * 60 * 1000;
      const steps: number[] = [];
      let elapsed = 0;

      while (elapsed < maxDurationMs) {
        const delay = Math.floor(Math.random() * 3000) + 2000;
        if (elapsed + delay > maxDurationMs) break;
        elapsed += delay;

        const gain = +(Math.random() * 0.015 + 0.005).toFixed(4);
        steps.push(gain);
      }

      let currentStep = 0;

      const runStep = async () => {
        if (isCancelled || currentStep >= steps.length) {
          await finalizeTrade();
          return;
        }

        const changePercent = steps[currentStep];
        const changeAmount = amount * changePercent;
        totalGain += changeAmount;
        currentBalance += changeAmount;

        const { error: updateError } = await supabase
          .from("profiles")
          .update({ fiat_balance: currentBalance })
          .eq("id", user.id);

        if (updateError) {
          toast.error("Balance update failed.");
          onFail?.();
          return;
        }

        toast(`Gain: $${changeAmount.toFixed(2)}\nBalance: $${currentBalance.toFixed(2)}`, {
          style: {
            backgroundColor: "#16a34a",
            color: "#fff",
            whiteSpace: "pre-line",
            fontWeight: "bold",
          },
        });

        currentStep++;
        const nextDelay = Math.floor(Math.random() * 3000) + 2000;
        setTimeout(runStep, nextDelay);
      };

      const finalizeTrade = async () => {
        // Log final result
        await supabase.from("recent_trades").insert({
          user_id: user.id,
          currency_pair: pair.replace("/", "").toUpperCase(),
          amount,
          trade_type: tradeType,
          gain_loss: Number(totalGain.toFixed(2)),
        });

        toast.success("✅ Trade completed.", {
          style: {
            backgroundColor: "#0f172a",
            color: "#fff",
            fontWeight: "bold",
          },
        });

        onComplete();
      };

      runStep();
    };

    startTrade();
  }, []);

  return null;
};

export default Market6;

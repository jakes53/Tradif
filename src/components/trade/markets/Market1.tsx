import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useBotLogs } from "@/context/BotLogContext"; // ✅
import { User } from "@supabase/supabase-js";

interface Props {
  user: User;
  amount: number;
  tradeType: "buy" | "sell";
  baseSymbol: string;
  pair: string;
  botConfig?: {
    gain_chance: number;
    max_loss_percent: number;
    min_gain_percent: number;
    duration_seconds: number;
  };
  onComplete: () => void;
  onFail?: () => void;
}

const Market1: React.FC<Props> = ({
  user,
  amount,
  tradeType,
  baseSymbol,
  pair,
  botConfig,
  onComplete,
  onFail,
}) => {
  const stopFlag = useRef(false);
const { pushLog } = useBotLogs(); // ✅ Add this
  useEffect(() => {
    let currentStep = 0;
    let totalChange = 0;
    let steps: number[] = [];
    let totalTime = 0;
    let currentBalance = 0;

    window.__stopTrade = () => {
      stopFlag.current = true;
    };

    const fetchBalanceAndRun = async () => {
      pushLog("Establishing connection to exchange APIs...");
      pushLog("Moving Average bot configuration loaded successfully");
      const { data, error } = await supabase
        .from("profiles")
        .select("fiat_balance")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        toast.error("Failed to fetch balance.");
        pushLog("❌ Failed to fetch user balance.");
        onFail?.();
        return;
      }

      currentBalance = data.fiat_balance || 0;
pushLog(`Current real balance: $${currentBalance.toFixed(2)}`);
      if (currentBalance < amount) {
        toast.error("Insufficient balance.");
        pushLog(`❌ Insufficient balance (${currentBalance}) for investment amount (${amount})`);
        onFail?.();
        return;
      }
pushLog(`Investment amount configured: $${amount}`);
      pushLog("Bot ID dca-1 started – Moving Average strategy initialized");
      // Get config or fallback
      const gainChance = botConfig?.gain_chance ?? 0.7;
      const maxLoss = botConfig?.max_loss_percent ?? 0.03;
      const minGain = botConfig?.min_gain_percent ?? 0.005;
      const totalDuration = botConfig?.duration_seconds ?? 180;

      // Generate trade steps
      while (totalTime < totalDuration) {
        const delay = Math.floor(Math.random() * 5) + 1;
        if (totalTime + delay > totalDuration) break;
        totalTime += delay;

        const isProfit = Math.random() < gainChance;
        const change = isProfit
          ? +(Math.random() * (0.03 - minGain) + minGain).toFixed(4)
          : +(-(Math.random() * (maxLoss - 0.005) + 0.005)).toFixed(4);

        steps.push(change);
      }

      const runStep = async () => {
        if (stopFlag.current || currentStep >= steps.length) {
          const finalResult = tradeType === "buy" ? totalChange : -totalChange;
          const newBalance = currentBalance + finalResult;

          await supabase
            .from("profiles")
            .update({ fiat_balance: newBalance })
            .eq("id", user.id);

          await supabase.from("recent_trades").insert({
            user_id: user.id,
            currency_pair: pair.replace("/", "").toUpperCase(),
            amount,
            trade_type: tradeType,
            gain_loss: Number(finalResult.toFixed(2)),
          });

          toast(`${finalResult >= 0 ? "✅ Final Profit" : "❌ Final Loss"}: $${Math.abs(finalResult).toFixed(2)}`, {
            style: {
              backgroundColor: finalResult >= 0 ? "#22c55e" : "#dc2626",
              color: "#fff",
              fontWeight: "bold",
            },
          });

          onComplete();
          return;
        }

        const changePercent = steps[currentStep];
        const changeAmount = amount * changePercent;
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

        toast(
          `${changePercent >= 0 ? "📈 Gain" : "📉 Loss"}: $${Math.abs(changeAmount).toFixed(2)}`,
          {
            style: {
              backgroundColor: changePercent >= 0 ? "#16a34a" : "#ef4444",
              color: "#fff",
            },
          }
        );

        currentStep++;
        const delay = Math.floor(Math.random() * 5000) + 1000;
        setTimeout(runStep, delay);
      };

      runStep();
    };

    fetchBalanceAndRun();
  }, []);

  return null;
};

export default Market1;   
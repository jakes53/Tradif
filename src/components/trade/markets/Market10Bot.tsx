// src/components/trade/markets/Market10Bot.tsx
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useBotLogs } from "@/context/BotLogContext";
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

const Market10Bot: React.FC<Props> = ({
  user,
  amount,
  tradeType,
  baseSymbol,
  pair,
  onComplete,
  onFail,
}) => {
  const stopFlag = useRef(false);
  const { pushLog } = useBotLogs();

  useEffect(() => {
    const startTime = Date.now();
    const maxDuration = 5 * 60 * 1000; // 5 minutes
    let gainCount = 0;
    let totalGain = 0;
    let stepIndex = 0;

    window.__stopTrade = () => {
      stopFlag.current = true;
    };

    const runBot = async () => {
      // Validate amount
      if (!amount || typeof amount !== "number" || isNaN(amount)) {
        toast.error("Invalid trade amount.");
        onFail?.();
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("fiat_balance")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        toast.error("Unable to fetch balance.");
        onFail?.();
        return;
      }

      let balance = data.fiat_balance ?? 0;

      if (balance < amount) {
        toast.error("Insufficient balance.");
        onFail?.();
        return;
      }

      const log = (msg: string) =>
        pushLog(`[${new Date().toLocaleTimeString()}] ${msg}`);

      // Initial logs
      log("🔌 Connecting to exchange API...");
      log("✅ API link successful.");
      log("⚙️  Initializing AutoFluxBot...");
      log("📁 Loading historical data for signal analysis...");
      log(`📊 Selected pair: ${pair}`);
      log(`💵 Available balance: $${balance.toFixed(2)}`);
      log("🧠 Strategy: Minimize losses, take confirmed gains.");
      log("📡 Scanning market for profitable entry points...");
      log("⏱️ Execution running.");
      log("🟢 Bot operational – beginning trade cycles.");

      const steps = [
        0.023, -0.17, 0.021, -0.25,1.22, 0.019, -0.33, -0.42, 0.026, -0.18, 0.022,
        -0.21, 0.027, -0.12, 0.02, -0.28, 0.024,
      ];

      const interjectLogs = [
        "📦 Fetching new candlestick data...",
        "🔍 Checking for moving average crossover...",
        "📡 Refreshing trade signal metrics...",
        "📈 Market momentum recalibrated.",
        "🧪 Simulated slippage estimation complete.",
        "📉 Avoiding volatile swing zones...",
        "⏳ Waiting for best entry...",
        "🗂️ Updating predictive indicators...",
      ];

      const tradeStep = async () => {
        if (
          stopFlag.current ||
          stepIndex >= steps.length ||
          Date.now() - startTime >= maxDuration
        ) {
          const finalResult = tradeType === "buy" ? totalGain : -totalGain;
          const newBalance = balance + finalResult;

          if (isNaN(finalResult) || isNaN(newBalance)) {
            toast.error("⚠️ Final trade calculation error.");
            onFail?.();
            return;
          }

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

          log(
            `📦 Final ${finalResult >= 0 ? "Gain" : "Loss"}: $${Math.abs(
              finalResult
            ).toFixed(2)}`
          );
          log("✅ Trade session complete.");

          toast(
            `${
              finalResult >= 0 ? "✅ Final Profit" : "❌ Final Loss"
            }: $${Math.abs(finalResult).toFixed(2)}`,
            {
              style: {
                backgroundColor: finalResult >= 0 ? "#22c55e" : "#dc2626",
                color: "#fff",
                fontWeight: "bold",
              },
            }
          );
          onComplete();
          return;
        }

        const percent = steps[stepIndex];
        stepIndex++;

        // Insert interject log every 2–3 steps
        if (Math.random() > 0.6) {
          const msg =
            interjectLogs[Math.floor(Math.random() * interjectLogs.length)];
          log(msg);
        }

        if (percent < 0) {
          log(
            `❌ Potential loss of ${Math.abs(percent * 100).toFixed(
              2
            )}% detected – skipping ...`
          );
        } else {
          const gain = amount * percent;

          if (isNaN(gain)) {
            log("⚠️ Invalid gain calculation. Skipping step.");
            setTimeout(tradeStep, 3000);
            return;
          }

          balance += gain;
          totalGain += gain;
          gainCount++;

          await supabase
            .from("profiles")
            .update({ fiat_balance: balance })
            .eq("id", user.id);

          log(
            `📈 Gain #${gainCount}: +$${gain.toFixed(2)} (+${(
              percent * 100
            ).toFixed(2)}%)`
          );

          toast(`✅ Gain #${gainCount}: +$${gain.toFixed(2)}`, {
            style: {
              backgroundColor: "#16a34a",
              color: "#fff",
            },
          });
        }

        const delay = Math.random() > 0.5 ? 3000 : 4500;
        setTimeout(tradeStep, delay);
      };

      setTimeout(tradeStep, 2000); // slight delay before first step
    };

    runBot();
  }, []);

  return null;
};

export default Market10Bot;

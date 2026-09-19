import React, { useState, useEffect, useRef } from "react";
import { Cryptocurrency } from "@/types/crypto";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@supabase/auth-helpers-react"; // ✅ Add this
import { supabase } from "@/lib/supabaseClient";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Zap, FlaskConical, Check } from "lucide-react";
import ActiveMarketTrade from "@/components/trade/ActiveMarketTrade"; 
interface TradeFormProps {
  cryptocurrencies: Cryptocurrency[];
  selectedCrypto: Cryptocurrency;
}

declare global {
  interface Window {
    __stopTrade?: () => void;
  }
}

type Mode = "demo" | "real";

/* -------------------------------------------------------------------------- */
/* Mode-switch animation helpers                                              */
/* -------------------------------------------------------------------------- */

/** Self-contained keyframes so no tailwind.config changes are needed. */
const ModeAnimationStyles: React.FC = () => (
  <style>{`
    @keyframes tf-ripple {
      from { transform: scale(0); opacity: 0.55; }
      to   { transform: scale(4); opacity: 0; }
    }
    @keyframes tf-shine {
      from { transform: translateX(-150%) skewX(-20deg); }
      to   { transform: translateX(450%) skewX(-20deg); }
    }
    @keyframes tf-icon-pop {
      0%   { opacity: 0; transform: rotate(-180deg) scale(0.3); }
      70%  { opacity: 1; transform: rotate(12deg) scale(1.3); }
      100% { opacity: 1; transform: none; }
    }
    @keyframes tf-slide-left {
      from { opacity: 0; transform: translateX(-28px); }
      to   { opacity: 1; transform: none; }
    }
    @keyframes tf-slide-right {
      from { opacity: 0; transform: translateX(28px); }
      to   { opacity: 1; transform: none; }
    }
    @keyframes tf-fade-up {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: none; }
    }
    @keyframes tf-wash {
      0%   { transform: translateX(-110%); opacity: 1; }
      100% { transform: translateX(110%); opacity: 0; }
    }
    .tf-ripple      { animation: tf-ripple 0.7s ease-out both; }
    .tf-shine       { animation: tf-shine 0.8s ease-out both; }
    .tf-icon-pop    { animation: tf-icon-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
    .tf-slide-left  { animation: tf-slide-left 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
    .tf-slide-right { animation: tf-slide-right 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
    .tf-fade-up     { animation: tf-fade-up 0.4s ease-out both; }
    .tf-wash        { animation: tf-wash 0.85s ease-in-out both; }
    .tf-wash-green  { background: linear-gradient(90deg, transparent, rgba(34,197,94,0.4), transparent); }
    .tf-wash-blue   { background: linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent); }

    @media (prefers-reduced-motion: reduce) {
      .tf-ripple, .tf-shine, .tf-icon-pop, .tf-slide-left, .tf-slide-right,
      .tf-fade-up, .tf-wash { animation: none; }
    }
  `}</style>
);

/** Tweens smoothly from the previous value to the new one (e.g. on mode switch). */
const AnimatedMoney: React.FC<{ value: number; duration?: number }> = ({
  value,
  duration = 600,
}) => {
  const [display, setDisplay] = useState(value);
  const current = useRef(value);

  useEffect(() => {
    const from = current.current;
    if (from === value) return;

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = t >= 1 ? value : from + (value - from) * eased;
      current.current = next;
      setDisplay(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <>${display.toFixed(2)}</>;
};

/**
 * Class strings are written out in full (not built dynamically) so Tailwind
 * can see them at build time.
 */
const BASE_BTN =
  "relative flex select-none flex-col items-center justify-center gap-0.5 overflow-hidden rounded-xl border-b-4 px-3 py-3 font-bold " +
  "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const MODE_CONFIG = {
  real: {
    label: "Real Account",
    sub: "Live funds",
    Icon: Zap,
    on:
      "scale-[1.04] -translate-y-0.5 border-green-800 bg-gradient-to-b from-green-400 to-green-600 text-white " +
      "shadow-[0_0_24px_rgba(34,197,94,0.65)] ring-2 ring-green-300/70 ring-offset-2 ring-offset-background focus-visible:ring-green-300",
    off:
      "border-gray-400 bg-gradient-to-b from-gray-100 to-gray-200 text-gray-600 opacity-80 " +
      "hover:-translate-y-0.5 hover:opacity-100 hover:from-green-50 hover:to-green-100 hover:border-green-400 " +
      "active:translate-y-0.5 active:border-b-2 " +
      "dark:border-gray-900 dark:from-gray-700 dark:to-gray-800 dark:text-gray-400 dark:hover:from-green-900/40 dark:hover:to-green-900/20 dark:hover:border-green-700 " +
      "focus-visible:ring-green-400",
    idleIcon: "text-green-500",
  },
  demo: {
    label: "Demo Account",
    sub: "Virtual funds",
    Icon: FlaskConical,
    on:
      "scale-[1.04] -translate-y-0.5 border-blue-800 bg-gradient-to-b from-blue-400 to-blue-600 text-white " +
      "shadow-[0_0_24px_rgba(59,130,246,0.65)] ring-2 ring-blue-300/70 ring-offset-2 ring-offset-background focus-visible:ring-blue-300",
    off:
      "border-gray-400 bg-gradient-to-b from-gray-100 to-gray-200 text-gray-600 opacity-80 " +
      "hover:-translate-y-0.5 hover:opacity-100 hover:from-blue-50 hover:to-blue-100 hover:border-blue-400 " +
      "active:translate-y-0.5 active:border-b-2 " +
      "dark:border-gray-900 dark:from-gray-700 dark:to-gray-800 dark:text-gray-400 dark:hover:from-blue-900/40 dark:hover:to-blue-900/20 dark:hover:border-blue-700 " +
      "focus-visible:ring-blue-400",
    idleIcon: "text-blue-500",
  },
} as const;

const ModeButton: React.FC<{
  mode: Mode;
  active: boolean;
  /** Increments on every switch so the one-shot effects replay. */
  switchId: number;
  onSelect: (mode: Mode) => void;
}> = ({ mode, active, switchId, onSelect }) => {
  const { label, sub, Icon, on, off, idleIcon } = MODE_CONFIG[mode];
  const animate = active && switchId > 0;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={label}
      onClick={() => onSelect(mode)}
      className={`${BASE_BTN} ${active ? on : off}`}
    >
      {/* One-shot ripple + shine when this mode becomes active */}
      {animate && (
        <>
          <span
            key={`ripple-${switchId}`}
            aria-hidden
            className="tf-ripple pointer-events-none absolute left-1/2 top-1/2 -ml-12 -mt-12 h-24 w-24 rounded-full bg-white/60"
          />
          <span
            key={`shine-${switchId}`}
            aria-hidden
            className="tf-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          />
        </>
      )}

      <span className="relative flex items-center gap-1.5 text-sm">
        <span
          key={active ? `icon-${switchId}` : "icon-idle"}
          className={`inline-flex ${animate ? "tf-icon-pop" : ""} ${
            active ? "" : idleIcon
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
        {label}
        {active && <Check className="h-4 w-4" strokeWidth={3} />}
      </span>

      <span className="relative flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider opacity-85">
        {active && (
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
        )}
        {active ? `Active · ${sub}` : sub}
      </span>
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const TradeForm: React.FC<TradeFormProps> = ({
  cryptocurrencies,
  selectedCrypto,

}) => {
  const [tradeType, setTradeType] = useState<"buy" | "sell"| "stop">("buy");
  const [amount, setAmount] = useState("");
  const [isTrading, setIsTrading] = useState(false);
  const [selectedPair, setSelectedPair] = useState(`${selectedCrypto.symbol}/USDT`);
  const [tradingMode, setTradingMode] = useState<Mode>("demo");
  const [switchId, setSwitchId] = useState(0); // bumps on every real <-> demo switch
  const [demoBalance, setDemoBalance] = useState<number>(700);
  const [realBalance, setRealBalance] = useState<number>(0);

const [triggerRealSim, setTriggerRealSim] = useState(false); // ✅ add this
const user = useUser(); // ✅ Add this inside the TradeForm component

useEffect(() => {
  let balanceInterval: NodeJS.Timeout;

  const fetchRealBalance = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("fiat_balance")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setRealBalance(data.fiat_balance ?? 0);
    }
  };

  // Initial fetch
  fetchRealBalance();
  // Repeat every 2.5 seconds during trading
  if (isTrading && tradingMode === "real") {
    balanceInterval = setInterval(fetchRealBalance, 2500);
  }

  return () => clearInterval(balanceInterval);
}, [user, isTrading, tradingMode]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const defaultPair = `${selectedCrypto.symbol}/USDT`;
    setSelectedPair(defaultPair);
  }, [selectedCrypto]);

  const baseSymbol = selectedPair.split("/")[0];
  const quoteSymbol = selectedPair.split("/")[1];

  const baseCrypto = cryptocurrencies.find(
    (c) => c.symbol.toUpperCase() === baseSymbol.toUpperCase()
  ) || selectedCrypto;
  const quoteCrypto = cryptocurrencies.find(
    (c) => c.symbol.toUpperCase() === quoteSymbol.toUpperCase()
  );

  const estimatedTokenAmount =
    amount && baseCrypto.currentPrice
      ? parseFloat(amount) / baseCrypto.currentPrice
      : 0;

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        console.log("Imported bot config:", data);
        toast.success("Bot config imported successfully!");
      } catch (err) {
        toast.error("Invalid bot config file.");
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tradeType === "stop") {
      toast.error("Please select Buy or Sell before trading.");
      return;
    }

    const stake = parseFloat(amount);
    if (!amount || isNaN(stake) || stake <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (stake < 18) {
      toast.error("Minimum trade amount is $18.");
      return;
    }

    if (tradingMode === "demo" && stake > demoBalance) {
      toast.error("You cannot trade more than your demo balance.");
      return;
    }
    if (tradingMode === "real" && stake > realBalance) {
  toast.error("You cannot trade more than your balance.");
  return;
}

if (tradingMode === "real") {
  setIsTrading(true);        // ✅ Optional UX improvement
  setTriggerRealSim(true);
  return;
}

    setIsTrading(true);

    // ⚠️ Identify if this is a safe token
    const safeTokens = ["btc", "xrp", "sol"];
    const isSafe = safeTokens.includes(baseSymbol.toLowerCase());

    const fairSteps = [
      0.0009, -0.133, 0.137, 0.193, -0.12, 0.313, -0.08, 0.25,
      -0.13, 0.4, 0.1, -0.05, 0.12, 0.17, -0.1, 0.112
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

    const stopFlag = { value: false };
    window.__stopTrade = () => {
      stopFlag.value = true;
    };

    let firstToastShown = false;

    const runStep = () => {
      if (stopFlag.value || currentStep >= stepsToUse.length) {
        setIsTrading(false);
        setAmount("");

        const message =
          totalChange >= 0
            ? ` Profit: ${formatCurrency(totalChange)}`
            : ` Loss: ${formatCurrency(Math.abs(totalChange))}`;
        toast(`Your trade is complete\n${message}`, {
          style: {
            backgroundColor: "#0f172a",
            color: "#fff",
            whiteSpace: "pre-line",
          },
        });

        return;
      }

      const changePercent = stepsToUse[currentStep];
      const changeAmount = stake * changePercent;
      totalChange += changeAmount;

      if (tradingMode === "demo") {
        setDemoBalance((prev) => {
          const newBalance = prev + changeAmount;

          if (newBalance <= 0) {
            setIsTrading(false);
            setAmount("");
            toast(`Trade Balance Blown!\nLoss: ${formatCurrency(Math.abs(totalChange))}`, {
              style: {
                backgroundColor: "#dc2626",
                color: "#fff",
                fontWeight: "bold",
                whiteSpace: "pre-line",
              },
            });
            return 0;
          }
          

          if (!firstToastShown) {
            firstToastShown = true;
            setTimeout(() => {
              toast(
                `${changePercent >= 0 ? "Gain" : "Loss"}: ${formatCurrency(
                  Math.abs(changeAmount)
                )}`,
                {
                  style: {
                    backgroundColor: changePercent >= 0 ? "#22c55e" : "#ef4444",
                    color: "#fff",
                  },
                }
              );
            }, 7000);
          } else {
            toast(
              `${changePercent >= 0 ? "Gain" : "Loss"}: ${formatCurrency(
                Math.abs(changeAmount)
              )}`,
              {
                style: {
                  backgroundColor: changePercent >= 0 ? "#22c55e" : "#ef4444",
                  color: "#fff",
                },
              }
            );
          }

          return newBalance;
        });
      }

      currentStep++;
      const delay = Math.floor(Math.random() * 4300) + 1000;
      setTimeout(runStep, delay);
    };

    runStep();
  };
  
  
  const handleMaxClick = () => {
  const max = tradingMode === "demo" ? demoBalance : realBalance;
  setAmount(max.toFixed(2));
};


  const handleModeChange = (value: string) => {
  if (value !== "demo" && value !== "real") return;
  if (value === tradingMode) return; // already active, nothing to switch

  if (isTrading) {
    // Stop the ongoing trade
    if (typeof window.__stopTrade === "function") {
      window.__stopTrade();
    }

    toast.warning(
      `Switched to ${value.toUpperCase()} mode. Previous trade has been cancelled.`,
      {
        style: {
          backgroundColor: "#facc15", // yellow
          color: "#000",
          fontWeight: "bold",
        },
      }
    );

    setIsTrading(false);
    setAmount("");
    setTriggerRealSim(false);
  }

  setTradingMode(value);
  setSwitchId((id) => id + 1); // replays the switch animations
};

  const isReal = tradingMode === "real";

  return (
    <div className="space-y-4">
      <ModeAnimationStyles />

      {/* Toggle Mode: two separate buttons */}
      <div
        role="radiogroup"
        aria-label="Trading mode"
        className="grid grid-cols-2 gap-3 px-1 pt-1"
      >
        <ModeButton
          mode="real"
          active={isReal}
          switchId={switchId}
          onSelect={handleModeChange}
        />
        <ModeButton
          mode="demo"
          active={!isReal}
          switchId={switchId}
          onSelect={handleModeChange}
        />
      </div>

      {/* Mode Banner. Re-keyed so it slides in from the side of the chosen button. */}
      <div
        key={tradingMode}
        className={`flex items-center justify-between rounded-md border-l-4 px-3 py-2 text-sm font-bold ${
          isReal
            ? "tf-slide-left border-green-500 bg-green-500/10 text-green-400"
            : "tf-slide-right border-blue-500 bg-blue-500/10 text-blue-400"
        }`}
      >
        <span className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-current" />
          </span>
          Mode: {isReal ? "Live Market Execution" : "Demo Trading"}
        </span>
        <span
          className={`rounded px-2 py-0.5 text-[10px] font-extrabold tracking-widest text-white ${
            isReal ? "bg-green-600" : "bg-blue-600"
          }`}
        >
          {isReal ? "LIVE" : "DEMO"}
        </span>
      </div>

      {/* Live Dashboard */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">Current Price:</span>{" "}
            <span className="font-semibold">{formatCurrency(baseCrypto.currentPrice)}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">24h Change:</span>{" "}
            <span
              className={`font-semibold ${
                baseCrypto.priceChange24h != null
                  ? baseCrypto.priceChange24h >= 0
                    ? "text-green-500"
                    : "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {baseCrypto.priceChange24h != null
                ? `${baseCrypto.priceChange24h.toFixed(2)}%`
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Trade Form */}
      <Card
        className={`relative w-full overflow-hidden border-t-4 transition-colors duration-500 ${
          isReal ? "border-t-green-500" : "border-t-blue-500"
        }`}
      >
        {/* Colour wash that sweeps across the card on every switch */}
        {switchId > 0 && (
          <div
            key={switchId}
            aria-hidden
            className={`tf-wash pointer-events-none absolute inset-0 z-10 ${
              isReal ? "tf-wash-green" : "tf-wash-blue"
            }`}
          />
        )}

        <CardHeader>
          <CardTitle key={tradingMode} className="tf-fade-up mb-1">
            {tradingMode === "real" ? "Place" : "Demo"} Trade - {baseCrypto.name}
          </CardTitle>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Balance:{" "}
            <span className="text-2xl font-bold tabular-nums">
              <AnimatedMoney value={isReal ? realBalance : demoBalance} />
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs
            defaultValue="buy"
            onValueChange={(value) =>
              setTradeType(value as "buy" | "sell" | "stop")
            }
          >
            <TabsList className="grid grid-cols-2 mb-4 gap-2">
  {["buy", "sell"].map((type) => (
    <TabsTrigger
      key={type}
      value={type}
      className={`rounded px-4 py-1 text-sm font-medium border transition-colors duration-500 ${
        tradeType === type
          ? tradingMode === "real"
            ? "bg-green-600 text-white border-green-600"
            : "bg-blue-600 text-white border-blue-600"
          : "border-gray-400 text-gray-600 hover:bg-gray-100"
      }`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </TabsTrigger>
  ))}
</TabsList>


            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Pair Selection */}
                <div>
                  <label className="block text-sm font-medium mb-1">Select Trading Pair</label>
                  <div className="flex items-center gap-2">
                    <Select value={selectedPair} onValueChange={setSelectedPair}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select Trading Pair" />
                      </SelectTrigger>
                      <SelectContent>
                        {cryptocurrencies.map((crypto) => {
                          const pairString = `${crypto.symbol}/USDT`;
                          return (
                            <SelectItem key={pairString} value={pairString}>
                              <div className="flex items-center">
                                <img
                                  src={crypto.image}
                                  alt={crypto.symbol}
                                  className="w-5 h-5 mr-1"
                                />
                                {pairString}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      title="Import bot config"
                    >
                      <Upload className="w-4 h-4" />
                    </button>

                    <input
                      type="file"
                      accept=".json"
                      ref={fileInputRef}
                      onChange={handleImport}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium mb-1">Stake Amount</label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder={`Enter amount in ${quoteSymbol}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 text-xs"
                      onClick={handleMaxClick}
                    >
                      MAX
                    </Button>
                  </div>
                </div>

                {/* Estimate */}
                <div>
                  <label className="block text-sm font-medium mb-1">Estimated Token</label>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <span>approx:</span>
                      <span className="font-medium">
                        {estimatedTokenAmount.toFixed(6)} {baseCrypto.symbol}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className={`w-full text-white transition-colors duration-500 ${
                    tradeType === "stop"
                      ? "bg-gray-800"
                      : tradingMode === "real"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isTrading ? "Trading..." : "Start Trading"}
                </Button>
                {isTrading && (
  <Button
    type="button"
    variant="destructive"
    className="w-full mt-2"
    onClick={() => {
      if (typeof window.__stopTrade === "function") {
        window.__stopTrade();
        toast.info("Your trade has stopped.");
      }
    }}
  >
    Stop Trade
  </Button>
)}

              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
      {triggerRealSim && user && (
  <ActiveMarketTrade
    user={user}
    amount={parseFloat(amount)}
    tradeType={tradeType as "buy" | "sell"}
    baseSymbol={baseSymbol}
    pair={selectedPair}
    onComplete={() => {
      setTriggerRealSim(false);
      setAmount("");
      setIsTrading(false);
    }}
    onFail={() => {
      setTriggerRealSim(false);
      setIsTrading(false);
    }}
  />
)}

    </div>
  );
};

export default TradeForm;
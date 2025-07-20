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
import { Upload } from "lucide-react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"; 
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

const TradeForm: React.FC<TradeFormProps> = ({
  cryptocurrencies,
  selectedCrypto,

}) => {
  const [tradeType, setTradeType] = useState<"buy" | "sell"| "stop">("buy");
  const [amount, setAmount] = useState("");
  const [isTrading, setIsTrading] = useState(false);
  const [selectedPair, setSelectedPair] = useState(`${selectedCrypto.symbol}/USDT`);
  const [tradingMode, setTradingMode] = useState<"demo" | "real">("demo");
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
  if (value === "demo" || value === "real") {
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
  }
};


  return (
    <div className="space-y-4">
      {/* Toggle Mode */}
      <div className="flex items-center justify-between">
        <ToggleGroup
          type="single"
          value={tradingMode}
          onValueChange={handleModeChange}
          className="flex gap-2"
        >
          <ToggleGroupItem
            value="real"
            className={`rounded px-4 py-1 text-sm font-medium border transition-colors duration-200 ${
              tradingMode === "real"
                ? "bg-green-600 text-white border-green-600"
                : "border-green-600 text-green-600 hover:bg-green-100"
            }`}
          >
            Real Account
          </ToggleGroupItem>
          <ToggleGroupItem
            value="demo"
            className={`rounded px-4 py-1 text-sm font-medium border transition-colors duration-200 ${
              tradingMode === "demo"
                ? "bg-blue-600 text-white border-blue-600"
                : "border-blue-600 text-blue-600 hover:bg-blue-100"
            }`}
          >
            Demo Account
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Mode Label */}
      <div
        className={`text-sm font-bold ${
          tradingMode === "real" ? "text-green-400" : "text-blue-400"
        }`}
      >
        Mode: {tradingMode === "real" ? "Live Market Execution" : "Demo Trading"}
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="mb-1">
            {tradingMode === "real" ? "Place" : "Demo"} Trade - {baseCrypto.name}
          </CardTitle>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Balance:{" "}
            <span className="text-2xl font-bold">
              {tradingMode === "real"
  ? formatCurrency(realBalance)
  : formatCurrency(demoBalance)}

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
      className={`rounded px-4 py-1 text-sm font-medium border transition-colors duration-200 ${
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
                  className={`w-full text-white ${
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

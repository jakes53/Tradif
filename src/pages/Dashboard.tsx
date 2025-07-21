import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeftRight, TrendingUp, BarChart2,
  Repeat,
  DollarSign,
  Banknote,
  LineChart, } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { Cryptocurrency } from "@/types/crypto";
import { fetchCryptocurrencies } from "@/services/cryptoApi";
import { toast } from "@/components/ui/use-toast";
import AssetItem from "@/components/AssetItem";
import PriceChart from "@/components/PriceChart";
import CryptoCard from "@/components/CryptoCard";
import Watchlist from "@/components/Watchlist";
import RecentTransactions from "@/components/RecentTransactions";
import { supabase } from "@/lib/supabaseClient";

type PortfolioAsset = {
  cryptoId: string;
  name: string;
  symbol: string;
  image: string;
  amount: number;
  currentPrice: number;
  value: number;
  allocation: number;
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [customUserId, setCustomUserId] = useState<string | null>(null);
  const [balances, setBalances] = useState({
  portfolio: 0,
  fiat: 0,
  btc: 0,
  eth: 0,
  usdt: 0,
  usdc: 0,
  bnb: 0,
  xrp: 0,
  sol: 0,
  trx: 0,
  doge: 0,
  pi: 0,
  steth: 0,
  polygon: 0,
  worldcoin: 0,
});


  const [updatedPortfolio, setUpdatedPortfolio] = useState<{
    totalValue: number;
    assets: PortfolioAsset[];
  }>({
    totalValue: 0,
    assets: [],
  });

  const [updatedCryptos, setUpdatedCryptos] = useState<Cryptocurrency[]>([]);

    const [showBalance, setShowBalance] = useState(() => {
    const saved = localStorage.getItem("showBalance");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("showBalance", JSON.stringify(showBalance));
  }, [showBalance]);

  // ✅ Fetch user portfolio and balances
  useEffect(() => {
    const fetchUserPortfolio = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select(`
  custom_user_id,
  portfolio_balance,
  fiat_balance,
  btc_balance,
  eth_balance,
  usdt_balance,
  usdc_balance,
  bnb_balance,
  xrp_balance,
  solana_balance,
  trx_balance,
  doge_balance,
  pi_balance,
  steth_balance,
  polygon_balance,
  worldcoin_balance
`)

          .eq("id", user.id)
          .single();

        if (data) {
          setCustomUserId(data.custom_user_id);
          setBalances({
  portfolio: data.portfolio_balance || 0,
  fiat: data.fiat_balance || 0,
  btc: data.btc_balance || 0,
  eth: data.eth_balance || 0,
  usdt: data.usdt_balance || 0,
  usdc: data.usdc_balance || 0,
  bnb: data.bnb_balance || 0,
  xrp: data.xrp_balance || 0,
  sol: data.solana_balance || 0,
  trx: data.trx_balance || 0,
  doge: data.doge_balance || 0,
  pi: data.pi_balance || 0,
  steth: data.steth_balance || 0,
  polygon: data.polygon_balance || 0,
  worldcoin: data.worldcoin_balance || 0,
});

        } else if (error) {
          toast({
            title: "Error loading user data",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    };

    fetchUserPortfolio();
  }, []);

  // ✅ Fetch live crypto data
  const { data: cryptoData, isLoading, error } = useQuery({
    queryKey: ["cryptocurrencies"],
    queryFn: fetchCryptocurrencies,
    refetchInterval: 60000,
  });

  // ✅ Select top cryptos
  const topCryptos = cryptoData ? [...cryptoData].slice(0, 4) : [];
  const featuredCrypto = cryptoData && cryptoData.length > 0 ? cryptoData[0] : null;

  // ✅ Update portfolio assets and allocation
  useEffect(() => {
    if (cryptoData && balances) {
      const relevantTokens = ["bitcoin", "ethereum", "tether", "ripple"];
      const tokenMap: Record<string, number> = {
        bitcoin: balances.btc,
        ethereum: balances.eth,
        tether: balances.usdt,
        ripple: balances.xrp,
      };

      const assets = cryptoData
        .filter((crypto) => relevantTokens.includes(crypto.id))
        .map((crypto) => {
          const amount = tokenMap[crypto.id] || 0;
          const value = amount * crypto.currentPrice;
          return {
            cryptoId: crypto.id,
            name: crypto.name,
            symbol: crypto.symbol,
            image: crypto.image,
            amount,
            currentPrice: crypto.currentPrice,
            value,
            allocation: 0, // placeholder for now
          };
        });

      const totalValue = assets.reduce((sum, a) => sum + a.value, 0);

      // Calculate allocation now that we know total
      const assetsWithAllocation = assets.map((asset) => ({
        ...asset,
        allocation: totalValue > 0 ? asset.value / totalValue : 0,
      }));

      setUpdatedPortfolio({
        totalValue,
        assets: assetsWithAllocation,
      });
    }
  }, [cryptoData, balances]);

  // ✅ Live price simulation
  const updatePrices = useCallback(() => {
    if (updatedCryptos.length > 0) {
      const newCryptos = updatedCryptos.map((crypto) => {
        const changePercent = (Math.random() - 0.05) * 0.001;
        const newPrice = crypto.currentPrice * (1 + changePercent);

        return {
          ...crypto,
          currentPrice: newPrice,
          priceChangePercentage24h:
            crypto.priceChangePercentage24h + changePercent * 100,
        };
      });

      setUpdatedCryptos(newCryptos);
    }
  }, [updatedCryptos]);

  useEffect(() => {
    if (cryptoData) {
      setUpdatedCryptos([...cryptoData].slice(0, 4));
    }
  }, [cryptoData]);

  useEffect(() => {
    const interval = setInterval(updatePrices, 4200);
    return () => clearInterval(interval);
  }, [updatePrices]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching cryptocurrency data",
        description: "Please wait for the connection to reestablish.",
        variant: "destructive",
      });
    }
  }, [error]);

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading cryptocurrency data...</div>;
  }

  return (
    <div className="container mx-auto p-4 pb-24 md:pb-6">
      {/* ✅ Display Referral UID */}
      {customUserId && (
  <div className="mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
    <div>
      <p className="text-sm text-gray-500">User ID:</p>
      <p className="text-lg font-semibold text-blue-600">{customUserId}</p>

      {/* ✅ Available Balance Display */}
      <p className="text-sm text-gray-500 mt-2">Available Balance:</p>
      <div className="flex items-center gap-3">
  <p className="text-lg font-semibold text-green-600">
    {showBalance ? formatCurrency(balances.fiat) : "****"}
  </p>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => setShowBalance((prev) => !prev)}
    className="text-sm text-blue-500 hover:underline"
  >
    {showBalance ? "Hide" : "See"}
  </Button>
</div>

    </div>

    <Button
      size="sm"
      variant="secondary"
      onClick={() => {
        navigator.clipboard.writeText(customUserId);
        toast({
          title: "Copied!",
          description: "Your referral UID was copied to clipboard.",
        });
      }}
    >
      Copy UID
    </Button>
  </div>
)}
{/* 🔥 Feature Navigation Buttons with Icons */}
<div className="mb-8">
  <h3 className="text-lg font-semibold mb-4">Explore Our </h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <Button
      variant="outline"
      className="w-full justify-start py-6"
      onClick={() => navigate("/miningpackages")}
    >
      <TrendingUp className="mr-3 h-6 w-6 text-blue-600" />
      Mining Packages
    </Button>
   <Button asChild variant="outline" className="w-full justify-start py-6">
  <Link to="/news" className="flex items-center">
    <BarChart2 className="mr-3 h-6 w-6 text-red-600" />
    News & Insights
  </Link>
</Button>

    <Button asChild variant="outline" className="w-full justify-start py-6">
  <Link to="/strategy" className="flex items-center">
    <Repeat className="mr-3 h-6 w-6 text-purple-600"  />
    Copy Trading
  </Link>
</Button>
    <Button
      variant="outline"
      className="w-full justify-start py-6"
      onClick={() => navigate("/wallet")}
    >
      <DollarSign className="mr-3 h-6 w-6 text-green-600" />
      Withdrawals
    </Button>
    <Button
      variant="outline"
      className="w-full justify-start py-6"
      onClick={() => navigate("/wallet")}
    >
      <Banknote className="mr-3 h-6 w-6 text-emerald-500" />
     Deposits
    </Button>
    <Button
      variant="outline"
      className="w-full justify-start py-6"
      onClick={() => navigate("/levelpackages")}
    >
      <LineChart className="mr-3 h-6 w-6 text-indigo-500" />
      Account Level Packages
    </Button>
    <Button
  variant="outline"
  className="w-full justify-start py-6 mt-2"
  onClick={() => navigate("/market")}
>
  <ArrowLeftRight className="mr-3 h-6 w-6 text-green-500" />
  Send & Receive Crypto
</Button>
<button
      onClick={() => navigate("/margin-trading")}
      className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
    >
      Margin Trading
    </button>
  </div>
</div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <TrendingUp className="mr-2" size={20} /> Portfolio Overview
            </CardTitle>
            <CardDescription>Your current portfolio balance and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-1">
  <h3 className="text-3xl font-bold">
    {showBalance
      ? formatCurrency(updatedPortfolio.totalValue + balances.portfolio)
      : "****"}
  </h3>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => setShowBalance((prev) => !prev)}
    className="text-sm text-blue-500 hover:underline"
  >
    {showBalance ? "Hide" : "See"}
  </Button>
</div>

              <p className="text-sm text-crypto-green">+2.4% (24h)</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Your Assets</h4>
              <div className="space-y-2">
                {updatedPortfolio.assets.map((asset) => (
                  <AssetItem
                    key={asset.cryptoId}
                    asset={asset}
                    updatedPrice={asset.currentPrice}
                  />
                ))}
              </div>
              <Button variant="outline" className="w-full" onClick={() => navigate("/wallet")}>
                View All Assets <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
  <CardHeader className="pb-2">
    <CardTitle className="text-xl">Recent Transactions</CardTitle>
    <CardDescription>Your latest cryptocurrency transactions</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
      <RecentTransactions />
    </div>
  </CardContent>
</Card>


      </div>

      {featuredCrypto && (
        <div className="mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{featuredCrypto.name} Price Chart</CardTitle>
              <CardDescription>Live market chart with trade price updates</CardDescription>
            </CardHeader>
            <CardContent>
              <PriceChart
                cryptoName={featuredCrypto.name}
                cryptoSymbol={featuredCrypto.symbol}
                basePrice={
                  updatedCryptos.find((c) => c.id === featuredCrypto.id)?.currentPrice ||
                  featuredCrypto.currentPrice
                }
              />
            </CardContent>
          </Card>
        </div>
      )}
<Watchlist />
      <div>
        <h3 className="text-lg font-semibold mb-4">Top Cryptocurrencies</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {updatedCryptos.map((crypto) => (
            <CryptoCard key={crypto.id} crypto={crypto} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
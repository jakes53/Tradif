import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, ArrowUpRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import UserCashTransactions from "@/components/UserCashTransactions";
import RecentWithdrawActivity from "@/components/RecentWithdrawActivity";
import { supabase } from "@/lib/supabaseClient";
import { formatCurrency } from "@/utils/formatters";
import axios from "axios";
import DepositWithdrawModal from "@/components/DepositWithdrawModal";

interface TokenData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
}

interface PortfolioItem {
  id: string;
  name: string;
  symbol: string;
  image: string;
  amount: number;
  value: number;
  allocation: number;
}

const tokenMap = [
  { id: "bitcoin", key: "btc_balance" },
  { id: "ethereum", key: "eth_balance" },
  { id: "tether", key: "usdt_balance" },
  { id: "ripple", key: "xrp_balance" },
  { id: "binancecoin", key: "bnb_balance" },
  { id: "usd-coin", key: "usdc_balance" },
  { id: "solana", key: "solana_balance" },
  { id: "tron", key: "trx_balance" },
  { id: "dogecoin", key: "doge_balance" },
  { id: "pi-network", key: "pi_balance" },
  { id: "staked-ether", key: "steth_balance" },
  { id: "matic-network", key: "polygon_balance" },
  { id: "worldcoin-wld", key: "worldcoin_balance" },
];

const WalletView = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"Deposit" | "Withdraw">("Deposit");
  const [loadingType, setLoadingType] = useState<"Deposit" | "Withdraw" | null>(null);


  const openModal = (type: "Deposit" | "Withdraw") => {
  setLoadingType(type);
  setModalType(type);

  // Simulate processing delay or modal prep
  setTimeout(() => {
    setIsModalOpen(true);
    setLoadingType(null);
  }, 2600);
};
  useEffect(() => {
    const fetchWalletData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const tokenKeys = tokenMap.map((t) => t.key).join(", ");
      const { data, error } = await supabase
        .from("profiles")
        .select(`fiat_balance, ${tokenKeys}`)
        .eq("id", user.id)
        .single();

      if (error || !data) return;

      const fiatBalance = data.fiat_balance || 0;

      const ids = encodeURIComponent(tokenMap.map((t) => t.id).join(","));
      const coingeckoRes = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`
      );

      const coinData: TokenData[] = coingeckoRes.data;

      const builtPortfolio = coinData.map((coin) => {
        const tokenMeta = tokenMap.find((t) => t.id === coin.id);
        const amount = data[tokenMeta!.key] || 0;
        const value = amount * coin.current_price;
        return {
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          image: coin.image,
          amount,
          value,
          allocation: 0,
        };
      });

      const cryptoTotal = builtPortfolio.reduce((sum, item) => sum + item.value, 0);
      const fullTotal = cryptoTotal + fiatBalance;

      const finalizedPortfolio = builtPortfolio.map((item) => ({
        ...item,
        allocation: fullTotal > 0 ? (item.value / fullTotal) * 100 : 0,
      }));

      setPortfolio(finalizedPortfolio);
      setTotalBalance(fullTotal);
    };

    fetchWalletData();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-end gap-4">
        <Button
  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
  onClick={() => openModal("Deposit")}
  disabled={loadingType !== null}
>
  {loadingType === "Deposit" ? (
    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  ) : (
    <ArrowDownCircle className="w-4 h-4" />
  )}
  Deposit
</Button>

<Button
  className="bg-gray-700 hover:bg-gray-800 text-white flex items-center gap-2"
  onClick={() => openModal("Withdraw")}
  disabled={loadingType !== null}
>
  {loadingType === "Withdraw" ? (
    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  ) : (
    <ArrowUpRight className="w-4 h-4" />
  )}
  Withdraw
</Button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Balance</CardTitle>
            <CardDescription>+2.4% (24h)</CardDescription>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-bold">{formatCurrency(totalBalance)}</h2>
          </CardContent>
        </Card>

        <Card>
  <CardHeader>
    <CardTitle>Recent Activity</CardTitle>
    <CardDescription>Your latest withdrawal</CardDescription>
  </CardHeader>
  <CardContent>
    <RecentWithdrawActivity />
  </CardContent>
</Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performer</CardTitle>
          </CardHeader>
          <CardContent>
            {portfolio.length > 0 ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={portfolio[0].image} alt="" className="w-8 h-8" />
                  <span>{portfolio[0].name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(portfolio[0].value)}</p>
                  <p className="text-sm text-muted-foreground">
                    {portfolio[0].amount.toFixed(4)} {portfolio[0].symbol.toUpperCase()}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Loading...</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
            <CardDescription>Your cryptocurrency holdings and allocation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {portfolio.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.symbol} className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.amount.toFixed(4)} {item.symbol.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(item.value)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
            <CardDescription>Distribution of your assets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {portfolio.map((item, index) => {
              const colors = [
                "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#14b8a6",
                "#eab308", "#8b5cf6", "#ec4899", "#f97316", "#0ea5e9", "#22c55e", "#a855f7"
              ];
              const color = colors[index % colors.length];

              return (
                <div key={item.id}>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span>{item.allocation.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 rounded bg-gray-200 overflow-hidden">
                    <div
                      className="h-full rounded"
                      style={{
                        width: `${item.allocation}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
  <CardHeader>
    <CardTitle>Transaction History</CardTitle>
    <CardDescription>Your recent deposits and withdrawals</CardDescription>
  </CardHeader>
  <CardContent>
    <UserCashTransactions />
  </CardContent>
</Card>

      <DepositWithdrawModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
      />
    </div>
  );
};

export default WalletView;

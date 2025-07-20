// src/components/Watchlist.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import clsx from "clsx";

const tokenIds = [
  "cardano",
  "ethereum",
  "solana",
  "tether",
  "avalanche-2",
  "sui",
  "stellar",
  "bitcoin-cash",
  "hyperliquid",
  "usd-coin",
  "optimism",
  "fdusd",
  "tron",
];

const fetchWatchlist = async () => {
  const ids = tokenIds.join(",");
  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/coins/markets`,
    {
      params: {
        vs_currency: "usd",
        ids,
        order: "market_cap_desc",
        per_page: 13,
        page: 1,
        sparkline: false,
        price_change_percentage: "24h",
      },
    }
  );
  return data;
};

const Watchlist = () => {
  const { data: coins, isLoading, error } = useQuery({
    queryKey: ["watchlist"],
    queryFn: fetchWatchlist,
    refetchInterval: 60000, // 60s
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading watchlist.</p>;

  return (
    <div className="bg-white dark:bg-[#121212] p-4 rounded-xl shadow-md border dark:border-[#2a2a2a]">

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Watchlist</h2>
        <a href="/market" className="text-green-500 text-sm font-medium">
          Go to Market &rarr;
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {coins.map((coin) => {
          const isPositive = coin.price_change_percentage_24h >= 0;
          return (
            <div
              key={coin.id}
              className={clsx(
  "rounded-lg p-3 border text-sm transition-colors",
  isPositive
    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-600"
    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-600"
)}

            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold uppercase">{coin.symbol}</span>
                <span
                  className={clsx(
                    "flex items-center gap-1 text-xs font-medium",
                    isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {isPositive ? (
                    <>
                      <ArrowUpRight className="w-3 h-3" />
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="w-3 h-3" />
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-gray-500 uppercase">{coin.name}</p>
              <p className="text-base font-bold mt-1">
                ${coin.current_price.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Watchlist;

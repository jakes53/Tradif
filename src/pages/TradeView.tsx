import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PriceChart from "@/components/PriceChart";
import LiveOrderBook from "@/components/LiveOrderBook";
import TradeForm from "@/components/TradeForm";
import RecentTrades from "@/components/trade/RecentTrades";
import MarketTable from "@/components/MarketTable";
import  BotLogPanel  from "@/components/BotLogPanel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
    
import { Cryptocurrency } from "@/types/crypto";
import { formatLargeNumber } from "@/utils/formatters";
import { fetchCryptocurrencies } from "@/services/cryptoApi";
import { mockCryptocurrencies } from "@/data/mockData";

const TradeView = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cryptoParam = searchParams.get("crypto");

  const { data: cryptocurrencies = mockCryptocurrencies, isLoading, isError } = useQuery({
    queryKey: ["cryptocurrencies"],
    queryFn: fetchCryptocurrencies,
    refetchInterval: 60000,
    initialData: mockCryptocurrencies,
  });

  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency>(
    cryptocurrencies.find((c) => c.id === cryptoParam) || cryptocurrencies[0]
  );

  const [liveCryptos, setLiveCryptos] = useState([...cryptocurrencies]);

  useEffect(() => {
    if (cryptocurrencies) {
      setLiveCryptos([...cryptocurrencies]);
      const match = cryptoParam
        ? cryptocurrencies.find((c) => c.id === cryptoParam)
        : cryptocurrencies[0];
      setSelectedCrypto(match || cryptocurrencies[0]);
    }
  }, [cryptocurrencies, cryptoParam]);

  useEffect(() => {
    if (cryptoParam && liveCryptos) {
      const found = liveCryptos.find((c) => c.id === cryptoParam);
      if (found) setSelectedCrypto(found);
    }
  }, [cryptoParam, liveCryptos]);

  const updatePrices = () => {
    const newCryptos = liveCryptos.map((crypto) => {
      const changePercent = (Math.random() - 0.005) * 0.002;
      const newPrice = crypto.currentPrice * (1 + changePercent);

      return {
        ...crypto,
        currentPrice: newPrice,
        priceChangePercentage24h:
          crypto.priceChangePercentage24h + changePercent * 100,
      };
    });

    setLiveCryptos(newCryptos);
  };

  useEffect(() => {
    const interval = setInterval(updatePrices, 2270);
    return () => clearInterval(interval);
  }, [liveCryptos]);

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading cryptocurrency data...</div>;
  }

  if (isError) {
    console.error("Error loading cryptocurrency data.Please wait.");
  }

  return (
    <div className="container mx-auto p-4 pb-24 md:pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <PriceChart
            cryptoName={selectedCrypto.name}
            cryptoSymbol={selectedCrypto.symbol}
            basePrice={selectedCrypto.currentPrice}
            priceChangePercent={selectedCrypto.priceChangePercentage24h}
          />
<LiveOrderBook />

          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle>Market Data</CardTitle>
              <CardDescription>
                Detailed market information for {selectedCrypto.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Market Cap</p>
                  <p className="font-semibold">
                    {formatLargeNumber(selectedCrypto.marketCap)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Volume (24h)</p>
                  <p className="font-semibold">
                    {formatLargeNumber(selectedCrypto.volume24h)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Circulating Supply</p>
                  <p className="font-semibold">∞ {selectedCrypto.symbol}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">24h Change</p>
                  <p
                    className={`font-semibold ${
                      selectedCrypto.priceChangePercentage24h >= 0
                        ? "text-crypto-green"
                        : "text-crypto-red"
                    }`}
                  >
                    {selectedCrypto.priceChangePercentage24h.toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Trade Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <TradeForm
                cryptocurrencies={liveCryptos}
                selectedCrypto={selectedCrypto}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mb-4">
        <BotLogPanel />

        <RecentTrades />
        <div className="text-right mt-2">
          <Link
            to="/performance"
            className="text-sm text-blue-600 hover:underline font-medium"
          >
             View Full Metrics →
          </Link>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Featured Tokens</CardTitle>
          <CardDescription>Live market data</CardDescription>
        </CardHeader>
        <CardContent>
          <MarketTable cryptocurrencies={liveCryptos} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TradeView;

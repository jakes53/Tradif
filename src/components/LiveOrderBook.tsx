import React, { useEffect, useState } from "react";

const generateOrderBook = (price) => {
  const asks = [];
  const bids = [];

  for (let i = 0; i < 10; i++) {
    const askPrice = parseFloat((price + Math.random() * 10 + i * 0.5).toFixed(2));
    const bidPrice = parseFloat((price - Math.random() * 10 - i * 0.5).toFixed(2));
    const amount = parseFloat((Math.random() * 0.5).toFixed(4));

    asks.push({
      price: askPrice,
      amount,
      total: parseFloat((askPrice * amount).toFixed(4)),
    });

    bids.push({
      price: bidPrice,
      amount,
      total: parseFloat((bidPrice * amount).toFixed(4)),
    });
  }

  return { asks, bids };
};

const LiveOrderBook = () => {
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);
  const [spread, setSpread] = useState("0.00");
  const [viewMode, setViewMode] = useState("detailed");

  useEffect(() => {
    const fetchAndSimulateOrderBook = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
        );
        const data = await res.json();
        const price = data?.bitcoin?.usd || 108210;

        const { asks, bids } = generateOrderBook(price);
        setAsks(asks);
        setBids(bids);

        const lowestAsk = asks[0]?.price;
        const highestBid = bids[0]?.price;
        if (lowestAsk && highestBid) {
          setSpread((lowestAsk - highestBid).toFixed(2));
        }
      } catch (err) {
        console.error("Error fetching BTC price:", err);
      }
    };

    fetchAndSimulateOrderBook();
    const interval = setInterval(fetchAndSimulateOrderBook, 4000);
    return () => clearInterval(interval);
  }, []);

  const renderRows = (orders, color, isAsk) => {
    const maxAmount = orders.length ? Math.max(...orders.map((o) => o.amount)) : 1;

    return orders.map((order, i) => {
      const barWidth = `${(order.amount / maxAmount) * 100}%`;
      const barColor = isAsk ? "bg-red-900" : "bg-green-900";
      const textColor = isAsk ? "text-red-400" : "text-green-400";

      return (
        <div
          key={i}
          className={`relative grid grid-cols-3 ${textColor} font-mono ${
            viewMode === "compact" ? "text-[10px] py-[2px]" : "text-[12px] md:text-xs py-1"
          } px-1 rounded overflow-hidden`}
        >
          {viewMode === "detailed" && (
            <div
              className={`absolute left-0 top-0 h-full ${barColor} opacity-20`}
              style={{ width: barWidth }}
            />
          )}
          <span className="z-10 truncate">{order.price.toFixed(2)}</span>
          <span className="z-10 truncate">{order.amount}</span>
          <span className="z-10 truncate">{order.total}</span>
        </div>
      );
    });
  };

  return (
    <div className="mt-6 bg-[#0f172a] border border-slate-800 rounded-2xl shadow-md p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-base md:text-lg font-semibold text-white">Order Book BTCUSDT</h2>
        <button
          className="text-xs text-orange-400 hover:underline"
          onClick={() =>
            setViewMode(viewMode === "compact" ? "detailed" : "compact")
          }
        >
          {viewMode === "compact" ? "Switch to Detailed" : "Switch to Compact"}
        </button>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-4 text-sm overflow-x-auto">
        {/* Asks */}
        <div>
          <div className="grid grid-cols-3 text-slate-400 font-medium pb-2 border-b border-slate-700 text-[11px] md:text-xs">
            <span>Price</span>
            <span>Amount</span>
            <span>Total</span>
          </div>
          <div className="mt-2 space-y-1">
            {renderRows(asks, "red", true)}
          </div>
        </div>

        {/* Bids */}
        <div>
          <div className="grid grid-cols-3 text-slate-400 font-medium pb-2 border-b border-slate-700 text-[11px] md:text-xs">
            <span>Price</span>
            <span>Amount</span>
            <span>Total</span>
          </div>
          <div className="mt-2 space-y-1">
            {renderRows(bids, "green", false)}
          </div>
        </div>
      </div>

      {/* Spread info */}
      <div className="text-center mt-4 text-[11px] md:text-xs text-slate-400">
        Spread: <span className="font-semibold text-white">{spread} USD</span>
      </div>
    </div>
  );
};

export default LiveOrderBook;

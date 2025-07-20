import React, { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

interface Trade {
  id: number;
  currency_pair: string;
  amount: number;
  trade_type: string;
  gain_loss: number;
  created_at: string;
}

const PAGE_SIZE = 10;

const RecentTrades: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [lastTimestamp, setLastTimestamp] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchTrades = useCallback(async () => {
    if (!user || loading || !hasMore) return;

    setLoading(true);

    let query = supabase
      .from("recent_trades")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE);

    if (lastTimestamp) {
      query = query.lt("created_at", lastTimestamp); // paginate using timestamp
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    if (data.length < PAGE_SIZE) {
      setHasMore(false);
    }

    if (data.length > 0) {
      setTrades((prev) => [...prev, ...data]);
      setLastTimestamp(data[data.length - 1].created_at); // update cursor
    }

    setLoading(false);
  }, [user, lastTimestamp, hasMore, loading]);

  useEffect(() => {
    if (user) {
      fetchTrades();
    }
  }, [user, fetchTrades]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchTrades();
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );

    const ref = loaderRef.current;
    if (ref) observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [fetchTrades]);

  if (!user) return null;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Recent Real Trades</h2>
      <div className="bg-white dark:bg-gray-800 rounded-md shadow overflow-hidden">
        <div className="overflow-y-auto max-h-[70vh]">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 sticky top-0 z-10">
              <tr>
                <th className="p-3">Pair</th>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">P/L</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {trades.map((trade) => (
                <tr key={trade.id}>
                  <td className="p-3">{trade.currency_pair}</td>
                  <td className="p-3 capitalize">{trade.trade_type}</td>
                  <td className="p-3">${trade.amount.toFixed(2)}</td>
                  <td
                    className={`p-3 font-semibold ${
                      trade.gain_loss >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {trade.gain_loss >= 0 ? "+" : "-"}$
                    {Math.abs(trade.gain_loss).toFixed(2)}
                  </td>
                  <td className="p-3 text-gray-500 text-xs">
                    {new Date(trade.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {trades.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 p-3">
                    No recent trades.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div ref={loaderRef} className="p-4 text-center text-gray-400">
            {loading
              ? "Loading more..."
              : hasMore
              ? "Scroll to load more"
              : "No more trades."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTrades;

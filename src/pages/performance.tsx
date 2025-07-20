import React, { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PerformanceMetrics = () => {
  const user = useUser();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("recent_trades")
        .select("*")
        .eq("user_id", user.id);

      if (!error && data) {
        setTrades(data);
      }
      setLoading(false);
    };

    fetchTrades();
  }, [user]);

  const groupedByPair = trades.reduce((acc: any, trade: any) => {
    const pair = trade.currency_pair;
    acc[pair] = acc[pair] || [];
    acc[pair].push(trade);
    return acc;
  }, {});

  const totalPNL = trades.reduce((acc, trade) => acc + trade.gain_loss, 0);
  const totalProfit = trades.filter(t => t.gain_loss > 0).reduce((acc, t) => acc + t.gain_loss, 0);
  const totalLoss = trades.filter(t => t.gain_loss < 0).reduce((acc, t) => acc + Math.abs(t.gain_loss), 0);

  const pieData = {
    labels: ["Profit", "Loss"],
    datasets: [
      {
        data: [totalProfit, totalLoss],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  const barData = {
    labels: Object.keys(groupedByPair),
    datasets: [
      {
        label: "Cumulative PnL per Pair",
        data: Object.keys(groupedByPair).map(pair =>
          groupedByPair[pair].reduce((sum, t) => sum + t.gain_loss, 0)
        ),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Cumulative PnL</p>
            <p className="text-2xl font-bold ${totalPNL >= 0 ? 'text-green-500' : 'text-red-500'}">
              ${totalPNL.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Profit</p>
            <p className="text-xl font-semibold text-green-500">
              ${totalProfit.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Loss</p>
            <p className="text-xl font-semibold text-red-500">
              ${totalLoss.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PnL by Trading Pair</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={barData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profit vs Loss</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Pie data={pieData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;

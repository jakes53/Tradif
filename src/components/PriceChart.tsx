import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ComposedChart,
  Bar,
  BarChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartLine,
  BarChart3,
  CandlestickChart as ChartCandlestick,
} from "lucide-react";

type CoinCandle = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  index: number;
};

const fetchOHLCData = async (
  coinId: string,
  days: number
): Promise<CoinCandle[]> => {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`
  );
  if (!res.ok) throw new Error("Failed to fetch OHLC data");

  const data = await res.json();
  return data.map(
    ([timestamp, open, high, low, close]: number[], index: number) => {
      const date = new Date(timestamp).toISOString().split("T")[0];
      return { date, open, high, low, close, index };
    }
  );
};

const CustomLineTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-crypto-bg-card p-3 border border-muted/40 rounded-md shadow-md">
        <p className="text-sm text-white/90">Price: ${payload[0].value.toFixed(2)}</p>
        <p className="text-xs text-white/70">{payload[0].payload.date}</p>
      </div>
    );
  }
  return null;
};

const CustomCandleTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-crypto-bg-card p-3 border border-muted/40 rounded-md shadow-md">
        <p className="text-xs text-white/70">{data.date}</p>
        <p className="text-sm text-white/90">Open: ${data.open.toFixed(2)}</p>
        <p className="text-sm text-white/90">Close: ${data.close.toFixed(2)}</p>
        <p className="text-sm text-white/90">High: ${data.high.toFixed(2)}</p>
        <p className="text-sm text-white/90">Low: ${data.low.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const timeframeOptions = ["1D", "1W", "1M"];

const CandlestickChart: React.FC = () => {
  const [chartData, setChartData] = useState<CoinCandle[]>([]);
  const [timeframe, setTimeframe] = useState("1M");
  const [chartType, setChartType] = useState<"line" | "candle" | "bar">("candle");

  useEffect(() => {
    const loadOHLC = async () => {
      const daysMap: Record<string, number> = {
        "1D": 1,
        "1W": 7,
        "1M": 30,
      };
      try {
        const days = daysMap[timeframe] || 30;
        const data = await fetchOHLCData("bitcoin", days);
        setChartData(data);
      } catch (error) {
        console.error("Error fetching OHLC data", error);
      }
    };
    loadOHLC();
  }, [timeframe]);

  const renderChart = () => {
  switch (chartType) {
    case "line":
      return (
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            stroke="#8E9196"
            tick={{ fill: "#8E9196", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[
              (dataMin) => dataMin - 900,
              (dataMax) => dataMax + 400,
            ]}
            orientation="right"
            tick={{ fill: "#8E9196", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomLineTooltip />} />
          <CartesianGrid strokeDasharray="3 3" stroke="#333845" />
          <Area
            type="monotone"
            dataKey="close"
            stroke="#8B5CF6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      );

    case "candle":
  return (
    <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
      <XAxis 
        dataKey="date" 
        stroke="#8E9196" 
        tick={{ fill: "#8E9196", fontSize:11 }}
        tickLine={false}
        axisLine={false}
      />
      <YAxis 
        domain={['dataMin - 1000', 'dataMax + 1000']}
        orientation="right"
        tick={{ fill: "#8E9196", fontSize: 11 }}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => `$${value.toLocaleString()}`}
      />
      <Tooltip content={<CustomCandleTooltip />} />
      <CartesianGrid strokeDasharray="3 3" stroke="#333845" opacity={0.15} />

      {/* Render only wicks (high-low) */}
      <Bar
        dataKey="high" // Dummy key
        shape={({ x, y, width, height, payload }) => {
          const candleX = x + width / 2;
          const scaleY = (val: number) => {
            const domain = [
              Math.min(...chartData.map(d => d.low)),
              Math.max(...chartData.map(d => d.high)),
            ];
            const range = [400, 0]; // height of the chart container
            const scale = (val - domain[0]) / (domain[1] - domain[0]);
            return range[0] + (range[1] - range[0]) * scale;
          };

          const yHigh = scaleY(payload.high);
          const yLow = scaleY(payload.low);
          const color = payload.close > payload.open ? "#22c55e" : "#ea384c";

          return (
            <line
              x1={candleX}
              x2={candleX}
              y1={yHigh}
              y2={yLow}
              stroke={color}
              strokeWidth={3}
            />
          );
        }}
        barSize={4}
      />
    </ComposedChart>
  );


    case "bar":
      return (
        <BarChart data={chartData}>
          <XAxis
            dataKey="date"
            stroke="#8E9196"
            tick={{ fill: "#8E9196", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[
              (dataMin) => dataMin - 1000,
              (dataMax) => dataMax + 1000,
            ]}
            orientation="right"
            tick={{ fill: "#8E9196", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomLineTooltip />} />
          <CartesianGrid strokeDasharray="3 3" stroke="#333845" opacity={0.15} />
          <Bar dataKey="close" fill="#8B5CF6" barSize={16} radius={[4, 4, 0, 0]} />
        </BarChart>
      );

    default:
      return null;
  }
};


  return (
    <Card className="bg-crypto-bg-card p-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg text-white/90">Bitcoin (BTCUSDT)</CardTitle>
        <div className="flex space-x-2">
          <Button
            size="icon"
            variant={chartType === "line" ? "default" : "ghost"}
            onClick={() => setChartType("line")}
          >
            <ChartLine className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={chartType === "candle" ? "default" : "ghost"}
            onClick={() => setChartType("candle")}
          >
            <ChartCandlestick className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={chartType === "bar" ? "default" : "ghost"}
            onClick={() => setChartType("bar")}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[500px] overflow-x-auto">
  <div className="w-[450%] md:w-full h-full">
    <ResponsiveContainer width="100%" height="100%">
      {renderChart()}
    </ResponsiveContainer>
  </div>
</CardContent>


      <div className="flex justify-center space-x-2 mt-2">
        {timeframeOptions.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={timeframe === option ? "default" : "ghost"}
            onClick={() => setTimeframe(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default CandlestickChart;

import { useEffect, useMemo, useState, type CSSProperties } from "react";
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
  Cell,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartLine,
  BarChart3,
  CandlestickChart as ChartCandlestick,
  Loader2,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Types & constants                                                          */
/* -------------------------------------------------------------------------- */

type Candle = {
  ts: number;
  open: number;
  high: number;
  low: number;
  close: number;
  /** [low, high]: lets recharts size each candle's full wick-to-wick span. */
  range: [number, number];
  up: boolean;
};

type ChartType = "line" | "candle" | "bar";

interface CandlestickChartProps {
  /** CoinGecko coin id, e.g. "bitcoin", "ethereum". */
  coinId?: string;
  title?: string;
}

const UP = "#22c55e";
const DOWN = "#ea384c";
const ACCENT = "#8B5CF6";
const AXIS = "#8E9196";
const GRID = "#333845";

// CoinGecko picks candle size from `days`: 1 -> 30 min, 2-30 -> 4 h, 31+ -> 4 days.
const TIMEFRAMES = [
  { label: "1D", days: 1 },
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
];

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */

const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { at: number; data: Candle[] }>();

async function fetchOHLC(
  coinId: string,
  days: number,
  signal: AbortSignal
): Promise<Candle[]> {
  const key = `${coinId}:${days}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.data;

  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`,
    { signal }
  );
  if (res.status === 429) {
    throw new Error("Rate limit reached. Please wait a minute and retry.");
  }
  if (!res.ok) throw new Error("Failed to load chart data.");

  const raw: number[][] = await res.json();
  const data: Candle[] = raw.map(([ts, open, high, low, close]) => ({
    ts,
    open,
    high,
    low,
    close,
    range: [low, high],
    up: close >= open,
  }));

  cache.set(key, { at: Date.now(), data });
  return data;
}

/* -------------------------------------------------------------------------- */
/* Formatting                                                                 */
/* -------------------------------------------------------------------------- */

const formatPrice = (v: number) => {
  if (v >= 1000) return v.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (v >= 1) return v.toFixed(2);
  return v.toFixed(4);
};

const formatTick = (ts: number, days: number) => {
  const d = new Date(ts);
  if (days <= 1) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (days <= 7) {
    return d.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
};

const formatFull = (ts: number) =>
  new Date(ts).toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/* -------------------------------------------------------------------------- */
/* Custom pieces                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Draws one full candle. The <Bar> spans low -> high, so `y`/`height` give the
 * wick's pixel extent and open/close are mapped proportionally inside it.
 */
const CandleShape = (props: any) => {
  const { x, y, width, height, payload } = props;
  if (!payload || x == null || y == null) return null;

  const { open, close, high, low, up } = payload as Candle;
  const color = up ? UP : DOWN;

  const top = Math.min(y, y + height);
  const h = Math.abs(height);
  const span = high - low;
  const toY = (v: number) => (span === 0 ? top : top + ((high - v) / span) * h);

  const cx = x + width / 2;
  const bodyTop = toY(Math.max(open, close));
  const bodyBottom = toY(Math.min(open, close));
  const bodyH = Math.max(bodyBottom - bodyTop, 1); // doji stays visible
  const bodyW = Math.max(Math.min(width * 0.75, 16), 2);

  return (
    <g>
      <line
        x1={cx}
        x2={cx}
        y1={top}
        y2={top + h}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <rect
        x={cx - bodyW / 2}
        y={bodyTop}
        width={bodyW}
        height={bodyH}
        fill={color}
        stroke={color}
        rx={1}
      />
    </g>
  );
};

const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const c = payload[0].payload as Candle;
  const change = c.close - c.open;
  const pct = c.open ? (change / c.open) * 100 : 0;
  const color = c.up ? "text-crypto-green" : "text-crypto-red";

  const Row = ({ label, value }: { label: string; value: number }) => (
    <div className="flex justify-between gap-6 text-xs">
      <span className="text-white/60">{label}</span>
      <span className="tabular-nums text-white/90">${formatPrice(value)}</span>
    </div>
  );

  return (
    <div className="min-w-[170px] rounded-md border border-muted/40 bg-crypto-bg-card p-3 shadow-md">
      <p className="mb-2 text-xs text-white/70">{formatFull(c.ts)}</p>
      <div className="space-y-0.5">
        <Row label="Open" value={c.open} />
        <Row label="High" value={c.high} />
        <Row label="Low" value={c.low} />
        <Row label="Close" value={c.close} />
      </div>
      <p className={`mt-2 text-xs font-medium tabular-nums ${color}`}>
        {change >= 0 ? "+" : ""}
        {formatPrice(Math.abs(change)).replace(/^/, change < 0 ? "-" : "")} (
        {pct >= 0 ? "+" : ""}
        {pct.toFixed(2)}%)
      </p>
    </div>
  );
};

const Stat = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) => (
  <div>
    <p className="text-[11px] text-white/50">{label}</p>
    <p className={`text-sm font-medium tabular-nums text-white/90 ${className}`}>
      {value}
    </p>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const CandlestickChart = ({
  coinId = "bitcoin",
  title = "Bitcoin (BTCUSDT)",
}: CandlestickChartProps) => {
  const [data, setData] = useState<Candle[]>([]);
  const [timeframe, setTimeframe] = useState("1M");
  const [chartType, setChartType] = useState<ChartType>("candle");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const days = TIMEFRAMES.find((t) => t.label === timeframe)?.days ?? 30;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchOHLC(coinId, days, controller.signal)
      .then((d) => {
        if (!controller.signal.aborted) setData(d);
      })
      .catch((e: any) => {
        if (controller.signal.aborted || e?.name === "AbortError") return;
        setError(e?.message || "Failed to load chart data.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [coinId, days, reloadKey]);

  // Header stats for the visible period
  const stats = useMemo(() => {
    if (!data.length) return null;
    const first = data[0];
    const last = data[data.length - 1];
    const change = last.close - first.open;
    return {
      last: last.close,
      change,
      pct: first.open ? (change / first.open) * 100 : 0,
      high: Math.max(...data.map((d) => d.high)),
      low: Math.min(...data.map((d) => d.low)),
    };
  }, [data]);

  // Y domain tuned to what is actually drawn, with a little breathing room
  const domain = useMemo<[number, number]>(() => {
    if (!data.length) return [0, 1];
    const lo =
      chartType === "candle"
        ? Math.min(...data.map((d) => d.low))
        : Math.min(...data.map((d) => d.close));
    const hi =
      chartType === "candle"
        ? Math.max(...data.map((d) => d.high))
        : Math.max(...data.map((d) => d.close));
    const pad = (hi - lo) * 0.08 || hi * 0.01;
    return [lo - pad, hi + pad];
  }, [data, chartType]);

  const lastClose = data.length ? data[data.length - 1].close : undefined;
  const lastUp = stats ? stats.change >= 0 : true;

  const xAxis = (
    <XAxis
      dataKey="ts"
      stroke={AXIS}
      tick={{ fill: AXIS, fontSize: 11 }}
      tickLine={false}
      axisLine={false}
      minTickGap={48}
      tickFormatter={(ts: number) => formatTick(ts, days)}
    />
  );

  const yAxis = (
    <YAxis
      domain={domain}
      allowDataOverflow
      orientation="right"
      width={64}
      tick={{ fill: AXIS, fontSize: 11 }}
      tickLine={false}
      axisLine={false}
      tickFormatter={(v: number) => `$${formatPrice(v)}`}
    />
  );

  const grid = (
    <CartesianGrid strokeDasharray="3 3" stroke={GRID} opacity={0.25} vertical={false} />
  );

  const lastPriceLine =
    lastClose !== undefined ? (
      <ReferenceLine
        y={lastClose}
        stroke={lastUp ? UP : DOWN}
        strokeDasharray="4 4"
        strokeOpacity={0.6}
      />
    ) : null;

  const margin = { top: 10, right: 8, left: 0, bottom: 0 };

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return (
          <AreaChart data={data} margin={margin}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={ACCENT} stopOpacity={0.3} />
                <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
              </linearGradient>
            </defs>
            {grid}
            {xAxis}
            {yAxis}
            <Tooltip content={<ChartTooltip />} />
            {lastPriceLine}
            <Area
              type="monotone"
              dataKey="close"
              stroke={ACCENT}
              strokeWidth={2}
              fill="url(#colorPrice)"
              isAnimationActive={false}
            />
          </AreaChart>
        );

      case "candle":
        return (
          <ComposedChart data={data} margin={margin} barCategoryGap="20%">
            {grid}
            {xAxis}
            {yAxis}
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            {lastPriceLine}
            <Bar
              dataKey="range"
              shape={<CandleShape />}
              isAnimationActive={false}
            />
          </ComposedChart>
        );

      case "bar":
        return (
          <BarChart data={data} margin={margin}>
            {grid}
            {xAxis}
            {yAxis}
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            {lastPriceLine}
            <Bar
              dataKey="close"
              radius={[3, 3, 0, 0]}
              maxBarSize={16}
              isAnimationActive={false}
            >
              {data.map((d) => (
                <Cell key={d.ts} fill={d.up ? UP : DOWN} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        );

      default:
        return null;
    }
  };

  const chartButtons: { type: ChartType; label: string; icon: JSX.Element }[] = [
    { type: "line", label: "Line chart", icon: <ChartLine className="h-4 w-4" /> },
    {
      type: "candle",
      label: "Candlestick chart",
      icon: <ChartCandlestick className="h-4 w-4" />,
    },
    { type: "bar", label: "Bar chart", icon: <BarChart3 className="h-4 w-4" /> },
  ];

  return (
    <Card className="bg-crypto-bg-card p-4">
      <CardHeader className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-lg text-white/90">{title}</CardTitle>
          {stats && (
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums text-white/90">
                ${formatPrice(stats.last)}
              </span>
              <span
                className={`text-sm font-medium tabular-nums ${
                  lastUp ? "text-crypto-green" : "text-crypto-red"
                }`}
              >
                {lastUp ? "+" : ""}
                {stats.pct.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          {chartButtons.map((b) => (
            <Button
              key={b.type}
              size="icon"
              variant={chartType === b.type ? "default" : "ghost"}
              onClick={() => setChartType(b.type)}
              aria-label={b.label}
              aria-pressed={chartType === b.type}
              title={b.label}
            >
              {b.icon}
            </Button>
          ))}
        </div>
      </CardHeader>

      {stats && (
        <div className="grid grid-cols-3 gap-2 px-6 pb-2">
          <Stat label={`${timeframe} high`} value={`$${formatPrice(stats.high)}`} />
          <Stat label={`${timeframe} low`} value={`$${formatPrice(stats.low)}`} />
          <Stat
            label={`${timeframe} change`}
            value={`${stats.change >= 0 ? "+" : "-"}$${formatPrice(
              Math.abs(stats.change)
            )}`}
            className={lastUp ? "text-crypto-green" : "text-crypto-red"}
          />
        </div>
      )}

      <CardContent className="relative">
        <div
          className={`h-[440px] overflow-x-auto transition-opacity ${
            loading && data.length ? "opacity-40" : "opacity-100"
          }`}
        >
          {/* On mobile the chart keeps ~9px per candle and scrolls sideways; on md+ it fits the card. */}
          <div
            className="h-full w-full min-w-[var(--chart-min-w)] md:min-w-0"
            style={{ "--chart-min-w": `${data.length * 9}px` } as CSSProperties}
          >
            <ResponsiveContainer width="100%" height="100%">
              {renderChart() ?? <div />}
            </ResponsiveContainer>
          </div>
        </div>

        {loading && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-md bg-black/40 px-3 py-1.5 text-sm text-white/80">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading candles…
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-crypto-red">{error}</p>
            <Button size="sm" onClick={() => setReloadKey((k) => k + 1)}>
              Retry
            </Button>
          </div>
        )}
      </CardContent>

      <div className="mt-2 flex justify-center space-x-2">
        {TIMEFRAMES.map(({ label }) => (
          <Button
            key={label}
            size="sm"
            variant={timeframe === label ? "default" : "ghost"}
            onClick={() => setTimeframe(label)}
          >
            {label}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default CandlestickChart;
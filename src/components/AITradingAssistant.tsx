import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cryptocurrency } from "@/types/crypto";

export interface AppliedSetup {
  baseSymbol: string;
  pair: string;
  tradeType: "buy" | "sell";
  amount: number;
  entry: number;
  stopLoss: number;
  takeProfit: number;
}

interface AITradingAssistantProps {
  cryptocurrencies: Cryptocurrency[];
  selectedCrypto: Cryptocurrency;
  /** Balance to check against. Pass demoBalance or realBalance depending on tradingMode. */
  balance: number;
  /**
   * Optional. The main button is now "Re-scan Market", so this is only
   * reachable through the small "Apply setup" text link under it.
   * Remove that link if you don't need it.
   */
  onApplySetup?: (setup: AppliedSetup) => void;
  /** Called when the user clicks "Add Funds" on the zero-balance state. */
  onDepositClick?: () => void;
}

interface TokenAnalysis {
  crypto: Cryptocurrency;
  score: number; // 1-10
  direction: "BUY" | "SELL";
  confidence: number; // %
  reason: string;
}

const MIN_TRADE = 18;
const MAX_SUGGESTED_STAKE = 250;
const STAKE_PCT_OF_BALANCE = 0.1;

/** How many tokens (from the start of the list) get scanned and predicted. */
const MAX_TOKENS = 12;
const SCAN_DURATION_MS = 3600;
const SCAN_TICK_MS = 50;

const SCAN_STEPS = [
  "Connecting to the simulated market feed",
  "Reading 24h momentum",
  "Measuring volume pressure",
  "Scoring each token",
  "Building trade setups",
];

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/**
 * Scores a token from 1-10 based on the simulated market data already
 * being generated elsewhere in the app (24h change + volume/marketCap
 * as a volatility proxy). No external calls. A small random variation is
 * applied once per scan (never while rendering) so a re-scan reads as a
 * fresh look at the market instead of returning identical numbers.
 */
function analyzeToken(crypto: Cryptocurrency): TokenAnalysis {
  const change = crypto.priceChangePercentage24h ?? 0;

  // Momentum: how large the move is, normalized to 0-1 (caps at a 5% move)
  const momentum = Math.min(Math.abs(change) / 5, 1);

  // Volatility proxy: relative volume vs market cap, normalized to 0-1
  const volumeRatio =
    crypto.marketCap > 0 ? crypto.volume24h / crypto.marketCap : 0;
  const volatility = Math.min(volumeRatio * 10, 1);

  const scanNoise = (Math.random() - 0.5) * 1.2; // +/- 0.6 points
  const rawScore = (momentum * 0.65 + volatility * 0.35) * 10 + scanNoise;
  const score = clamp(Math.round(rawScore), 1, 10);

  const direction: "BUY" | "SELL" = change >= 0 ? "BUY" : "SELL";
  const confidence = clamp(
    Math.round(50 + score * 4.5 + (Math.random() - 0.5) * 4),
    50,
    97
  );

  const reason =
    direction === "BUY"
      ? `Detected upward momentum (${change.toFixed(
          2
        )}% / 24h) with relatively strong volume.`
      : `Detected downward pressure (${change.toFixed(
          2
        )}% / 24h) with relatively strong volume.`;

  return { crypto, score, direction, confidence, reason };
}

/** Forces a direction on an analysis and rewrites the reason to match. */
function withDirection(
  a: TokenAnalysis,
  direction: "BUY" | "SELL"
): TokenAnalysis {
  if (a.direction === direction) return a;
  const change = a.crypto.priceChangePercentage24h ?? 0;
  const reason =
    direction === "BUY"
      ? `Simulated rebound potential after a ${change.toFixed(2)}% / 24h move.`
      : `Simulated pullback risk after a +${change.toFixed(2)}% / 24h move.`;
  return { ...a, direction, reason };
}

/** Top pick keeps its data-driven direction; the rest alternate below it. */
function alternateDirections(ranked: TokenAnalysis[]): TokenAnalysis[] {
  if (ranked.length === 0) return ranked;
  const first = ranked[0].direction;
  const opposite = first === "BUY" ? "SELL" : "BUY";
  return ranked.map((a, i) => withDirection(a, i % 2 === 0 ? first : opposite));
}

function getRiskReward(score: number) {
  // Tighter stop/target for higher-confidence (higher score) setups
  const riskPct = 3 - score * 0.15; // score 10 -> 1.5%, score 1 -> 2.85%
  const rewardPct = riskPct * 2; // simple 1:2 risk/reward
  return { riskPct, rewardPct };
}

function buildSetup(analysis: TokenAnalysis, balance: number) {
  const { crypto, score, direction } = analysis;
  const entry = crypto.currentPrice;
  const { riskPct, rewardPct } = getRiskReward(score);

  const stopLoss =
    direction === "BUY"
      ? entry * (1 - riskPct / 100)
      : entry * (1 + riskPct / 100);

  const takeProfit =
    direction === "BUY"
      ? entry * (1 + rewardPct / 100)
      : entry * (1 - rewardPct / 100);

  const rawStake = Math.min(balance * STAKE_PCT_OF_BALANCE, MAX_SUGGESTED_STAKE);
  const stake = Math.max(MIN_TRADE, Math.round(rawStake / 5) * 5);

  return { entry, stopLoss, takeProfit, stake };
}

const formatUsd = (value: number) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/* -------------------------------------------------------------------------- */
/* Small presentational helpers                                               */
/* -------------------------------------------------------------------------- */

/** Self-contained keyframes so no tailwind.config changes are needed. */
const AnimationStyles: React.FC = () => (
  <style>{`
    @keyframes ai-fade-up {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: none; }
    }
    @keyframes ai-pop {
      0%   { opacity: 0; transform: scale(0.5) rotate(-20deg); }
      70%  { opacity: 1; transform: scale(1.25) rotate(6deg); }
      100% { opacity: 1; transform: scale(1) rotate(0); }
    }
    @keyframes ai-sweep {
      from { transform: translateX(-100%); }
      to   { transform: translateX(500%); }
    }
    @keyframes ai-bar-grow {
      from { transform: scaleX(0); }
      to   { transform: scaleX(1); }
    }
    .ai-fade-up  { animation: ai-fade-up 0.4s ease-out both; }
    .ai-pop      { animation: ai-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
    .ai-sweep    { animation: ai-sweep 2s ease-in-out infinite; }
    .ai-bar-grow { transform-origin: left center; animation: ai-bar-grow 0.8s ease-out both; }

    @media (prefers-reduced-motion: reduce) {
      .ai-fade-up, .ai-pop, .ai-sweep, .ai-bar-grow { animation: none; }
    }
  `}</style>
);

/** Counts from 0 up to `value` with an ease-out curve. */
const CountUp: React.FC<{ value: number; duration?: number }> = ({
  value,
  duration = 900,
}) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <>{display}</>;
};

const PanelHeader: React.FC<{ status: React.ReactNode }> = ({ status }) => (
  <CardHeader className="pb-2">
    <div className="flex items-center justify-between gap-2">
      <CardTitle className="text-base flex items-center gap-2">
        🤖 AI Market Analysis
        
      </CardTitle>
      <span className="text-xs text-gray-500">{status}</span>
    </div>
  </CardHeader>
);

const RescanButton: React.FC<{ scanning: boolean; onClick: () => void }> = ({
  scanning,
  onClick,
}) => (
  <Button
    size="sm"
    className="group w-full gap-2"
    onClick={onClick}
    disabled={scanning}
  >
    <span
      className={`inline-block ${
        scanning
          ? "animate-spin"
          : "transition-transform duration-500 group-hover:rotate-180"
      }`}
    >
      🔄
    </span>
    {scanning ? "Scanning market…" : "Re-scan Market"}
  </Button>
);

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const AITradingAssistant: React.FC<AITradingAssistantProps> = ({
  cryptocurrencies,
  selectedCrypto,
  balance,
  onApplySetup,
  onDepositClick,
}) => {
  const tokens = useMemo(
    () => (cryptocurrencies ?? []).slice(0, MAX_TOKENS),
    [cryptocurrencies]
  );
  const hasData = tokens.length > 0;
  const isLocked = !balance || balance <= 0;

  // Prices may tick every second; read the latest at scan time without
  // restarting the scan whenever the prop changes.
  const tokensRef = useRef(tokens);
  tokensRef.current = tokens;

  const [scanId, setScanId] = useState(0);
  const [phase, setPhase] = useState<"scanning" | "ready">("scanning");
  const [progress, setProgress] = useState(0); // 0-1
  const [results, setResults] = useState<TokenAnalysis[]>([]);
  const [featuredId, setFeaturedId] = useState<string | null>(null);
  const [scannedAt, setScannedAt] = useState<Date | null>(null);

  // Runs the scan on mount, on every re-scan, and when the account gets funded.
  useEffect(() => {
    if (isLocked || !hasData) return;

    setPhase("scanning");
    setProgress(0);
    const startedAt = Date.now();

    const timer = window.setInterval(() => {
      const p = Math.min((Date.now() - startedAt) / SCAN_DURATION_MS, 1);
      setProgress(p);

      if (p >= 1) {
        window.clearInterval(timer);
        const ranked = alternateDirections(
          tokensRef.current
            .map(analyzeToken)
            .sort((a, b) => b.score - a.score || b.confidence - a.confidence)
        );
        setResults(ranked);
        setFeaturedId(ranked[0]?.crypto.id ?? null);
        setScannedAt(new Date());
        setPhase("ready");
      }
    }, SCAN_TICK_MS);

    return () => window.clearInterval(timer);
  }, [scanId, isLocked, hasData]);

  const handleRescan = () => setScanId((id) => id + 1);

  if (!hasData) return null;

  /* ------------------------------ Locked state ----------------------------- */
  if (isLocked) {
    return (
      <Card className="mb-4 border-dashed ai-fade-up">
        <AnimationStyles />
        <PanelHeader status="Locked" />
        <CardContent>
          <p className="text-sm font-medium text-crypto-red mb-1">
            Prediction unavailable
          </p>
          <p className="text-sm text-gray-500 mb-3">
            Your balance is {formatUsd(balance || 0)}. Fund your account to
            unlock AI market predictions and trading setups.
          </p>
          <Button
            size="sm"
            className="w-full"
            onClick={() => onDepositClick?.()}
          >
            Add Funds
          </Button>
        </CardContent>
      </Card>
    );
  }

  /* ----------------------------- Scanning state ---------------------------- */
  if (phase === "scanning") {
    const pct = Math.round(progress * 100);
    const scannedCount = Math.min(
      tokens.length,
      Math.floor(progress * tokens.length)
    );
    const stepIndex = Math.min(
      SCAN_STEPS.length - 1,
      Math.floor(progress * SCAN_STEPS.length)
    );

    return (
      <Card className="mb-4 relative overflow-hidden">
        <AnimationStyles />
        <div
          aria-hidden
          className="ai-sweep pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-crypto-green/10 to-transparent"
        />
        <PanelHeader
          status={
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crypto-green opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-crypto-green" />
              </span>
              Scanning
            </span>
          }
        />
        <CardContent>
          <div className="flex items-center gap-4">
            <div
              aria-hidden
              className="relative flex h-16 w-16 shrink-0 items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full border border-crypto-green/40" />
              <div className="absolute inset-3 rounded-full border border-crypto-green/30" />
              <div
                className="absolute inset-0 animate-spin rounded-full"
                style={{
                  animationDuration: "1.6s",
                  background:
                    "conic-gradient(from 0deg, rgba(34,197,94,0) 0deg, rgba(34,197,94,0.5) 60deg, rgba(34,197,94,0) 61deg)",
                }}
              />
              <div className="h-1.5 w-1.5 rounded-full bg-crypto-green" />
            </div>

            <div className="min-w-0 flex-1">
              <p
                key={stepIndex}
                className="ai-fade-up mb-1 truncate text-sm font-medium"
                aria-live="polite"
              >
                {SCAN_STEPS[stepIndex]}
              </p>
              <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                <span>Analyzing {tokens.length} tokens</span>
                <span className="tabular-nums">{pct}%</span>
              </div>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
                className="h-1.5 w-full overflow-hidden rounded-full bg-black/10"
              >
                <div
                  className="h-full rounded-full bg-crypto-green transition-[width] duration-100 ease-linear"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {tokens.map((t, i) => {
              const state =
                i < scannedCount
                  ? "done"
                  : i === scannedCount
                  ? "active"
                  : "pending";
              return (
                <span
                  key={t.id}
                  className={`rounded-md px-2 py-1 text-xs font-medium transition-all duration-300 ${
                    state === "done"
                      ? "bg-crypto-green/10 text-crypto-green"
                      : state === "active"
                      ? "animate-pulse bg-black/10 text-gray-800"
                      : "bg-black/5 text-gray-400"
                  }`}
                >
                  {state === "done" ? "✓ " : ""}
                  {t.symbol.toUpperCase()}
                </span>
              );
            })}
          </div>

          <div className="mt-4">
            <RescanButton scanning onClick={handleRescan} />
          </div>
        </CardContent>
      </Card>
    );
  }

  /* ------------------------------ Results state ---------------------------- */
  if (results.length === 0) return null;

  const featured =
    results.find((r) => r.crypto.id === featuredId) ?? results[0];
  const isTopPick = featured === results[0];
  const setup = buildSetup(featured, balance);
  const { crypto, score, direction, confidence, reason } = featured;
  const symbol = crypto.symbol.toUpperCase();

  return (
    <Card className="mb-4">
      <AnimationStyles />
      <PanelHeader
        status={
          scannedAt
            ? `Scanned ${scannedAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}`
            : "Scanned"
        }
      />
      <CardContent>
        {/* Featured setup. Re-keyed so it replays when another token is picked. */}
        <div key={crypto.id} className="ai-fade-up">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500">
                {isTopPick ? "Best Setup" : "Selected Setup"}
              </p>
              <p className="font-semibold">{symbol}/USDT</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Market Score</p>
              <p className="font-semibold">
                <CountUp value={score} duration={700} />
                /10{" "}
                <span
                  className="ai-pop inline-block"
                  style={{ animationDelay: "550ms" }}
                >
                  ⭐
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-1.5">
            <span
              className={`px-2 py-1 rounded text-xs font-bold ${
                direction === "BUY"
                  ? "bg-crypto-green/10 text-crypto-green"
                  : "bg-crypto-red/10 text-crypto-red"
              }`}
            >
              {direction}
            </span>
            <span className="text-xs text-gray-500">
              Confidence:{" "}
              <span className="font-medium tabular-nums">
                <CountUp value={confidence} />%
              </span>
            </span>
          </div>
          <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
            <div
              className="ai-bar-grow h-full rounded-full bg-blue-500"
              style={{ width: `${confidence}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div>
              <p className="text-gray-500 text-xs">Entry Price</p>
              <p className="font-medium">${formatUsd(setup.entry)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Recommended Stake</p>
              <p className="font-medium">${formatUsd(setup.stake)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Stop Loss</p>
              <p className="font-medium">${formatUsd(setup.stopLoss)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Take Profit</p>
              <p className="font-medium">${formatUsd(setup.takeProfit)}</p>
            </div>
          </div>

          <p className="text-xs text-gray-500">{reason}</p>
        </div>

        {/* Predictions for the first 12 tokens */}
        <div className="my-3 border-t" />
        <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
          <span>Predictions for the first {results.length} tokens</span>
          <span>Tap a token to view its setup</span>
        </div>

        <div className="mb-3 max-h-64 space-y-0.5 overflow-y-auto pr-1">
          {results.map((r, i) => {
            const active = r.crypto.id === crypto.id;
            const isBuy = r.direction === "BUY";
            const { rewardPct } = getRiskReward(r.score);
            const delay = `${i * 55}ms`;

            return (
              <button
                key={r.crypto.id}
                type="button"
                onClick={() => setFeaturedId(r.crypto.id)}
                aria-pressed={active}
                style={{ animationDelay: delay }}
                className={`ai-fade-up flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 ${
                  active ? "bg-black/5 ring-1 ring-gray-300" : ""
                }`}
              >
                <span className="w-4 tabular-nums text-gray-400">{i + 1}</span>
                <span className="flex w-16 items-center gap-1 truncate font-semibold">
                  {r.crypto.symbol.toUpperCase()}
                  {r.crypto.id === selectedCrypto.id && (
                    <span
                      title="Currently selected pair"
                      className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-crypto-green"
                    />
                  )}
                </span>
                <span
                  className={`w-10 rounded px-1.5 py-0.5 text-center font-bold ${
                    isBuy
                      ? "bg-crypto-green/10 text-crypto-green"
                      : "bg-crypto-red/10 text-crypto-red"
                  }`}
                >
                  {r.direction}
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/10">
                  <span
                    className="ai-bar-grow block h-full rounded-full bg-blue-500"
                    style={{
                      width: `${r.confidence}%`,
                      animationDelay: delay,
                    }}
                  />
                </span>
                <span className="w-8 text-right tabular-nums">{r.score}/10</span>
                <span className="w-9 text-right tabular-nums text-gray-500">
                  {r.confidence}%
                </span>
                <span
                  className={`w-11 text-right tabular-nums ${
                    isBuy ? "text-crypto-green" : "text-crypto-red"
                  }`}
                  title="Take-profit distance"
                >
                  {isBuy ? "+" : "-"}
                  {rewardPct.toFixed(1)}%
                </span>
              </button>
            );
          })}
        </div>

        <RescanButton scanning={false} onClick={handleRescan} />

        {onApplySetup && (
          <button
            type="button"
            className="mt-2 w-full text-center text-xs text-gray-500 underline-offset-2 hover:underline"
            onClick={() =>
              onApplySetup({
                baseSymbol: symbol,
                pair: `${symbol}/USDT`,
                tradeType: direction === "BUY" ? "buy" : "sell",
                amount: setup.stake,
                entry: setup.entry,
                stopLoss: setup.stopLoss,
                takeProfit: setup.takeProfit,
              })
            }
          >
            Apply {symbol} setup to trade form
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default AITradingAssistant;
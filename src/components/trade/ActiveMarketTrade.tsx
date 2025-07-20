import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Market1 from "./markets/Market1";
import Market2 from "./markets/Market2";
import Market3 from "./markets/Market3";
import Market4 from "./markets/Market4";
import Market5 from "./markets/Market5";
import Market6 from "./markets/Market6";
import Market7 from "./markets/Market7";
import Market8 from "./markets/Market8";
import Market9 from "./markets/Market9";
import Market10Bot from "./markets/Market10Bot";
import { supabase } from "@/lib/supabaseClient";

const marketMap = {
  1: Market1,
  2: Market2,
  3: Market3,
  4: Market4,
  5: Market5,
  6: Market6,
  7: Market7,
  8: Market8,
  9: Market9,
  10: Market10Bot,
};

export default function ActiveMarketTrade(props: {
  user: User;
  amount: number;
  tradeType: "buy" | "sell";
  baseSymbol: string;
  pair: string;
  onComplete: () => void;
  onFail?: () => void;
}) {
  const [currentMarket, setCurrentMarket] = useState<number | null>(null);

  useEffect(() => {
    const getMarket = async () => {
      const { data, error } = await supabase
        .from("strategy_stats")
        .select("current_market")
        .limit(1)
        .single();

      if (!error && data?.current_market >= 1 && data?.current_market <= 10) {
        setCurrentMarket(data.current_market);
      } else {
        props.onFail?.();
      }
    };

    getMarket();
  }, []);

  if (!currentMarket) return null;

  const Component = marketMap[currentMarket as keyof typeof marketMap];
  if (!Component) return null;

  return <Component {...props} />;
}  
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const RecentTransactions = () => {
  const [txns, setTxns] = useState([]);

  useEffect(() => {
    const fetchTxns = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("formatted_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error) setTxns(data);
    };

    fetchTxns();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
      <ul className="space-y-2">
        {txns.map(tx => (
          <li key={tx.id} className="bg-gray-100 dark:bg-gray-800 p-3 rounded shadow-sm">
            <div className="text-sm font-medium">
              {tx.type.toUpperCase()} {tx.crypto_amount?.toFixed(6)} {tx.token.toUpperCase()}
              {tx.token_to && ` → ${tx.token_to.toUpperCase()}`}
            </div>
            <div className="text-xs text-gray-500">
              ${tx.usd_amount?.toFixed(2) || 0} • Fee: ${tx.fee_usd?.toFixed(2) || 0}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(tx.created_at).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;

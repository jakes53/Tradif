import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import clsx from "clsx";
import { format } from "date-fns";

interface Transaction {
  id: string;
  uid: string;
  type: "Cash" | "Token";
  action: "Deposit" | "Withdraw" | "Sent" | "Received";
  amount: number;
  token_type: string | null;
  transaction_date: string;
  status: "Pending" | "Approved" | "Failed" | "Completed" | "Rejected";
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const UserCashTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Auth error:", authError?.message);
        return;
      }

      // Fetch custom_user_id from profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("custom_user_id")
        .eq("id", user.id)
        .single();

      if (profileError || !profile?.custom_user_id) {
        console.error("Profile fetch error:", profileError?.message);
        return;
      }

      const customId = profile.custom_user_id;

      const { data, error } = await supabase
        .from("tradify_cash")
        .select("*")
        .eq("uid", customId)
        .order("transaction_date", { ascending: false });

      if (error) {
        console.error("Transaction fetch error:", error.message);
        return;
      }

      setTransactions(data || []);
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading transactions...</p>;
  if (transactions.length === 0)
    return <p className="text-muted-foreground">No transactions available.</p>;

  return (
    <div className="space-y-5">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="bg-white dark:bg-gray-900 border rounded-lg p-4 space-y-2 shadow-sm"
        >
          {/* Header: Label + Amount */}
          <div className="flex justify-between items-center">
            <div className="font-semibold flex items-center gap-1">
              {tx.type === "Cash" ? "" : "🪙"}
              {tx.type === "Cash"
                ? `Cash ${tx.action}`
                : `${tx.action} ${tx.token_type?.toUpperCase()}`}
            </div>

            <div
              className={clsx(
                "text-right font-medium",
                tx.type === "Token" &&
                  (tx.action === "Received" ? "text-green-600" : "text-red-600")
              )}
            >
              {tx.type === "Cash"
                ? formatter.format(tx.amount)
                : `${tx.action === "Received" ? "+" : "-"} ${tx.amount} ${tx.token_type?.toUpperCase()}`}
            </div>
          </div>

          {/* Footer: Date + Status */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              {format(new Date(tx.transaction_date), "MMM d, yyyy h:mm a")}
            </span>
            <span
              className={clsx(
                "text-xs font-semibold px-2 py-0.5 rounded",
                tx.status === "Pending" && "bg-yellow-100 text-yellow-700",
                tx.status === "Approved" && "bg-blue-100 text-blue-700",
                tx.status === "Completed" && "bg-green-100 text-green-700",
                tx.status === "Failed" && "bg-red-100 text-red-700",
                tx.status === "Rejected" && "bg-gray-100 text-gray-700"
              )}
            >
              {tx.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserCashTransactions;

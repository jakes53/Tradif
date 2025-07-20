import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";
import clsx from "clsx";

interface Withdrawal {
  id: string;
  amount: number;
  transaction_date: string;
  status: string;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const RecentWithdrawActivity = () => {
  const [withdrawal, setWithdrawal] = useState<Withdrawal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestWithdrawal = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) return;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("custom_user_id")
        .eq("id", user.id)
        .single();

      if (profileError || !profile?.custom_user_id) return;

      const { data, error } = await supabase
        .from("tradify_cash")
        .select("id, amount, transaction_date, status")
        .eq("uid", profile.custom_user_id)
        .eq("type", "Cash")
        .eq("action", "Withdraw")
        .order("transaction_date", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) setWithdrawal(data);
      setLoading(false);
    };

    fetchLatestWithdrawal();
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;
  if (!withdrawal) return <p className="text-muted-foreground">No withdrawal yet.</p>;

  return (
    <div className="bg-white dark:bg-gray-900 border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="font-semibold">💸 Cash Withdraw</div>
        <div className="text-red-600 font-medium">
          - {formatter.format(withdrawal.amount)}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm mt-1">
        <span className="text-muted-foreground">
          {format(new Date(withdrawal.transaction_date), "MMM d, yyyy h:mm a")}
        </span>
        <span
          className={clsx(
            "text-xs font-semibold px-2 py-0.5 rounded",
            withdrawal.status === "Pending" && "bg-yellow-100 text-yellow-700",
            withdrawal.status === "Approved" && "bg-blue-100 text-blue-700",
            withdrawal.status === "Completed" && "bg-green-100 text-green-700",
            withdrawal.status === "Failed" && "bg-red-100 text-red-700",
            withdrawal.status === "Rejected" && "bg-gray-100 text-gray-700"
          )}
        >
          {withdrawal.status}
        </span>
      </div>
    </div>
  );
};

export default RecentWithdrawActivity;

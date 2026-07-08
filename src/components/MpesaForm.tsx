import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MpesaCashFormProps {
  type: "Deposit" | "Withdraw";
}

export default function MpesaCashForm({ type }: MpesaCashFormProps) {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const numericAmount = Number(amount);

  const isInvalidPhone =
    phone.length !== 12 || !phone.startsWith("254") || isNaN(Number(phone));

  const isInvalidAmount =
    !amount || isNaN(numericAmount) || numericAmount <= 0;

  const disableButton = isInvalidPhone || isInvalidAmount || loading;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        toast.error("Session expired. Please login again.");
        return;
      }

      // ─────────────── DEPOSIT ───────────────
      if (type === "Deposit") {
        const res = await fetch(
          "https://nadvttfktpqhjsnwoekr.supabase.co/functions/v1/mpesa-deposit",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              user_id: session.user.id, // ✅ added
              phone,
              amount: numericAmount,
            }),
          }
        );

        const text = await res.text();
        console.log("MPESA RESPONSE:", text);
        console.log("STATUS:", res.status);

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          toast.error("Unexpected response from server.");
          return;
        }

        if (!res.ok) {
          toast.error(data.error || "Failed to send STK push.");
          return;
        }

        toast.success("Check your phone to complete payment.");
        setPhone("");
        setAmount("");
        return;
      }

      // ─────────────── WITHDRAW ───────────────
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("fiat_balance, apk_balance")
        .eq("id", session.user.id)
        .single();

      if (profileError || !profile) {
        toast.error("Failed to fetch balance.");
        return;
      }

      if (numericAmount > profile.fiat_balance) {
        toast.error("Insufficient balance.");
        return;
      }

      const { error: withdrawError } = await supabase
        .from("tradify_pesa")
        .insert({
          uid: session.user.id,
          phone,
          amount: numericAmount,
          type: "withdraw",
          status: "pending",
        });

      if (withdrawError) {
        console.error("Withdraw log error:", withdrawError);
        toast.error("Failed to submit withdrawal.");
        return;
      }

      toast.success("Withdrawal request submitted.");
      setPhone("");
      setAmount("");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#0f172a] border border-white/10 rounded-xl p-4 space-y-4">
      <h2 className="text-white font-semibold text-lg">
        {type === "Deposit" ? "M-Pesa Deposit" : "M-Pesa Withdraw"}
      </h2>

      <Input
        placeholder="2547XXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="bg-[#020617] border-white/10 text-white"
      />

      <Input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        className="bg-[#020617] border-white/10 text-white"
      />

      <Button
        onClick={handleSubmit}
        disabled={disableButton}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
      >
        {loading
          ? "Processing..."
          : type === "Deposit"
          ? "Deposit via M-Pesa"
          : "Withdraw to M-Pesa"}
      </Button>
    </div>
  );
}
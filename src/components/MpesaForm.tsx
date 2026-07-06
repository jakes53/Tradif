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

  const numericAmount = parseFloat(amount);

  // ───────────────── VALIDATION ─────────────────
  const isInvalidPhone =
    phone.length !== 12 || !phone.startsWith("254") || isNaN(Number(phone));

  const isInvalidAmount =
    !amount || isNaN(numericAmount) || numericAmount <= 0;

  const disableButton = isInvalidPhone || isInvalidAmount || loading;

  // ───────────────── SUBMIT ─────────────────
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        toast.error("User not authenticated.");
        return;
      }

      // Fetch balances
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("fiat_balance, apk_balance")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        toast.error("Failed to fetch user balances.");
        return;
      }

      // ─────────────── DEPOSIT (MPESA STK) ───────────────
if (type === "Deposit") {
  const res = await fetch(
    "https://YOUR_PROJECT_ID.supabase.co/functions/v1/mpesa-deposit",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.id,
        phone,
        amount: numericAmount,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    toast.error("Failed to send STK push.");
    return;
  }

  toast.success("Check your phone to complete payment.");
  setAmount("");
  setPhone("");
  return;
}

      // ─────────────── WITHDRAW ───────────────
      if (numericAmount > profile.fiat_balance) {
        toast.error("Insufficient balance.");
        return;
      }

      // 1️⃣ Update balances
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          fiat_balance: profile.fiat_balance - numericAmount,
          apk_balance: (profile.apk_balance || 0) + numericAmount, // ✅ ACCUMULATE
        })
        .eq("id", user.id);

      if (updateError) {
        toast.error(updateError.message);
        return;
      }

      // 2️⃣ Log withdraw request
      const { error: cashError } = await supabase
        .from("tradify_cash")
        .insert({
          uid: user.id,
          type: "Cash Withdraw",
          amount: numericAmount,
          phone,
          status: "pending",
        });

     if (cashError) {
  toast.success("Withdrawal successful.");
  return;
}

      toast.success("Withdrawal successfully initiated.");
      setAmount("");
      setPhone("");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ───────────────── UI ─────────────────
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
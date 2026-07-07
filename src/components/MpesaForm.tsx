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

  // ───────────── VALIDATION ─────────────
  const isInvalidPhone =
    phone.length !== 12 || !phone.startsWith("254") || isNaN(Number(phone));

  const isInvalidAmount =
    !amount || isNaN(numericAmount) || numericAmount <= 0;

  const disableButton = isInvalidPhone || isInvalidAmount || loading;

  // ───────────── SUBMIT ─────────────
  const handleSubmit = async () => {
    if (disableButton) return;

    setLoading(true);

    try {
      // 🔐 ensure user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("User not authenticated.");
        return;
      }

      const cleanPhone = phone.trim();

      // ───────────── DEPOSIT ─────────────
      if (type === "Deposit") {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mpesa-deposit`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              phone: cleanPhone,
              amount: numericAmount,
              type: "deposit", // ✅ REQUIRED
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          toast.error(data?.error || "Failed to send STK push.");
          return;
        }

        toast.success("Check your phone to complete payment.");
        setAmount("");
        setPhone("");
        return;
      }

      // ───────────── WITHDRAW ─────────────
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("fiat_balance, apk_balance")
        .single();

      if (profileError || !profile) {
        toast.error("Failed to fetch balance.");
        return;
      }

      if (numericAmount > profile.fiat_balance) {
        toast.error("Insufficient balance.");
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          fiat_balance: profile.fiat_balance - numericAmount,
          apk_balance: (profile.apk_balance || 0) + numericAmount,
        })
        .eq("id", session.user.id);

      if (updateError) {
        toast.error(updateError.message);
        return;
      }

      const { error: insertError } = await supabase
        .from("tradify_pesa")
        .insert({
          amount: numericAmount,
          phone: cleanPhone,
          type: "withdraw", // ✅ REQUIRED
          status: "pending",
          user_id: session.user.id,
        });

      if (insertError) {
        toast.error(insertError.message);
        return;
      }

      toast.success("Withdrawal request submitted.");
      setAmount("");
      setPhone("");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ───────────── UI ─────────────
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
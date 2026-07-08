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
    !(phone.startsWith("254") || phone.startsWith("07"));

  const isInvalidAmount =
    !amount || isNaN(numericAmount) || numericAmount <= 0;

  const disableButton =
    loading || isInvalidPhone || isInvalidAmount;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Please log in.");
        return;
      }

      // ---------------- Deposit ----------------
      if (type === "Deposit") {
        const res = await fetch(
          "https://nadvttfktpqhjsnwoekr.supabase.co/functions/v1/mpesa-deposit",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone,
              amount: numericAmount,
            }),
          }
        );

        const data = await res.json();

        console.log("STATUS", res.status);
        console.log(data);

        if (!res.ok) {
          toast.error(data.error || "STK request failed");
          return;
        }

        toast.success("STK sent. Check your phone.");
        setPhone("");
        setAmount("");
        return;
      }

      // ---------------- Withdraw ----------------
const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("fiat_balance, apk_balance")
  .eq("id", session.user.id)
  .single();

if (profileError || !profile) {
  toast.error("Failed to fetch user balances.");
  return;
}

if (numericAmount > profile.fiat_balance) {
  toast.error("Insufficient balance.");
  return;
}

// 1️⃣ Update balances
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

// 2️⃣ Log withdraw request
const { error: cashError } = await supabase
  .from("tradify_pesa")
  .insert({
    user_id: session.user.id,
    type: "Cash Withdraw",
    amount: numericAmount,
    phone,
    status: "pending",
  });

if (cashError) {
  console.error("Log error:", cashError);
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

  return (
    <div className="w-full max-w-md mx-auto bg-[#0f172a] border border-white/10 rounded-xl p-4 space-y-4">

      <h2 className="text-white text-lg font-semibold">
        {type === "Deposit"
          ? "M-Pesa Deposit"
          : "M-Pesa Withdraw"}
      </h2>

      <Input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="254712345678"
        className="bg-[#020617] border-white/10 text-white"
      />

      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="bg-[#020617] border-white/10 text-white"
      />

      <Button
        onClick={handleSubmit}
        disabled={disableButton}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {loading
          ? "Processing..."
          : type === "Deposit"
          ? "Deposit via M-Pesa"
          : "Withdraw"}
      </Button>

    </div>
  );
}   
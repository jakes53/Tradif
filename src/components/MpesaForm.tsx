import React from "react";
import { Phone, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  type: "Deposit" | "Withdraw";
  phone: string;
  setPhone: (val: string) => void;
  amount: string;
  setAmount: (val: string) => void;
  minAmount: number;
  fee: number;
  isInvalidPrefix: boolean;
  isInvalidLength: boolean;
  isNonNumeric: boolean;
  exceedsBalance: boolean;
  isAmountTooLow: boolean;
  disableMpesaDeposit: boolean;
  disableMpesaWithdraw: boolean;
  loading: boolean;
  onBack?: () => void; // Optional back button handler
  setLoading: (val: boolean) => void;
}

const MpesaForm = ({
  type,
  phone,
  setPhone,
  amount,
  setAmount,
  minAmount,
  fee,
  isInvalidPrefix,
  isInvalidLength,
  isNonNumeric,
  exceedsBalance,
  isAmountTooLow,
  disableMpesaDeposit,
  disableMpesaWithdraw,
  loading,
  onBack, // ✅ this line fixes the error
  setLoading,
}: Props) => {

  const handleSubmit = async () => {
  setLoading(true);
  try {
    if (type === "Withdraw") {
      const withdrawValue = parseFloat(amount);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("User not authenticated.");
        setLoading(false);
        return;
      }

      // Fetch current balance
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("fiat_balance")
        .eq("id", user.id)
        .single();

      if (fetchError || !profile) {
        toast.error("Could not fetch user balance.");
        setLoading(false);
        return;
      }

      if (withdrawValue > profile.fiat_balance) {
        toast.error("Insufficient balance.");
        setLoading(false);
        return;
      }

      // Update fiat_balance and user_withdraw
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          fiat_balance: profile.fiat_balance - withdrawValue,
          user_withdraw: withdrawValue,
        })
        .eq("id", user.id);

      if (updateError) {
        toast.error("Failed to initiate withdrawal.");
        setLoading(false);
        return;
      }

      // Optional: insert a record in tradify_cash or logs
      await supabase.from("tradify_cash").insert({
        uid: user.id,
        type: "Cash Withdraw",
        amount: withdrawValue,
        phone,
        status: "pending",
      });

      toast.success("Withdrawal successfully initiated!");
      setTimeout(() => {
        toast("Waiting verification...", { duration: 38000 });
      }, 4000);
    } else {
      // DEPOSIT FLOW
      const res = await fetch("/api/payhero-stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phone,
          amount: parseInt(amount),
          channel_id: 2727,
          provider: "mpesa",
          external_reference: `TRD-${Date.now()}`,
          callback_url: "https://yourdomain.com/api/payhero-callback",
          customer_name: "Tradify User",
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("STK push sent to your phone.");
        toast("Awaiting confirmation...", { duration: 5000 });
      } else {
        toast.error(result.error || "Failed to send STK push.");
      }
    }
  } catch (error) {
    toast.error("Something went wrong. Try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="space-y-4 bg-[#1e293b] p-4 rounded-lg border border-slate-600">
      {onBack && (
      <button
        onClick={onBack}
        className="text-sm text-orange-400 underline hover:text-orange-300"
      >
        ← Use Manual Payment Instead
      </button>
    )}
      <div className="text-center">
        <div className="bg-orange-500 w-12 h-12 mx-auto rounded-full flex items-center justify-center">
          <Phone size={24} />
        </div>
        <p className="mt-2 font-semibold text-lg">M-Pesa {type}</p>
        <p className="text-sm text-slate-400">
          Quick {type === "Withdraw" ? "withdrawals" : "deposits"} via mobile money
        </p>
      </div>

      {/* Phone input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Phone Number</label>
        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded">
          <Phone size={16} className="text-orange-400" />
          <Input
            className="bg-transparent border-0 text-white placeholder:text-slate-500"
            placeholder="e.g. 254712345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <p className="text-xs text-orange-400">Use format 254XXXXXXXXX (Kenya)</p>
        {isInvalidPrefix && <p className="text-red-500 text-xs">Must start with 254, 255 or 243</p>}
        {isInvalidLength && <p className="text-red-500 text-xs">Must be exactly 12 digits</p>}
        {isNonNumeric && <p className="text-red-500 text-xs">Must contain only digits</p>}
        {exceedsBalance && <p className="text-red-500 text-xs">Amount exceeds available balance</p>}
      </div>

      {/* Amount input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Amount (USD)</label>
        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded">
          <DollarSign size={16} className="text-orange-400" />
          <Input
            className="bg-transparent border-0 text-white placeholder:text-slate-500"
            placeholder={`$${minAmount}`}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        {isAmountTooLow && (
          <p className="text-red-500 text-xs">
            Minimum {type.toLowerCase()} is ${minAmount}
          </p>
        )}
      </div>

      {/* Info box */}
      <div className="bg-slate-900 border border-orange-400 p-3 rounded text-sm">
        <p>
          <strong>Service Fee:</strong> {fee.toFixed(2)} USD (1.5%)
        </p>
        <p>
          <strong>Processing Time:</strong> 1-3 minutes
        </p>
      </div>

      {/* Submit button */}
      <Button
        className="w-full bg-orange-500 hover:bg-orange-600"
        disabled={
          (type === "Withdraw" ? disableMpesaWithdraw : disableMpesaDeposit) || loading
        }
        onClick={handleSubmit}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            Processing...
          </div>
        ) : type === "Withdraw" ? "Request M-Pesa Withdrawal" : "Pay with M-Pesa"}
      </Button>

      <p className="text-xs text-center text-slate-400 mt-2">
        {type === "Withdraw"
          ? "You will receive a withdrawal confirmation on your phone"
          : "You will receive an M-Pesa STK push prompt on your phone"}
      </p>
    </div>
  );
};

export default MpesaForm;

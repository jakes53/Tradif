import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MpesaUnavailable from "@/components/MpesaUnavailable";
import MpesaForm from "@/components/MpesaForm";
import { Phone, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const DepositWithdrawModal = ({
  isOpen,
  onClose,
  type,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: "Deposit" | "Withdraw";
}) => {
  const [tab, setTab] = useState("Mobile Money");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [iban, setIban] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [fiatBalance, setFiatBalance] = useState<number>(0);
const [showSTKForm, setShowSTKForm] = useState(false);

  const navigate = useNavigate();

  const feeRate = 0.015;
  const minAmount = type === "Withdraw" ? 20 : 17;
  const fee = amount ? parseFloat(amount) * feeRate : 0;
  const feeWithdraw = withdrawAmount ? parseFloat(withdrawAmount) * feeRate : 0;

  const depositOptions: Record<string, string[]> = {
    "Mobile Money": [
      "Mpesa", "MTN MoMo", "Airtel", "Chipper Cash", "Wave",
      "Intermex", "Viamericas", "Uniteller", "Dolex",
      "bKash", "GCash", "Alipay", "WeChat Pay", "Easypaisa"
    ],
    "Bank Transfer": [
      "Citi Bank", "Barclays", "Standard Chartered", "UBS",
      "NCBA", "DTB", "KCB", "Lloyds Bank",
      "ICICI Bank", "Banco do Brasil", "HSBC", "Wells Fargo",
      "JP Morgan", "Deutsche Bank", "NatWest", "Santander", "Al Rajhi Bank"
    ],
    "Crypto": ["Select Crypto"],
    "Card": ["Visa", "MasterCard", "American Express"],
    "Others": [
      "Wise", "World Remit", "Cash App", "Binance", "Coinbase", "Payoneer",
      "Deel", "Paysend", "TransferGo", "OFX", "Paxful", "Yellow Card",
      "SWIFT", "Revolut", "Sendwave", "GPay", "Apple Pay"
    ]
  };

  const paymentInstructions: Record<string, { title: string; steps: string[] }> = {
    "Citi Bank": {
      title: "Send via Citi Bank",
      steps: [
        "Bank Name: Citi Bank USA",
        "Account Number: 8398037151",
        "Routing Number (ACH): 026073150",
        "Account Type: Checking",
        "Beneficiary: Tradify Inc."
      ]
    },
    "Barclays": {
      title: "Send via Barclays ",
      steps: [
        "Bank Name: Barclays ",
        "Account Number: 8398037151",
        "Routing Number (ACH): 026073150",
        "Account Type: Checking",
        "Beneficiary: Tradify Inc."
      ]
    },
    "Santander": {
      title: "Send via Santander",
      steps: [
        "Bank Name: Santander",
        "Account Number: 8398037151",
        "Routing Number (ACH): 026073150",
        "Account Type: Checking",
        "Beneficiary: Tradify Inc."
      ]
    },
    "Wells Fargo": {
      title: "Send via Wells Fargo ",
      steps: [
        "Bank Name: Wells Fargo ",
        "Account Number: 8398037151",
        "Routing Number (ACH): 026073150",
        "Account Type: Checking",
        "Beneficiary: Tradify Inc."
      ]
    },
    "Lloyds Bank": {
      title: "Send via Lloyds Bank",
      steps: [
        "Bank Name: Citi Bank USA",
        "Account Number: 8398037151",
        "Routing Number (ACH): 026073150",
        "Account Type: Checking",
        "Beneficiary: Tradify Inc."
      ]
    },
    "Wise": {
      title: "Send via Wise (TransferWise)",
      steps: [
        "Open your Wise account",
        "Bank Name: Community Federal Savings Bank",
        "Account Number: 8398037151",
        "ACH Routing Number: 026073150",
        "Account Type: Checking",
        "Reference: finance@tradify.app",
      ]
    },
    "OFX": {
      title: "Send via OFX",
      steps: [
        "Open your OFX account",
        "Bank Name: Community Federal Savings Bank",
        "Account Number: 8398037151",
        "ACH Routing Number: 026073150",
        "Account Type: Checking",
        "Reference: finance@tradify.app",
      ]
    },
    "Payoneer": {
      title: "Send via Payoneer",
      steps: [
        "Login to Payoneer",
        "Choose Make a Payment → Bank Transfer",
        "Bank Name: Community Federal Savings Bank",
        "Account Number: 8398037151",
        "ACH Routing Number: 026073150",
        "Account Type: Checking",
        "Reference: finance@tradify.app"
      ]
    },
"TransferGo": {
      title: "Send via TransferGo",
      steps: [
        "Login to TransferGo",
        "Choose Make a Payment → Bank Transfer",
        "Bank Name: Community Federal Savings Bank",
        "Account Number: 8398037151",
        "ACH Routing Number: 026073150",
        "Account Type: Checking",
        "Reference: finance@tradify.app"
      ]
    },

    "Revolut": {
      title: "Send via Revolut",
      steps: [
        "Open Revolut → Send → Bank Transfer",
        "Bank Name: Community Federal Savings Bank",
        "Account Number: 8398037151",
        "ACH Routing Number: 026073150",
        "Account Type: Checking",
        "Reference: finance@tradify.app",
      ]
    }
  };

  const resetState = () => {
    setSelectedMethod(null);
    setPhone("");
    setAmount("");
    setRecipientName("");
    setAccountNumber("");
    setWithdrawAmount("");
    setIban("");
    setSwiftCode("");
  };

  const handleCryptoRedirect = () => {
    onClose();
    navigate("/market");
  };

  const isInvalidPrefix = phone && !/^254|255|243/.test(phone);
  const isInvalidLength = phone.startsWith("254") && phone.length !== 12;
  const isNonNumeric = phone && !/^\d+$/.test(phone);
  const isAmountTooLow = amount && parseFloat(amount) < minAmount;
  const exceedsBalance = withdrawAmount && parseFloat(withdrawAmount) > fiatBalance;
  const invalidIban = iban && !/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban.toUpperCase());
  const invalidSwift = swiftCode && !/^[A-Z0-9]{8,11}$/.test(swiftCode.toUpperCase());
  const isDepositAmountTooLow = type === "Deposit" && amount && parseFloat(amount) < 17;
const isWithdrawAmountTooLow = type === "Withdraw" && amount && parseFloat(amount) < 20;
const exceedsMpesaBalance = type === "Withdraw" && amount && parseFloat(amount) > fiatBalance;

const disableMpesaDeposit =
  !phone ||
  !amount ||
  isInvalidPrefix ||
  isInvalidLength ||
  isNonNumeric ||
  isDepositAmountTooLow;

const disableMpesaWithdraw =
  !phone ||
  !amount ||
  isInvalidPrefix ||
  isInvalidLength ||
  isNonNumeric ||
  isWithdrawAmountTooLow ||
  exceedsMpesaBalance;

  useEffect(() => {
    const fetchBalance = async () => {
      const { data } = await supabase.from("profiles").select("fiat_balance").single();
      if (data) setFiatBalance(data.fiat_balance);
    };
    fetchBalance();
  }, []);

  const disableMpesa =
  !phone || !amount || isInvalidPrefix || isInvalidLength || isNonNumeric || isAmountTooLow || exceedsMpesaBalance;
const handleMpesaWithdraw = async () => {
  if (disableMpesaWithdraw || loading) return;

  setLoading(true);

  try {
    const withdrawValue = parseFloat(amount);

    // Step 1: Get current balance & user ID
    const {
      data: profile,
      error: fetchError,
    } = await supabase.from("profiles").select("fiat_balance").single();

    if (fetchError || !profile) {
      toast.error("Error fetching balance.");
      setLoading(false);
      return;
    }

    if (withdrawValue > profile.fiat_balance) {
      toast.error("Insufficient balance.");
      setLoading(false);
      return;
    }

    // Step 2: Update fiat_balance and user_withdraw atomically
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        fiat_balance: profile.fiat_balance - withdrawValue,
        user_withdraw: withdrawValue, // ✅ stores latest withdrawal for verification
      })
      .eq("id", (await supabase.auth.getUser()).data.user?.id);

    if (updateError) {
      toast.error("Withdrawal request failed.");
      setLoading(false);
      return;
    }

    // Optional: Insert transaction record
    await supabase.from("tradify_cash").insert({
      uid: (await supabase.auth.getUser()).data.user?.id,
      type: "withdraw",
      method: "Mpesa",
      phone,
      amount: withdrawValue,
      status: "pending",
    });

    toast.success("Withdrawal submitted for verification.");
    onClose();
    resetState();
  } catch (err) {
    toast.error("Unexpected error occurred.");
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={isOpen} onClose={() => { onClose(); resetState(); }} className="fixed inset-0 z-50">
      <div className="flex justify-center items-center min-h-screen bg-black bg-opacity-60 p-4 overflow-y-auto">
        <Dialog.Panel className="w-full max-w-xl bg-[#0f172a] text-white rounded-xl shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-bold">{type} Funds</Dialog.Title>

          <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-2">
            {Object.keys(depositOptions).map((t) => (
              <button
                key={t}
                className={`px-3 py-1 rounded-lg text-sm ${tab === t ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-400"}`}
                onClick={() => { setTab(t); resetState(); }}
              >
                {t}
              </button>
            ))}
          </div>

          {!selectedMethod ? (
            <div className="grid grid-cols-2 gap-3">
              {depositOptions[tab].map((method) => (
                <button
  key={method}
  onClick={() => {
    if (tab === "Crypto") {
      handleCryptoRedirect();
    } else if (type === "Withdraw" && (method === "GPay" || method === "Apple Pay")) {
      toast.error(`${method} withdrawals are not currently available.`);
    } else {
      setSelectedMethod(method);
    }
  }}
  className="bg-slate-800 hover:bg-slate-700 p-3 rounded-lg flex items-center justify-center text-center text-sm font-medium"
>
  {method}
</button>

              ))}
            </div>
          ) : tab === "Mobile Money" && selectedMethod === "Mpesa" && type === "Deposit" ? (
  showSTKForm ? (
    <MpesaForm
      type="Deposit"
      phone={phone}
      setPhone={setPhone}
      amount={amount}
      setAmount={setAmount}
      minAmount={minAmount}
      fee={fee}
      isInvalidPrefix={isInvalidPrefix}
      isInvalidLength={isInvalidLength}
      isNonNumeric={isNonNumeric}
      exceedsBalance={false}
      isAmountTooLow={isAmountTooLow}
      disableMpesaDeposit={disableMpesaDeposit}
      disableMpesaWithdraw={false}
      loading={loading}
      setLoading={setLoading}
      onBack={() => setShowSTKForm(false)} // ✅ Pass back toggle
    />
  ) : (
    <MpesaUnavailable onSTKToggle={() => setShowSTKForm(true)} />
  )
)
 : tab === "Mobile Money" && selectedMethod === "Mpesa" && type === "Withdraw" ? (
  // your existing Withdraw form here

            <MpesaForm
  type="Withdraw"
  phone={phone}
  setPhone={setPhone}
  amount={amount}
  setAmount={setAmount}
  minAmount={minAmount}
  fee={fee}
  isInvalidPrefix={isInvalidPrefix}
  isInvalidLength={isInvalidLength}
  isNonNumeric={isNonNumeric}
  exceedsBalance={exceedsBalance}
  isAmountTooLow={isAmountTooLow}
  disableMpesaDeposit={disableMpesaDeposit}
  disableMpesaWithdraw={disableMpesaWithdraw}
  loading={loading}
  setLoading={setLoading}
/>

          ) : type === "Withdraw" && (tab === "Bank Transfer" || tab === "Others") ? (
            <div className="space-y-4 bg-[#1e293b] p-4 rounded-lg border border-slate-600">
              <div className="text-center">
                <div className="bg-orange-500 w-12 h-12 mx-auto rounded-full flex items-center justify-center">
                  <DollarSign size={24} />
                </div>
                <p className="mt-2 font-semibold text-lg">{selectedMethod} Withdrawal</p>
                <p className="text-sm text-slate-400">Enter recipient details for manual processing</p>
              </div>

              <Input
                placeholder="Recipient Full Name"
                className="bg-slate-800 text-white border border-slate-600 placeholder:text-slate-400"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
              <Input
                placeholder="Acc No / ID / UID / Tag"
                className="bg-slate-800 text-white border border-slate-600 placeholder:text-slate-400"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
              <Input
                placeholder="IBAN (if applicable)"
                className="bg-slate-800 text-white border border-slate-600 placeholder:text-slate-400"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
              />
              <Input
                placeholder="SWIFT / BIC Code"
                className="bg-slate-800 text-white border border-slate-600 placeholder:text-slate-400"
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
              />
              <Input
                placeholder="Amount (USD)"
                type="number"
                className="bg-slate-800 text-white border border-slate-600 placeholder:text-slate-400"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />

{type === "Withdraw" && isWithdrawAmountTooLow && (
  <p className="text-red-500 text-xs">Minimum withdrawal is $20</p>
)}

{type === "Withdraw" && exceedsMpesaBalance && (
  <p className="text-red-500 text-xs">Amount exceeds available balance</p>
)}

              {isWithdrawAmountTooLow && (
                <p className="text-red-500 text-xs">Minimum withdrawal is ${minAmount}</p>
              )}
              {exceedsBalance && (
                <p className="text-red-500 text-xs">Amount exceeds available balance</p>
              )}
              {invalidIban && (
                <p className="text-red-500 text-xs">Invalid IBAN format</p>
              )}
              {invalidSwift && (
                <p className="text-red-500 text-xs">Invalid SWIFT/BIC code</p>
              )}

              <div className="bg-slate-900 border border-orange-400 p-3 rounded text-sm">
                <p><strong>Service Fee:</strong> {feeWithdraw.toFixed(2)} USD (1.5%)</p>
                <p><strong>Processing Time:</strong> 1-3 Business Days</p>
              </div>

              <Button
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={
                  !recipientName ||
                  !accountNumber ||
                  !withdrawAmount ||
                  !iban ||
                  !swiftCode ||
                  isWithdrawAmountTooLow ||
                  exceedsBalance ||
                  invalidIban ||
                  invalidSwift ||
                  loading
                }
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    toast.success("Withdrawal requested!");
                    toast("Your bank withdrawal is under review.", { duration: 5000 });
                    setLoading(false);
                  }, 5000);
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </div>
                ) : (
                  "Request Withdrawal"
                )}
              </Button>
            </div>
          ) : paymentInstructions[selectedMethod || ""] ? (
            <div className="space-y-4 bg-[#1e293b] p-4 rounded-lg border border-slate-600">
              <div className="text-center">
                <div className="bg-orange-500 w-12 h-12 mx-auto rounded-full flex items-center justify-center">
                  <DollarSign size={24} />
                </div>
                <p className="mt-2 font-semibold text-lg">
                  {paymentInstructions[selectedMethod].title}
                </p>
                <p className="text-sm text-slate-400">
                  Follow the instructions below to complete your {type.toLowerCase()}
                </p>
              </div>

              <ul className="list-disc list-inside text-sm text-white space-y-1">
                {paymentInstructions[selectedMethod].steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>

              <p className="text-xs text-center text-slate-400 mt-4">
                Email proof of transfer to{" "}
                <span className="text-orange-400">support@tradify.app</span>
              </p>
            </div>
          ) : (
            <div className="text-sm text-slate-400 text-center p-4">
              <p><strong>{selectedMethod}</strong> currently not available.</p>
              <p className="text-orange-500">
                Use crypto on-chain {type === "Withdraw" ? "withdrawals" : "deposits"} instead.
              </p>
            </div>
          )}

          <div className="text-right mt-4">
            <Button variant="secondary" onClick={() => { onClose(); resetState(); }}>
              Close
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DepositWithdrawModal;

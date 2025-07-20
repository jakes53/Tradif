import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, ClipboardCopy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  onSTKToggle: () => void;
}

const MpesaUnavailable = ({ onSTKToggle }: Props) => {
  const [whatsNo, setWhatsNo] = useState("");
  const businessNumber = "880100";
  const accountNumber = "6893090016";

  useEffect(() => {
    const fetchWhatsApp = async () => {
      const { data } = await supabase
        .from("strategy_stats")
        .select("whats_no")
        .single();
      if (data?.whats_no) setWhatsNo(data.whats_no);
    };
    fetchWhatsApp();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  return (
    <div className="space-y-4 bg-[#1e293b] p-5 rounded-lg border border-slate-600 text-left text-white">
      <div className="text-center">
        <div className="bg-orange-500 w-12 h-12 mx-auto rounded-full flex items-center justify-center">
          <Phone size={24} />
        </div>
        <h3 className="text-lg font-semibold mt-2">M-Pesa Paybill Deposit</h3>
        <p className="text-sm text-slate-400 mt-1">STK Push is currently unavailable.</p>
      </div>

      <div className="space-y-3 text-sm">
        <p>Please follow these steps to deposit funds manually via M-Pesa:</p>

        <ol className="list-decimal list-inside space-y-1">
          <li>Open the <strong>M-Pesa</strong> menu on your phone.</li>
          <li>Select <strong>Lipa na M-Pesa</strong>.</li>
          <li>Choose <strong>Paybill</strong>.</li>
          <li>
            Enter the <strong>Business Number</strong>: <span className="text-orange-400">{businessNumber}</span>{" "}
            <ClipboardCopy
              size={14}
              className="inline cursor-pointer ml-1 text-orange-400"
              onClick={() => copyToClipboard(businessNumber, "Business Number")}
            />
          </li>
          <li>
            Enter the <strong>Account Number</strong>: <span className="text-orange-400">{accountNumber}</span>{" "}
            <ClipboardCopy
              size={14}
              className="inline cursor-pointer ml-1 text-orange-400"
              onClick={() => copyToClipboard(accountNumber, "Account Number")}
            />
          </li>
          <li>Enter the amount you wish to deposit (in KES).</li>
          <li>Enter your M-Pesa PIN and press OK.</li>
        </ol>

        <p className="text-xs text-slate-400 mt-2 italic">
          Once done, the funds will be processed and reflected on your dashboard within a few minutes.
        </p>

        <Button
          onClick={onSTKToggle}
          className="w-full bg-orange-600 hover:bg-orange-700 mt-4"
        >
          Use STK Push Instead
        </Button>

        <div className="text-center mt-4 text-xs text-slate-400">
          Need help? Email{" "}
          <a
            href="mailto:jeffreycouture43@gmail.com"
            className="text-orange-400 underline"
          >
            jeffreycouture43@gmail.com
          </a>{" "}
          or WhatsApp us at{" "}
          <a
            href={`https://wa.me/${whatsNo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 underline"
          >
            {whatsNo || "loading..."}
          </a>
        </div>
      </div>
    </div>
  );
};

export default MpesaUnavailable;

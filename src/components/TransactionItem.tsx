
import React from "react";
import { Transaction } from "@/types/crypto";
import { formatCurrency } from "@/utils/formatters";

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { type, cryptoSymbol, amount, price, total, timestamp } = transaction;
  
  const formattedDate = new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  
  const formattedTime = new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  
  return (
    <div className="flex items-center py-3 border-b border-gray-200 last:border-0">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
        type === "buy" ? "bg-green-100 text-crypto-green" : "bg-red-100 text-crypto-red"
      }`}>
        {type === "buy" ? "+" : "-"}
      </div>
      
      <div className="flex-1">
        <p className="font-medium">
          {type === "buy" ? "Bought" : "Sold"} {amount} {cryptoSymbol}
        </p>
        <p className="text-sm text-gray-500">
          {formattedDate} at {formattedTime}
        </p>
      </div>
      
      <div className="text-right">
        <p className={`font-medium ${type === "buy" ? "text-crypto-green" : "text-crypto-red"}`}>
          {type === "buy" ? "-" : "+"}{formatCurrency(total)}
        </p>
        <p className="text-sm text-gray-500">
          Price: {formatCurrency(price)}
        </p>
      </div>
    </div>
  );
};

export default TransactionItem;


import React from "react";
import { Cryptocurrency } from "@/types/crypto";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface CryptoCardProps {
  crypto: Cryptocurrency;
  onClick?: () => void;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ crypto, onClick }) => {
  const isPositiveChange = crypto.priceChangePercentage24h >= 0;

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer" 
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={crypto.image} 
              alt={crypto.name} 
              className="w-10 h-10 mr-3 rounded-full" 
            />
            <div>
              <h3 className="font-semibold">{crypto.name}</h3>
              <p className="text-sm text-gray-500">{crypto.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatCurrency(crypto.currentPrice)}</p>
            <div className={`flex items-center text-sm ${isPositiveChange ? "text-crypto-green" : "text-crypto-red"}`}>
              {isPositiveChange ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              <span>{Math.abs(crypto.priceChangePercentage24h).toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoCard;

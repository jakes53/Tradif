import React, { useState, useEffect } from "react";
import { PortfolioAsset } from "@/types/crypto";
import { formatCurrency, formatPercentage } from "@/utils/formatters";

interface AssetItemProps {
  asset: PortfolioAsset;
  updatedPrice?: number;
}

const AssetItem: React.FC<AssetItemProps> = ({ asset, updatedPrice }) => {
  const [priceClass, setPriceClass] = useState("");
  const [displayPrice, setDisplayPrice] = useState(asset.currentPrice);

  useEffect(() => {
    if (updatedPrice !== undefined && updatedPrice !== asset.currentPrice) {
      setPriceClass(updatedPrice > asset.currentPrice ? "text-crypto-green" : "text-crypto-red");
      setDisplayPrice(updatedPrice);

      const timer = setTimeout(() => {
        setPriceClass("");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [updatedPrice, asset.currentPrice]);

  return (
    <div className="flex items-center py-3 border-b border-gray-200 last:border-0">
      <div className="flex items-center flex-1">
        <img src={asset.image} alt={asset.name} className="w-8 h-8 mr-3" />
        <div>
          <p className="font-medium">{asset.name}</p>
          <p className="text-sm text-gray-500 uppercase">{asset.symbol}</p>
        </div>
      </div>
      <div className="text-right flex-1">
        <p className={`font-medium transition-colors duration-500 ${priceClass}`}>
          {formatCurrency(displayPrice)}
        </p>
        <p className="text-sm text-gray-500">
          {asset.amount} {asset.symbol.toUpperCase()} • {formatPercentage(asset.allocation)}
        </p>
      </div>
    </div>
  );
};

export default AssetItem;

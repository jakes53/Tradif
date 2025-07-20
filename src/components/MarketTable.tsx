import React from "react";
import { Cryptocurrency } from "@/types/crypto";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatLargeNumber } from "@/utils/formatters";

interface MarketTableProps {
  cryptocurrencies: Cryptocurrency[];
}

const MarketTable: React.FC<MarketTableProps> = ({ cryptocurrencies }) => {
  const navigate = useNavigate();
  
  const handleRowClick = (cryptoId: string) => {
    navigate(`/trade?crypto=${cryptoId}`);
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Cryptocurrency</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">24h Change</TableHead>
            <TableHead className="text-right">Market Cap</TableHead>
            <TableHead className="text-right">Volume (24h)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cryptocurrencies.map((crypto, index) => (
            <TableRow 
              key={crypto.id} 
              onClick={() => handleRowClick(crypto.id)}
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <img 
                    src={crypto.image} 
                    alt={crypto.name} 
                    className="w-6 h-6 mr-2" 
                  />
                  <div>
                    <p className="font-medium">{crypto.name}</p>
                    <p className="text-xs text-gray-500">{crypto.symbol}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(crypto.currentPrice)}
              </TableCell>
              <TableCell className={`text-right ${
                crypto.priceChangePercentage24h >= 0 
                  ? "text-crypto-green" 
                  : "text-crypto-red"
              }`}>
                <div className="flex items-center justify-end">
                  {crypto.priceChangePercentage24h >= 0 
                    ? <ArrowUp size={14} className="mr-1" /> 
                    : <ArrowDown size={14} className="mr-1" />
                  }
                  {Math.abs(crypto.priceChangePercentage24h).toFixed(2)}%
                </div>
              </TableCell>
              <TableCell className="text-right">
                {formatLargeNumber(crypto.marketCap)}
              </TableCell>
              <TableCell className="text-right">
                {formatLargeNumber(crypto.volume24h)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MarketTable;

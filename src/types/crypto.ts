
export interface Cryptocurrency {
    id: string;
    name: string;
    symbol: string;
    currentPrice: number;
    priceChangePercentage24h: number;
    image: string;
    marketCap: number;
    volume24h: number;
    priceChange24h: number;
  }
  
  export interface Transaction {
    id: string;
    type: 'buy' | 'sell';
    cryptoId: string;
    cryptoSymbol: string;
    cryptoName: string;
    amount: number;
    price: number;
    total: number;
    timestamp: Date;
  }
  
  export interface Portfolio {
    totalValue: number;
    assets: PortfolioAsset[];
  }
  
  export interface PortfolioAsset {
    cryptoId: string;
    name: string;
    symbol: string;
    image: string;
    amount: number;
    currentPrice: number;
    value: number;
    allocation: number;
  }
  
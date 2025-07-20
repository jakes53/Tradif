
import { Cryptocurrency } from "@/types/crypto";

// Base URL for CoinGecko API
const API_BASE_URL = "https://api.coingecko.com/api/v3";

// Function to fetch cryptocurrency data
export const fetchCryptocurrencies = async (): Promise<Cryptocurrency[]> => {
  try {
    // Fetch top cryptocurrencies with market data
    const response = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map the response to our Cryptocurrency type
    return data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      currentPrice: coin.current_price,
      priceChangePercentage24h: coin.price_change_percentage_24h || 0,
      image: coin.image,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume
    }));
  } catch (error) {
    console.error("Error fetching cryptocurrency data:", error);
    throw error;
  }
};

// Function to fetch a specific cryptocurrency by ID
export const fetchCryptocurrencyById = async (id: string): Promise<Cryptocurrency> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const coin = await response.json();
    
    return {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      currentPrice: coin.market_data.current_price.usd,
      priceChangePercentage24h: coin.market_data.price_change_percentage_24h || 0,
      image: coin.image.large,
      marketCap: coin.market_data.market_cap.usd,
      volume24h: coin.market_data.total_volume.usd
    };
  } catch (error) {
    console.error(`Error fetching cryptocurrency ${id}:`, error);
    throw error;
  }
};

// Function to fetch multiple cryptocurrencies by IDs
export const fetchCryptocurrenciesByIds = async (ids: string[]): Promise<Cryptocurrency[]> => {
  if (ids.length === 0) return [];
  
  try {
    const idsParam = ids.join(',');
    const response = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${idsParam}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map the response to our Cryptocurrency type
    return data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      currentPrice: coin.current_price,
      priceChangePercentage24h: coin.price_change_percentage_24h || 0,
      image: coin.image,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume
    }));
  } catch (error) {
    console.error("Error fetching cryptocurrencies by IDs:", error);
    throw error;
  }
};

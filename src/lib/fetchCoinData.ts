// src/lib/fetchCoinData.ts

export interface CoinCandle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export async function fetchCoinData(
  coinId: string = "bitcoin", 
  days: number = 1,
  interval: string = "daily" // Updated to accept daily, hourly, etc.
): Promise<CoinCandle[]> {
  try {
    // Map interval strings to correct API parameters
    const validIntervals: { [key: string]: string } = {
      hourly: '1h',
      daily: '1d',
      weekly: '1w',
    };

    const timeFrame = validIntervals[interval] || validIntervals['daily']; // Default to 'daily'

    // Fetch OHLC data for the coin
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}&interval=${timeFrame}`);
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    // Parse response data
    const data: [number, number, number, number, number][] = await res.json();
    
    // Map data to the CoinCandle format
    return data.map(([timestamp, open, high, low, close]) => ({
      timestamp,
      open,
      high,
      low,
      close
    }));
  } catch (error) {
    console.error("Error fetching coin data:", error);
    return [];
  }
}

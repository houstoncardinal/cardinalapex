import { useState, useEffect, useCallback, useRef } from 'react';

export interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

export interface HistoricalPrice {
  date: string;
  price: number;
  volume: number;
  timestamp: number;
}

const CRYPTO_SYMBOLS = ['BTC', 'ETH', 'SOL', 'DOGE', 'ADA', 'XRP', 'DOT', 'LINK'];
const STOCK_SYMBOLS = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META'];

// CoinGecko API (free, no key required)
const COINGECKO_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  DOGE: 'dogecoin',
  ADA: 'cardano',
  XRP: 'ripple',
  DOT: 'polkadot',
  LINK: 'chainlink',
};

export const useLivePrice = (symbol: string, market: 'crypto' | 'stocks' = 'crypto') => {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCryptoPrice = useCallback(async (sym: string) => {
    const geckoId = COINGECKO_IDS[sym];
    if (!geckoId) {
      // Fallback to simulated data for unsupported symbols
      return generateSimulatedPrice(sym);
    }

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${geckoId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch price');
      }
      
      const data = await response.json();
      const coinData = data[geckoId];
      
      return {
        symbol: sym,
        price: coinData.usd,
        change24h: coinData.usd_24h_change || 0,
        volume24h: coinData.usd_24h_vol || 0,
        high24h: coinData.usd * 1.02,
        low24h: coinData.usd * 0.98,
        timestamp: Date.now(),
      };
    } catch (err) {
      console.warn('CoinGecko fetch failed, using simulated data');
      return generateSimulatedPrice(sym);
    }
  }, []);

  const fetchHistoricalData = useCallback(async (sym: string, days: number = 30) => {
    const geckoId = COINGECKO_IDS[sym];
    if (!geckoId) {
      return generateSimulatedHistory(sym, days);
    }

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${geckoId}/market_chart?vs_currency=usd&days=${days}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch historical data');
      }
      
      const data = await response.json();
      
      return data.prices.map((point: [number, number], index: number) => ({
        date: new Date(point[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: point[1],
        volume: data.total_volumes[index]?.[1] || 0,
        timestamp: point[0],
      }));
    } catch (err) {
      console.warn('CoinGecko historical fetch failed, using simulated data');
      return generateSimulatedHistory(sym, days);
    }
  }, []);

  const generateSimulatedPrice = (sym: string): PriceData => {
    const basePrices: Record<string, number> = {
      BTC: 95000,
      ETH: 3500,
      SOL: 180,
      DOGE: 0.35,
      AAPL: 195,
      TSLA: 380,
      NVDA: 950,
      MSFT: 420,
    };
    
    const basePrice = basePrices[sym] || 100;
    const variance = (Math.random() - 0.5) * 0.02;
    
    return {
      symbol: sym,
      price: basePrice * (1 + variance),
      change24h: (Math.random() - 0.5) * 10,
      volume24h: basePrice * 1000000 * (0.5 + Math.random()),
      high24h: basePrice * 1.03,
      low24h: basePrice * 0.97,
      timestamp: Date.now(),
    };
  };

  const generateSimulatedHistory = (sym: string, days: number): HistoricalPrice[] => {
    const basePrices: Record<string, number> = {
      BTC: 90000,
      ETH: 3300,
      SOL: 160,
      DOGE: 0.30,
      AAPL: 185,
      TSLA: 350,
      NVDA: 900,
      MSFT: 400,
    };
    
    const basePrice = basePrices[sym] || 100;
    const data: HistoricalPrice[] = [];
    let currentPrice = basePrice;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const trend = Math.sin(i / 7) * 0.02;
      const noise = (Math.random() - 0.5) * 0.03;
      currentPrice = currentPrice * (1 + trend + noise);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: currentPrice,
        volume: basePrice * 500000 * (0.5 + Math.random()),
        timestamp: date.getTime(),
      });
    }
    
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const price = market === 'crypto' 
          ? await fetchCryptoPrice(symbol)
          : generateSimulatedPrice(symbol);
        
        setPriceData(price);
        
        const history = await fetchHistoricalData(symbol, 30);
        setHistoricalData(history);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch price data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh every 30 seconds
    intervalRef.current = setInterval(fetchData, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [symbol, market, fetchCryptoPrice, fetchHistoricalData]);

  return { priceData, historicalData, loading, error, refetch: () => {
    const fetchData = async () => {
      const price = market === 'crypto' 
        ? await fetchCryptoPrice(symbol)
        : generateSimulatedPrice(symbol);
      setPriceData(price);
    };
    fetchData();
  }};
};

export const useLivePrices = (symbols: string[], market: 'crypto' | 'stocks' = 'crypto') => {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPrices = async () => {
      setLoading(true);
      
      if (market === 'crypto') {
        const geckoIds = symbols
          .map(s => COINGECKO_IDS[s])
          .filter(Boolean)
          .join(',');
        
        if (geckoIds) {
          try {
            const response = await fetch(
              `https://api.coingecko.com/api/v3/simple/price?ids=${geckoIds}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`
            );
            
            if (response.ok) {
              const data = await response.json();
              const priceMap: Record<string, PriceData> = {};
              
              symbols.forEach(sym => {
                const geckoId = COINGECKO_IDS[sym];
                if (geckoId && data[geckoId]) {
                  priceMap[sym] = {
                    symbol: sym,
                    price: data[geckoId].usd,
                    change24h: data[geckoId].usd_24h_change || 0,
                    volume24h: data[geckoId].usd_24h_vol || 0,
                    high24h: data[geckoId].usd * 1.02,
                    low24h: data[geckoId].usd * 0.98,
                    timestamp: Date.now(),
                  };
                }
              });
              
              setPrices(priceMap);
            }
          } catch (err) {
            console.warn('Failed to fetch batch prices');
          }
        }
      }
      
      setLoading(false);
    };

    fetchAllPrices();
    const interval = setInterval(fetchAllPrices, 30000);
    
    return () => clearInterval(interval);
  }, [symbols, market]);

  return { prices, loading };
};

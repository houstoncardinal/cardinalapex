import { useState, useEffect, useCallback } from 'react';

export interface MemeCoinPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

const MEME_COINS = [
  { symbol: 'BONK', name: 'Bonk', id: 'bonk' },
  { symbol: 'WIF', name: 'dogwifhat', id: 'dogwifcoin' },
  { symbol: 'PEPE', name: 'Pepe', id: 'pepe' },
  { symbol: 'SHIB', name: 'Shiba Inu', id: 'shiba-inu' },
  { symbol: 'FLOKI', name: 'Floki', id: 'floki' },
  { symbol: 'DOGE', name: 'Dogecoin', id: 'dogecoin' },
  { symbol: 'MEME', name: 'Memecoin', id: 'memecoin-2' },
  { symbol: 'MYRO', name: 'Myro', id: 'myro' },
  { symbol: 'POPCAT', name: 'PopCat', id: 'popcat' },
  { symbol: 'MEW', name: 'cat in a dogs world', id: 'cat-in-a-dogs-world' },
  { symbol: 'BOME', name: 'BOOK OF MEME', id: 'book-of-meme' },
];

const JUPITER_PRICE_API = 'https://price.jup.ag/v6/price';

export const useMemeCoinsPrice = () => {
  const [prices, setPrices] = useState<Record<string, MemeCoinPrice>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch from Jupiter for Solana meme coins
      const symbols = MEME_COINS.map(c => c.symbol).join(',');
      const response = await fetch(`${JUPITER_PRICE_API}?ids=${symbols}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }

      const data = await response.json();
      const newPrices: Record<string, MemeCoinPrice> = {};

      for (const coin of MEME_COINS) {
        const priceData = data.data?.[coin.symbol];
        newPrices[coin.symbol] = {
          symbol: coin.symbol,
          name: coin.name,
          price: priceData?.price || 0,
          change24h: 0, // Jupiter doesn't provide 24h change
          volume24h: 0,
          marketCap: 0,
        };
      }

      setPrices(newPrices);
    } catch (err: any) {
      console.error('Failed to fetch meme coin prices:', err);
      setError(err.message);
      
      // Set fallback prices
      const fallbackPrices: Record<string, MemeCoinPrice> = {};
      for (const coin of MEME_COINS) {
        fallbackPrices[coin.symbol] = {
          symbol: coin.symbol,
          name: coin.name,
          price: 0,
          change24h: 0,
          volume24h: 0,
          marketCap: 0,
        };
      }
      setPrices(fallbackPrices);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return {
    prices,
    loading,
    error,
    refresh: fetchPrices,
    coins: MEME_COINS,
  };
};
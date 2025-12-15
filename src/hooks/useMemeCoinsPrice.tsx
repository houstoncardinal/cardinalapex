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
const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price';

export const useMemeCoinsPrice = () => {
  const [prices, setPrices] = useState<Record<string, MemeCoinPrice>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      setError(null);
      
      // Try Jupiter first for Solana tokens
      const symbols = MEME_COINS.map(c => c.symbol).join(',');
      let jupiterPrices: Record<string, any> = {};
      
      try {
        const jupiterResponse = await fetch(`${JUPITER_PRICE_API}?ids=${symbols}`);
        if (jupiterResponse.ok) {
          const jupiterData = await jupiterResponse.json();
          jupiterPrices = jupiterData.data || {};
        }
      } catch (jupErr) {
        console.warn('Jupiter price fetch failed, trying CoinGecko');
      }

      // Fallback to CoinGecko for 24h change data
      const ids = MEME_COINS.map(c => c.id).join(',');
      let geckoData: Record<string, any> = {};
      
      try {
        const geckoResponse = await fetch(
          `${COINGECKO_API}?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`
        );
        if (geckoResponse.ok) {
          geckoData = await geckoResponse.json();
        }
      } catch (geckoErr) {
        console.warn('CoinGecko fetch failed');
      }

      const newPrices: Record<string, MemeCoinPrice> = {};

      for (const coin of MEME_COINS) {
        const jupPrice = jupiterPrices[coin.symbol]?.price || 0;
        const geckoInfo = geckoData[coin.id] || {};
        
        // Use Jupiter price if available, otherwise CoinGecko
        const price = jupPrice || geckoInfo.usd || 0;
        
        newPrices[coin.symbol] = {
          symbol: coin.symbol,
          name: coin.name,
          price,
          change24h: geckoInfo.usd_24h_change || 0,
          volume24h: geckoInfo.usd_24h_vol || 0,
          marketCap: 0,
        };
      }

      setPrices(newPrices);
    } catch (err: any) {
      console.error('Failed to fetch meme coin prices:', err);
      setError(err.message);
      
      // Set fallback prices with simulated 24h changes for demo
      const fallbackPrices: Record<string, MemeCoinPrice> = {};
      for (const coin of MEME_COINS) {
        fallbackPrices[coin.symbol] = {
          symbol: coin.symbol,
          name: coin.name,
          price: 0,
          change24h: (Math.random() - 0.5) * 20, // Random -10% to +10%
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
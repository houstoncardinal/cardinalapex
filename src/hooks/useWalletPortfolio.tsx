import { useState, useEffect, useCallback } from 'react';
import { usePhantomWallet } from './usePhantomWallet';
import { TOKEN_INFO } from './useSolanaTrading';

export interface TokenBalance {
  symbol: string;
  name: string;
  mint: string;
  balance: number;
  usdValue: number;
  price: number;
  change24h: number;
  decimals: number;
}

export interface WalletPortfolio {
  totalValue: number;
  change24h: number;
  change24hPercent: number;
  tokens: TokenBalance[];
  loading: boolean;
  error: string | null;
}

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';
const JUPITER_PRICE_API = 'https://price.jup.ag/v6/price';

// Known token mints for detection
const KNOWN_MINTS: Record<string, string> = {
  'So11111111111111111111111111111111111111112': 'SOL',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'USDC',
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'USDT',
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': 'BONK',
  'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm': 'WIF',
  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN': 'JUP',
  '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R': 'RAY',
  'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE': 'ORCA',
  '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU': 'PEPE',
  'CiKu4eHsVrc1eueVQeHn7qhXTcVu95gSQmBpX4utjL9z': 'SHIB',
  'FLiPggWYQyKVTULFWMQjAk26JfK5XRCajfyLfJi1HpVf': 'FLOKI',
};

export const useWalletPortfolio = () => {
  const { connected, publicKey, balance } = usePhantomWallet();
  const [portfolio, setPortfolio] = useState<WalletPortfolio>({
    totalValue: 0,
    change24h: 0,
    change24hPercent: 0,
    tokens: [],
    loading: false,
    error: null,
  });

  const fetchTokenAccounts = useCallback(async (walletAddress: string) => {
    try {
      const response = await fetch(SOLANA_RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getTokenAccountsByOwner',
          params: [
            walletAddress,
            { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
            { encoding: 'jsonParsed' },
          ],
        }),
      });

      const data = await response.json();
      return data.result?.value || [];
    } catch (error) {
      console.error('Failed to fetch token accounts:', error);
      return [];
    }
  }, []);

  const fetchPrices = useCallback(async (symbols: string[]) => {
    try {
      const ids = symbols.join(',');
      const response = await fetch(`${JUPITER_PRICE_API}?ids=${ids}`);
      const data = await response.json();
      return data.data || {};
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      return {};
    }
  }, []);

  const refreshPortfolio = useCallback(async () => {
    if (!connected || !publicKey) {
      setPortfolio(prev => ({ ...prev, tokens: [], totalValue: 0 }));
      return;
    }

    setPortfolio(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Fetch SOL balance and token accounts in parallel
      const [tokenAccounts] = await Promise.all([
        fetchTokenAccounts(publicKey),
      ]);

      const tokens: TokenBalance[] = [];
      const mintsToPrice: string[] = ['SOL'];

      // Add SOL balance
      const solBalance = balance || 0;
      
      // Process token accounts
      for (const account of tokenAccounts) {
        const info = account.account?.data?.parsed?.info;
        if (!info) continue;

        const mint = info.mint;
        const amount = parseFloat(info.tokenAmount?.uiAmountString || '0');
        
        if (amount > 0) {
          const symbol = KNOWN_MINTS[mint] || mint.slice(0, 6);
          mintsToPrice.push(symbol);
          
          tokens.push({
            symbol,
            name: TOKEN_INFO[symbol]?.name || symbol,
            mint,
            balance: amount,
            usdValue: 0,
            price: 0,
            change24h: 0,
            decimals: TOKEN_INFO[symbol]?.decimals || info.tokenAmount?.decimals || 9,
          });
        }
      }

      // Fetch prices
      const prices = await fetchPrices(mintsToPrice);
      
      // Calculate SOL value
      const solPrice = prices['SOL']?.price || 0;
      const solValue = solBalance * solPrice;
      
      // Add SOL as first token
      tokens.unshift({
        symbol: 'SOL',
        name: 'Solana',
        mint: 'So11111111111111111111111111111111111111112',
        balance: solBalance,
        usdValue: solValue,
        price: solPrice,
        change24h: 0,
        decimals: 9,
      });

      // Calculate token values
      let totalValue = solValue;
      for (const token of tokens) {
        if (token.symbol === 'SOL') continue;
        
        const priceData = prices[token.symbol];
        if (priceData) {
          token.price = priceData.price || 0;
          token.usdValue = token.balance * token.price;
          totalValue += token.usdValue;
        }
      }

      // Sort by value
      tokens.sort((a, b) => b.usdValue - a.usdValue);

      setPortfolio({
        totalValue,
        change24h: 0,
        change24hPercent: 0,
        tokens,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Portfolio fetch error:', error);
      setPortfolio(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch portfolio',
      }));
    }
  }, [connected, publicKey, balance, fetchTokenAccounts, fetchPrices]);

  // Auto-refresh on connection
  useEffect(() => {
    if (connected && publicKey) {
      refreshPortfolio();
    }
  }, [connected, publicKey, refreshPortfolio]);

  // Periodic refresh every 30 seconds
  useEffect(() => {
    if (!connected) return;
    
    const interval = setInterval(refreshPortfolio, 30000);
    return () => clearInterval(interval);
  }, [connected, refreshPortfolio]);

  return {
    ...portfolio,
    refreshPortfolio,
    isConnected: connected,
    walletAddress: publicKey,
  };
};
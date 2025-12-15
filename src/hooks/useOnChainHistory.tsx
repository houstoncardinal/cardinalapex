import { useState, useEffect, useCallback } from 'react';
import { usePhantomWallet } from './usePhantomWallet';

export interface OnChainTransaction {
  signature: string;
  blockTime: number;
  slot: number;
  type: 'swap' | 'transfer' | 'unknown';
  status: 'success' | 'failed';
  fee: number;
  // For swaps
  inputToken?: string;
  outputToken?: string;
  inputAmount?: number;
  outputAmount?: number;
  // For transfers
  direction?: 'in' | 'out';
  amount?: number;
  otherAddress?: string;
  // P&L tracking
  solPriceAtTime?: number;
  currentSolPrice?: number;
  estimatedPnL?: number;
  pnlPercent?: number;
}

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';
const JUPITER_PRICE_API = 'https://price.jup.ag/v6/price';

// Fetch current SOL price
const fetchCurrentSolPrice = async (): Promise<number> => {
  try {
    const response = await fetch(`${JUPITER_PRICE_API}?ids=SOL`);
    const data = await response.json();
    return data.data?.SOL?.price || 0;
  } catch {
    return 0;
  }
};

// Estimate historical SOL price based on block time (simplified - uses current price with time-based adjustment)
const estimateHistoricalPrice = (currentPrice: number, blockTime: number): number => {
  const now = Date.now() / 1000;
  const ageInDays = (now - blockTime) / 86400;
  
  // Simple volatility model: older transactions have more price uncertainty
  // This is an approximation - in production, you'd use a price oracle or historical API
  const volatilityFactor = Math.min(ageInDays * 0.02, 0.3); // Max 30% variance
  const randomVariance = (Math.random() - 0.5) * 2 * volatilityFactor;
  
  return currentPrice * (1 + randomVariance);
};

export const useOnChainHistory = (limit: number = 25) => {
  const { connected, publicKey } = usePhantomWallet();
  const [transactions, setTransactions] = useState<OnChainTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSolPrice, setCurrentSolPrice] = useState<number>(0);

  const fetchTransactions = useCallback(async () => {
    if (!connected || !publicKey) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch current SOL price for P&L calculations
      const solPrice = await fetchCurrentSolPrice();
      setCurrentSolPrice(solPrice);

      // Get recent signatures
      const sigResponse = await fetch(SOLANA_RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getSignaturesForAddress',
          params: [publicKey, { limit }],
        }),
      });

      const sigData = await sigResponse.json();
      const signatures = sigData.result || [];

      if (signatures.length === 0) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      // Parse transactions with P&L estimates
      const txns: OnChainTransaction[] = signatures.map((sig: any) => {
        const blockTime = sig.blockTime || 0;
        const historicalPrice = estimateHistoricalPrice(solPrice, blockTime);
        
        // Estimate transaction amount (in production, parse actual tx data)
        const estimatedAmount = 0.1 + Math.random() * 0.5; // Demo: 0.1-0.6 SOL
        const currentValue = estimatedAmount * solPrice;
        const historicalValue = estimatedAmount * historicalPrice;
        const pnl = currentValue - historicalValue;
        const pnlPercent = historicalValue > 0 ? (pnl / historicalValue) * 100 : 0;

        const tx: OnChainTransaction = {
          signature: sig.signature,
          blockTime,
          slot: sig.slot,
          type: sig.memo?.includes('jupiter') ? 'swap' : 'unknown',
          status: sig.err ? 'failed' : 'success',
          fee: 0.000005, // Standard fee
          amount: estimatedAmount,
          solPriceAtTime: historicalPrice,
          currentSolPrice: solPrice,
          estimatedPnL: pnl,
          pnlPercent,
        };

        return tx;
      });

      setTransactions(txns);
    } catch (err: any) {
      console.error('Failed to fetch transactions:', err);
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [connected, publicKey, limit]);

  // Fetch on connection
  useEffect(() => {
    if (connected && publicKey) {
      fetchTransactions();
    }
  }, [connected, publicKey, fetchTransactions]);

  const getSolscanUrl = useCallback((signature: string) => {
    return `https://solscan.io/tx/${signature}`;
  }, []);

  const getAddressUrl = useCallback((address: string) => {
    return `https://solscan.io/account/${address}`;
  }, []);

  return {
    transactions,
    loading,
    error,
    refresh: fetchTransactions,
    getSolscanUrl,
    getAddressUrl,
    isConnected: connected,
    walletAddress: publicKey,
    currentSolPrice,
  };
};
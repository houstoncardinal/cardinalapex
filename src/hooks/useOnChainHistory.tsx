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
}

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

export const useOnChainHistory = (limit: number = 25) => {
  const { connected, publicKey } = usePhantomWallet();
  const [transactions, setTransactions] = useState<OnChainTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!connected || !publicKey) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
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

      // Parse transactions
      const txns: OnChainTransaction[] = signatures.map((sig: any) => {
        const tx: OnChainTransaction = {
          signature: sig.signature,
          blockTime: sig.blockTime || 0,
          slot: sig.slot,
          type: 'unknown',
          status: sig.err ? 'failed' : 'success',
          fee: 0,
        };

        // Check memo for Jupiter swap hints
        if (sig.memo?.includes('jupiter')) {
          tx.type = 'swap';
        }

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
  };
};
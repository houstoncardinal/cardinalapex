import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: { toString: () => string };
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  signMessage?: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  signTransaction?: (transaction: unknown) => Promise<unknown>;
  signAllTransactions?: (transactions: unknown[]) => Promise<unknown[]>;
  on: (event: string, callback: () => void) => void;
  off: (event: string, callback: () => void) => void;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
    phantom?: {
      solana?: PhantomProvider;
    };
  }
}

export interface WalletState {
  connected: boolean;
  connecting: boolean;
  publicKey: string | null;
  balance: number | null;
}

export const usePhantomWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    connecting: false,
    publicKey: null,
    balance: null,
  });

  const getProvider = useCallback((): PhantomProvider | null => {
    if ('phantom' in window) {
      const provider = window.phantom?.solana;
      if (provider?.isPhantom) {
        return provider;
      }
    }
    if ('solana' in window && window.solana?.isPhantom) {
      return window.solana;
    }
    return null;
  }, []);

  const fetchBalance = useCallback(async (publicKey: string) => {
    try {
      // Use Solana mainnet-beta RPC
      const response = await fetch('https://api.mainnet-beta.solana.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [publicKey],
        }),
      });
      const data = await response.json();
      if (data.result?.value !== undefined) {
        // Convert lamports to SOL
        const solBalance = data.result.value / 1e9;
        setWalletState(prev => ({ ...prev, balance: solBalance }));
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  }, []);

  const connect = useCallback(async () => {
    const provider = getProvider();
    
    if (!provider) {
      window.open('https://phantom.app/', '_blank');
      toast.error('Phantom wallet not found. Please install it.');
      return;
    }

    try {
      setWalletState(prev => ({ ...prev, connecting: true }));
      const resp = await provider.connect();
      const publicKey = resp.publicKey.toString();
      
      setWalletState({
        connected: true,
        connecting: false,
        publicKey,
        balance: null,
      });
      
      await fetchBalance(publicKey);
      toast.success('Wallet connected!');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWalletState(prev => ({ ...prev, connecting: false }));
      toast.error('Failed to connect wallet');
    }
  }, [getProvider, fetchBalance]);

  const disconnect = useCallback(async () => {
    const provider = getProvider();
    if (provider) {
      try {
        await provider.disconnect();
      } catch (error) {
        console.error('Failed to disconnect:', error);
      }
    }
    setWalletState({
      connected: false,
      connecting: false,
      publicKey: null,
      balance: null,
    });
    toast.success('Wallet disconnected');
  }, [getProvider]);

  // Auto-connect if previously connected
  useEffect(() => {
    const provider = getProvider();
    if (provider) {
      provider.connect({ onlyIfTrusted: true })
        .then((resp) => {
          const publicKey = resp.publicKey.toString();
          setWalletState({
            connected: true,
            connecting: false,
            publicKey,
            balance: null,
          });
          fetchBalance(publicKey);
        })
        .catch(() => {
          // Not previously connected, ignore
        });

      const handleDisconnect = () => {
        setWalletState({
          connected: false,
          connecting: false,
          publicKey: null,
          balance: null,
        });
      };

      provider.on('disconnect', handleDisconnect);
      return () => {
        provider.off('disconnect', handleDisconnect);
      };
    }
  }, [getProvider, fetchBalance]);

  return {
    ...walletState,
    connect,
    disconnect,
    isPhantomInstalled: !!getProvider(),
  };
};

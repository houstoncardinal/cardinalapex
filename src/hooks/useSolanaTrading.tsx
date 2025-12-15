import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { usePhantomWallet } from './usePhantomWallet';

// Solana token mint addresses
const TOKEN_MINTS: Record<string, string> = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  WIF: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
  JUP: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
  RAY: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
  ORCA: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE',
};

// Jupiter API base URL
const JUPITER_API = 'https://quote-api.jup.ag/v6';

export interface TradeParams {
  inputToken: string;
  outputToken: string;
  amount: number; // in SOL or token units
  slippageBps?: number;
  action: 'BUY' | 'SELL';
}

export interface TradeResult {
  success: boolean;
  txSignature?: string;
  inputAmount?: number;
  outputAmount?: number;
  error?: string;
}

export const useSolanaTrading = () => {
  const { connected, publicKey } = usePhantomWallet();
  const [isTrading, setIsTrading] = useState(false);
  const [lastTrade, setLastTrade] = useState<TradeResult | null>(null);

  const getProvider = useCallback(() => {
    if ('phantom' in window) {
      const provider = window.phantom?.solana;
      if (provider?.isPhantom) return provider;
    }
    if ('solana' in window && window.solana?.isPhantom) {
      return window.solana;
    }
    return null;
  }, []);

  const getQuote = async (
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 100 // 1% default slippage
  ) => {
    const url = `${JUPITER_API}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to get swap quote');
    }
    return response.json();
  };

  const getSwapTransaction = async (quoteResponse: any, userPublicKey: string) => {
    const response = await fetch(`${JUPITER_API}/swap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey,
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        dynamicSlippage: { maxBps: 300 },
        prioritizationFeeLamports: {
          priorityLevelWithMaxLamports: {
            maxLamports: 5000000,
            priorityLevel: 'high'
          }
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create swap transaction');
    }
    return response.json();
  };

  const executeTrade = useCallback(async (params: TradeParams): Promise<TradeResult> => {
    if (!connected || !publicKey) {
      toast.error('Please connect your Phantom wallet first');
      return { success: false, error: 'Wallet not connected' };
    }

    const provider = getProvider();
    if (!provider) {
      toast.error('Phantom wallet not found');
      return { success: false, error: 'Phantom wallet not found' };
    }

    setIsTrading(true);
    const toastId = toast.loading('Preparing swap transaction...');

    try {
      // Determine input/output mints based on action
      // BUY = swap SOL/USDC to target token
      // SELL = swap target token to SOL/USDC
      let inputMint: string;
      let outputMint: string;
      let amountInLamports: number;

      if (params.action === 'BUY') {
        inputMint = TOKEN_MINTS.SOL;
        outputMint = TOKEN_MINTS[params.inputToken] || TOKEN_MINTS.SOL;
        amountInLamports = Math.floor(params.amount * 1e9); // SOL to lamports
      } else {
        inputMint = TOKEN_MINTS[params.inputToken] || TOKEN_MINTS.SOL;
        outputMint = TOKEN_MINTS.SOL;
        amountInLamports = Math.floor(params.amount * 1e9);
      }

      // If trading same token, return early
      if (inputMint === outputMint) {
        toast.dismiss(toastId);
        toast.info('Cannot swap same token');
        return { success: false, error: 'Cannot swap same token' };
      }

      toast.loading('Getting best swap route...', { id: toastId });

      // Get quote from Jupiter
      const quoteResponse = await getQuote(
        inputMint,
        outputMint,
        amountInLamports,
        params.slippageBps || 100
      );

      if (!quoteResponse || quoteResponse.error) {
        throw new Error(quoteResponse?.error || 'No quote available');
      }

      toast.loading('Creating transaction...', { id: toastId });

      // Get swap transaction
      const { swapTransaction } = await getSwapTransaction(quoteResponse, publicKey);

      if (!swapTransaction) {
        throw new Error('Failed to create swap transaction');
      }

      toast.loading('Please sign the transaction in Phantom...', { id: toastId });

      // Deserialize transaction
      const swapTransactionBuf = Uint8Array.from(atob(swapTransaction), c => c.charCodeAt(0));
      
      // Import VersionedTransaction dynamically (browser-compatible)
      const { VersionedTransaction, Connection } = await import('@solana/web3.js');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      // Sign with Phantom
      const signedTransaction = await provider.signTransaction!(transaction) as InstanceType<typeof VersionedTransaction>;

      toast.loading('Submitting to Solana network...', { id: toastId });

      // Send to Solana mainnet
      const connection = new Connection(
        'https://api.mainnet-beta.solana.com',
        'confirmed'
      );

      const rawTransaction = signedTransaction.serialize();
      const txSignature = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 3,
      });

      toast.loading('Confirming transaction...', { id: toastId });

      // Confirm transaction
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        signature: txSignature,
      });

      const inputAmount = parseInt(quoteResponse.inAmount) / 1e9;
      const outputAmount = parseInt(quoteResponse.outAmount) / 1e9;

      const result: TradeResult = {
        success: true,
        txSignature,
        inputAmount,
        outputAmount,
      };

      setLastTrade(result);
      toast.dismiss(toastId);
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-bold">Trade Executed on Solana! 🚀</span>
          <span className="text-xs opacity-80">
            Swapped {inputAmount.toFixed(4)} → {outputAmount.toFixed(4)}
          </span>
          <a 
            href={`https://solscan.io/tx/${txSignature}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary underline"
          >
            View on Solscan ↗
          </a>
        </div>
      );

      return result;
    } catch (error: any) {
      console.error('Trade execution error:', error);
      toast.dismiss(toastId);
      
      let errorMessage = 'Transaction failed';
      if (error.message?.includes('rejected')) {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message?.includes('insufficient')) {
        errorMessage = 'Insufficient balance for swap';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      
      const result: TradeResult = { success: false, error: errorMessage };
      setLastTrade(result);
      return result;
    } finally {
      setIsTrading(false);
    }
  }, [connected, publicKey, getProvider]);

  const estimateSwap = useCallback(async (
    inputToken: string,
    outputToken: string,
    amount: number
  ) => {
    try {
      const inputMint = TOKEN_MINTS[inputToken] || TOKEN_MINTS.SOL;
      const outputMint = TOKEN_MINTS[outputToken] || TOKEN_MINTS.SOL;
      const amountInLamports = Math.floor(amount * 1e9);

      const quote = await getQuote(inputMint, outputMint, amountInLamports);
      
      return {
        inputAmount: parseInt(quote.inAmount) / 1e9,
        outputAmount: parseInt(quote.outAmount) / 1e9,
        priceImpact: parseFloat(quote.priceImpactPct),
        route: quote.routePlan?.map((r: any) => r.swapInfo?.label).join(' → '),
      };
    } catch (error) {
      console.error('Estimate error:', error);
      return null;
    }
  }, []);

  return {
    executeTrade,
    estimateSwap,
    isTrading,
    lastTrade,
    isWalletConnected: connected,
    walletAddress: publicKey,
    supportedTokens: Object.keys(TOKEN_MINTS),
  };
};

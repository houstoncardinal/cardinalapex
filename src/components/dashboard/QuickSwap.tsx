import { useState } from 'react';
import { ArrowRightLeft, Loader2, Wallet, Zap, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useSolanaTrading, TOKEN_INFO } from '@/hooks/useSolanaTrading';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';
import { useMemeCoinsPrice } from '@/hooks/useMemeCoinsPrice';
import { useSwapRateLimit } from '@/hooks/useRateLimiting';
import { SwapRouteVisualization } from './SwapRouteVisualization';
import { TradeConfirmationModal } from './TradeConfirmationModal';
import { RiskDisclaimer } from './RiskDisclaimer';

const QUICK_SWAP_TOKENS = ['BONK', 'WIF', 'PEPE', 'POPCAT', 'MEW', 'BOME'];

export const QuickSwap = () => {
  const { executeTrade, estimateSwap, isTrading, isWalletConnected } = useSolanaTrading();
  const { connect, balance } = usePhantomWallet();
  const { prices } = useMemeCoinsPrice();
  const { isLimited, remainingRequests, executeWithRateLimit } = useSwapRateLimit();
  
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [amount, setAmount] = useState('0.1');
  const [isBuying, setIsBuying] = useState(true);
  const [showRoute, setShowRoute] = useState(false);
  const [previewToken, setPreviewToken] = useState<string | null>(null);
  
  // Confirmation modal state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingTrade, setPendingTrade] = useState<{
    token: string;
    estimatedOutput?: number;
    priceImpact?: number;
  } | null>(null);

  const handleQuickSwapClick = async (token: string) => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;
    if (isLimited) return;

    // Get estimate for confirmation
    const estimate = await estimateSwap(
      isBuying ? 'SOL' : token,
      isBuying ? token : 'SOL',
      amountNum
    );

    setPendingTrade({
      token,
      estimatedOutput: estimate?.outputAmount,
      priceImpact: estimate?.priceImpact,
    });
    setShowConfirmation(true);
  };

  const handleConfirmTrade = async () => {
    if (!pendingTrade) return;
    
    const amountNum = parseFloat(amount);
    
    await executeWithRateLimit(async () => {
      return executeTrade({
        inputToken: isBuying ? 'SOL' : pendingTrade.token,
        outputToken: isBuying ? pendingTrade.token : 'SOL',
        amount: amountNum,
        action: isBuying ? 'BUY' : 'SELL',
        slippageBps: 150,
      });
    });
    
    setPendingTrade(null);
  };

  if (!isWalletConnected) {
    return (
      <div className="glass rounded-2xl p-4 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Quick Swap</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground mb-3">Connect wallet for one-click swaps</p>
          <Button onClick={connect} size="sm" className="gap-2 bg-gradient-to-r from-purple-600 to-purple-500">
            <Wallet className="h-3 w-3" />
            Connect Phantom
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="glass rounded-2xl p-4 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 glow-primary">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Quick Swap</h3>
              <p className="text-[10px] text-muted-foreground">{balance?.toFixed(4)} SOL available</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant={isBuying ? 'default' : 'outline'}
              size="sm"
              className="h-6 text-[10px] px-2"
              onClick={() => setIsBuying(true)}
            >
              Buy
            </Button>
            <Button
              variant={!isBuying ? 'default' : 'outline'}
              size="sm"
              className="h-6 text-[10px] px-2"
              onClick={() => setIsBuying(false)}
            >
              Sell
            </Button>
          </div>
        </div>

        {/* Rate Limit Indicator */}
        {remainingRequests < 10 && (
          <div className="mb-3 flex items-center justify-center">
            <Badge variant="outline" className="text-[10px]">
              {remainingRequests} swaps remaining this minute
            </Badge>
          </div>
        )}

        {/* Amount Input */}
        <div className="flex gap-2 mb-3">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-8 text-xs"
            placeholder="Amount in SOL"
            step="0.01"
            min="0.001"
          />
          <div className="flex gap-1">
            {['0.1', '0.5', '1'].map((preset) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                className="h-8 text-[10px] px-2"
                onClick={() => setAmount(preset)}
              >
                {preset}
              </Button>
            ))}
          </div>
        </div>

        {/* Token Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {QUICK_SWAP_TOKENS.map((token) => {
            const priceData = prices[token];
            const price = priceData?.price || 0;
            const change = priceData?.change24h || 0;
            const isPositive = change >= 0;

            return (
              <Button
                key={token}
                variant="outline"
                size="sm"
                disabled={isTrading || isLimited}
                onClick={() => handleQuickSwapClick(token)}
                onMouseEnter={() => setPreviewToken(token)}
                className={cn(
                  "h-auto py-2 flex flex-col items-center gap-0.5 transition-all",
                  "hover:border-primary hover:bg-primary/10",
                  previewToken === token && showRoute && "border-primary bg-primary/10",
                  (isTrading || isLimited) && "opacity-50"
                )}
              >
                {isTrading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs">{token}</span>
                      <ArrowRightLeft className="h-2.5 w-2.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">SOL</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        ${price < 0.01 ? price.toExponential(1) : price.toFixed(4)}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-[8px] py-0 px-1 h-3",
                          isPositive ? "text-success" : "text-destructive"
                        )}
                      >
                        {isPositive ? '+' : ''}{change.toFixed(1)}%
                      </Badge>
                    </div>
                  </>
                )}
              </Button>
            );
          })}
        </div>

        {isTrading && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Processing swap...</span>
          </div>
        )}

        {/* Route Preview Toggle */}
        <div className="mt-3 pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-7 text-xs gap-1"
            onClick={() => setShowRoute(!showRoute)}
          >
            <Route className="h-3 w-3" />
            {showRoute ? 'Hide Route Preview' : 'Show Route Preview'}
          </Button>
        </div>

        {/* Route Visualization */}
        {showRoute && previewToken && (
          <div className="mt-3">
            <SwapRouteVisualization
              inputToken={isBuying ? 'SOL' : previewToken}
              outputToken={isBuying ? previewToken : 'SOL'}
              amount={parseFloat(amount) || 0.1}
            />
          </div>
        )}

        {/* Risk Disclaimer */}
        <div className="mt-3">
          <RiskDisclaimer variant="inline" dismissible={false} />
        </div>
      </div>

      {/* Trade Confirmation Modal */}
      {pendingTrade && (
        <TradeConfirmationModal
          isOpen={showConfirmation}
          onClose={() => {
            setShowConfirmation(false);
            setPendingTrade(null);
          }}
          onConfirm={handleConfirmTrade}
          tradeDetails={{
            action: isBuying ? 'BUY' : 'SELL',
            inputToken: isBuying ? 'SOL' : pendingTrade.token,
            outputToken: isBuying ? pendingTrade.token : 'SOL',
            amount: parseFloat(amount),
            estimatedOutput: pendingTrade.estimatedOutput,
            priceImpact: pendingTrade.priceImpact,
          }}
        />
      )}
    </>
  );
};

import { ExternalLink, History, Loader2, RefreshCw, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useOnChainHistory } from '@/hooks/useOnChainHistory';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';
import { formatDistanceToNow } from 'date-fns';

export const OnChainTradeHistory = () => {
  const { transactions, loading, refresh, getSolscanUrl, isConnected, walletAddress, currentSolPrice } = useOnChainHistory(30);
  const { connect } = usePhantomWallet();

  // Calculate total P&L
  const totalPnL = transactions.reduce((sum, tx) => sum + (tx.estimatedPnL || 0), 0);
  const avgPnLPercent = transactions.length > 0 
    ? transactions.reduce((sum, tx) => sum + (tx.pnlPercent || 0), 0) / transactions.length 
    : 0;

  if (!isConnected) {
    return (
      <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: "350ms" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <History className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">On-Chain History</h3>
              <p className="text-sm text-muted-foreground">Solana transactions with P&L</p>
            </div>
          </div>
        </div>

        <div className="text-center py-8">
          <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground text-sm mb-3">Connect your Phantom wallet to view on-chain transactions</p>
          <Button onClick={connect} className="gap-2 bg-gradient-to-r from-purple-600 to-purple-500">
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: "350ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 glow-primary">
            <History className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">On-Chain History</h3>
            <p className="text-sm text-muted-foreground">
              {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)} • {transactions.length} txns
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={refresh} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(`https://solscan.io/account/${walletAddress}`, '_blank')}
            className="gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            Solscan
          </Button>
        </div>
      </div>

      {/* P&L Summary Card */}
      {transactions.length > 0 && (
        <div className="mb-4 p-4 rounded-xl border border-border bg-gradient-to-r from-secondary/30 to-secondary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Estimated P&L (Recent)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className={cn(
                  "font-bold text-lg",
                  totalPnL >= 0 ? "text-success" : "text-destructive"
                )}>
                  {totalPnL >= 0 ? '+' : ''}${Math.abs(totalPnL).toFixed(2)}
                </p>
                <p className={cn(
                  "text-xs",
                  avgPnLPercent >= 0 ? "text-success" : "text-destructive"
                )}>
                  {avgPnLPercent >= 0 ? '+' : ''}{avgPnLPercent.toFixed(2)}% avg
                </p>
              </div>
              {totalPnL >= 0 ? (
                <TrendingUp className="h-5 w-5 text-success" />
              ) : (
                <TrendingDown className="h-5 w-5 text-destructive" />
              )}
            </div>
          </div>
          {currentSolPrice > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Current SOL: ${currentSolPrice.toFixed(2)}
            </p>
          )}
        </div>
      )}

      {/* Transaction List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-muted-foreground text-sm">No transactions yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              On-chain trades will appear here
            </p>
          </div>
        ) : (
          transactions.map((tx, index) => (
            <a
              key={tx.signature}
              href={getSolscanUrl(tx.signature)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-between p-3 rounded-xl border transition-all hover:bg-secondary/40 cursor-pointer opacity-0 animate-slide-in-right",
                tx.status === 'success' 
                  ? "border-border bg-secondary/20" 
                  : "border-destructive/30 bg-destructive/5"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg",
                  tx.type === 'swap' ? "bg-primary/20" : "bg-secondary"
                )}>
                  {tx.type === 'swap' ? (
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  ) : tx.direction === 'in' ? (
                    <ArrowDownRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm text-foreground">
                      {tx.signature.slice(0, 8)}...{tx.signature.slice(-6)}
                    </p>
                    <Badge 
                      variant={tx.type === 'swap' ? 'default' : 'secondary'} 
                      className="text-[10px] py-0"
                    >
                      {tx.type === 'swap' ? 'SWAP' : tx.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {tx.blockTime ? formatDistanceToNow(new Date(tx.blockTime * 1000), { addSuffix: true }) : 'Pending'}
                    </span>
                    {tx.solPriceAtTime && (
                      <span className="text-[10px]">
                        @ ${tx.solPriceAtTime.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* P&L Column */}
                {tx.estimatedPnL !== undefined && (
                  <div className="text-right">
                    <p className={cn(
                      "text-xs font-medium",
                      tx.estimatedPnL >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {tx.estimatedPnL >= 0 ? '+' : ''}${Math.abs(tx.estimatedPnL).toFixed(2)}
                    </p>
                    <p className={cn(
                      "text-[10px]",
                      (tx.pnlPercent || 0) >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {(tx.pnlPercent || 0) >= 0 ? '+' : ''}{(tx.pnlPercent || 0).toFixed(1)}%
                    </p>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  {tx.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
            </a>
          ))
        )}
      </div>

      {transactions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={() => window.open(`https://solscan.io/account/${walletAddress}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
            View All on Solscan
          </Button>
        </div>
      )}
    </div>
  );
};
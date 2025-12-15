import { Wallet, TrendingUp, TrendingDown, RefreshCw, ExternalLink, Loader2, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useWalletPortfolio } from '@/hooks/useWalletPortfolio';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = [
  'hsl(280, 100%, 70%)', // Purple for SOL
  'hsl(142, 76%, 46%)',  // Green
  'hsl(38, 92%, 50%)',   // Orange
  'hsl(199, 89%, 48%)',  // Blue
  'hsl(326, 100%, 74%)', // Pink
  'hsl(45, 93%, 47%)',   // Yellow
];

export const WalletPortfolio = () => {
  const { totalValue, tokens, loading, refreshPortfolio, isConnected, walletAddress } = useWalletPortfolio();
  const { connect, balance } = usePhantomWallet();

  if (!isConnected) {
    return (
      <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: "150ms" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20">
              <Wallet className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Wallet Portfolio</h3>
              <p className="text-sm text-muted-foreground">Phantom wallet</p>
            </div>
          </div>
        </div>

        <div className="text-center py-8">
          <Wallet className="h-16 w-16 text-purple-500/50 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Connect your Phantom wallet to view your on-chain portfolio</p>
          <Button 
            onClick={connect} 
            className="gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
          >
            <Wallet className="h-4 w-4" />
            Connect Phantom
          </Button>
        </div>
      </div>
    );
  }

  const pieData = tokens.filter(t => t.usdValue > 0.01).map(t => ({
    name: t.symbol,
    value: t.usdValue,
  }));

  return (
    <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: "150ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 glow-primary">
            <Wallet className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Wallet Portfolio</h3>
            <p className="text-sm text-muted-foreground font-mono">
              {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={refreshPortfolio} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(`https://solscan.io/account/${walletAddress}`, '_blank')}
            className="gap-1"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      ) : (
        <>
          {/* Total Value */}
          <div className="text-center mb-6 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
            <p className="text-sm text-muted-foreground mb-1">Total Wallet Value</p>
            <p className="text-3xl font-bold text-foreground">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge variant="secondary" className="font-mono">
                {balance?.toFixed(4) || '0'} SOL
              </Badge>
            </div>
          </div>

          {/* Allocation Chart */}
          {pieData.length > 0 && (
            <div className="h-32 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Value"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Token List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {tokens.length === 0 ? (
              <div className="text-center py-4">
                <Coins className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">No tokens found</p>
              </div>
            ) : (
              tokens.map((token, index) => (
                <div
                  key={token.mint}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold"
                      style={{ backgroundColor: `${COLORS[index % COLORS.length]}30`, color: COLORS[index % COLORS.length] }}
                    >
                      {token.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{token.symbol}</p>
                      <p className="text-xs text-muted-foreground">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground text-sm">
                      ${token.usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {token.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {token.symbol}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
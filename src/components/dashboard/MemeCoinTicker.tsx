import { TrendingUp, TrendingDown, RefreshCw, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMemeCoinsPrice } from '@/hooks/useMemeCoinsPrice';
import { motion } from 'framer-motion';

export const MemeCoinTicker = () => {
  const { prices, loading, refresh, coins } = useMemeCoinsPrice();

  return (
    <div className="glass rounded-2xl p-4 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
            <Coins className="h-4 w-4 text-yellow-400" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Meme Coins</h3>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={refresh} disabled={loading}>
          <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
        </Button>
      </div>

      <div className="overflow-hidden">
        <motion.div 
          className="flex gap-3"
          animate={{ x: [0, -50, 0] }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {coins.map((coin, index) => {
            const priceData = prices[coin.symbol];
            const price = priceData?.price || 0;
            const change = priceData?.change24h || 0;
            const isPositive = change >= 0;

            return (
              <div
                key={coin.symbol}
                className={cn(
                  "flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border transition-all hover:scale-105",
                  "border-border bg-secondary/30 hover:bg-secondary/50"
                )}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-foreground">{coin.symbol}</span>
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground font-mono">
                      ${price < 0.01 ? price.toExponential(2) : price.toFixed(price < 1 ? 6 : 2)}
                    </span>
                    <span className={cn(
                      "text-[10px] font-medium",
                      isPositive ? "text-success" : "text-destructive"
                    )}>
                      {isPositive ? '+' : ''}{change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Static grid for smaller screens */}
      <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {coins.slice(0, 6).map((coin) => {
          const priceData = prices[coin.symbol];
          const price = priceData?.price || 0;
          const change = priceData?.change24h || 0;
          const isPositive = change >= 0;

          return (
            <div
              key={`grid-${coin.symbol}`}
              className="flex flex-col items-center p-2 rounded-lg border border-border/50 bg-secondary/20"
            >
              <span className="font-bold text-[10px] text-foreground">{coin.symbol}</span>
              <span className="text-[10px] text-muted-foreground font-mono">
                ${price < 0.01 ? price.toExponential(1) : price.toFixed(price < 1 ? 4 : 2)}
              </span>
              <span className={cn(
                "text-[9px] font-medium",
                isPositive ? "text-success" : "text-destructive"
              )}>
                {isPositive ? '+' : ''}{change.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

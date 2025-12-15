import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface MarketAsset {
  symbol: string;
  name: string;
  price: string;
  change: number;
  type: 'crypto' | 'stock' | 'meme' | 'etf' | 'futures';
}

const marketAssets: MarketAsset[] = [
  // Crypto
  { symbol: "BTC", name: "Bitcoin", price: "$104,234", change: 2.45, type: 'crypto' },
  { symbol: "ETH", name: "Ethereum", price: "$3,892", change: 1.89, type: 'crypto' },
  { symbol: "SOL", name: "Solana", price: "$198.45", change: 5.67, type: 'crypto' },
  { symbol: "XRP", name: "Ripple", price: "$2.34", change: -0.89, type: 'crypto' },
  { symbol: "ADA", name: "Cardano", price: "$0.89", change: 3.21, type: 'crypto' },
  { symbol: "AVAX", name: "Avalanche", price: "$42.56", change: 4.12, type: 'crypto' },
  { symbol: "DOT", name: "Polkadot", price: "$8.23", change: -1.45, type: 'crypto' },
  { symbol: "LINK", name: "Chainlink", price: "$18.92", change: 2.78, type: 'crypto' },
  
  // Meme Coins
  { symbol: "DOGE", name: "Dogecoin", price: "$0.42", change: 8.92, type: 'meme' },
  { symbol: "SHIB", name: "Shiba Inu", price: "$0.00003", change: 12.34, type: 'meme' },
  { symbol: "PEPE", name: "Pepe", price: "$0.00002", change: 15.67, type: 'meme' },
  { symbol: "WIF", name: "Dogwifhat", price: "$2.89", change: 9.23, type: 'meme' },
  { symbol: "BONK", name: "Bonk", price: "$0.00004", change: -5.67, type: 'meme' },
  { symbol: "FLOKI", name: "Floki", price: "$0.0002", change: 7.89, type: 'meme' },
  
  // Stocks
  { symbol: "AAPL", name: "Apple", price: "$198.45", change: 1.23, type: 'stock' },
  { symbol: "MSFT", name: "Microsoft", price: "$425.67", change: 0.89, type: 'stock' },
  { symbol: "NVDA", name: "NVIDIA", price: "$145.23", change: 4.56, type: 'stock' },
  { symbol: "TSLA", name: "Tesla", price: "$423.89", change: -2.34, type: 'stock' },
  { symbol: "AMZN", name: "Amazon", price: "$198.45", change: 1.67, type: 'stock' },
  { symbol: "GOOGL", name: "Google", price: "$178.92", change: 0.45, type: 'stock' },
  { symbol: "META", name: "Meta", price: "$612.34", change: 2.12, type: 'stock' },
  { symbol: "AMD", name: "AMD", price: "$178.56", change: 3.45, type: 'stock' },
  
  // ETFs
  { symbol: "SPY", name: "S&P 500 ETF", price: "$598.45", change: 0.67, type: 'etf' },
  { symbol: "QQQ", name: "Nasdaq ETF", price: "$512.34", change: 1.12, type: 'etf' },
  { symbol: "VTI", name: "Total Market", price: "$278.90", change: 0.45, type: 'etf' },
  { symbol: "ARKK", name: "ARK Innovation", price: "$56.78", change: 2.89, type: 'etf' },
  { symbol: "IBIT", name: "Bitcoin ETF", price: "$56.23", change: 3.45, type: 'etf' },
  
  // Futures
  { symbol: "ES", name: "S&P Futures", price: "$5,987", change: 0.34, type: 'futures' },
  { symbol: "NQ", name: "Nasdaq Futures", price: "$21,456", change: 0.89, type: 'futures' },
  { symbol: "CL", name: "Crude Oil", price: "$72.45", change: -1.23, type: 'futures' },
  { symbol: "GC", name: "Gold", price: "$2,645", change: 0.56, type: 'futures' },
  { symbol: "SI", name: "Silver", price: "$31.23", change: 1.45, type: 'futures' },
];

const typeColors = {
  crypto: 'bg-orange-500/20 text-orange-400',
  meme: 'bg-pink-500/20 text-pink-400',
  stock: 'bg-blue-500/20 text-blue-400',
  etf: 'bg-emerald-500/20 text-emerald-400',
  futures: 'bg-purple-500/20 text-purple-400',
};

export const MarketOverview = () => {
  const [assets, setAssets] = useState(marketAssets);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => ({
        ...asset,
        change: asset.change + (Math.random() - 0.5) * 0.5,
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Duplicate assets for seamless infinite scroll
  const duplicatedAssets = [...assets, ...assets];

  return (
    <div className="glass rounded-2xl p-3 overflow-hidden opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
      <div className="relative">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />
        
        {/* Animated ticker */}
        <div className="flex animate-ticker">
          {duplicatedAssets.map((asset, i) => {
            const isPositive = asset.change >= 0;
            return (
              <div 
                key={`${asset.symbol}-${i}`} 
                className="flex items-center gap-3 px-4 py-1 shrink-0 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group"
              >
                <div className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                  typeColors[asset.type]
                )}>
                  {asset.type}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                    {asset.symbol}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {asset.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {asset.price}
                </span>
                <div className={cn(
                  "flex items-center gap-0.5 text-xs font-medium",
                  isPositive ? "text-success" : "text-destructive"
                )}>
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {isPositive ? "+" : ""}{asset.change.toFixed(2)}%
                </div>
                <div className="h-6 w-px bg-border/50 ml-2" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

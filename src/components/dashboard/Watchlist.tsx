import { TrendingUp, TrendingDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  icon: string;
  type: "stock" | "crypto";
}

const watchlistData: Asset[] = [
  { id: "1", symbol: "AAPL", name: "Apple Inc.", price: 178.72, change: 2.34, icon: "🍎", type: "stock" },
  { id: "2", symbol: "ETH", name: "Ethereum", price: 2345.89, change: -1.23, icon: "⟠", type: "crypto" },
  { id: "3", symbol: "TSLA", name: "Tesla Inc.", price: 248.50, change: 5.67, icon: "⚡", type: "stock" },
  { id: "4", symbol: "SOL", name: "Solana", price: 98.45, change: 8.92, icon: "◎", type: "crypto" },
  { id: "5", symbol: "NVDA", name: "NVIDIA", price: 487.21, change: 3.45, icon: "🎮", type: "stock" },
  { id: "6", symbol: "BNB", name: "BNB", price: 312.67, change: -0.45, icon: "🔶", type: "crypto" },
];

const AssetRow = ({ asset, index }: { asset: Asset; index: number }) => {
  const isPositive = asset.change >= 0;
  
  return (
    <div 
      className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer opacity-0 animate-slide-in-right group"
      style={{ animationDelay: `${index * 50 + 400}ms` }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-lg">
          {asset.icon}
        </div>
        <div>
          <p className="font-semibold text-foreground">{asset.symbol}</p>
          <p className="text-xs text-muted-foreground">{asset.name}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-foreground">
            ${asset.price.toLocaleString()}
          </p>
          <p className={cn(
            "text-xs font-medium flex items-center gap-1 justify-end",
            isPositive ? "text-success" : "text-destructive"
          )}>
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? "+" : ""}{asset.change}%
          </p>
        </div>
        <Star className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

export const Watchlist = () => {
  return (
    <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Watchlist</h3>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
          {watchlistData.length} assets
        </span>
      </div>
      
      <div className="space-y-1">
        {watchlistData.map((asset, index) => (
          <AssetRow key={asset.id} asset={asset} index={index} />
        ))}
      </div>
    </div>
  );
};

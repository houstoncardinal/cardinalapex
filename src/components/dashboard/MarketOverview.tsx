import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketIndex {
  name: string;
  value: string;
  change: number;
}

const indices: MarketIndex[] = [
  { name: "S&P 500", value: "4,567.89", change: 0.45 },
  { name: "NASDAQ", value: "14,234.56", change: 1.23 },
  { name: "DOW", value: "35,678.90", change: -0.12 },
  { name: "BTC.D", value: "52.34%", change: 0.89 },
];

export const MarketOverview = () => {
  return (
    <div className="glass rounded-2xl p-4 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center gap-6 overflow-x-auto pb-2">
        {indices.map((index, i) => {
          const isPositive = index.change >= 0;
          return (
            <div key={index.name} className="flex items-center gap-3 shrink-0">
              <div>
                <p className="text-xs text-muted-foreground">{index.name}</p>
                <p className="text-sm font-semibold text-foreground">{index.value}</p>
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                isPositive ? "text-success" : "text-destructive"
              )}>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isPositive ? "+" : ""}{index.change}%
              </div>
              {i < indices.length - 1 && (
                <div className="h-8 w-px bg-border ml-3" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

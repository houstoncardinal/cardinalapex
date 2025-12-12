import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Trade {
  id: string;
  type: "buy" | "sell";
  asset: string;
  amount: number;
  price: number;
  time: string;
  automated: boolean;
}

const trades: Trade[] = [
  { id: "1", type: "buy", asset: "BTC", amount: 0.025, price: 1125.50, time: "2 min ago", automated: true },
  { id: "2", type: "sell", asset: "AAPL", amount: 10, price: 1787.20, time: "15 min ago", automated: true },
  { id: "3", type: "buy", asset: "ETH", amount: 0.5, price: 1172.94, time: "1 hour ago", automated: false },
  { id: "4", type: "sell", asset: "SOL", amount: 25, price: 2461.25, time: "2 hours ago", automated: true },
  { id: "5", type: "buy", asset: "NVDA", amount: 5, price: 2436.05, time: "3 hours ago", automated: true },
];

export const RecentTrades = () => {
  return (
    <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Trades</h3>
        <button className="text-sm text-accent hover:underline">View all</button>
      </div>

      <div className="space-y-3">
        {trades.map((trade, index) => (
          <div 
            key={trade.id}
            className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 opacity-0 animate-slide-in-right"
            style={{ animationDelay: `${index * 50 + 600}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                trade.type === "buy" 
                  ? "bg-success/10 text-success" 
                  : "bg-destructive/10 text-destructive"
              )}>
                {trade.type === "buy" ? (
                  <ArrowDownRight className="h-5 w-5" />
                ) : (
                  <ArrowUpRight className="h-5 w-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">
                    {trade.type === "buy" ? "Bought" : "Sold"} {trade.asset}
                  </p>
                  {trade.automated && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent font-medium">
                      AUTO
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {trade.time}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-foreground">${trade.price.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                {trade.amount} {trade.asset}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

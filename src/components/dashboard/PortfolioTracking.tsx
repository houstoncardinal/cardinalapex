import { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Wallet, TrendingUp, TrendingDown, DollarSign, Percent, BarChart3, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLivePrices } from "@/hooks/useLivePrice";

interface Holding {
  id: string;
  symbol: string;
  market: string;
  quantity: number;
  average_buy_price: number;
}

interface Trade {
  symbol: string;
  type: string;
  quantity: number;
  price: number;
  profit_loss: number | null;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
  'hsl(142, 76%, 36%)',
  'hsl(262, 83%, 58%)',
];

export const PortfolioTracking = () => {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ total_balance: number } | null>(null);

  const symbols = useMemo(() => holdings.map(h => h.symbol), [holdings]);
  const { prices } = useLivePrices(symbols.length ? symbols : ['BTC', 'ETH', 'SOL'], 'crypto');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('total_balance')
        .eq('user_id', user.id)
        .maybeSingle();

      setProfile(profileData);

      // Fetch holdings
      const { data: holdingsData } = await supabase
        .from('portfolio_holdings')
        .select('*')
        .eq('user_id', user.id);

      setHoldings(holdingsData || []);

      // Fetch trades for P&L calculation
      const { data: tradesData } = await supabase
        .from('trades')
        .select('symbol, type, quantity, price, profit_loss')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      setTrades(tradesData || []);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  // Calculate portfolio metrics
  const portfolioMetrics = useMemo(() => {
    const baseBalance = profile?.total_balance || 10000;
    
    // Calculate holdings value
    let holdingsValue = 0;
    let totalCost = 0;

    holdings.forEach(holding => {
      const currentPrice = prices[holding.symbol]?.price || holding.average_buy_price;
      holdingsValue += holding.quantity * currentPrice;
      totalCost += holding.quantity * holding.average_buy_price;
    });

    // Calculate realized P&L from trades
    const realizedPnL = trades.reduce((sum, trade) => sum + (trade.profit_loss || 0), 0);

    // Calculate unrealized P&L
    const unrealizedPnL = holdingsValue - totalCost;

    // Total portfolio value
    const totalValue = baseBalance + holdingsValue + realizedPnL;

    // Calculate 24h change from price changes
    const change24h = holdings.reduce((sum, holding) => {
      const priceData = prices[holding.symbol];
      if (priceData) {
        const change = (priceData.change24h / 100) * (holding.quantity * priceData.price);
        return sum + change;
      }
      return sum;
    }, 0);

    const change24hPercent = totalValue > 0 ? (change24h / totalValue) * 100 : 0;

    return {
      totalValue,
      holdingsValue,
      realizedPnL,
      unrealizedPnL,
      totalPnL: realizedPnL + unrealizedPnL,
      change24h,
      change24hPercent,
      cashBalance: baseBalance,
    };
  }, [holdings, prices, trades, profile]);

  // Prepare pie chart data
  const pieData = useMemo(() => {
    if (holdings.length === 0) {
      // Show demo data if no holdings
      return [
        { name: 'BTC', value: 45 },
        { name: 'ETH', value: 25 },
        { name: 'SOL', value: 15 },
        { name: 'Cash', value: 15 },
      ];
    }

    const data = holdings.map(holding => {
      const currentPrice = prices[holding.symbol]?.price || holding.average_buy_price;
      return {
        name: holding.symbol,
        value: holding.quantity * currentPrice,
      };
    });

    // Add cash
    data.push({
      name: 'Cash',
      value: portfolioMetrics.cashBalance,
    });

    return data;
  }, [holdings, prices, portfolioMetrics.cashBalance]);

  const isPositive = portfolioMetrics.totalPnL >= 0;
  const isToday24hPositive = portfolioMetrics.change24h >= 0;

  return (
    <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 glow-primary">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Portfolio</h3>
            <p className="text-sm text-muted-foreground">Real-time tracking</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Total Value */}
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-1">Total Portfolio Value</p>
            <p className="text-4xl font-bold text-foreground">
              ${portfolioMetrics.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <div className={cn(
              "flex items-center justify-center gap-2 mt-2",
              isToday24hPositive ? "text-success" : "text-destructive"
            )}>
              {isToday24hPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="font-medium">
                {isToday24hPositive ? "+" : ""}
                ${portfolioMetrics.change24h.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                {" "}({portfolioMetrics.change24hPercent.toFixed(2)}%)
              </span>
              <span className="text-xs text-muted-foreground">24h</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-secondary/30 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Holdings Value</span>
              </div>
              <p className="font-bold text-foreground">
                ${portfolioMetrics.holdingsValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-secondary/30 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Cash Balance</span>
              </div>
              <p className="font-bold text-foreground">
                ${portfolioMetrics.cashBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className={cn(
              "p-3 rounded-xl border",
              isPositive ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30"
            )}>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Total P&L</span>
              </div>
              <p className={cn("font-bold", isPositive ? "text-success" : "text-destructive")}>
                {isPositive ? "+" : ""}${portfolioMetrics.totalPnL.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-secondary/30 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Percent className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Realized P&L</span>
              </div>
              <p className={cn(
                "font-bold",
                portfolioMetrics.realizedPnL >= 0 ? "text-success" : "text-destructive"
              )}>
                {portfolioMetrics.realizedPnL >= 0 ? "+" : ""}
                ${portfolioMetrics.realizedPnL.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Allocation Chart */}
          <div className="h-48">
            <p className="text-sm font-medium text-foreground mb-2">Allocation</p>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
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
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

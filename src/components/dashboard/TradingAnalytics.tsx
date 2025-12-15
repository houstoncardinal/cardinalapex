import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign,
  Activity,
  Percent,
  Clock
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

interface Trade {
  id: string;
  symbol: string;
  type: string;
  quantity: number;
  price: number;
  profit_loss: number | null;
  status: string;
  created_at: string;
  market: string;
}

interface AnalyticsMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  avgTradeSize: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  totalPnL: number;
  largestWin: number;
  largestLoss: number;
  avgHoldTime: string;
}

const timeRanges = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "All", days: 365 },
];

export const TradingAnalytics = () => {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    const fetchTrades = async () => {
      if (!user) return;
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeRange);
      
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });
      
      if (!error && data) {
        setTrades(data);
      }
      setLoading(false);
    };
    
    fetchTrades();
  }, [user, timeRange]);

  const metrics = useMemo<AnalyticsMetrics>(() => {
    if (trades.length === 0) {
      return {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        avgTradeSize: 0,
        avgWin: 0,
        avgLoss: 0,
        profitFactor: 0,
        totalPnL: 0,
        largestWin: 0,
        largestLoss: 0,
        avgHoldTime: "N/A",
      };
    }

    const completedTrades = trades.filter(t => t.status === "completed");
    const winningTrades = completedTrades.filter(t => (t.profit_loss || 0) > 0);
    const losingTrades = completedTrades.filter(t => (t.profit_loss || 0) < 0);
    
    const totalWins = winningTrades.reduce((sum, t) => sum + (t.profit_loss || 0), 0);
    const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + (t.profit_loss || 0), 0));
    
    const avgTradeSize = completedTrades.reduce((sum, t) => sum + (t.quantity * t.price), 0) / completedTrades.length;
    const avgWin = winningTrades.length > 0 ? totalWins / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? totalLosses / losingTrades.length : 0;
    
    const pnlValues = completedTrades.map(t => t.profit_loss || 0);
    const largestWin = Math.max(0, ...pnlValues);
    const largestLoss = Math.abs(Math.min(0, ...pnlValues));

    return {
      totalTrades: completedTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: completedTrades.length > 0 ? (winningTrades.length / completedTrades.length) * 100 : 0,
      avgTradeSize,
      avgWin,
      avgLoss,
      profitFactor: totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0,
      totalPnL: totalWins - totalLosses,
      largestWin,
      largestLoss,
      avgHoldTime: "~2.5h",
    };
  }, [trades]);

  const performanceData = useMemo(() => {
    const grouped: { [key: string]: number } = {};
    
    trades.forEach(trade => {
      const date = new Date(trade.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!grouped[date]) grouped[date] = 0;
      grouped[date] += trade.profit_loss || 0;
    });

    let cumulative = 0;
    return Object.entries(grouped).map(([date, pnl]) => {
      cumulative += pnl;
      return { date, pnl, cumulative };
    });
  }, [trades]);

  const winLossData = [
    { name: "Wins", value: metrics.winningTrades, color: "hsl(var(--success))" },
    { name: "Losses", value: metrics.losingTrades, color: "hsl(var(--destructive))" },
  ];

  if (loading) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-center h-64">
          <Activity className="h-8 w-8 animate-pulse text-primary" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 md:p-6 bg-card border-border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Trading Analytics</h3>
            <p className="text-xs text-muted-foreground">Performance metrics & insights</p>
          </div>
        </div>
        
        <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
          {timeRanges.map((range) => (
            <Button
              key={range.label}
              variant={timeRange === range.days ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeRange(range.days)}
              className="text-xs h-7 px-3"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Win Rate</span>
          </div>
          <p className={`text-xl font-bold ${metrics.winRate >= 50 ? 'text-success' : 'text-destructive'}`}>
            {metrics.winRate.toFixed(1)}%
          </p>
        </div>

        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total P&L</span>
          </div>
          <p className={`text-xl font-bold ${metrics.totalPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
            ${metrics.totalPnL.toFixed(2)}
          </p>
        </div>

        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total Trades</span>
          </div>
          <p className="text-xl font-bold text-foreground">{metrics.totalTrades}</p>
        </div>

        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Percent className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Profit Factor</span>
          </div>
          <p className={`text-xl font-bold ${metrics.profitFactor >= 1 ? 'text-success' : 'text-destructive'}`}>
            {metrics.profitFactor === Infinity ? '∞' : metrics.profitFactor.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-foreground mb-3">Cumulative P&L</h4>
        <div className="h-48 bg-muted/20 rounded-lg p-2">
          {performanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cumulative P&L']}
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No trade data for this period
            </div>
          )}
        </div>
      </div>

      {/* Win/Loss & Trade Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Win/Loss Distribution</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={winLossData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  width={50}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {winLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span className="text-success">{metrics.winningTrades} wins</span>
            <span className="text-destructive">{metrics.losingTrades} losses</span>
          </div>
        </div>

        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Trade Statistics</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Trade Size</span>
              <span className="text-foreground">${metrics.avgTradeSize.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Win</span>
              <span className="text-success">+${metrics.avgWin.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Loss</span>
              <span className="text-destructive">-${metrics.avgLoss.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Largest Win</span>
              <span className="text-success">+${metrics.largestWin.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Largest Loss</span>
              <span className="text-destructive">-${metrics.largestLoss.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

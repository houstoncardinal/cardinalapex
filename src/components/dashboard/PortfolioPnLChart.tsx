import { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';
import { useOnChainHistory } from '@/hooks/useOnChainHistory';

type TimeRange = '24h' | '7d' | '30d' | 'all';

interface PnLDataPoint {
  timestamp: number;
  date: string;
  value: number;
  pnl: number;
  cumulative: number;
}

export const PortfolioPnLChart = () => {
  const { connected, publicKey, balance } = usePhantomWallet();
  const { transactions, loading } = useOnChainHistory();
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const chartData = useMemo(() => {
    if (!transactions.length) {
      // Generate demo data if no transactions
      const now = Date.now();
      const demoData: PnLDataPoint[] = [];
      const days = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      
      let cumulative = 0;
      for (let i = days; i >= 0; i--) {
        const change = (Math.random() - 0.45) * 50;
        cumulative += change;
        demoData.push({
          timestamp: now - i * (timeRange === '24h' ? 3600000 : 86400000),
          date: new Date(now - i * (timeRange === '24h' ? 3600000 : 86400000)).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            ...(timeRange === '24h' && { hour: '2-digit' })
          }),
          value: 1000 + cumulative,
          pnl: change,
          cumulative,
        });
      }
      return demoData;
    }

    // Process real transactions
    const now = Date.now();
    const rangeMs = timeRange === '24h' ? 86400000 : timeRange === '7d' ? 604800000 : timeRange === '30d' ? 2592000000 : Infinity;
    
    const filteredTxs = transactions.filter(tx => {
      const txTime = new Date(tx.blockTime).getTime();
      return now - txTime <= rangeMs;
    });

    if (!filteredTxs.length) return [];

    let cumulative = 0;
    const data: PnLDataPoint[] = filteredTxs.map(tx => {
      cumulative += tx.estimatedPnL || 0;
      return {
        timestamp: tx.blockTime * 1000,
        date: new Date(tx.blockTime * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          ...(timeRange === '24h' && { hour: '2-digit' })
        }),
        value: tx.amount || 0,
        pnl: tx.estimatedPnL || 0,
        cumulative,
      };
    });

    return data;
  }, [transactions, timeRange]);

  const totalPnL = useMemo(() => {
    if (!chartData.length) return 0;
    return chartData[chartData.length - 1]?.cumulative || 0;
  }, [chartData]);

  const pnlPercent = useMemo(() => {
    const initialValue = chartData[0]?.value || 1000;
    return (totalPnL / initialValue) * 100;
  }, [chartData, totalPnL]);

  const isPositive = totalPnL >= 0;

  if (!connected) {
    return (
      <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">P&L History</h3>
            <p className="text-sm text-muted-foreground">Connect wallet to track</p>
          </div>
        </div>
        <div className="h-48 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Connect your Phantom wallet to view P&L history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            isPositive ? "bg-success/20" : "bg-destructive/20"
          )}>
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-success" />
            ) : (
              <TrendingDown className="h-5 w-5 text-destructive" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">P&L History</h3>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-sm font-bold",
                isPositive ? "text-success" : "text-destructive"
              )}>
                {isPositive ? '+' : ''}{totalPnL.toFixed(4)} SOL
              </span>
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded",
                isPositive ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
              )}>
                {isPositive ? '+' : ''}{pnlPercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          {(['24h', '7d', '30d', 'all'] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              className="h-7 text-xs px-2"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="5%" 
                    stopColor={isPositive ? 'hsl(var(--success))' : 'hsl(var(--destructive))'} 
                    stopOpacity={0.3}
                  />
                  <stop 
                    offset="95%" 
                    stopColor={isPositive ? 'hsl(var(--success))' : 'hsl(var(--destructive))'} 
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                tickFormatter={(v) => `${v > 0 ? '+' : ''}${v.toFixed(2)}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
                formatter={(value: number) => [`${value >= 0 ? '+' : ''}${value.toFixed(4)} SOL`, 'Cumulative P&L']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" opacity={0.5} />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke={isPositive ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                strokeWidth={2}
                fill="url(#pnlGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
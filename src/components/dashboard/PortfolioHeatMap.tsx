import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LayoutGrid, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface HoldingPerformance {
  symbol: string;
  change24h: number;
  change7d: number;
  change30d: number;
  value: number;
  allocation: number;
}

export const PortfolioHeatMap = () => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [holdings, setHoldings] = useState<HoldingPerformance[]>([
    { symbol: 'SOL', change24h: 5.2, change7d: 12.5, change30d: 25.8, value: 1500, allocation: 35 },
    { symbol: 'BONK', change24h: -8.3, change7d: 45.2, change30d: -15.4, value: 800, allocation: 18 },
    { symbol: 'WIF', change24h: 12.1, change7d: -5.3, change30d: 85.2, value: 600, allocation: 14 },
    { symbol: 'JTO', change24h: 2.5, change7d: 8.9, change30d: 15.3, value: 450, allocation: 10 },
    { symbol: 'PYTH', change24h: -3.2, change7d: 2.1, change30d: -8.5, value: 350, allocation: 8 },
    { symbol: 'RAY', change24h: 7.8, change7d: 15.6, change30d: 32.1, value: 300, allocation: 7 },
    { symbol: 'ORCA', change24h: -1.5, change7d: -12.3, change30d: 5.8, value: 200, allocation: 5 },
    { symbol: 'USDC', change24h: 0.01, change7d: 0.02, change30d: 0.01, value: 150, allocation: 3 }
  ]);

  const getChangeValue = (holding: HoldingPerformance) => {
    switch (timeframe) {
      case '24h': return holding.change24h;
      case '7d': return holding.change7d;
      case '30d': return holding.change30d;
    }
  };

  const getHeatColor = (change: number) => {
    if (change >= 20) return 'bg-green-500';
    if (change >= 10) return 'bg-green-400';
    if (change >= 5) return 'bg-green-300';
    if (change >= 0) return 'bg-green-200';
    if (change >= -5) return 'bg-red-200';
    if (change >= -10) return 'bg-red-300';
    if (change >= -20) return 'bg-red-400';
    return 'bg-red-500';
  };

  const getTextColor = (change: number) => {
    if (Math.abs(change) >= 10) return 'text-white';
    return 'text-foreground';
  };

  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
  const weightedChange = holdings.reduce((sum, h) => sum + (getChangeValue(h) * h.allocation / 100), 0);

  const bestPerformer = [...holdings].sort((a, b) => getChangeValue(b) - getChangeValue(a))[0];
  const worstPerformer = [...holdings].sort((a, b) => getChangeValue(a) - getChangeValue(b))[0];

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            Portfolio Heat Map
          </CardTitle>
          <Select value={timeframe} onValueChange={(v) => setTimeframe(v as typeof timeframe)}>
            <SelectTrigger className="h-8 w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24h</SelectItem>
              <SelectItem value="7d">7d</SelectItem>
              <SelectItem value="30d">30d</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 bg-muted/30 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Portfolio</p>
            <p className={`text-sm font-bold ${weightedChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {weightedChange >= 0 ? '+' : ''}{weightedChange.toFixed(2)}%
            </p>
          </div>
          <div className="p-2 bg-muted/30 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <p className="text-xs text-muted-foreground">Best</p>
            </div>
            <p className="text-sm font-bold text-green-400">
              {bestPerformer.symbol} +{getChangeValue(bestPerformer).toFixed(1)}%
            </p>
          </div>
          <div className="p-2 bg-muted/30 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingDown className="w-3 h-3 text-red-400" />
              <p className="text-xs text-muted-foreground">Worst</p>
            </div>
            <p className="text-sm font-bold text-red-400">
              {worstPerformer.symbol} {getChangeValue(worstPerformer).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Heat Map Grid */}
        <TooltipProvider>
          <div className="grid grid-cols-4 gap-1">
            {holdings.map((holding) => {
              const change = getChangeValue(holding);
              const size = Math.max(60, holding.allocation * 2);
              
              return (
                <Tooltip key={holding.symbol}>
                  <TooltipTrigger asChild>
                    <div
                      className={`relative rounded-lg cursor-pointer transition-transform hover:scale-105 ${getHeatColor(change)} ${getTextColor(change)}`}
                      style={{ minHeight: `${size}px` }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                        <span className="font-bold text-sm">{holding.symbol}</span>
                        <span className="text-xs">
                          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs space-y-1">
                      <p className="font-bold">{holding.symbol}</p>
                      <p>Value: ${holding.value.toLocaleString()}</p>
                      <p>Allocation: {holding.allocation}%</p>
                      <p>24h: {holding.change24h >= 0 ? '+' : ''}{holding.change24h}%</p>
                      <p>7d: {holding.change7d >= 0 ? '+' : ''}{holding.change7d}%</p>
                      <p>30d: {holding.change30d >= 0 ? '+' : ''}{holding.change30d}%</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span className="text-muted-foreground">-20%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-200" />
            <span className="text-muted-foreground">-5%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-200" />
            <span className="text-muted-foreground">+5%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-muted-foreground">+20%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

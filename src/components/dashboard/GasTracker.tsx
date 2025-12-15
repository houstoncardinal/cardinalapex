import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fuel, Clock, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface GasData {
  currentFee: number;
  avgFee: number;
  trend: 'up' | 'down' | 'stable';
  congestion: 'low' | 'medium' | 'high';
  estimatedCosts: {
    swap: number;
    transfer: number;
    nftMint: number;
  };
  optimalTime: string;
  history: { time: string; fee: number }[];
}

export const GasTracker = () => {
  const [gasData, setGasData] = useState<GasData>({
    currentFee: 0.000005,
    avgFee: 0.000008,
    trend: 'down',
    congestion: 'low',
    estimatedCosts: {
      swap: 0.00025,
      transfer: 0.000005,
      nftMint: 0.012,
    },
    optimalTime: 'Now',
    history: [
      { time: '1h ago', fee: 0.000012 },
      { time: '2h ago', fee: 0.000015 },
      { time: '3h ago', fee: 0.000009 },
      { time: '4h ago', fee: 0.000007 },
      { time: '5h ago', fee: 0.000006 },
      { time: '6h ago', fee: 0.000008 },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setGasData(prev => ({
        ...prev,
        currentFee: prev.currentFee * (0.95 + Math.random() * 0.1),
        trend: Math.random() > 0.5 ? 'down' : 'up',
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Fuel className="h-5 w-5 text-primary" />
          Solana Gas Tracker
          <Badge className={getCongestionColor(gasData.congestion)}>
            {gasData.congestion.toUpperCase()} CONGESTION
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Fee */}
        <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30">
          <div>
            <p className="text-sm text-muted-foreground">Current Priority Fee</p>
            <p className="text-2xl font-bold text-foreground">
              {gasData.currentFee.toFixed(6)} SOL
            </p>
          </div>
          <div className="flex items-center gap-2">
            {gasData.trend === 'down' ? (
              <TrendingDown className="h-5 w-5 text-emerald-400" />
            ) : (
              <TrendingUp className="h-5 w-5 text-red-400" />
            )}
            <span className={gasData.trend === 'down' ? 'text-emerald-400' : 'text-red-400'}>
              {gasData.trend === 'down' ? '-15%' : '+12%'}
            </span>
          </div>
        </div>

        {/* Optimal Time */}
        <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
          <Zap className="h-5 w-5 text-emerald-400" />
          <div>
            <p className="text-sm text-muted-foreground">Optimal Trade Time</p>
            <p className="font-semibold text-emerald-400">{gasData.optimalTime}</p>
          </div>
        </div>

        {/* Cost Estimates */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Estimated Transaction Costs</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-background/50 rounded-lg text-center border border-border/30">
              <p className="text-xs text-muted-foreground">Token Swap</p>
              <p className="font-semibold text-foreground">${(gasData.estimatedCosts.swap * 150).toFixed(4)}</p>
            </div>
            <div className="p-2 bg-background/50 rounded-lg text-center border border-border/30">
              <p className="text-xs text-muted-foreground">SOL Transfer</p>
              <p className="font-semibold text-foreground">${(gasData.estimatedCosts.transfer * 150).toFixed(4)}</p>
            </div>
            <div className="p-2 bg-background/50 rounded-lg text-center border border-border/30">
              <p className="text-xs text-muted-foreground">NFT Mint</p>
              <p className="font-semibold text-foreground">${(gasData.estimatedCosts.nftMint * 150).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Fee History */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Fee History
          </p>
          <div className="flex items-end gap-1 h-16">
            {gasData.history.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-primary/60 rounded-t"
                  style={{ height: `${(item.fee / 0.00002) * 100}%` }}
                />
                <span className="text-[10px] text-muted-foreground">{item.time.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

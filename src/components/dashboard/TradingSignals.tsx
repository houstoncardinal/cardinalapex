import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Signal, TrendingUp, TrendingDown, Target, AlertTriangle, RefreshCw, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface TradingSignal {
  id: string;
  token: string;
  type: 'buy' | 'sell';
  strength: 'strong' | 'moderate' | 'weak';
  entry: number;
  target: number;
  stopLoss: number;
  confidence: number;
  indicators: string[];
  timestamp: Date;
  riskReward: number;
}

export const TradingSignals = () => {
  const [signals, setSignals] = useState<TradingSignal[]>([
    {
      id: '1',
      token: 'SOL',
      type: 'buy',
      strength: 'strong',
      entry: 98.50,
      target: 115.00,
      stopLoss: 92.00,
      confidence: 87,
      indicators: ['RSI Oversold', 'MACD Bullish Cross', 'Support Bounce'],
      timestamp: new Date(Date.now() - 300000),
      riskReward: 2.54
    },
    {
      id: '2',
      token: 'BONK',
      type: 'sell',
      strength: 'moderate',
      entry: 0.000028,
      target: 0.000022,
      stopLoss: 0.000031,
      confidence: 72,
      indicators: ['RSI Overbought', 'Resistance Hit'],
      timestamp: new Date(Date.now() - 900000),
      riskReward: 2.0
    },
    {
      id: '3',
      token: 'WIF',
      type: 'buy',
      strength: 'weak',
      entry: 2.45,
      target: 2.85,
      stopLoss: 2.25,
      confidence: 58,
      indicators: ['Bollinger Squeeze'],
      timestamp: new Date(Date.now() - 1800000),
      riskReward: 2.0
    },
    {
      id: '4',
      token: 'JTO',
      type: 'buy',
      strength: 'strong',
      entry: 3.20,
      target: 4.00,
      stopLoss: 2.90,
      confidence: 82,
      indicators: ['Golden Cross', 'Volume Surge', 'Cup & Handle'],
      timestamp: new Date(Date.now() - 600000),
      riskReward: 2.67
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');
  const [isScanning, setIsScanning] = useState(false);

  const filteredSignals = signals.filter(s => filter === 'all' || s.type === filter);

  const scanForSignals = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      toast.success('Scan complete - 2 new signals found');
    }, 2000);
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'weak': return 'bg-orange-500';
      default: return 'bg-muted';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const strongBuyCount = signals.filter(s => s.type === 'buy' && s.strength === 'strong').length;
  const strongSellCount = signals.filter(s => s.type === 'sell' && s.strength === 'strong').length;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Signal className="w-5 h-5 text-primary" />
            Trading Signals
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <SelectTrigger className="h-8 w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={scanForSignals}
              disabled={isScanning}
              className="h-8"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-foreground">Strong Buys</span>
            </div>
            <Badge className="bg-green-500">{strongBuyCount}</Badge>
          </div>
          <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-sm text-foreground">Strong Sells</span>
            </div>
            <Badge variant="destructive">{strongSellCount}</Badge>
          </div>
        </div>

        {/* Signals List */}
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {filteredSignals.map((signal) => (
              <div 
                key={signal.id} 
                className={`p-3 rounded-lg border ${
                  signal.type === 'buy' ? 'bg-green-500/5 border-green-500/30' : 'bg-red-500/5 border-red-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {signal.type === 'buy' ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className="font-bold text-foreground">{signal.token}</span>
                    <Badge className={getStrengthColor(signal.strength)}>
                      {signal.strength}
                    </Badge>
                  </div>
                  <span className={`text-sm font-bold ${getConfidenceColor(signal.confidence)}`}>
                    {signal.confidence}%
                  </span>
                </div>

                {/* Entry/Target/SL */}
                <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
                  <div className="p-1.5 bg-muted/30 rounded text-center">
                    <span className="text-muted-foreground block">Entry</span>
                    <span className="text-foreground font-medium">${signal.entry}</span>
                  </div>
                  <div className="p-1.5 bg-green-500/20 rounded text-center">
                    <span className="text-muted-foreground block">Target</span>
                    <span className="text-green-400 font-medium">${signal.target}</span>
                  </div>
                  <div className="p-1.5 bg-red-500/20 rounded text-center">
                    <span className="text-muted-foreground block">Stop Loss</span>
                    <span className="text-red-400 font-medium">${signal.stopLoss}</span>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Confidence</span>
                    <span>R:R {signal.riskReward.toFixed(2)}</span>
                  </div>
                  <Progress value={signal.confidence} className="h-1.5" />
                </div>

                {/* Indicators */}
                <div className="flex flex-wrap gap-1">
                  {signal.indicators.map((indicator, i) => (
                    <Badge key={i} variant="outline" className="text-xs py-0">
                      {indicator}
                    </Badge>
                  ))}
                </div>

                {/* Timestamp */}
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>{signal.timestamp.toLocaleTimeString()}</span>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    <Bell className="w-3 h-3 mr-1" />
                    Alert
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            Signals are for informational purposes only. Always do your own research before trading.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

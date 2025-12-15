import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, TrendingDown, Zap, RefreshCw, Target, Shield, Clock } from 'lucide-react';
import { useState } from 'react';

interface TradeSuggestion {
  id: string;
  action: 'buy' | 'sell' | 'hold';
  token: string;
  confidence: number;
  reason: string;
  targetPrice: number;
  currentPrice: number;
  potentialGain: number;
  risk: 'low' | 'medium' | 'high';
  timeframe: string;
  signals: string[];
}

export const AITradeSuggestions = () => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<TradeSuggestion[]>([
    {
      id: '1',
      action: 'buy',
      token: 'SOL',
      confidence: 87,
      reason: 'Strong accumulation pattern detected with increasing volume. RSI showing oversold conditions near key support.',
      targetPrice: 168.50,
      currentPrice: 148.20,
      potentialGain: 13.7,
      risk: 'medium',
      timeframe: '7-14 days',
      signals: ['RSI Oversold', 'Volume Spike', 'Support Bounce'],
    },
    {
      id: '2',
      action: 'sell',
      token: 'BONK',
      confidence: 72,
      reason: 'Whale wallets showing distribution. Price approaching resistance with declining momentum.',
      targetPrice: 0.000018,
      currentPrice: 0.000024,
      potentialGain: -25,
      risk: 'high',
      timeframe: '3-5 days',
      signals: ['Whale Selling', 'Resistance Near', 'Bearish Divergence'],
    },
    {
      id: '3',
      action: 'buy',
      token: 'JUP',
      confidence: 81,
      reason: 'Protocol TVL increasing. Positive sentiment from recent airdrop announcement.',
      targetPrice: 1.15,
      currentPrice: 0.92,
      potentialGain: 25,
      risk: 'low',
      timeframe: '14-30 days',
      signals: ['TVL Growth', 'Social Bullish', 'Cup & Handle'],
    },
    {
      id: '4',
      action: 'hold',
      token: 'WIF',
      confidence: 65,
      reason: 'Consolidating in range. Wait for breakout confirmation before adding position.',
      targetPrice: 3.20,
      currentPrice: 2.85,
      potentialGain: 12.3,
      risk: 'medium',
      timeframe: 'Wait for signal',
      signals: ['Consolidation', 'Volume Declining', 'Neutral Trend'],
    },
  ]);

  const refreshSuggestions = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate AI analysis
      setSuggestions(prev => prev.map(s => ({
        ...s,
        confidence: Math.max(50, Math.min(95, s.confidence + Math.floor(Math.random() * 10) - 5)),
      })));
      setLoading(false);
    }, 2000);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'sell': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-emerald-400';
      case 'medium': return 'text-amber-400';
      case 'high': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Trade Suggestions
            <Badge className="bg-primary/20 text-primary">
              <Zap className="h-3 w-3 mr-1" />
              LIVE
            </Badge>
          </CardTitle>
          <Button size="sm" variant="outline" onClick={refreshSuggestions} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Portfolio Context */}
        <div className="p-3 bg-background/50 rounded-lg border border-border/30 text-xs text-muted-foreground">
          <p className="flex items-center gap-2">
            <Target className="h-3 w-3 text-primary" />
            Based on your portfolio: SOL heavy (65%), meme exposure (25%), stables (10%)
          </p>
        </div>

        {/* Suggestions List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {suggestions.map((suggestion) => (
            <div 
              key={suggestion.id}
              className="p-4 bg-background/50 rounded-lg border border-border/30 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge className={`text-sm font-bold ${getActionColor(suggestion.action)}`}>
                    {suggestion.action === 'buy' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {suggestion.action === 'sell' && <TrendingDown className="h-3 w-3 mr-1" />}
                    {suggestion.action.toUpperCase()}
                  </Badge>
                  <span className="font-bold text-lg text-foreground">{suggestion.token}</span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Confidence</span>
                    <Badge variant="outline" className={suggestion.confidence >= 80 ? 'border-emerald-500/30 text-emerald-400' : ''}>
                      {suggestion.confidence}%
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{suggestion.reason}</p>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-2 bg-background/30 rounded">
                  <p className="text-xs text-muted-foreground">Target Price</p>
                  <p className="font-mono text-foreground">
                    ${suggestion.targetPrice < 0.01 ? suggestion.targetPrice.toFixed(6) : suggestion.targetPrice.toFixed(2)}
                  </p>
                </div>
                <div className="p-2 bg-background/30 rounded">
                  <p className="text-xs text-muted-foreground">Potential</p>
                  <p className={`font-mono ${suggestion.potentialGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {suggestion.potentialGain >= 0 ? '+' : ''}{suggestion.potentialGain.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs mb-3">
                <div className="flex items-center gap-2">
                  <Shield className={`h-3 w-3 ${getRiskColor(suggestion.risk)}`} />
                  <span className={getRiskColor(suggestion.risk)}>{suggestion.risk.toUpperCase()} RISK</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{suggestion.timeframe}</span>
                </div>
              </div>

              {/* Signals */}
              <div className="flex flex-wrap gap-1 mb-3">
                {suggestion.signals.map((signal, i) => (
                  <Badge key={i} variant="outline" className="text-[10px]">
                    {signal}
                  </Badge>
                ))}
              </div>

              {suggestion.action !== 'hold' && (
                <Button size="sm" className="w-full" variant={suggestion.action === 'buy' ? 'default' : 'destructive'}>
                  Execute {suggestion.action.toUpperCase()} {suggestion.token}
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

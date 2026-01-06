import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Zap, 
  Target,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BarChart3,
  Waves
} from 'lucide-react';

interface TradingSignal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  price: number;
  targetPrice: number;
  stopLoss: number;
  indicators: string[];
  bot: string;
  timestamp: Date;
  pattern?: string;
  riskReward: number;
}

const generateSignal = (): TradingSignal => {
  const symbols = ['SOL', 'ETH', 'BTC', 'BONK', 'WIF', 'PEPE', 'DOGE', 'AVAX', 'MATIC', 'ARB'];
  const types: ('BUY' | 'SELL' | 'HOLD')[] = ['BUY', 'SELL', 'HOLD'];
  const bots = ['Alpha Scalper', 'Steady Gains', 'Momentum Hunter', 'Diamond Hands', 'Whale Tracker', 'Night Owl'];
  const patterns = [
    'Ichimoku Cloud Breakout',
    'Elliott Wave 3 Extension',
    'Wyckoff Spring',
    'Market Structure Break',
    'Order Block Retest',
    'Fair Value Gap Fill',
    'Liquidity Sweep',
    'Double Bottom',
    'Bull Flag Breakout',
    'VWAP Bounce',
    'RSI Divergence',
    'Bollinger Squeeze',
  ];
  const indicatorSets = [
    ['Ichimoku Cloud', 'RSI(14)', 'Volume Profile'],
    ['Elliott Wave', 'Fibonacci', 'MACD'],
    ['Market Structure', 'Order Flow', 'Delta Volume'],
    ['VWAP', 'Bollinger Bands', 'ATR'],
    ['On-Chain Data', 'Whale Alert', 'Exchange Flow'],
    ['Supertrend', 'EMA Cross', 'ADX'],
  ];

  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  const type = types[Math.floor(Math.random() * types.length)];
  const basePrice = Math.random() * 1000 + 10;
  const confidence = Math.floor(Math.random() * 30) + 70;
  const direction = type === 'BUY' ? 1 : type === 'SELL' ? -1 : 0;
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    symbol,
    type,
    confidence,
    price: Math.round(basePrice * 100) / 100,
    targetPrice: Math.round(basePrice * (1 + direction * (0.02 + Math.random() * 0.08)) * 100) / 100,
    stopLoss: Math.round(basePrice * (1 - direction * (0.01 + Math.random() * 0.03)) * 100) / 100,
    indicators: indicatorSets[Math.floor(Math.random() * indicatorSets.length)],
    bot: bots[Math.floor(Math.random() * bots.length)],
    timestamp: new Date(),
    pattern: patterns[Math.floor(Math.random() * patterns.length)],
    riskReward: Math.round((1 + Math.random() * 3) * 10) / 10,
  };
};

const SignalCard = ({ signal, index }: { signal: TradingSignal; index: number }) => {
  const isNew = Date.now() - signal.timestamp.getTime() < 5000;
  
  const getTypeStyles = () => {
    switch (signal.type) {
      case 'BUY':
        return {
          bg: 'bg-chart-green/10',
          border: 'border-chart-green/30',
          text: 'text-chart-green',
          icon: ArrowUpRight,
          glow: 'shadow-chart-green/20',
        };
      case 'SELL':
        return {
          bg: 'bg-destructive/10',
          border: 'border-destructive/30',
          text: 'text-destructive',
          icon: ArrowDownRight,
          glow: 'shadow-destructive/20',
        };
      default:
        return {
          bg: 'bg-chart-yellow/10',
          border: 'border-chart-yellow/30',
          text: 'text-chart-yellow',
          icon: Activity,
          glow: 'shadow-chart-yellow/20',
        };
    }
  };

  const styles = getTypeStyles();
  const Icon = styles.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-xl border ${styles.border} ${styles.bg} ${isNew ? `shadow-lg ${styles.glow}` : ''} transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${styles.bg} border ${styles.border}`}>
            <Icon className={`h-5 w-5 ${styles.text}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground text-lg">{signal.symbol}</span>
              <Badge variant="outline" className={`${styles.text} ${styles.border} text-xs font-semibold`}>
                {signal.type}
              </Badge>
              {isNew && (
                <Badge className="bg-primary/20 text-primary text-xs animate-pulse">
                  NEW
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{signal.bot}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-chart-yellow" />
            <span className="text-sm font-semibold text-foreground">{signal.confidence}%</span>
          </div>
          <p className="text-xs text-muted-foreground">Confidence</p>
        </div>
      </div>

      {/* Pattern Detection */}
      {signal.pattern && (
        <div className="mb-3 p-2 rounded-lg bg-secondary/30 border border-border/30">
          <div className="flex items-center gap-2">
            <Waves className="h-3.5 w-3.5 text-chart-purple" />
            <span className="text-xs font-medium text-foreground">{signal.pattern}</span>
          </div>
        </div>
      )}

      {/* Confidence Bar */}
      <div className="mb-3">
        <Progress 
          value={signal.confidence} 
          className="h-1.5"
        />
      </div>

      {/* Price Levels */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
        <div className="p-2 rounded-lg bg-secondary/30">
          <p className="text-muted-foreground">Entry</p>
          <p className="font-semibold text-foreground">${signal.price}</p>
        </div>
        <div className="p-2 rounded-lg bg-chart-green/10">
          <p className="text-muted-foreground">Target</p>
          <p className="font-semibold text-chart-green">${signal.targetPrice}</p>
        </div>
        <div className="p-2 rounded-lg bg-destructive/10">
          <p className="text-muted-foreground">Stop Loss</p>
          <p className="font-semibold text-destructive">${signal.stopLoss}</p>
        </div>
      </div>

      {/* Indicators */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {signal.indicators.map((indicator) => (
          <Badge key={indicator} variant="secondary" className="text-[10px] py-0.5">
            {indicator}
          </Badge>
        ))}
      </div>

      {/* Risk/Reward & Time */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Target className="h-3 w-3" />
          <span>R:R {signal.riskReward}:1</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{signal.timestamp.toLocaleTimeString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

const LiveTradingSignals = () => {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');

  useEffect(() => {
    // Generate initial signals
    const initial = Array.from({ length: 5 }, generateSignal);
    setSignals(initial);

    // Simulate live signals
    if (isLive) {
      const interval = setInterval(() => {
        const newSignal = generateSignal();
        setSignals(prev => [newSignal, ...prev.slice(0, 9)]);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  const filteredSignals = signals.filter(s => filter === 'ALL' || s.type === filter);

  const stats = {
    buySignals: signals.filter(s => s.type === 'BUY').length,
    sellSignals: signals.filter(s => s.type === 'SELL').length,
    avgConfidence: Math.round(signals.reduce((acc, s) => acc + s.confidence, 0) / signals.length || 0),
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span>Live Trading Signals</span>
            {isLive && (
              <span className="flex items-center gap-1.5 ml-2">
                <span className="h-2 w-2 rounded-full bg-chart-green animate-pulse" />
                <span className="text-xs text-chart-green font-medium">LIVE</span>
              </span>
            )}
          </CardTitle>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={filter === 'ALL' ? 'default' : 'outline'}
              onClick={() => setFilter('ALL')}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={filter === 'BUY' ? 'default' : 'outline'}
              onClick={() => setFilter('BUY')}
              className={filter === 'BUY' ? 'bg-chart-green hover:bg-chart-green/90' : ''}
            >
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              Buy
            </Button>
            <Button
              size="sm"
              variant={filter === 'SELL' ? 'default' : 'outline'}
              onClick={() => setFilter('SELL')}
              className={filter === 'SELL' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              <TrendingDown className="h-3.5 w-3.5 mr-1" />
              Sell
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-chart-green/10 border border-chart-green/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-chart-green" />
              <span className="text-xs text-muted-foreground">Buy Signals</span>
            </div>
            <p className="text-2xl font-bold text-chart-green mt-1">{stats.buySignals}</p>
          </div>
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Sell Signals</span>
            </div>
            <p className="text-2xl font-bold text-destructive mt-1">{stats.sellSignals}</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Avg Confidence</span>
            </div>
            <p className="text-2xl font-bold text-primary mt-1">{stats.avgConfidence}%</p>
          </div>
        </div>

        {/* Signals List */}
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredSignals.map((signal, index) => (
                <SignalCard key={signal.id} signal={signal} index={index} />
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LiveTradingSignals;

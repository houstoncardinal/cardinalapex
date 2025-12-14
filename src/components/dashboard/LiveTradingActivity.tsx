import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Brain, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  DollarSign,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TradeActivity {
  id: string;
  type: 'BUY' | 'SELL' | 'ANALYSIS' | 'SIGNAL' | 'EXECUTION';
  symbol: string;
  price?: number;
  change?: number;
  confidence?: number;
  pattern?: string;
  timestamp: Date;
  status: 'pending' | 'executing' | 'completed' | 'analyzing';
  profit?: number;
}

const SYMBOLS = ['BTC', 'ETH', 'SOL', 'AAPL', 'TSLA', 'NVDA', 'DOGE', 'XRP'];
const PATTERNS = [
  'Inverse Head & Shoulders',
  'Bull Flag',
  'Cup & Handle',
  'Double Bottom',
  'Ascending Triangle',
  'Falling Wedge Breakout',
  'Elliott Wave 3',
  'Wyckoff Accumulation'
];

const generateActivity = (): TradeActivity => {
  const types: TradeActivity['type'][] = ['BUY', 'SELL', 'ANALYSIS', 'SIGNAL', 'EXECUTION'];
  const type = types[Math.floor(Math.random() * types.length)];
  const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  const isCrypto = ['BTC', 'ETH', 'SOL', 'DOGE', 'XRP'].includes(symbol);
  
  const basePrice = isCrypto 
    ? (symbol === 'BTC' ? 98000 : symbol === 'ETH' ? 3500 : symbol === 'SOL' ? 220 : 0.4)
    : (symbol === 'AAPL' ? 195 : symbol === 'TSLA' ? 380 : 140);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    symbol,
    price: basePrice * (1 + (Math.random() - 0.5) * 0.02),
    change: (Math.random() - 0.4) * 10,
    confidence: Math.floor(Math.random() * 30) + 70,
    pattern: PATTERNS[Math.floor(Math.random() * PATTERNS.length)],
    timestamp: new Date(),
    status: type === 'ANALYSIS' ? 'analyzing' : type === 'EXECUTION' ? 'executing' : 'completed',
    profit: type === 'SELL' ? (Math.random() - 0.3) * 500 : undefined,
  };
};

export const LiveTradingActivity = () => {
  const [activities, setActivities] = useState<TradeActivity[]>([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [tradesCount, setTradesCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with some activities
    const initial = Array.from({ length: 5 }, () => generateActivity());
    setActivities(initial);
    
    // Add new activities periodically
    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
      
      if (newActivity.type === 'BUY' || newActivity.type === 'SELL') {
        setTradesCount(prev => prev + 1);
      }
      if (newActivity.profit) {
        setTotalProfit(prev => prev + newActivity.profit!);
      }
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: TradeActivity['type']) => {
    switch (type) {
      case 'BUY': return <ArrowUpRight className="h-4 w-4 text-success" />;
      case 'SELL': return <ArrowDownRight className="h-4 w-4 text-destructive" />;
      case 'ANALYSIS': return <Brain className="h-4 w-4 text-accent" />;
      case 'SIGNAL': return <Zap className="h-4 w-4 text-warning" />;
      case 'EXECUTION': return <Target className="h-4 w-4 text-primary" />;
    }
  };

  const getStatusBadge = (activity: TradeActivity) => {
    if (activity.status === 'analyzing') {
      return (
        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 animate-pulse">
          <Brain className="h-3 w-3 mr-1" />
          Analyzing
        </Badge>
      );
    }
    if (activity.status === 'executing') {
      return (
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 animate-pulse">
          <Zap className="h-3 w-3 mr-1" />
          Executing
        </Badge>
      );
    }
    if (activity.confidence && activity.confidence >= 85) {
      return (
        <Badge className="bg-success text-success-foreground">
          <Sparkles className="h-3 w-3 mr-1" />
          {activity.confidence}%
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
            <Activity className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              Live Trading Activity
              <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
            </h3>
            <p className="text-xs text-muted-foreground">Real-time AI operations</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Session P/L</p>
            <p className={cn(
              "font-bold",
              totalProfit >= 0 ? "text-success" : "text-destructive"
            )}>
              {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Trades</p>
            <p className="font-bold text-foreground">{tradesCount}</p>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div 
        ref={scrollRef}
        className="space-y-2 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
      >
        <AnimatePresence initial={false}>
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl border transition-all",
                activity.status === 'analyzing' && "border-accent/30 bg-accent/5",
                activity.status === 'executing' && "border-primary/30 bg-primary/5",
                activity.status === 'completed' && "border-border bg-secondary/30",
                index === 0 && "ring-1 ring-primary/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  activity.type === 'BUY' && "bg-success/20",
                  activity.type === 'SELL' && "bg-destructive/20",
                  activity.type === 'ANALYSIS' && "bg-accent/20",
                  activity.type === 'SIGNAL' && "bg-warning/20",
                  activity.type === 'EXECUTION' && "bg-primary/20",
                )}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground text-sm">
                      {activity.type} {activity.symbol}
                    </span>
                    {getStatusBadge(activity)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {activity.price && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {activity.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    )}
                    {activity.pattern && activity.type === 'SIGNAL' && (
                      <span className="text-warning">{activity.pattern}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                {activity.profit !== undefined && (
                  <p className={cn(
                    "font-bold text-sm",
                    activity.profit >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {activity.profit >= 0 ? '+' : ''}${activity.profit.toFixed(2)}
                  </p>
                )}
                {activity.change !== undefined && activity.type !== 'SELL' && (
                  <p className={cn(
                    "text-xs flex items-center gap-1 justify-end",
                    activity.change >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {activity.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {activity.change >= 0 ? '+' : ''}{activity.change.toFixed(2)}%
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom Stats Bar */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Brain className="h-3 w-3 text-accent" />
          AI Models Active: 3
        </span>
        <span className="flex items-center gap-1">
          <Zap className="h-3 w-3 text-warning" />
          Signals Today: {Math.floor(Math.random() * 20) + 15}
        </span>
        <span className="flex items-center gap-1">
          <Target className="h-3 w-3 text-primary" />
          Win Rate: 73.4%
        </span>
      </div>
    </div>
  );
};
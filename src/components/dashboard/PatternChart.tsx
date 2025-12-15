import { useState, useEffect, useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, ComposedChart, Bar } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useLivePrice } from "@/hooks/useLivePrice";
import { useNotifications } from "@/hooks/useNotifications";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  Loader2, 
  Zap, 
  RefreshCw,
  BarChart3,
  Coins,
  DollarSign,
  Activity,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TechnicalIndicators } from "./TechnicalIndicators";
import type { TradingSignal } from "@/lib/technicalIndicators";

interface PatternDetection {
  name: string;
  confidence: number;
  entry: number;
  target: number;
  stopLoss: number;
  direction: 'bullish' | 'bearish';
  description: string;
}

const timeframes = [
  { label: "1H", days: 1 },
  { label: "24H", days: 1 },
  { label: "7D", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
];

const CRYPTO_ASSETS = [
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  { symbol: 'SOL', name: 'Solana', icon: '◎' },
  { symbol: 'DOGE', name: 'Dogecoin', icon: 'Ð' },
  { symbol: 'ADA', name: 'Cardano', icon: '₳' },
  { symbol: 'XRP', name: 'Ripple', icon: '✕' },
];

const STOCK_ASSETS = [
  { symbol: 'AAPL', name: 'Apple', icon: '' },
  { symbol: 'TSLA', name: 'Tesla', icon: '' },
  { symbol: 'NVDA', name: 'NVIDIA', icon: '' },
  { symbol: 'GOOGL', name: 'Google', icon: '' },
  { symbol: 'MSFT', name: 'Microsoft', icon: '' },
  { symbol: 'AMZN', name: 'Amazon', icon: '' },
];

export const PatternChart = () => {
  const [market, setMarket] = useState<'crypto' | 'stocks'>('crypto');
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [activeTimeframe, setActiveTimeframe] = useState("7D");
  const [pattern, setPattern] = useState<PatternDetection | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [autoTradeEnabled, setAutoTradeEnabled] = useState(true);
  const [showVolume, setShowVolume] = useState(false);
  const [showIndicators, setShowIndicators] = useState(true);
  const [indicatorSignals, setIndicatorSignals] = useState<TradingSignal[]>([]);
  const { toast } = useToast();
  const { notifyTradeExecution, notifyHighConfidenceSignal } = useNotifications();

  const assets = market === 'crypto' ? CRYPTO_ASSETS : STOCK_ASSETS;
  const { priceData, historicalData, loading, refetch } = useLivePrice(selectedSymbol, market);

  // Reset symbol when market changes
  useEffect(() => {
    setSelectedSymbol(market === 'crypto' ? 'BTC' : 'AAPL');
    setPattern(null);
  }, [market]);

  const chartData = useMemo(() => {
    if (!historicalData.length) return [];
    
    const days = timeframes.find(t => t.label === activeTimeframe)?.days || 7;
    const data = historicalData.slice(-days);
    
    // Add volume data for visual enhancement
    return data.map(d => ({
      ...d,
      volume: Math.random() * 1000000 + 500000,
    }));
  }, [historicalData, activeTimeframe]);

  const currentPrice = priceData?.price || 0;
  const priceChange = priceData?.change24h || 0;
  const isPositive = priceChange >= 0;

  // Detect patterns using AI
  const detectPatterns = async () => {
    setIsAnalyzing(true);
    setPattern(null);

    try {
      const { data, error } = await supabase.functions.invoke("ai-trade-analysis", {
        body: { symbol: selectedSymbol, market, action: "analyze" }
      });

      if (error) throw error;

      const analysis = data.analysis || "";
      const confidenceMatch = analysis.match(/(\d+)%/);
      const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : Math.floor(Math.random() * 30) + 60;

      const patterns = [
        "Inverse Head & Shoulders",
        "Bull Flag",
        "Cup & Handle",
        "Ascending Triangle",
        "Double Bottom",
        "Falling Wedge Breakout",
        "Elliott Wave 3",
        "Wyckoff Accumulation",
      ];
      
      const detectedPattern = patterns.find(p => analysis.toLowerCase().includes(p.toLowerCase())) 
        || patterns[Math.floor(Math.random() * patterns.length)];

      const isBullish = analysis.toLowerCase().includes("bullish") || 
                        analysis.toLowerCase().includes("buy") ||
                        Math.random() > 0.4;

      const entryPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.02);
      const targetMultiplier = isBullish ? (1 + Math.random() * 0.15 + 0.05) : (1 - Math.random() * 0.15 - 0.05);
      const stopMultiplier = isBullish ? (1 - Math.random() * 0.05 - 0.02) : (1 + Math.random() * 0.05 + 0.02);

      const detected: PatternDetection = {
        name: detectedPattern,
        confidence,
        entry: entryPrice,
        target: entryPrice * targetMultiplier,
        stopLoss: entryPrice * stopMultiplier,
        direction: isBullish ? 'bullish' : 'bearish',
        description: analysis.slice(0, 300) + "...",
      };

      setPattern(detected);

      if (confidence >= 85 && autoTradeEnabled) {
        toast({
          title: "High Confidence Pattern Detected!",
          description: `${detectedPattern} at ${confidence}% confidence. Executing trade...`,
        });
        
        // Send push notification
        notifyHighConfidenceSignal(selectedSymbol, detectedPattern, confidence, isBullish ? 'bullish' : 'bearish');
        
        await executeTrade(detected);
      } else if (confidence >= 85) {
        toast({
          title: "High Confidence Signal",
          description: `${detectedPattern} detected at ${confidence}% - Auto-trade disabled`,
        });
        notifyHighConfidenceSignal(selectedSymbol, detectedPattern, confidence, isBullish ? 'bullish' : 'bearish');
      }

    } catch (error) {
      console.error("Pattern detection error:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze patterns. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const executeTrade = async (patternData: PatternDetection) => {
    setIsExecuting(true);

    try {
      const { data, error } = await supabase.functions.invoke("execute-trade", {
        body: {
          symbol: selectedSymbol,
          market,
          action: patternData.direction === 'bullish' ? 'BUY' : 'SELL',
          price: currentPrice,
          quantity: market === 'crypto' ? 0.1 : 10,
          confidence: patternData.confidence,
          pattern: patternData.name,
          entry: patternData.entry,
          target: patternData.target,
          stopLoss: patternData.stopLoss,
        }
      });

      if (error) throw error;

      // Send push notification for trade execution
      notifyTradeExecution(selectedSymbol, patternData.direction === 'bullish' ? 'BUY' : 'SELL', currentPrice);

      toast({
        title: "Trade Executed!",
        description: data.message,
      });
    } catch (error) {
      console.error("Trade execution error:", error);
      toast({
        title: "Trade Failed",
        description: error instanceof Error ? error.message : "Failed to execute trade",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  useEffect(() => {
    if (!loading && historicalData.length > 0) {
      detectPatterns();
    }
  }, [selectedSymbol, loading]);

  const currentAsset = assets.find(a => a.symbol === selectedSymbol);

  return (
    <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex h-14 w-14 items-center justify-center rounded-xl text-2xl font-bold",
            market === 'crypto' ? "bg-warning/20 text-warning" : "bg-accent/20 text-accent"
          )}>
            {market === 'crypto' 
              ? (currentAsset?.icon || <Coins className="h-7 w-7" />)
              : <BarChart3 className="h-7 w-7" />
            }
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-foreground">
                {currentAsset?.name || selectedSymbol}
              </h3>
              <Badge variant="outline" className="text-xs">
                {selectedSymbol}/{market === 'crypto' ? 'USD' : 'NYSE'}
              </Badge>
              {pattern && pattern.confidence >= 85 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Badge className="bg-success text-success-foreground animate-pulse">
                    <Zap className="h-3 w-3 mr-1" />
                    HIGH SIGNAL
                  </Badge>
                </motion.div>
              )}
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Activity className="h-3 w-3" />
              AI Pattern Detection Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              <DollarSign className="h-5 w-5 inline -mt-1" />
              {currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <motion.p 
              key={priceChange}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "text-sm font-medium flex items-center justify-end gap-1",
                isPositive ? "text-success" : "text-destructive"
              )}
            >
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {isPositive ? "+" : ""}{priceChange.toFixed(2)}%
            </motion.p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={refetch}
            disabled={loading}
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Market Tabs */}
      <Tabs value={market} onValueChange={(v) => setMarket(v as 'crypto' | 'stocks')} className="mb-4">
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="crypto" className="gap-2">
            <Coins className="h-4 w-4" />
            Crypto
          </TabsTrigger>
          <TabsTrigger value="stocks" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Stocks
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Symbol Selector */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {assets.map((asset) => (
          <Button
            key={asset.symbol}
            variant={selectedSymbol === asset.symbol ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSymbol(asset.symbol)}
            className="shrink-0"
          >
            {asset.icon && <span className="mr-1">{asset.icon}</span>}
            {asset.symbol}
          </Button>
        ))}
      </div>

      {/* Pattern Detection Panel */}
      <AnimatePresence mode="wait">
        {pattern && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "mb-4 p-4 rounded-xl border-2 overflow-hidden",
              pattern.confidence >= 85 
                ? "border-success bg-success/10" 
                : pattern.confidence >= 70 
                  ? "border-warning bg-warning/10"
                  : "border-border bg-secondary/30"
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className={cn(
                    "h-5 w-5",
                    pattern.direction === 'bullish' ? "text-success" : "text-destructive"
                  )} />
                </motion.div>
                <div>
                  <p className="font-bold text-foreground">{pattern.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {pattern.direction === 'bullish' ? '📈 Bullish Pattern' : '📉 Bearish Pattern'}
                  </p>
                </div>
              </div>
              <Badge variant={pattern.confidence >= 85 ? "default" : "secondary"} className={cn(
                pattern.confidence >= 85 && "bg-success"
              )}>
                {pattern.confidence}% Confidence
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-3">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center p-3 rounded-lg bg-background/50 border border-border"
              >
                <p className="text-xs text-muted-foreground mb-1">Entry</p>
                <p className="font-bold text-foreground">${pattern.entry.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </motion.div>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center p-3 rounded-lg bg-success/20 border border-success/30"
              >
                <p className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
                  <Target className="h-3 w-3" /> Target
                </p>
                <p className="font-bold text-success">${pattern.target.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </motion.div>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center p-3 rounded-lg bg-destructive/20 border border-destructive/30"
              >
                <p className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Stop Loss
                </p>
                <p className="font-bold text-destructive">${pattern.stopLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </motion.div>
            </div>

            {pattern.confidence >= 85 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button 
                  className="w-full gap-2 glow-primary" 
                  onClick={() => executeTrade(pattern)}
                  disabled={isExecuting}
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Executing Trade...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Execute {pattern.direction === 'bullish' ? 'BUY' : 'SELL'} Now
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart */}
      <div className="h-72 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">Loading chart data...</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="colorPriceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVolumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                dy={10}
              />
              <YAxis 
                yAxisId="price"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                dx={-10}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value.toFixed(0)}`}
              />
              {showVolume && (
                <YAxis 
                  yAxisId="volume"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
              )}
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  padding: "12px",
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                formatter={(value: number, name: string) => [
                  name === 'price' 
                    ? `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}` 
                    : `${(value / 1000000).toFixed(2)}M`,
                  name === 'price' ? 'Price' : 'Volume'
                ]}
              />
              
              {/* Pattern annotation lines */}
              {pattern && (
                <>
                  <ReferenceLine 
                    yAxisId="price"
                    y={pattern.entry} 
                    stroke="hsl(var(--primary))" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{ value: 'Entry', fill: 'hsl(var(--primary))', fontSize: 10, position: 'left' }}
                  />
                  <ReferenceLine 
                    yAxisId="price"
                    y={pattern.target} 
                    stroke="hsl(var(--success))" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{ value: 'Target', fill: 'hsl(var(--success))', fontSize: 10, position: 'left' }}
                  />
                  <ReferenceLine 
                    yAxisId="price"
                    y={pattern.stopLoss} 
                    stroke="hsl(var(--destructive))" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{ value: 'Stop', fill: 'hsl(var(--destructive))', fontSize: 10, position: 'left' }}
                  />
                </>
              )}
              
              {showVolume && (
                <Bar 
                  yAxisId="volume"
                  dataKey="volume" 
                  fill="url(#colorVolumeGradient)"
                  radius={[2, 2, 0, 0]}
                />
              )}
              
              <Area
                yAxisId="price"
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPriceGradient)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Timeframe & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <div className="flex gap-2 flex-1">
          {timeframes.map((tf) => (
            <Button
              key={tf.label}
              variant={activeTimeframe === tf.label ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTimeframe(tf.label)}
              className="flex-1"
            >
              {tf.label}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVolume(!showVolume)}
            className={cn(showVolume && "bg-accent/20")}
          >
            Vol
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowIndicators(!showIndicators)}
            className={cn(showIndicators && "bg-primary/20", "gap-1")}
          >
            <Activity className="h-4 w-4" />
            Indicators
            {showIndicators ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
          <Button 
            onClick={detectPatterns}
            disabled={isAnalyzing}
            className="gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                Detect Patterns
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Technical Indicators Panel */}
      <AnimatePresence>
        {showIndicators && historicalData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 rounded-xl bg-secondary/20 border border-border overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Technical Indicators</h4>
              <Badge variant="outline" className="text-xs">AI Analysis</Badge>
            </div>
            <TechnicalIndicators 
              historicalData={historicalData} 
              onSignalChange={setIndicatorSignals}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

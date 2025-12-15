import { useMemo, useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  ReferenceLine,
  Area,
  ComposedChart,
  Bar,
  Tooltip as RechartsTooltip
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { 
  calculateRSI, 
  calculateMACD, 
  calculateBollingerBands,
  getIndicatorSignals,
  calculateAllIndicators,
  type HistoricalPrice,
  type TradingSignal
} from "@/lib/technicalIndicators";
import { TrendingUp, TrendingDown, Minus, Activity, BarChart2, Waves } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TechnicalIndicatorsProps {
  historicalData: HistoricalPrice[];
  onSignalChange?: (signals: TradingSignal[]) => void;
}

export const TechnicalIndicators = ({ historicalData, onSignalChange }: TechnicalIndicatorsProps) => {
  const [activeIndicator, setActiveIndicator] = useState<'rsi' | 'macd' | 'bollinger'>('rsi');

  const indicators = useMemo(() => {
    if (historicalData.length < 26) return null;
    return calculateAllIndicators(historicalData);
  }, [historicalData]);

  const signals = useMemo(() => {
    if (!indicators) return [];
    const sigs = getIndicatorSignals(indicators);
    onSignalChange?.(sigs);
    return sigs;
  }, [indicators, onSignalChange]);

  if (!indicators || historicalData.length < 26) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Not enough data for technical analysis</p>
      </div>
    );
  }

  const getSignalIcon = (signal: 'buy' | 'sell' | 'neutral') => {
    switch (signal) {
      case 'buy': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'sell': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSignalColor = (signal: 'buy' | 'sell' | 'neutral') => {
    switch (signal) {
      case 'buy': return 'bg-success/20 text-success border-success/30';
      case 'sell': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-4">
      {/* Signal Summary */}
      <div className="flex flex-wrap gap-2">
        {signals.map((signal, idx) => (
          <motion.div
            key={signal.indicator}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Badge 
              variant="outline" 
              className={cn("gap-1.5 py-1.5 px-3", getSignalColor(signal.signal))}
            >
              {getSignalIcon(signal.signal)}
              <span className="font-semibold">{signal.indicator}</span>
              <span className="opacity-70">
                {signal.signal.toUpperCase()}
              </span>
            </Badge>
          </motion.div>
        ))}
      </div>

      {/* Indicator Tabs */}
      <Tabs value={activeIndicator} onValueChange={(v) => setActiveIndicator(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rsi" className="gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">RSI</span>
          </TabsTrigger>
          <TabsTrigger value="macd" className="gap-2">
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">MACD</span>
          </TabsTrigger>
          <TabsTrigger value="bollinger" className="gap-2">
            <Waves className="h-4 w-4" />
            <span className="hidden sm:inline">Bollinger</span>
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndicator}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="rsi" className="mt-4">
              <RSIChart data={indicators.rsi} />
            </TabsContent>

            <TabsContent value="macd" className="mt-4">
              <MACDChart data={indicators.macd} />
            </TabsContent>

            <TabsContent value="bollinger" className="mt-4">
              <BollingerChart data={indicators.bollinger} />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>

      {/* Signal Details */}
      <div className="space-y-2">
        {signals.map((signal) => (
          <motion.div
            key={signal.indicator}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "p-3 rounded-lg border text-sm",
              signal.signal === 'buy' && "bg-success/5 border-success/20",
              signal.signal === 'sell' && "bg-destructive/5 border-destructive/20",
              signal.signal === 'neutral' && "bg-muted/50 border-border"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{signal.indicator}</span>
              {signal.strength > 0 && (
                <span className="text-xs text-muted-foreground">
                  Strength: {signal.strength.toFixed(0)}%
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-xs mt-1">{signal.reason}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// RSI Chart Component
const RSIChart = ({ data }: { data: { date: string; value: number }[] }) => {
  const latestRSI = data[data.length - 1]?.value || 50;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">RSI (14)</span>
        <span className={cn(
          "font-bold",
          latestRSI < 30 && "text-success",
          latestRSI > 70 && "text-destructive",
          latestRSI >= 30 && latestRSI <= 70 && "text-foreground"
        )}>
          {latestRSI.toFixed(1)}
        </span>
      </div>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="rsiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis domain={[0, 100]} hide />
            <ReferenceLine y={70} stroke="hsl(var(--destructive))" strokeDasharray="3 3" opacity={0.5} />
            <ReferenceLine y={30} stroke="hsl(var(--success))" strokeDasharray="3 3" opacity={0.5} />
            <ReferenceLine y={50} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" opacity={0.3} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#rsiGradient)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="text-success">Oversold (30)</span>
        <span className="text-destructive">Overbought (70)</span>
      </div>
    </div>
  );
};

// MACD Chart Component
const MACDChart = ({ data }: { data: { date: string; macd: number; signal: number; histogram: number }[] }) => {
  const latestMACD = data[data.length - 1];
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">MACD (12, 26, 9)</span>
        <div className="flex gap-4">
          <span className="text-primary font-medium">
            MACD: {latestMACD?.macd.toFixed(2)}
          </span>
          <span className="text-accent font-medium">
            Signal: {latestMACD?.signal.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" opacity={0.5} />
            <Bar
              dataKey="histogram"
              fill="hsl(var(--primary))"
              opacity={0.5}
            />
            <Line
              type="monotone"
              dataKey="macd"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="signal"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-primary rounded" /> MACD
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-accent rounded" /> Signal
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-primary/50 rounded" /> Histogram
        </span>
      </div>
    </div>
  );
};

// Bollinger Bands Chart Component
const BollingerChart = ({ data }: { data: { date: string; upper: number; middle: number; lower: number; price: number }[] }) => {
  const latest = data[data.length - 1];
  const bandWidth = latest ? ((latest.upper - latest.lower) / latest.middle * 100).toFixed(2) : '0';
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Bollinger Bands (20, 2)</span>
        <span className="font-medium">
          Width: {bandWidth}%
        </span>
      </div>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="bollingerFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis domain={['auto', 'auto']} hide />
            <Area
              type="monotone"
              dataKey="upper"
              stroke="hsl(var(--primary))"
              strokeWidth={1}
              fill="url(#bollingerFill)"
              strokeDasharray="3 3"
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="hsl(var(--primary))"
              strokeWidth={1}
              fill="transparent"
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="middle"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
              dot={false}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--warning))"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-primary rounded opacity-50" style={{ borderStyle: 'dashed' }} /> Bands
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-warning rounded" /> Price
        </span>
      </div>
    </div>
  );
};

export default TechnicalIndicators;

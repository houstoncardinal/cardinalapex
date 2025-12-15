import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight, TrendingUp, TrendingDown, Activity, Zap } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface OrderFlowData {
  time: string;
  buyPressure: number;
  sellPressure: number;
  imbalance: number;
  aggressiveBuys: number;
  aggressiveSells: number;
}

interface RealtimeTick {
  id: number;
  type: "buy" | "sell";
  size: number;
  price: number;
  aggressive: boolean;
  timestamp: Date;
}

const generateOrderFlowData = (): OrderFlowData[] => {
  const data: OrderFlowData[] = [];
  
  for (let i = 0; i < 30; i++) {
    const buyPressure = 40 + Math.random() * 40;
    const sellPressure = 40 + Math.random() * 40;
    const imbalance = buyPressure - sellPressure;
    
    data.push({
      time: `${i}s`,
      buyPressure,
      sellPressure,
      imbalance,
      aggressiveBuys: Math.floor(Math.random() * 50),
      aggressiveSells: Math.floor(Math.random() * 45),
    });
  }
  return data;
};

const generateRealtimeTick = (id: number): RealtimeTick => ({
  id,
  type: Math.random() > 0.5 ? "buy" : "sell",
  size: Math.floor(100 + Math.random() * 5000),
  price: 45000 + (Math.random() - 0.5) * 100,
  aggressive: Math.random() > 0.6,
  timestamp: new Date(),
});

const OrderFlowImbalance = () => {
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [data, setData] = useState<OrderFlowData[]>(generateOrderFlowData());
  const [realtimeTicks, setRealtimeTicks] = useState<RealtimeTick[]>([]);
  const [tickId, setTickId] = useState(0);
  
  useEffect(() => {
    const dataInterval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        const buyPressure = 40 + Math.random() * 40;
        const sellPressure = 40 + Math.random() * 40;
        newData.push({
          time: `${29}s`,
          buyPressure,
          sellPressure,
          imbalance: buyPressure - sellPressure,
          aggressiveBuys: Math.floor(Math.random() * 50),
          aggressiveSells: Math.floor(Math.random() * 45),
        });
        return newData;
      });
    }, 1000);
    
    const tickInterval = setInterval(() => {
      setTickId(prev => prev + 1);
      setRealtimeTicks(prev => {
        const newTick = generateRealtimeTick(tickId);
        return [newTick, ...prev.slice(0, 9)];
      });
    }, 300);
    
    return () => {
      clearInterval(dataInterval);
      clearInterval(tickInterval);
    };
  }, [tickId]);
  
  const stats = useMemo(() => {
    const latestData = data.slice(-10);
    const avgBuy = latestData.reduce((sum, d) => sum + d.buyPressure, 0) / latestData.length;
    const avgSell = latestData.reduce((sum, d) => sum + d.sellPressure, 0) / latestData.length;
    const avgImbalance = avgBuy - avgSell;
    const totalAggressiveBuys = latestData.reduce((sum, d) => sum + d.aggressiveBuys, 0);
    const totalAggressiveSells = latestData.reduce((sum, d) => sum + d.aggressiveSells, 0);
    
    return {
      avgBuy: avgBuy.toFixed(1),
      avgSell: avgSell.toFixed(1),
      avgImbalance: avgImbalance.toFixed(1),
      totalAggressiveBuys,
      totalAggressiveSells,
      sentiment: avgImbalance > 10 ? "bullish" : avgImbalance < -10 ? "bearish" : "neutral",
    };
  }, [data]);
  
  const currentImbalance = data[data.length - 1]?.imbalance || 0;
  const imbalancePercent = Math.min(Math.abs(currentImbalance) / 40 * 100, 100);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            Order Flow Imbalance
          </CardTitle>
          <div className="flex gap-2">
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger className="w-20 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">BTC</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="SOL">SOL</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className="text-xs">
              <Activity className="h-3 w-3 mr-1 animate-pulse text-green-400" />
              Real-time
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Imbalance Gauge */}
        <div className="relative">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Sell Pressure</span>
            <span>Buy Pressure</span>
          </div>
          <div className="h-6 bg-gradient-to-r from-red-500/30 via-background to-green-500/30 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0.5 h-full bg-muted-foreground/50" />
            </div>
            <motion.div
              className={`absolute top-0 h-full w-3 rounded-full ${currentImbalance >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
              animate={{
                left: `calc(50% + ${currentImbalance / 40 * 45}%)`,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <Badge 
              variant="outline" 
              className={`text-xs ${
                stats.sentiment === 'bullish' ? 'text-green-400 border-green-400/50' :
                stats.sentiment === 'bearish' ? 'text-red-400 border-red-400/50' :
                'text-yellow-400 border-yellow-400/50'
              }`}
            >
              {stats.sentiment === 'bullish' ? <TrendingUp className="h-3 w-3 mr-1" /> :
               stats.sentiment === 'bearish' ? <TrendingDown className="h-3 w-3 mr-1" /> :
               <ArrowLeftRight className="h-3 w-3 mr-1" />}
              {stats.sentiment.charAt(0).toUpperCase() + stats.sentiment.slice(1)}
            </Badge>
            <span className={`text-sm font-bold ${currentImbalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {currentImbalance >= 0 ? '+' : ''}{currentImbalance.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          <motion.div 
            className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-[10px] text-muted-foreground">Buy</p>
            <p className="text-sm font-bold text-green-400">{stats.avgBuy}%</p>
          </motion.div>
          <motion.div 
            className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-[10px] text-muted-foreground">Sell</p>
            <p className="text-sm font-bold text-red-400">{stats.avgSell}%</p>
          </motion.div>
          <motion.div 
            className="bg-green-500/10 rounded-lg p-2 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <Zap className="h-3 w-3 text-green-400 mx-auto mb-0.5" />
            <p className="text-[10px] text-muted-foreground">Agg Buys</p>
            <p className="text-xs font-bold text-green-400">{stats.totalAggressiveBuys}</p>
          </motion.div>
          <motion.div 
            className="bg-red-500/10 rounded-lg p-2 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <Zap className="h-3 w-3 text-red-400 mx-auto mb-0.5" />
            <p className="text-[10px] text-muted-foreground">Agg Sells</p>
            <p className="text-xs font-bold text-red-400">{stats.totalAggressiveSells}</p>
          </motion.div>
        </div>

        {/* Imbalance Chart */}
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
                interval={9}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
                domain={[-40, 40]}
                tickFormatter={(val) => `${val > 0 ? '+' : ''}${val}`}
              />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Imbalance']}
              />
              <defs>
                <linearGradient id="imbalanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142 76% 36%)" stopOpacity={0.8}/>
                  <stop offset="50%" stopColor="hsl(var(--background))" stopOpacity={0.1}/>
                  <stop offset="100%" stopColor="hsl(0 84% 60%)" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="imbalance"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#imbalanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Real-time Tape */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Live Order Flow</p>
          <div className="h-24 overflow-hidden bg-background/30 rounded-lg p-1">
            <AnimatePresence mode="popLayout">
              {realtimeTicks.map((tick) => (
                <motion.div
                  key={tick.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                  className={`flex items-center justify-between py-0.5 px-2 text-[10px] ${
                    tick.type === 'buy' ? 'bg-green-500/10' : 'bg-red-500/10'
                  } rounded mb-0.5`}
                >
                  <div className="flex items-center gap-2">
                    <span className={tick.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
                      {tick.type === 'buy' ? '▲' : '▼'}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      ${tick.price.toFixed(0)}
                    </span>
                    {tick.aggressive && (
                      <Zap className="h-2.5 w-2.5 text-yellow-400" />
                    )}
                  </div>
                  <span className={`font-mono font-medium ${tick.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                    {tick.size.toLocaleString()}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Signal */}
        <motion.div 
          className={`text-xs p-2 rounded-lg flex items-center justify-between ${
            stats.sentiment === 'bullish' ? 'bg-green-500/10 border border-green-500/30' :
            stats.sentiment === 'bearish' ? 'bg-red-500/10 border border-red-500/30' :
            'bg-yellow-500/10 border border-yellow-500/30'
          }`}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className={
            stats.sentiment === 'bullish' ? 'text-green-400' :
            stats.sentiment === 'bearish' ? 'text-red-400' :
            'text-yellow-400'
          }>
            {stats.sentiment === 'bullish' ? 'Strong buying detected - Potential upward move' :
             stats.sentiment === 'bearish' ? 'Heavy selling detected - Potential downward move' :
             'Balanced order flow - No clear direction'}
          </span>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default OrderFlowImbalance;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, ComposedChart, Line } from "recharts";

interface DeltaData {
  time: string;
  buyVolume: number;
  sellVolume: number;
  delta: number;
  cumulativeDelta: number;
  price: number;
}

const generateDeltaData = (): DeltaData[] => {
  const data: DeltaData[] = [];
  let cumulativeDelta = 0;
  let basePrice = 45000;
  
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0');
    const buyVolume = 500 + Math.random() * 2000;
    const sellVolume = 400 + Math.random() * 1800;
    const delta = buyVolume - sellVolume;
    cumulativeDelta += delta;
    basePrice += (delta / 100) + (Math.random() - 0.5) * 200;
    
    data.push({
      time: `${hour}:00`,
      buyVolume: Math.round(buyVolume),
      sellVolume: Math.round(sellVolume),
      delta: Math.round(delta),
      cumulativeDelta: Math.round(cumulativeDelta),
      price: Math.round(basePrice),
    });
  }
  return data;
};

const DeltaVolume = () => {
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [timeframe, setTimeframe] = useState("1D");
  const [data, setData] = useState<DeltaData[]>(generateDeltaData());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateDeltaData());
    }, 15000);
    return () => clearInterval(interval);
  }, []);
  
  const stats = useMemo(() => {
    const totalBuy = data.reduce((sum, d) => sum + d.buyVolume, 0);
    const totalSell = data.reduce((sum, d) => sum + d.sellVolume, 0);
    const netDelta = totalBuy - totalSell;
    const buyRatio = (totalBuy / (totalBuy + totalSell)) * 100;
    const lastCumulativeDelta = data[data.length - 1]?.cumulativeDelta || 0;
    
    return { totalBuy, totalSell, netDelta, buyRatio, lastCumulativeDelta };
  }, [data]);
  
  const trend = stats.lastCumulativeDelta > 0 ? "bullish" : stats.lastCumulativeDelta < 0 ? "bearish" : "neutral";

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Delta Volume
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
              Live
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-2">
          <motion.div 
            className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <TrendingUp className="h-3 w-3 text-green-400 mx-auto mb-1" />
            <p className="text-[10px] text-muted-foreground">Buy Vol</p>
            <p className="text-sm font-bold text-green-400">{(stats.totalBuy / 1000).toFixed(1)}K</p>
          </motion.div>
          <motion.div 
            className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <TrendingDown className="h-3 w-3 text-red-400 mx-auto mb-1" />
            <p className="text-[10px] text-muted-foreground">Sell Vol</p>
            <p className="text-sm font-bold text-red-400">{(stats.totalSell / 1000).toFixed(1)}K</p>
          </motion.div>
          <motion.div 
            className={`${stats.netDelta >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} border rounded-lg p-2 text-center`}
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-[10px] text-muted-foreground">Net Delta</p>
            <p className={`text-sm font-bold ${stats.netDelta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.netDelta >= 0 ? '+' : ''}{(stats.netDelta / 1000).toFixed(1)}K
            </p>
          </motion.div>
          <motion.div 
            className="bg-background/50 rounded-lg p-2 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-[10px] text-muted-foreground">Buy Ratio</p>
            <p className={`text-sm font-bold ${stats.buyRatio >= 50 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.buyRatio.toFixed(1)}%
            </p>
          </motion.div>
        </div>

        {/* Cumulative Delta Trend */}
        <div className="flex items-center justify-between p-2 bg-background/30 rounded-lg">
          <span className="text-xs text-muted-foreground">Cumulative Delta Trend</span>
          <Badge 
            variant="outline" 
            className={`${
              trend === 'bullish' ? 'text-green-400 border-green-400/50' :
              trend === 'bearish' ? 'text-red-400 border-red-400/50' :
              'text-yellow-400 border-yellow-400/50'
            }`}
          >
            {trend === 'bullish' ? <TrendingUp className="h-3 w-3 mr-1" /> : 
             trend === 'bearish' ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
            {trend.charAt(0).toUpperCase() + trend.slice(1)}
          </Badge>
        </div>

        {/* Delta Chart */}
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
                interval={5}
              />
              <YAxis 
                yAxisId="delta"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
                tickFormatter={(val) => `${val > 0 ? '+' : ''}${(val / 1000).toFixed(0)}K`}
              />
              <YAxis 
                yAxisId="cumulative"
                orientation="right"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--primary))', fontSize: 9 }}
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}K`}
              />
              <ReferenceLine yAxisId="delta" y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
                formatter={(value: number, name: string) => [
                  name === 'cumulativeDelta' ? `${value.toLocaleString()}` : `${value.toLocaleString()}`,
                  name === 'delta' ? 'Delta' : name === 'cumulativeDelta' ? 'Cumulative Δ' : name
                ]}
              />
              <Bar yAxisId="delta" dataKey="delta" radius={[2, 2, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.delta >= 0 ? 'hsl(142 76% 36%)' : 'hsl(0 84% 60%)'} />
                ))}
              </Bar>
              <Line 
                yAxisId="cumulative"
                type="monotone" 
                dataKey="cumulativeDelta" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2} 
                dot={false} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-sm" />
            <span className="text-muted-foreground">Buy Delta</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-sm" />
            <span className="text-muted-foreground">Sell Delta</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-primary" />
            <span className="text-muted-foreground">Cumulative</span>
          </div>
        </div>

        {/* Interpretation */}
        <div className={`text-xs p-2 rounded-lg ${
          stats.lastCumulativeDelta > 5000 ? 'bg-green-500/10 text-green-400' :
          stats.lastCumulativeDelta < -5000 ? 'bg-red-500/10 text-red-400' :
          'bg-yellow-500/10 text-yellow-400'
        }`}>
          {stats.lastCumulativeDelta > 5000 ? (
            "Strong buying pressure - Institutions accumulating"
          ) : stats.lastCumulativeDelta < -5000 ? (
            "Heavy selling pressure - Distribution phase"
          ) : (
            "Balanced flow - No clear directional bias"
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeltaVolume;

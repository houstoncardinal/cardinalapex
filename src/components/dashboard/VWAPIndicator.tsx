import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Target } from "lucide-react";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from "recharts";

interface VWAPData {
  time: string;
  price: number;
  vwap: number;
  upperBand1: number;
  lowerBand1: number;
  upperBand2: number;
  lowerBand2: number;
  volume: number;
}

const generateVWAPData = (): VWAPData[] => {
  const data: VWAPData[] = [];
  let cumulativeTPV = 0;
  let cumulativeVolume = 0;
  const basePrice = 45000 + Math.random() * 5000;
  
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0');
    const volume = 1000 + Math.random() * 5000;
    const price = basePrice + (Math.random() - 0.5) * 2000 + Math.sin(i / 3) * 500;
    
    cumulativeTPV += price * volume;
    cumulativeVolume += volume;
    const vwap = cumulativeTPV / cumulativeVolume;
    
    const stdDev = Math.abs(price - vwap) * 0.5 + 200;
    
    data.push({
      time: `${hour}:00`,
      price: Math.round(price * 100) / 100,
      vwap: Math.round(vwap * 100) / 100,
      upperBand1: Math.round((vwap + stdDev) * 100) / 100,
      lowerBand1: Math.round((vwap - stdDev) * 100) / 100,
      upperBand2: Math.round((vwap + stdDev * 2) * 100) / 100,
      lowerBand2: Math.round((vwap - stdDev * 2) * 100) / 100,
      volume: Math.round(volume),
    });
  }
  return data;
};

const VWAPIndicator = () => {
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [timeframe, setTimeframe] = useState("1D");
  
  const data = useMemo(() => generateVWAPData(), [selectedAsset, timeframe]);
  
  const currentPrice = data[data.length - 1]?.price || 0;
  const currentVWAP = data[data.length - 1]?.vwap || 0;
  const deviation = ((currentPrice - currentVWAP) / currentVWAP) * 100;
  
  const getPositionSignal = () => {
    if (deviation > 1.5) return { signal: "Overbought", color: "text-red-400", icon: TrendingDown };
    if (deviation < -1.5) return { signal: "Oversold", color: "text-green-400", icon: TrendingUp };
    return { signal: "At VWAP", color: "text-yellow-400", icon: Target };
  };
  
  const positionSignal = getPositionSignal();
  const SignalIcon = positionSignal.icon;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            VWAP Indicator
          </CardTitle>
          <div className="flex gap-2">
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">BTC</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="SOL">SOL</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-20 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1D">1D</SelectItem>
                <SelectItem value="1W">1W</SelectItem>
                <SelectItem value="1M">1M</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* VWAP Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div 
            className="bg-background/50 rounded-lg p-3 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-xs text-muted-foreground mb-1">Current Price</p>
            <p className="text-lg font-bold text-foreground">${currentPrice.toLocaleString()}</p>
          </motion.div>
          <motion.div 
            className="bg-background/50 rounded-lg p-3 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-xs text-muted-foreground mb-1">VWAP</p>
            <p className="text-lg font-bold text-primary">${currentVWAP.toLocaleString()}</p>
          </motion.div>
          <motion.div 
            className="bg-background/50 rounded-lg p-3 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-xs text-muted-foreground mb-1">Deviation</p>
            <p className={`text-lg font-bold ${deviation >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {deviation >= 0 ? '+' : ''}{deviation.toFixed(2)}%
            </p>
          </motion.div>
        </div>

        {/* Signal Badge */}
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className={`${positionSignal.color} border-current`}>
            <SignalIcon className="h-3 w-3 mr-1" />
            {positionSignal.signal}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {deviation > 1.5 ? "Consider selling" : deviation < -1.5 ? "Consider buying" : "Fair value zone"}
          </span>
        </div>

        {/* VWAP Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                domain={['dataMin - 500', 'dataMax + 500']}
                tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number, name: string) => [
                  `$${value.toLocaleString()}`,
                  name === 'price' ? 'Price' : 
                  name === 'vwap' ? 'VWAP' :
                  name === 'upperBand2' ? '+2 StdDev' :
                  name === 'lowerBand2' ? '-2 StdDev' :
                  name === 'upperBand1' ? '+1 StdDev' : '-1 StdDev'
                ]}
              />
              <Area
                type="monotone"
                dataKey="upperBand2"
                stroke="none"
                fill="hsl(var(--primary) / 0.1)"
              />
              <Area
                type="monotone"
                dataKey="lowerBand2"
                stroke="none"
                fill="hsl(var(--background))"
              />
              <Line
                type="monotone"
                dataKey="upperBand1"
                stroke="hsl(var(--primary) / 0.3)"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="lowerBand1"
                stroke="hsl(var(--primary) / 0.3)"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="vwap"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--foreground))"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Band Legend */}
        <div className="flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-foreground" />
            <span className="text-muted-foreground">Price</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-primary" />
            <span className="text-muted-foreground">VWAP</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-primary/30" style={{ borderTop: '1px dashed' }} />
            <span className="text-muted-foreground">±1σ</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VWAPIndicator;

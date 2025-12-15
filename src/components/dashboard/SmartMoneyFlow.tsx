import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, TrendingUp, TrendingDown, Activity, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface FlowData {
  asset: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  whaleActivity: number;
  institutionalBias: "bullish" | "bearish" | "neutral";
}

interface TimelineData {
  time: string;
  buying: number;
  selling: number;
}

const generateFlowData = (): FlowData[] => [
  {
    asset: "BTC",
    inflow: 450 + Math.random() * 200,
    outflow: 320 + Math.random() * 150,
    netFlow: 130 + Math.random() * 100,
    whaleActivity: 75 + Math.random() * 20,
    institutionalBias: Math.random() > 0.3 ? "bullish" : Math.random() > 0.5 ? "bearish" : "neutral",
  },
  {
    asset: "ETH",
    inflow: 280 + Math.random() * 100,
    outflow: 350 + Math.random() * 120,
    netFlow: -70 + Math.random() * 50,
    whaleActivity: 60 + Math.random() * 25,
    institutionalBias: Math.random() > 0.5 ? "bearish" : Math.random() > 0.5 ? "bullish" : "neutral",
  },
  {
    asset: "SOL",
    inflow: 180 + Math.random() * 80,
    outflow: 120 + Math.random() * 60,
    netFlow: 60 + Math.random() * 40,
    whaleActivity: 85 + Math.random() * 15,
    institutionalBias: "bullish",
  },
];

const generateTimelineData = (): TimelineData[] => {
  const data: TimelineData[] = [];
  for (let i = 0; i < 12; i++) {
    const hour = (i * 2).toString().padStart(2, '0');
    data.push({
      time: `${hour}:00`,
      buying: 50 + Math.random() * 100,
      selling: -(30 + Math.random() * 80),
    });
  }
  return data;
};

const SmartMoneyFlow = () => {
  const [flowData, setFlowData] = useState<FlowData[]>(generateFlowData());
  const [timelineData, setTimelineData] = useState<TimelineData[]>(generateTimelineData());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowData(generateFlowData());
      setTimelineData(generateTimelineData());
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  
  const totalInflow = flowData.reduce((sum, d) => sum + d.inflow, 0);
  const totalOutflow = flowData.reduce((sum, d) => sum + d.outflow, 0);
  const netFlow = totalInflow - totalOutflow;
  const buyingPressure = (totalInflow / (totalInflow + totalOutflow)) * 100;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Smart Money Flow
          <Badge variant="outline" className="ml-auto text-xs">
            <Activity className="h-3 w-3 mr-1 animate-pulse text-green-400" />
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Flow Summary */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div 
            className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <TrendingUp className="h-4 w-4 text-green-400 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Total Inflow</p>
            <p className="text-lg font-bold text-green-400">${totalInflow.toFixed(0)}M</p>
          </motion.div>
          <motion.div 
            className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <TrendingDown className="h-4 w-4 text-red-400 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Total Outflow</p>
            <p className="text-lg font-bold text-red-400">${totalOutflow.toFixed(0)}M</p>
          </motion.div>
          <motion.div 
            className={`${netFlow >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} border rounded-lg p-3 text-center`}
            whileHover={{ scale: 1.02 }}
          >
            <Wallet className={`h-4 w-4 mx-auto mb-1 ${netFlow >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            <p className="text-xs text-muted-foreground">Net Flow</p>
            <p className={`text-lg font-bold ${netFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {netFlow >= 0 ? '+' : ''}${netFlow.toFixed(0)}M
            </p>
          </motion.div>
        </div>

        {/* Buying Pressure Gauge */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Institutional Buying Pressure</span>
            <span className={buyingPressure >= 50 ? 'text-green-400' : 'text-red-400'}>
              {buyingPressure.toFixed(1)}%
            </span>
          </div>
          <div className="relative h-3 bg-red-500/20 rounded-full overflow-hidden">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${buyingPressure}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <div className="absolute left-1/2 top-0 w-0.5 h-full bg-muted-foreground/50" />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Heavy Selling</span>
            <span>Neutral</span>
            <span>Heavy Buying</span>
          </div>
        </div>

        {/* Flow Timeline Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timelineData} stackOffset="sign">
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
                interval={1}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
                tickFormatter={(val) => `$${Math.abs(val)}M`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
                formatter={(value: number, name: string) => [
                  `$${Math.abs(value).toFixed(1)}M`,
                  name === 'buying' ? 'Buying' : 'Selling'
                ]}
              />
              <Bar dataKey="buying" fill="hsl(142 76% 36%)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="selling" fill="hsl(0 84% 60%)" radius={[0, 0, 2, 2]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Per-Asset Flow */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Asset Breakdown</p>
          {flowData.map((asset, index) => (
            <motion.div
              key={asset.asset}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-2 bg-background/50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{asset.asset}</span>
                <Badge 
                  variant="outline" 
                  className={`text-[10px] ${
                    asset.institutionalBias === 'bullish' ? 'text-green-400 border-green-400/50' :
                    asset.institutionalBias === 'bearish' ? 'text-red-400 border-red-400/50' :
                    'text-yellow-400 border-yellow-400/50'
                  }`}
                >
                  {asset.institutionalBias}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-green-400">+${asset.inflow.toFixed(0)}M</span>
                <span className="text-red-400">-${asset.outflow.toFixed(0)}M</span>
                <span className={asset.netFlow >= 0 ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                  {asset.netFlow >= 0 ? '+' : ''}${asset.netFlow.toFixed(0)}M
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Whale Activity Alert */}
        <motion.div 
          className="bg-primary/10 border border-primary/30 rounded-lg p-3"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">Whale Alert</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Large institutional buying detected in SOL - {flowData[2]?.whaleActivity.toFixed(0)}% whale accumulation score
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default SmartMoneyFlow;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Percent, TrendingUp, TrendingDown, AlertTriangle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface FundingRate {
  exchange: string;
  asset: string;
  rate: number;
  nextFunding: string;
  openInterest: number;
  trend: "up" | "down" | "stable";
}

interface HistoricalRate {
  time: string;
  binance: number;
  bybit: number;
  okx: number;
}

const exchanges = ["Binance", "Bybit", "OKX", "dYdX", "GMX"];

const generateFundingRates = (asset: string): FundingRate[] => 
  exchanges.map(exchange => ({
    exchange,
    asset,
    rate: (Math.random() - 0.5) * 0.15,
    nextFunding: `${Math.floor(Math.random() * 8)}h ${Math.floor(Math.random() * 60)}m`,
    openInterest: 500 + Math.random() * 2000,
    trend: Math.random() > 0.6 ? "up" : Math.random() > 0.3 ? "down" : "stable",
  }));

const generateHistoricalRates = (): HistoricalRate[] => {
  const data: HistoricalRate[] = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${(i).toString().padStart(2, '0')}:00`,
      binance: (Math.random() - 0.5) * 0.1,
      bybit: (Math.random() - 0.5) * 0.1,
      okx: (Math.random() - 0.5) * 0.1,
    });
  }
  return data;
};

const FundingRateTracker = () => {
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [fundingRates, setFundingRates] = useState<FundingRate[]>(generateFundingRates("BTC"));
  const [historicalRates, setHistoricalRates] = useState<HistoricalRate[]>(generateHistoricalRates());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    setFundingRates(generateFundingRates(selectedAsset));
    setHistoricalRates(generateHistoricalRates());
  }, [selectedAsset]);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setFundingRates(generateFundingRates(selectedAsset));
      setHistoricalRates(generateHistoricalRates());
      setIsRefreshing(false);
    }, 500);
  };
  
  const avgRate = fundingRates.reduce((sum, r) => sum + r.rate, 0) / fundingRates.length;
  const highestRate = Math.max(...fundingRates.map(r => r.rate));
  const lowestRate = Math.min(...fundingRates.map(r => r.rate));
  
  const getArbOpportunity = () => {
    const spread = highestRate - lowestRate;
    if (spread > 0.05) return { exists: true, spread, message: "Funding arbitrage opportunity detected!" };
    return { exists: false, spread, message: "No significant arbitrage opportunity" };
  };
  
  const arbOpportunity = getArbOpportunity();

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Percent className="h-5 w-5 text-primary" />
            Funding Rate Tracker
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
                <SelectItem value="DOGE">DOGE</SelectItem>
              </SelectContent>
            </Select>
            <motion.button
              onClick={handleRefresh}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 bg-background/50 rounded-md hover:bg-background/80 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 text-muted-foreground ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div 
            className="bg-background/50 rounded-lg p-3 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-xs text-muted-foreground mb-1">Avg Rate</p>
            <p className={`text-lg font-bold ${avgRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {avgRate >= 0 ? '+' : ''}{(avgRate * 100).toFixed(4)}%
            </p>
          </motion.div>
          <motion.div 
            className="bg-background/50 rounded-lg p-3 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-xs text-muted-foreground mb-1">Highest</p>
            <p className="text-lg font-bold text-green-400">
              +{(highestRate * 100).toFixed(4)}%
            </p>
          </motion.div>
          <motion.div 
            className="bg-background/50 rounded-lg p-3 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-xs text-muted-foreground mb-1">Lowest</p>
            <p className="text-lg font-bold text-red-400">
              {(lowestRate * 100).toFixed(4)}%
            </p>
          </motion.div>
        </div>

        {/* Arbitrage Alert */}
        {arbOpportunity.exists && (
          <motion.div 
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-xs font-medium text-yellow-400">{arbOpportunity.message}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Spread: {(arbOpportunity.spread * 100).toFixed(4)}% - Long on lowest, Short on highest
            </p>
          </motion.div>
        )}

        {/* Historical Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalRates}>
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
                interval={5}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
                tickFormatter={(val) => `${(val * 100).toFixed(2)}%`}
                domain={[-0.1, 0.1]}
              />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
                formatter={(value: number, name: string) => [
                  `${(value * 100).toFixed(4)}%`,
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="binance" 
                stroke="#F0B90B" 
                strokeWidth={2} 
                dot={false} 
              />
              <Line 
                type="monotone" 
                dataKey="bybit" 
                stroke="#FF8C00" 
                strokeWidth={2} 
                dot={false} 
              />
              <Line 
                type="monotone" 
                dataKey="okx" 
                stroke="#00D4AA" 
                strokeWidth={2} 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Exchange Legend */}
        <div className="flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5" style={{ backgroundColor: '#F0B90B' }} />
            <span className="text-muted-foreground">Binance</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5" style={{ backgroundColor: '#FF8C00' }} />
            <span className="text-muted-foreground">Bybit</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5" style={{ backgroundColor: '#00D4AA' }} />
            <span className="text-muted-foreground">OKX</span>
          </div>
        </div>

        {/* Exchange Rates Table */}
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {fundingRates.map((rate, index) => (
            <motion.div
              key={rate.exchange}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-2 bg-background/50 rounded-lg hover:bg-background/80 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm w-16">{rate.exchange}</span>
                {rate.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-400" />
                ) : rate.trend === "down" ? (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                ) : (
                  <div className="w-3 h-0.5 bg-yellow-400" />
                )}
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className={rate.rate >= 0 ? 'text-green-400 font-mono' : 'text-red-400 font-mono'}>
                  {rate.rate >= 0 ? '+' : ''}{(rate.rate * 100).toFixed(4)}%
                </span>
                <span className="text-muted-foreground w-16 text-right">
                  {rate.nextFunding}
                </span>
                <Badge variant="outline" className="text-[10px] w-20 justify-center">
                  OI: ${(rate.openInterest / 1000).toFixed(1)}B
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Market Sentiment */}
        <div className="flex items-center justify-between text-xs p-2 bg-background/30 rounded-lg">
          <span className="text-muted-foreground">Market Sentiment</span>
          <Badge 
            variant="outline" 
            className={avgRate > 0.02 ? 'text-green-400 border-green-400/50' : avgRate < -0.02 ? 'text-red-400 border-red-400/50' : 'text-yellow-400 border-yellow-400/50'}
          >
            {avgRate > 0.02 ? 'Bullish (Longs Paying)' : avgRate < -0.02 ? 'Bearish (Shorts Paying)' : 'Neutral'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundingRateTracker;

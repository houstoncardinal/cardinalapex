import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, TrendingUp, TrendingDown, Target, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface Prediction {
  token: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  timeframe: string;
  direction: 'bullish' | 'bearish';
  upperBound: number;
  lowerBound: number;
  signals: string[];
}

const mockPredictions: Record<string, Prediction> = {
  SOL: {
    token: 'SOL',
    currentPrice: 148.50,
    predictedPrice: 165.20,
    confidence: 78,
    timeframe: '7 days',
    direction: 'bullish',
    upperBound: 182.00,
    lowerBound: 155.00,
    signals: ['Strong buying pressure', 'Positive on-chain metrics', 'Bullish RSI divergence'],
  },
  BONK: {
    token: 'BONK',
    currentPrice: 0.000024,
    predictedPrice: 0.000032,
    confidence: 65,
    timeframe: '7 days',
    direction: 'bullish',
    upperBound: 0.000038,
    lowerBound: 0.000028,
    signals: ['Social sentiment spike', 'Whale accumulation', 'Volume breakout'],
  },
  WIF: {
    token: 'WIF',
    currentPrice: 2.85,
    predictedPrice: 2.45,
    confidence: 72,
    timeframe: '7 days',
    direction: 'bearish',
    upperBound: 2.65,
    lowerBound: 2.20,
    signals: ['Resistance rejection', 'Decreasing volume', 'Bearish MACD cross'],
  },
};

export const PricePrediction = () => {
  const [selectedToken, setSelectedToken] = useState('SOL');
  const prediction = mockPredictions[selectedToken];

  const generateChartData = () => {
    const data = [];
    const startPrice = prediction.currentPrice;
    const endPrice = prediction.predictedPrice;
    const priceRange = endPrice - startPrice;

    for (let i = 0; i <= 7; i++) {
      const progress = i / 7;
      const basePrice = startPrice + priceRange * progress;
      const variance = (prediction.upperBound - prediction.lowerBound) * 0.3 * progress;
      
      data.push({
        day: `Day ${i}`,
        price: i === 0 ? startPrice : basePrice + (Math.random() - 0.5) * variance,
        upper: startPrice + (prediction.upperBound - startPrice) * progress,
        lower: startPrice + (prediction.lowerBound - startPrice) * progress,
        predicted: basePrice,
      });
    }
    return data;
  };

  const chartData = generateChartData();
  const priceChange = ((prediction.predictedPrice - prediction.currentPrice) / prediction.currentPrice) * 100;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Price Prediction
            <Sparkles className="h-4 w-4 text-amber-400" />
          </CardTitle>
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SOL">SOL</SelectItem>
              <SelectItem value="BONK">BONK</SelectItem>
              <SelectItem value="WIF">WIF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Prediction Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-background/50 rounded-lg border border-border/30">
            <p className="text-xs text-muted-foreground">Current Price</p>
            <p className="text-lg font-bold text-foreground">
              ${prediction.currentPrice < 0.01 ? prediction.currentPrice.toFixed(6) : prediction.currentPrice.toFixed(2)}
            </p>
          </div>
          <div className={`p-3 rounded-lg border ${
            prediction.direction === 'bullish' 
              ? 'bg-emerald-500/10 border-emerald-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <p className="text-xs text-muted-foreground">Predicted ({prediction.timeframe})</p>
            <div className="flex items-center gap-2">
              <p className={`text-lg font-bold ${
                prediction.direction === 'bullish' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                ${prediction.predictedPrice < 0.01 ? prediction.predictedPrice.toFixed(6) : prediction.predictedPrice.toFixed(2)}
              </p>
              {prediction.direction === 'bullish' ? (
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
            </div>
          </div>
        </div>

        {/* Confidence & Change */}
        <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI Confidence</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  prediction.confidence >= 70 ? 'bg-emerald-500' : 
                  prediction.confidence >= 50 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${prediction.confidence}%` }}
              />
            </div>
            <Badge variant="outline" className="font-mono">
              {prediction.confidence}%
            </Badge>
          </div>
        </div>

        {/* Prediction Chart */}
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                hide 
                domain={['dataMin * 0.95', 'dataMax * 1.05']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill="hsl(var(--background))"
                fillOpacity={1}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={prediction.direction === 'bullish' ? '#10b981' : '#ef4444'}
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Confidence Interval */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Lower: ${prediction.lowerBound < 0.01 ? prediction.lowerBound.toFixed(6) : prediction.lowerBound.toFixed(2)}</span>
          <span className="text-primary">Confidence Interval</span>
          <span>Upper: ${prediction.upperBound < 0.01 ? prediction.upperBound.toFixed(6) : prediction.upperBound.toFixed(2)}</span>
        </div>

        {/* AI Signals */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">AI Signals</p>
          <div className="flex flex-wrap gap-2">
            {prediction.signals.map((signal, i) => (
              <Badge 
                key={i} 
                variant="outline" 
                className={`text-xs ${
                  prediction.direction === 'bullish' 
                    ? 'border-emerald-500/30 text-emerald-400' 
                    : 'border-red-500/30 text-red-400'
                }`}
              >
                {signal}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

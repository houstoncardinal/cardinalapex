import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BarChart3, TrendingUp, TrendingDown, Layers, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderLevel {
  price: number;
  size: number;
  total: number;
  percentage: number;
}

interface MarketDepthData {
  bids: OrderLevel[];
  asks: OrderLevel[];
  spread: number;
  spreadPercent: number;
  midPrice: number;
  imbalance: number;
}

const TOKENS = ['SOL', 'BONK', 'WIF', 'JTO', 'PYTH'];

export const MarketDepth = () => {
  const [selectedToken, setSelectedToken] = useState('SOL');
  const [isLoading, setIsLoading] = useState(false);
  const [depthData, setDepthData] = useState<MarketDepthData>({
    bids: [],
    asks: [],
    spread: 0,
    spreadPercent: 0,
    midPrice: 100,
    imbalance: 0
  });

  const generateDepthData = () => {
    setIsLoading(true);
    
    const basePrice = selectedToken === 'SOL' ? 100 : 
                     selectedToken === 'BONK' ? 0.000025 :
                     selectedToken === 'WIF' ? 2.5 :
                     selectedToken === 'JTO' ? 3.2 : 1.5;
    
    const priceStep = basePrice * 0.002; // 0.2% steps
    
    const generateLevels = (isAsk: boolean): OrderLevel[] => {
      const levels: OrderLevel[] = [];
      let cumulative = 0;
      
      for (let i = 0; i < 10; i++) {
        const size = Math.random() * 50000 + 10000;
        cumulative += size;
        const price = isAsk 
          ? basePrice * (1 + 0.001) + (i * priceStep)
          : basePrice * (1 - 0.001) - (i * priceStep);
        
        levels.push({
          price: parseFloat(price.toPrecision(6)),
          size: Math.round(size),
          total: Math.round(cumulative),
          percentage: 0
        });
      }
      
      // Calculate percentages
      const maxTotal = levels[levels.length - 1].total;
      levels.forEach(l => l.percentage = (l.total / maxTotal) * 100);
      
      return levels;
    };

    setTimeout(() => {
      const bids = generateLevels(false);
      const asks = generateLevels(true);
      
      const bestBid = bids[0].price;
      const bestAsk = asks[0].price;
      const spread = bestAsk - bestBid;
      const midPrice = (bestBid + bestAsk) / 2;
      
      // Calculate imbalance (positive = more bids, negative = more asks)
      const bidVolume = bids.reduce((sum, l) => sum + l.size, 0);
      const askVolume = asks.reduce((sum, l) => sum + l.size, 0);
      const imbalance = ((bidVolume - askVolume) / (bidVolume + askVolume)) * 100;

      setDepthData({
        bids,
        asks,
        spread,
        spreadPercent: (spread / midPrice) * 100,
        midPrice,
        imbalance
      });
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    generateDepthData();
  }, [selectedToken]);

  useEffect(() => {
    const interval = setInterval(generateDepthData, 5000);
    return () => clearInterval(interval);
  }, [selectedToken]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(0);
  };

  const formatPrice = (price: number) => {
    if (price < 0.001) return price.toFixed(8);
    if (price < 1) return price.toFixed(6);
    return price.toFixed(2);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Market Depth
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedToken} onValueChange={setSelectedToken}>
              <SelectTrigger className="h-8 w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TOKENS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={generateDepthData}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Spread & Imbalance */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 bg-muted/30 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Mid Price</p>
            <p className="text-sm font-bold text-foreground">${formatPrice(depthData.midPrice)}</p>
          </div>
          <div className="p-2 bg-muted/30 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Spread</p>
            <p className="text-sm font-bold text-foreground">{depthData.spreadPercent.toFixed(3)}%</p>
          </div>
          <div className="p-2 bg-muted/30 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Imbalance</p>
            <p className={`text-sm font-bold ${depthData.imbalance > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {depthData.imbalance > 0 ? '+' : ''}{depthData.imbalance.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Depth Visualization */}
        <TooltipProvider>
          <div className="space-y-1">
            {/* Asks (Sells) - Top */}
            <div className="space-y-0.5">
              {[...depthData.asks].reverse().slice(0, 7).map((level, i) => (
                <Tooltip key={`ask-${i}`}>
                  <TooltipTrigger asChild>
                    <div className="relative h-6 flex items-center cursor-pointer group">
                      <div 
                        className="absolute right-0 h-full bg-red-500/20 group-hover:bg-red-500/30 transition-colors"
                        style={{ width: `${level.percentage}%` }}
                      />
                      <div className="relative w-full flex justify-between px-2 text-xs">
                        <span className="text-red-400 font-mono">{formatPrice(level.price)}</span>
                        <span className="text-muted-foreground">{formatNumber(level.size)}</span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <div className="text-xs">
                      <p>Price: ${formatPrice(level.price)}</p>
                      <p>Size: {formatNumber(level.size)}</p>
                      <p>Total: {formatNumber(level.total)}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Spread Line */}
            <div className="py-2 flex items-center justify-center gap-2 border-y border-border">
              <Layers className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Spread: ${formatPrice(depthData.spread)} ({depthData.spreadPercent.toFixed(3)}%)
              </span>
            </div>

            {/* Bids (Buys) - Bottom */}
            <div className="space-y-0.5">
              {depthData.bids.slice(0, 7).map((level, i) => (
                <Tooltip key={`bid-${i}`}>
                  <TooltipTrigger asChild>
                    <div className="relative h-6 flex items-center cursor-pointer group">
                      <div 
                        className="absolute left-0 h-full bg-green-500/20 group-hover:bg-green-500/30 transition-colors"
                        style={{ width: `${level.percentage}%` }}
                      />
                      <div className="relative w-full flex justify-between px-2 text-xs">
                        <span className="text-green-400 font-mono">{formatPrice(level.price)}</span>
                        <span className="text-muted-foreground">{formatNumber(level.size)}</span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <div className="text-xs">
                      <p>Price: ${formatPrice(level.price)}</p>
                      <p>Size: {formatNumber(level.size)}</p>
                      <p>Total: {formatNumber(level.total)}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </TooltipProvider>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-3 h-3 text-red-400" />
            <span className="text-muted-foreground">Asks (Sell Orders)</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-muted-foreground">Bids (Buy Orders)</span>
          </div>
        </div>

        {/* Liquidity Summary */}
        <div className="p-2 bg-muted/20 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Bid Liquidity (10 levels)</span>
            <span className="text-green-400 font-medium">
              {formatNumber(depthData.bids.reduce((s, l) => s + l.size, 0))}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-muted-foreground">Ask Liquidity (10 levels)</span>
            <span className="text-red-400 font-medium">
              {formatNumber(depthData.asks.reduce((s, l) => s + l.size, 0))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

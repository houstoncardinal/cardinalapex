import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flame, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

interface LiquidationLevel {
  price: number;
  longLiquidations: number;
  shortLiquidations: number;
  totalValue: number;
  intensity: number;
}

interface ClusterZone {
  type: "long" | "short";
  priceRange: string;
  value: number;
  risk: "low" | "medium" | "high" | "extreme";
}

const generateLiquidationData = (basePrice: number): LiquidationLevel[] => {
  const data: LiquidationLevel[] = [];
  
  for (let i = -10; i <= 10; i++) {
    const priceOffset = i * (basePrice * 0.01);
    const price = basePrice + priceOffset;
    
    // More liquidations further from current price
    const distance = Math.abs(i);
    const longLiqs = i < 0 ? (1000 + Math.random() * 5000) * (distance * 0.5) : Math.random() * 500;
    const shortLiqs = i > 0 ? (1000 + Math.random() * 5000) * (distance * 0.5) : Math.random() * 500;
    const total = longLiqs + shortLiqs;
    
    data.push({
      price: Math.round(price),
      longLiquidations: Math.round(longLiqs),
      shortLiquidations: Math.round(shortLiqs),
      totalValue: Math.round(total),
      intensity: Math.min(total / 25000, 1),
    });
  }
  
  return data;
};

const getIntensityColor = (intensity: number, type: "long" | "short"): string => {
  if (type === "long") {
    if (intensity > 0.8) return "bg-red-500";
    if (intensity > 0.6) return "bg-red-400";
    if (intensity > 0.4) return "bg-orange-500";
    if (intensity > 0.2) return "bg-orange-400";
    return "bg-orange-300/50";
  } else {
    if (intensity > 0.8) return "bg-green-500";
    if (intensity > 0.6) return "bg-green-400";
    if (intensity > 0.4) return "bg-emerald-500";
    if (intensity > 0.2) return "bg-emerald-400";
    return "bg-emerald-300/50";
  }
};

const LiquidationHeatmap = () => {
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [basePrice, setBasePrice] = useState(45000);
  const [data, setData] = useState<LiquidationLevel[]>([]);
  
  useEffect(() => {
    const prices: Record<string, number> = { BTC: 45000, ETH: 2400, SOL: 95 };
    setBasePrice(prices[selectedAsset] || 45000);
    setData(generateLiquidationData(prices[selectedAsset] || 45000));
  }, [selectedAsset]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateLiquidationData(basePrice));
    }, 10000);
    return () => clearInterval(interval);
  }, [basePrice]);
  
  const clusters = useMemo((): ClusterZone[] => {
    const longCluster = data.filter(d => d.longLiquidations > 5000).slice(0, 3);
    const shortCluster = data.filter(d => d.shortLiquidations > 5000).slice(-3);
    
    const zones: ClusterZone[] = [];
    
    if (longCluster.length > 0) {
      const totalLong = longCluster.reduce((sum, d) => sum + d.longLiquidations, 0);
      zones.push({
        type: "long",
        priceRange: `$${longCluster[longCluster.length - 1]?.price.toLocaleString()} - $${longCluster[0]?.price.toLocaleString()}`,
        value: totalLong,
        risk: totalLong > 50000 ? "extreme" : totalLong > 30000 ? "high" : totalLong > 15000 ? "medium" : "low",
      });
    }
    
    if (shortCluster.length > 0) {
      const totalShort = shortCluster.reduce((sum, d) => sum + d.shortLiquidations, 0);
      zones.push({
        type: "short",
        priceRange: `$${shortCluster[0]?.price.toLocaleString()} - $${shortCluster[shortCluster.length - 1]?.price.toLocaleString()}`,
        value: totalShort,
        risk: totalShort > 50000 ? "extreme" : totalShort > 30000 ? "high" : totalShort > 15000 ? "medium" : "low",
      });
    }
    
    return zones;
  }, [data]);
  
  const totalLongLiqs = data.reduce((sum, d) => sum + d.longLiquidations, 0);
  const totalShortLiqs = data.reduce((sum, d) => sum + d.shortLiquidations, 0);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Liquidation Heatmap
          </CardTitle>
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
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-2">
          <motion.div 
            className="bg-background/50 rounded-lg p-2 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-[10px] text-muted-foreground">Current Price</p>
            <p className="text-sm font-bold text-foreground">${basePrice.toLocaleString()}</p>
          </motion.div>
          <motion.div 
            className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <TrendingDown className="h-3 w-3 text-red-400 mx-auto mb-0.5" />
            <p className="text-[10px] text-muted-foreground">Long Liqs</p>
            <p className="text-sm font-bold text-red-400">${(totalLongLiqs / 1000).toFixed(1)}K</p>
          </motion.div>
          <motion.div 
            className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <TrendingUp className="h-3 w-3 text-green-400 mx-auto mb-0.5" />
            <p className="text-[10px] text-muted-foreground">Short Liqs</p>
            <p className="text-sm font-bold text-green-400">${(totalShortLiqs / 1000).toFixed(1)}K</p>
          </motion.div>
        </div>

        {/* Heatmap Visualization */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-2">
            <span>Long Liquidations (Below)</span>
            <span>Short Liquidations (Above)</span>
          </div>
          
          {data.map((level, index) => {
            const isCurrentPrice = index === Math.floor(data.length / 2);
            const longIntensity = level.longLiquidations / 25000;
            const shortIntensity = level.shortLiquidations / 25000;
            
            return (
              <motion.div
                key={level.price}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`flex items-center gap-1 ${isCurrentPrice ? 'py-1 bg-primary/20 rounded' : ''}`}
              >
                {/* Long liquidation bar */}
                <div className="flex-1 h-4 bg-background/30 rounded-l overflow-hidden relative">
                  <motion.div 
                    className={`absolute right-0 h-full ${getIntensityColor(longIntensity, "long")}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(longIntensity * 100, 100)}%` }}
                    transition={{ duration: 0.5, delay: index * 0.02 }}
                  />
                  {level.longLiquidations > 5000 && (
                    <span className="absolute left-1 top-0.5 text-[9px] text-foreground font-medium">
                      ${(level.longLiquidations / 1000).toFixed(1)}K
                    </span>
                  )}
                </div>
                
                {/* Price label */}
                <div className={`w-20 text-center text-[10px] font-mono ${isCurrentPrice ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                  ${level.price.toLocaleString()}
                  {isCurrentPrice && <span className="ml-1">◄</span>}
                </div>
                
                {/* Short liquidation bar */}
                <div className="flex-1 h-4 bg-background/30 rounded-r overflow-hidden relative">
                  <motion.div 
                    className={`absolute left-0 h-full ${getIntensityColor(shortIntensity, "short")}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(shortIntensity * 100, 100)}%` }}
                    transition={{ duration: 0.5, delay: index * 0.02 }}
                  />
                  {level.shortLiquidations > 5000 && (
                    <span className="absolute right-1 top-0.5 text-[9px] text-foreground font-medium">
                      ${(level.shortLiquidations / 1000).toFixed(1)}K
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* High-Risk Zones */}
        {clusters.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-yellow-400" />
              Liquidation Clusters
            </p>
            {clusters.map((zone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  zone.type === 'long' ? 'bg-red-500/10 border border-red-500/30' : 'bg-green-500/10 border border-green-500/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  {zone.type === 'long' ? (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  )}
                  <div>
                    <p className="text-xs font-medium">{zone.type === 'long' ? 'Long' : 'Short'} Cluster</p>
                    <p className="text-[10px] text-muted-foreground">{zone.priceRange}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold ${zone.type === 'long' ? 'text-red-400' : 'text-green-400'}`}>
                    ${(zone.value / 1000).toFixed(1)}K
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`text-[9px] ${
                      zone.risk === 'extreme' ? 'text-red-500 border-red-500' :
                      zone.risk === 'high' ? 'text-orange-400 border-orange-400' :
                      zone.risk === 'medium' ? 'text-yellow-400 border-yellow-400' :
                      'text-green-400 border-green-400'
                    }`}
                  >
                    {zone.risk} risk
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border/30">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-sm" />
              <span>High Long Liqs</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-sm" />
              <span>High Short Liqs</span>
            </div>
          </div>
          <span className="text-yellow-400">Price moves toward clusters</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiquidationHeatmap;

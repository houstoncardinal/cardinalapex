import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Droplets, TrendingUp, Coins, Percent, Wallet, ExternalLink, Star } from 'lucide-react';

interface LiquidityPool {
  id: string;
  name: string;
  token0: string;
  token1: string;
  tvl: number;
  apr: number;
  volume24h: number;
  fees24h: number;
  protocol: string;
  risk: 'low' | 'medium' | 'high';
  isStable: boolean;
}

interface YieldFarm {
  id: string;
  name: string;
  token: string;
  apr: number;
  tvl: number;
  rewardToken: string;
  lockPeriod: string;
  protocol: string;
  risk: 'low' | 'medium' | 'high';
}

const MOCK_POOLS: LiquidityPool[] = [
  { id: '1', name: 'SOL-USDC', token0: 'SOL', token1: 'USDC', tvl: 125000000, apr: 24.5, volume24h: 45000000, fees24h: 135000, protocol: 'Raydium', risk: 'low', isStable: false },
  { id: '2', name: 'BONK-SOL', token0: 'BONK', token1: 'SOL', tvl: 28000000, apr: 85.2, volume24h: 18000000, fees24h: 54000, protocol: 'Orca', risk: 'medium', isStable: false },
  { id: '3', name: 'USDC-USDT', token0: 'USDC', token1: 'USDT', tvl: 95000000, apr: 8.5, volume24h: 32000000, fees24h: 16000, protocol: 'Raydium', risk: 'low', isStable: true },
  { id: '4', name: 'JUP-SOL', token0: 'JUP', token1: 'SOL', tvl: 42000000, apr: 45.8, volume24h: 12000000, fees24h: 36000, protocol: 'Meteora', risk: 'medium', isStable: false },
  { id: '5', name: 'WIF-SOL', token0: 'WIF', token1: 'SOL', tvl: 18500000, apr: 120.5, volume24h: 8500000, fees24h: 25500, protocol: 'Orca', risk: 'high', isStable: false },
];

const MOCK_FARMS: YieldFarm[] = [
  { id: '1', name: 'SOL Staking', token: 'SOL', apr: 7.2, tvl: 450000000, rewardToken: 'SOL', lockPeriod: 'No lock', protocol: 'Marinade', risk: 'low' },
  { id: '2', name: 'JUP Governance', token: 'JUP', apr: 18.5, tvl: 85000000, rewardToken: 'JUP', lockPeriod: '30 days', protocol: 'Jupiter', risk: 'low' },
  { id: '3', name: 'BONK Rewards', token: 'BONK', apr: 125.0, tvl: 15000000, rewardToken: 'BONK', lockPeriod: '7 days', protocol: 'BonkDAO', risk: 'high' },
  { id: '4', name: 'RAY Farm', token: 'RAY', apr: 32.5, tvl: 28000000, rewardToken: 'RAY', lockPeriod: '14 days', protocol: 'Raydium', risk: 'medium' },
  { id: '5', name: 'mSOL Boost', token: 'mSOL', apr: 9.8, tvl: 180000000, rewardToken: 'MNDE', lockPeriod: 'No lock', protocol: 'Marinade', risk: 'low' },
];

export const LiquidityTracking = () => {
  const [pools] = useState<LiquidityPool[]>(MOCK_POOLS);
  const [farms] = useState<YieldFarm[]>(MOCK_FARMS);

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-chart-2/20 text-chart-2';
      case 'medium': return 'bg-chart-4/20 text-chart-4';
      default: return 'bg-destructive/20 text-destructive';
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-chart-1" />
          DeFi Opportunities
        </CardTitle>
        <CardDescription>Liquidity pools & yield farming</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pools">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="pools">
              <Droplets className="h-4 w-4 mr-2" />
              Liquidity Pools
            </TabsTrigger>
            <TabsTrigger value="farms">
              <Coins className="h-4 w-4 mr-2" />
              Yield Farms
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pools">
            <ScrollArea className="h-[350px]">
              <div className="space-y-3">
                {pools.map((pool) => (
                  <div key={pool.id} className="p-4 rounded-lg bg-muted/30 border border-border/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{pool.name}</span>
                        {pool.isStable && <Badge variant="secondary" className="text-xs">Stable</Badge>}
                        <Badge variant="outline" className="text-xs">{pool.protocol}</Badge>
                      </div>
                      <Badge className={`${getRiskColor(pool.risk)} text-xs`}>
                        {pool.risk} risk
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">APR</p>
                        <p className="text-lg font-bold text-chart-2">{pool.apr.toFixed(1)}%</p>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">TVL</p>
                        <p className="text-lg font-bold">{formatNumber(pool.tvl)}</p>
                      </div>
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>24h Vol: {formatNumber(pool.volume24h)}</span>
                      <span>24h Fees: {formatNumber(pool.fees24h)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="farms">
            <ScrollArea className="h-[350px]">
              <div className="space-y-3">
                {farms.map((farm) => (
                  <div key={farm.id} className="p-4 rounded-lg bg-muted/30 border border-border/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{farm.name}</span>
                        <Badge variant="outline" className="text-xs">{farm.protocol}</Badge>
                      </div>
                      <Badge className={`${getRiskColor(farm.risk)} text-xs`}>
                        {farm.risk} risk
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">APR</p>
                        <p className="text-lg font-bold text-chart-2">{farm.apr.toFixed(1)}%</p>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">TVL</p>
                        <p className="text-sm font-bold">{formatNumber(farm.tvl)}</p>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Lock</p>
                        <p className="text-sm font-semibold">{farm.lockPeriod}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Stake: <span className="text-foreground font-medium">{farm.token}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Earn: <span className="text-chart-2 font-medium">{farm.rewardToken}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

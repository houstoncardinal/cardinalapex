import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, RefreshCw, Zap, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ArbitrageOpportunity {
  id: string;
  token: string;
  buyDex: string;
  sellDex: string;
  buyPrice: number;
  sellPrice: number;
  spread: number;
  profitPercent: number;
  estimatedProfit: number;
  liquidity: number;
  expiresIn: number;
  risk: 'low' | 'medium' | 'high';
}

const DEX_COLORS: Record<string, string> = {
  'Jupiter': 'bg-emerald-500/20 text-emerald-400',
  'Raydium': 'bg-purple-500/20 text-purple-400',
  'Orca': 'bg-blue-500/20 text-blue-400',
  'Phoenix': 'bg-orange-500/20 text-orange-400',
  'Lifinity': 'bg-pink-500/20 text-pink-400',
};

export const ArbitrageScanner = () => {
  const [scanning, setScanning] = useState(true);
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([
    {
      id: '1',
      token: 'SOL',
      buyDex: 'Raydium',
      sellDex: 'Jupiter',
      buyPrice: 147.82,
      sellPrice: 148.45,
      spread: 0.63,
      profitPercent: 0.43,
      estimatedProfit: 4.30,
      liquidity: 125000,
      expiresIn: 45,
      risk: 'low',
    },
    {
      id: '2',
      token: 'BONK',
      buyDex: 'Orca',
      sellDex: 'Raydium',
      buyPrice: 0.0000234,
      sellPrice: 0.0000241,
      spread: 0.0000007,
      profitPercent: 2.99,
      estimatedProfit: 29.90,
      liquidity: 45000,
      expiresIn: 30,
      risk: 'medium',
    },
    {
      id: '3',
      token: 'WIF',
      buyDex: 'Phoenix',
      sellDex: 'Jupiter',
      buyPrice: 2.82,
      sellPrice: 2.89,
      spread: 0.07,
      profitPercent: 2.48,
      estimatedProfit: 24.80,
      liquidity: 35000,
      expiresIn: 15,
      risk: 'medium',
    },
    {
      id: '4',
      token: 'JUP',
      buyDex: 'Lifinity',
      sellDex: 'Orca',
      buyPrice: 0.89,
      sellPrice: 0.93,
      spread: 0.04,
      profitPercent: 4.49,
      estimatedProfit: 44.90,
      liquidity: 18000,
      expiresIn: 8,
      risk: 'high',
    },
  ]);

  useEffect(() => {
    if (!scanning) return;

    const interval = setInterval(() => {
      setOpportunities(prev => prev.map(opp => ({
        ...opp,
        expiresIn: Math.max(0, opp.expiresIn - 1),
        profitPercent: opp.profitPercent * (0.95 + Math.random() * 0.1),
      })).filter(opp => opp.expiresIn > 0));

      // Occasionally add new opportunities
      if (Math.random() > 0.7) {
        const tokens = ['SOL', 'BONK', 'WIF', 'JUP', 'PYTH', 'RAY'];
        const dexes = ['Jupiter', 'Raydium', 'Orca', 'Phoenix', 'Lifinity'];
        const buyDex = dexes[Math.floor(Math.random() * dexes.length)];
        let sellDex = dexes[Math.floor(Math.random() * dexes.length)];
        while (sellDex === buyDex) {
          sellDex = dexes[Math.floor(Math.random() * dexes.length)];
        }

        const newOpp: ArbitrageOpportunity = {
          id: Date.now().toString(),
          token: tokens[Math.floor(Math.random() * tokens.length)],
          buyDex,
          sellDex,
          buyPrice: Math.random() * 100,
          sellPrice: Math.random() * 100 * 1.03,
          spread: Math.random() * 0.5,
          profitPercent: 0.5 + Math.random() * 4,
          estimatedProfit: 5 + Math.random() * 50,
          liquidity: 10000 + Math.random() * 100000,
          expiresIn: 20 + Math.floor(Math.random() * 40),
          risk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        };
        setOpportunities(prev => [newOpp, ...prev.slice(0, 4)]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [scanning]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Arbitrage Scanner
            {scanning && (
              <Badge className="bg-emerald-500/20 text-emerald-400 animate-pulse">
                SCANNING
              </Badge>
            )}
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => setScanning(!scanning)}>
            {scanning ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 bg-background/50 rounded-lg border border-border/30 text-center">
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-lg font-bold text-foreground">{opportunities.length}</p>
          </div>
          <div className="p-2 bg-background/50 rounded-lg border border-border/30 text-center">
            <p className="text-xs text-muted-foreground">Best Spread</p>
            <p className="text-lg font-bold text-emerald-400">
              {Math.max(...opportunities.map(o => o.profitPercent)).toFixed(2)}%
            </p>
          </div>
          <div className="p-2 bg-background/50 rounded-lg border border-border/30 text-center">
            <p className="text-xs text-muted-foreground">Total Profit</p>
            <p className="text-lg font-bold text-foreground">
              ${opportunities.reduce((s, o) => s + o.estimatedProfit, 0).toFixed(0)}
            </p>
          </div>
        </div>

        {/* Opportunities List */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {opportunities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 opacity-50 animate-spin" />
              <p>Scanning for opportunities...</p>
            </div>
          ) : (
            opportunities.map((opp) => (
              <div 
                key={opp.id}
                className={`p-3 rounded-lg border transition-all ${
                  opp.expiresIn < 10 ? 'border-red-500/50 bg-red-500/5' : 'border-border/30 bg-background/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{opp.token}</span>
                    <Badge className={getRiskColor(opp.risk)} variant="outline">
                      {opp.risk.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className={`h-3 w-3 ${opp.expiresIn < 10 ? 'text-red-400' : 'text-muted-foreground'}`} />
                    <span className={`text-xs ${opp.expiresIn < 10 ? 'text-red-400' : 'text-muted-foreground'}`}>
                      {opp.expiresIn}s
                    </span>
                  </div>
                </div>

                {/* Route */}
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={DEX_COLORS[opp.buyDex] || 'bg-muted text-muted-foreground'}>
                    {opp.buyDex}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Badge className={DEX_COLORS[opp.sellDex] || 'bg-muted text-muted-foreground'}>
                    {opp.sellDex}
                  </Badge>
                  <span className="text-emerald-400 font-bold ml-auto">
                    +{opp.profitPercent.toFixed(2)}%
                  </span>
                </div>

                {/* Details */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Buy: ${opp.buyPrice < 0.01 ? opp.buyPrice.toFixed(7) : opp.buyPrice.toFixed(2)}</span>
                  <span>Sell: ${opp.sellPrice < 0.01 ? opp.sellPrice.toFixed(7) : opp.sellPrice.toFixed(2)}</span>
                  <span>Liq: ${(opp.liquidity / 1000).toFixed(0)}K</span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 h-7" disabled={opp.expiresIn < 5}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Execute (${opp.estimatedProfit.toFixed(2)})
                  </Button>
                </div>

                {opp.expiresIn < 10 && (
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-red-400">
                    <AlertTriangle className="h-3 w-3" />
                    Opportunity expiring soon!
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Warning */}
        <div className="text-[10px] text-muted-foreground text-center">
          Arbitrage includes risks: slippage, gas fees, and execution timing. Profits not guaranteed.
        </div>
      </CardContent>
    </Card>
  );
};

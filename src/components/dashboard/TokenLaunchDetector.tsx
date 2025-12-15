import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Rocket, Clock, AlertTriangle, TrendingUp, ExternalLink, Bell, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NewToken {
  id: string;
  symbol: string;
  name: string;
  address: string;
  launchTime: Date;
  initialLiquidity: number;
  currentPrice: number;
  priceChange: number;
  holders: number;
  riskScore: 'low' | 'medium' | 'high' | 'extreme';
  verified: boolean;
  dex: string;
}

export const TokenLaunchDetector = () => {
  const [tokens, setTokens] = useState<NewToken[]>([
    {
      id: '1',
      symbol: 'NEWMEME',
      name: 'New Meme Token',
      address: '7xKX...AsU',
      launchTime: new Date(Date.now() - 5 * 60 * 1000),
      initialLiquidity: 25000,
      currentPrice: 0.00000082,
      priceChange: 245,
      holders: 89,
      riskScore: 'high',
      verified: false,
      dex: 'Raydium',
    },
    {
      id: '2',
      symbol: 'SOLAUNCH',
      name: 'Sol Launch',
      address: 'Pop...Upw',
      launchTime: new Date(Date.now() - 12 * 60 * 1000),
      initialLiquidity: 75000,
      currentPrice: 0.0024,
      priceChange: 180,
      holders: 234,
      riskScore: 'medium',
      verified: true,
      dex: 'Orca',
    },
    {
      id: '3',
      symbol: 'RUGPULL',
      name: 'Suspicious Token',
      address: 'MEW...PP5',
      launchTime: new Date(Date.now() - 3 * 60 * 1000),
      initialLiquidity: 5000,
      currentPrice: 0.0000001,
      priceChange: 500,
      holders: 12,
      riskScore: 'extreme',
      verified: false,
      dex: 'Raydium',
    },
  ]);

  const [alerts, setAlerts] = useState({
    newLaunches: true,
    highLiquidity: true,
    verifiedOnly: false,
  });

  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    if (!scanning) return;
    
    const interval = setInterval(() => {
      // Simulate new token detection
      if (Math.random() > 0.7) {
        const newToken: NewToken = {
          id: Date.now().toString(),
          symbol: `TOKEN${Math.floor(Math.random() * 1000)}`,
          name: `New Token ${Math.floor(Math.random() * 100)}`,
          address: `${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 5)}`,
          launchTime: new Date(),
          initialLiquidity: Math.floor(Math.random() * 100000),
          currentPrice: Math.random() * 0.001,
          priceChange: Math.floor(Math.random() * 500),
          holders: Math.floor(Math.random() * 100),
          riskScore: ['low', 'medium', 'high', 'extreme'][Math.floor(Math.random() * 4)] as any,
          verified: Math.random() > 0.7,
          dex: ['Raydium', 'Orca', 'Jupiter'][Math.floor(Math.random() * 3)],
        };
        setTokens(prev => [newToken, ...prev.slice(0, 9)]);
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, [scanning]);

  const getTimeSinceLaunch = (launchTime: Date) => {
    const mins = Math.floor((Date.now() - launchTime.getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'extreme': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Token Launch Detector
            {scanning && (
              <Badge className="bg-emerald-500/20 text-emerald-400 animate-pulse">
                <Zap className="h-3 w-3 mr-1" />
                LIVE
              </Badge>
            )}
          </CardTitle>
          <Switch checked={scanning} onCheckedChange={setScanning} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alert Settings */}
        <div className="flex flex-wrap gap-2 p-2 bg-background/50 rounded-lg border border-border/30">
          <Badge 
            variant="outline" 
            className={`cursor-pointer ${alerts.newLaunches ? 'bg-primary/20 text-primary' : ''}`}
            onClick={() => setAlerts(a => ({ ...a, newLaunches: !a.newLaunches }))}
          >
            <Bell className="h-3 w-3 mr-1" />
            New Launches
          </Badge>
          <Badge 
            variant="outline"
            className={`cursor-pointer ${alerts.highLiquidity ? 'bg-primary/20 text-primary' : ''}`}
            onClick={() => setAlerts(a => ({ ...a, highLiquidity: !a.highLiquidity }))}
          >
            $50k+ Liquidity
          </Badge>
          <Badge 
            variant="outline"
            className={`cursor-pointer ${alerts.verifiedOnly ? 'bg-primary/20 text-primary' : ''}`}
            onClick={() => setAlerts(a => ({ ...a, verifiedOnly: !a.verifiedOnly }))}
          >
            Verified Only
          </Badge>
        </div>

        {/* Token List */}
        <div className="space-y-2 max-h-[350px] overflow-y-auto">
          {tokens
            .filter(t => !alerts.verifiedOnly || t.verified)
            .map((token) => (
            <div 
              key={token.id}
              className="p-3 bg-background/50 rounded-lg border border-border/30 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{token.symbol}</span>
                    {token.verified && (
                      <Badge className="bg-blue-500/20 text-blue-400 text-[10px] py-0">✓ Verified</Badge>
                    )}
                    <Badge className={`text-[10px] py-0 ${getRiskColor(token.riskScore)}`}>
                      {token.riskScore === 'extreme' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {token.riskScore.toUpperCase()} RISK
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{token.name}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {getTimeSinceLaunch(token.launchTime)}
                    </span>
                    <span className="text-muted-foreground">
                      💧 ${token.initialLiquidity.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      👥 {token.holders} holders
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-foreground">
                    ${token.currentPrice < 0.0001 ? token.currentPrice.toExponential(2) : token.currentPrice.toFixed(6)}
                  </p>
                  <p className="text-xs text-emerald-400 flex items-center justify-end gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +{token.priceChange}%
                  </p>
                  <Badge variant="outline" className="text-[10px] mt-1">{token.dex}</Badge>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
                  Quick Buy
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2 p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-xs text-amber-400">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>New tokens carry extreme risk. Always DYOR and never invest more than you can afford to lose.</span>
        </div>
      </CardContent>
    </Card>
  );
};

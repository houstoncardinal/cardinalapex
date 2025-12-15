import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Zap, TrendingUp, TrendingDown, Bell, BellOff, AlertTriangle, Target, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface BreakoutLevel {
  id: string;
  token: string;
  type: 'support' | 'resistance';
  price: number;
  currentPrice: number;
  distance: number;
  strength: 'strong' | 'moderate' | 'weak';
  alertEnabled: boolean;
  touches: number;
}

interface BreakoutAlert {
  id: string;
  token: string;
  type: 'breakout' | 'breakdown';
  level: number;
  price: number;
  timestamp: Date;
  percentMove: number;
}

export const BreakoutDetector = () => {
  const [levels, setLevels] = useState<BreakoutLevel[]>([
    { id: '1', token: 'SOL', type: 'resistance', price: 105.00, currentPrice: 100.50, distance: 4.48, strength: 'strong', alertEnabled: true, touches: 5 },
    { id: '2', token: 'SOL', type: 'support', price: 95.00, currentPrice: 100.50, distance: 5.47, strength: 'strong', alertEnabled: true, touches: 4 },
    { id: '3', token: 'BONK', type: 'resistance', price: 0.00003, currentPrice: 0.000028, distance: 7.14, strength: 'moderate', alertEnabled: true, touches: 3 },
    { id: '4', token: 'WIF', type: 'support', price: 2.20, currentPrice: 2.45, distance: 10.2, strength: 'weak', alertEnabled: false, touches: 2 },
    { id: '5', token: 'JTO', type: 'resistance', price: 3.50, currentPrice: 3.25, distance: 7.69, strength: 'moderate', alertEnabled: true, touches: 3 }
  ]);

  const [recentAlerts, setRecentAlerts] = useState<BreakoutAlert[]>([
    { id: '1', token: 'RAY', type: 'breakout', level: 4.50, price: 4.68, timestamp: new Date(Date.now() - 1800000), percentMove: 4.0 },
    { id: '2', token: 'ORCA', type: 'breakdown', level: 3.00, price: 2.85, timestamp: new Date(Date.now() - 3600000), percentMove: -5.0 }
  ]);

  const [scanning, setScanning] = useState(true);

  const toggleAlert = (id: string) => {
    setLevels(prev => prev.map(l => 
      l.id === id ? { ...l, alertEnabled: !l.alertEnabled } : l
    ));
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'weak': return 'bg-orange-500';
      default: return 'bg-muted';
    }
  };

  const simulateBreakout = () => {
    const tokens = ['SOL', 'BONK', 'WIF', 'JTO', 'PYTH'];
    const token = tokens[Math.floor(Math.random() * tokens.length)];
    const isBreakout = Math.random() > 0.5;
    const percentMove = (Math.random() * 5 + 2) * (isBreakout ? 1 : -1);
    
    const newAlert: BreakoutAlert = {
      id: Date.now().toString(),
      token,
      type: isBreakout ? 'breakout' : 'breakdown',
      level: 100,
      price: 100 * (1 + percentMove / 100),
      timestamp: new Date(),
      percentMove
    };

    setRecentAlerts(prev => [newAlert, ...prev].slice(0, 5));
    toast.success(`${isBreakout ? '🚀 Breakout' : '📉 Breakdown'}: ${token} moved ${percentMove.toFixed(1)}%`);
  };

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        if (Math.random() > 0.8) {
          simulateBreakout();
        }
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [scanning]);

  const nearBreakouts = levels.filter(l => l.distance < 5);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Breakout Detector
          </CardTitle>
          <div className="flex items-center gap-2">
            <Switch checked={scanning} onCheckedChange={setScanning} />
            <span className="text-xs text-muted-foreground">{scanning ? 'Scanning' : 'Paused'}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Near Breakout Warning */}
        {nearBreakouts.length > 0 && (
          <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span className="text-sm text-yellow-400">
                {nearBreakouts.length} level(s) within 5% of breakout
              </span>
            </div>
          </div>
        )}

        {/* Key Levels */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Target className="w-4 h-4" />
            Key Levels
          </h4>
          <ScrollArea className="h-[180px]">
            <div className="space-y-2">
              {levels.map((level) => (
                <div 
                  key={level.id} 
                  className={`p-2 rounded-lg border ${
                    level.distance < 5 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-muted/20 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {level.type === 'resistance' ? (
                        <TrendingUp className="w-4 h-4 text-red-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-green-400" />
                      )}
                      <span className="font-medium text-foreground">{level.token}</span>
                      <Badge variant="outline" className="text-xs capitalize">{level.type}</Badge>
                      <Badge className={`${getStrengthColor(level.strength)} text-xs`}>
                        {level.strength}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAlert(level.id)}
                      className="h-6 w-6 p-0"
                    >
                      {level.alertEnabled ? (
                        <Bell className="w-3 h-3 text-primary" />
                      ) : (
                        <BellOff className="w-3 h-3 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Level:</span>
                      <span className="ml-1 text-foreground">${level.price}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Current:</span>
                      <span className="ml-1 text-foreground">${level.currentPrice}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Distance:</span>
                      <span className={`ml-1 ${level.distance < 5 ? 'text-yellow-400' : 'text-foreground'}`}>
                        {level.distance.toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Touches:</span>
                      <span className="ml-1 text-foreground">{level.touches}x</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Recent Alerts */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Recent Breakouts</h4>
          {recentAlerts.length > 0 ? (
            <div className="space-y-1">
              {recentAlerts.slice(0, 3).map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-2 rounded-lg flex items-center justify-between ${
                    alert.type === 'breakout' ? 'bg-green-500/10' : 'bg-red-500/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {alert.type === 'breakout' ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className="font-medium text-foreground">{alert.token}</span>
                    <Badge variant={alert.type === 'breakout' ? 'default' : 'destructive'} className="text-xs">
                      {alert.type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${alert.percentMove >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {alert.percentMove >= 0 ? '+' : ''}{alert.percentMove.toFixed(1)}%
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No recent breakouts</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

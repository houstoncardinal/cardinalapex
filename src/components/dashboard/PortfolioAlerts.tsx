import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, TrendingDown, TrendingUp, AlertTriangle, Fish, Shield, Settings } from 'lucide-react';
import { useState } from 'react';

interface Alert {
  id: string;
  type: 'value_change' | 'whale_movement' | 'risk_change';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  read: boolean;
}

interface AlertSettings {
  valueChangeThreshold: number;
  whaleMovements: boolean;
  riskScoreChanges: boolean;
  priceAlerts: boolean;
}

export const PortfolioAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'value_change',
      title: 'Portfolio Value Surge',
      message: 'Your portfolio increased by 12.5% in the last hour',
      severity: 'info',
      timestamp: '2 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'whale_movement',
      title: 'Whale Alert: SOL',
      message: 'Large holder moved 50,000 SOL to exchange',
      severity: 'warning',
      timestamp: '15 min ago',
      read: false,
    },
    {
      id: '3',
      type: 'risk_change',
      title: 'Risk Score Increased',
      message: 'BONK risk score changed from Medium to High',
      severity: 'critical',
      timestamp: '1 hour ago',
      read: true,
    },
    {
      id: '4',
      type: 'value_change',
      title: 'Significant Drop Detected',
      message: 'PEPE position down 8.3% - consider reviewing',
      severity: 'warning',
      timestamp: '2 hours ago',
      read: true,
    },
  ]);

  const [settings, setSettings] = useState<AlertSettings>({
    valueChangeThreshold: 5,
    whaleMovements: true,
    riskScoreChanges: true,
    priceAlerts: true,
  });

  const [showSettings, setShowSettings] = useState(false);

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'warning': return 'bg-amber-500/20 border-amber-500/30 text-amber-400';
      default: return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'value_change': return <TrendingUp className="h-4 w-4" />;
      case 'whale_movement': return <Fish className="h-4 w-4" />;
      case 'risk_change': return <Shield className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Portfolio Alerts
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showSettings ? (
          <div className="space-y-4 p-3 bg-background/50 rounded-lg border border-border/30">
            <p className="text-sm font-medium text-foreground">Alert Settings</p>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Value Change Alerts</p>
                <p className="text-xs text-muted-foreground">Alert when portfolio changes by {settings.valueChangeThreshold}%+</p>
              </div>
              <Switch checked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Whale Movements</p>
                <p className="text-xs text-muted-foreground">Track large holder transactions</p>
              </div>
              <Switch 
                checked={settings.whaleMovements}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, whaleMovements: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Risk Score Changes</p>
                <p className="text-xs text-muted-foreground">Alert on token risk level changes</p>
              </div>
              <Switch 
                checked={settings.riskScoreChanges}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, riskScoreChanges: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Price Alerts</p>
                <p className="text-xs text-muted-foreground">Custom price target notifications</p>
              </div>
              <Switch 
                checked={settings.priceAlerts}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, priceAlerts: checked }))}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  alert.read ? 'bg-background/30 border-border/20 opacity-60' : getSeverityStyles(alert.severity)
                }`}
                onClick={() => markAsRead(alert.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded ${getSeverityStyles(alert.severity)}`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm text-foreground truncate">{alert.title}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                  </div>
                  {!alert.read && (
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!showSettings && alerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No alerts yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

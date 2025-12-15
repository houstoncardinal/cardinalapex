import { Bell, BellOff, TrendingUp, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const NotificationSettings = () => {
  const {
    isSupported,
    permission,
    settings,
    requestPermission,
    updateSettings,
  } = useNotifications();

  if (!isSupported) {
    return (
      <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
        <div className="flex items-center gap-2 text-destructive">
          <BellOff className="h-5 w-5" />
          <span className="font-medium">Notifications Not Supported</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Your browser doesn't support push notifications
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Permission Status */}
      <div className={cn(
        "p-4 rounded-xl border",
        permission === 'granted' 
          ? "bg-success/10 border-success/20" 
          : "bg-warning/10 border-warning/20"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {permission === 'granted' ? (
              <Bell className="h-5 w-5 text-success" />
            ) : (
              <BellOff className="h-5 w-5 text-warning" />
            )}
            <span className="font-medium">
              {permission === 'granted' ? 'Notifications Enabled' : 'Enable Notifications'}
            </span>
          </div>
          {permission !== 'granted' && (
            <Button size="sm" onClick={requestPermission}>
              Enable
            </Button>
          )}
          {permission === 'granted' && (
            <Badge variant="outline" className="bg-success/20 text-success border-success/30">
              Active
            </Badge>
          )}
        </div>
        {permission !== 'granted' && (
          <p className="text-sm text-muted-foreground mt-2">
            Get instant alerts for trades, price movements, and AI signals
          </p>
        )}
      </div>

      {/* Notification Preferences */}
      {permission === 'granted' && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Alert Preferences</h4>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-success" />
              <div>
                <Label htmlFor="trade-notifications" className="cursor-pointer">
                  Trade Executions
                </Label>
                <p className="text-xs text-muted-foreground">
                  Alert when trades are executed
                </p>
              </div>
            </div>
            <Switch
              id="trade-notifications"
              checked={settings.tradeExecutions}
              onCheckedChange={(checked) => updateSettings({ tradeExecutions: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-warning" />
              <div>
                <Label htmlFor="price-notifications" className="cursor-pointer">
                  Price Alerts
                </Label>
                <p className="text-xs text-muted-foreground">
                  Alert when price targets are hit
                </p>
              </div>
            </div>
            <Switch
              id="price-notifications"
              checked={settings.priceAlerts}
              onCheckedChange={(checked) => updateSettings({ priceAlerts: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-primary" />
              <div>
                <Label htmlFor="signal-notifications" className="cursor-pointer">
                  High Confidence Signals
                </Label>
                <p className="text-xs text-muted-foreground">
                  Alert for 85%+ confidence patterns
                </p>
              </div>
            </div>
            <Switch
              id="signal-notifications"
              checked={settings.highConfidenceSignals}
              onCheckedChange={(checked) => updateSettings({ highConfidenceSignals: checked })}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default NotificationSettings;

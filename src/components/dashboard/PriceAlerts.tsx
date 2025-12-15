import { useState, useEffect } from "react";
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLivePrices } from "@/hooks/useLivePrice";
import { useNotifications } from "@/hooks/useNotifications";

interface PriceAlert {
  id: string;
  symbol: string;
  market: string;
  target_price: number;
  condition: string;
  is_triggered: boolean | null;
  is_active: boolean | null;
  created_at: string;
}

// Expanded symbols including meme coins
const SYMBOLS = ['BTC', 'ETH', 'SOL', 'BONK', 'WIF', 'PEPE', 'POPCAT', 'MEW', 'BOME', 'DOGE', 'SHIB', 'FLOKI'];

export const PriceAlerts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { notifyPriceAlert } = useNotifications();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [newSymbol, setNewSymbol] = useState('BTC');
  const [newPrice, setNewPrice] = useState('');
  const [newCondition, setNewCondition] = useState<'above' | 'below'>('above');

  // Get live prices to check alerts
  const { prices } = useLivePrices(SYMBOLS, 'crypto');

  // Fetch alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching alerts:', error);
      } else {
        setAlerts(data || []);
      }
      setLoading(false);
    };

    fetchAlerts();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('price-alerts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'price_alerts',
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAlerts(prev => [payload.new as PriceAlert, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setAlerts(prev => prev.map(a => a.id === payload.new.id ? payload.new as PriceAlert : a));
          } else if (payload.eventType === 'DELETE') {
            setAlerts(prev => prev.filter(a => a.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Check alerts against live prices
  useEffect(() => {
    alerts.forEach(async (alert) => {
      if (!alert.is_active || alert.is_triggered) return;

      const currentPrice = prices[alert.symbol]?.price;
      if (!currentPrice) return;

      const shouldTrigger = 
        (alert.condition === 'above' && currentPrice >= alert.target_price) ||
        (alert.condition === 'below' && currentPrice <= alert.target_price);

      if (shouldTrigger) {
        // Update alert as triggered
        await supabase
          .from('price_alerts')
          .update({ is_triggered: true, triggered_at: new Date().toISOString() })
          .eq('id', alert.id);

        // Send push notification
        notifyPriceAlert(alert.symbol, alert.target_price, currentPrice, alert.condition as 'above' | 'below');

        toast({
          title: "Price Alert Triggered!",
          description: `${alert.symbol} is now ${alert.condition} $${alert.target_price.toLocaleString()} (Current: $${currentPrice.toLocaleString()})`,
        });
      }
    });
  }, [prices, alerts, toast, notifyPriceAlert]);

  const createAlert = async () => {
    if (!user || !newPrice) return;

    setCreating(true);
    const { error } = await supabase
      .from('price_alerts')
      .insert({
        user_id: user.id,
        symbol: newSymbol,
        market: 'crypto',
        target_price: parseFloat(newPrice),
        condition: newCondition,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Alert Created",
        description: `You'll be notified when ${newSymbol} goes ${newCondition} $${parseFloat(newPrice).toLocaleString()}`,
      });
      setShowForm(false);
      setNewPrice('');
    }
    setCreating(false);
  };

  const deleteAlert = async (id: string) => {
    const { error } = await supabase
      .from('price_alerts')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete alert",
        variant: "destructive",
      });
    }
  };

  const activeAlerts = alerts.filter(a => !a.is_triggered && a.is_active);
  const triggeredAlerts = alerts.filter(a => a.is_triggered);

  return (
    <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/20">
            <Bell className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Price Alerts</h3>
            <p className="text-sm text-muted-foreground">{activeAlerts.length} active</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Alert
        </Button>
      </div>

      {/* Create Alert Form */}
      {showForm && (
        <div className="mb-4 p-4 rounded-xl border border-border bg-secondary/30">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Select value={newSymbol} onValueChange={setNewSymbol}>
              <SelectTrigger>
                <SelectValue placeholder="Symbol" />
              </SelectTrigger>
              <SelectContent>
                {SYMBOLS.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={newCondition} onValueChange={(v) => setNewCondition(v as 'above' | 'below')}>
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Above</SelectItem>
                <SelectItem value="below">Below</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Target price"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="flex-1"
            />
            <Button onClick={createAlert} disabled={creating || !newPrice}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </Button>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : alerts.length === 0 ? (
          <p className="text-center text-muted-foreground py-4 text-sm">
            No alerts set. Create one to get notified!
          </p>
        ) : (
          <>
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/20"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    alert.condition === 'above' ? "bg-success/20" : "bg-destructive/20"
                  )}>
                    {alert.condition === 'above' ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {alert.symbol} {alert.condition} ${alert.target_price.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Current: ${prices[alert.symbol]?.price?.toLocaleString() || '---'}
                    </p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteAlert(alert.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {triggeredAlerts.length > 0 && (
              <>
                <p className="text-xs text-muted-foreground pt-2">Triggered</p>
                {triggeredAlerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-success/30 bg-success/10 opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {alert.symbol} {alert.condition} ${alert.target_price.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Triggered</p>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => deleteAlert(alert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

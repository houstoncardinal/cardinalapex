import { useState, useEffect } from "react";
import { History, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, Loader2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

interface Trade {
  id: string;
  symbol: string;
  market: string;
  type: string;
  quantity: number;
  price: number;
  profit_loss: number | null;
  status: string;
  created_at: string;
  bot_id: string | null;
}

export const TradesHistory = () => {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    const fetchTrades = async () => {
      if (!user) return;

      let query = supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching trades:', error);
      } else {
        setTrades(data || []);
      }
      setLoading(false);
    };

    fetchTrades();

    // Subscribe to realtime trade updates
    const channel = supabase
      .channel('trades-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trades',
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTrades(prev => [payload.new as Trade, ...prev.slice(0, 49)]);
          } else if (payload.eventType === 'UPDATE') {
            setTrades(prev => prev.map(t => t.id === payload.new.id ? payload.new as Trade : t));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const filteredTrades = trades.filter(trade => {
    if (filter !== 'all' && trade.type.toLowerCase() !== filter) return false;
    if (statusFilter !== 'all' && trade.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: trades.length,
    buys: trades.filter(t => t.type.toLowerCase() === 'buy').length,
    sells: trades.filter(t => t.type.toLowerCase() === 'sell').length,
    totalPnL: trades.reduce((sum, t) => sum + (t.profit_loss || 0), 0),
    winRate: trades.length > 0 
      ? (trades.filter(t => (t.profit_loss || 0) > 0).length / trades.filter(t => t.profit_loss !== null).length) * 100 
      : 0,
  };

  return (
    <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
            <History className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Trade History</h3>
            <p className="text-sm text-muted-foreground">{stats.total} trades • {stats.winRate.toFixed(0)}% win rate</p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-4 mb-4 p-3 rounded-xl bg-secondary/30 border border-border">
        <div className="flex-1 text-center">
          <p className="text-xs text-muted-foreground">Buys</p>
          <p className="font-bold text-success">{stats.buys}</p>
        </div>
        <div className="w-px bg-border" />
        <div className="flex-1 text-center">
          <p className="text-xs text-muted-foreground">Sells</p>
          <p className="font-bold text-destructive">{stats.sells}</p>
        </div>
        <div className="w-px bg-border" />
        <div className="flex-1 text-center">
          <p className="text-xs text-muted-foreground">Total P&L</p>
          <p className={cn("font-bold", stats.totalPnL >= 0 ? "text-success" : "text-destructive")}>
            {stats.totalPnL >= 0 ? "+" : ""}${stats.totalPnL.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="buy">Buy</SelectItem>
            <SelectItem value="sell">Sell</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trades List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredTrades.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-muted-foreground text-sm">No trades yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              AI agents will execute trades automatically
            </p>
          </div>
        ) : (
          filteredTrades.map((trade, index) => (
            <div
              key={trade.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl border transition-all opacity-0 animate-slide-in-right",
                trade.status === 'completed' 
                  ? "border-border bg-secondary/20" 
                  : "border-warning/30 bg-warning/5"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg",
                  trade.type.toLowerCase() === 'buy' 
                    ? "bg-success/20" 
                    : "bg-destructive/20"
                )}>
                  {trade.type.toLowerCase() === 'buy' ? (
                    <ArrowUpRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm">{trade.symbol}</p>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px] py-0",
                        trade.type.toLowerCase() === 'buy' 
                          ? "border-success/50 text-success" 
                          : "border-destructive/50 text-destructive"
                      )}
                    >
                      {trade.type}
                    </Badge>
                    {trade.bot_id && (
                      <Badge variant="secondary" className="text-[10px] py-0">
                        AI
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(trade.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-medium text-foreground text-sm">
                  {trade.quantity} @ ${trade.price.toLocaleString()}
                </p>
                <div className="flex items-center justify-end gap-1">
                  {trade.status === 'completed' ? (
                    <CheckCircle className="h-3 w-3 text-success" />
                  ) : trade.status === 'pending' ? (
                    <Clock className="h-3 w-3 text-warning animate-pulse" />
                  ) : (
                    <XCircle className="h-3 w-3 text-destructive" />
                  )}
                  {trade.profit_loss !== null && (
                    <span className={cn(
                      "text-xs font-medium",
                      trade.profit_loss >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {trade.profit_loss >= 0 ? "+" : ""}${trade.profit_loss.toFixed(2)}
                    </span>
                  )}
                  {trade.profit_loss === null && (
                    <span className="text-xs text-muted-foreground">{trade.status}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

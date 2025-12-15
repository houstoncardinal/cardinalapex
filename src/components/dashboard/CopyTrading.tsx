import { useState, useEffect } from 'react';
import { Users, TrendingUp, Star, Copy, UserPlus, Settings2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TopTrader {
  id: string;
  display_name: string;
  avatar_url: string | null;
  total_pnl: number;
  win_rate: number;
  total_trades: number;
  followers_count: number;
  strategy_description: string | null;
}

interface CopyRelation {
  id: string;
  trader_id: string;
  allocation_percentage: number;
  max_trade_size: number;
  is_active: boolean;
  total_copied_trades: number;
  total_pnl: number;
  trader?: TopTrader;
}

// Demo top traders data
const DEMO_TRADERS: TopTrader[] = [
  { id: '1', display_name: 'CryptoWhale', avatar_url: null, total_pnl: 45230.50, win_rate: 78.5, total_trades: 342, followers_count: 1243, strategy_description: 'Momentum swing trading on major pairs' },
  { id: '2', display_name: 'MemeKing', avatar_url: null, total_pnl: 28450.00, win_rate: 65.2, total_trades: 567, followers_count: 892, strategy_description: 'High-frequency meme coin scalping' },
  { id: '3', display_name: 'DiamondHands', avatar_url: null, total_pnl: 67890.25, win_rate: 82.1, total_trades: 156, followers_count: 2341, strategy_description: 'Long-term accumulation with DCA' },
  { id: '4', display_name: 'SOLSniper', avatar_url: null, total_pnl: 19234.75, win_rate: 71.8, total_trades: 423, followers_count: 567, strategy_description: 'Technical analysis breakout trading' },
];

export const CopyTrading = () => {
  const { user } = useAuth();
  const [traders, setTraders] = useState<TopTrader[]>(DEMO_TRADERS);
  const [copyRelations, setCopyRelations] = useState<CopyRelation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<TopTrader | null>(null);
  const [allocation, setAllocation] = useState(10);
  const [maxTradeSize, setMaxTradeSize] = useState(0.5);

  useEffect(() => {
    if (user) fetchCopyRelations();
  }, [user]);

  const fetchCopyRelations = async () => {
    const { data, error } = await supabase
      .from('copy_trading')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setCopyRelations(data);
    }
  };

  const followTrader = async (trader: TopTrader) => {
    if (!user) {
      toast.error('Please sign in to follow traders');
      return;
    }

    setIsLoading(true);
    
    // Check if already following
    const existing = copyRelations.find(r => r.trader_id === trader.id);
    if (existing) {
      toast.error('You are already following this trader');
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.from('copy_trading').insert({
      follower_user_id: user.id,
      trader_id: trader.id,
      allocation_percentage: allocation,
      max_trade_size: maxTradeSize,
    });

    if (error) {
      toast.error('Failed to follow trader');
    } else {
      toast.success(`Now copying ${trader.display_name}'s trades!`);
      fetchCopyRelations();
      setSelectedTrader(null);
    }
    setIsLoading(false);
  };

  const toggleCopyTrading = async (relationId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('copy_trading')
      .update({ is_active: !isActive })
      .eq('id', relationId);

    if (!error) {
      setCopyRelations(prev => 
        prev.map(r => r.id === relationId ? { ...r, is_active: !isActive } : r)
      );
      toast.success(isActive ? 'Copy trading paused' : 'Copy trading resumed');
    }
  };

  const unfollowTrader = async (relationId: string) => {
    const { error } = await supabase
      .from('copy_trading')
      .delete()
      .eq('id', relationId);

    if (!error) {
      setCopyRelations(prev => prev.filter(r => r.id !== relationId));
      toast.success('Unfollowed trader');
    }
  };

  const isFollowing = (traderId: string) => copyRelations.some(r => r.trader_id === traderId);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 glow-primary">
            <Users className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold">Copy Trading</h3>
            <p className="text-xs text-muted-foreground">Follow top performers</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          {copyRelations.filter(r => r.is_active).length} active
        </Badge>
      </div>

      {/* Your Copy Trading */}
      {copyRelations.length > 0 && (
        <div className="mb-4 pb-4 border-b border-border">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">YOUR COPY TRADING</h4>
          <div className="space-y-2">
            {copyRelations.map(relation => {
              const trader = traders.find(t => t.id === relation.trader_id);
              return (
                <div key={relation.id} className={cn(
                  "flex items-center justify-between p-2 rounded-lg",
                  relation.is_active ? "bg-primary/5" : "bg-secondary/30"
                )}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px]">
                        {trader?.display_name.slice(0, 2).toUpperCase() || '??'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{trader?.display_name || 'Unknown'}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {relation.allocation_percentage}% • {relation.total_copied_trades} trades
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs font-mono",
                      relation.total_pnl >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {relation.total_pnl >= 0 ? '+' : ''}{relation.total_pnl.toFixed(2)}
                    </span>
                    <Switch
                      checked={relation.is_active}
                      onCheckedChange={() => toggleCopyTrading(relation.id, relation.is_active)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Traders List */}
      <h4 className="text-xs font-medium text-muted-foreground mb-2">TOP TRADERS</h4>
      <div className="space-y-2">
        {traders.map((trader, index) => (
          <Dialog key={trader.id}>
            <DialogTrigger asChild>
              <div 
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer group"
                onClick={() => setSelectedTrader(trader)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-primary/30 to-purple-500/30">
                        {trader.display_name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1 h-4 w-4 bg-warning rounded-full flex items-center justify-center">
                        <Star className="h-2.5 w-2.5 text-warning-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{trader.display_name}</span>
                      {isFollowing(trader.id) && (
                        <Badge variant="outline" className="text-[10px] text-primary">Following</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="text-success">{trader.win_rate}% win</span>
                      <span>•</span>
                      <span>{trader.total_trades} trades</span>
                      <span>•</span>
                      <span>{trader.followers_count} followers</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-mono font-bold",
                    trader.total_pnl >= 0 ? "text-success" : "text-destructive"
                  )}>
                    +${trader.total_pnl.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Total P&L</p>
                </div>
              </div>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-primary/30 to-purple-500/30">
                      {trader.display_name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span>{trader.display_name}</span>
                    <p className="text-xs text-muted-foreground font-normal">{trader.strategy_description}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-lg font-bold text-success">+${trader.total_pnl.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total P&L</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-lg font-bold">{trader.win_rate}%</p>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-lg font-bold">{trader.total_trades}</p>
                    <p className="text-xs text-muted-foreground">Trades</p>
                  </div>
                </div>

                {!isFollowing(trader.id) && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Allocation</span>
                        <span className="text-sm font-mono">{allocation}%</span>
                      </div>
                      <Slider
                        value={[allocation]}
                        onValueChange={([v]) => setAllocation(v)}
                        min={1}
                        max={50}
                        step={1}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Max Trade Size (SOL)</span>
                        <span className="text-sm font-mono">{maxTradeSize}</span>
                      </div>
                      <Slider
                        value={[maxTradeSize]}
                        onValueChange={([v]) => setMaxTradeSize(v)}
                        min={0.1}
                        max={5}
                        step={0.1}
                      />
                    </div>

                    <Button 
                      onClick={() => followTrader(trader)} 
                      disabled={isLoading}
                      className="w-full gap-2"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                      Copy {trader.display_name}
                    </Button>
                  </>
                )}
                
                {isFollowing(trader.id) && (
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      const relation = copyRelations.find(r => r.trader_id === trader.id);
                      if (relation) unfollowTrader(relation.id);
                    }}
                    className="w-full"
                  >
                    Unfollow Trader
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </Card>
  );
};

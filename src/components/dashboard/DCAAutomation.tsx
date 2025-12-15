import { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Play, Pause, TrendingUp, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DCAStrategy {
  id: string;
  token_symbol: string;
  amount_per_interval: number;
  interval_type: string;
  is_active: boolean;
  total_invested: number;
  total_tokens_bought: number;
  next_execution: string | null;
}

const SUPPORTED_TOKENS = ['SOL', 'BONK', 'WIF', 'PEPE', 'POPCAT', 'MEW', 'BOME', 'JUP'];
const INTERVALS = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export const DCAAutomation = () => {
  const { user } = useAuth();
  const { connected } = usePhantomWallet();
  const [strategies, setStrategies] = useState<DCAStrategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const [newStrategy, setNewStrategy] = useState({
    token_symbol: 'SOL',
    amount_per_interval: 0.1,
    interval_type: 'daily',
  });

  useEffect(() => {
    if (user) fetchStrategies();
  }, [user]);

  const fetchStrategies = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('dca_strategies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching DCA strategies:', error);
    } else {
      setStrategies(data || []);
    }
    setIsLoading(false);
  };

  const createStrategy = async () => {
    if (!user || !connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsCreating(true);
    const nextExecution = calculateNextExecution(newStrategy.interval_type);
    
    const { error } = await supabase.from('dca_strategies').insert({
      user_id: user.id,
      token_symbol: newStrategy.token_symbol,
      amount_per_interval: newStrategy.amount_per_interval,
      interval_type: newStrategy.interval_type,
      next_execution: nextExecution,
    });

    if (error) {
      toast.error('Failed to create DCA strategy');
    } else {
      toast.success(`DCA strategy created for ${newStrategy.token_symbol}`);
      setShowCreateDialog(false);
      fetchStrategies();
    }
    setIsCreating(false);
  };

  const toggleStrategy = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('dca_strategies')
      .update({ is_active: !isActive })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update strategy');
    } else {
      setStrategies(prev => 
        prev.map(s => s.id === id ? { ...s, is_active: !isActive } : s)
      );
      toast.success(isActive ? 'DCA paused' : 'DCA resumed');
    }
  };

  const deleteStrategy = async (id: string) => {
    const { error } = await supabase
      .from('dca_strategies')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete strategy');
    } else {
      setStrategies(prev => prev.filter(s => s.id !== id));
      toast.success('DCA strategy deleted');
    }
  };

  const calculateNextExecution = (intervalType: string): string => {
    const now = new Date();
    switch (intervalType) {
      case 'hourly': now.setHours(now.getHours() + 1); break;
      case 'daily': now.setDate(now.getDate() + 1); break;
      case 'weekly': now.setDate(now.getDate() + 7); break;
      case 'monthly': now.setMonth(now.getMonth() + 1); break;
    }
    return now.toISOString();
  };

  const formatNextExecution = (date: string | null) => {
    if (!date) return 'Not scheduled';
    const d = new Date(date);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `in ${days}d ${hours % 24}h`;
    if (hours > 0) return `in ${hours}h`;
    return 'Soon';
  };

  if (!connected) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">DCA Automation</h3>
            <p className="text-xs text-muted-foreground">Connect wallet to set up recurring buys</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 glow-primary">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">DCA Automation</h3>
            <p className="text-xs text-muted-foreground">{strategies.length} active strategies</p>
          </div>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              New DCA
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create DCA Strategy</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Token</Label>
                <Select 
                  value={newStrategy.token_symbol} 
                  onValueChange={(v) => setNewStrategy(p => ({ ...p, token_symbol: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_TOKENS.map(token => (
                      <SelectItem key={token} value={token}>{token}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Amount (SOL)</Label>
                <Input
                  type="number"
                  value={newStrategy.amount_per_interval}
                  onChange={(e) => setNewStrategy(p => ({ ...p, amount_per_interval: parseFloat(e.target.value) || 0 }))}
                  min="0.01"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select 
                  value={newStrategy.interval_type} 
                  onValueChange={(v) => setNewStrategy(p => ({ ...p, interval_type: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERVALS.map(i => (
                      <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={createStrategy} disabled={isCreating} className="w-full">
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Strategy
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : strategies.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No DCA strategies yet</p>
          <p className="text-xs mt-1">Create one to automate your investing</p>
        </div>
      ) : (
        <div className="space-y-3">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-all",
                strategy.is_active ? "border-primary/30 bg-primary/5" : "border-border bg-secondary/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold",
                  strategy.is_active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {strategy.token_symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{strategy.token_symbol}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {strategy.interval_type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{strategy.amount_per_interval} SOL</span>
                    <span>•</span>
                    <span>Next: {formatNextExecution(strategy.next_execution)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right mr-2">
                  <p className="text-xs text-muted-foreground">Invested</p>
                  <p className="text-sm font-mono">{strategy.total_invested} SOL</p>
                </div>
                <Switch
                  checked={strategy.is_active}
                  onCheckedChange={() => toggleStrategy(strategy.id, strategy.is_active)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteStrategy(strategy.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

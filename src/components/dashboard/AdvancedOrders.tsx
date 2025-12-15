import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Zap, TrendingUp, TrendingDown, Link2, Plus, X, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface TrailingStopOrder {
  id: string;
  token: string;
  type: 'sell';
  trailPercent: number;
  triggerPrice: number;
  currentPrice: number;
  highestPrice: number;
  amount: number;
  status: 'active' | 'triggered' | 'cancelled';
  createdAt: Date;
}

interface OCOOrder {
  id: string;
  token: string;
  takeProfitPrice: number;
  stopLossPrice: number;
  amount: number;
  currentPrice: number;
  status: 'active' | 'tp_triggered' | 'sl_triggered' | 'cancelled';
  createdAt: Date;
}

const TOKENS = ['SOL', 'BONK', 'WIF', 'JTO', 'PYTH', 'RAY'];

export const AdvancedOrders = () => {
  const [trailingOrders, setTrailingOrders] = useState<TrailingStopOrder[]>([
    {
      id: '1',
      token: 'SOL',
      type: 'sell',
      trailPercent: 5,
      triggerPrice: 95.0,
      currentPrice: 100.0,
      highestPrice: 105.0,
      amount: 5,
      status: 'active',
      createdAt: new Date(Date.now() - 3600000)
    }
  ]);

  const [ocoOrders, setOcoOrders] = useState<OCOOrder[]>([
    {
      id: '1',
      token: 'BONK',
      takeProfitPrice: 0.00003,
      stopLossPrice: 0.00002,
      amount: 500000,
      currentPrice: 0.000025,
      status: 'active',
      createdAt: new Date(Date.now() - 7200000)
    }
  ]);

  const [newTrailing, setNewTrailing] = useState({
    token: 'SOL',
    trailPercent: '5',
    amount: ''
  });

  const [newOco, setNewOco] = useState({
    token: 'SOL',
    takeProfitPrice: '',
    stopLossPrice: '',
    amount: ''
  });

  const [showTrailingForm, setShowTrailingForm] = useState(false);
  const [showOcoForm, setShowOcoForm] = useState(false);

  const createTrailingStop = () => {
    if (!newTrailing.amount || !newTrailing.trailPercent) {
      toast.error('Please fill all fields');
      return;
    }

    const currentPrice = 100; // Mock price
    const order: TrailingStopOrder = {
      id: Date.now().toString(),
      token: newTrailing.token,
      type: 'sell',
      trailPercent: parseFloat(newTrailing.trailPercent),
      triggerPrice: currentPrice * (1 - parseFloat(newTrailing.trailPercent) / 100),
      currentPrice,
      highestPrice: currentPrice,
      amount: parseFloat(newTrailing.amount),
      status: 'active',
      createdAt: new Date()
    };

    setTrailingOrders(prev => [order, ...prev]);
    setNewTrailing({ token: 'SOL', trailPercent: '5', amount: '' });
    setShowTrailingForm(false);
    toast.success(`Trailing stop created for ${newTrailing.token}`);
  };

  const createOcoOrder = () => {
    if (!newOco.takeProfitPrice || !newOco.stopLossPrice || !newOco.amount) {
      toast.error('Please fill all fields');
      return;
    }

    const order: OCOOrder = {
      id: Date.now().toString(),
      token: newOco.token,
      takeProfitPrice: parseFloat(newOco.takeProfitPrice),
      stopLossPrice: parseFloat(newOco.stopLossPrice),
      amount: parseFloat(newOco.amount),
      currentPrice: 100, // Mock
      status: 'active',
      createdAt: new Date()
    };

    setOcoOrders(prev => [order, ...prev]);
    setNewOco({ token: 'SOL', takeProfitPrice: '', stopLossPrice: '', amount: '' });
    setShowOcoForm(false);
    toast.success(`OCO order created for ${newOco.token}`);
  };

  const cancelOrder = (type: 'trailing' | 'oco', id: string) => {
    if (type === 'trailing') {
      setTrailingOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' as const } : o));
    } else {
      setOcoOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' as const } : o));
    }
    toast.success('Order cancelled');
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Advanced Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trailing" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="trailing" className="text-xs">
              <Activity className="w-3 h-3 mr-1" />
              Trailing Stops
            </TabsTrigger>
            <TabsTrigger value="oco" className="text-xs">
              <Link2 className="w-3 h-3 mr-1" />
              OCO Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trailing" className="mt-3 space-y-3">
            <Button 
              size="sm" 
              onClick={() => setShowTrailingForm(!showTrailingForm)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Trailing Stop
            </Button>

            {showTrailingForm && (
              <div className="p-3 bg-muted/30 rounded-lg border border-border space-y-3">
                <Select value={newTrailing.token} onValueChange={(v) => setNewTrailing(p => ({ ...p, token: v }))}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Token" />
                  </SelectTrigger>
                  <SelectContent>
                    {TOKENS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Trail %"
                    value={newTrailing.trailPercent}
                    onChange={(e) => setNewTrailing(p => ({ ...p, trailPercent: e.target.value }))}
                    className="h-9"
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={newTrailing.amount}
                    onChange={(e) => setNewTrailing(p => ({ ...p, amount: e.target.value }))}
                    className="h-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowTrailingForm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button size="sm" onClick={createTrailingStop} className="flex-1">
                    Create
                  </Button>
                </div>
              </div>
            )}

            <ScrollArea className="h-[180px]">
              <div className="space-y-2">
                {trailingOrders.filter(o => o.status === 'active').map(order => (
                  <div key={order.id} className="p-3 bg-muted/20 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-orange-400" />
                        <span className="font-medium text-foreground">{order.token}</span>
                        <Badge variant="secondary" className="text-xs">
                          -{order.trailPercent}%
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => cancelOrder('trailing', order.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Trigger:</span>
                        <span className="ml-1 text-foreground">${order.triggerPrice.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">High:</span>
                        <span className="ml-1 text-green-400">${order.highestPrice.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="ml-1 text-foreground">{order.amount}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {trailingOrders.filter(o => o.status === 'active').length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">No active trailing stops</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="oco" className="mt-3 space-y-3">
            <Button 
              size="sm" 
              onClick={() => setShowOcoForm(!showOcoForm)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-1" />
              New OCO Order
            </Button>

            {showOcoForm && (
              <div className="p-3 bg-muted/30 rounded-lg border border-border space-y-3">
                <Select value={newOco.token} onValueChange={(v) => setNewOco(p => ({ ...p, token: v }))}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Token" />
                  </SelectTrigger>
                  <SelectContent>
                    {TOKENS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Take Profit $"
                    value={newOco.takeProfitPrice}
                    onChange={(e) => setNewOco(p => ({ ...p, takeProfitPrice: e.target.value }))}
                    className="h-9"
                  />
                  <Input
                    type="number"
                    placeholder="Stop Loss $"
                    value={newOco.stopLossPrice}
                    onChange={(e) => setNewOco(p => ({ ...p, stopLossPrice: e.target.value }))}
                    className="h-9"
                  />
                </div>
                <Input
                  type="number"
                  placeholder="Amount"
                  value={newOco.amount}
                  onChange={(e) => setNewOco(p => ({ ...p, amount: e.target.value }))}
                  className="h-9"
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowOcoForm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button size="sm" onClick={createOcoOrder} className="flex-1">
                    Create
                  </Button>
                </div>
              </div>
            )}

            <ScrollArea className="h-[180px]">
              <div className="space-y-2">
                {ocoOrders.filter(o => o.status === 'active').map(order => (
                  <div key={order.id} className="p-3 bg-muted/20 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-blue-400" />
                        <span className="font-medium text-foreground">{order.token}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => cancelOrder('oco', order.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        <span className="text-muted-foreground">TP:</span>
                        <span className="text-green-400">${order.takeProfitPrice}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-red-400" />
                        <span className="text-muted-foreground">SL:</span>
                        <span className="text-red-400">${order.stopLossPrice}</span>
                      </div>
                    </div>
                    <div className="text-xs mt-2 text-muted-foreground">
                      Amount: {order.amount} | Current: ${order.currentPrice}
                    </div>
                  </div>
                ))}
                {ocoOrders.filter(o => o.status === 'active').length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">No active OCO orders</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

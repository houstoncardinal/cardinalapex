import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClipboardList, Plus, X, Clock, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface LimitOrder {
  id: string;
  token: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
  dex: string;
  status: 'pending' | 'partial' | 'filled' | 'cancelled';
  createdAt: Date;
  expiresAt?: Date;
  filledAmount: number;
}

const SUPPORTED_DEXS = ['Jupiter', 'Raydium', 'Orca', 'Serum'];
const SUPPORTED_TOKENS = ['SOL', 'USDC', 'BONK', 'WIF', 'JTO', 'PYTH', 'RAY', 'ORCA'];

export const LimitOrderManager = () => {
  const [orders, setOrders] = useState<LimitOrder[]>([
    {
      id: '1',
      token: 'SOL',
      type: 'buy',
      price: 95.50,
      amount: 10,
      total: 955,
      dex: 'Jupiter',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000),
      filledAmount: 0
    },
    {
      id: '2',
      token: 'BONK',
      type: 'sell',
      price: 0.000025,
      amount: 1000000,
      total: 25,
      dex: 'Raydium',
      status: 'partial',
      createdAt: new Date(Date.now() - 7200000),
      filledAmount: 400000
    }
  ]);

  const [newOrder, setNewOrder] = useState({
    token: 'SOL',
    type: 'buy' as 'buy' | 'sell',
    price: '',
    amount: '',
    dex: 'Jupiter'
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleCreateOrder = () => {
    if (!newOrder.price || !newOrder.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    const price = parseFloat(newOrder.price);
    const amount = parseFloat(newOrder.amount);

    const order: LimitOrder = {
      id: Date.now().toString(),
      token: newOrder.token,
      type: newOrder.type,
      price,
      amount,
      total: price * amount,
      dex: newOrder.dex,
      status: 'pending',
      createdAt: new Date(),
      filledAmount: 0
    };

    setOrders(prev => [order, ...prev]);
    setNewOrder({ token: 'SOL', type: 'buy', price: '', amount: '', dex: 'Jupiter' });
    setIsCreating(false);
    toast.success(`Limit ${newOrder.type} order created for ${amount} ${newOrder.token}`);
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'cancelled' as const } : o
    ));
    toast.success('Order cancelled');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'partial': return 'default';
      case 'filled': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'partial');
  const completedOrders = orders.filter(o => o.status === 'filled' || o.status === 'cancelled');

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            Limit Orders
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              onClick={() => setIsCreating(!isCreating)}
              className="h-8"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Order
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create Order Form */}
        {isCreating && (
          <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Select 
                value={newOrder.token} 
                onValueChange={(v) => setNewOrder(prev => ({ ...prev, token: v }))}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_TOKENS.map(token => (
                    <SelectItem key={token} value={token}>{token}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={newOrder.type} 
                onValueChange={(v) => setNewOrder(prev => ({ ...prev, type: v as 'buy' | 'sell' }))}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Price"
                value={newOrder.price}
                onChange={(e) => setNewOrder(prev => ({ ...prev, price: e.target.value }))}
                className="h-9"
              />
              <Input
                type="number"
                placeholder="Amount"
                value={newOrder.amount}
                onChange={(e) => setNewOrder(prev => ({ ...prev, amount: e.target.value }))}
                className="h-9"
              />
            </div>

            <Select 
              value={newOrder.dex} 
              onValueChange={(v) => setNewOrder(prev => ({ ...prev, dex: v }))}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="DEX" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_DEXS.map(dex => (
                  <SelectItem key={dex} value={dex}>{dex}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {newOrder.price && newOrder.amount && (
              <div className="text-sm text-muted-foreground">
                Total: ${(parseFloat(newOrder.price) * parseFloat(newOrder.amount)).toFixed(2)} USDC
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsCreating(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleCreateOrder}
                className={`flex-1 ${newOrder.type === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                Create {newOrder.type} Order
              </Button>
            </div>
          </div>
        )}

        {/* Orders Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending" className="text-xs">
              Pending ({pendingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs">
              History ({completedOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-3">
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {pendingOrders.length > 0 ? (
                  pendingOrders.map(order => (
                    <div key={order.id} className="p-3 bg-muted/20 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {order.type === 'buy' ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                          <span className="font-medium text-foreground">
                            {order.type.toUpperCase()} {order.token}
                          </span>
                          <Badge variant={getStatusColor(order.status)} className="text-xs">
                            {order.status}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelOrder(order.id)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Price:</span>
                          <span className="ml-1 text-foreground">${order.price}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="ml-1 text-foreground">{order.amount}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">DEX:</span>
                          <span className="ml-1 text-foreground">{order.dex}</span>
                        </div>
                      </div>
                      {order.status === 'partial' && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Filled</span>
                            <span>{((order.filledAmount / order.amount) * 100).toFixed(0)}%</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(order.filledAmount / order.amount) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {order.createdAt.toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No pending orders
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="history" className="mt-3">
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {completedOrders.length > 0 ? (
                  completedOrders.map(order => (
                    <div key={order.id} className="p-3 bg-muted/20 rounded-lg border border-border opacity-70">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {order.type === 'buy' ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                          <span className="font-medium text-foreground">
                            {order.type.toUpperCase()} {order.token}
                          </span>
                          <Badge variant={getStatusColor(order.status)} className="text-xs">
                            {order.status}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No order history
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

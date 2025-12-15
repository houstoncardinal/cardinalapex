import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, TrendingUp, TrendingDown, Settings2, Bell, Percent } from 'lucide-react';
import { toast } from 'sonner';
import { useWalletPortfolio } from '@/hooks/useWalletPortfolio';

interface Position {
  id: string;
  token: string;
  entryPrice: number;
  currentPrice: number;
  amount: number;
  stopLoss: number | null;
  takeProfit: number | null;
  isEnabled: boolean;
  pnlPercent: number;
}

export const StopLossTakeProfit = () => {
  const { tokens } = useWalletPortfolio();
  const [positions, setPositions] = useState<Position[]>([
    {
      id: '1',
      token: 'SOL',
      entryPrice: 95.0,
      currentPrice: 100.0,
      amount: 10,
      stopLoss: 85.0,
      takeProfit: 120.0,
      isEnabled: true,
      pnlPercent: 5.26
    },
    {
      id: '2',
      token: 'BONK',
      entryPrice: 0.000022,
      currentPrice: 0.000025,
      amount: 1000000,
      stopLoss: null,
      takeProfit: null,
      isEnabled: false,
      pnlPercent: 13.64
    },
    {
      id: '3',
      token: 'WIF',
      entryPrice: 2.50,
      currentPrice: 2.35,
      amount: 50,
      stopLoss: 2.0,
      takeProfit: 3.5,
      isEnabled: true,
      pnlPercent: -6.0
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ stopLoss: '', takeProfit: '' });
  const [globalDefaults, setGlobalDefaults] = useState({ stopLossPercent: 10, takeProfitPercent: 25 });

  const togglePosition = (id: string) => {
    setPositions(prev => prev.map(p => {
      if (p.id === id) {
        const newEnabled = !p.isEnabled;
        if (newEnabled && (!p.stopLoss || !p.takeProfit)) {
          // Apply defaults
          return {
            ...p,
            isEnabled: newEnabled,
            stopLoss: p.stopLoss || p.entryPrice * (1 - globalDefaults.stopLossPercent / 100),
            takeProfit: p.takeProfit || p.entryPrice * (1 + globalDefaults.takeProfitPercent / 100)
          };
        }
        return { ...p, isEnabled: newEnabled };
      }
      return p;
    }));
  };

  const startEditing = (position: Position) => {
    setEditingId(position.id);
    setEditValues({
      stopLoss: position.stopLoss?.toString() || '',
      takeProfit: position.takeProfit?.toString() || ''
    });
  };

  const saveEdit = (id: string) => {
    setPositions(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          stopLoss: editValues.stopLoss ? parseFloat(editValues.stopLoss) : null,
          takeProfit: editValues.takeProfit ? parseFloat(editValues.takeProfit) : null
        };
      }
      return p;
    }));
    setEditingId(null);
    toast.success('Stop-loss/Take-profit updated');
  };

  const applyToAll = () => {
    setPositions(prev => prev.map(p => ({
      ...p,
      stopLoss: p.entryPrice * (1 - globalDefaults.stopLossPercent / 100),
      takeProfit: p.entryPrice * (1 + globalDefaults.takeProfitPercent / 100),
      isEnabled: true
    })));
    toast.success('Applied defaults to all positions');
  };

  const activeCount = positions.filter(p => p.isEnabled).length;
  const atRiskCount = positions.filter(p => p.isEnabled && p.stopLoss && p.currentPrice <= p.stopLoss * 1.05).length;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Stop-Loss / Take-Profit
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {activeCount}/{positions.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Global Defaults */}
        <div className="p-3 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground flex items-center gap-1">
              <Settings2 className="w-4 h-4" />
              Default Settings
            </span>
            <Button size="sm" variant="outline" onClick={applyToAll} className="h-7 text-xs">
              Apply to All
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <TrendingDown className="w-3 h-3 text-red-400" />
                Stop Loss %
              </label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={globalDefaults.stopLossPercent}
                  onChange={(e) => setGlobalDefaults(p => ({ ...p, stopLossPercent: parseFloat(e.target.value) || 0 }))}
                  className="h-8"
                />
                <Percent className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                Take Profit %
              </label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={globalDefaults.takeProfitPercent}
                  onChange={(e) => setGlobalDefaults(p => ({ ...p, takeProfitPercent: parseFloat(e.target.value) || 0 }))}
                  className="h-8"
                />
                <Percent className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        {atRiskCount > 0 && (
          <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
            <Bell className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="text-xs text-red-400">
              {atRiskCount} position(s) approaching stop-loss
            </span>
          </div>
        )}

        {/* Positions List */}
        <ScrollArea className="h-[250px]">
          <div className="space-y-2">
            {positions.map(position => (
              <div 
                key={position.id} 
                className={`p-3 rounded-lg border transition-colors ${
                  position.isEnabled ? 'bg-muted/30 border-primary/30' : 'bg-muted/10 border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{position.token}</span>
                    <Badge 
                      variant={position.pnlPercent >= 0 ? 'default' : 'destructive'} 
                      className="text-xs"
                    >
                      {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editingId === position.id ? saveEdit(position.id) : startEditing(position)}
                      className="h-6 px-2 text-xs"
                    >
                      {editingId === position.id ? 'Save' : 'Edit'}
                    </Button>
                    <Switch
                      checked={position.isEnabled}
                      onCheckedChange={() => togglePosition(position.id)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                  <div>
                    <span className="text-muted-foreground">Entry:</span>
                    <span className="ml-1 text-foreground">${position.entryPrice}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Current:</span>
                    <span className="ml-1 text-foreground">${position.currentPrice}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="ml-1 text-foreground">{position.amount}</span>
                  </div>
                </div>

                {editingId === position.id ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Stop Loss</label>
                      <Input
                        type="number"
                        value={editValues.stopLoss}
                        onChange={(e) => setEditValues(p => ({ ...p, stopLoss: e.target.value }))}
                        className="h-8 mt-1"
                        placeholder="Price"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Take Profit</label>
                      <Input
                        type="number"
                        value={editValues.takeProfit}
                        onChange={(e) => setEditValues(p => ({ ...p, takeProfit: e.target.value }))}
                        className="h-8 mt-1"
                        placeholder="Price"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <TrendingDown className="w-3 h-3 text-red-400" />
                      <span className="text-muted-foreground">SL:</span>
                      <span className={position.stopLoss ? 'text-red-400' : 'text-muted-foreground'}>
                        {position.stopLoss ? `$${position.stopLoss}` : 'Not set'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-muted-foreground">TP:</span>
                      <span className={position.takeProfit ? 'text-green-400' : 'text-muted-foreground'}>
                        {position.takeProfit ? `$${position.takeProfit}` : 'Not set'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Fish, TrendingUp, TrendingDown, Eye, RefreshCw, AlertTriangle } from 'lucide-react';

interface WhaleTransaction {
  id: string;
  wallet: string;
  token: string;
  type: 'buy' | 'sell' | 'transfer';
  amount: number;
  usdValue: number;
  timestamp: Date;
  impact: 'high' | 'medium' | 'low';
}

interface TrackedWallet {
  address: string;
  label: string;
  totalValue: number;
  change24h: number;
  topHoldings: { token: string; percentage: number }[];
}

const MOCK_TRANSACTIONS: WhaleTransaction[] = [
  { id: '1', wallet: '7xKX...9mPq', token: 'SOL', type: 'buy', amount: 50000, usdValue: 7250000, timestamp: new Date(Date.now() - 300000), impact: 'high' },
  { id: '2', wallet: '3nRt...kLmN', token: 'BONK', type: 'sell', amount: 5000000000, usdValue: 125000, timestamp: new Date(Date.now() - 900000), impact: 'medium' },
  { id: '3', wallet: '9pQr...xYzA', token: 'JUP', type: 'buy', amount: 250000, usdValue: 187500, timestamp: new Date(Date.now() - 1800000), impact: 'medium' },
  { id: '4', wallet: '2aBc...dEfG', token: 'WIF', type: 'transfer', amount: 1000000, usdValue: 320000, timestamp: new Date(Date.now() - 3600000), impact: 'high' },
  { id: '5', wallet: '5hIj...kLmN', token: 'PEPE', type: 'buy', amount: 10000000000, usdValue: 95000, timestamp: new Date(Date.now() - 7200000), impact: 'low' },
];

const TRACKED_WALLETS: TrackedWallet[] = [
  { address: '7xKX...9mPq', label: 'Smart Money #1', totalValue: 45000000, change24h: 5.2, topHoldings: [{ token: 'SOL', percentage: 45 }, { token: 'JUP', percentage: 25 }, { token: 'BONK', percentage: 15 }] },
  { address: '3nRt...kLmN', label: 'Meme Whale', totalValue: 12000000, change24h: -2.8, topHoldings: [{ token: 'WIF', percentage: 35 }, { token: 'BONK', percentage: 30 }, { token: 'PEPE', percentage: 20 }] },
  { address: '9pQr...xYzA', label: 'DeFi Giant', totalValue: 78000000, change24h: 1.5, topHoldings: [{ token: 'SOL', percentage: 60 }, { token: 'RAY', percentage: 20 }, { token: 'ORCA', percentage: 10 }] },
];

export const WhaleTracking = () => {
  const [transactions, setTransactions] = useState<WhaleTransaction[]>(MOCK_TRANSACTIONS);
  const [trackedWallets] = useState<TrackedWallet[]>(TRACKED_WALLETS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newTx: WhaleTransaction = {
        id: Date.now().toString(),
        wallet: `${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
        token: ['SOL', 'BONK', 'WIF', 'JUP', 'PEPE'][Math.floor(Math.random() * 5)],
        type: ['buy', 'sell', 'transfer'][Math.floor(Math.random() * 3)] as 'buy' | 'sell' | 'transfer',
        amount: Math.floor(Math.random() * 1000000),
        usdValue: Math.floor(Math.random() * 500000) + 50000,
        timestamp: new Date(),
        impact: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
      };
      setTransactions(prev => [newTx, ...prev.slice(0, 9)]);
      setIsRefreshing(false);
    }, 1000);
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const formatUSD = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'medium': return 'bg-chart-4/20 text-chart-4 border-chart-4/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'buy': return <TrendingUp className="h-4 w-4 text-chart-2" />;
      case 'sell': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <Eye className="h-4 w-4 text-chart-4" />;
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Fish className="h-5 w-5 text-chart-1" />
            Whale Tracking
          </CardTitle>
          <CardDescription>Monitor large holder movements</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recent Whale Transactions */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-chart-4" />
            Recent Whale Transactions
          </h4>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(tx.type)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{tx.wallet}</span>
                        <Badge variant="outline" className={getImpactColor(tx.impact)}>
                          {tx.impact}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {tx.type.toUpperCase()} {tx.amount.toLocaleString()} {tx.token}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatUSD(tx.usdValue)}</p>
                    <p className="text-xs text-muted-foreground">{formatTimeAgo(tx.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Tracked Wallets */}
        <div>
          <h4 className="text-sm font-medium mb-3">Tracked Smart Money Wallets</h4>
          <div className="grid gap-3">
            {trackedWallets.map((wallet) => (
              <div key={wallet.address} className="p-4 rounded-lg bg-muted/30 border border-border/30">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">{wallet.label}</p>
                    <p className="text-xs font-mono text-muted-foreground">{wallet.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatUSD(wallet.totalValue)}</p>
                    <p className={`text-xs ${wallet.change24h >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
                      {wallet.change24h >= 0 ? '+' : ''}{wallet.change24h}% 24h
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {wallet.topHoldings.map((holding, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {holding.token} {holding.percentage}%
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

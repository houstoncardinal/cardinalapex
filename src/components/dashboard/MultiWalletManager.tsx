import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, Plus, Trash2, RefreshCw, Eye, EyeOff, Copy, ExternalLink, Check } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ManagedWallet {
  id: string;
  name: string;
  address: string;
  balance: number;
  tokens: { symbol: string; balance: number; value: number }[];
  isConnected: boolean;
  isPrimary: boolean;
}

export const MultiWalletManager = () => {
  const { toast } = useToast();
  const [wallets, setWallets] = useState<ManagedWallet[]>([
    {
      id: '1',
      name: 'Main Trading',
      address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      balance: 12.45,
      tokens: [
        { symbol: 'SOL', balance: 12.45, value: 1843.80 },
        { symbol: 'BONK', balance: 5000000, value: 120.00 },
        { symbol: 'WIF', balance: 25, value: 71.25 },
      ],
      isConnected: true,
      isPrimary: true,
    },
    {
      id: '2',
      name: 'DCA Wallet',
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      balance: 5.23,
      tokens: [
        { symbol: 'SOL', balance: 5.23, value: 774.04 },
        { symbol: 'JUP', balance: 150, value: 135.00 },
      ],
      isConnected: true,
      isPrimary: false,
    },
    {
      id: '3',
      name: 'Cold Storage',
      address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      balance: 50.00,
      tokens: [
        { symbol: 'SOL', balance: 50.00, value: 7400.00 },
      ],
      isConnected: false,
      isPrimary: false,
    },
  ]);

  const [showAddWallet, setShowAddWallet] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [newWalletName, setNewWalletName] = useState('');
  const [hiddenBalances, setHiddenBalances] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const totalBalance = wallets.reduce((sum, w) => sum + w.tokens.reduce((s, t) => s + t.value, 0), 0);

  const addWallet = () => {
    if (!newWalletAddress || newWalletAddress.length < 32) {
      toast({ title: 'Invalid address', description: 'Please enter a valid Solana wallet address', variant: 'destructive' });
      return;
    }
    
    const newWallet: ManagedWallet = {
      id: Date.now().toString(),
      name: newWalletName || `Wallet ${wallets.length + 1}`,
      address: newWalletAddress,
      balance: 0,
      tokens: [],
      isConnected: false,
      isPrimary: false,
    };
    
    setWallets(prev => [...prev, newWallet]);
    setNewWalletAddress('');
    setNewWalletName('');
    setShowAddWallet(false);
    toast({ title: 'Wallet added', description: 'Tracking wallet balance...' });
  };

  const removeWallet = (id: string) => {
    setWallets(prev => prev.filter(w => w.id !== id));
    toast({ title: 'Wallet removed' });
  };

  const setPrimary = (id: string) => {
    setWallets(prev => prev.map(w => ({ ...w, isPrimary: w.id === id })));
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const shortenAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Multi-Wallet Manager
            <Badge variant="outline">{wallets.length} wallets</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setHiddenBalances(!hiddenBalances)}>
              {hiddenBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button size="sm" onClick={() => setShowAddWallet(!showAddWallet)}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Portfolio Value */}
        <div className="p-4 bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg border border-primary/30">
          <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
          <p className="text-3xl font-bold text-foreground">
            {hiddenBalances ? '••••••' : `$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </p>
        </div>

        {/* Add Wallet Form */}
        {showAddWallet && (
          <div className="p-4 bg-background/50 rounded-lg border border-primary/30 space-y-3">
            <p className="text-sm font-medium text-foreground">Add Wallet to Track</p>
            <Input
              placeholder="Wallet name (optional)"
              value={newWalletName}
              onChange={(e) => setNewWalletName(e.target.value)}
            />
            <Input
              placeholder="Solana wallet address"
              value={newWalletAddress}
              onChange={(e) => setNewWalletAddress(e.target.value)}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={addWallet}>Add Wallet</Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddWallet(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Wallet List */}
        <div className="space-y-3 max-h-[350px] overflow-y-auto">
          {wallets.map((wallet) => (
            <div 
              key={wallet.id}
              className={`p-3 rounded-lg border transition-all ${
                wallet.isPrimary 
                  ? 'bg-primary/10 border-primary/30' 
                  : 'bg-background/50 border-border/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{wallet.name}</span>
                    {wallet.isPrimary && (
                      <Badge className="bg-primary/20 text-primary text-[10px]">PRIMARY</Badge>
                    )}
                    {wallet.isConnected && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">CONNECTED</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground font-mono">
                      {shortenAddress(wallet.address)}
                    </span>
                    <button onClick={() => copyAddress(wallet.address)} className="text-muted-foreground hover:text-foreground">
                      {copiedAddress === wallet.address ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                    <a 
                      href={`https://solscan.io/account/${wallet.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">
                    {hiddenBalances ? '••••' : `$${wallet.tokens.reduce((s, t) => s + t.value, 0).toLocaleString()}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {hiddenBalances ? '••••' : `${wallet.balance.toFixed(2)} SOL`}
                  </p>
                </div>
              </div>

              {/* Token Holdings */}
              {!hiddenBalances && wallet.tokens.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {wallet.tokens.map((token, i) => (
                    <Badge key={i} variant="outline" className="text-xs font-mono">
                      {token.symbol}: {token.balance < 1000 ? token.balance.toFixed(2) : `${(token.balance / 1000).toFixed(1)}K`}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                {!wallet.isPrimary && (
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setPrimary(wallet.id)}>
                    Set Primary
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="h-7 text-xs">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </Button>
                {!wallet.isPrimary && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-7 text-xs text-red-400 hover:text-red-300"
                    onClick={() => removeWallet(wallet.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

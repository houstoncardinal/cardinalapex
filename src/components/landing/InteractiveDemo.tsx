import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, TrendingDown, Bot, Zap, Target, 
  Play, Pause, RotateCcw, DollarSign, Activity,
  ArrowUpRight, ArrowDownRight, Sparkles
} from 'lucide-react';

const mockTokens = [
  { symbol: 'SOL', name: 'Solana', price: 142.50, change: 5.2 },
  { symbol: 'BONK', name: 'Bonk', price: 0.0000234, change: 12.8 },
  { symbol: 'WIF', name: 'dogwifhat', price: 2.45, change: -3.1 },
  { symbol: 'JUP', name: 'Jupiter', price: 0.89, change: 8.4 },
];

const patterns = ['Double Bottom', 'Bull Flag', 'Cup & Handle', 'Ascending Triangle'];

export const InteractiveDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [balance, setBalance] = useState(10000);
  const [trades, setTrades] = useState<Array<{
    id: number;
    token: string;
    action: string;
    amount: number;
    price: number;
    profit: number;
    pattern: string;
    confidence: number;
  }>>([]);
  const [currentPrice, setCurrentPrice] = useState(142.50);
  const [selectedToken, setSelectedToken] = useState(mockTokens[0]);
  const [aiThinking, setAiThinking] = useState(false);
  const [detectedPattern, setDetectedPattern] = useState<string | null>(null);
  const [priceHistory, setPriceHistory] = useState<number[]>([142.50]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Simulate price movement
      const change = (Math.random() - 0.45) * 2;
      setCurrentPrice(prev => {
        const newPrice = Math.max(130, Math.min(160, prev + change));
        setPriceHistory(history => [...history.slice(-20), newPrice]);
        return newPrice;
      });

      // Random AI analysis
      if (Math.random() > 0.7) {
        setAiThinking(true);
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        setDetectedPattern(pattern);

        setTimeout(() => {
          const confidence = 75 + Math.floor(Math.random() * 20);
          if (confidence >= 85) {
            const action = Math.random() > 0.4 ? 'BUY' : 'SELL';
            const amount = 50 + Math.floor(Math.random() * 150);
            const profit = action === 'BUY' 
              ? Math.floor(Math.random() * 50) + 10
              : Math.floor(Math.random() * 40) + 5;

            setTrades(prev => [{
              id: Date.now(),
              token: selectedToken.symbol,
              action,
              amount,
              price: currentPrice,
              profit,
              pattern,
              confidence
            }, ...prev].slice(0, 5));

            setBalance(prev => prev + profit);
          }
          setAiThinking(false);
        }, 1500);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, selectedToken, currentPrice]);

  const handleReset = () => {
    setIsRunning(false);
    setBalance(10000);
    setTrades([]);
    setCurrentPrice(142.50);
    setPriceHistory([142.50]);
    setDetectedPattern(null);
  };

  const profitPercent = ((balance - 10000) / 10000 * 100).toFixed(2);

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />
      
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 border-accent/50">
            <Sparkles className="w-3 h-3 mr-1" />
            Try It Now
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Interactive{' '}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Trading Demo
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience AI-powered trading in action. No signup required - see how our bots detect patterns and execute trades.
          </p>
        </motion.div>

        <Card className="glass border-accent/20 max-w-5xl mx-auto overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-gradient-to-r from-accent/10 to-primary/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Bot className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-xl">AI Trading Simulator</CardTitle>
                  <p className="text-sm text-muted-foreground">Live pattern detection & auto-execution</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={isRunning ? "destructive" : "default"}
                  onClick={() => setIsRunning(!isRunning)}
                  className="gap-2"
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isRunning ? 'Pause' : 'Start'} Demo
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Stats Panel */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-muted/30 text-center">
                    <DollarSign className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <div className="text-2xl font-bold">${balance.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Demo Balance</div>
                  </div>
                  <div className={`p-4 rounded-xl text-center ${Number(profitPercent) >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                    {Number(profitPercent) >= 0 ? (
                      <TrendingUp className="w-5 h-5 mx-auto mb-1 text-success" />
                    ) : (
                      <TrendingDown className="w-5 h-5 mx-auto mb-1 text-destructive" />
                    )}
                    <div className={`text-2xl font-bold ${Number(profitPercent) >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {Number(profitPercent) >= 0 ? '+' : ''}{profitPercent}%
                    </div>
                    <div className="text-xs text-muted-foreground">P&L</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Select Token</span>
                  </div>
                  <div className="space-y-2">
                    {mockTokens.map((token) => (
                      <button
                        key={token.symbol}
                        onClick={() => setSelectedToken(token)}
                        className={`w-full p-3 rounded-lg flex items-center justify-between transition-all ${
                          selectedToken.symbol === token.symbol
                            ? 'bg-primary/20 border border-primary/50'
                            : 'bg-background/50 hover:bg-background/80'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{token.symbol}</span>
                          <span className="text-xs text-muted-foreground">{token.name}</span>
                        </div>
                        <span className={token.change >= 0 ? 'text-success text-sm' : 'text-destructive text-sm'}>
                          {token.change >= 0 ? '+' : ''}{token.change}%
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart Area */}
              <div className="md:col-span-2 space-y-4">
                <div className="p-4 rounded-xl bg-muted/30 relative min-h-[200px]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold">{selectedToken.symbol}</span>
                      <span className="text-muted-foreground ml-2">/USDC</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${currentPrice.toFixed(2)}</div>
                      <div className={`text-sm flex items-center justify-end gap-1 ${
                        currentPrice > priceHistory[0] ? 'text-success' : 'text-destructive'
                      }`}>
                        {currentPrice > priceHistory[0] ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        {((currentPrice - priceHistory[0]) / priceHistory[0] * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="h-24 flex items-end gap-1">
                    {priceHistory.map((price, idx) => {
                      const min = Math.min(...priceHistory);
                      const max = Math.max(...priceHistory);
                      const height = ((price - min) / (max - min || 1)) * 100;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max(10, height)}%` }}
                          className={`flex-1 rounded-t ${
                            idx === priceHistory.length - 1
                              ? 'bg-primary'
                              : price > priceHistory[Math.max(0, idx - 1)]
                              ? 'bg-success/50'
                              : 'bg-destructive/50'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* AI Overlay */}
                  <AnimatePresence>
                    {aiThinking && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl flex items-center justify-center"
                      >
                        <div className="text-center">
                          <Activity className="w-8 h-8 mx-auto mb-2 text-primary animate-pulse" />
                          <p className="font-medium">AI Analyzing...</p>
                          {detectedPattern && (
                            <Badge className="mt-2 bg-primary/20 text-primary">
                              <Target className="w-3 h-3 mr-1" />
                              {detectedPattern} Detected
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Trade Feed */}
                <div className="p-4 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-accent" />
                    <span className="font-medium">Live Trade Feed</span>
                    {isRunning && (
                      <span className="flex items-center gap-1 text-xs text-success">
                        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        Active
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {trades.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Start the demo to see AI trades</p>
                      </div>
                    ) : (
                      trades.map((trade) => (
                        <motion.div
                          key={trade.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-background/50 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant={trade.action === 'BUY' ? 'default' : 'secondary'}>
                              {trade.action}
                            </Badge>
                            <div>
                              <span className="font-medium">{trade.token}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ${trade.amount} @ ${trade.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-success font-medium">+${trade.profit}</div>
                            <div className="text-xs text-muted-foreground">
                              {trade.pattern} ({trade.confidence}%)
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Ready to trade with real money?</p>
                  <p className="text-sm text-muted-foreground">Connect your wallet and start earning today</p>
                </div>
              </div>
              <Button className="gap-2" size="lg">
                Get Started Free
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

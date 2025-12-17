import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, TrendingUp, TrendingDown, Zap, Target, Brain, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Trade {
  id: number;
  token: string;
  action: "BUY" | "SELL";
  price: number;
  confidence: number;
  pattern: string;
  profit?: number;
}

const patterns = [
  "Head & Shoulders",
  "Double Bottom",
  "Bull Flag",
  "Cup & Handle",
  "Ascending Triangle",
  "MACD Crossover",
];

const tokens = ["SOL", "BONK", "WIF", "JUP", "PYTH", "RAY"];

export const TradingSimulator = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [balance, setBalance] = useState(10000);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [currentPrice, setCurrentPrice] = useState(142.50);
  const [aiThinking, setAiThinking] = useState(false);
  const [detectedPattern, setDetectedPattern] = useState<string | null>(null);
  const [tradeCount, setTradeCount] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const priceInterval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.48) * 2;
        return Math.max(100, Math.min(200, prev + change));
      });
    }, 500);

    const aiInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        setAiThinking(true);
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        setDetectedPattern(pattern);

        setTimeout(() => {
          const confidence = 85 + Math.floor(Math.random() * 12);
          const token = tokens[Math.floor(Math.random() * tokens.length)];
          const action = Math.random() > 0.5 ? "BUY" : "SELL";
          const profit = action === "SELL" ? Math.floor(Math.random() * 500) + 50 : undefined;
          
          const newTrade: Trade = {
            id: Date.now(),
            token,
            action,
            price: currentPrice,
            confidence,
            pattern,
            profit,
          };

          setTrades(prev => [newTrade, ...prev].slice(0, 5));
          setTradeCount(prev => prev + 1);
          
          if (profit) {
            setBalance(prev => prev + profit);
          }
          
          setAiThinking(false);
          setDetectedPattern(null);
        }, 1500);
      }
    }, 3000);

    return () => {
      clearInterval(priceInterval);
      clearInterval(aiInterval);
    };
  }, [isRunning, currentPrice]);

  const handleReset = () => {
    setIsRunning(false);
    setBalance(10000);
    setTrades([]);
    setCurrentPrice(142.50);
    setTradeCount(0);
  };

  const profitLoss = balance - 10000;
  const profitPercent = ((profitLoss / 10000) * 100).toFixed(2);

  return (
    <section id="simulator" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Live Demo</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Watch AI Trade{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
              In Real-Time
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See our AI detect patterns and execute trades. No signup required.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Chart Area */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">SOL/USD</span>
                    <span className={`text-xl font-mono ${currentPrice > 142.50 ? "text-success" : "text-destructive"}`}>
                      ${currentPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsRunning(!isRunning)}
                    >
                      {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isRunning ? "Pause" : "Start"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Simulated Chart */}
                <div className="relative h-48 bg-background/50 rounded-lg overflow-hidden mb-4">
                  <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M0,100 Q50,80 100,90 T200,70 T300,85 T400,60"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: isRunning ? 1 : 0.5 }}
                      transition={{ duration: 2 }}
                    />
                    <motion.path
                      d="M0,100 Q50,80 100,90 T200,70 T300,85 T400,60 V150 H0 Z"
                      fill="url(#chartGradient)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isRunning ? 1 : 0.3 }}
                    />
                  </svg>

                  {/* AI Detection Overlay */}
                  <AnimatePresence>
                    {aiThinking && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm"
                      >
                        <div className="text-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Brain className="w-8 h-8 text-primary mx-auto mb-2" />
                          </motion.div>
                          <p className="text-sm font-medium">AI Analyzing...</p>
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

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-background/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Balance</p>
                    <p className="text-lg font-bold">${balance.toLocaleString()}</p>
                  </div>
                  <div className="bg-background/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">P&L</p>
                    <p className={`text-lg font-bold ${profitLoss >= 0 ? "text-success" : "text-destructive"}`}>
                      {profitLoss >= 0 ? "+" : ""}{profitPercent}%
                    </p>
                  </div>
                  <div className="bg-background/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Trades</p>
                    <p className="text-lg font-bold">{tradeCount}</p>
                  </div>
                </div>
              </div>

              {/* Trade Feed */}
              <div className="lg:w-72">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Live Trade Feed
                </h4>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {trades.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        Press Start to begin simulation
                      </div>
                    ) : (
                      trades.map((trade) => (
                        <motion.div
                          key={trade.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="bg-background/30 rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              {trade.action === "BUY" ? (
                                <TrendingUp className="w-4 h-4 text-success" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-accent" />
                              )}
                              <span className="font-medium">{trade.token}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {trade.confidence}%
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{trade.pattern}</span>
                            {trade.profit && (
                              <span className="text-success font-medium">+${trade.profit}</span>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

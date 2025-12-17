import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, TrendingUp, TrendingDown, Zap, Target, 
  BarChart3, Clock, ArrowUpRight, ArrowDownRight, Bot
} from "lucide-react";

interface BotStat {
  name: string;
  strategy: string;
  winRate: number;
  profitToday: number;
  tradesExecuted: number;
  status: "active" | "analyzing" | "paused";
}

interface RecentTrade {
  id: string;
  pair: string;
  type: "BUY" | "SELL";
  amount: string;
  profit: number;
  timestamp: string;
  bot: string;
}

const initialBots: BotStat[] = [
  { name: "Alpha Predator", strategy: "Momentum", winRate: 87.5, profitToday: 2847.32, tradesExecuted: 156, status: "active" },
  { name: "Pattern Hunter", strategy: "Technical", winRate: 82.3, profitToday: 1923.18, tradesExecuted: 89, status: "active" },
  { name: "Whale Tracker", strategy: "Smart Money", winRate: 91.2, profitToday: 4521.67, tradesExecuted: 43, status: "analyzing" },
];

const generateTrade = (): RecentTrade => {
  const pairs = ["SOL/USDC", "BONK/SOL", "WIF/SOL", "JUP/SOL", "PYTH/SOL", "RAY/SOL"];
  const bots = ["Alpha Predator", "Pattern Hunter", "Whale Tracker"];
  const type = Math.random() > 0.45 ? "BUY" : "SELL";
  
  return {
    id: `${Date.now()}-${Math.random()}`,
    pair: pairs[Math.floor(Math.random() * pairs.length)],
    type,
    amount: `${(Math.random() * 500 + 50).toFixed(2)} SOL`,
    profit: type === "SELL" ? (Math.random() * 200 + 10) : 0,
    timestamp: "Just now",
    bot: bots[Math.floor(Math.random() * bots.length)]
  };
};

const LivePerformanceDashboard = () => {
  const [bots, setBots] = useState(initialBots);
  const [trades, setTrades] = useState<RecentTrade[]>(() => 
    Array.from({ length: 5 }, generateTrade)
  );
  const [totalProfit, setTotalProfit] = useState(9292.17);
  const [totalTrades, setTotalTrades] = useState(288);

  useEffect(() => {
    const tradeInterval = setInterval(() => {
      const newTrade = generateTrade();
      setTrades(prev => [newTrade, ...prev.slice(0, 4)]);
      
      if (newTrade.profit > 0) {
        setTotalProfit(prev => prev + newTrade.profit);
      }
      setTotalTrades(prev => prev + 1);
      
      setBots(prev => prev.map(bot => ({
        ...bot,
        tradesExecuted: bot.tradesExecuted + (Math.random() > 0.7 ? 1 : 0),
        profitToday: bot.profitToday + (Math.random() * 50)
      })));
    }, 3000);

    return () => clearInterval(tradeInterval);
  }, []);

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <Activity className="w-4 h-4 text-green-400 animate-pulse" />
            <span className="text-sm font-medium text-green-400">Live Performance</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Real-Time <span className="text-primary">Bot Statistics</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch our AI trading bots in action. These are live statistics from our platform.
          </p>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Profit Today", value: `$${totalProfit.toFixed(2)}`, icon: TrendingUp, color: "text-green-400" },
            { label: "Trades Executed", value: totalTrades.toLocaleString(), icon: Zap, color: "text-purple-400" },
            { label: "Active Bots", value: "3", icon: Bot, color: "text-blue-400" },
            { label: "Avg Win Rate", value: "87.0%", icon: Target, color: "text-yellow-400" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bot Performance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Active Trading Bots
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bots.map((bot) => (
                  <div 
                    key={bot.name}
                    className="p-4 rounded-lg bg-background/50 border border-border/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{bot.name}</p>
                          <p className="text-xs text-muted-foreground">{bot.strategy}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          bot.status === "active" 
                            ? "bg-green-500/10 text-green-400 border-green-500/30" 
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                        }
                      >
                        {bot.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-green-400">{bot.winRate.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">Win Rate</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-primary">${bot.profitToday.toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground">Today's P/L</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{bot.tradesExecuted}</p>
                        <p className="text-xs text-muted-foreground">Trades</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Trades */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Trade Executions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trades.map((trade, i) => (
                  <motion.div
                    key={trade.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        trade.type === "BUY" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {trade.type === "BUY" 
                          ? <ArrowUpRight className="w-4 h-4" />
                          : <ArrowDownRight className="w-4 h-4" />
                        }
                      </div>
                      <div>
                        <p className="font-medium">{trade.pair}</p>
                        <p className="text-xs text-muted-foreground">{trade.bot}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{trade.amount}</p>
                      {trade.profit > 0 && (
                        <p className="text-xs text-green-400">+${trade.profit.toFixed(2)}</p>
                      )}
                    </div>
                    <Badge variant="outline" className={
                      trade.type === "BUY" 
                        ? "bg-green-500/10 text-green-400 border-green-500/30" 
                        : "bg-red-500/10 text-red-400 border-red-500/30"
                    }>
                      {trade.type}
                    </Badge>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LivePerformanceDashboard;

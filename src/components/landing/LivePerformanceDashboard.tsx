import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, TrendingUp, Zap, Target, 
  BarChart3, Clock, Bot, Sparkles
} from "lucide-react";

interface BotInfo {
  name: string;
  strategy: string;
  description: string;
  status: "ready" | "demo" | "coming-soon";
}

const bots: BotInfo[] = [
  { name: "Alpha Predator", strategy: "Momentum", description: "Aggressive trend-following with order flow analysis", status: "ready" },
  { name: "Pattern Hunter", strategy: "Technical", description: "Ichimoku Cloud + Elliott Wave detection", status: "ready" },
  { name: "Whale Tracker", strategy: "Smart Money", description: "On-chain whale wallet monitoring", status: "demo" },
];

const platformFeatures = [
  { label: "Trading Algorithms", value: "6+", icon: Bot, color: "text-purple-400" },
  { label: "Supported Tokens", value: "500+", icon: Target, color: "text-blue-400" },
  { label: "Platform Uptime", value: "99.9%", icon: Activity, color: "text-green-400" },
  { label: "Avg Response Time", value: "<1s", icon: Zap, color: "text-yellow-400" },
];

const LivePerformanceDashboard = () => {
  const [demoTrades, setDemoTrades] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoTrades(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Platform Overview</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful <span className="text-primary">Trading Infrastructure</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            TradeFlow provides enterprise-grade trading tools for the Solana ecosystem
          </p>
        </motion.div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {platformFeatures.map((stat, i) => (
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
          {/* Bot Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  AI Trading Bots
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
                          bot.status === "ready" 
                            ? "bg-green-500/10 text-green-400 border-green-500/30" 
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                        }
                      >
                        {bot.status === "ready" ? "Available" : bot.status === "demo" ? "Demo Mode" : "Coming Soon"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{bot.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Demo Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Demo Environment
                  <Badge variant="secondary" className="ml-2 text-xs">Simulation</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                    <Activity className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-sm font-medium text-primary">Demo Mode Active</span>
                  </div>
                  <p className="text-4xl font-bold text-foreground mb-2">{demoTrades}</p>
                  <p className="text-muted-foreground">Simulated trades executed</p>
                </div>

                <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Try Before You Trade</p>
                      <p className="text-sm text-muted-foreground">
                        Sign up for early access to test our AI trading bots in demo mode before committing real funds.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Demo data is simulated for illustration purposes only
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LivePerformanceDashboard;

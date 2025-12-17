import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, TrendingDown, Minus, Activity, Users, 
  MessageCircle, BarChart3, Flame, Zap
} from "lucide-react";

interface SentimentData {
  overall: number; // -100 to 100
  bullish: number;
  bearish: number;
  neutral: number;
  volume: number;
  activeTraders: number;
  trending: string[];
}

const trendingTokens = [
  "SOL", "BONK", "WIF", "JUP", "PYTH", "RAY", "ORCA", "MEME", "POPCAT"
];

const generateSentiment = (): SentimentData => {
  const bullish = Math.floor(Math.random() * 40) + 40; // 40-80
  const bearish = Math.floor(Math.random() * 30) + 10; // 10-40
  const neutral = 100 - bullish - bearish;
  
  return {
    overall: bullish - bearish,
    bullish,
    bearish,
    neutral,
    volume: Math.floor(Math.random() * 500000) + 100000,
    activeTraders: Math.floor(Math.random() * 5000) + 2000,
    trending: trendingTokens.sort(() => Math.random() - 0.5).slice(0, 4)
  };
};

const MarketSentiment = () => {
  const [sentiment, setSentiment] = useState<SentimentData>(generateSentiment);
  const [recentVotes, setRecentVotes] = useState<{ type: "bull" | "bear"; time: string }[]>([]);

  useEffect(() => {
    // Update sentiment periodically
    const sentimentInterval = setInterval(() => {
      setSentiment(prev => {
        const change = (Math.random() - 0.5) * 10;
        const newBullish = Math.max(30, Math.min(80, prev.bullish + change));
        const newBearish = Math.max(10, Math.min(50, prev.bearish - change * 0.5));
        const newNeutral = 100 - newBullish - newBearish;
        
        return {
          ...prev,
          overall: newBullish - newBearish,
          bullish: Math.round(newBullish),
          bearish: Math.round(newBearish),
          neutral: Math.round(newNeutral),
          volume: prev.volume + Math.floor(Math.random() * 1000),
          activeTraders: prev.activeTraders + Math.floor(Math.random() * 10) - 5
        };
      });
    }, 3000);

    // Simulate real-time votes
    const voteInterval = setInterval(() => {
      const type = Math.random() > 0.4 ? "bull" : "bear";
      setRecentVotes(prev => [
        { type, time: "Just now" },
        ...prev.slice(0, 4)
      ]);
    }, 2000);

    return () => {
      clearInterval(sentimentInterval);
      clearInterval(voteInterval);
    };
  }, []);

  const getSentimentColor = () => {
    if (sentiment.overall > 20) return "text-green-400";
    if (sentiment.overall < -20) return "text-red-400";
    return "text-yellow-400";
  };

  const getSentimentLabel = () => {
    if (sentiment.overall > 40) return "Extremely Bullish";
    if (sentiment.overall > 20) return "Bullish";
    if (sentiment.overall > -20) return "Neutral";
    if (sentiment.overall > -40) return "Bearish";
    return "Extremely Bearish";
  };

  const getSentimentIcon = () => {
    if (sentiment.overall > 20) return TrendingUp;
    if (sentiment.overall < -20) return TrendingDown;
    return Minus;
  };

  const SentimentIcon = getSentimentIcon();

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Live Sentiment</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Community <span className="text-primary">Market Sentiment</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time sentiment from thousands of active traders on the platform
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Sentiment Gauge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2"
            >
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm h-full">
                <CardContent className="p-6">
                  {/* Sentiment Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-400" />
                        Bearish
                      </span>
                      <span className={`text-lg font-bold ${getSentimentColor()}`}>
                        {getSentimentLabel()}
                      </span>
                      <span className="text-sm font-medium flex items-center gap-2">
                        Bullish
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      </span>
                    </div>
                    
                    <div className="relative h-8 bg-secondary/50 rounded-full overflow-hidden">
                      {/* Bearish Section */}
                      <motion.div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-600 to-red-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${sentiment.bearish}%` }}
                        transition={{ duration: 0.5 }}
                      />
                      {/* Neutral Section */}
                      <motion.div
                        className="absolute top-0 h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
                        initial={{ left: "0%", width: 0 }}
                        animate={{ 
                          left: `${sentiment.bearish}%`, 
                          width: `${sentiment.neutral}%` 
                        }}
                        transition={{ duration: 0.5 }}
                      />
                      {/* Bullish Section */}
                      <motion.div
                        className="absolute right-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${sentiment.bullish}%` }}
                        transition={{ duration: 0.5 }}
                      />
                      
                      {/* Indicator */}
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-10 bg-white rounded-full shadow-lg border-2 border-background"
                        animate={{ left: `calc(${50 + sentiment.overall / 2}% - 8px)` }}
                        transition={{ type: "spring", stiffness: 100 }}
                      />
                    </div>
                    
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>{sentiment.bearish}% Bearish</span>
                      <span>{sentiment.neutral}% Neutral</span>
                      <span>{sentiment.bullish}% Bullish</span>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-background/50 border border-border/30">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-xl font-bold">{sentiment.activeTraders.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Active Traders</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50 border border-border/30">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        <span className="text-xl font-bold">{(sentiment.volume / 1000).toFixed(0)}K</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Votes Today</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50 border border-border/30">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <SentimentIcon className={`w-4 h-4 ${getSentimentColor()}`} />
                        <span className={`text-xl font-bold ${getSentimentColor()}`}>
                          {sentiment.overall > 0 ? "+" : ""}{sentiment.overall.toFixed(0)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Sentiment Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Live Feed & Trending */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {/* Live Votes */}
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-semibold">Live Votes</span>
                  </div>
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {recentVotes.slice(0, 5).map((vote, i) => (
                        <motion.div
                          key={`${vote.type}-${i}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className={`w-2 h-2 rounded-full ${
                            vote.type === "bull" ? "bg-green-400" : "bg-red-400"
                          }`} />
                          <span className="text-muted-foreground">Trader voted</span>
                          <Badge 
                            variant="outline" 
                            className={vote.type === "bull" 
                              ? "bg-green-500/10 text-green-400 border-green-500/30 text-xs" 
                              : "bg-red-500/10 text-red-400 border-red-500/30 text-xs"
                            }
                          >
                            {vote.type === "bull" ? "Bullish" : "Bearish"}
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>

              {/* Trending Tokens */}
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-semibold">Trending Now</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sentiment.trending.map((token, i) => (
                      <motion.div
                        key={token}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Badge 
                          variant="secondary" 
                          className="bg-primary/10 text-primary border border-primary/20"
                        >
                          ${token}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Discussion Activity */}
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-semibold">Community Buzz</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {(Math.floor(Math.random() * 500) + 800).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Messages in the last hour</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketSentiment;

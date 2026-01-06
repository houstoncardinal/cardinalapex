import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  TrendingUp, Star, ThumbsUp, MessageCircle, Share2, 
  Verified, Camera, Trophy, Flame, Sparkles
} from "lucide-react";

interface UserResult {
  id: number;
  username: string;
  avatar: string;
  verified: boolean;
  profit: string;
  profitPercent: string;
  timeframe: string;
  strategy: string;
  likes: number;
  comments: number;
  image: string;
  badge?: string;
}

const userResults: UserResult[] = [
  {
    id: 1,
    username: "CryptoKing_Mike",
    avatar: "MK",
    verified: true,
    profit: "+$23,847",
    profitPercent: "+187%",
    timeframe: "3 months",
    strategy: "Alpha Predator Bot",
    likes: 342,
    comments: 56,
    image: "linear-gradient(135deg, hsl(142 76% 36%) 0%, hsl(142 70% 45%) 100%)",
    badge: "Top Performer",
  },
  {
    id: 2,
    username: "SolanaWhale",
    avatar: "SW",
    verified: true,
    profit: "+$156,290",
    profitPercent: "+423%",
    timeframe: "6 months",
    strategy: "Trend Surfer + Scalp Master",
    likes: 1243,
    comments: 187,
    image: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(262 83% 58%) 100%)",
    badge: "Whale Status",
  },
  {
    id: 3,
    username: "TradingQueen",
    avatar: "TQ",
    verified: false,
    profit: "+$8,421",
    profitPercent: "+94%",
    timeframe: "1 month",
    strategy: "Conservative Growth",
    likes: 89,
    comments: 23,
    image: "linear-gradient(135deg, hsl(346 77% 49%) 0%, hsl(24 95% 53%) 100%)",
  },
  {
    id: 4,
    username: "DeFi_Master",
    avatar: "DM",
    verified: true,
    profit: "+$67,832",
    profitPercent: "+312%",
    timeframe: "4 months",
    strategy: "Multi-Bot Strategy",
    likes: 567,
    comments: 92,
    image: "linear-gradient(135deg, hsl(48 96% 53%) 0%, hsl(36 100% 50%) 100%)",
    badge: "Rising Star",
  },
  {
    id: 5,
    username: "BlockchainBoss",
    avatar: "BB",
    verified: true,
    profit: "+$234,100",
    profitPercent: "+567%",
    timeframe: "8 months",
    strategy: "Alpha Predator + Custom AI",
    likes: 2341,
    comments: 412,
    image: "linear-gradient(135deg, hsl(262 83% 58%) 0%, hsl(280 87% 65%) 100%)",
    badge: "Legend",
  },
  {
    id: 6,
    username: "MoonTrader",
    avatar: "MT",
    verified: false,
    profit: "+$12,567",
    profitPercent: "+145%",
    timeframe: "2 months",
    strategy: "Swing Trading Bot",
    likes: 156,
    comments: 34,
    image: "linear-gradient(135deg, hsl(199 89% 48%) 0%, hsl(186 100% 42%) 100%)",
  },
];

const getBadgeColor = (badge?: string) => {
  switch (badge) {
    case "Top Performer":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "Whale Status":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Rising Star":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Legend":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    default:
      return "bg-primary/20 text-primary border-primary/30";
  }
};

const CommunityShowcase = () => {
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  const [likes, setLikes] = useState<Record<number, boolean>>({});

  const handleLike = (id: number) => {
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="relative z-10 py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Community Results</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Real Traders, <span className="text-primary">Real Profits</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See what our community is achieving with TradeFlow AI trading bots. 
            These are real results from real traders.
          </p>
        </motion.div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {userResults.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden hover:border-primary/50 transition-all duration-300">
                {/* Screenshot/Chart Preview */}
                <div 
                  className="h-40 relative"
                  style={{ background: result.image }}
                >
                  {/* Simulated chart lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
                    <path
                      d="M0,80 Q50,60 100,70 T200,50 T300,40 T400,30"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M0,100 Q80,90 150,85 T250,60 T350,45 T400,35"
                      stroke="white"
                      strokeWidth="1.5"
                      fill="none"
                      opacity="0.5"
                    />
                  </svg>
                  
                  {/* Profit overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="text-center"
                      initial={{ scale: 0.9 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                    >
                      <p className="text-4xl font-bold text-white drop-shadow-lg">
                        {result.profit}
                      </p>
                      <p className="text-lg text-white/90 font-medium">
                        {result.profitPercent} in {result.timeframe}
                      </p>
                    </motion.div>
                  </div>

                  {/* Badge */}
                  {result.badge && (
                    <div className="absolute top-3 right-3">
                      <Badge className={`${getBadgeColor(result.badge)} text-xs`}>
                        <Flame className="w-3 h-3 mr-1" />
                        {result.badge}
                      </Badge>
                    </div>
                  )}

                  {/* Camera icon */}
                  <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* User info */}
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {result.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">
                          {result.username}
                        </span>
                        {result.verified && (
                          <Verified className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {result.strategy}
                      </p>
                    </div>
                  </div>

                  {/* Engagement */}
                  <div className="flex items-center gap-4 pt-3 border-t border-border/50">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(result.id)}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ThumbsUp className={`w-4 h-4 ${likes[result.id] ? 'text-primary fill-primary' : ''}`} />
                      <span>{result.likes + (likes[result.id] ? 1 : 0)}</span>
                    </motion.button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>{result.comments}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { label: "Community Members", value: "12,847+" },
            { label: "Success Stories", value: "8,423" },
            { label: "Total Profits Shared", value: "$47M+" },
            { label: "Avg. Win Rate", value: "89%" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Join the community and share your own trading journey
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-lg shadow-primary/25"
          >
            <Sparkles className="w-4 h-4" />
            Start Your Success Story
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityShowcase;

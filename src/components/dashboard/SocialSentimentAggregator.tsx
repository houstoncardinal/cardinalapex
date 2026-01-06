import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  TrendingUp, 
  TrendingDown,
  Flame,
  Users,
  Hash,
  Heart,
  Repeat,
  AlertCircle,
  Sparkles,
  Globe,
  Zap
} from 'lucide-react';

interface SocialPost {
  id: string;
  platform: 'twitter' | 'reddit' | 'discord';
  username: string;
  content: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number;
  likes: number;
  shares: number;
  timestamp: Date;
  token: string;
  verified: boolean;
}

interface TokenSentiment {
  symbol: string;
  overallSentiment: number;
  twitterScore: number;
  redditScore: number;
  discordScore: number;
  mentionCount: number;
  trendingRank: number;
  change24h: number;
}

const platforms = {
  twitter: { icon: '𝕏', color: 'text-foreground', bg: 'bg-secondary' },
  reddit: { icon: '📱', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  discord: { icon: '💬', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
};

const generatePost = (): SocialPost => {
  const tokens = ['SOL', 'ETH', 'BTC', 'BONK', 'WIF', 'PEPE', 'DOGE', 'ARB'];
  const platformKeys: ('twitter' | 'reddit' | 'discord')[] = ['twitter', 'reddit', 'discord'];
  const sentiments: ('bullish' | 'bearish' | 'neutral')[] = ['bullish', 'bearish', 'neutral'];
  
  const bullishPhrases = [
    "🚀 $TOKEN about to moon! Chart looking perfect",
    "$TOKEN breakout imminent. Loading up more here 💎",
    "The $TOKEN accumulation phase is textbook. Whales are loading",
    "Just aped into $TOKEN. This is the one 🔥",
    "$TOKEN price action is insane rn. Bull flag forming",
    "Smart money flowing into $TOKEN. On-chain data bullish af",
  ];
  
  const bearishPhrases = [
    "$TOKEN looking weak. Taking profits here 📉",
    "Bearish divergence on $TOKEN. Be careful",
    "$TOKEN whale just dumped 2M. Red flags everywhere",
    "Not touching $TOKEN until we see support hold",
    "$TOKEN breaking down. Head and shoulders confirmed",
  ];
  
  const neutralPhrases = [
    "$TOKEN consolidating. Waiting for direction",
    "Watching $TOKEN closely. Could go either way",
    "$TOKEN in a range. No clear trade yet",
    "What's everyone thinking about $TOKEN?",
  ];

  const token = tokens[Math.floor(Math.random() * tokens.length)];
  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
  const platform = platformKeys[Math.floor(Math.random() * platformKeys.length)];
  
  const phrases = sentiment === 'bullish' ? bullishPhrases : sentiment === 'bearish' ? bearishPhrases : neutralPhrases;
  const content = phrases[Math.floor(Math.random() * phrases.length)].replace('$TOKEN', `$${token}`);
  
  const usernames = ['CryptoWhale', 'DeFiDegen', 'SolanaMaxi', 'TokenHunter', 'ChartMaster', 'AltSeason', 'DiamondHands', 'MoonBoy'];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    platform,
    username: usernames[Math.floor(Math.random() * usernames.length)] + Math.floor(Math.random() * 999),
    content,
    sentiment,
    score: sentiment === 'bullish' ? 0.7 + Math.random() * 0.3 : sentiment === 'bearish' ? Math.random() * 0.3 : 0.4 + Math.random() * 0.2,
    likes: Math.floor(Math.random() * 5000),
    shares: Math.floor(Math.random() * 1000),
    timestamp: new Date(),
    token,
    verified: Math.random() > 0.7,
  };
};

const tokenSentiments: TokenSentiment[] = [
  { symbol: 'SOL', overallSentiment: 78, twitterScore: 82, redditScore: 75, discordScore: 76, mentionCount: 12847, trendingRank: 1, change24h: 12 },
  { symbol: 'ETH', overallSentiment: 71, twitterScore: 68, redditScore: 74, discordScore: 72, mentionCount: 9823, trendingRank: 2, change24h: 5 },
  { symbol: 'BONK', overallSentiment: 85, twitterScore: 89, redditScore: 82, discordScore: 84, mentionCount: 8456, trendingRank: 3, change24h: 34 },
  { symbol: 'BTC', overallSentiment: 65, twitterScore: 62, redditScore: 68, discordScore: 66, mentionCount: 15234, trendingRank: 4, change24h: -2 },
  { symbol: 'WIF', overallSentiment: 72, twitterScore: 78, redditScore: 68, discordScore: 70, mentionCount: 5678, trendingRank: 5, change24h: 18 },
  { symbol: 'PEPE', overallSentiment: 68, twitterScore: 72, redditScore: 65, discordScore: 67, mentionCount: 4523, trendingRank: 6, change24h: -8 },
];

const PostCard = ({ post }: { post: SocialPost }) => {
  const platform = platforms[post.platform];
  const sentimentColor = post.sentiment === 'bullish' ? 'text-chart-green' : post.sentiment === 'bearish' ? 'text-destructive' : 'text-chart-yellow';
  const sentimentBg = post.sentiment === 'bullish' ? 'bg-chart-green/10' : post.sentiment === 'bearish' ? 'bg-destructive/10' : 'bg-chart-yellow/10';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-lg bg-secondary/30 border border-border/30 hover:border-border/50 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${platform.bg}`}>
          <span className="text-lg">{platform.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-foreground text-sm">@{post.username}</span>
            {post.verified && <Badge variant="secondary" className="text-[10px] px-1 py-0">✓</Badge>}
            <Badge className={`${sentimentBg} ${sentimentColor} text-[10px]`}>
              {post.sentiment === 'bullish' ? '🐂' : post.sentiment === 'bearish' ? '🐻' : '⚖️'} {Math.round(post.score * 100)}%
            </Badge>
          </div>
          <p className="text-sm text-foreground/90 mb-2">{post.content}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {post.likes.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Repeat className="h-3 w-3" />
              {post.shares.toLocaleString()}
            </span>
            <span>{post.timestamp.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SocialSentimentAggregator = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  useEffect(() => {
    // Generate initial posts
    const initial = Array.from({ length: 8 }, generatePost);
    setPosts(initial);

    // Simulate live posts
    const interval = setInterval(() => {
      const newPost = generatePost();
      setPosts(prev => [newPost, ...prev.slice(0, 19)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const overallSentiment = Math.round(
    tokenSentiments.reduce((acc, t) => acc + t.overallSentiment, 0) / tokenSentiments.length
  );

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Globe className="h-5 w-5 text-blue-400" />
            </div>
            <span>Social Sentiment</span>
            <span className="flex items-center gap-1.5 ml-2">
              <span className="h-2 w-2 rounded-full bg-chart-green animate-pulse" />
              <span className="text-xs text-chart-green font-medium">LIVE</span>
            </span>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Flame className="h-3 w-3 text-orange-500" />
              {overallSentiment}% Bullish
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Platform Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'Twitter/X', icon: '𝕏', score: 76, mentions: '45.2K', color: 'text-foreground' },
            { name: 'Reddit', icon: '📱', score: 72, mentions: '12.8K', color: 'text-orange-500' },
            { name: 'Discord', icon: '💬', score: 74, mentions: '28.4K', color: 'text-indigo-400' },
          ].map((platform) => (
            <div key={platform.name} className="p-3 rounded-lg bg-secondary/30 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{platform.icon}</span>
                <span className="text-xs text-muted-foreground">{platform.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-lg font-bold ${platform.score >= 70 ? 'text-chart-green' : 'text-chart-yellow'}`}>
                  {platform.score}%
                </span>
                <span className="text-xs text-muted-foreground">{platform.mentions}</span>
              </div>
            </div>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feed">Live Feed</TabsTrigger>
            <TabsTrigger value="trending">Trending Tokens</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feed" className="mt-4">
            <ScrollArea className="h-[400px] pr-2">
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="trending" className="mt-4">
            <div className="space-y-3">
              {tokenSentiments.map((token, index) => (
                <motion.div
                  key={token.symbol}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/30 transition-all cursor-pointer"
                  onClick={() => setSelectedToken(token.symbol)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="font-mono">#{token.trendingRank}</Badge>
                      <span className="font-bold text-foreground">{token.symbol}</span>
                      <Badge 
                        className={token.change24h >= 0 ? 'bg-chart-green/20 text-chart-green' : 'bg-destructive/20 text-destructive'}
                      >
                        {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{token.mentionCount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Progress value={token.overallSentiment} className="h-2 flex-1" />
                    <span className={`text-sm font-bold ${token.overallSentiment >= 70 ? 'text-chart-green' : token.overallSentiment >= 50 ? 'text-chart-yellow' : 'text-destructive'}`}>
                      {token.overallSentiment}%
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>𝕏 {token.twitterScore}%</span>
                    <span>📱 {token.redditScore}%</span>
                    <span>💬 {token.discordScore}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SocialSentimentAggregator;

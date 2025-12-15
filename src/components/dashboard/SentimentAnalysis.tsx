import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Twitter, MessageCircle, TrendingUp, TrendingDown, Minus, Activity, BarChart3 } from 'lucide-react';

interface TokenSentiment {
  token: string;
  overallScore: number;
  socialScore: number;
  onChainScore: number;
  twitterMentions: number;
  discordActivity: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  signals: string[];
}

interface SocialSignal {
  id: string;
  platform: 'twitter' | 'discord' | 'telegram';
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  engagement: number;
  timestamp: Date;
}

const MOCK_SENTIMENTS: TokenSentiment[] = [
  { token: 'SOL', overallScore: 78, socialScore: 82, onChainScore: 74, twitterMentions: 45000, discordActivity: 8500, trend: 'bullish', signals: ['High whale accumulation', 'Breaking resistance levels', 'Positive dev activity'] },
  { token: 'BONK', overallScore: 65, socialScore: 85, onChainScore: 45, twitterMentions: 120000, discordActivity: 15000, trend: 'bullish', signals: ['Viral social momentum', 'New listings announced', 'Community growth +15%'] },
  { token: 'WIF', overallScore: 45, socialScore: 55, onChainScore: 35, twitterMentions: 28000, discordActivity: 4200, trend: 'bearish', signals: ['Whale distribution detected', 'Declining volume', 'Negative sentiment shift'] },
  { token: 'JUP', overallScore: 72, socialScore: 68, onChainScore: 76, twitterMentions: 18000, discordActivity: 6800, trend: 'bullish', signals: ['Strong on-chain metrics', 'Protocol upgrades coming', 'Growing TVL'] },
  { token: 'PEPE', overallScore: 52, socialScore: 70, onChainScore: 34, twitterMentions: 85000, discordActivity: 9500, trend: 'neutral', signals: ['Mixed social signals', 'Consolidation phase', 'Watch for breakout'] },
];

const MOCK_SIGNALS: SocialSignal[] = [
  { id: '1', platform: 'twitter', content: '🚀 $SOL breaking ATH! This is just the beginning...', sentiment: 'positive', engagement: 2500, timestamp: new Date(Date.now() - 600000) },
  { id: '2', platform: 'discord', content: 'BONK team just announced major partnership 👀', sentiment: 'positive', engagement: 850, timestamp: new Date(Date.now() - 1200000) },
  { id: '3', platform: 'twitter', content: 'Concerned about WIF whale movements. Be careful!', sentiment: 'negative', engagement: 1200, timestamp: new Date(Date.now() - 1800000) },
  { id: '4', platform: 'telegram', content: 'JUP airdrop season 2 confirmed! LFG 🔥', sentiment: 'positive', engagement: 3200, timestamp: new Date(Date.now() - 2400000) },
  { id: '5', platform: 'twitter', content: 'Market looking uncertain. Time to be patient.', sentiment: 'neutral', engagement: 450, timestamp: new Date(Date.now() - 3600000) },
];

export const SentimentAnalysis = () => {
  const [sentiments] = useState<TokenSentiment[]>(MOCK_SENTIMENTS);
  const [signals] = useState<SocialSignal[]>(MOCK_SIGNALS);

  const getSentimentColor = (score: number) => {
    if (score >= 70) return 'text-chart-2';
    if (score >= 40) return 'text-chart-4';
    return 'text-destructive';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-chart-2" />;
      case 'bearish': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'discord': return <MessageCircle className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">Positive</Badge>;
      case 'negative': return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Negative</Badge>;
      default: return <Badge variant="secondary">Neutral</Badge>;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-chart-3" />
          Token Sentiment Analysis
        </CardTitle>
        <CardDescription>Social media & on-chain sentiment signals</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="signals">
              <Activity className="h-4 w-4 mr-2" />
              Live Signals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {sentiments.map((token) => (
              <div key={token.token} className="p-4 rounded-lg bg-muted/30 border border-border/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold">{token.token}</span>
                    {getTrendIcon(token.trend)}
                    <Badge variant="outline" className="capitalize">{token.trend}</Badge>
                  </div>
                  <div className={`text-2xl font-bold ${getSentimentColor(token.overallScore)}`}>
                    {token.overallScore}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Social Score</span>
                      <span className={getSentimentColor(token.socialScore)}>{token.socialScore}</span>
                    </div>
                    <Progress value={token.socialScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">On-Chain Score</span>
                      <span className={getSentimentColor(token.onChainScore)}>{token.onChainScore}</span>
                    </div>
                    <Progress value={token.onChainScore} className="h-2" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    <Twitter className="h-3 w-3 mr-1" />
                    {(token.twitterMentions / 1000).toFixed(1)}K mentions
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {(token.discordActivity / 1000).toFixed(1)}K activity
                  </Badge>
                </div>

                <div className="space-y-1">
                  {token.signals.map((signal, idx) => (
                    <p key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-chart-1" />
                      {signal}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="signals" className="space-y-3">
            {signals.map((signal) => (
              <div key={signal.id} className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(signal.platform)}
                    <span className="text-sm capitalize text-muted-foreground">{signal.platform}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSentimentBadge(signal.sentiment)}
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(signal.timestamp)}</span>
                  </div>
                </div>
                <p className="text-sm mb-2">{signal.content}</p>
                <p className="text-xs text-muted-foreground">
                  {signal.engagement.toLocaleString()} engagements
                </p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

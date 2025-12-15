import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Newspaper, TrendingUp, TrendingDown, Clock, ExternalLink, RefreshCw, Zap, AlertTriangle } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  timestamp: Date;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  category: 'market' | 'defi' | 'regulation' | 'technology' | 'breaking';
  relatedTokens: string[];
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Solana TVL Reaches New All-Time High of $12B',
    summary: 'The Solana ecosystem has seen unprecedented growth with total value locked surging past $12 billion, driven by DeFi and NFT activity.',
    source: 'CoinDesk',
    url: '#',
    timestamp: new Date(Date.now() - 1800000),
    sentiment: 'bullish',
    category: 'defi',
    relatedTokens: ['SOL', 'RAY', 'JUP']
  },
  {
    id: '2',
    title: 'Breaking: Major Exchange Lists New Meme Coins',
    summary: 'Binance announces listing of popular Solana meme tokens BONK and WIF, sparking significant price rallies.',
    source: 'The Block',
    url: '#',
    timestamp: new Date(Date.now() - 3600000),
    sentiment: 'bullish',
    category: 'breaking',
    relatedTokens: ['BONK', 'WIF']
  },
  {
    id: '3',
    title: 'SEC Delays Decision on Crypto ETF Applications',
    summary: 'Regulatory uncertainty continues as the SEC postpones decisions on multiple cryptocurrency ETF applications.',
    source: 'Bloomberg',
    url: '#',
    timestamp: new Date(Date.now() - 7200000),
    sentiment: 'bearish',
    category: 'regulation',
    relatedTokens: ['BTC', 'ETH']
  },
  {
    id: '4',
    title: 'Jupiter Announces V2 Protocol Upgrade',
    summary: 'Jupiter DEX reveals major protocol improvements including faster routing and reduced slippage for large trades.',
    source: 'Decrypt',
    url: '#',
    timestamp: new Date(Date.now() - 10800000),
    sentiment: 'bullish',
    category: 'technology',
    relatedTokens: ['JUP', 'SOL']
  },
  {
    id: '5',
    title: 'Crypto Market Cap Surpasses $3 Trillion',
    summary: 'Total cryptocurrency market capitalization reaches historic milestone amid institutional adoption.',
    source: 'Reuters',
    url: '#',
    timestamp: new Date(Date.now() - 14400000),
    sentiment: 'bullish',
    category: 'market',
    relatedTokens: ['BTC', 'ETH', 'SOL']
  },
  {
    id: '6',
    title: 'Warning: New Phishing Scam Targets DeFi Users',
    summary: 'Security researchers identify sophisticated phishing campaign targeting Solana wallet users through fake airdrops.',
    source: 'CryptoSlate',
    url: '#',
    timestamp: new Date(Date.now() - 18000000),
    sentiment: 'neutral',
    category: 'breaking',
    relatedTokens: ['SOL']
  },
];

export const NewsFeed = () => {
  const [news] = useState<NewsItem[]>(MOCK_NEWS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'breaking' | 'bullish' | 'bearish'>('all');

  const refreshNews = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-chart-2" />;
      case 'bearish': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    const styles: Record<string, string> = {
      breaking: 'bg-destructive/20 text-destructive border-destructive/30',
      market: 'bg-chart-1/20 text-chart-1 border-chart-1/30',
      defi: 'bg-chart-2/20 text-chart-2 border-chart-2/30',
      regulation: 'bg-chart-4/20 text-chart-4 border-chart-4/30',
      technology: 'bg-chart-3/20 text-chart-3 border-chart-3/30',
    };
    return styles[category] || 'bg-muted text-muted-foreground';
  };

  const filteredNews = news.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'breaking') return item.category === 'breaking';
    return item.sentiment === filter;
  });

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-chart-1" />
            Crypto News
          </CardTitle>
          <CardDescription>Real-time market headlines</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={refreshNews} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4 flex-wrap">
          {(['all', 'breaking', 'bullish', 'bearish'] as const).map((f) => (
            <Badge
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              className="cursor-pointer capitalize"
              onClick={() => setFilter(f)}
            >
              {f === 'breaking' && <Zap className="h-3 w-3 mr-1" />}
              {f === 'bullish' && <TrendingUp className="h-3 w-3 mr-1" />}
              {f === 'bearish' && <TrendingDown className="h-3 w-3 mr-1" />}
              {f}
            </Badge>
          ))}
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {filteredNews.map((item) => (
              <div key={item.id} className="p-4 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${getCategoryBadge(item.category)}`}>
                      {item.category === 'breaking' && <Zap className="h-3 w-3 mr-1" />}
                      {item.category}
                    </Badge>
                    {getSentimentIcon(item.sentiment)}
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(item.timestamp)}
                  </span>
                </div>

                <h4 className="font-semibold text-sm mb-2 leading-tight">{item.title}</h4>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.summary}</p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {item.relatedTokens.map((token) => (
                      <Badge key={token} variant="secondary" className="text-xs">
                        {token}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{item.source}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

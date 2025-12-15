import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Search, TrendingUp, AlertTriangle, Clock, Shield, Flame, Star, ExternalLink } from 'lucide-react';

interface Token {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  riskScore: number;
  launchDate: Date;
  holders: number;
  liquidity: number;
  isVerified: boolean;
  isTrending: boolean;
}

const MOCK_TOKENS: Token[] = [
  { id: '1', symbol: 'PNUT', name: 'Peanut the Squirrel', price: 0.0234, change24h: 156.7, volume24h: 45000000, marketCap: 23400000, riskScore: 35, launchDate: new Date(Date.now() - 86400000 * 3), holders: 12500, liquidity: 2800000, isVerified: false, isTrending: true },
  { id: '2', symbol: 'AI16Z', name: 'ai16z', price: 1.85, change24h: 42.3, volume24h: 120000000, marketCap: 185000000, riskScore: 55, launchDate: new Date(Date.now() - 86400000 * 14), holders: 45000, liquidity: 15000000, isVerified: true, isTrending: true },
  { id: '3', symbol: 'GOAT', name: 'Goatseus Maximus', price: 0.52, change24h: -8.5, volume24h: 28000000, marketCap: 52000000, riskScore: 45, launchDate: new Date(Date.now() - 86400000 * 30), holders: 28000, liquidity: 5500000, isVerified: true, isTrending: false },
  { id: '4', symbol: 'FWOG', name: 'Fwog', price: 0.089, change24h: 234.5, volume24h: 8500000, marketCap: 8900000, riskScore: 25, launchDate: new Date(Date.now() - 86400000 * 1), holders: 3200, liquidity: 450000, isVerified: false, isTrending: true },
  { id: '5', symbol: 'POPCAT', name: 'Popcat', price: 1.42, change24h: 12.8, volume24h: 65000000, marketCap: 142000000, riskScore: 68, launchDate: new Date(Date.now() - 86400000 * 180), holders: 85000, liquidity: 22000000, isVerified: true, isTrending: false },
  { id: '6', symbol: 'MOODENG', name: 'Moo Deng', price: 0.34, change24h: 89.2, volume24h: 32000000, marketCap: 34000000, riskScore: 42, launchDate: new Date(Date.now() - 86400000 * 7), holders: 18500, liquidity: 3200000, isVerified: false, isTrending: true },
];

export const TokenScanner = () => {
  const [tokens] = useState<Token[]>(MOCK_TOKENS);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'new' | 'risky'>('trending');

  const getRiskColor = (score: number) => {
    if (score >= 60) return 'text-chart-2 bg-chart-2/20';
    if (score >= 40) return 'text-chart-4 bg-chart-4/20';
    return 'text-destructive bg-destructive/20';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 60) return 'Low Risk';
    if (score >= 40) return 'Medium';
    return 'High Risk';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  const getDaysAgo = (date: Date) => {
    const days = Math.floor((Date.now() - date.getTime()) / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  const filteredTokens = tokens
    .filter(t => t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'trending') return b.change24h - a.change24h;
      if (sortBy === 'new') return b.launchDate.getTime() - a.launchDate.getTime();
      return a.riskScore - b.riskScore;
    });

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-chart-1" />
          Token Scanner
        </CardTitle>
        <CardDescription>Discover trending tokens with risk analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Tabs defaultValue="trending" onValueChange={(v) => setSortBy(v as 'trending' | 'new' | 'risky')}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending">
              <Flame className="h-4 w-4 mr-1" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="new">
              <Clock className="h-4 w-4 mr-1" />
              New
            </TabsTrigger>
            <TabsTrigger value="risky">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Risk Score
            </TabsTrigger>
          </TabsList>

          <TabsContent value={sortBy} className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {filteredTokens.map((token) => (
                  <div key={token.id} className="p-4 rounded-lg bg-muted/30 border border-border/30">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{token.symbol}</span>
                            {token.isVerified && <Shield className="h-3 w-3 text-chart-1" />}
                            {token.isTrending && <Flame className="h-3 w-3 text-chart-4" />}
                          </div>
                          <span className="text-xs text-muted-foreground">{token.name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${token.price < 0.01 ? token.price.toFixed(6) : token.price.toFixed(4)}</p>
                        <p className={`text-xs ${token.change24h >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
                          {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">MCap:</span>
                        <span>{formatNumber(token.marketCap)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vol 24h:</span>
                        <span>{formatNumber(token.volume24h)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Liquidity:</span>
                        <span>{formatNumber(token.liquidity)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Holders:</span>
                        <span>{token.holders.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {getDaysAgo(token.launchDate)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">Risk:</span>
                            <Badge className={`text-xs ${getRiskColor(token.riskScore)}`}>
                              {getRiskLabel(token.riskScore)}
                            </Badge>
                          </div>
                          <Progress value={token.riskScore} className="h-1 w-16 mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

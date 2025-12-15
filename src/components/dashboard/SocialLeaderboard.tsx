import { useState, useEffect } from 'react';
import { Trophy, Medal, TrendingUp, Users, Crown, Star, Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  total_pnl: number;
  win_rate: number;
  total_trades: number;
  streak_days: number;
  best_trade: number;
  rank_position: number;
  badge: string | null;
}

// Demo leaderboard data
const DEMO_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', user_id: '1', display_name: 'CryptoKing👑', avatar_url: null, total_pnl: 125430.50, win_rate: 84.2, total_trades: 892, streak_days: 45, best_trade: 12500, rank_position: 1, badge: 'legend' },
  { id: '2', user_id: '2', display_name: 'DiamondTrader', avatar_url: null, total_pnl: 98234.25, win_rate: 79.8, total_trades: 567, streak_days: 32, best_trade: 8900, rank_position: 2, badge: 'whale' },
  { id: '3', user_id: '3', display_name: 'MoonShot', avatar_url: null, total_pnl: 76890.00, win_rate: 72.5, total_trades: 1243, streak_days: 21, best_trade: 15000, rank_position: 3, badge: 'degen' },
  { id: '4', user_id: '4', display_name: 'SOLSniper', avatar_url: null, total_pnl: 54321.75, win_rate: 68.9, total_trades: 432, streak_days: 14, best_trade: 6500, rank_position: 4, badge: null },
  { id: '5', user_id: '5', display_name: 'AlphaHunter', avatar_url: null, total_pnl: 43210.50, win_rate: 71.2, total_trades: 654, streak_days: 18, best_trade: 4200, rank_position: 5, badge: null },
  { id: '6', user_id: '6', display_name: 'DeFiDegen', avatar_url: null, total_pnl: 32456.80, win_rate: 65.4, total_trades: 987, streak_days: 9, best_trade: 3800, rank_position: 6, badge: 'degen' },
  { id: '7', user_id: '7', display_name: 'WhaleCatcher', avatar_url: null, total_pnl: 28900.25, win_rate: 62.1, total_trades: 345, streak_days: 7, best_trade: 5500, rank_position: 7, badge: null },
  { id: '8', user_id: '8', display_name: 'TokenMaster', avatar_url: null, total_pnl: 21567.90, win_rate: 58.7, total_trades: 456, streak_days: 5, best_trade: 2900, rank_position: 8, badge: null },
  { id: '9', user_id: '9', display_name: 'BullRunner', avatar_url: null, total_pnl: 18234.50, win_rate: 55.3, total_trades: 234, streak_days: 3, best_trade: 2100, rank_position: 9, badge: null },
  { id: '10', user_id: '10', display_name: 'NewTrader', avatar_url: null, total_pnl: 12890.00, win_rate: 52.8, total_trades: 123, streak_days: 2, best_trade: 1500, rank_position: 10, badge: null },
];

const BADGES: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  legend: { icon: <Crown className="h-3 w-3" />, color: 'text-yellow-400 bg-yellow-500/20', label: 'Legend' },
  whale: { icon: <Star className="h-3 w-3" />, color: 'text-blue-400 bg-blue-500/20', label: 'Whale' },
  degen: { icon: <Flame className="h-3 w-3" />, color: 'text-orange-400 bg-orange-500/20', label: 'Degen' },
};

export const SocialLeaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(DEMO_LEADERBOARD);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('all');

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-300" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  const formatPnL = (pnl: number) => {
    if (pnl >= 1000000) return `$${(pnl / 1000000).toFixed(1)}M`;
    if (pnl >= 1000) return `$${(pnl / 1000).toFixed(1)}K`;
    return `$${pnl.toFixed(2)}`;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/20">
            <Trophy className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="font-semibold">Leaderboard</h3>
            <p className="text-xs text-muted-foreground">Top traders globally</p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1">
          <Users className="h-3 w-3" />
          {leaderboard.length} traders
        </Badge>
      </div>

      <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)} className="mb-4">
        <TabsList className="grid grid-cols-4 h-8">
          <TabsTrigger value="daily" className="text-xs">Today</TabsTrigger>
          <TabsTrigger value="weekly" className="text-xs">Week</TabsTrigger>
          <TabsTrigger value="monthly" className="text-xs">Month</TabsTrigger>
          <TabsTrigger value="all" className="text-xs">All Time</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[1, 0, 2].map((podiumIndex) => {
          const entry = leaderboard[podiumIndex];
          if (!entry) return null;
          const isFirst = podiumIndex === 0;
          
          return (
            <div
              key={entry.id}
              className={cn(
                "flex flex-col items-center p-3 rounded-lg border transition-all",
                isFirst ? "bg-gradient-to-b from-yellow-500/10 to-transparent border-yellow-500/30 -mt-2" : "bg-secondary/30 border-border"
              )}
            >
              <div className="relative mb-2">
                <Avatar className={cn("border-2", isFirst ? "h-14 w-14 border-yellow-500" : "h-10 w-10 border-primary/50")}>
                  <AvatarFallback className={cn(
                    "font-bold",
                    isFirst ? "bg-gradient-to-br from-yellow-500/30 to-amber-500/30" : "bg-primary/20"
                  )}>
                    {entry.display_name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center",
                  podiumIndex === 0 ? "bg-yellow-500" : podiumIndex === 1 ? "bg-gray-400" : "bg-amber-600"
                )}>
                  <span className="text-[10px] font-bold text-background">{entry.rank_position}</span>
                </div>
              </div>
              <p className={cn("font-medium text-xs text-center truncate w-full", isFirst && "text-yellow-400")}>
                {entry.display_name}
              </p>
              <p className="text-success font-mono text-sm font-bold">{formatPnL(entry.total_pnl)}</p>
              <p className="text-[10px] text-muted-foreground">{entry.win_rate}% win</p>
            </div>
          );
        })}
      </div>

      {/* Rest of Leaderboard */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {leaderboard.slice(3).map((entry) => (
          <div
            key={entry.id}
            className={cn(
              "flex items-center justify-between p-2 rounded-lg border border-border hover:border-primary/30 transition-all",
              user?.id === entry.user_id && "border-primary bg-primary/5"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 flex justify-center">
                {getRankDisplay(entry.rank_position)}
              </div>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {entry.display_name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-sm">{entry.display_name}</span>
                  {entry.badge && BADGES[entry.badge] && (
                    <Badge variant="secondary" className={cn("text-[10px] px-1 py-0 h-4", BADGES[entry.badge].color)}>
                      {BADGES[entry.badge].icon}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{entry.total_trades} trades</span>
                  {entry.streak_days > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-orange-400">🔥 {entry.streak_days}d</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-success font-mono font-bold text-sm">{formatPnL(entry.total_pnl)}</p>
              <p className="text-[10px] text-muted-foreground">{entry.win_rate}% win rate</p>
            </div>
          </div>
        ))}
      </div>

      {/* Your Rank */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between p-2 rounded-lg bg-primary/10 border border-primary/30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">Your Rank</span>
            <Badge variant="outline">#--</Badge>
          </div>
          <Button size="sm" variant="outline" className="h-7 text-xs">
            Join Leaderboard
          </Button>
        </div>
      </div>
    </Card>
  );
};

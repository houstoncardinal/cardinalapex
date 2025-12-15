import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Users, TrendingUp, TrendingDown, Crown, Verified } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  message: string;
  timestamp: Date;
  badge?: 'whale' | 'top_trader' | 'verified';
  tradeCall?: {
    token: string;
    action: 'long' | 'short';
    entry: number;
  };
}

interface OnlineUser {
  id: string;
  username: string;
  badge?: string;
}

export const TradingChatRoom = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: 'u1',
      username: 'WhaleHunter',
      message: 'Just spotted massive SOL accumulation on Raydium 👀',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      badge: 'whale',
    },
    {
      id: '2',
      userId: 'u2',
      username: 'CryptoKing',
      message: 'BONK looking ready for another leg up. Entry around 0.000024',
      timestamp: new Date(Date.now() - 4 * 60 * 1000),
      badge: 'top_trader',
      tradeCall: { token: 'BONK', action: 'long', entry: 0.000024 },
    },
    {
      id: '3',
      userId: 'u3',
      username: 'SolanaMaxi',
      message: 'Anyone else seeing the divergence on JUP 4h?',
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      badge: 'verified',
    },
    {
      id: '4',
      userId: 'u4',
      username: 'DeFiDegen',
      message: 'New token launching in 10 mins. DYOR but could be big 🚀',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
    },
    {
      id: '5',
      userId: 'u5',
      username: 'PatternTrader',
      message: 'WIF forming a clean cup & handle. Target $3.50',
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
      badge: 'top_trader',
      tradeCall: { token: 'WIF', action: 'long', entry: 2.85 },
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers] = useState<OnlineUser[]>([
    { id: '1', username: 'WhaleHunter', badge: '🐋' },
    { id: '2', username: 'CryptoKing', badge: '👑' },
    { id: '3', username: 'SolanaMaxi', badge: '✓' },
    { id: '4', username: 'DeFiDegen' },
    { id: '5', username: 'PatternTrader', badge: '👑' },
    { id: '6', username: 'MoonBoy' },
    { id: '7', username: 'DiamondHands', badge: '💎' },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      userId: 'me',
      username: 'You',
      message: newMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case 'whale': return <span className="text-blue-400">🐋</span>;
      case 'top_trader': return <Crown className="h-3 w-3 text-amber-400" />;
      case 'verified': return <Verified className="h-3 w-3 text-blue-400" />;
      default: return null;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Trading Chat
          </CardTitle>
          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
            <Users className="h-3 w-3 mr-1" />
            {onlineUsers.length} online
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Online Users */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {onlineUsers.map((user) => (
            <Badge key={user.id} variant="outline" className="text-xs whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1" />
              {user.badge && <span className="mr-1">{user.badge}</span>}
              {user.username}
            </Badge>
          ))}
        </div>

        {/* Messages */}
        <ScrollArea className="h-[300px] pr-4" ref={scrollRef}>
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.userId === 'me' ? 'justify-end' : ''}`}>
                <div className={`max-w-[85%] ${msg.userId === 'me' ? 'order-2' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${msg.userId === 'me' ? 'text-primary' : 'text-foreground'}`}>
                      {msg.username}
                    </span>
                    {getBadgeIcon(msg.badge)}
                    <span className="text-[10px] text-muted-foreground">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className={`p-2 rounded-lg ${
                    msg.userId === 'me' 
                      ? 'bg-primary/20 border border-primary/30' 
                      : 'bg-background/50 border border-border/30'
                  }`}>
                    <p className="text-sm text-foreground">{msg.message}</p>
                    
                    {/* Trade Call */}
                    {msg.tradeCall && (
                      <div className={`mt-2 p-2 rounded flex items-center justify-between ${
                        msg.tradeCall.action === 'long' 
                          ? 'bg-emerald-500/10 border border-emerald-500/20' 
                          : 'bg-red-500/10 border border-red-500/20'
                      }`}>
                        <div className="flex items-center gap-2">
                          {msg.tradeCall.action === 'long' ? (
                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-400" />
                          )}
                          <span className="font-bold text-foreground">{msg.tradeCall.token}</span>
                          <span className="text-xs text-muted-foreground">
                            @ ${msg.tradeCall.entry < 0.01 ? msg.tradeCall.entry.toFixed(6) : msg.tradeCall.entry}
                          </span>
                        </div>
                        <Button size="sm" variant="ghost" className="h-6 text-xs">
                          Copy
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Share your trade idea..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
          />
          <Button size="sm" onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-[10px] text-muted-foreground text-center">
          Not financial advice. Always DYOR before trading.
        </p>
      </CardContent>
    </Card>
  );
};

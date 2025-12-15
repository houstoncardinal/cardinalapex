import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Globe, TrendingUp, Activity } from 'lucide-react';

interface TradingSession {
  name: string;
  region: string;
  start: number; // Hour in UTC
  end: number;
  volumePercent: number;
  color: string;
}

const SESSIONS: TradingSession[] = [
  { name: 'Asia', region: 'Tokyo/Singapore', start: 0, end: 9, volumePercent: 20, color: 'bg-yellow-500' },
  { name: 'Europe', region: 'London/Frankfurt', start: 7, end: 16, volumePercent: 35, color: 'bg-blue-500' },
  { name: 'US', region: 'New York', start: 13, end: 22, volumePercent: 40, color: 'bg-green-500' },
  { name: 'Pacific', region: 'Sydney', start: 21, end: 6, volumePercent: 5, color: 'bg-purple-500' }
];

export const SessionTimer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSessions, setActiveSessions] = useState<TradingSession[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const utcHour = currentTime.getUTCHours();
    const active = SESSIONS.filter(session => {
      if (session.start < session.end) {
        return utcHour >= session.start && utcHour < session.end;
      } else {
        // Wraps around midnight
        return utcHour >= session.start || utcHour < session.end;
      }
    });
    setActiveSessions(active);
  }, [currentTime]);

  const getSessionProgress = (session: TradingSession) => {
    const utcHour = currentTime.getUTCHours();
    const utcMinutes = currentTime.getUTCMinutes();
    const currentMinutes = utcHour * 60 + utcMinutes;
    
    let startMinutes = session.start * 60;
    let endMinutes = session.end * 60;
    
    if (session.start > session.end) {
      endMinutes += 24 * 60;
      if (currentMinutes < startMinutes) {
        startMinutes -= 24 * 60;
      }
    }
    
    const totalDuration = endMinutes - startMinutes;
    const elapsed = currentMinutes - startMinutes;
    return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const formatUTC = (date: Date) => {
    return date.toUTCString().slice(17, 25);
  };

  // Volume profile data (mock)
  const volumeProfile = [
    { hour: '00:00', volume: 15, session: 'Asia' },
    { hour: '04:00', volume: 25, session: 'Asia' },
    { hour: '08:00', volume: 45, session: 'Europe' },
    { hour: '12:00', volume: 60, session: 'Europe' },
    { hour: '14:00', volume: 85, session: 'US' },
    { hour: '16:00', volume: 100, session: 'US' },
    { hour: '18:00', volume: 75, session: 'US' },
    { hour: '20:00', volume: 40, session: 'US' },
    { hour: '22:00', volume: 20, session: 'Pacific' }
  ];

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Session Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Time */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-muted/30 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Local Time</p>
            <p className="text-xl font-mono font-bold text-foreground">{formatTime(currentTime)}</p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">UTC Time</p>
            <p className="text-xl font-mono font-bold text-primary">{formatUTC(currentTime)}</p>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Active Sessions</span>
            <Badge variant="outline">{activeSessions.length} open</Badge>
          </div>
          
          {SESSIONS.map((session) => {
            const isActive = activeSessions.includes(session);
            const progress = isActive ? getSessionProgress(session) : 0;
            
            return (
              <div 
                key={session.name} 
                className={`p-2 rounded-lg border transition-colors ${
                  isActive ? 'bg-muted/30 border-primary/30' : 'bg-muted/10 border-border opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${session.color} ${isActive ? 'animate-pulse' : ''}`} />
                    <span className="text-sm font-medium text-foreground">{session.name}</span>
                    <span className="text-xs text-muted-foreground">{session.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {String(session.start).padStart(2, '0')}:00 - {String(session.end).padStart(2, '0')}:00 UTC
                    </span>
                    {isActive && (
                      <Badge className={session.color}>LIVE</Badge>
                    )}
                  </div>
                </div>
                {isActive && (
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="h-1 flex-1" />
                    <span className="text-xs text-muted-foreground">{progress.toFixed(0)}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Volume Profile */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Volume Profile (24h)</span>
          </div>
          <div className="flex items-end gap-1 h-16">
            {volumeProfile.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full rounded-t ${
                    bar.session === 'US' ? 'bg-green-500' :
                    bar.session === 'Europe' ? 'bg-blue-500' :
                    bar.session === 'Asia' ? 'bg-yellow-500' : 'bg-purple-500'
                  }`}
                  style={{ height: `${bar.volume}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>00:00</span>
            <span>12:00</span>
            <span>24:00</span>
          </div>
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-4 gap-1 text-center">
          {SESSIONS.map((session) => (
            <div key={session.name} className="p-1.5 bg-muted/20 rounded">
              <div className={`w-2 h-2 rounded-full ${session.color} mx-auto mb-1`} />
              <p className="text-xs text-muted-foreground">{session.name}</p>
              <p className="text-xs font-bold text-foreground">{session.volumePercent}%</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

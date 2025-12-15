import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Clock, Plus, Trash2, Play, Pause, Calendar } from 'lucide-react';
import { useState } from 'react';

interface ScheduledTrade {
  id: string;
  token: string;
  action: 'buy' | 'sell';
  amount: number;
  time: string;
  days: string[];
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const AutoTradeScheduler = () => {
  const [schedules, setSchedules] = useState<ScheduledTrade[]>([
    { id: '1', token: 'SOL', action: 'buy', amount: 0.5, time: '09:00', days: ['Mon', 'Wed', 'Fri'], enabled: true, nextRun: 'Mon 09:00 UTC' },
    { id: '2', token: 'BONK', action: 'buy', amount: 0.1, time: '14:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], enabled: true, nextRun: 'Mon 14:00 UTC' },
    { id: '3', token: 'WIF', action: 'sell', amount: 0.25, time: '18:00', days: ['Fri'], enabled: false, lastRun: 'Fri 18:00 UTC' },
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [newSchedule, setNewSchedule] = useState<Partial<ScheduledTrade>>({
    token: 'SOL',
    action: 'buy',
    amount: 0.1,
    time: '09:00',
    days: [],
  });

  const toggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  const toggleDay = (day: string) => {
    setNewSchedule(prev => ({
      ...prev,
      days: prev.days?.includes(day) 
        ? prev.days.filter(d => d !== day)
        : [...(prev.days || []), day]
    }));
  };

  const addSchedule = () => {
    if (newSchedule.token && newSchedule.amount && newSchedule.time && newSchedule.days?.length) {
      setSchedules(prev => [...prev, {
        ...newSchedule as ScheduledTrade,
        id: Date.now().toString(),
        enabled: true,
        nextRun: `${newSchedule.days?.[0]} ${newSchedule.time} UTC`,
      }]);
      setShowAdd(false);
      setNewSchedule({ token: 'SOL', action: 'buy', amount: 0.1, time: '09:00', days: [] });
    }
  };

  const activeSchedules = schedules.filter(s => s.enabled).length;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Auto-Trade Scheduler
            <Badge variant="outline">{activeSchedules} Active</Badge>
          </CardTitle>
          <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Schedule */}
        {showAdd && (
          <div className="p-4 bg-background/50 rounded-lg border border-primary/30 space-y-4">
            <p className="text-sm font-medium text-foreground">New Scheduled Trade</p>
            
            <div className="grid grid-cols-2 gap-3">
              <Select value={newSchedule.token} onValueChange={(v) => setNewSchedule(p => ({ ...p, token: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="BONK">BONK</SelectItem>
                  <SelectItem value="WIF">WIF</SelectItem>
                  <SelectItem value="JUP">JUP</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={newSchedule.action} onValueChange={(v: 'buy' | 'sell') => setNewSchedule(p => ({ ...p, action: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Amount (SOL)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newSchedule.amount}
                  onChange={(e) => setNewSchedule(p => ({ ...p, amount: parseFloat(e.target.value) }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Time (UTC)</label>
                <Input
                  type="time"
                  value={newSchedule.time}
                  onChange={(e) => setNewSchedule(p => ({ ...p, time: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Days</label>
              <div className="flex gap-1 flex-wrap">
                {DAYS.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      newSchedule.days?.includes(day)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={addSchedule} disabled={!newSchedule.days?.length}>
                Create Schedule
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Scheduled Trades List */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {schedules.map((schedule) => (
            <div 
              key={schedule.id}
              className={`p-3 rounded-lg border transition-all ${
                schedule.enabled 
                  ? 'bg-background/50 border-border/30' 
                  : 'bg-background/20 border-border/20 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={schedule.enabled}
                    onCheckedChange={() => toggleSchedule(schedule.id)}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className={schedule.action === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                        {schedule.action.toUpperCase()}
                      </Badge>
                      <span className="font-medium text-foreground">{schedule.token}</span>
                      <span className="text-sm text-muted-foreground">{schedule.amount} SOL</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{schedule.time} UTC</span>
                      <span>•</span>
                      <span>{schedule.days.join(', ')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {schedule.enabled ? (
                    <Play className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Pause className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSchedule(schedule.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {schedule.enabled && schedule.nextRun && (
                <div className="mt-2 pt-2 border-t border-border/20 flex items-center gap-2 text-xs">
                  <Calendar className="h-3 w-3 text-primary" />
                  <span className="text-muted-foreground">Next run:</span>
                  <span className="text-primary">{schedule.nextRun}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {schedules.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No scheduled trades</p>
            <p className="text-xs">Click "Add" to create your first schedule</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

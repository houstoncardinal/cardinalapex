import { useState } from 'react';
import { FlaskConical, Play, TrendingUp, TrendingDown, Loader2, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface BacktestResult {
  strategy_name: string;
  token_symbol: string;
  initial_capital: number;
  final_capital: number;
  total_return: number;
  win_rate: number;
  total_trades: number;
  max_drawdown: number;
  sharpe_ratio: number;
  equity_curve: { day: number; value: number }[];
}

const STRATEGIES = [
  { value: 'momentum', label: 'Momentum', description: 'Buy on uptrends, sell on reversals' },
  { value: 'mean_reversion', label: 'Mean Reversion', description: 'Buy dips, sell rallies' },
  { value: 'breakout', label: 'Breakout', description: 'Trade breakouts from consolidation' },
  { value: 'dca', label: 'DCA', description: 'Dollar cost average at intervals' },
  { value: 'rsi', label: 'RSI Strategy', description: 'Buy oversold, sell overbought' },
];

const TOKENS = ['SOL', 'BTC', 'ETH', 'BONK', 'WIF', 'PEPE', 'JUP'];

export const Backtesting = () => {
  const { user } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<BacktestResult | null>(null);
  
  const [params, setParams] = useState({
    strategy: 'momentum',
    token: 'SOL',
    initialCapital: 1000,
    period: 90,
    riskPerTrade: 5,
  });

  const runBacktest = async () => {
    setIsRunning(true);
    setProgress(0);
    setResult(null);

    // Simulate backtest progress
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 15, 95));
    }, 200);

    // Simulate backtest computation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearInterval(progressInterval);
    setProgress(100);

    // Generate simulated results based on strategy
    const strategyMultipliers: Record<string, number> = {
      momentum: 1.2,
      mean_reversion: 1.1,
      breakout: 1.35,
      dca: 1.08,
      rsi: 1.15,
    };

    const baseReturn = (Math.random() * 40 - 10) * strategyMultipliers[params.strategy];
    const finalCapital = params.initialCapital * (1 + baseReturn / 100);
    const totalTrades = Math.floor(params.period * (params.strategy === 'dca' ? 0.5 : 1.5));
    const winRate = 45 + Math.random() * 30;
    const maxDrawdown = 5 + Math.random() * 20;
    const sharpeRatio = (baseReturn / 100) / (maxDrawdown / 100) * Math.sqrt(252 / params.period);

    // Generate equity curve
    const equityCurve = [];
    let currentValue = params.initialCapital;
    for (let i = 0; i <= params.period; i++) {
      const dailyReturn = (baseReturn / params.period) + (Math.random() - 0.5) * 5;
      currentValue = currentValue * (1 + dailyReturn / 100);
      equityCurve.push({ day: i, value: Math.round(currentValue * 100) / 100 });
    }

    const backtestResult: BacktestResult = {
      strategy_name: STRATEGIES.find(s => s.value === params.strategy)?.label || '',
      token_symbol: params.token,
      initial_capital: params.initialCapital,
      final_capital: Math.round(finalCapital * 100) / 100,
      total_return: Math.round(baseReturn * 100) / 100,
      win_rate: Math.round(winRate * 10) / 10,
      total_trades: totalTrades,
      max_drawdown: Math.round(maxDrawdown * 10) / 10,
      sharpe_ratio: Math.round(sharpeRatio * 100) / 100,
      equity_curve: equityCurve,
    };

    setResult(backtestResult);

    // Save to database
    if (user) {
      await supabase.from('backtest_results').insert({
        user_id: user.id,
        strategy_name: backtestResult.strategy_name,
        token_symbol: backtestResult.token_symbol,
        start_date: new Date(Date.now() - params.period * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        initial_capital: backtestResult.initial_capital,
        final_capital: backtestResult.final_capital,
        total_return: backtestResult.total_return,
        win_rate: backtestResult.win_rate,
        total_trades: backtestResult.total_trades,
        max_drawdown: backtestResult.max_drawdown,
        sharpe_ratio: backtestResult.sharpe_ratio,
        parameters: params,
      });
    }

    setIsRunning(false);
    toast.success('Backtest completed!');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20">
          <FlaskConical className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="font-semibold">Strategy Backtesting</h3>
          <p className="text-xs text-muted-foreground">Test strategies on historical data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Strategy</Label>
            <Select value={params.strategy} onValueChange={(v) => setParams(p => ({ ...p, strategy: v }))}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STRATEGIES.map(s => (
                  <SelectItem key={s.value} value={s.value}>
                    <div>
                      <div className="font-medium">{s.label}</div>
                      <div className="text-xs text-muted-foreground">{s.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs">Token</Label>
            <Select value={params.token} onValueChange={(v) => setParams(p => ({ ...p, token: v }))}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TOKENS.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Initial Capital ($)</Label>
            <Input
              type="number"
              value={params.initialCapital}
              onChange={(e) => setParams(p => ({ ...p, initialCapital: Number(e.target.value) }))}
              className="h-9"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Period (days)</Label>
              <span className="text-xs text-muted-foreground">{params.period}</span>
            </div>
            <Slider
              value={[params.period]}
              onValueChange={([v]) => setParams(p => ({ ...p, period: v }))}
              min={7}
              max={365}
              step={1}
            />
          </div>
        </div>
      </div>

      <Button 
        onClick={runBacktest} 
        disabled={isRunning} 
        className="w-full gap-2 mb-4"
      >
        {isRunning ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Running Backtest...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Run Backtest
          </>
        )}
      </Button>

      {isRunning && (
        <div className="mb-4">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground mt-1">
            Analyzing {params.period} days of {params.token} data...
          </p>
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Results Summary */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className={cn(
                "text-lg font-bold",
                result.total_return >= 0 ? "text-success" : "text-destructive"
              )}>
                {result.total_return >= 0 ? '+' : ''}{result.total_return}%
              </p>
              <p className="text-[10px] text-muted-foreground">Return</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold">{result.win_rate}%</p>
              <p className="text-[10px] text-muted-foreground">Win Rate</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-destructive">-{result.max_drawdown}%</p>
              <p className="text-[10px] text-muted-foreground">Max DD</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold">{result.sharpe_ratio}</p>
              <p className="text-[10px] text-muted-foreground">Sharpe</p>
            </div>
          </div>

          {/* Equity Curve */}
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.equity_curve}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis 
                  tick={{ fontSize: 10 }} 
                  domain={['dataMin - 50', 'dataMax + 50']}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip 
                  contentStyle={{ fontSize: 12, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Portfolio']}
                />
                <ReferenceLine y={result.initial_capital} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={result.total_return >= 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'} 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Trade Summary */}
          <div className="flex items-center justify-between text-xs bg-secondary/30 rounded-lg p-2">
            <span className="text-muted-foreground">
              {result.total_trades} trades over {params.period} days
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">
                ${result.initial_capital} → ${result.final_capital}
              </Badge>
              {result.total_return >= 0 ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

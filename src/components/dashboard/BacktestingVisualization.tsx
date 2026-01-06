import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine, ComposedChart, Bar } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  Calendar,
  Zap,
  Shield,
  Rocket,
  Clock,
  BarChart3,
  Percent,
  DollarSign
} from 'lucide-react';

interface BacktestResult {
  date: string;
  equity: number;
  benchmark: number;
  drawdown: number;
  trades: number;
}

interface BotPerformance {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  winRate: number;
  totalReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  profitFactor: number;
  totalTrades: number;
  avgWin: number;
  avgLoss: number;
  data: BacktestResult[];
}

const generateBacktestData = (volatility: number, trend: number, months: number = 12): BacktestResult[] => {
  const data: BacktestResult[] = [];
  let equity = 10000;
  let benchmark = 10000;
  let peak = equity;
  
  for (let i = 0; i < months * 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (months * 30 - i));
    
    const dailyReturn = (Math.random() - 0.45) * volatility + trend;
    const benchmarkReturn = (Math.random() - 0.48) * 0.03;
    
    equity *= (1 + dailyReturn);
    benchmark *= (1 + benchmarkReturn);
    peak = Math.max(peak, equity);
    
    const drawdown = ((peak - equity) / peak) * 100;
    
    if (i % 3 === 0) {
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        equity: Math.round(equity),
        benchmark: Math.round(benchmark),
        drawdown: Math.round(drawdown * 10) / 10,
        trades: Math.floor(Math.random() * 5) + 1,
      });
    }
  }
  
  return data;
};

const bots: BotPerformance[] = [
  {
    id: 'alpha-scalper',
    name: 'Alpha Scalper',
    icon: Zap,
    color: '#f59e0b',
    winRate: 72,
    totalReturn: 847,
    maxDrawdown: 12.4,
    sharpeRatio: 2.34,
    profitFactor: 2.8,
    totalTrades: 2847,
    avgWin: 1.2,
    avgLoss: 0.8,
    data: generateBacktestData(0.025, 0.008),
  },
  {
    id: 'steady-gains',
    name: 'Steady Gains',
    icon: Shield,
    color: '#3b82f6',
    winRate: 68,
    totalReturn: 312,
    maxDrawdown: 8.2,
    sharpeRatio: 1.89,
    profitFactor: 2.1,
    totalTrades: 1234,
    avgWin: 2.4,
    avgLoss: 1.6,
    data: generateBacktestData(0.015, 0.005),
  },
  {
    id: 'momentum-hunter',
    name: 'Momentum Hunter',
    icon: Rocket,
    color: '#ec4899',
    winRate: 65,
    totalReturn: 1247,
    maxDrawdown: 18.6,
    sharpeRatio: 2.67,
    profitFactor: 3.2,
    totalTrades: 892,
    avgWin: 4.8,
    avgLoss: 2.1,
    data: generateBacktestData(0.035, 0.012),
  },
  {
    id: 'diamond-hands',
    name: 'Diamond Hands',
    icon: Target,
    color: '#10b981',
    winRate: 85,
    totalReturn: 534,
    maxDrawdown: 15.3,
    sharpeRatio: 1.56,
    profitFactor: 4.1,
    totalTrades: 156,
    avgWin: 12.4,
    avgLoss: 5.2,
    data: generateBacktestData(0.022, 0.007),
  },
  {
    id: 'whale-tracker',
    name: 'Whale Tracker',
    icon: TrendingUp,
    color: '#8b5cf6',
    winRate: 70,
    totalReturn: 923,
    maxDrawdown: 14.8,
    sharpeRatio: 2.12,
    profitFactor: 2.6,
    totalTrades: 687,
    avgWin: 3.6,
    avgLoss: 1.9,
    data: generateBacktestData(0.028, 0.009),
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    icon: Clock,
    color: '#6366f1',
    winRate: 75,
    totalReturn: 456,
    maxDrawdown: 9.4,
    sharpeRatio: 2.01,
    profitFactor: 2.4,
    totalTrades: 1567,
    avgWin: 1.8,
    avgLoss: 1.1,
    data: generateBacktestData(0.018, 0.006),
  },
];

const BacktestingVisualization = () => {
  const [selectedBot, setSelectedBot] = useState(bots[0]);
  const [timeframe, setTimeframe] = useState('12m');
  const [showBenchmark, setShowBenchmark] = useState(true);

  const metrics = [
    { label: 'Total Return', value: `+${selectedBot.totalReturn}%`, icon: TrendingUp, color: 'text-chart-green' },
    { label: 'Win Rate', value: `${selectedBot.winRate}%`, icon: Target, color: 'text-primary' },
    { label: 'Sharpe Ratio', value: selectedBot.sharpeRatio.toFixed(2), icon: BarChart3, color: 'text-chart-blue' },
    { label: 'Max Drawdown', value: `-${selectedBot.maxDrawdown}%`, icon: TrendingDown, color: 'text-destructive' },
    { label: 'Profit Factor', value: selectedBot.profitFactor.toFixed(1), icon: DollarSign, color: 'text-chart-yellow' },
    { label: 'Total Trades', value: selectedBot.totalTrades.toLocaleString(), icon: Activity, color: 'text-muted-foreground' },
  ];

  const Icon = selectedBot.icon;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-chart-blue/20 to-chart-purple/20">
              <BarChart3 className="h-5 w-5 text-chart-blue" />
            </div>
            <span>Backtesting Results</span>
          </CardTitle>
          
          <div className="flex items-center gap-3">
            <Select value={selectedBot.id} onValueChange={(id) => setSelectedBot(bots.find(b => b.id === id) || bots[0])}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bots.map((bot) => (
                  <SelectItem key={bot.id} value={bot.id}>
                    <div className="flex items-center gap-2">
                      <bot.icon className="h-4 w-4" style={{ color: bot.color }} />
                      {bot.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="12m">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Bot Header */}
        <motion.div 
          key={selectedBot.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-secondary/50 to-transparent border border-border/30"
        >
          <div 
            className="p-3 rounded-xl" 
            style={{ backgroundColor: `${selectedBot.color}20` }}
          >
            <Icon className="h-6 w-6" style={{ color: selectedBot.color }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">{selectedBot.name}</h3>
            <p className="text-sm text-muted-foreground">
              Avg Win: <span className="text-chart-green">+{selectedBot.avgWin}%</span> | 
              Avg Loss: <span className="text-destructive">-{selectedBot.avgLoss}%</span>
            </p>
          </div>
          <Badge 
            className="text-sm px-3 py-1"
            style={{ backgroundColor: `${selectedBot.color}20`, color: selectedBot.color }}
          >
            +{selectedBot.totalReturn}% Return
          </Badge>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 rounded-lg bg-secondary/30 border border-border/30"
            >
              <div className="flex items-center gap-2 mb-1">
                <metric.icon className={`h-3.5 w-3.5 ${metric.color}`} />
                <span className="text-xs text-muted-foreground">{metric.label}</span>
              </div>
              <p className={`text-lg font-bold ${metric.color}`}>{metric.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <Tabs defaultValue="equity" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="equity">Equity Curve</TabsTrigger>
            <TabsTrigger value="drawdown">Drawdown</TabsTrigger>
            <TabsTrigger value="trades">Trade Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="equity" className="mt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={selectedBot.data}>
                  <defs>
                    <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={selectedBot.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={selectedBot.color} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="benchmarkGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6b7280" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6b7280" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name === 'equity' ? 'Strategy' : 'Benchmark']}
                  />
                  <ReferenceLine y={10000} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" opacity={0.5} />
                  {showBenchmark && (
                    <Area 
                      type="monotone" 
                      dataKey="benchmark" 
                      stroke="#6b7280" 
                      fill="url(#benchmarkGradient)" 
                      strokeWidth={1}
                      strokeDasharray="5 5"
                    />
                  )}
                  <Area 
                    type="monotone" 
                    dataKey="equity" 
                    stroke={selectedBot.color} 
                    fill="url(#equityGradient)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedBot.color }} />
                <span className="text-xs text-muted-foreground">Strategy</span>
              </div>
              <button 
                onClick={() => setShowBenchmark(!showBenchmark)}
                className={`flex items-center gap-2 ${showBenchmark ? 'opacity-100' : 'opacity-50'}`}
              >
                <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                <span className="text-xs text-muted-foreground">Benchmark (Buy & Hold)</span>
              </button>
            </div>
          </TabsContent>
          
          <TabsContent value="drawdown" className="mt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={selectedBot.data}>
                  <defs>
                    <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `-${v}%`} domain={[0, 'auto']} reversed />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`-${value}%`, 'Drawdown']}
                  />
                  <ReferenceLine y={selectedBot.maxDrawdown} stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
                  <Area 
                    type="monotone" 
                    dataKey="drawdown" 
                    stroke="hsl(var(--destructive))" 
                    fill="url(#drawdownGradient)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="trades" className="mt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={selectedBot.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar yAxisId="left" dataKey="trades" fill={selectedBot.color} opacity={0.6} radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="equity" stroke={selectedBot.color} strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BacktestingVisualization;

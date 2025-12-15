import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

interface PerformanceData {
  date: string;
  portfolio: number;
  SOL: number;
  BONK: number;
  WIF: number;
  JUP: number;
}

interface AllocationData {
  date: string;
  SOL: number;
  BONK: number;
  WIF: number;
  JUP: number;
  USDC: number;
}

const PERFORMANCE_DATA: PerformanceData[] = [
  { date: 'Jan', portfolio: 10000, SOL: 5000, BONK: 2000, WIF: 1500, JUP: 1500 },
  { date: 'Feb', portfolio: 11200, SOL: 5800, BONK: 2400, WIF: 1400, JUP: 1600 },
  { date: 'Mar', portfolio: 10800, SOL: 5200, BONK: 2600, WIF: 1200, JUP: 1800 },
  { date: 'Apr', portfolio: 13500, SOL: 6500, BONK: 3200, WIF: 1800, JUP: 2000 },
  { date: 'May', portfolio: 15200, SOL: 7200, BONK: 3800, WIF: 2000, JUP: 2200 },
  { date: 'Jun', portfolio: 14800, SOL: 6800, BONK: 4200, WIF: 1700, JUP: 2100 },
  { date: 'Jul', portfolio: 18500, SOL: 8500, BONK: 5000, WIF: 2500, JUP: 2500 },
  { date: 'Aug', portfolio: 22000, SOL: 10000, BONK: 6000, WIF: 3000, JUP: 3000 },
  { date: 'Sep', portfolio: 20500, SOL: 9200, BONK: 5500, WIF: 2800, JUP: 3000 },
  { date: 'Oct', portfolio: 25000, SOL: 11000, BONK: 7000, WIF: 3500, JUP: 3500 },
  { date: 'Nov', portfolio: 28500, SOL: 12500, BONK: 8000, WIF: 4000, JUP: 4000 },
  { date: 'Dec', portfolio: 32000, SOL: 14000, BONK: 9000, WIF: 4500, JUP: 4500 },
];

const ALLOCATION_DATA: AllocationData[] = [
  { date: 'Q1', SOL: 50, BONK: 20, WIF: 15, JUP: 10, USDC: 5 },
  { date: 'Q2', SOL: 45, BONK: 25, WIF: 12, JUP: 13, USDC: 5 },
  { date: 'Q3', SOL: 42, BONK: 28, WIF: 14, JUP: 11, USDC: 5 },
  { date: 'Q4', SOL: 44, BONK: 28, WIF: 14, JUP: 14, USDC: 0 },
];

const CURRENT_ALLOCATION = [
  { name: 'SOL', value: 44, color: 'hsl(var(--chart-1))' },
  { name: 'BONK', value: 28, color: 'hsl(var(--chart-2))' },
  { name: 'WIF', value: 14, color: 'hsl(var(--chart-3))' },
  { name: 'JUP', value: 14, color: 'hsl(var(--chart-4))' },
];

const TOKEN_STATS = [
  { token: 'SOL', invested: 8000, current: 14000, pnl: 6000, pnlPercent: 75 },
  { token: 'BONK', invested: 3000, current: 9000, pnl: 6000, pnlPercent: 200 },
  { token: 'WIF', invested: 2500, current: 4500, pnl: 2000, pnlPercent: 80 },
  { token: 'JUP', invested: 2000, current: 4500, pnl: 2500, pnlPercent: 125 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export const PortfolioComparison = () => {
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y'>('1Y');

  const getFilteredData = () => {
    const months = { '1M': 1, '3M': 3, '6M': 6, '1Y': 12 };
    return PERFORMANCE_DATA.slice(-months[timeframe]);
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-chart-1" />
          Multi-Token Performance
        </CardTitle>
        <CardDescription>Compare token performance & allocation over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="performance">
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="allocation">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Allocation
            </TabsTrigger>
            <TabsTrigger value="breakdown">
              <BarChart3 className="h-4 w-4 mr-2" />
              Breakdown
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <div className="flex gap-2 mb-4">
              {(['1M', '3M', '6M', '1Y'] as const).map((tf) => (
                <Badge
                  key={tf}
                  variant={timeframe === tf ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </Badge>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getFilteredData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Legend />
                <Line type="monotone" dataKey="portfolio" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} name="Total Portfolio" />
                <Line type="monotone" dataKey="SOL" stroke={COLORS[0]} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="BONK" stroke={COLORS[1]} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="WIF" stroke={COLORS[2]} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="JUP" stroke={COLORS[3]} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="allocation">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-4">Current Allocation</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={CURRENT_ALLOCATION}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {CURRENT_ALLOCATION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value}%`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 justify-center">
                  {CURRENT_ALLOCATION.map((item, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: item.color }} />
                      {item.name} {item.value}%
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-4">Allocation Over Time</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={ALLOCATION_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value}%`, '']}
                    />
                    <Area type="monotone" dataKey="SOL" stackId="1" stroke={COLORS[0]} fill={COLORS[0]} />
                    <Area type="monotone" dataKey="BONK" stackId="1" stroke={COLORS[1]} fill={COLORS[1]} />
                    <Area type="monotone" dataKey="WIF" stackId="1" stroke={COLORS[2]} fill={COLORS[2]} />
                    <Area type="monotone" dataKey="JUP" stackId="1" stroke={COLORS[3]} fill={COLORS[3]} />
                    <Area type="monotone" dataKey="USDC" stackId="1" stroke={COLORS[4]} fill={COLORS[4]} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="breakdown">
            <div className="space-y-4">
              {TOKEN_STATS.map((stat, idx) => (
                <div key={stat.token} className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                      <span className="font-bold">{stat.token}</span>
                    </div>
                    <Badge className={stat.pnl >= 0 ? 'bg-chart-2/20 text-chart-2' : 'bg-destructive/20 text-destructive'}>
                      {stat.pnl >= 0 ? '+' : ''}{stat.pnlPercent}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Invested</p>
                      <p className="font-semibold">${stat.invested.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current</p>
                      <p className="font-semibold">${stat.current.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">P&L</p>
                      <p className={`font-semibold ${stat.pnl >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
                        {stat.pnl >= 0 ? '+' : ''}${stat.pnl.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const generateChartData = (days: number, trend: "up" | "down" | "volatile") => {
  const data = [];
  let basePrice = 45000;
  
  for (let i = 0; i < days; i++) {
    const multiplier = trend === "up" ? 1.002 : trend === "down" ? 0.998 : 1;
    const volatility = trend === "volatile" ? 800 : 200;
    basePrice = basePrice * multiplier + (Math.random() - 0.5) * volatility;
    
    data.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      price: Math.round(basePrice * 100) / 100,
    });
  }
  
  return data;
};

const timeframes = [
  { label: "1H", days: 1 },
  { label: "24H", days: 1 },
  { label: "7D", days: 7 },
  { label: "1M", days: 30 },
  { label: "1Y", days: 365 },
];

export const PriceChart = () => {
  const [activeTimeframe, setActiveTimeframe] = useState("7D");
  const [chartData] = useState(() => generateChartData(30, "up"));
  
  const currentPrice = chartData[chartData.length - 1].price;
  const previousPrice = chartData[0].price;
  const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
  const isPositive = priceChange >= 0;

  return (
    <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/20">
              <span className="text-lg font-bold text-warning">₿</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Bitcoin</h3>
              <p className="text-sm text-muted-foreground">BTC/USD</p>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">
            ${currentPrice.toLocaleString()}
          </p>
          <p className={cn(
            "text-sm font-medium",
            isPositive ? "text-success" : "text-destructive"
          )}>
            {isPositive ? "+" : ""}{priceChange.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              dx={-10}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                padding: "12px",
              }}
              labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Price"]}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex gap-2">
        {timeframes.map((tf) => (
          <Button
            key={tf.label}
            variant={activeTimeframe === tf.label ? "accent" : "ghost"}
            size="sm"
            onClick={() => setActiveTimeframe(tf.label)}
            className="flex-1"
          >
            {tf.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  delay?: number;
}

export const PortfolioCard = ({ title, value, change, icon, delay = 0 }: PortfolioCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <div 
      className="glass rounded-2xl p-6 opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="mt-1 text-2xl font-bold text-foreground">{value}</h3>
          <div className={cn(
            "mt-2 flex items-center gap-1 text-sm font-medium",
            isPositive ? "text-success" : "text-destructive"
          )}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{isPositive ? "+" : ""}{change}%</span>
            <span className="text-muted-foreground">today</span>
          </div>
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export const PortfolioStats = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <PortfolioCard
        title="Total Balance"
        value="$124,532.89"
        change={12.5}
        icon={<Activity className="h-6 w-6" />}
        delay={0}
      />
      <PortfolioCard
        title="Stocks Value"
        value="$78,234.50"
        change={8.3}
        icon={<TrendingUp className="h-6 w-6" />}
        delay={100}
      />
      <PortfolioCard
        title="Crypto Holdings"
        value="$42,198.39"
        change={-2.1}
        icon={<TrendingDown className="h-6 w-6" />}
        delay={200}
      />
      <PortfolioCard
        title="Today's Profit"
        value="$3,847.20"
        change={24.7}
        icon={<TrendingUp className="h-6 w-6" />}
        delay={300}
      />
    </div>
  );
};

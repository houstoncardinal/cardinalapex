import { useState } from "react";
import { Bot, Zap, Shield, TrendingUp, Settings2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TradingBot {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  profit: number;
  trades: number;
}

const initialBots: TradingBot[] = [
  {
    id: "1",
    name: "Momentum Trader",
    description: "Follows market trends",
    icon: <TrendingUp className="h-5 w-5" />,
    isActive: true,
    profit: 847.32,
    trades: 24,
  },
  {
    id: "2",
    name: "DCA Bot",
    description: "Dollar cost averaging",
    icon: <Zap className="h-5 w-5" />,
    isActive: true,
    profit: 1234.56,
    trades: 156,
  },
  {
    id: "3",
    name: "Risk Manager",
    description: "Protects your portfolio",
    icon: <Shield className="h-5 w-5" />,
    isActive: false,
    profit: 0,
    trades: 0,
  },
];

export const AutoTrading = () => {
  const [bots, setBots] = useState(initialBots);
  const [masterSwitch, setMasterSwitch] = useState(true);

  const toggleBot = (id: string) => {
    setBots(bots.map(bot => 
      bot.id === id ? { ...bot, isActive: !bot.isActive } : bot
    ));
  };

  const activeBots = bots.filter(b => b.isActive).length;
  const totalProfit = bots.reduce((acc, bot) => acc + bot.profit, 0);

  return (
    <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
            masterSwitch ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
          )}>
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Auto Trading</h3>
            <p className="text-sm text-muted-foreground">
              {activeBots} of {bots.length} bots active
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Profit</p>
            <p className="text-lg font-bold text-success">+${totalProfit.toLocaleString()}</p>
          </div>
          <Switch 
            checked={masterSwitch} 
            onCheckedChange={setMasterSwitch}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>

      <div className="space-y-3">
        {bots.map((bot, index) => (
          <div 
            key={bot.id}
            className={cn(
              "flex items-center justify-between p-4 rounded-xl border transition-all opacity-0 animate-slide-in-right",
              bot.isActive && masterSwitch
                ? "border-primary/30 bg-primary/5" 
                : "border-border bg-secondary/30"
            )}
            style={{ animationDelay: `${index * 100 + 500}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                bot.isActive && masterSwitch
                  ? "bg-primary/20 text-primary" 
                  : "bg-secondary text-muted-foreground"
              )}>
                {bot.icon}
              </div>
              <div>
                <p className="font-medium text-foreground">{bot.name}</p>
                <p className="text-xs text-muted-foreground">{bot.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {bot.isActive && masterSwitch && (
                <div className="text-right">
                  <p className="text-sm font-semibold text-success">+${bot.profit}</p>
                  <p className="text-xs text-muted-foreground">{bot.trades} trades</p>
                </div>
              )}
              <Switch
                checked={bot.isActive && masterSwitch}
                onCheckedChange={() => toggleBot(bot.id)}
                disabled={!masterSwitch}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full mt-4 gap-2">
        <Settings2 className="h-4 w-4" />
        Configure Trading Strategies
      </Button>
    </div>
  );
};

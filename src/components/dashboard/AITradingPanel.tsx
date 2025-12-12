import { useState } from "react";
import { Bot, Zap, Sparkles, TrendingUp, Brain, Settings2, Play, Pause, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AIAgent {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  strategy: string;
  isActive: boolean;
  profit: number;
  trades: number;
  winRate: number;
  isAnalyzing?: boolean;
}

const initialAgents: AIAgent[] = [
  {
    id: "1",
    name: "Alpha Predator",
    description: "Aggressive momentum trading",
    icon: <TrendingUp className="h-5 w-5" />,
    strategy: "momentum",
    isActive: true,
    profit: 3847.32,
    trades: 124,
    winRate: 73.4,
  },
  {
    id: "2",
    name: "Flash Scalper",
    description: "High-frequency micro trades",
    icon: <Zap className="h-5 w-5" />,
    strategy: "scalping",
    isActive: true,
    profit: 1234.56,
    trades: 892,
    winRate: 68.2,
  },
  {
    id: "3",
    name: "Neural Swing",
    description: "AI-powered swing trades",
    icon: <Brain className="h-5 w-5" />,
    strategy: "swing",
    isActive: false,
    profit: 0,
    trades: 0,
    winRate: 0,
  },
];

export const AITradingPanel = () => {
  const [agents, setAgents] = useState(initialAgents);
  const [masterSwitch, setMasterSwitch] = useState(true);
  const [analyzingSymbol, setAnalyzingSymbol] = useState<string | null>(null);
  const { toast } = useToast();

  const toggleAgent = (id: string) => {
    setAgents(agents.map(agent => 
      agent.id === id ? { ...agent, isActive: !agent.isActive } : agent
    ));
    
    const agent = agents.find(a => a.id === id);
    if (agent) {
      toast({
        title: agent.isActive ? "Agent Paused" : "Agent Activated",
        description: agent.isActive 
          ? `${agent.name} has stopped trading`
          : `${agent.name} is now hunting for opportunities`,
      });
    }
  };

  const requestAIAnalysis = async (symbol: string = "BTC") => {
    setAnalyzingSymbol(symbol);
    
    try {
      const { data, error } = await supabase.functions.invoke("ai-trade-analysis", {
        body: { symbol, market: "crypto", action: "analyze" }
      });

      if (error) throw error;

      toast({
        title: `AI Analysis: ${symbol}`,
        description: data.analysis?.slice(0, 200) + "...",
      });
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "Failed to get AI analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzingSymbol(null);
    }
  };

  const activeAgents = agents.filter(a => a.isActive).length;
  const totalProfit = agents.reduce((acc, agent) => acc + agent.profit, 0);

  return (
    <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-all",
            masterSwitch 
              ? "bg-primary/20 text-primary glow-primary" 
              : "bg-secondary text-muted-foreground"
          )}>
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              AI Trading Agents
              {masterSwitch && (
                <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
              )}
            </h3>
            <p className="text-sm text-muted-foreground">
              {activeAgents} of {agents.length} agents active
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

      {/* AI Quick Analysis */}
      <div className="mb-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">AI Market Analysis</span>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => requestAIAnalysis("BTC")}
            disabled={analyzingSymbol !== null}
            className="text-xs"
          >
            {analyzingSymbol ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-3 w-3 mr-1" />
                Analyze BTC
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {agents.map((agent, index) => (
          <div 
            key={agent.id}
            className={cn(
              "flex items-center justify-between p-4 rounded-xl border transition-all opacity-0 animate-slide-in-right",
              agent.isActive && masterSwitch
                ? "border-primary/30 bg-primary/5" 
                : "border-border bg-secondary/30"
            )}
            style={{ animationDelay: `${index * 100 + 500}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-all",
                agent.isActive && masterSwitch
                  ? "bg-primary/20 text-primary" 
                  : "bg-secondary text-muted-foreground"
              )}>
                {agent.icon}
              </div>
              <div>
                <p className="font-medium text-foreground flex items-center gap-2">
                  {agent.name}
                  {agent.isActive && masterSwitch && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/20 text-success font-medium">
                      LIVE
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{agent.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {agent.isActive && masterSwitch && (
                <div className="text-right">
                  <p className="text-sm font-semibold text-success">+${agent.profit.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {agent.trades} trades • {agent.winRate}% win
                  </p>
                </div>
              )}
              <Button
                size="icon"
                variant={agent.isActive && masterSwitch ? "default" : "outline"}
                onClick={() => toggleAgent(agent.id)}
                disabled={!masterSwitch}
                className="h-8 w-8"
              >
                {agent.isActive && masterSwitch ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full mt-4 gap-2">
        <Settings2 className="h-4 w-4" />
        Configure AI Strategies
      </Button>
    </div>
  );
};

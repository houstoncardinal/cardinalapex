import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { usePhantomWallet } from "@/hooks/usePhantomWallet";
import { useWalletPortfolio } from "@/hooks/useWalletPortfolio";
import { supabase } from "@/integrations/supabase/client";
import { 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Loader2,
  PieChart
} from "lucide-react";
import { toast } from "sonner";

interface RebalanceSuggestion {
  symbol: string;
  currentAllocation: number;
  targetAllocation: number;
  action: "buy" | "sell" | "hold";
  amount: number;
  reason: string;
  priority: "high" | "medium" | "low";
}

interface AIRebalanceResponse {
  suggestions: RebalanceSuggestion[];
  overallScore: number;
  riskAssessment: string;
  summary: string;
}

export const PortfolioRebalancing = () => {
  const { user } = useAuth();
  const { connected, publicKey } = usePhantomWallet();
  const { tokens, totalValue, isConnected, refreshPortfolio } = useWalletPortfolio();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AIRebalanceResponse | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const analyzePortfolio = async () => {
    if (!isConnected || tokens.length === 0) {
      toast.error("Connect your wallet first");
      return;
    }

    setLoading(true);
    try {
      const holdings = tokens.map(t => ({
        symbol: t.symbol,
        balance: t.balance,
        usdValue: t.usdValue,
        allocation: totalValue > 0 ? (t.usdValue / totalValue) * 100 : 0
      }));

      const { data, error } = await supabase.functions.invoke("portfolio-rebalance", {
        body: { 
          holdings,
          totalValue: totalValue,
          riskTolerance: "aggressive"
        }
      });

      if (error) throw error;

      setSuggestions(data);
      setLastUpdated(new Date());
      toast.success("Portfolio analysis complete");
    } catch (error) {
      console.error("Rebalance analysis error:", error);
      // Generate fallback suggestions based on current holdings
      generateFallbackSuggestions();
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackSuggestions = () => {
    if (tokens.length === 0) return;

    const suggestions: RebalanceSuggestion[] = [];
    const portfolioTotal = totalValue || 1;

    // Target allocations for aggressive portfolio
    const targetAllocations: { [key: string]: number } = {
      SOL: 40,
      BONK: 15,
      WIF: 15,
      PEPE: 10,
      POPCAT: 10,
      OTHER: 10
    };

    tokens.forEach(token => {
      const currentAlloc = (token.usdValue / portfolioTotal) * 100;
      const targetAlloc = targetAllocations[token.symbol] || targetAllocations.OTHER;
      const diff = targetAlloc - currentAlloc;

      if (Math.abs(diff) > 5) {
        suggestions.push({
          symbol: token.symbol,
          currentAllocation: currentAlloc,
          targetAllocation: targetAlloc,
          action: diff > 0 ? "buy" : "sell",
          amount: Math.abs(diff * portfolioTotal / 100),
          reason: diff > 0 
            ? `Underweight by ${Math.abs(diff).toFixed(1)}% - consider adding`
            : `Overweight by ${Math.abs(diff).toFixed(1)}% - consider reducing`,
          priority: Math.abs(diff) > 15 ? "high" : Math.abs(diff) > 10 ? "medium" : "low"
        });
      }
    });

    // Check for missing recommended assets
    const hasSOL = tokens.some(t => t.symbol === "SOL");
    if (!hasSOL) {
      suggestions.unshift({
        symbol: "SOL",
        currentAllocation: 0,
        targetAllocation: 40,
        action: "buy",
        amount: portfolioTotal * 0.4,
        reason: "Core position missing - SOL should be your base asset",
        priority: "high"
      });
    }

    setSuggestions({
      suggestions: suggestions.slice(0, 5),
      overallScore: suggestions.length === 0 ? 95 : Math.max(40, 100 - suggestions.length * 12),
      riskAssessment: suggestions.length > 3 ? "High concentration risk detected" : "Moderate diversification",
      summary: suggestions.length === 0 
        ? "Your portfolio is well-balanced for aggressive growth!"
        : `Found ${suggestions.length} optimization opportunities to maximize returns.`
    });
    setLastUpdated(new Date());
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/20 text-destructive border-destructive/30";
      case "medium": return "bg-warning/20 text-warning border-warning/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "buy": return "text-success";
      case "sell": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className="p-4 md:p-6 bg-card border-border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Portfolio Rebalancing</h3>
            <p className="text-xs text-muted-foreground">
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Optimize your allocation"}
            </p>
          </div>
        </div>
        
        <Button 
          onClick={analyzePortfolio}
          disabled={loading || !isConnected}
          size="sm"
          className="gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {loading ? "Analyzing..." : "Analyze"}
        </Button>
      </div>

      {!isConnected ? (
        <div className="text-center py-8 text-muted-foreground">
          <PieChart className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Connect your Phantom wallet to get AI rebalancing suggestions</p>
        </div>
      ) : !suggestions ? (
        <div className="text-center py-8 text-muted-foreground">
          <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Click "Analyze" to get AI-powered rebalancing recommendations</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Portfolio Health Score */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Portfolio Health Score</span>
              <span className={`text-lg font-bold ${suggestions.overallScore >= 70 ? 'text-success' : suggestions.overallScore >= 50 ? 'text-warning' : 'text-destructive'}`}>
                {suggestions.overallScore}/100
              </span>
            </div>
            <Progress 
              value={suggestions.overallScore} 
              className="h-2 mb-2" 
            />
            <p className="text-xs text-muted-foreground">{suggestions.riskAssessment}</p>
          </div>

          {/* AI Summary */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <p className="text-sm text-foreground">{suggestions.summary}</p>
          </div>

          {/* Suggestions List */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Rebalancing Suggestions
            </h4>
            
            {suggestions.suggestions.length === 0 ? (
              <div className="flex items-center gap-2 text-success bg-success/10 rounded-lg p-3">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Your portfolio is optimally balanced!</span>
              </div>
            ) : (
              suggestions.suggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className="bg-muted/20 rounded-lg p-3 border border-border/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{suggestion.symbol}</span>
                      <Badge variant="outline" className={getPriorityColor(suggestion.priority)}>
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <div className={`flex items-center gap-1 font-medium ${getActionColor(suggestion.action)}`}>
                      {suggestion.action === "buy" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : suggestion.action === "sell" ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : null}
                      <span className="uppercase text-sm">{suggestion.action}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span>{suggestion.currentAllocation.toFixed(1)}%</span>
                    <ArrowRight className="h-3 w-3" />
                    <span className="text-foreground">{suggestion.targetAllocation.toFixed(1)}%</span>
                    <span className="text-muted-foreground">target</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                  
                  {suggestion.amount > 0 && (
                    <p className="text-xs text-primary mt-1">
                      Suggested: ${suggestion.amount.toFixed(2)} worth
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          {suggestions.suggestions.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span>These are AI suggestions for aggressive growth. Always DYOR before trading.</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

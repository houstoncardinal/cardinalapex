import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, TrendingUp, PieChart, Target, Activity } from 'lucide-react';
import { useWalletPortfolio } from '@/hooks/useWalletPortfolio';

interface RiskMetrics {
  overallRisk: number;
  diversificationScore: number;
  volatilityScore: number;
  concentrationRisk: number;
  correlationRisk: number;
}

interface ExposureBreakdown {
  category: string;
  percentage: number;
  value: number;
  risk: 'low' | 'medium' | 'high';
}

export const PortfolioRiskAnalyzer = () => {
  const { tokens, totalValue } = useWalletPortfolio();
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>({
    overallRisk: 0,
    diversificationScore: 0,
    volatilityScore: 0,
    concentrationRisk: 0,
    correlationRisk: 0
  });
  const [exposures, setExposures] = useState<ExposureBreakdown[]>([]);

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      analyzeRisk();
    }
  }, [tokens, totalValue]);

  const analyzeRisk = () => {
    if (!tokens || tokens.length === 0 || totalValue === 0) return;

    // Calculate concentration risk (Herfindahl index)
    const concentrations = tokens.map(t => (t.usdValue / totalValue) ** 2);
    const herfindahl = concentrations.reduce((a, b) => a + b, 0);
    const concentrationRisk = Math.min(herfindahl * 100, 100);

    // Diversification score (inverse of concentration)
    const diversificationScore = Math.max(0, 100 - concentrationRisk);

    // Volatility score based on token types
    const memeCoins = ['PEPE', 'SHIB', 'FLOKI', 'DOGE', 'MEME', 'MYRO', 'POPCAT', 'MEW', 'BOME'];
    const memeExposure = tokens
      .filter(t => memeCoins.includes(t.symbol))
      .reduce((sum, t) => sum + t.usdValue, 0);
    const volatilityScore = Math.min((memeExposure / totalValue) * 150, 100);

    // Correlation risk (simplified - assumes high correlation among similar assets)
    const correlationRisk = Math.min(50 + (tokens.length < 5 ? 30 : 0), 100);

    // Overall risk
    const overallRisk = (concentrationRisk * 0.3 + volatilityScore * 0.4 + correlationRisk * 0.3);

    setRiskMetrics({
      overallRisk,
      diversificationScore,
      volatilityScore,
      concentrationRisk,
      correlationRisk
    });

    // Build exposure breakdown
    const stablecoins = ['USDC', 'USDT', 'DAI', 'BUSD'];
    const blueChips = ['SOL', 'BTC', 'ETH', 'WBTC', 'WETH'];

    const stableValue = tokens.filter(t => stablecoins.includes(t.symbol)).reduce((s, t) => s + t.usdValue, 0);
    const blueChipValue = tokens.filter(t => blueChips.includes(t.symbol)).reduce((s, t) => s + t.usdValue, 0);
    const memeValue = tokens.filter(t => memeCoins.includes(t.symbol)).reduce((s, t) => s + t.usdValue, 0);
    const otherValue = totalValue - stableValue - blueChipValue - memeValue;

    setExposures([
      { category: 'Stablecoins', percentage: (stableValue / totalValue) * 100, value: stableValue, risk: 'low' as const },
      { category: 'Blue Chips', percentage: (blueChipValue / totalValue) * 100, value: blueChipValue, risk: 'medium' as const },
      { category: 'Meme Coins', percentage: (memeValue / totalValue) * 100, value: memeValue, risk: 'high' as const },
      { category: 'Other Tokens', percentage: (otherValue / totalValue) * 100, value: otherValue, risk: 'medium' as const }
    ].filter(e => e.percentage > 0));
  };

  const getRiskColor = (risk: number) => {
    if (risk < 30) return 'text-green-400';
    if (risk < 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskLabel = (risk: number) => {
    if (risk < 30) return 'Low';
    if (risk < 60) return 'Medium';
    return 'High';
  };

  const getBadgeVariant = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Portfolio Risk Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Risk Score */}
        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Overall Risk Score</span>
            <span className={`text-2xl font-bold ${getRiskColor(riskMetrics.overallRisk)}`}>
              {riskMetrics.overallRisk.toFixed(0)}/100
            </span>
          </div>
          <Progress value={riskMetrics.overallRisk} className="h-2" />
          <div className="flex items-center justify-between mt-2">
            <Badge variant={riskMetrics.overallRisk < 30 ? 'default' : riskMetrics.overallRisk < 60 ? 'secondary' : 'destructive'}>
              {getRiskLabel(riskMetrics.overallRisk)} Risk
            </Badge>
            {riskMetrics.overallRisk > 60 && (
              <div className="flex items-center gap-1 text-yellow-400 text-xs">
                <AlertTriangle className="w-3 h-3" />
                Consider rebalancing
              </div>
            )}
          </div>
        </div>

        {/* Risk Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <PieChart className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">Diversification</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-lg font-bold ${getRiskColor(100 - riskMetrics.diversificationScore)}`}>
                {riskMetrics.diversificationScore.toFixed(0)}%
              </span>
              <Progress value={riskMetrics.diversificationScore} className="w-16 h-1.5" />
            </div>
          </div>

          <div className="p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-muted-foreground">Volatility</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-lg font-bold ${getRiskColor(riskMetrics.volatilityScore)}`}>
                {riskMetrics.volatilityScore.toFixed(0)}%
              </span>
              <Progress value={riskMetrics.volatilityScore} className="w-16 h-1.5" />
            </div>
          </div>

          <div className="p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-muted-foreground">Concentration</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-lg font-bold ${getRiskColor(riskMetrics.concentrationRisk)}`}>
                {riskMetrics.concentrationRisk.toFixed(0)}%
              </span>
              <Progress value={riskMetrics.concentrationRisk} className="w-16 h-1.5" />
            </div>
          </div>

          <div className="p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-muted-foreground">Correlation</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-lg font-bold ${getRiskColor(riskMetrics.correlationRisk)}`}>
                {riskMetrics.correlationRisk.toFixed(0)}%
              </span>
              <Progress value={riskMetrics.correlationRisk} className="w-16 h-1.5" />
            </div>
          </div>
        </div>

        {/* Exposure Breakdown */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Exposure Breakdown</h4>
          {exposures.length > 0 ? (
            exposures.map((exposure, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground">{exposure.category}</span>
                  <Badge variant={getBadgeVariant(exposure.risk)} className="text-xs">
                    {exposure.risk}
                  </Badge>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-foreground">
                    {exposure.percentage.toFixed(1)}%
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ${exposure.value.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Connect wallet to analyze portfolio risk
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

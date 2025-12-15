import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, AlertTriangle, DollarSign, Percent, Target } from 'lucide-react';

export const PositionSizer = () => {
  const [accountBalance, setAccountBalance] = useState<string>('10000');
  const [riskPercent, setRiskPercent] = useState<number>(2);
  const [entryPrice, setEntryPrice] = useState<string>('100');
  const [stopLossPrice, setStopLossPrice] = useState<string>('95');
  const [takeProfitPrice, setTakeProfitPrice] = useState<string>('115');
  const [leverage, setLeverage] = useState<string>('1');

  const calculations = useMemo(() => {
    const balance = parseFloat(accountBalance) || 0;
    const entry = parseFloat(entryPrice) || 0;
    const stopLoss = parseFloat(stopLossPrice) || 0;
    const takeProfit = parseFloat(takeProfitPrice) || 0;
    const lev = parseFloat(leverage) || 1;

    if (!balance || !entry || !stopLoss) {
      return null;
    }

    const riskAmount = balance * (riskPercent / 100);
    const stopLossDistance = Math.abs(entry - stopLoss);
    const stopLossPercent = (stopLossDistance / entry) * 100;
    
    // Position size calculation
    const riskPerUnit = stopLossDistance;
    const positionSize = riskPerUnit > 0 ? riskAmount / riskPerUnit : 0;
    const positionValue = positionSize * entry;
    const leveragedPosition = positionValue * lev;

    // Take profit calculations
    const takeProfitDistance = Math.abs(takeProfit - entry);
    const potentialProfit = positionSize * takeProfitDistance;
    const riskRewardRatio = stopLossDistance > 0 ? takeProfitDistance / stopLossDistance : 0;

    // Kelly Criterion (simplified)
    const winRate = 0.55; // Assumed 55% win rate
    const kellyCriterion = ((winRate * riskRewardRatio) - (1 - winRate)) / riskRewardRatio;
    const kellyPercent = Math.max(0, Math.min(kellyCriterion * 100, 25));

    return {
      riskAmount,
      positionSize: positionSize.toFixed(4),
      positionValue: positionValue.toFixed(2),
      leveragedPosition: leveragedPosition.toFixed(2),
      stopLossPercent: stopLossPercent.toFixed(2),
      potentialProfit: potentialProfit.toFixed(2),
      riskRewardRatio: riskRewardRatio.toFixed(2),
      kellyPercent: kellyPercent.toFixed(1),
      maxLoss: riskAmount.toFixed(2),
      breakEvenTrades: riskRewardRatio > 0 ? Math.ceil(1 / riskRewardRatio) : 0
    };
  }, [accountBalance, riskPercent, entryPrice, stopLossPrice, takeProfitPrice, leverage]);

  const riskLevel = riskPercent <= 1 ? 'Conservative' : riskPercent <= 2 ? 'Moderate' : riskPercent <= 5 ? 'Aggressive' : 'Very Risky';
  const riskColor = riskPercent <= 1 ? 'text-green-400' : riskPercent <= 2 ? 'text-yellow-400' : riskPercent <= 5 ? 'text-orange-400' : 'text-red-400';

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Position Sizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Account Balance */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            Account Balance
          </Label>
          <Input
            type="number"
            value={accountBalance}
            onChange={(e) => setAccountBalance(e.target.value)}
            placeholder="10000"
            className="h-9"
          />
        </div>

        {/* Risk Percentage Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground flex items-center gap-1">
              <Percent className="w-3 h-3" />
              Risk per Trade
            </Label>
            <span className={`text-sm font-bold ${riskColor}`}>
              {riskPercent}% - {riskLevel}
            </span>
          </div>
          <Slider
            value={[riskPercent]}
            onValueChange={([v]) => setRiskPercent(v)}
            min={0.5}
            max={10}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.5%</span>
            <span>10%</span>
          </div>
        </div>

        {/* Price Inputs */}
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Entry Price</Label>
            <Input
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-red-400">Stop Loss</Label>
            <Input
              type="number"
              value={stopLossPrice}
              onChange={(e) => setStopLossPrice(e.target.value)}
              className="h-8 text-sm border-red-500/30"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-green-400">Take Profit</Label>
            <Input
              type="number"
              value={takeProfitPrice}
              onChange={(e) => setTakeProfitPrice(e.target.value)}
              className="h-8 text-sm border-green-500/30"
            />
          </div>
        </div>

        {/* Leverage */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Leverage</Label>
          <Select value={leverage} onValueChange={setLeverage}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1x (Spot)</SelectItem>
              <SelectItem value="2">2x</SelectItem>
              <SelectItem value="3">3x</SelectItem>
              <SelectItem value="5">5x</SelectItem>
              <SelectItem value="10">10x</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {calculations && (
          <div className="space-y-3 pt-2 border-t border-border">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-1">
              <Target className="w-4 h-4 text-primary" />
              Calculated Position
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">Position Size</p>
                <p className="text-lg font-bold text-foreground">{calculations.positionSize}</p>
                <p className="text-xs text-muted-foreground">units</p>
              </div>
              <div className="p-2 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">Position Value</p>
                <p className="text-lg font-bold text-foreground">${calculations.positionValue}</p>
                {parseFloat(leverage) > 1 && (
                  <p className="text-xs text-primary">${calculations.leveragedPosition} w/ leverage</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <p className="text-xs text-muted-foreground">Max Loss</p>
                <p className="text-sm font-bold text-red-400">-${calculations.maxLoss}</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <p className="text-xs text-muted-foreground">Potential Gain</p>
                <p className="text-sm font-bold text-green-400">+${calculations.potentialProfit}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <p className="text-xs text-muted-foreground">R:R Ratio</p>
                <p className="text-sm font-bold text-primary">{calculations.riskRewardRatio}:1</p>
              </div>
            </div>

            {/* Kelly Criterion */}
            <div className="p-2 bg-muted/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Kelly Criterion Suggests</span>
                <Badge variant="outline">{calculations.kellyPercent}% of balance</Badge>
              </div>
            </div>

            {/* Warning */}
            {riskPercent > 5 && (
              <div className="flex items-start gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-xs text-red-400">
                  Risk over 5% per trade is extremely dangerous. Consider reducing your position size.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

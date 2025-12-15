import { useState, useEffect } from 'react';
import { ArrowRight, Loader2, Route, AlertTriangle, CheckCircle, Droplets, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { TOKEN_INFO } from '@/hooks/useSolanaTrading';

interface RouteStep {
  label: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  percent: number;
}

interface SwapRoute {
  inputToken: string;
  outputToken: string;
  inputAmount: number;
  outputAmount: number;
  priceImpact: number;
  routeSteps: RouteStep[];
  liquiditySources: { name: string; percent: number }[];
}

interface SwapRouteVisualizationProps {
  inputToken: string;
  outputToken: string;
  amount: number;
  onRouteLoaded?: (route: SwapRoute | null) => void;
}

const JUPITER_API = 'https://quote-api.jup.ag/v6';

const TOKEN_MINTS: Record<string, string> = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  WIF: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
  PEPE: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  POPCAT: 'PopCATthpJSyvp6LbN6M24gUoqVMrdNCqRY4Rh5oUpw',
  MEW: 'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5',
  BOME: 'BOMEjuRpVNdAPfgxWe8L5sN2UF2rhUGv7yGcMFaeDgXi',
};

export const SwapRouteVisualization = ({ inputToken, outputToken, amount, onRouteLoaded }: SwapRouteVisualizationProps) => {
  const [route, setRoute] = useState<SwapRoute | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!inputToken || !outputToken || !amount || amount <= 0) {
        setRoute(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const inputMint = TOKEN_MINTS[inputToken] || TOKEN_MINTS.SOL;
        const outputMint = TOKEN_MINTS[outputToken] || TOKEN_MINTS.SOL;
        const amountInLamports = Math.floor(amount * 1e9);

        const response = await fetch(
          `${JUPITER_API}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountInLamports}&slippageBps=100`
        );

        if (!response.ok) throw new Error('Failed to fetch route');

        const data = await response.json();

        if (data.error) throw new Error(data.error);

        // Parse route plan
        const routeSteps: RouteStep[] = data.routePlan?.map((step: any) => ({
          label: step.swapInfo?.label || 'Unknown',
          inputMint: step.swapInfo?.inputMint || '',
          outputMint: step.swapInfo?.outputMint || '',
          inAmount: step.swapInfo?.inAmount || '0',
          outAmount: step.swapInfo?.outAmount || '0',
          percent: step.percent || 100,
        })) || [];

        // Aggregate liquidity sources
        const sourceCounts: Record<string, number> = {};
        routeSteps.forEach(step => {
          sourceCounts[step.label] = (sourceCounts[step.label] || 0) + step.percent;
        });

        const liquiditySources = Object.entries(sourceCounts).map(([name, percent]) => ({
          name,
          percent: percent / routeSteps.length,
        }));

        const routeData: SwapRoute = {
          inputToken,
          outputToken,
          inputAmount: parseInt(data.inAmount) / 1e9,
          outputAmount: parseInt(data.outAmount) / 1e9,
          priceImpact: parseFloat(data.priceImpactPct) || 0,
          routeSteps,
          liquiditySources,
        };

        setRoute(routeData);
        onRouteLoaded?.(routeData);
      } catch (err: any) {
        console.error('Route fetch error:', err);
        setError(err.message || 'Failed to fetch route');
        setRoute(null);
        onRouteLoaded?.(null);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchRoute, 500);
    return () => clearTimeout(debounce);
  }, [inputToken, outputToken, amount, onRouteLoaded]);

  if (loading) {
    return (
      <div className="glass rounded-xl p-4 border border-border">
        <div className="flex items-center justify-center gap-2 py-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Finding best route...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-xl p-4 border border-destructive/50">
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (!route) return null;

  const priceImpactColor = route.priceImpact < 1 ? 'text-success' : route.priceImpact < 3 ? 'text-warning' : 'text-destructive';
  const priceImpactBg = route.priceImpact < 1 ? 'bg-success/20' : route.priceImpact < 3 ? 'bg-warning/20' : 'bg-destructive/20';

  return (
    <div className="glass rounded-xl p-4 border border-border space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
            <Route className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground">Swap Route</span>
        </div>
        <Badge variant="outline" className={cn(priceImpactBg, priceImpactColor, 'border-0')}>
          <Zap className="h-3 w-3 mr-1" />
          {route.priceImpact.toFixed(3)}% impact
        </Badge>
      </div>

      {/* Route Flow */}
      <div className="flex items-center justify-between bg-secondary/30 rounded-lg p-3">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">You Pay</div>
          <div className="font-bold text-foreground">{route.inputAmount.toFixed(4)}</div>
          <div className="text-xs text-primary">{route.inputToken}</div>
        </div>
        
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="flex items-center gap-1">
            {route.routeSteps.slice(0, 3).map((step, i) => (
              <div key={i} className="flex items-center">
                <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                  {step.label}
                </Badge>
                {i < Math.min(route.routeSteps.length - 1, 2) && (
                  <ArrowRight className="h-3 w-3 text-muted-foreground mx-1" />
                )}
              </div>
            ))}
            {route.routeSteps.length > 3 && (
              <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                +{route.routeSteps.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">You Receive</div>
          <div className="font-bold text-success">{route.outputAmount.toFixed(4)}</div>
          <div className="text-xs text-primary">{route.outputToken}</div>
        </div>
      </div>

      {/* Liquidity Sources */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Droplets className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Liquidity Sources</span>
        </div>
        <div className="space-y-2">
          {route.liquiditySources.slice(0, 4).map((source, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-foreground w-20 truncate">{source.name}</span>
              <div className="flex-1">
                <Progress value={source.percent} className="h-2" />
              </div>
              <span className="text-xs text-muted-foreground w-12 text-right">
                {source.percent.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rate Info */}
      <div className="flex items-center justify-between text-xs border-t border-border pt-3">
        <span className="text-muted-foreground">Rate</span>
        <span className="text-foreground font-mono">
          1 {route.inputToken} = {(route.outputAmount / route.inputAmount).toFixed(6)} {route.outputToken}
        </span>
      </div>

      {/* Low Impact Indicator */}
      {route.priceImpact < 1 && (
        <div className="flex items-center gap-2 text-success text-xs">
          <CheckCircle className="h-3 w-3" />
          <span>Low price impact - Good trade!</span>
        </div>
      )}
    </div>
  );
};
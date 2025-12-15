import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Grid3X3, Info, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface CorrelationData {
  assets: string[];
  matrix: number[][];
}

const ASSET_SETS = {
  'major': ['SOL', 'BTC', 'ETH', 'BNB'],
  'solana': ['SOL', 'RAY', 'JTO', 'PYTH'],
  'meme': ['BONK', 'WIF', 'PEPE', 'DOGE']
};

export const CorrelationMatrix = () => {
  const [assetSet, setAssetSet] = useState<'major' | 'solana' | 'meme'>('major');
  const [isLoading, setIsLoading] = useState(false);
  const [correlationData, setCorrelationData] = useState<CorrelationData>({
    assets: ['SOL', 'BTC', 'ETH', 'BNB'],
    matrix: [
      [1.00, 0.85, 0.82, 0.78],
      [0.85, 1.00, 0.92, 0.75],
      [0.82, 0.92, 1.00, 0.70],
      [0.78, 0.75, 0.70, 1.00]
    ]
  });

  useEffect(() => {
    generateCorrelation();
  }, [assetSet]);

  const generateCorrelation = () => {
    setIsLoading(true);
    const assets = ASSET_SETS[assetSet];
    const n = assets.length;
    const matrix: number[][] = [];

    for (let i = 0; i < n; i++) {
      matrix[i] = [];
      for (let j = 0; j < n; j++) {
        if (i === j) {
          matrix[i][j] = 1.00;
        } else if (j < i) {
          matrix[i][j] = matrix[j][i];
        } else {
          // Generate realistic correlations
          const base = assetSet === 'meme' ? 0.6 : 0.7;
          const variance = assetSet === 'meme' ? 0.3 : 0.2;
          matrix[i][j] = Math.round((base + Math.random() * variance) * 100) / 100;
        }
      }
    }

    setTimeout(() => {
      setCorrelationData({ assets, matrix });
      setIsLoading(false);
    }, 300);
  };

  const getCorrelationColor = (value: number) => {
    if (value === 1) return 'bg-primary/80';
    if (value >= 0.8) return 'bg-red-500/70';
    if (value >= 0.6) return 'bg-orange-500/60';
    if (value >= 0.4) return 'bg-yellow-500/50';
    if (value >= 0.2) return 'bg-green-500/40';
    return 'bg-blue-500/30';
  };

  const getCorrelationLabel = (value: number) => {
    if (value === 1) return 'Perfect';
    if (value >= 0.8) return 'Very High';
    if (value >= 0.6) return 'High';
    if (value >= 0.4) return 'Moderate';
    if (value >= 0.2) return 'Low';
    return 'Very Low';
  };

  const diversificationScore = useMemo(() => {
    const n = correlationData.matrix.length;
    let totalCorr = 0;
    let count = 0;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        totalCorr += correlationData.matrix[i][j];
        count++;
      }
    }

    const avgCorr = count > 0 ? totalCorr / count : 0;
    return Math.round((1 - avgCorr) * 100);
  }, [correlationData]);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-primary" />
            Correlation Matrix
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={assetSet} onValueChange={(v) => setAssetSet(v as typeof assetSet)}>
              <SelectTrigger className="h-8 w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="major">Major</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="meme">Meme</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={generateCorrelation} className="h-8 w-8 p-0">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Diversification Score */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Diversification Score</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Higher = more diversified portfolio</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Badge variant={diversificationScore > 30 ? 'default' : 'destructive'}>
            {diversificationScore}%
          </Badge>
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-1 text-xs text-muted-foreground"></th>
                {correlationData.assets.map(asset => (
                  <th key={asset} className="p-1 text-xs text-center text-foreground font-medium">
                    {asset}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {correlationData.assets.map((rowAsset, i) => (
                <tr key={rowAsset}>
                  <td className="p-1 text-xs text-foreground font-medium">{rowAsset}</td>
                  {correlationData.matrix[i].map((value, j) => (
                    <td key={j} className="p-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`w-full aspect-square min-w-[40px] rounded flex items-center justify-center text-xs font-medium text-white cursor-pointer transition-transform hover:scale-105 ${getCorrelationColor(value)}`}
                            >
                              {value.toFixed(2)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              {correlationData.assets[i]} / {correlationData.assets[j]}: {getCorrelationLabel(value)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-500/70" />
            <span className="text-muted-foreground">High (&gt;0.8)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-500/50" />
            <span className="text-muted-foreground">Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500/40" />
            <span className="text-muted-foreground">Low (&lt;0.4)</span>
          </div>
        </div>

        {/* Insights */}
        <div className="p-3 bg-muted/20 rounded-lg">
          <h4 className="text-xs font-medium text-foreground mb-2">Insights</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            {diversificationScore < 30 && (
              <li>⚠️ High correlation detected - consider diversifying</li>
            )}
            {diversificationScore >= 30 && diversificationScore < 50 && (
              <li>✓ Moderate diversification - room for improvement</li>
            )}
            {diversificationScore >= 50 && (
              <li>✅ Good diversification across selected assets</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

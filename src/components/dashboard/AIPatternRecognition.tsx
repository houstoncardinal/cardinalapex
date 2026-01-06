import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown,
  Target,
  Zap,
  Eye,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Activity
} from 'lucide-react';

interface ChartPattern {
  id: string;
  name: string;
  type: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  priceTarget: number;
  stopLoss: number;
  currentPrice: number;
  timeframe: string;
  status: 'forming' | 'confirmed' | 'invalidated';
  description: string;
  points: { x: number; y: number; label: string }[];
  timestamp: Date;
}

interface PricePoint {
  time: string;
  price: number;
  volume: number;
}

const patternDefinitions = [
  {
    name: 'Head & Shoulders',
    type: 'bearish' as const,
    description: 'Classic reversal pattern with three peaks. Center peak (head) higher than shoulders. Neckline break confirms bearish target.',
  },
  {
    name: 'Inverse Head & Shoulders',
    type: 'bullish' as const,
    description: 'Bullish reversal at bottoms. Three troughs with middle being lowest. Break above neckline triggers measured move target.',
  },
  {
    name: 'Cup & Handle',
    type: 'bullish' as const,
    description: 'U-shaped consolidation followed by slight pullback handle. Breakout above handle resistance targets cup depth projection.',
  },
  {
    name: 'Double Top',
    type: 'bearish' as const,
    description: 'M-pattern reversal. Two peaks at similar levels with support break. Target equals pattern height subtracted from neckline.',
  },
  {
    name: 'Double Bottom',
    type: 'bullish' as const,
    description: 'W-pattern reversal. Two troughs at similar levels. Break above resistance projects pattern height upward.',
  },
  {
    name: 'Bull Flag',
    type: 'bullish' as const,
    description: 'Continuation pattern after strong move up. Parallel channel pullback followed by breakout continuation to flagpole target.',
  },
  {
    name: 'Bear Flag',
    type: 'bearish' as const,
    description: 'Continuation pattern after strong move down. Parallel channel rally followed by breakdown to flagpole projection.',
  },
  {
    name: 'Ascending Wedge',
    type: 'bearish' as const,
    description: 'Rising wedge with converging trendlines. Typically breaks down. Target measured from wedge height at breakdown point.',
  },
  {
    name: 'Descending Wedge',
    type: 'bullish' as const,
    description: 'Falling wedge with converging lines. Usually breaks up. Target equals wedge height added to breakout level.',
  },
  {
    name: 'Triple Bottom',
    type: 'bullish' as const,
    description: 'Three tests of support level holding. Strong bullish reversal when resistance breaks. High probability pattern.',
  },
  {
    name: 'Symmetrical Triangle',
    type: 'neutral' as const,
    description: 'Converging trendlines showing indecision. Breaks in direction of prior trend 75% of time. Wait for confirmation.',
  },
  {
    name: 'Ascending Triangle',
    type: 'bullish' as const,
    description: 'Flat resistance with rising lows. High probability bullish breakout. Target equals triangle height from resistance.',
  },
];

const generatePriceData = (): PricePoint[] => {
  const data: PricePoint[] = [];
  let price = 170 + Math.random() * 20;
  
  for (let i = 0; i < 50; i++) {
    price += (Math.random() - 0.48) * 3;
    data.push({
      time: `${i}`,
      price: Math.round(price * 100) / 100,
      volume: Math.floor(Math.random() * 10000) + 5000,
    });
  }
  
  return data;
};

const generatePattern = (): ChartPattern => {
  const def = patternDefinitions[Math.floor(Math.random() * patternDefinitions.length)];
  const currentPrice = 170 + Math.random() * 20;
  const direction = def.type === 'bullish' ? 1 : def.type === 'bearish' ? -1 : Math.random() > 0.5 ? 1 : -1;
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: def.name,
    type: def.type,
    confidence: Math.floor(Math.random() * 25) + 75,
    priceTarget: Math.round((currentPrice * (1 + direction * (0.05 + Math.random() * 0.15))) * 100) / 100,
    stopLoss: Math.round((currentPrice * (1 - direction * (0.02 + Math.random() * 0.03))) * 100) / 100,
    currentPrice: Math.round(currentPrice * 100) / 100,
    timeframe: ['1H', '4H', '1D', '1W'][Math.floor(Math.random() * 4)],
    status: ['forming', 'confirmed', 'forming'][Math.floor(Math.random() * 3)] as 'forming' | 'confirmed',
    description: def.description,
    points: [],
    timestamp: new Date(),
  };
};

const PatternCard = ({ pattern, onSelect }: { pattern: ChartPattern; onSelect: () => void }) => {
  const typeStyles = {
    bullish: { bg: 'bg-chart-green/10', border: 'border-chart-green/30', text: 'text-chart-green', icon: TrendingUp },
    bearish: { bg: 'bg-destructive/10', border: 'border-destructive/30', text: 'text-destructive', icon: TrendingDown },
    neutral: { bg: 'bg-chart-yellow/10', border: 'border-chart-yellow/30', text: 'text-chart-yellow', icon: Activity },
  };
  
  const styles = typeStyles[pattern.type];
  const Icon = styles.icon;
  const isNew = Date.now() - pattern.timestamp.getTime() < 10000;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onClick={onSelect}
      className={`p-4 rounded-xl border ${styles.border} ${styles.bg} cursor-pointer hover:border-primary/50 transition-all`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${styles.bg} border ${styles.border}`}>
            <Icon className={`h-5 w-5 ${styles.text}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">{pattern.name}</span>
              {isNew && (
                <Badge className="bg-primary/20 text-primary text-[10px] animate-pulse">NEW</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className="text-[10px]">{pattern.timeframe}</Badge>
              <Badge 
                variant="outline" 
                className={`text-[10px] ${pattern.status === 'confirmed' ? 'border-chart-green/50 text-chart-green' : 'border-chart-yellow/50 text-chart-yellow'}`}
              >
                {pattern.status === 'confirmed' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                {pattern.status}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1">
            <Brain className="h-3 w-3 text-chart-purple" />
            <span className="text-sm font-bold text-foreground">{pattern.confidence}%</span>
          </div>
          <span className="text-[10px] text-muted-foreground">AI Confidence</span>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-3">
        <Progress value={pattern.confidence} className="h-1.5" />
      </div>

      {/* Price Targets */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
        <div className="p-2 rounded-lg bg-secondary/50">
          <p className="text-muted-foreground">Current</p>
          <p className="font-semibold text-foreground">${pattern.currentPrice}</p>
        </div>
        <div className="p-2 rounded-lg bg-chart-green/10">
          <p className="text-muted-foreground">Target</p>
          <p className="font-semibold text-chart-green">${pattern.priceTarget}</p>
        </div>
        <div className="p-2 rounded-lg bg-destructive/10">
          <p className="text-muted-foreground">Stop Loss</p>
          <p className="font-semibold text-destructive">${pattern.stopLoss}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2">{pattern.description}</p>
    </motion.div>
  );
};

const AIPatternRecognition = () => {
  const [patterns, setPatterns] = useState<ChartPattern[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<ChartPattern | null>(null);
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  const [symbol, setSymbol] = useState('SOL');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Generate initial patterns
    const initial = Array.from({ length: 4 }, generatePattern);
    setPatterns(initial);
    setPriceData(generatePriceData());
    if (initial.length > 0) setSelectedPattern(initial[0]);

    // Simulate new pattern detection
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newPattern = generatePattern();
        setPatterns(prev => [newPattern, ...prev.slice(0, 5)]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    setPriceData(generatePriceData());
    setTimeout(() => {
      const newPattern = generatePattern();
      setPatterns(prev => [newPattern, ...prev.slice(0, 5)]);
      setSelectedPattern(newPattern);
      setIsScanning(false);
    }, 2000);
  };

  const stats = {
    bullish: patterns.filter(p => p.type === 'bullish').length,
    bearish: patterns.filter(p => p.type === 'bearish').length,
    confirmed: patterns.filter(p => p.status === 'confirmed').length,
    avgConfidence: Math.round(patterns.reduce((acc, p) => acc + p.confidence, 0) / patterns.length || 0),
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-chart-purple/20 to-pink-500/20">
              <Brain className="h-5 w-5 text-chart-purple" />
            </div>
            <span>AI Pattern Recognition</span>
            <Badge variant="secondary" className="text-[10px]">BETA</Badge>
          </CardTitle>
          
          <div className="flex items-center gap-3">
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['SOL', 'ETH', 'BTC', 'BONK', 'WIF'].map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              size="sm" 
              onClick={handleScan}
              disabled={isScanning}
              className="gap-1"
            >
              {isScanning ? (
                <>
                  <Activity className="h-4 w-4 animate-pulse" />
                  Scanning...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Scan Chart
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-chart-green/10 border border-chart-green/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-chart-green" />
              <span className="text-xs text-muted-foreground">Bullish</span>
            </div>
            <p className="text-2xl font-bold text-chart-green mt-1">{stats.bullish}</p>
          </div>
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Bearish</span>
            </div>
            <p className="text-2xl font-bold text-destructive mt-1">{stats.bearish}</p>
          </div>
          <div className="p-3 rounded-lg bg-chart-blue/10 border border-chart-blue/20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-chart-blue" />
              <span className="text-xs text-muted-foreground">Confirmed</span>
            </div>
            <p className="text-2xl font-bold text-chart-blue mt-1">{stats.confirmed}</p>
          </div>
          <div className="p-3 rounded-lg bg-chart-purple/10 border border-chart-purple/20">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-chart-purple" />
              <span className="text-xs text-muted-foreground">Avg Confidence</span>
            </div>
            <p className="text-2xl font-bold text-chart-purple mt-1">{stats.avgConfidence}%</p>
          </div>
        </div>

        {/* Chart with Pattern Overlay */}
        {selectedPattern && (
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{symbol}/USD</span>
                <Badge className={selectedPattern.type === 'bullish' ? 'bg-chart-green/20 text-chart-green' : selectedPattern.type === 'bearish' ? 'bg-destructive/20 text-destructive' : 'bg-chart-yellow/20 text-chart-yellow'}>
                  {selectedPattern.name}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">{selectedPattern.timeframe} Timeframe</span>
            </div>
            
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="patternGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                  <ReferenceLine y={selectedPattern.priceTarget} stroke="hsl(var(--chart-green))" strokeDasharray="5 5" label={{ value: 'Target', fill: 'hsl(var(--chart-green))', fontSize: 10 }} />
                  <ReferenceLine y={selectedPattern.stopLoss} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label={{ value: 'Stop', fill: 'hsl(var(--destructive))', fontSize: 10 }} />
                  <ReferenceLine y={selectedPattern.currentPrice} stroke="hsl(var(--foreground))" strokeDasharray="3 3" />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="hsl(var(--primary))" 
                    fill="url(#patternGradient)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Detected Patterns List */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Detected Patterns</span>
            <Badge variant="secondary" className="text-[10px]">{patterns.length}</Badge>
          </div>
          
          <ScrollArea className="h-[300px] pr-2">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {patterns.map((pattern) => (
                  <PatternCard 
                    key={pattern.id} 
                    pattern={pattern} 
                    onSelect={() => setSelectedPattern(pattern)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIPatternRecognition;

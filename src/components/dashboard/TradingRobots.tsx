import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';
import WalletConnect from '@/components/wallet/WalletConnect';
import { 
  Bot, 
  Zap, 
  Shield, 
  TrendingUp, 
  Clock, 
  Rocket, 
  Target,
  Wallet,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface TradingRobot {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  riskLevel: 'conservative' | 'balanced' | 'aggressive';
  strategy: 'scalper' | 'swing' | 'hodler';
  winRate: number;
  avgReturn: string;
  active: boolean;
  color: string;
}

const initialRobots: TradingRobot[] = [
  {
    id: 'alpha-scalper',
    name: 'Alpha Scalper',
    description: 'Lightning-fast trades on micro-movements. High frequency, tight stops.',
    icon: Zap,
    riskLevel: 'aggressive',
    strategy: 'scalper',
    winRate: 72,
    avgReturn: '+15%/day',
    active: false,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'steady-gains',
    name: 'Steady Gains',
    description: 'Balanced approach with moderate risk. Perfect for consistent growth.',
    icon: Shield,
    riskLevel: 'balanced',
    strategy: 'swing',
    winRate: 68,
    avgReturn: '+8%/week',
    active: false,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'momentum-hunter',
    name: 'Momentum Hunter',
    description: 'Catches explosive moves using AI pattern detection. High reward plays.',
    icon: Rocket,
    riskLevel: 'aggressive',
    strategy: 'swing',
    winRate: 65,
    avgReturn: '+25%/trade',
    active: false,
    color: 'from-red-500 to-pink-500',
  },
  {
    id: 'diamond-hands',
    name: 'Diamond Hands',
    description: 'Long-term accumulator. Buys dips, never panic sells. HODL strategy.',
    icon: Target,
    riskLevel: 'conservative',
    strategy: 'hodler',
    winRate: 85,
    avgReturn: '+50%/month',
    active: false,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'whale-tracker',
    name: 'Whale Tracker',
    description: 'Follows smart money. Detects whale accumulation and front-runs moves.',
    icon: TrendingUp,
    riskLevel: 'aggressive',
    strategy: 'swing',
    winRate: 70,
    avgReturn: '+20%/week',
    active: false,
    color: 'from-purple-500 to-violet-500',
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Trades during low-volume hours for better entries. Patient accumulator.',
    icon: Clock,
    riskLevel: 'balanced',
    strategy: 'scalper',
    winRate: 75,
    avgReturn: '+12%/week',
    active: false,
    color: 'from-indigo-500 to-blue-500',
  },
];

const riskColors = {
  conservative: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
  balanced: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  aggressive: 'bg-red-500/20 text-red-400 border-red-500/50',
};

const strategyLabels = {
  scalper: 'Scalper',
  swing: 'Swing Trader',
  hodler: 'HODLer',
};

const TradingRobots = () => {
  const { connected } = usePhantomWallet();
  const [robots, setRobots] = useState(initialRobots);

  const toggleRobot = (id: string) => {
    if (!connected) {
      toast.error('Connect your wallet first!');
      return;
    }

    setRobots(prev => prev.map(robot => {
      if (robot.id === id) {
        const newActive = !robot.active;
        toast.success(newActive ? `${robot.name} activated!` : `${robot.name} deactivated`);
        return { ...robot, active: newActive };
      }
      return robot;
    }));
  };

  const activeCount = robots.filter(r => r.active).length;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <span>Trading Robots</span>
            {activeCount > 0 && (
              <Badge variant="default" className="ml-2">
                {activeCount} Active
              </Badge>
            )}
          </CardTitle>
          <WalletConnect />
        </div>
      </CardHeader>
      
      <CardContent>
        {!connected ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="p-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 w-fit mx-auto mb-6">
              <Wallet className="h-12 w-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Connect your Phantom wallet to activate AI trading robots that will trade on your behalf automatically.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span>Non-Custodial</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span>Real-Time</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {robots.map((robot, index) => {
                const Icon = robot.icon;
                return (
                  <motion.div
                    key={robot.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative rounded-xl border p-4 transition-all duration-300 ${
                      robot.active 
                        ? 'border-primary/50 bg-primary/5 shadow-lg shadow-primary/10' 
                        : 'border-border/50 bg-card/30 hover:border-border'
                    }`}
                  >
                    {robot.active && (
                      <div className="absolute top-2 right-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2.5 rounded-lg bg-gradient-to-br ${robot.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate">{robot.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={`text-xs ${riskColors[robot.riskLevel]}`}>
                            {robot.riskLevel}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {strategyLabels[robot.strategy]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                      {robot.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs mb-4">
                      <div>
                        <span className="text-muted-foreground">Win Rate</span>
                        <p className="font-semibold text-emerald-400">{robot.winRate}%</p>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground">Avg Return</span>
                        <p className="font-semibold text-primary">{robot.avgReturn}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {robot.active ? 'Active' : 'Inactive'}
                      </span>
                      <Switch 
                        checked={robot.active} 
                        onCheckedChange={() => toggleRobot(robot.id)}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
        
        {connected && activeCount > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground">Robots are trading!</h4>
                <p className="text-sm text-muted-foreground">
                  {activeCount} robot{activeCount > 1 ? 's' : ''} actively monitoring and trading
                </p>
              </div>
              <Button size="sm" variant="outline" className="gap-2">
                View Activity <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingRobots;

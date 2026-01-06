import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Zap,
  Eye,
  Shield,
  Layers,
  Activity
} from 'lucide-react';

interface OrderLevel {
  price: number;
  size: number;
  total: number;
  type: 'bid' | 'ask';
  isWhale?: boolean;
  isSpoofing?: boolean;
}

interface WhaleOrder {
  id: string;
  price: number;
  size: number;
  type: 'bid' | 'ask';
  timestamp: Date;
  status: 'active' | 'filled' | 'cancelled';
}

interface SpoofingAlert {
  id: string;
  price: number;
  originalSize: number;
  cancelledSize: number;
  type: 'bid' | 'ask';
  timestamp: Date;
  confidence: number;
}

const generateOrderBook = (midPrice: number): { bids: OrderLevel[], asks: OrderLevel[] } => {
  const bids: OrderLevel[] = [];
  const asks: OrderLevel[] = [];
  let bidTotal = 0;
  let askTotal = 0;

  for (let i = 0; i < 15; i++) {
    const bidPrice = midPrice - (i * 0.05) - Math.random() * 0.02;
    const askPrice = midPrice + (i * 0.05) + Math.random() * 0.02;
    const bidSize = Math.random() * 50000 + 1000;
    const askSize = Math.random() * 50000 + 1000;
    
    bidTotal += bidSize;
    askTotal += askSize;
    
    const isWhaleBid = bidSize > 40000;
    const isWhaleAsk = askSize > 40000;
    const isSpoofingBid = Math.random() > 0.92;
    const isSpoofingAsk = Math.random() > 0.92;

    bids.push({
      price: Math.round(bidPrice * 100) / 100,
      size: Math.round(bidSize),
      total: Math.round(bidTotal),
      type: 'bid',
      isWhale: isWhaleBid,
      isSpoofing: isSpoofingBid && isWhaleBid,
    });

    asks.push({
      price: Math.round(askPrice * 100) / 100,
      size: Math.round(askSize),
      total: Math.round(askTotal),
      type: 'ask',
      isWhale: isWhaleAsk,
      isSpoofing: isSpoofingAsk && isWhaleAsk,
    });
  }

  return { bids, asks };
};

const AdvancedOrderBook = () => {
  const [symbol, setSymbol] = useState('SOL');
  const [midPrice, setMidPrice] = useState(178.45);
  const [orderBook, setOrderBook] = useState(() => generateOrderBook(178.45));
  const [whaleOrders, setWhaleOrders] = useState<WhaleOrder[]>([]);
  const [spoofingAlerts, setSpoofingAlerts] = useState<SpoofingAlert[]>([]);
  const [showDepth, setShowDepth] = useState(true);

  const symbols = ['SOL', 'ETH', 'BTC', 'BONK', 'WIF'];
  const prices: Record<string, number> = { SOL: 178.45, ETH: 3245.80, BTC: 67234.50, BONK: 0.00003245, WIF: 2.87 };

  useEffect(() => {
    const interval = setInterval(() => {
      const priceChange = (Math.random() - 0.5) * 0.5;
      const newMid = midPrice + priceChange;
      setMidPrice(Math.round(newMid * 100) / 100);
      setOrderBook(generateOrderBook(newMid));

      // Generate whale orders occasionally
      if (Math.random() > 0.85) {
        const newWhale: WhaleOrder = {
          id: Math.random().toString(36).substr(2, 9),
          price: newMid + (Math.random() - 0.5) * 2,
          size: Math.floor(Math.random() * 100000) + 50000,
          type: Math.random() > 0.5 ? 'bid' : 'ask',
          timestamp: new Date(),
          status: 'active',
        };
        setWhaleOrders(prev => [newWhale, ...prev.slice(0, 4)]);
      }

      // Generate spoofing alerts occasionally
      if (Math.random() > 0.9) {
        const newSpoof: SpoofingAlert = {
          id: Math.random().toString(36).substr(2, 9),
          price: newMid + (Math.random() - 0.5) * 1.5,
          originalSize: Math.floor(Math.random() * 80000) + 40000,
          cancelledSize: Math.floor(Math.random() * 60000) + 30000,
          type: Math.random() > 0.5 ? 'bid' : 'ask',
          timestamp: new Date(),
          confidence: Math.floor(Math.random() * 30) + 70,
        };
        setSpoofingAlerts(prev => [newSpoof, ...prev.slice(0, 2)]);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [midPrice]);

  useEffect(() => {
    setMidPrice(prices[symbol]);
    setOrderBook(generateOrderBook(prices[symbol]));
  }, [symbol]);

  const maxTotal = Math.max(
    orderBook.bids[orderBook.bids.length - 1]?.total || 0,
    orderBook.asks[orderBook.asks.length - 1]?.total || 0
  );

  const imbalance = useMemo(() => {
    const bidVolume = orderBook.bids.reduce((acc, b) => acc + b.size, 0);
    const askVolume = orderBook.asks.reduce((acc, a) => acc + a.size, 0);
    return Math.round((bidVolume / (bidVolume + askVolume)) * 100);
  }, [orderBook]);

  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(8);
    if (price < 1) return price.toFixed(4);
    return price.toFixed(2);
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-chart-blue/20 to-chart-purple/20">
              <Layers className="h-5 w-5 text-chart-blue" />
            </div>
            <span>Advanced Order Book</span>
          </CardTitle>
          
          <div className="flex items-center gap-3">
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {symbols.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              size="sm" 
              variant={showDepth ? "default" : "outline"}
              onClick={() => setShowDepth(!showDepth)}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Depth
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
            <p className="text-xs text-muted-foreground mb-1">Mid Price</p>
            <p className="text-lg font-bold text-foreground">${formatPrice(midPrice)}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
            <p className="text-xs text-muted-foreground mb-1">Spread</p>
            <p className="text-lg font-bold text-chart-yellow">
              {((orderBook.asks[0]?.price - orderBook.bids[0]?.price) / midPrice * 100).toFixed(3)}%
            </p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
            <p className="text-xs text-muted-foreground mb-1">Buy Pressure</p>
            <p className={`text-lg font-bold ${imbalance > 50 ? 'text-chart-green' : 'text-destructive'}`}>
              {imbalance}%
            </p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
            <p className="text-xs text-muted-foreground mb-1">Whale Orders</p>
            <p className="text-lg font-bold text-chart-purple">{whaleOrders.filter(w => w.status === 'active').length}</p>
          </div>
        </div>

        {/* Spoofing Alerts */}
        <AnimatePresence>
          {spoofingAlerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              {spoofingAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-lg bg-warning/10 border border-warning/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <div>
                      <p className="text-sm font-medium text-warning">Potential Spoofing Detected</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.type === 'bid' ? 'Buy' : 'Sell'} wall at ${formatPrice(alert.price)} - {alert.cancelledSize.toLocaleString()} cancelled
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-warning/50 text-warning">
                    {alert.confidence}% confidence
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Book */}
        <div className="grid grid-cols-2 gap-2">
          {/* Bids */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground px-2 pb-2">
              <span>Price (USD)</span>
              <span>Size</span>
              <span>Total</span>
            </div>
            {orderBook.bids.map((level, i) => (
              <motion.div
                key={`bid-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative"
              >
                {showDepth && (
                  <div 
                    className="absolute inset-0 bg-chart-green/20 rounded-l"
                    style={{ width: `${(level.total / maxTotal) * 100}%` }}
                  />
                )}
                <div className={`relative flex items-center justify-between px-2 py-1 text-xs ${level.isWhale ? 'bg-chart-green/10' : ''}`}>
                  <span className="text-chart-green font-mono flex items-center gap-1">
                    {level.isWhale && <Zap className="h-3 w-3" />}
                    {level.isSpoofing && <AlertTriangle className="h-3 w-3 text-warning" />}
                    ${formatPrice(level.price)}
                  </span>
                  <span className={`font-mono ${level.isWhale ? 'text-chart-green font-bold' : 'text-foreground'}`}>
                    {level.size.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground font-mono">{level.total.toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Asks */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground px-2 pb-2">
              <span>Price (USD)</span>
              <span>Size</span>
              <span>Total</span>
            </div>
            {orderBook.asks.map((level, i) => (
              <motion.div
                key={`ask-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative"
              >
                {showDepth && (
                  <div 
                    className="absolute inset-0 bg-destructive/20 rounded-r right-0"
                    style={{ width: `${(level.total / maxTotal) * 100}%`, marginLeft: 'auto' }}
                  />
                )}
                <div className={`relative flex items-center justify-between px-2 py-1 text-xs ${level.isWhale ? 'bg-destructive/10' : ''}`}>
                  <span className="text-destructive font-mono flex items-center gap-1">
                    {level.isWhale && <Zap className="h-3 w-3" />}
                    {level.isSpoofing && <AlertTriangle className="h-3 w-3 text-warning" />}
                    ${formatPrice(level.price)}
                  </span>
                  <span className={`font-mono ${level.isWhale ? 'text-destructive font-bold' : 'text-foreground'}`}>
                    {level.size.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground font-mono">{level.total.toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Whale Orders Tracker */}
        {whaleOrders.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-chart-purple" />
              <span className="text-sm font-medium text-foreground">Whale Order Tracker</span>
            </div>
            <div className="space-y-1">
              {whaleOrders.slice(0, 3).map((whale) => (
                <motion.div
                  key={whale.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-2 rounded-lg border ${
                    whale.type === 'bid' 
                      ? 'bg-chart-green/5 border-chart-green/20' 
                      : 'bg-destructive/5 border-destructive/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {whale.type === 'bid' ? (
                        <TrendingUp className="h-3.5 w-3.5 text-chart-green" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                      )}
                      <span className={whale.type === 'bid' ? 'text-chart-green' : 'text-destructive'}>
                        {whale.type === 'bid' ? 'BUY' : 'SELL'} ${formatPrice(whale.price)}
                      </span>
                    </div>
                    <span className="font-bold text-foreground">{whale.size.toLocaleString()} {symbol}</span>
                    <Badge variant="outline" className="text-[10px]">{whale.status}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedOrderBook;

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const MarketTicker = () => {
  const [prices, setPrices] = useState<TickerItem[]>([
    { symbol: 'BTC', price: 104250.00, change: 2340.50, changePercent: 2.30 },
    { symbol: 'ETH', price: 3890.00, change: 145.20, changePercent: 3.88 },
    { symbol: 'SOL', price: 218.50, change: 12.30, changePercent: 5.96 },
    { symbol: 'DOGE', price: 0.4250, change: 0.0320, changePercent: 8.14 },
    { symbol: 'PEPE', price: 0.00002450, change: 0.00000180, changePercent: 7.93 },
    { symbol: 'SHIB', price: 0.0000285, change: -0.0000012, changePercent: -4.04 },
    { symbol: 'AAPL', price: 198.50, change: 3.20, changePercent: 1.64 },
    { symbol: 'TSLA', price: 425.80, change: 18.40, changePercent: 4.52 },
    { symbol: 'NVDA', price: 142.30, change: 5.80, changePercent: 4.25 },
    { symbol: 'AMD', price: 125.60, change: -2.40, changePercent: -1.87 },
  ]);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(item => {
        const fluctuation = (Math.random() - 0.5) * 0.02;
        const newPrice = item.price * (1 + fluctuation);
        const newChange = newPrice - (item.price - item.change);
        const newChangePercent = (newChange / (newPrice - newChange)) * 100;
        return {
          ...item,
          price: newPrice,
          change: newChange,
          changePercent: newChangePercent,
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price < 0.001) return price.toFixed(8);
    if (price < 1) return price.toFixed(4);
    if (price < 100) return price.toFixed(2);
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const duplicatedPrices = [...prices, ...prices];

  return (
    <div className="w-full bg-card/80 backdrop-blur-sm border-b border-border overflow-hidden">
      <div className="relative flex">
        <motion.div
          className="flex gap-8 py-2 px-4"
          animate={{ x: [0, -50 * prices.length] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {duplicatedPrices.map((item, index) => (
            <div
              key={`${item.symbol}-${index}`}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <span className="font-semibold text-foreground">{item.symbol}</span>
              <span className="text-muted-foreground">${formatPrice(item.price)}</span>
              <span
                className={`flex items-center gap-0.5 text-sm ${
                  item.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {item.change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {item.changePercent >= 0 ? '+' : ''}
                {item.changePercent.toFixed(2)}%
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MarketTicker;

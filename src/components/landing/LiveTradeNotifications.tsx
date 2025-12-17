import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";

const tradeTypes = [
  { token: "SOL", action: "BUY", profit: "+12.4%", amount: "$2,450", user: "Whale_****" },
  { token: "BONK", action: "SELL", profit: "+89.2%", amount: "$15,200", user: "Trader_****" },
  { token: "JUP", action: "BUY", profit: "+23.1%", amount: "$5,800", user: "Alpha_****" },
  { token: "WIF", action: "SELL", profit: "+156.8%", amount: "$42,100", user: "Degen_****" },
  { token: "PYTH", action: "BUY", profit: "+8.7%", amount: "$1,200", user: "Smart_****" },
  { token: "RAY", action: "SELL", profit: "+34.5%", amount: "$8,900", user: "Pro_****" },
  { token: "ORCA", action: "BUY", profit: "+18.3%", amount: "$3,400", user: "Elite_****" },
  { token: "POPCAT", action: "SELL", profit: "+245.6%", amount: "$67,800", user: "Moon_****" },
  { token: "MEW", action: "BUY", profit: "+67.9%", amount: "$12,300", user: "King_****" },
  { token: "RENDER", action: "SELL", profit: "+41.2%", amount: "$9,500", user: "Bot_****" },
];

interface Notification {
  id: number;
  trade: typeof tradeTypes[0];
  position: "left" | "right";
}

export const LiveTradeNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationId, setNotificationId] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomTrade = tradeTypes[Math.floor(Math.random() * tradeTypes.length)];
      const position = Math.random() > 0.5 ? "left" : "right";
      
      setNotificationId((prev) => prev + 1);
      setNotifications((prev) => [
        ...prev.slice(-2),
        { id: notificationId, trade: randomTrade, position },
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, [notificationId]);

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  return (
    <div className="fixed bottom-24 left-0 right-0 z-40 pointer-events-none px-4">
      <div className="max-w-7xl mx-auto relative">
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ 
                opacity: 0, 
                x: notification.position === "left" ? -100 : 100,
                y: 0
              }}
              animate={{ 
                opacity: 1, 
                x: 0,
                y: -index * 80
              }}
              exit={{ 
                opacity: 0, 
                x: notification.position === "left" ? -100 : 100 
              }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`absolute bottom-0 ${
                notification.position === "left" ? "left-0" : "right-0"
              }`}
            >
              <div className="flex items-center gap-3 px-4 py-3 bg-card/90 backdrop-blur-md border border-border/50 rounded-xl shadow-lg pointer-events-auto">
                <div className={`p-2 rounded-lg ${
                  notification.trade.action === "BUY" 
                    ? "bg-success/20" 
                    : "bg-accent/20"
                }`}>
                  {notification.trade.action === "BUY" ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-accent" />
                  )}
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{notification.trade.user}</span>
                    <Zap className="w-3 h-3 text-primary animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${
                      notification.trade.action === "BUY" ? "text-success" : "text-accent"
                    }`}>
                      {notification.trade.action}
                    </span>
                    <span className="font-semibold">{notification.trade.token}</span>
                    <span className="text-muted-foreground text-sm">{notification.trade.amount}</span>
                  </div>
                </div>

                <div className="pl-2 border-l border-border/50">
                  <span className="text-success font-bold text-sm">{notification.trade.profit}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

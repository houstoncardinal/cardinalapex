import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, TrendingUp, DollarSign, Zap, Trophy } from "lucide-react";

interface Notification {
  id: string;
  type: "signup" | "profit" | "trade" | "milestone";
  message: string;
  location: string;
  amount?: string;
  timestamp: Date;
}

const locations = [
  "New York, USA", "London, UK", "Tokyo, Japan", "Sydney, Australia",
  "Berlin, Germany", "Singapore", "Dubai, UAE", "Toronto, Canada",
  "Paris, France", "Hong Kong", "Mumbai, India", "São Paulo, Brazil"
];

const names = [
  "Alex", "Jordan", "Sam", "Taylor", "Morgan", "Casey", "Riley", "Quinn",
  "Avery", "Blake", "Cameron", "Dakota", "Emery", "Finley", "Harper", "Jamie"
];

const generateNotification = (): Notification => {
  const types: Notification["type"][] = ["signup", "profit", "trade", "milestone"];
  const type = types[Math.floor(Math.random() * types.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  
  const notifications: Record<Notification["type"], { message: string; amount?: string }> = {
    signup: { message: `${name} just joined TradeFlow` },
    profit: { 
      message: `${name} made a profit`, 
      amount: `+$${(Math.random() * 5000 + 100).toFixed(2)}` 
    },
    trade: { 
      message: `${name} executed an AI trade`, 
      amount: `${(Math.random() * 10000 + 500).toFixed(0)} SOL` 
    },
    milestone: { 
      message: `${name} reached ${Math.floor(Math.random() * 50 + 10)}% monthly returns` 
    }
  };

  return {
    id: `${Date.now()}-${Math.random()}`,
    type,
    location,
    timestamp: new Date(),
    ...notifications[type]
  };
};

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "signup": return <UserPlus className="w-4 h-4" />;
    case "profit": return <DollarSign className="w-4 h-4" />;
    case "trade": return <Zap className="w-4 h-4" />;
    case "milestone": return <Trophy className="w-4 h-4" />;
  }
};

const getColor = (type: Notification["type"]) => {
  switch (type) {
    case "signup": return "text-blue-400 bg-blue-500/20";
    case "profit": return "text-green-400 bg-green-500/20";
    case "trade": return "text-purple-400 bg-purple-500/20";
    case "milestone": return "text-yellow-400 bg-yellow-500/20";
  }
};

const SocialProofFeed = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Initialize with some notifications
    const initial = Array.from({ length: 3 }, generateNotification);
    setNotifications(initial);

    const interval = setInterval(() => {
      setNotifications(prev => {
        const newNotification = generateNotification();
        return [newNotification, ...prev.slice(0, 4)];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Live Activity</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join <span className="text-primary">Thousands</span> of Profitable Traders
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See what's happening on TradeFlow right now. Real users, real profits.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-3">
          <AnimatePresence mode="popLayout">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                layout
                className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
              >
                <div className={`p-2 rounded-lg ${getColor(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {notification.message}
                  </p>
                  <p className="text-sm text-muted-foreground">{notification.location}</p>
                </div>
                {notification.amount && (
                  <span className={`font-bold ${notification.type === "profit" ? "text-green-400" : "text-primary"}`}>
                    {notification.amount}
                  </span>
                )}
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  Just now
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default SocialProofFeed;

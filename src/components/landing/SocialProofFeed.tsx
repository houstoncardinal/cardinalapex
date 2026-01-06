import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Zap, Globe, TrendingUp } from "lucide-react";

interface Notification {
  id: string;
  type: "signup" | "feature" | "update";
  message: string;
  detail: string;
  timestamp: Date;
}

const notifications: Notification[] = [
  { id: "1", type: "signup", message: "New trader joined from Tokyo", detail: "Welcome!", timestamp: new Date() },
  { id: "2", type: "feature", message: "Pattern recognition updated", detail: "Elliott Wave detection", timestamp: new Date() },
  { id: "3", type: "update", message: "New token added", detail: "500+ assets available", timestamp: new Date() },
  { id: "4", type: "signup", message: "New trader joined from London", detail: "Welcome!", timestamp: new Date() },
  { id: "5", type: "feature", message: "Ichimoku Cloud analysis live", detail: "Technical indicators", timestamp: new Date() },
];

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "signup": return <UserPlus className="w-4 h-4" />;
    case "feature": return <Zap className="w-4 h-4" />;
    case "update": return <Globe className="w-4 h-4" />;
  }
};

const getColor = (type: Notification["type"]) => {
  switch (type) {
    case "signup": return "text-blue-400 bg-blue-500/20";
    case "feature": return "text-purple-400 bg-purple-500/20";
    case "update": return "text-green-400 bg-green-500/20";
  }
};

const SocialProofFeed = () => {
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Initialize with some notifications
    setActiveNotifications(notifications.slice(0, 3));

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = (prev + 1) % notifications.length;
        setActiveNotifications(prevNotifs => {
          const newNotif = { ...notifications[nextIndex], id: `${Date.now()}`, timestamp: new Date() };
          return [newNotif, ...prevNotifs.slice(0, 2)];
        });
        return nextIndex;
      });
    }, 5000);

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
            <span className="text-sm font-medium text-primary">Platform Updates</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Building the <span className="text-primary">Future</span> of Trading
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            TradeFlow is actively developing new features. Join our early access to be part of the journey.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-3">
          <AnimatePresence mode="popLayout">
            {activeNotifications.map((notification) => (
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
                  <p className="text-sm text-muted-foreground">{notification.detail}</p>
                </div>
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

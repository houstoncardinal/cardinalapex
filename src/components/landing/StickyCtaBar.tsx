import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, X, TrendingUp, Users, Zap, ArrowRight
} from "lucide-react";

const StickyCtaBar = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeTraders, setActiveTraders] = useState(12847);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero section (around 600px)
      const shouldShow = window.scrollY > 600;
      setIsVisible(shouldShow && !isDismissed);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  // Simulate live trader count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTraders(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          {/* Gradient border top */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          <div className="bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-2xl shadow-black/20">
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Left side - Stats */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="hidden md:flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {["M", "S", "J", "K"].map((initial, i) => (
                        <motion.div
                          key={initial}
                          initial={{ scale: 0, x: -10 }}
                          animate={{ scale: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground border-2 border-background"
                        >
                          {initial}
                        </motion.div>
                      ))}
                    </div>
                    <div className="text-sm">
                      <span className="text-foreground font-semibold">{activeTraders.toLocaleString()}</span>
                      <span className="text-muted-foreground"> traders online</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="flex items-center gap-1.5 text-sm"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-500 font-semibold">+$47.8M</span>
                      <span className="text-muted-foreground hidden sm:inline">profits today</span>
                    </motion.div>

                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs animate-pulse">
                      <Zap className="w-3 h-3 mr-1" />
                      94% Win Rate
                    </Badge>
                  </div>
                </div>

                {/* Right side - CTA */}
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={() => navigate("/auth?mode=signup")}
                      className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-lg shadow-primary/25 px-6"
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Start Trading Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>

                  <button
                    onClick={handleDismiss}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCtaBar;

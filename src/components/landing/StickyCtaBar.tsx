import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, X, Zap, ArrowRight, Shield
} from "lucide-react";

const StickyCtaBar = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero section (around 600px)
      const shouldShow = window.scrollY > 600;
      setIsVisible(shouldShow && !isDismissed);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

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
                {/* Left side - Value props */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-4">
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Early Access
                    </Badge>

                    <div className="hidden md:flex items-center gap-1.5 text-sm">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Non-custodial</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-1.5 text-sm">
                      <span className="text-muted-foreground">500+ Tokens</span>
                    </div>
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

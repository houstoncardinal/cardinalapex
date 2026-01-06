import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Check, X, Minus, Crown, Diamond, Rocket, 
  Sparkles, Zap, Info, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  name: string;
  description: string;
  starter: boolean | string | "partial";
  pro: boolean | string | "partial";
  elite: boolean | string | "partial";
  highlight?: boolean;
}

const features: Feature[] = [
  { 
    name: "AI Trading Bots", 
    description: "Deploy intelligent bots that trade 24/7",
    starter: "1 Bot", 
    pro: "Unlimited", 
    elite: "Unlimited + Custom",
    highlight: true 
  },
  { 
    name: "Pattern Recognition", 
    description: "Detect market patterns automatically",
    starter: "Basic", 
    pro: "Advanced", 
    elite: "Institutional-Grade" 
  },
  { 
    name: "Daily Trade Limit", 
    description: "Number of trades per day",
    starter: "5 Trades", 
    pro: "Unlimited", 
    elite: "Unlimited" 
  },
  { 
    name: "Real-time Alerts", 
    description: "Get notified of trading opportunities",
    starter: "Email Only", 
    pro: true, 
    elite: true 
  },
  { 
    name: "Copy Trading", 
    description: "Copy successful traders automatically",
    starter: false, 
    pro: true, 
    elite: true,
    highlight: true 
  },
  { 
    name: "Custom Strategies", 
    description: "Create your own trading strategies",
    starter: false, 
    pro: true, 
    elite: true 
  },
  { 
    name: "VIP Signal Groups", 
    description: "Access exclusive trading signals",
    starter: false, 
    pro: false, 
    elite: true 
  },
  { 
    name: "1-on-1 Strategy Calls", 
    description: "Personal coaching sessions",
    starter: false, 
    pro: false, 
    elite: "Monthly" 
  },
  { 
    name: "Priority Support", 
    description: "Get help when you need it",
    starter: "Community", 
    pro: "24/7 Chat", 
    elite: "Dedicated Manager" 
  },
  { 
    name: "API Access", 
    description: "Integrate with your own systems",
    starter: false, 
    pro: "partial", 
    elite: true 
  },
  { 
    name: "Backtesting", 
    description: "Test strategies on historical data",
    starter: false, 
    pro: true, 
    elite: true 
  },
  { 
    name: "Risk Management Tools", 
    description: "Advanced stop-loss and position sizing",
    starter: "Basic", 
    pro: "Advanced", 
    elite: "Institutional" 
  },
];

const plans = [
  { 
    name: "Starter", 
    price: "Free", 
    period: "", 
    icon: Rocket, 
    color: "from-slate-500 to-slate-600",
    popular: false 
  },
  { 
    name: "Pro", 
    price: "$49", 
    period: "/month", 
    icon: Crown, 
    color: "from-primary to-accent",
    popular: true 
  },
  { 
    name: "Elite", 
    price: "$149", 
    period: "/month", 
    icon: Diamond, 
    color: "from-purple-500 to-pink-500",
    popular: false 
  },
];

const getValueDisplay = (value: boolean | string | "partial") => {
  if (value === true) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"
      >
        <Check className="w-4 h-4 text-green-500" />
      </motion.div>
    );
  }
  if (value === false) {
    return (
      <div className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center">
        <X className="w-4 h-4 text-muted-foreground/50" />
      </div>
    );
  }
  if (value === "partial") {
    return (
      <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
        <Minus className="w-4 h-4 text-yellow-500" />
      </div>
    );
  }
  return <span className="text-sm font-medium text-foreground">{value}</span>;
};

const PricingComparisonTable = () => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);

  return (
    <section className="relative z-10 py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-transparent" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Compare Plans</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Find Your <span className="text-primary">Perfect Plan</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare features side-by-side and choose the plan that fits your trading goals
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto overflow-x-auto"
        >
          <div className="min-w-[700px]">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-foreground">Features</h3>
              </div>
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredCol(index)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={cn(
                    "relative p-4 rounded-xl text-center transition-all duration-300",
                    hoveredCol === index 
                      ? "bg-card border-2 border-primary shadow-xl shadow-primary/20 scale-105" 
                      : "bg-card/50 border border-border/50"
                  )}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  <div className={cn(
                    "w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br flex items-center justify-center",
                    plan.color
                  )}>
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-foreground text-lg">{plan.name}</h4>
                  <div className="flex items-baseline justify-center gap-1 mt-1">
                    <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Features rows */}
            <div className="space-y-2">
              {features.map((feature, rowIndex) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: rowIndex * 0.03 }}
                  onMouseEnter={() => setHoveredRow(rowIndex)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={cn(
                    "grid grid-cols-4 gap-4 p-4 rounded-xl transition-all duration-300",
                    hoveredRow === rowIndex 
                      ? "bg-primary/5 border border-primary/20" 
                      : "bg-card/30 border border-transparent",
                    feature.highlight && "bg-gradient-to-r from-primary/5 to-accent/5"
                  )}
                >
                  {/* Feature name */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-medium transition-colors",
                          hoveredRow === rowIndex ? "text-primary" : "text-foreground"
                        )}>
                          {feature.name}
                        </span>
                        {feature.highlight && (
                          <Zap className="w-4 h-4 text-primary" />
                        )}
                        <button
                          onMouseEnter={() => setShowTooltip(rowIndex)}
                          onMouseLeave={() => setShowTooltip(null)}
                          className="relative"
                        >
                          <Info className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                          <AnimatePresence>
                            {showTooltip === rowIndex && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute left-0 top-full mt-2 z-50 w-48 p-2 rounded-lg bg-popover border border-border shadow-lg text-xs text-muted-foreground"
                              >
                                {feature.description}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Plan values */}
                  {[feature.starter, feature.pro, feature.elite].map((value, colIndex) => (
                    <motion.div
                      key={colIndex}
                      className={cn(
                        "flex items-center justify-center transition-all duration-300",
                        hoveredCol === colIndex && "scale-110"
                      )}
                      animate={{
                        scale: hoveredRow === rowIndex && hoveredCol === colIndex ? 1.15 : 1,
                      }}
                    >
                      {getValueDisplay(value)}
                    </motion.div>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* CTA Row */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
              <div />
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      className={cn(
                        "w-full",
                        plan.popular 
                          ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25" 
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      )}
                    >
                      {plan.price === "Free" ? "Get Started" : `Choose ${plan.name}`}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingComparisonTable;

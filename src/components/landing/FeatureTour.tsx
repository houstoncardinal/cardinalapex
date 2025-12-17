import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, ChartLine, Wallet, Shield, Bell, 
  TrendingUp, Zap, Target, ChevronLeft, ChevronRight,
  Play, Pause
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const tourSteps = [
  {
    id: 1,
    icon: Bot,
    title: "AI Trading Robots",
    description: "Deploy intelligent trading bots that analyze markets 24/7 and execute trades automatically based on advanced pattern recognition.",
    highlight: "6 Robot Personalities",
    color: "from-primary to-accent",
  },
  {
    id: 2,
    icon: ChartLine,
    title: "Advanced Pattern Detection",
    description: "Our AI identifies Head & Shoulders, Cup & Handle, Elliott Waves, and more with 85%+ confidence before executing trades.",
    highlight: "Real-time Analysis",
    color: "from-accent to-primary",
  },
  {
    id: 3,
    icon: Wallet,
    title: "Phantom Wallet Integration",
    description: "Connect your Solana wallet seamlessly. Track your portfolio, execute trades, and manage assets all in one place.",
    highlight: "On-chain Trading",
    color: "from-primary to-accent",
  },
  {
    id: 4,
    icon: Shield,
    title: "Risk Management",
    description: "Built-in stop-loss, take-profit, and position sizing tools protect your capital while maximizing potential returns.",
    highlight: "Smart Protection",
    color: "from-accent to-primary",
  },
  {
    id: 5,
    icon: Bell,
    title: "Real-time Alerts",
    description: "Get instant notifications on trade executions, price movements, and high-confidence trading signals.",
    highlight: "Never Miss a Trade",
    color: "from-primary to-accent",
  },
  {
    id: 6,
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Track your P&L, win rate, and trading history with detailed charts and exportable reports.",
    highlight: "Data-Driven Insights",
    color: "from-accent to-primary",
  },
];

export const FeatureTour = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % tourSteps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + tourSteps.length) % tourSteps.length);
  };

  // Auto-advance
  useState(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextStep, 5000);
    return () => clearInterval(interval);
  });

  const step = tourSteps[currentStep];
  const StepIcon = step.icon;

  return (
    <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 lg:px-12 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary/30">
            Platform Tour
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Discover <span className="text-primary">TradeFlow</span> Features
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            Take a guided tour through our powerful trading platform
          </p>
        </motion.div>

        <div className="relative">
          {/* Main Tour Card */}
          <div className="glass rounded-3xl p-6 sm:p-10 border-primary/20 relative overflow-hidden">
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-5`} />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Left: Icon & Visual */}
                  <div className="flex flex-col items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className={`relative h-32 w-32 sm:h-40 sm:w-40 rounded-3xl bg-gradient-to-br ${step.color} p-1`}
                    >
                      <div className="h-full w-full rounded-3xl bg-background flex items-center justify-center">
                        <StepIcon className="h-16 w-16 sm:h-20 sm:w-20 text-primary" />
                      </div>
                      {/* Animated rings */}
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-3xl border-2 border-primary/30"
                      />
                    </motion.div>
                    
                    <Badge className="mt-6 bg-primary/20 text-primary border-primary/30">
                      <Zap className="h-3 w-3 mr-1" />
                      {step.highlight}
                    </Badge>
                  </div>

                  {/* Right: Content */}
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                      <span className="text-sm text-muted-foreground">
                        Step {currentStep + 1} of {tourSteps.length}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                      {step.description}
                    </p>

                    <div className="mt-8 flex items-center justify-center md:justify-start gap-4">
                      <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                        <Target className="h-4 w-4 mr-2" />
                        Try This Feature
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/50">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevStep}
                className="hover:bg-primary/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              {/* Progress dots */}
              <div className="flex items-center gap-2">
                {tourSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? "w-8 bg-primary"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="hover:bg-primary/10"
                >
                  {isAutoPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextStep}
                  className="hover:bg-primary/10"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Feature Quick Links */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-6">
            {tourSteps.map((tourStep, index) => {
              const Icon = tourStep.icon;
              return (
                <motion.button
                  key={tourStep.id}
                  onClick={() => setCurrentStep(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`glass p-3 sm:p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    index === currentStep
                      ? "border-primary/50 bg-primary/10"
                      : "border-border/30 hover:border-primary/30"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${index === currentStep ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {tourStep.title.split(" ")[0]}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

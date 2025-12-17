import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, DollarSign, Percent } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

export const ROICalculator = () => {
  const [investment, setInvestment] = useState(1000);
  const [months, setMonths] = useState(6);
  const [riskLevel, setRiskLevel] = useState(50);

  const monthlyReturn = riskLevel < 33 ? 0.08 : riskLevel < 66 ? 0.15 : 0.25;
  const projectedValue = investment * Math.pow(1 + monthlyReturn, months);
  const totalProfit = projectedValue - investment;
  const percentageGain = ((projectedValue - investment) / investment) * 100;

  return (
    <section id="calculator" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Calculator className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">ROI Calculator</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Calculate Your{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
              Potential Returns
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See how much you could earn with TradeFlow's AI-powered trading
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      Initial Investment
                    </label>
                    <span className="text-xl font-bold text-primary">${investment.toLocaleString()}</span>
                  </div>
                  <Slider
                    value={[investment]}
                    onValueChange={(v) => setInvestment(v[0])}
                    min={100}
                    max={100000}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>$100</span>
                    <span>$100,000</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      Investment Period
                    </label>
                    <span className="text-xl font-bold text-accent">{months} months</span>
                  </div>
                  <Slider
                    value={[months]}
                    onValueChange={(v) => setMonths(v[0])}
                    min={1}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1 month</span>
                    <span>24 months</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Percent className="w-4 h-4 text-success" />
                      Risk Level
                    </label>
                    <span className="text-xl font-bold text-success">
                      {riskLevel < 33 ? "Conservative" : riskLevel < 66 ? "Balanced" : "Aggressive"}
                    </span>
                  </div>
                  <Slider
                    value={[riskLevel]}
                    onValueChange={(v) => setRiskLevel(v[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Conservative</span>
                    <span>Aggressive</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 bg-gradient-to-br from-primary/10 via-card to-accent/10 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
              
              <div className="relative z-10 space-y-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">Projected Portfolio Value</p>
                  <motion.p
                    key={projectedValue}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                  >
                    ${projectedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </motion.p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background/50 rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Profit</p>
                    <p className="text-2xl font-bold text-success">
                      +${totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Percentage Gain</p>
                    <p className="text-2xl font-bold text-accent">
                      +{percentageGain.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="bg-background/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="text-xs text-muted-foreground">Monthly Return Rate</span>
                  </div>
                  <p className="text-lg font-semibold">
                    ~{(monthlyReturn * 100).toFixed(0)}% per month
                  </p>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  *Projections based on historical AI trading performance. Past results do not guarantee future returns.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

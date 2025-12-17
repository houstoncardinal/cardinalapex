import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar, Target, DollarSign, ChevronRight, ChevronLeft, Trophy, Zap, BarChart3 } from 'lucide-react';

const caseStudies = [
  {
    id: 1,
    name: "Marcus Chen",
    title: "Day Trader",
    avatar: "MC",
    location: "San Francisco, CA",
    joinDate: "January 2024",
    initialInvestment: 5000,
    currentPortfolio: 47500,
    returnPercent: 850,
    tradingStyle: "Aggressive Growth",
    favoriteFeature: "AI Pattern Detection",
    timeline: [
      { month: "Month 1", event: "Started with AI Scalper bot", profit: 1200 },
      { month: "Month 2", event: "Added Swing Trader bot", profit: 3500 },
      { month: "Month 3", event: "First major win on BONK", profit: 8000 },
      { month: "Month 4", event: "Portfolio diversification", profit: 12000 },
      { month: "Month 5", event: "Compound growth kicks in", profit: 17800 },
    ],
    quote: "The AI detected a cup and handle pattern on SOL that I completely missed. That single trade made me $12,000.",
    stats: { winRate: 78, totalTrades: 342, avgHoldTime: "4 hours" }
  },
  {
    id: 2,
    name: "Sarah Williams",
    title: "Part-time Investor",
    avatar: "SW",
    location: "Austin, TX",
    joinDate: "November 2023",
    initialInvestment: 10000,
    currentPortfolio: 68000,
    returnPercent: 580,
    tradingStyle: "Balanced",
    favoriteFeature: "DCA Automation",
    timeline: [
      { month: "Month 1", event: "Set up DCA strategy", profit: 800 },
      { month: "Month 2", event: "AI caught market dip", profit: 4200 },
      { month: "Month 3", event: "Copy trading activated", profit: 7500 },
      { month: "Month 4", event: "Meme coin rally profits", profit: 15000 },
      { month: "Month 5", event: "Consistent compounding", profit: 20500 },
      { month: "Month 6", event: "Hit 6-figure milestone", profit: 10000 },
    ],
    quote: "I work full-time and have a family. TradeFlow lets my money work for me while I sleep.",
    stats: { winRate: 72, totalTrades: 156, avgHoldTime: "2 days" }
  },
  {
    id: 3,
    name: "David Park",
    title: "Crypto Enthusiast",
    avatar: "DP",
    location: "Miami, FL",
    joinDate: "December 2023",
    initialInvestment: 2500,
    currentPortfolio: 31000,
    returnPercent: 1140,
    tradingStyle: "High Risk / High Reward",
    favoriteFeature: "Whale Tracking",
    timeline: [
      { month: "Week 1", event: "First AI-assisted trade", profit: 500 },
      { month: "Week 2", event: "Whale alert on PEPE", profit: 2800 },
      { month: "Month 1", event: "Pattern detection gold", profit: 6000 },
      { month: "Month 2", event: "Multiple bots active", profit: 9500 },
      { month: "Month 3", event: "10x initial investment", profit: 9700 },
    ],
    quote: "The whale tracking feature alone is worth the subscription. Following smart money changed everything.",
    stats: { winRate: 65, totalTrades: 523, avgHoldTime: "45 minutes" }
  }
];

export const CaseStudies = () => {
  const [activeCase, setActiveCase] = useState(0);
  const study = caseStudies[activeCase];

  const nextCase = () => setActiveCase((prev) => (prev + 1) % caseStudies.length);
  const prevCase = () => setActiveCase((prev) => (prev - 1 + caseStudies.length) % caseStudies.length);

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-primary/50">
            <Trophy className="w-3 h-3 mr-1" />
            Real Success Stories
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trading Journey{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Case Studies
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Detailed breakdowns of how our traders transformed their portfolios with AI-powered trading
          </p>
        </motion.div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={prevCase}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex gap-2">
            {caseStudies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCase(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === activeCase ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={nextCase}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={study.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass border-primary/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-3 gap-0">
                  {/* Profile Section */}
                  <div className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-b md:border-b-0 md:border-r border-border/50">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold text-primary-foreground">
                        {study.avatar}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{study.name}</h3>
                        <p className="text-muted-foreground">{study.title}</p>
                        <p className="text-xs text-muted-foreground">{study.location}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Joined:</span>
                        <span>{study.joinDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Style:</span>
                        <Badge variant="secondary">{study.tradingStyle}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Favorite:</span>
                        <span>{study.favoriteFeature}</span>
                      </div>
                    </div>

                    <div className="mt-6 p-4 rounded-lg bg-background/50 border border-border/50">
                      <p className="text-sm italic text-muted-foreground">"{study.quote}"</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-6">
                      <div className="text-center p-2 rounded-lg bg-background/50">
                        <div className="text-lg font-bold text-success">{study.stats.winRate}%</div>
                        <div className="text-xs text-muted-foreground">Win Rate</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-background/50">
                        <div className="text-lg font-bold">{study.stats.totalTrades}</div>
                        <div className="text-xs text-muted-foreground">Trades</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-background/50">
                        <div className="text-lg font-bold">{study.stats.avgHoldTime}</div>
                        <div className="text-xs text-muted-foreground">Avg Hold</div>
                      </div>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="md:col-span-2 p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="text-center p-4 rounded-xl bg-muted/30">
                        <DollarSign className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                        <div className="text-2xl font-bold">${study.initialInvestment.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Initial Investment</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-success/10 border border-success/20">
                        <TrendingUp className="w-5 h-5 mx-auto mb-2 text-success" />
                        <div className="text-2xl font-bold text-success">${study.currentPortfolio.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Current Portfolio</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/20">
                        <BarChart3 className="w-5 h-5 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold text-primary">+{study.returnPercent}%</div>
                        <div className="text-xs text-muted-foreground">Total Return</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-accent/10 border border-accent/20">
                        <Trophy className="w-5 h-5 mx-auto mb-2 text-accent" />
                        <div className="text-2xl font-bold text-accent">${(study.currentPortfolio - study.initialInvestment).toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Total Profit</div>
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Trading Journey Timeline
                    </h4>
                    
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-success" />
                      <div className="space-y-4">
                        {study.timeline.map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-4 pl-8 relative"
                          >
                            <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-primary border-2 border-background" />
                            <div className="flex-1 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-primary">{item.month}</span>
                                <Badge variant="outline" className="text-success border-success/50">
                                  +${item.profit.toLocaleString()}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{item.event}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

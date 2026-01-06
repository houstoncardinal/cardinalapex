import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Lightbulb, Bot, Shield, Zap, BarChart3 } from 'lucide-react';

const roadmapPhases = [
  {
    id: 1,
    phase: "Phase 1",
    title: "Foundation",
    status: "current",
    description: "Core platform development and early access launch",
    features: [
      { name: "AI Pattern Recognition Engine", status: "complete" },
      { name: "Phantom Wallet Integration", status: "complete" },
      { name: "6 Trading Bot Strategies", status: "complete" },
      { name: "Basic Risk Management", status: "complete" },
      { name: "Early Access Program", status: "active" },
    ],
    icon: Bot,
  },
  {
    id: 2,
    phase: "Phase 2",
    title: "Enhancement",
    status: "upcoming",
    description: "Advanced features and community feedback integration",
    features: [
      { name: "Copy Trading System", status: "planned" },
      { name: "Advanced Order Types", status: "planned" },
      { name: "Mobile App (iOS/Android)", status: "planned" },
      { name: "Social Trading Features", status: "planned" },
      { name: "API Access for Developers", status: "planned" },
    ],
    icon: Zap,
  },
  {
    id: 3,
    phase: "Phase 3",
    title: "Scale",
    status: "future",
    description: "Enterprise features and ecosystem expansion",
    features: [
      { name: "Multi-Chain Support", status: "planned" },
      { name: "Institutional Dashboard", status: "planned" },
      { name: "White-Label Solutions", status: "planned" },
      { name: "Advanced Analytics Suite", status: "planned" },
      { name: "DAO Governance", status: "planned" },
    ],
    icon: BarChart3,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "complete":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "active":
      return "bg-primary/20 text-primary border-primary/30 animate-pulse";
    case "planned":
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getPhaseColor = (status: string) => {
  switch (status) {
    case "current":
      return "from-primary to-accent";
    case "upcoming":
      return "from-blue-500 to-indigo-500";
    case "future":
      return "from-purple-500 to-pink-500";
    default:
      return "from-muted to-muted";
  }
};

export const CaseStudies = () => {
  const [activePhase, setActivePhase] = useState(0);
  const phase = roadmapPhases[activePhase];
  const Icon = phase.icon;

  const nextPhase = () => setActivePhase((prev) => (prev + 1) % roadmapPhases.length);
  const prevPhase = () => setActivePhase((prev) => (prev - 1 + roadmapPhases.length) % roadmapPhases.length);

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
            <Lightbulb className="w-3 h-3 mr-1" />
            Our Vision
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Product{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Roadmap
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See where we are headed. Join early access to help shape our development priorities.
          </p>
        </motion.div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={prevPhase}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex gap-2">
            {roadmapPhases.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhase(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === activePhase ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={nextPhase}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass border-primary/20 overflow-hidden max-w-4xl mx-auto">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Phase Header */}
                  <div className={`p-8 bg-gradient-to-br ${getPhaseColor(phase.status)}`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <Badge className="bg-white/20 text-white border-white/30 mb-1">
                          {phase.phase}
                        </Badge>
                        <h3 className="text-2xl font-bold text-white">{phase.title}</h3>
                      </div>
                    </div>

                    <p className="text-white/90 mb-6">{phase.description}</p>

                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-white" />
                        <span className="text-white font-medium">Status</span>
                      </div>
                      <p className="text-white/80 text-sm">
                        {phase.status === "current" 
                          ? "Currently in development - Early access available"
                          : phase.status === "upcoming"
                          ? "Coming in Q2 2025"
                          : "Planned for Q4 2025"
                        }
                      </p>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="p-8">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      Features & Milestones
                    </h4>
                    
                    <div className="space-y-3">
                      {phase.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                        >
                          <span className="text-foreground">{feature.name}</span>
                          <Badge variant="outline" className={getStatusColor(feature.status)}>
                            {feature.status === "complete" ? "✓ Done" : feature.status === "active" ? "Building" : "Planned"}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground mt-8 text-sm"
        >
          Roadmap is subject to change based on community feedback and market conditions
        </motion.p>
      </div>
    </section>
  );
};

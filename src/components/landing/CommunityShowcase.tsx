import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Code, Shield, Zap, Bot, 
  Target, Sparkles, CheckCircle2, Rocket
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TechFeature {
  id: number;
  title: string;
  description: string;
  icon: typeof Code;
  color: string;
  tag: string;
}

const techFeatures: TechFeature[] = [
  {
    id: 1,
    title: "Real-Time Pattern Detection",
    description: "Our AI continuously scans for Head & Shoulders, Cup & Handle, Elliott Waves, and 15+ other chart patterns across 500+ tokens",
    icon: Target,
    color: "from-emerald-500 to-green-600",
    tag: "AI Analysis",
  },
  {
    id: 2,
    title: "On-Chain Intelligence",
    description: "Track whale wallet movements, exchange flows, and smart money accumulation patterns with real-time blockchain analytics",
    icon: Zap,
    color: "from-blue-500 to-indigo-600",
    tag: "Blockchain",
  },
  {
    id: 3,
    title: "Non-Custodial Architecture",
    description: "Your private keys never leave your wallet. All trades execute directly from your Phantom wallet with full transparency",
    icon: Shield,
    color: "from-purple-500 to-pink-600",
    tag: "Security",
  },
  {
    id: 4,
    title: "Customizable Risk Controls",
    description: "Set your own stop-loss limits, position sizing rules, and daily trade caps. The AI respects your risk tolerance",
    icon: Bot,
    color: "from-orange-500 to-red-600",
    tag: "Risk Mgmt",
  },
  {
    id: 5,
    title: "Solana-Native Speed",
    description: "Built on Solana for sub-second trade execution. When patterns emerge, your AI acts instantly",
    icon: Sparkles,
    color: "from-cyan-500 to-blue-600",
    tag: "Performance",
  },
  {
    id: 6,
    title: "Open Development",
    description: "We're building in public. Join our early access program to influence features and get priority access to new capabilities",
    icon: Code,
    color: "from-violet-500 to-purple-600",
    tag: "Community",
  },
];

const CommunityShowcase = () => {
  const navigate = useNavigate();

  return (
    <section className="relative z-10 py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Code className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Technology</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Built With <span className="text-primary">Real Technology</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            TradeFlow combines institutional-grade pattern recognition with Solana's speed. Here's what powers the platform.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {techFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden hover:border-primary/50 transition-all duration-300 h-full">
                <div 
                  className="h-2 w-full"
                  style={{ background: `linear-gradient(90deg, ${feature.color.split(' ')[0].replace('from-', '')} 0%, ${feature.color.split(' ')[1].replace('to-', '')} 100%)` }}
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.tag}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-foreground text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Why Join Early Access?</h3>
              <p className="text-muted-foreground">Be part of building the future of AI-powered trading</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Founding member pricing & benefits",
                "Direct access to development team",
                "Shape features with your feedback",
                "Priority support & onboarding",
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/auth?mode=signup")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-lg shadow-primary/25"
              >
                <Rocket className="w-4 h-4" />
                Join Early Access
              </motion.button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityShowcase;

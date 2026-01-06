import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  Twitter, Linkedin, Github, Trophy, TrendingUp, 
  Code2, Brain, Award, Star, Sparkles
} from "lucide-react";

const achievements = [
  { icon: Trophy, label: "10+ Years Trading", value: "Expert" },
  { icon: TrendingUp, label: "Pattern Recognition", value: "Master" },
  { icon: Code2, label: "Algorithm Developer", value: "Elite" },
  { icon: Brain, label: "AI/ML Specialist", value: "Advanced" },
];

const credentials = [
  "Former Quantitative Analyst",
  "Published Trading Researcher",
  "Certified Financial Technician",
  "Solana Developer Expert",
];

const TeamSection = () => {
  return (
    <section className="relative z-10 py-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Meet The Founder</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            The <span className="text-primary">Visionary</span> Behind TradeFlow
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built by a trader, for traders. TradeFlow is the culmination of years of 
            market experience and cutting-edge technology.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl opacity-50" />
            
            <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 md:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* Profile Image */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative flex-shrink-0"
                >
                  <div className="relative">
                    {/* Animated ring */}
                    <motion.div
                      className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary via-accent to-primary"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center overflow-hidden border-4 border-background">
                      <div className="text-6xl md:text-7xl font-bold text-primary">HQ</div>
                    </div>
                    {/* Status badge */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                        Active Trader
                      </Badge>
                    </div>
                  </div>
                </motion.div>

                {/* Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex-1 text-center lg:text-left"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-3">
                    <h3 className="text-2xl md:text-3xl font-bold">Hunain Qureshi</h3>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 w-fit mx-auto lg:mx-0">
                      CEO & Founder
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-2 font-medium">
                    Tech CEO, Cardinal Consulting
                  </p>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    A pattern recognition expert and professional stock & crypto trader with over 
                    a decade of experience. Hunain builds sophisticated trading algorithms that 
                    help traders and business owners achieve consistent profits through AI-powered 
                    market analysis.
                  </p>

                  {/* Credentials */}
                  <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
                    {credentials.map((credential, i) => (
                      <motion.div
                        key={credential}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Badge variant="secondary" className="bg-secondary/50 text-xs">
                          <Star className="w-3 h-3 mr-1 text-yellow-500" />
                          {credential}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-3 justify-center lg:justify-start">
                    {[
                      { icon: Twitter, href: "#", label: "Twitter" },
                      { icon: Linkedin, href: "#", label: "LinkedIn" },
                      { icon: Github, href: "#", label: "GitHub" },
                    ].map(({ icon: Icon, href, label }) => (
                      <motion.a
                        key={label}
                        href={href}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-lg bg-secondary/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Achievements Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-border/50"
              >
                {achievements.map((achievement, i) => (
                  <motion.div
                    key={achievement.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center p-4 rounded-xl bg-background/50 border border-border/30"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center">
                      <achievement.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{achievement.label}</p>
                    <p className="text-xs text-primary">{achievement.value}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <blockquote className="text-xl md:text-2xl font-medium text-muted-foreground italic max-w-2xl mx-auto">
              "I built TradeFlow because I believe everyone deserves access to 
              institutional-grade trading tools. AI should work for you, not against you."
            </blockquote>
            <p className="mt-4 text-sm text-primary font-semibold">— Hunain Qureshi</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;

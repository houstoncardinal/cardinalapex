import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Zap, Shield, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: typeof Zap;
  image: string;
}

const features: Feature[] = [
  {
    id: 1,
    title: 'Advanced Pattern Recognition',
    description: "Our AI analyzes Elliott Waves, Wyckoff patterns, Head & Shoulders formations, and smart money movements using institutional-grade algorithms developed by Cardinal Consulting's trading experts.",
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
  },
  {
    id: 2,
    title: 'Non-Custodial Security',
    description: "Your funds never leave your Phantom wallet. TradeFlow executes trades directly from your wallet with your approval - we never have access to your private keys or assets.",
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800',
  },
  {
    id: 3,
    title: 'Intelligent Risk Management',
    description: "Configure automatic stop-losses, position sizing limits, and daily trade caps. Our AI respects your risk tolerance and protects your capital with every trade.",
    icon: Bot,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
  },
];

const VideoTestimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % features.length);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const activeFeature = features[activeIndex];
  const Icon = activeFeature.icon;

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-card/30 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary/30">
            <Sparkles className="h-3 w-3 mr-1" />
            Platform Features
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Built for </span>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Serious Traders
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the technology powering TradeFlow - designed by traders, for traders
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Image Display */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <img
                    src={activeFeature.image}
                    alt={activeFeature.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Feature Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary/90 text-primary-foreground text-sm px-4 py-1 shadow-lg">
                  <Icon className="h-4 w-4 mr-2" />
                  Feature
                </Badge>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="rounded-full border-border/50 hover:border-primary hover:bg-primary/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeIndex
                        ? 'w-8 bg-primary'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="rounded-full border-border/50 hover:border-primary hover:bg-primary/10"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>

          {/* Feature Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="p-4 rounded-xl bg-primary/10 w-fit">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  {activeFeature.title}
                </h3>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {activeFeature.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 gap-3 pt-6 border-t border-border/50">
              {features
                .filter((_, i) => i !== activeIndex)
                .map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveIndex(features.findIndex((item) => item.id === f.id))}
                    className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/30 hover:border-primary/30 transition-all text-left group"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <f.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {f.title}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonials;

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle, TrendingUp, Zap, BookOpen, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubscribed(true);
    toast.success("Welcome to the CardinalApex community!");
    setEmail("");
  };

  const contentPreviews = [
    {
      icon: TrendingUp,
      title: "Weekly Market Analysis",
      description: "Expert insights on crypto & stock trends",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Zap,
      title: "AI Trading Signals",
      description: "High-confidence trade opportunities",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: BookOpen,
      title: "Strategy Guides",
      description: "Advanced trading techniques & tutorials",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: Gift,
      title: "Exclusive Offers",
      description: "Early access & member-only discounts",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Newsletter</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Stay <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Ahead</span> of the Market
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join 50,000+ traders receiving weekly insights, AI signals, and exclusive trading strategies.
            </p>
          </motion.div>

          {/* Content Preview Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          >
            {contentPreviews.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-card/50 border border-border/50 rounded-xl p-4 backdrop-blur-sm"
              >
                <div className={`w-10 h-10 ${item.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Subscription Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-card/80 border border-border rounded-2xl p-8 backdrop-blur-sm"
          >
            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-2xl font-bold mb-2">You're In!</h3>
                <p className="text-muted-foreground mb-4">
                  Check your inbox for a confirmation email and your first trading insights.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsSubscribed(false)}
                >
                  Subscribe Another Email
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 text-lg bg-background/50 border-border"
                    />
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={!email || isLoading}
                    className="h-14 px-8 text-lg"
                    size="lg"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Send className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <>
                        Subscribe <Send className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Free forever</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>No spam, ever</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Unsubscribe anytime</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Sample Newsletter Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <p className="text-center text-sm text-muted-foreground mb-4">Preview of what you'll receive:</p>
            <div className="bg-card/50 border border-border rounded-xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">CA</span>
                </div>
                <div>
                  <p className="font-semibold">CardinalApex Weekly</p>
                  <p className="text-xs text-muted-foreground">Monday, 8:00 AM</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-1">🚀 This Week's Top Signal: SOL Breakout Alert</h4>
                  <p className="text-sm text-muted-foreground">
                    Our AI detected a high-confidence cup & handle pattern forming on SOL/USD. 
                    Entry point: $145, Target: $180, Stop loss: $135...
                  </p>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-3 py-1 bg-success/20 text-success rounded-full">+23% Last Week</span>
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full">3 New Signals</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;

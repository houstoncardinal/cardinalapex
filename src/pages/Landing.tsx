import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, TrendingUp, Zap, Shield, ChevronRight, BarChart3, Wallet, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Total Volume", value: "$2.4B+", change: "+127%" },
  { label: "Active Traders", value: "50K+", change: "+89%" },
  { label: "Avg. Returns", value: "47.3%", change: "+23%" },
  { label: "AI Accuracy", value: "94.7%", change: "+5%" },
];

const features = [
  {
    icon: Bot,
    title: "AI Trading Agents",
    description: "Aggressive AI bots that analyze markets 24/7 and execute trades at the perfect moment",
  },
  {
    icon: TrendingUp,
    title: "Stocks & Crypto",
    description: "Trade both markets from one platform. NASDAQ, NYSE, Bitcoin, Ethereum, and 500+ assets",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-millisecond execution. Your AI agents never miss an opportunity",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Built-in stop-losses, position sizing, and portfolio protection powered by AI",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-chart-purple/10 rounded-full blur-3xl animate-float" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground">TradeFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
          <Button onClick={() => navigate("/auth?mode=signup")} className="glow-primary">
            Start Trading <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-16 pb-24 lg:px-12 lg:pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">AI-Powered Trading Revolution</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Let <span className="text-primary">AI Agents</span> Trade<br />
              While You <span className="text-accent">Sleep</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Deploy aggressive AI trading bots that analyze crypto & stocks 24/7. 
              One-click setup. Maximum profits. Zero effort.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth?mode=signup")}
                className="text-lg px-8 py-6 glow-primary"
              >
                <Wallet className="h-5 w-5 mr-2" />
                Start Free with $10K Demo
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/auth")}
                className="text-lg px-8 py-6"
              >
                Watch AI Trade Live
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="glass rounded-2xl p-6 text-center opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-success text-sm">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-24 lg:px-12 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Built for <span className="text-primary">Maximum Profits</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Every feature designed to help you make more money with less effort
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={cn(
                  "glass rounded-2xl p-8 transition-all duration-300 cursor-pointer opacity-0 animate-fade-in",
                  hoveredFeature === index && "border-primary/50 glow-primary"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 mb-4">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 border-primary/20">
            <Bot className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Let AI Make You Money?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join 50,000+ traders who are already using TradeFlow's AI agents 
              to generate passive income from crypto and stocks.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/auth?mode=signup")}
              className="text-lg px-10 py-6 glow-primary"
            >
              Create Free Account <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Start with $10,000 demo balance
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 lg:px-12 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">TradeFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 TradeFlow. AI-powered trading for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

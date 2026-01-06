import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Bot, TrendingUp, Zap, Shield, ChevronRight, BarChart3, Wallet, ArrowUpRight,
  LineChart, Lock, Globe, Cpu, Target, Award, Users, Clock, CheckCircle2,
  Sparkles, Play, ArrowRight, Star, Activity, Eye, Layers, Rocket, Check,
  HelpCircle, Crown, Diamond, X, Video, DollarSign, TrendingDown, Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { FloatingNav } from "@/components/landing/FloatingNav";
import { ChatWidget } from "@/components/landing/ChatWidget";
import { TrustBadges } from "@/components/landing/TrustBadges";
import { FeatureTour } from "@/components/landing/FeatureTour";
import { ROICalculator } from "@/components/landing/ROICalculator";
import { PartnerCarousel } from "@/components/landing/PartnerCarousel";
import { LiveTradeNotifications } from "@/components/landing/LiveTradeNotifications";
import { ReferralProgram } from "@/components/landing/ReferralProgram";
import { TradingSimulator } from "@/components/landing/TradingSimulator";
import { CountdownTimer } from "@/components/landing/CountdownTimer";
import MobileAppDownload from "@/components/landing/MobileAppDownload";
import NewsletterSignup from "@/components/landing/NewsletterSignup";
import MarketTicker from "@/components/landing/MarketTicker";
import ComparisonSlider from "@/components/landing/ComparisonSlider";
import VideoTestimonials from "@/components/landing/VideoTestimonials";
import { CaseStudies } from "@/components/landing/CaseStudies";
import { InteractiveDemo } from "@/components/landing/InteractiveDemo";
import SocialProofFeed from "@/components/landing/SocialProofFeed";
import LivePerformanceDashboard from "@/components/landing/LivePerformanceDashboard";
import TeamSection from "@/components/landing/TeamSection";
import MarketSentiment from "@/components/landing/MarketSentiment";
import CommunityShowcase from "@/components/landing/CommunityShowcase";
import PressMentions from "@/components/landing/PressMentions";
import StickyCtaBar from "@/components/landing/StickyCtaBar";
import PricingComparisonTable from "@/components/landing/PricingComparisonTable";
import ReferralDashboard from "@/components/landing/ReferralDashboard";
import ThemeToggle from "@/components/ThemeToggle";

// Comparison data for the table
const comparisonData: { feature: string; tradeflow: boolean | "partial"; manual: boolean | "partial"; others: boolean | "partial" }[] = [
  { feature: "24/7 Market Analysis", tradeflow: true, manual: false, others: "partial" },
  { feature: "Sub-millisecond Execution", tradeflow: true, manual: false, others: false },
  { feature: "AI Pattern Recognition", tradeflow: true, manual: false, others: "partial" },
  { feature: "Smart Money Flow Detection", tradeflow: true, manual: false, others: false },
  { feature: "Automatic Stop-Loss", tradeflow: true, manual: "partial", others: true },
  { feature: "Multi-Strategy Bots", tradeflow: true, manual: false, others: "partial" },
  { feature: "Real-time Risk Management", tradeflow: true, manual: false, others: "partial" },
  { feature: "Solana Integration", tradeflow: true, manual: true, others: "partial" },
  { feature: "No Coding Required", tradeflow: true, manual: true, others: false },
  { feature: "Copy Trading", tradeflow: true, manual: false, others: true },
];

// Live stats for social proof
const liveStats = [
  { label: "Active Traders", value: 12847, prefix: "", suffix: "+", icon: Users },
  { label: "Trades Executed", value: 2847632, prefix: "", suffix: "", icon: Activity },
  { label: "Total Profits", value: 47800000, prefix: "$", suffix: "", icon: DollarSign },
  { label: "Win Rate", value: 94, prefix: "", suffix: "%", icon: TrendingUp },
];

const features = [
  {
    icon: Bot,
    title: "AI Trading Agents",
    description: "Deploy aggressive AI bots that analyze markets 24/7 and execute trades at the perfect moment with 94%+ accuracy",
    highlight: "24/7 Automated",
    color: "from-emerald-500 to-green-600",
  },
  {
    icon: LineChart,
    title: "Advanced Pattern Recognition",
    description: "Detect Head & Shoulders, Elliott Waves, Wyckoff patterns, and smart money movements before they happen",
    highlight: "85%+ Confidence",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Zap,
    title: "Lightning Fast Execution",
    description: "Sub-millisecond trade execution on Solana blockchain. Your AI agents never miss an opportunity",
    highlight: "< 1ms Speed",
    color: "from-yellow-500 to-orange-600",
  },
  {
    icon: Shield,
    title: "Smart Risk Management",
    description: "Built-in stop-losses, position sizing, and portfolio protection. Never lose more than you're comfortable with",
    highlight: "AI Protected",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: Target,
    title: "Precision Entry & Exit",
    description: "RSI, MACD, Bollinger Bands, VWAP - all analyzed together to find the perfect trade timing",
    highlight: "Multi-Indicator",
    color: "from-rose-500 to-red-600",
  },
  {
    icon: Globe,
    title: "Multi-Market Trading",
    description: "Trade crypto, meme coins, stocks - all from one unified platform. BTC, ETH, SOL, PEPE, and 500+ assets",
    highlight: "500+ Assets",
    color: "from-indigo-500 to-violet-600",
  },
];

const tradingBots = [
  { name: "Alpha Predator", strategy: "Aggressive Momentum", winRate: 94, trades: "2.4K", profit: "+$847K" },
  { name: "Trend Surfer", strategy: "Swing Trading", winRate: 89, trades: "1.8K", profit: "+$623K" },
  { name: "Scalp Master", strategy: "High-Frequency", winRate: 91, trades: "12.3K", profit: "+$1.2M" },
];

const testimonials = [
  { name: "Marcus R.", role: "Day Trader", quote: "Made more in 3 months than my entire year of manual trading", profit: "+$47,230" },
  { name: "Sarah K.", role: "Crypto Investor", quote: "The AI detected a pattern I never would have seen. Life-changing.", profit: "+$128,500" },
  { name: "David L.", role: "Portfolio Manager", quote: "Finally, an AI that actually delivers on its promises", profit: "+$312,000" },
];

const steps = [
  { step: 1, title: "Connect Your Wallet", description: "Link your Phantom wallet securely in one click", icon: Wallet },
  { step: 2, title: "Choose Your Strategy", description: "Select from aggressive, balanced, or conservative AI bots", icon: Bot },
  { step: 3, title: "Watch AI Trade", description: "Sit back while AI executes profitable trades 24/7", icon: Eye },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for exploring AI trading",
    icon: Rocket,
    features: [
      "1 AI Trading Bot",
      "Basic Pattern Detection",
      "5 Trades per Day",
      "Email Alerts",
      "Community Support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For serious traders",
    icon: Crown,
    features: [
      "Unlimited AI Bots",
      "Advanced Pattern Recognition",
      "Unlimited Trades",
      "Real-time Alerts",
      "Priority Support",
      "Copy Trading Access",
      "Custom Strategies",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    name: "Elite",
    price: "$149",
    period: "/month",
    description: "Maximum profit potential",
    icon: Diamond,
    features: [
      "Everything in Pro",
      "VIP Signal Groups",
      "1-on-1 Strategy Calls",
      "Early Access Features",
      "White-Glove Onboarding",
      "Dedicated Account Manager",
      "Custom API Access",
    ],
    cta: "Go Elite",
    popular: false,
  },
];

const faqItems = [
  {
    question: "How does AI trading actually work?",
    answer: "Our AI trading bots use advanced machine learning algorithms to analyze market patterns, technical indicators, and smart money flows in real-time. When high-confidence trading opportunities are detected (85%+ confidence), the AI automatically executes trades on your behalf through your connected Phantom wallet on the Solana blockchain.",
  },
  {
    question: "Is my money safe with AI trading?",
    answer: "Absolutely. Your funds remain in your own Phantom wallet at all times - we never have custody of your assets. Our AI includes built-in risk management with automatic stop-losses, position sizing limits, and portfolio protection. Bank-grade encryption protects all your data and API connections.",
  },
  {
    question: "What returns can I expect?",
    answer: "While past performance doesn't guarantee future results, our top AI bots have historically achieved 89-94% win rates. Returns vary based on market conditions, strategy selection, and risk tolerance settings. Our aggressive growth bots are designed for maximum profit potential, while conservative options prioritize capital preservation.",
  },
  {
    question: "Do I need trading experience?",
    answer: "Not at all! TradeFlow is designed to be beginner-friendly. Simply connect your wallet, choose an AI trading strategy (aggressive, balanced, or conservative), and let the AI handle everything. Our visual dashboard shows you exactly what the AI is doing in real-time, so you can learn while you earn.",
  },
  {
    question: "Which cryptocurrencies can I trade?",
    answer: "TradeFlow supports trading on the Solana blockchain, including SOL, popular meme coins (PEPE, SHIB, FLOKI, DOGE, BONK, WIF), and 500+ other tokens. Our AI constantly scans for the best opportunities across all supported assets.",
  },
  {
    question: "Can I stop the AI at any time?",
    answer: "Yes, you have full control. You can pause, stop, or modify your AI bots instantly from the dashboard. Any open positions can be manually closed, and you can adjust risk settings, trade limits, and strategy parameters at any time.",
  },
  {
    question: "What makes TradeFlow different from other trading bots?",
    answer: "TradeFlow combines institutional-grade pattern recognition (Head & Shoulders, Elliott Waves, Wyckoff analysis) with real-time smart money flow tracking and lightning-fast Solana execution. Our AI detects opportunities that human traders miss, with sub-millisecond execution speeds that ensure you never miss a trade.",
  },
];

// Animated counter component
const AnimatedCounter = ({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + "K";
    return num.toString();
  };
  
  return <span>{prefix}{formatNumber(count)}{suffix}</span>;
};

const Landing = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [activeBot, setActiveBot] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveBot((prev) => (prev + 1) % tradingBots.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSignup = () => {
    navigate(email ? `/auth?mode=signup&email=${encodeURIComponent(email)}` : "/auth?mode=signup");
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden scroll-smooth">
      {/* Floating Navigation */}
      <FloatingNav />

      {/* Market Ticker */}
      <div className="sticky top-0 z-40">
        <MarketTicker />
      </div>

      {/* Animated background with multiple layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.15)_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_hsl(var(--accent)/0.1)_0%,_transparent_50%)]" />
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px]"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-chart-purple/10 rounded-full blur-[80px]"
          animate={{ 
            x: [-50, 50, -50],
            y: [-30, 30, -30],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.05)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-50 flex items-center justify-between px-4 sm:px-6 py-4 lg:px-12"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-foreground">TradeFlow</span>
            <span className="text-[10px] text-muted-foreground hidden sm:block">by Cardinal Consulting</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="hidden md:flex text-muted-foreground hover:text-foreground" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              size="sm" 
              onClick={handleSignup}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-4 sm:px-6 shadow-lg shadow-primary/25"
            >
              <span className="hidden sm:inline">Start Trading</span>
              <span className="sm:hidden">Start</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-16 pb-24 sm:pb-32 lg:px-12 lg:pt-20"
      >
        {/* Live Trade Notifications - contained within hero */}
        <LiveTradeNotifications contained />
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 sm:space-y-8">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="text-sm text-foreground font-medium">AI-Powered Trading Revolution</span>
              <Badge variant="secondary" className="bg-primary/20 text-primary text-[10px]">NEW</Badge>
            </motion.div>
            
            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-[1.1] tracking-tight">
                Let <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[size:200%] animate-[gradient_3s_linear_infinite]">AI Agents</span> Trade
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>While You{" "}
                <span className="relative inline-block">
                  <span className="text-accent">Sleep</span>
                  <motion.div 
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-accent to-primary rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>
              </h1>
            </motion.div>
            
            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              Deploy aggressive AI trading bots that analyze{" "}
              <span className="text-foreground font-medium">crypto & meme coins</span> 24/7.
              <br className="hidden sm:block" />
              Real trades. Real profits. <span className="text-primary font-semibold">Zero manual effort.</span>
            </motion.p>

            {/* Quick Signup Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 max-w-lg mx-auto"
            >
              <div className="relative w-full sm:w-auto sm:flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 pl-5 pr-4 text-base bg-card/80 border-border/50 rounded-xl w-full"
                />
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  onClick={handleSignup}
                  className="h-14 text-base sm:text-lg px-6 sm:px-8 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-xl shadow-primary/30 w-full sm:w-auto rounded-xl"
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Trading Now
                </Button>
              </motion.div>
            </motion.div>

            {/* Watch Demo Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center pt-4"
            >
              <motion.button
                onClick={() => setVideoModalOpen(true)}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-card/50 border border-border/50 hover:border-primary/50 transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow">
                  <Play className="h-4 w-4 text-primary-foreground ml-0.5" />
                </div>
                <span className="text-foreground font-medium">Watch AI Trade Live</span>
                <span className="text-xs text-muted-foreground">(2 min)</span>
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Bank-grade security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>Start in 60 seconds</span>
              </div>
            </motion.div>
          </div>

          {/* 3D Trading Visualization */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-12 sm:mt-16"
          >
            <div className="relative max-w-5xl mx-auto" style={{ perspective: "1000px" }}>
              {/* 3D Card Container */}
              <motion.div
                className="relative"
                animate={{ rotateX: [0, 2, 0], rotateY: [-2, 2, -2] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Main Dashboard Card */}
                <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-primary/20 relative overflow-hidden">
                  {/* Animated scan line */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent h-20"
                    animate={{ y: [-80, 400, -80] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                        <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm sm:text-base">AI Trading Dashboard</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Real-time execution</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse text-xs">
                      <Activity className="h-3 w-3 mr-1" />
                      LIVE
                    </Badge>
                  </div>

                  {/* Simulated Chart */}
                  <div className="relative h-48 sm:h-64 mb-6 rounded-xl bg-background/50 overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d="M0,150 Q50,120 100,100 T200,80 T300,60 T400,30"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 1 }}
                      />
                      <motion.path
                        d="M0,150 Q50,120 100,100 T200,80 T300,60 T400,30 V200 H0 Z"
                        fill="url(#chartGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 2 }}
                      />
                      {/* Trade markers */}
                      {[
                        { cx: 100, cy: 100, type: "buy" },
                        { cx: 200, cy: 80, type: "buy" },
                        { cx: 300, cy: 60, type: "sell" },
                      ].map((trade, i) => (
                        <motion.g key={i}>
                          <motion.circle
                            cx={trade.cx}
                            cy={trade.cy}
                            r="8"
                            fill={trade.type === "buy" ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"}
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ delay: 2.5 + i * 0.3, duration: 0.4 }}
                          />
                          <motion.circle
                            cx={trade.cx}
                            cy={trade.cy}
                            r="16"
                            fill="none"
                            stroke={trade.type === "buy" ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"}
                            strokeWidth="2"
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{ delay: 2.5 + i * 0.3, duration: 1, repeat: Infinity, repeatDelay: 2 }}
                          />
                        </motion.g>
                      ))}
                    </svg>
                    
                    {/* Floating trade notifications */}
                    <AnimatePresence>
                      <motion.div
                        className="absolute top-4 right-4 glass rounded-lg px-3 py-2 text-xs"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 3 }}
                      >
                        <span className="text-green-400 font-semibold">+12.4%</span>
                        <span className="text-muted-foreground ml-2">SOL/USDC</span>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Bot Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 relative z-10">
                    {tradingBots.map((bot, index) => (
                      <motion.div
                        key={bot.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                        className={cn(
                          "p-4 rounded-xl transition-all duration-300 cursor-pointer",
                          activeBot === index 
                            ? "bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/50" 
                            : "bg-background/50 border border-border/50 hover:border-primary/30"
                        )}
                        onClick={() => setActiveBot(index)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-foreground text-sm">{bot.name}</span>
                          <Badge variant="outline" className="text-[10px] text-primary border-primary/50">
                            {bot.winRate}% Win
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{bot.strategy}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{bot.trades} trades</span>
                          <span className="text-sm font-bold text-green-400">{bot.profit}</span>
                        </div>
                        {activeBot === index && (
                          <motion.div
                            className="mt-3 pt-3 border-t border-primary/20"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                          >
                            <div className="flex items-center gap-2 text-xs text-primary">
                              <Activity className="h-3 w-3 animate-pulse" />
                              <span>Analyzing markets...</span>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 3D Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 glass rounded-xl px-4 py-2 text-sm"
                  animate={{ y: [0, -10, 0], rotateZ: [0, 2, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transform: "translateZ(40px)" }}
                >
                  <span className="text-green-400 font-bold">+$1,247</span>
                  <span className="text-muted-foreground ml-1">today</span>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 glass rounded-xl px-4 py-2 text-sm"
                  animate={{ y: [0, 8, 0], rotateZ: [0, -2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  style={{ transform: "translateZ(30px)" }}
                >
                  <span className="text-primary font-bold">94%</span>
                  <span className="text-muted-foreground ml-1">accuracy</span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Social Proof Stats Section */}
      <section className="relative z-10 px-4 sm:px-6 py-12 sm:py-16 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border-primary/20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {liveStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1">
                    <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-border/50">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Live data updated every second</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <span>Traders from 150+ countries</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>$500M+ secured assets</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">Simple Setup</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Start Trading in <span className="text-primary">3 Simple Steps</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
              From signup to your first AI-powered trade in under 60 seconds
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-1/2 z-0" />
                )}
                <div className="glass rounded-2xl p-6 sm:p-8 text-center relative z-10 h-full">
                  <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto mb-4 sm:mb-6">
                    <item.icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground" />
                  </div>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 lg:px-12 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <Badge variant="outline" className="mb-4 text-accent border-accent/30">Advanced Technology</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Built for <span className="text-primary">Maximum Profits</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
              Cutting-edge AI technology combined with professional trading strategies
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "glass rounded-2xl p-6 sm:p-8 transition-all duration-300 cursor-pointer group",
                  hoveredFeature === index && "border-primary/50 shadow-xl shadow-primary/10"
                )}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={cn(
                  "flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br mb-4 sm:mb-5 transition-transform duration-300 group-hover:scale-110",
                  feature.color
                )}>
                  <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <Badge variant="secondary" className="mb-3 text-[10px] bg-primary/10 text-primary">
                  {feature.highlight}
                </Badge>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm sm:text-base">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">Success Stories</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Traders <span className="text-accent">Love</span> TradeFlow
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="glass rounded-2xl p-6 sm:p-8"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground mb-4 italic text-sm sm:text-base">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-sm">
                    {testimonial.profit}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <VideoTestimonials />

      {/* Case Studies */}
      <CaseStudies />

      {/* Social Proof Feed */}
      <SocialProofFeed />

      {/* Live Performance Dashboard */}
      <LivePerformanceDashboard />

      {/* Market Sentiment */}
      <MarketSentiment />

      {/* Team Section */}
      <TeamSection />

      {/* Community Showcase */}
      <CommunityShowcase />

      {/* Press Mentions */}
      <PressMentions />

      {/* Interactive Demo */}
      <InteractiveDemo />

      {/* Comparison Slider */}
      <ComparisonSlider />

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 lg:px-12 bg-gradient-to-b from-background to-secondary/30">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Choose Your <span className="text-primary">Trading Power</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
              Start free and scale as your profits grow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={cn(
                  "relative glass rounded-2xl p-6 sm:p-8 transition-all duration-300",
                  plan.popular && "border-primary/50 shadow-xl shadow-primary/10 scale-105"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    plan.popular 
                      ? "bg-gradient-to-br from-primary to-accent" 
                      : "bg-secondary"
                  )}>
                    <plan.icon className={cn(
                      "h-6 w-6",
                      plan.popular ? "text-primary-foreground" : "text-primary"
                    )} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    className={cn(
                      "w-full h-12",
                      plan.popular 
                        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground" 
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    )}
                    onClick={handleSignup}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Comparison Table */}
      <PricingComparisonTable />

      {/* Referral Dashboard */}
      <ReferralDashboard />

      {/* Comparison Table Section */}
      <section id="comparison" className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 lg:px-12 bg-gradient-to-b from-background to-secondary/30">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">Why TradeFlow</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              TradeFlow vs <span className="text-primary">The Competition</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
              See why thousands of traders choose TradeFlow over manual trading and other platforms
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl overflow-hidden border-primary/20"
          >
            {/* Table Header */}
            <div className="grid grid-cols-4 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50">
              <div className="p-4 sm:p-6 font-semibold text-foreground text-sm sm:text-base">Feature</div>
              <div className="p-4 sm:p-6 text-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                    <BarChart3 className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-primary text-sm sm:text-base">TradeFlow</span>
                </div>
              </div>
              <div className="p-4 sm:p-6 text-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="font-medium text-muted-foreground text-sm sm:text-base">Manual</span>
                </div>
              </div>
              <div className="p-4 sm:p-6 text-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="font-medium text-muted-foreground text-sm sm:text-base">Others</span>
                </div>
              </div>
            </div>

            {/* Table Body */}
            {comparisonData.map((row, index) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "grid grid-cols-4 border-b border-border/30 hover:bg-primary/5 transition-colors",
                  index === comparisonData.length - 1 && "border-b-0"
                )}
              >
                <div className="p-4 sm:p-5 text-sm text-foreground">{row.feature}</div>
                <div className="p-4 sm:p-5 flex justify-center">
                  {row.tradeflow === true ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/20">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  ) : row.tradeflow === "partial" ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20">
                      <Minus className="h-4 w-4 text-yellow-500" />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/20">
                      <X className="h-4 w-4 text-red-500" />
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-5 flex justify-center">
                  {row.manual === true ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/20">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  ) : row.manual === "partial" ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20">
                      <Minus className="h-4 w-4 text-yellow-500" />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/20">
                      <X className="h-4 w-4 text-red-500" />
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-5 flex justify-center">
                  {row.others === true ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/20">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  ) : row.others === "partial" ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20">
                      <Minus className="h-4 w-4 text-yellow-500" />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/20">
                      <X className="h-4 w-4 text-red-500" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground mb-4">
              <Check className="h-4 w-4 inline text-green-500 mr-1" /> Full support
              <Minus className="h-4 w-4 inline text-yellow-500 mx-1 ml-4" /> Partial support
              <X className="h-4 w-4 inline text-red-500 mx-1 ml-4" /> Not available
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4 text-accent border-accent/30">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Common <span className="text-primary">Questions</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Everything you need to know about AI trading
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="glass rounded-xl px-6 border-none"
                >
                  <AccordionTrigger className="text-left text-foreground hover:no-underline py-5">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-medium">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 pl-8">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <TrustBadges />

      {/* Final CTA Section */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-card to-accent/10 border border-primary/30 p-8 sm:p-12 lg:p-16">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-[80px]" />
            
            <div className="relative text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block"
              >
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto mb-6 sm:mb-8">
                  <Rocket className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
                </div>
              </motion.div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
                Ready to Let AI Make You Money?
              </h2>
              <p className="text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto text-base sm:text-lg">
                Join traders worldwide who are using TradeFlow's AI agents 
                to generate profits from crypto and meme coins.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="lg" 
                    onClick={handleSignup}
                    className="h-14 text-lg px-8 sm:px-10 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-xl shadow-primary/30 rounded-xl w-full sm:w-auto"
                  >
                    Create Free Account <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </motion.div>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate("/auth")}
                  className="h-14 text-lg px-8 rounded-xl border-border/50"
                >
                  Sign In
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-6 flex flex-wrap items-center justify-center gap-4">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  No credit card
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="h-4 w-4 text-primary" />
                  Bank-grade security
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-primary" />
                  Start instantly
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 py-8 lg:px-12 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-semibold text-foreground">TradeFlow</span>
              <p className="text-xs text-muted-foreground">by Cardinal Consulting</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>Created by Hunain Qureshi</span>
            <span className="hidden sm:inline">•</span>
            <span>© 2024 TradeFlow</span>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 bg-background border-primary/20 overflow-hidden">
          <div className="relative">
            {/* Close button */}
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background transition-colors"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
            
            {/* Video container */}
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 relative">
              {/* Placeholder for actual video - replace with real video embed */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-6">
                    <Play className="h-10 w-10 text-primary-foreground ml-1" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">AI Trading Demo</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Watch our AI agents detect patterns and execute profitable trades in real-time
                  </p>
                  
                  {/* Simulated video preview with trading animation */}
                  <div className="glass rounded-xl p-4 max-w-lg mx-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm text-foreground font-medium">Live Trading Session</span>
                      </div>
                      <Badge className="bg-primary/20 text-primary text-xs">Demo Mode</Badge>
                    </div>
                    
                    <div className="h-32 relative rounded-lg bg-background/50 overflow-hidden mb-4">
                      <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                        <motion.path
                          d="M0,70 Q30,60 60,50 T120,40 T180,30 T240,35 T300,20"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="2"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        />
                      </svg>
                      <motion.div
                        className="absolute top-4 right-4 glass rounded-md px-2 py-1 text-xs"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, repeat: Infinity, repeatDelay: 2 }}
                      >
                        <span className="text-green-400 font-semibold">+8.2%</span>
                      </motion.div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Pattern: Head & Shoulders</span>
                      <span className="text-primary font-medium">Confidence: 94%</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-4">
                    Full video coming soon • Sign up for early access
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Countdown Timer */}
      <CountdownTimer />

      {/* Trading Simulator */}
      <TradingSimulator />

      {/* ROI Calculator */}
      <ROICalculator />

      {/* Feature Tour */}
      <FeatureTour />

      {/* Referral Program */}
      <ReferralProgram />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Partner Carousel */}
      <PartnerCarousel />

      {/* Mobile App Download */}
      <MobileAppDownload />

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Chat Widget */}
      <ChatWidget />

      {/* Sticky CTA Bar */}
      <StickyCtaBar />

      {/* CSS for gradient animation */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default Landing;

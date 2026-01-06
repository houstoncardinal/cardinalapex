import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Gift, Users, DollarSign, Copy, Check, Share2, 
  TrendingUp, Trophy, Star, Sparkles, ArrowRight,
  Twitter, MessageCircle, Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReferralTier {
  name: string;
  minReferrals: number;
  reward: string;
  bonus: string;
  color: string;
}

const referralTiers: ReferralTier[] = [
  { name: "Starter", minReferrals: 0, reward: "10%", bonus: "$0", color: "from-slate-500 to-slate-600" },
  { name: "Bronze", minReferrals: 5, reward: "15%", bonus: "$50", color: "from-amber-600 to-amber-700" },
  { name: "Silver", minReferrals: 15, reward: "20%", bonus: "$150", color: "from-slate-400 to-slate-500" },
  { name: "Gold", minReferrals: 30, reward: "25%", bonus: "$500", color: "from-yellow-500 to-amber-500" },
  { name: "Diamond", minReferrals: 50, reward: "30%", bonus: "$1,000", color: "from-cyan-400 to-blue-500" },
];

interface RecentReferral {
  id: number;
  name: string;
  date: string;
  status: "pending" | "active" | "converted";
  earnings: string;
}

const ReferralDashboard = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [referralCode] = useState("TRADE" + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [stats, setStats] = useState({
    totalReferrals: 23,
    activeReferrals: 18,
    pendingRewards: 847,
    totalEarnings: 2340,
  });
  const [recentReferrals, setRecentReferrals] = useState<RecentReferral[]>([
    { id: 1, name: "Alex M.", date: "2 hours ago", status: "active", earnings: "$24" },
    { id: 2, name: "Sarah K.", date: "5 hours ago", status: "converted", earnings: "$67" },
    { id: 3, name: "Mike R.", date: "1 day ago", status: "active", earnings: "$31" },
    { id: 4, name: "Emma L.", date: "2 days ago", status: "pending", earnings: "$0" },
  ]);

  const referralLink = `https://tradeflow.ai/ref/${referralCode}`;
  
  const currentTier = referralTiers.reduce((prev, current) => 
    stats.totalReferrals >= current.minReferrals ? current : prev
  );
  
  const nextTier = referralTiers.find(t => t.minReferrals > stats.totalReferrals);
  const progressToNext = nextTier 
    ? ((stats.totalReferrals - currentTier.minReferrals) / (nextTier.minReferrals - currentTier.minReferrals)) * 100
    : 100;

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setStats(prev => ({
          ...prev,
          pendingRewards: prev.pendingRewards + Math.floor(Math.random() * 10),
        }));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Link Copied!",
      description: "Your referral link has been copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = encodeURIComponent("Join me on TradeFlow and get AI-powered trading! Use my link for bonus rewards:");
    const url = encodeURIComponent(referralLink);
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      email: `mailto:?subject=Join%20TradeFlow&body=${text}%20${url}`,
    };
    
    window.open(urls[platform], "_blank");
  };

  const getStatusBadge = (status: RecentReferral["status"]) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      active: "bg-blue-500/20 text-blue-500 border-blue-500/30",
      converted: "bg-green-500/20 text-green-500 border-green-500/30",
    };
    return styles[status];
  };

  return (
    <section className="relative z-10 py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Gift className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Referral Program</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Earn While You <span className="text-primary">Share</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Invite friends to TradeFlow and earn up to 30% commission on their trades. 
            Track your rewards in real-time.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: "Total Referrals", value: stats.totalReferrals, suffix: "" },
              { icon: TrendingUp, label: "Active Users", value: stats.activeReferrals, suffix: "" },
              { icon: DollarSign, label: "Pending Rewards", value: stats.pendingRewards, prefix: "$" },
              { icon: Trophy, label: "Total Earnings", value: stats.totalEarnings, prefix: "$" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <motion.p 
                      className="text-2xl font-bold text-foreground"
                      key={stat.value}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                    >
                      {stat.prefix}{stat.value.toLocaleString()}{stat.suffix}
                    </motion.p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Referral Link Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-primary" />
                    Your Referral Link
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      value={referralLink} 
                      readOnly 
                      className="bg-secondary/50 font-mono text-sm"
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={handleCopy}
                        className="bg-primary text-primary-foreground"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </motion.div>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                    <p className="text-sm text-foreground">
                      Your code: <span className="font-bold text-primary">{referralCode}</span>
                    </p>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-3">Share via:</p>
                    <div className="flex gap-2">
                      {[
                        { icon: Twitter, name: "twitter", label: "Twitter" },
                        { icon: MessageCircle, name: "telegram", label: "Telegram" },
                        { icon: Mail, name: "email", label: "Email" },
                      ].map((platform) => (
                        <motion.button
                          key={platform.name}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleShare(platform.name)}
                          className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                          <platform.icon className="w-4 h-4" />
                          <span className="text-sm hidden sm:inline">{platform.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tier Progress Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Your Tier Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current Tier */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${currentTier.color} flex items-center justify-center`}>
                      <Star className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Current Tier</p>
                      <p className="text-xl font-bold text-foreground">{currentTier.name}</p>
                      <p className="text-sm text-primary">{currentTier.reward} commission</p>
                    </div>
                  </div>

                  {/* Progress to next tier */}
                  {nextTier && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress to {nextTier.name}</span>
                        <span className="text-foreground font-medium">
                          {stats.totalReferrals}/{nextTier.minReferrals}
                        </span>
                      </div>
                      <Progress value={progressToNext} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {nextTier.minReferrals - stats.totalReferrals} more referrals to unlock {nextTier.reward} commission + {nextTier.bonus} bonus
                      </p>
                    </div>
                  )}

                  {/* Tier List */}
                  <div className="grid grid-cols-5 gap-2 pt-2">
                    {referralTiers.map((tier, i) => (
                      <motion.div
                        key={tier.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={`text-center p-2 rounded-lg border ${
                          stats.totalReferrals >= tier.minReferrals 
                            ? "bg-primary/10 border-primary/30" 
                            : "bg-muted/30 border-border/30 opacity-50"
                        }`}
                      >
                        <p className="text-xs font-medium truncate">{tier.name}</p>
                        <p className="text-[10px] text-muted-foreground">{tier.reward}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Referrals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6"
          >
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Recent Referrals
                  </div>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                    Live
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <AnimatePresence>
                    {recentReferrals.map((referral, i) => (
                      <motion.div
                        key={referral.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
                            {referral.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{referral.name}</p>
                            <p className="text-xs text-muted-foreground">{referral.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusBadge(referral.status)}>
                            {referral.status}
                          </Badge>
                          <span className="font-semibold text-green-500">{referral.earnings}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <Button variant="ghost" className="w-full mt-4 text-primary">
                  View All Referrals
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReferralDashboard;

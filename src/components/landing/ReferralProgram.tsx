import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Users, Copy, Check, Share2, DollarSign, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const rewards = [
  { tier: 1, referrals: 3, reward: "$50", bonus: "1 Month Pro Free", icon: Gift },
  { tier: 2, referrals: 10, reward: "$200", bonus: "3 Months Pro Free", icon: Trophy },
  { tier: 3, referrals: 25, reward: "$500", bonus: "Lifetime Pro Access", icon: Star },
];

export const ReferralProgram = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://tradeflow.ai/ref/YOUR_CODE";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="referral" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Gift className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-medium">Referral Program</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Earn While You{" "}
            <span className="bg-gradient-to-r from-accent via-primary to-success bg-clip-text text-transparent">
              Share
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Invite friends and earn rewards. The more you share, the more you earn!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                Your Referral Link
              </h3>
              
              <div className="flex gap-2 mb-6">
                <Input
                  value={referralLink}
                  readOnly
                  className="bg-background/50 text-sm"
                />
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-background/30 rounded-lg">
                  <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Referrals</p>
                </div>
                <div className="text-center p-4 bg-background/30 rounded-lg">
                  <DollarSign className="w-5 h-5 mx-auto mb-2 text-success" />
                  <p className="text-2xl font-bold">$0</p>
                  <p className="text-xs text-muted-foreground">Earned</p>
                </div>
                <div className="text-center p-4 bg-background/30 rounded-lg">
                  <Trophy className="w-5 h-5 mx-auto mb-2 text-accent" />
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-xs text-muted-foreground">Tier</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90">
                  Share on X
                </Button>
                <Button className="flex-1 bg-[#0088cc] hover:bg-[#0088cc]/90">
                  Share on Telegram
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold mb-4">Reward Tiers</h3>
            
            {rewards.map((tier, index) => (
              <motion.div
                key={tier.tier}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      index === 0 ? "bg-primary/20" :
                      index === 1 ? "bg-accent/20" : "bg-success/20"
                    }`}>
                      <tier.icon className={`w-6 h-6 ${
                        index === 0 ? "text-primary" :
                        index === 1 ? "text-accent" : "text-success"
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">Tier {tier.tier}</span>
                        <span className="text-2xl font-bold text-primary">{tier.reward}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {tier.referrals} referrals
                        </span>
                        <span className="text-xs text-success">+ {tier.bonus}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            <p className="text-xs text-muted-foreground text-center pt-4">
              * Rewards are credited when referred users make their first trade
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

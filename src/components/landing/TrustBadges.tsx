import { motion } from "framer-motion";
import { Shield, Lock, Award, Newspaper, CreditCard, Building2, CheckCircle2, FileCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const securityBadges = [
  { icon: Shield, label: "SOC 2 Certified", description: "Enterprise security" },
  { icon: Lock, label: "256-bit SSL", description: "Bank-grade encryption" },
  { icon: Award, label: "GDPR Compliant", description: "Data protection" },
  { icon: FileCheck, label: "Smart Contract Audited", description: "CertiK verified" },
];

const paymentPartners = [
  { name: "Phantom", logo: "🟣" },
  { name: "Solana", logo: "◎" },
  { name: "USDC", logo: "💲" },
  { name: "Jupiter", logo: "🪐" },
  { name: "Raydium", logo: "⚡" },
];

const mediaLogos = [
  { name: "CoinDesk", featured: "Featured in CoinDesk" },
  { name: "Bloomberg", featured: "Bloomberg Crypto" },
  { name: "TechCrunch", featured: "TechCrunch Startup" },
  { name: "Forbes", featured: "Forbes Fintech 50" },
];

export const TrustBadges = () => {
  return (
    <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 lg:px-12 bg-gradient-to-b from-secondary/30 to-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary/30">
            Trusted & Secure
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Built on <span className="text-primary">Trust & Security</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            Your assets are protected by industry-leading security standards
          </p>
        </motion.div>

        {/* Security Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-sm text-muted-foreground text-center mb-6 uppercase tracking-wider">
            Security Certifications
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {securityBadges.map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="glass rounded-xl p-6 text-center border-primary/10 hover:border-primary/30 transition-all"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 mx-auto mb-4">
                  <badge.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{badge.label}</h3>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Payment Partners */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <p className="text-sm text-muted-foreground text-center mb-6 uppercase tracking-wider">
            Integrated Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {paymentPartners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
              >
                <div className="text-3xl sm:text-4xl">{partner.logo}</div>
                <span className="text-xs text-muted-foreground">{partner.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Media Mentions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground text-center mb-6 uppercase tracking-wider">
            As Featured In
          </p>
          <div className="glass rounded-2xl p-6 sm:p-8 border-primary/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {mediaLogos.map((media, index) => (
                <motion.div
                  key={media.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Newspaper className="h-5 w-5 text-primary" />
                    <span className="text-lg font-bold text-foreground">{media.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{media.featured}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span>Registered Business in USA</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span>PCI DSS Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>$10M Insurance Coverage</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-6 sm:gap-10 glass rounded-full px-8 py-4 border-primary/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">0</div>
              <div className="text-xs text-muted-foreground">Security Incidents</div>
            </div>
            <div className="h-8 w-px bg-border/50" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">99.99%</div>
              <div className="text-xs text-muted-foreground">Uptime</div>
            </div>
            <div className="h-8 w-px bg-border/50" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">24/7</div>
              <div className="text-xs text-muted-foreground">Monitoring</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

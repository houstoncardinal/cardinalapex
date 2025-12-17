import { motion } from "framer-motion";
import { Handshake } from "lucide-react";

const partners = [
  { name: "Phantom", logo: "👻" },
  { name: "Solana", logo: "◎" },
  { name: "Jupiter", logo: "🪐" },
  { name: "Raydium", logo: "💧" },
  { name: "Orca", logo: "🐋" },
  { name: "Magic Eden", logo: "🔮" },
  { name: "Marinade", logo: "🥒" },
  { name: "Tensor", logo: "📐" },
  { name: "Jito", logo: "⚡" },
  { name: "Drift", logo: "🌊" },
  { name: "Meteora", logo: "☄️" },
  { name: "Kamino", logo: "🏛️" },
];

export const PartnerCarousel = () => {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto mb-12 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Handshake className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-medium">Trusted Integrations</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powered by the{" "}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Best in Web3
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Seamlessly integrated with leading exchanges, wallets, and DeFi protocols
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <motion.div
          animate={{ x: [0, -1920] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
          className="flex gap-8"
        >
          {[...partners, ...partners, ...partners].map((partner, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl hover:border-primary/50 transition-colors"
            >
              <span className="text-3xl">{partner.logo}</span>
              <span className="text-lg font-medium whitespace-nowrap">{partner.name}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative mt-8">
        <motion.div
          animate={{ x: [-1920, 0] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
          className="flex gap-8"
        >
          {[...partners, ...partners, ...partners].reverse().map((partner, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl hover:border-accent/50 transition-colors"
            >
              <span className="text-3xl">{partner.logo}</span>
              <span className="text-lg font-medium whitespace-nowrap">{partner.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

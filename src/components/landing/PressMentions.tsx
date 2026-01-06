import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  Newspaper, ExternalLink, Quote, Star, TrendingUp, Award
} from "lucide-react";

interface Publication {
  id: number;
  name: string;
  logo: string;
  quote: string;
  date: string;
  rating?: number;
  category: string;
}

const publications: Publication[] = [
  {
    id: 1,
    name: "CryptoNews Daily",
    logo: "CND",
    quote: "TradeFlow's AI trading bots represent a paradigm shift in retail crypto trading. Their pattern recognition accuracy is unmatched.",
    date: "Dec 2024",
    rating: 5,
    category: "Featured Review",
  },
  {
    id: 2,
    name: "Blockchain Today",
    logo: "BT",
    quote: "The most sophisticated AI trading platform we've tested. Cardinal Consulting has built something truly revolutionary.",
    date: "Nov 2024",
    rating: 5,
    category: "Editor's Choice",
  },
  {
    id: 3,
    name: "DeFi Weekly",
    logo: "DW",
    quote: "94% win rate claims seemed too good to be true until we saw the live results. TradeFlow delivers on its promises.",
    date: "Jan 2025",
    category: "Top Pick",
  },
  {
    id: 4,
    name: "Tech Innovators",
    logo: "TI",
    quote: "Hunain Qureshi's pattern recognition expertise shines through in every aspect of TradeFlow's algorithm design.",
    date: "Oct 2024",
    rating: 5,
    category: "Innovation Award",
  },
  {
    id: 5,
    name: "Trading Insights",
    logo: "TIN",
    quote: "Finally, an AI trading platform that makes institutional-grade tools accessible to everyday traders.",
    date: "Dec 2024",
    category: "Best in Class",
  },
  {
    id: 6,
    name: "Solana Ecosystem",
    logo: "SE",
    quote: "The fastest and most reliable trading bot on Solana. Sub-millisecond execution is a game changer.",
    date: "Nov 2024",
    rating: 5,
    category: "Ecosystem Highlight",
  },
];

const logoColors = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-blue-500",
  "from-rose-500 to-pink-500",
];

const PressMentions = () => {
  return (
    <section className="relative z-10 py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Newspaper className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">In The Press</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Featured In <span className="text-primary">Leading Publications</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See what the industry experts are saying about TradeFlow's revolutionary AI trading technology
          </p>
        </motion.div>

        {/* Scrolling logos */}
        <div className="relative mb-16 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
          
          <motion.div
            className="flex gap-12 items-center"
            animate={{ x: [0, -1000] }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear",
              repeatType: "loop"
            }}
          >
            {[...publications, ...publications].map((pub, index) => (
              <motion.div
                key={`${pub.id}-${index}`}
                className="flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-xl bg-card/50 border border-border/50"
                whileHover={{ scale: 1.05, borderColor: "hsl(var(--primary) / 0.5)" }}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${logoColors[pub.id % logoColors.length]} flex items-center justify-center text-white font-bold text-sm`}>
                  {pub.logo}
                </div>
                <span className="text-foreground font-medium whitespace-nowrap">{pub.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Featured quotes grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {publications.map((pub, index) => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${logoColors[index % logoColors.length]} flex items-center justify-center text-white font-bold`}
                      whileHover={{ rotate: 5, scale: 1.05 }}
                    >
                      {pub.logo}
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-foreground">{pub.name}</h3>
                      <p className="text-xs text-muted-foreground">{pub.date}</p>
                    </div>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
                    {pub.category}
                  </Badge>
                </div>

                {/* Quote */}
                <div className="flex-1 mb-4">
                  <Quote className="w-8 h-8 text-primary/20 mb-2" />
                  <p className="text-muted-foreground leading-relaxed italic">
                    "{pub.quote}"
                  </p>
                </div>

                {/* Rating & Link */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  {pub.rating && (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: pub.rating }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        </motion.div>
                      ))}
                    </div>
                  )}
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Read More
                    <ExternalLink className="w-3 h-3" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Awards section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: Award, label: "Best AI Trading Platform 2024", org: "Crypto Awards" },
              { icon: TrendingUp, label: "Top Performer on Solana", org: "DeFi Rankings" },
              { icon: Star, label: "5-Star User Rating", org: "TrustPilot" },
            ].map((award, i) => (
              <motion.div
                key={award.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -3 }}
                className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <award.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{award.label}</p>
                  <p className="text-xs text-muted-foreground">{award.org}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PressMentions;

import { motion } from "framer-motion";
import { Smartphone, Apple, Play, QrCode, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileAppDownload = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Smartphone className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Mobile App</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trade <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Anywhere</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Take your AI trading assistant with you. Monitor positions, execute trades, and receive alerts on the go.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-64 h-[500px] bg-gradient-to-b from-card to-card/80 rounded-[3rem] border-4 border-border shadow-2xl shadow-primary/20 overflow-hidden">
                {/* Screen Content */}
                <div className="absolute inset-4 rounded-[2.5rem] bg-background overflow-hidden">
                  {/* Status Bar */}
                  <div className="h-8 bg-card/50 flex items-center justify-between px-6 text-xs text-muted-foreground">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 bg-success rounded-sm" />
                    </div>
                  </div>
                  
                  {/* App Content Preview */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Portfolio</span>
                      <span className="text-xs text-success">+12.4%</span>
                    </div>
                    <div className="h-24 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold">$24,580</span>
                    </div>
                    
                    {/* Mini Chart */}
                    <div className="h-20 bg-card/50 rounded-lg p-2">
                      <svg viewBox="0 0 100 40" className="w-full h-full">
                        <path
                          d="M0,30 L20,25 L40,28 L60,15 L80,18 L100,8"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-success/20 rounded-lg p-2 text-center">
                        <span className="text-xs text-success font-medium">Buy</span>
                      </div>
                      <div className="bg-destructive/20 rounded-lg p-2 text-center">
                        <span className="text-xs text-destructive font-medium">Sell</span>
                      </div>
                    </div>
                    
                    {/* AI Alert */}
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-xs">AI detected bullish pattern</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -right-8 top-20 bg-card border border-border rounded-lg p-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                    <span className="text-success text-xs">↑</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium">SOL +8.2%</p>
                    <p className="text-[10px] text-muted-foreground">Just now</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -left-8 bottom-32 bg-card border border-border rounded-lg p-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-medium">4.9 Rating</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Download Options */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* App Store Badges */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Download Now</h3>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  className="h-16 px-6 flex items-center gap-4 hover:bg-card/80 transition-all group"
                >
                  <Apple className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Download on the</p>
                    <p className="text-lg font-semibold">App Store</p>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-16 px-6 flex items-center gap-4 hover:bg-card/80 transition-all group"
                >
                  <Play className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Get it on</p>
                    <p className="text-lg font-semibold">Google Play</p>
                  </div>
                </Button>
              </div>
            </div>

            {/* QR Codes */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Scan to Download</h3>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="w-28 h-28 bg-card border border-border rounded-xl p-2 mb-2">
                    <div className="w-full h-full bg-foreground rounded-lg flex items-center justify-center relative">
                      <QrCode className="w-16 h-16 text-background" />
                      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-0.5 p-1 opacity-80">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div
                            key={i}
                            className={`${Math.random() > 0.5 ? 'bg-background' : 'bg-transparent'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">iOS</p>
                </div>
                
                <div className="text-center">
                  <div className="w-28 h-28 bg-card border border-border rounded-xl p-2 mb-2">
                    <div className="w-full h-full bg-foreground rounded-lg flex items-center justify-center relative">
                      <QrCode className="w-16 h-16 text-background" />
                      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-0.5 p-1 opacity-80">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div
                            key={i}
                            className={`${Math.random() > 0.5 ? 'bg-background' : 'bg-transparent'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Android</p>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "📊", text: "Real-time Portfolio" },
                { icon: "🤖", text: "AI Trade Alerts" },
                { icon: "🔔", text: "Push Notifications" },
                { icon: "🔒", text: "Biometric Security" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-card/50 rounded-lg border border-border/50"
                >
                  <span className="text-xl">{feature.icon}</span>
                  <span className="text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppDownload;

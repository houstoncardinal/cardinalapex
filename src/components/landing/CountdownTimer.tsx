import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Zap, Gift, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set target date to 3 days from now (resets on page load for demo)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(23, 59, 59, 999);

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section className="py-12 px-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto"
      >
        <div className="relative bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl p-8 md:p-12 border border-primary/30 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-accent/10 rounded-full blur-3xl"
              animate={{
                x: [0, -100, 0],
                y: [0, -50, 0],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/20 border border-destructive/30 mb-4">
                  <Zap className="w-4 h-4 text-destructive animate-pulse" />
                  <span className="text-sm font-medium text-destructive">Limited Time Offer</span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold mb-3">
                  Early Bird{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    50% OFF
                  </span>
                </h3>
                
                <p className="text-muted-foreground mb-4 max-w-md">
                  Join now and lock in lifetime pricing. First 500 users get exclusive benefits!
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm">
                  <div className="flex items-center gap-2 text-success">
                    <Gift className="w-4 h-4" />
                    <span>Free Pro Trial</span>
                  </div>
                  <div className="flex items-center gap-2 text-accent">
                    <Percent className="w-4 h-4" />
                    <span>50% Forever</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Clock className="w-4 h-4" />
                    <span>VIP Access</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="flex gap-3">
                  {timeUnits.map((unit, index) => (
                    <motion.div
                      key={unit.label}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 flex items-center justify-center">
                          <motion.span
                            key={unit.value}
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-2xl md:text-3xl font-bold font-mono"
                          >
                            {unit.value.toString().padStart(2, "0")}
                          </motion.span>
                        </div>
                        {index < timeUnits.length - 1 && (
                          <span className="absolute -right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xl">
                            :
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground mt-2">{unit.label}</span>
                    </motion.div>
                  ))}
                </div>

                <Button
                  size="lg"
                  onClick={() => navigate("/auth?mode=signup")}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-8 shadow-lg shadow-primary/25"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Claim 50% Off Now
                </Button>

                <p className="text-xs text-muted-foreground">
                  Only <span className="text-primary font-semibold">127 spots</span> remaining
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

import { motion } from 'framer-motion';
import { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Brain, Target, Zap } from 'lucide-react';

const ComparisonSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const manualStats = {
    profit: '+12%',
    trades: '8 trades/week',
    accuracy: '45%',
    time: '4+ hrs/day',
    stress: 'High',
    missed: '73% opportunities missed',
  };

  const aiStats = {
    profit: '+847%',
    trades: '200+ trades/week',
    accuracy: '89%',
    time: '0 hrs (automated)',
    stress: 'Zero',
    missed: '24/7 market coverage',
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-card/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-muted-foreground">Manual Trading</span>
            <span className="mx-4 text-primary">vs</span>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Trading
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Drag the slider to compare results
          </p>
        </motion.div>

        <div className="relative">
          {/* Comparison Container */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden border border-border">
            {/* Manual Trading Side */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-red-950/30 to-background p-8"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <div className="h-full flex flex-col justify-center max-w-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-red-500/20">
                    <Clock className="h-6 w-6 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-400">Manual Trading</h3>
                </div>

                <div className="space-y-4">
                  <StatCard
                    label="Annual Returns"
                    value={manualStats.profit}
                    icon={<TrendingDown className="h-5 w-5" />}
                    color="red"
                  />
                  <StatCard
                    label="Trade Frequency"
                    value={manualStats.trades}
                    icon={<Target className="h-5 w-5" />}
                    color="red"
                  />
                  <StatCard
                    label="Win Rate"
                    value={manualStats.accuracy}
                    icon={<Zap className="h-5 w-5" />}
                    color="red"
                  />
                  <StatCard
                    label="Time Required"
                    value={manualStats.time}
                    icon={<Clock className="h-5 w-5" />}
                    color="red"
                  />
                </div>

                <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-sm">
                    ⚠️ {manualStats.missed}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Trading Side */}
            <div
              className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-background p-8 flex justify-end"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <div className="h-full flex flex-col justify-center max-w-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">AI Trading</h3>
                </div>

                <div className="space-y-4">
                  <StatCard
                    label="Annual Returns"
                    value={aiStats.profit}
                    icon={<TrendingUp className="h-5 w-5" />}
                    color="green"
                  />
                  <StatCard
                    label="Trade Frequency"
                    value={aiStats.trades}
                    icon={<Target className="h-5 w-5" />}
                    color="green"
                  />
                  <StatCard
                    label="Win Rate"
                    value={aiStats.accuracy}
                    icon={<Zap className="h-5 w-5" />}
                    color="green"
                  />
                  <StatCard
                    label="Time Required"
                    value={aiStats.time}
                    icon={<Clock className="h-5 w-5" />}
                    color="green"
                  />
                </div>

                <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="text-primary text-sm">
                    ✨ {aiStats.missed}
                  </p>
                </div>
              </div>
            </div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize z-10"
              style={{ left: `${sliderPosition}%` }}
            >
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-4 bg-primary-foreground rounded-full" />
                  <div className="w-0.5 h-4 bg-primary-foreground rounded-full" />
                  <div className="w-0.5 h-4 bg-primary-foreground rounded-full" />
                </div>
              </motion.div>
            </div>

            {/* Slider Input (invisible but interactive) */}
            <input
              type="range"
              min="10"
              max="90"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
          </div>

          {/* Bottom Labels */}
          <div className="flex justify-between mt-4 px-4">
            <span className="text-muted-foreground text-sm">← Slide to compare</span>
            <span className="text-muted-foreground text-sm">Drag the handle →</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: 'red' | 'green';
}) => {
  const colorClasses = {
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
  };

  return (
    <div className={`p-3 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">{label}</span>
        {icon}
      </div>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
};

export default ComparisonSlider;

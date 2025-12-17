import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, Star, Quote, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  avatar: string;
  profit: string;
  quote: string;
  videoThumbnail: string;
  duration: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Marcus Rodriguez',
    role: 'Day Trader',
    location: 'Miami, FL',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    profit: '+$147,230',
    quote: "I was skeptical at first, but the AI detected patterns I never would have seen. Made more in 3 months than my entire previous year.",
    videoThumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    duration: '2:34',
    rating: 5,
  },
  {
    id: 2,
    name: 'Sarah Kim',
    role: 'Crypto Investor',
    location: 'San Francisco, CA',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    profit: '+$328,500',
    quote: "The automated trading changed everything. I sleep while the AI works. My portfolio has grown 400% in just 6 months.",
    videoThumbnail: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800',
    duration: '3:12',
    rating: 5,
  },
  {
    id: 3,
    name: 'David Chen',
    role: 'Portfolio Manager',
    location: 'New York, NY',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    profit: '+$512,000',
    quote: "Finally, an AI that actually delivers. The pattern recognition is incredible - it catches Elliott Waves before they form.",
    videoThumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    duration: '4:05',
    rating: 5,
  },
  {
    id: 4,
    name: 'Emma Thompson',
    role: 'Swing Trader',
    location: 'Austin, TX',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    profit: '+$89,750',
    quote: "As a beginner, I was lost. TradeFlow made it easy. The AI handles everything while I learn from watching it trade.",
    videoThumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    duration: '2:48',
    rating: 5,
  },
  {
    id: 5,
    name: 'James Wilson',
    role: 'Full-Time Trader',
    location: 'Chicago, IL',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    profit: '+$673,400',
    quote: "The sub-millisecond execution on Solana is a game-changer. I never miss an opportunity anymore. Best investment ever.",
    videoThumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800',
    duration: '3:45',
    rating: 5,
  },
];

const VideoTestimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setIsPlaying(false);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsPlaying(false);
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-card/30 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary/30">
            Real Results
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Hear From Our </span>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Profitable Traders
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Watch real traders share their success stories and see how AI trading transformed their portfolios
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <img
                    src={activeTestimonial.videoThumbnail}
                    alt={activeTestimonial.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Play Button Overlay */}
              {!isPlaying && (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(true)}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-xl shadow-primary/30"
                >
                  <Play className="h-8 w-8 text-primary-foreground ml-1" />
                </motion.button>
              )}

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 text-foreground" />
                    ) : (
                      <Play className="h-5 w-5 text-foreground ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5 text-foreground" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-foreground" />
                    )}
                  </button>
                </div>
                <span className="text-sm text-foreground/80 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                  {activeTestimonial.duration}
                </span>
              </div>

              {/* Profit Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-500/90 text-white text-lg px-4 py-1 shadow-lg">
                  {activeTestimonial.profit}
                </Badge>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="rounded-full border-border/50 hover:border-primary hover:bg-primary/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveIndex(index);
                      setIsPlaying(false);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeIndex
                        ? 'w-8 bg-primary'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="rounded-full border-border/50 hover:border-primary hover:bg-primary/10"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>

          {/* Testimonial Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Quote className="h-12 w-12 text-primary/30" />
                
                <p className="text-xl md:text-2xl text-foreground leading-relaxed italic">
                  "{activeTestimonial.quote}"
                </p>

                <div className="flex items-center gap-1">
                  {[...Array(activeTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={activeTestimonial.avatar}
                    alt={activeTestimonial.name}
                    className="w-16 h-16 rounded-full border-2 border-primary/30"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-foreground">
                      {activeTestimonial.name}
                    </h4>
                    <p className="text-muted-foreground">{activeTestimonial.role}</p>
                    <p className="text-sm text-muted-foreground/60">{activeTestimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Mini Testimonial Cards */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-border/50">
              {testimonials
                .filter((_, i) => i !== activeIndex)
                .slice(0, 4)
                .map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveIndex(testimonials.findIndex((item) => item.id === t.id));
                      setIsPlaying(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/30 hover:border-primary/30 transition-all text-left group"
                  >
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {t.name}
                      </p>
                      <p className="text-xs text-green-400">{t.profit}</p>
                    </div>
                  </button>
                ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonials;

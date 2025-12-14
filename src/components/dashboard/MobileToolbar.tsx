import { motion } from "framer-motion";
import {
  Home,
  TrendingUp,
  Bot,
  PieChart,
  MoreHorizontal,
} from "lucide-react";

interface ToolbarItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
  hasIndicator?: boolean;
  onClick?: () => void;
}

const ToolbarItem = ({ icon: Icon, label, isActive, hasIndicator, onClick }: ToolbarItemProps) => (
  <button
    onClick={onClick}
    className="relative flex flex-col items-center justify-center gap-1 flex-1 py-2 group"
  >
    <motion.div
      whileTap={{ scale: 0.9 }}
      className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
        isActive
          ? "bg-primary glow-primary"
          : "bg-transparent group-hover:bg-secondary"
      }`}
    >
      <Icon
        className={`h-5 w-5 transition-colors ${
          isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
        }`}
      />
      {hasIndicator && (
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent animate-pulse border-2 border-background" />
      )}
    </motion.div>
    <span
      className={`text-[10px] font-medium transition-colors ${
        isActive ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {label}
    </span>
  </button>
);

export const MobileToolbar = () => {
  const items = [
    { icon: Home, label: "Home", isActive: true },
    { icon: TrendingUp, label: "Trade", hasIndicator: true },
    { icon: Bot, label: "AI Bots" },
    { icon: PieChart, label: "Portfolio" },
    { icon: MoreHorizontal, label: "More" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Gradient Blur Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent -top-4" />
      
      {/* Toolbar Container */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative glass border-t border-border/50 px-2 pb-safe"
      >
        <div className="flex items-center justify-around">
          {items.map((item) => (
            <ToolbarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              isActive={item.isActive}
              hasIndicator={item.hasIndicator}
            />
          ))}
        </div>
        
        {/* Safe Area Padding for iOS */}
        <div className="h-1" />
      </motion.nav>
    </div>
  );
};

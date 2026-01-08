import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Bell,
  Search,
  Settings,
  Wallet,
  LogOut,
  BarChart3,
  TrendingUp,
  Bot,
  PieChart,
  Clock,
  AlertCircle,
  Star,
  Home,
  User,
  ChevronRight,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileMenuItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  onClick?: () => void;
  badge?: string;
}

const MobileMenuItem = ({ icon: Icon, label, description, onClick, badge }: MobileMenuItemProps) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <div className="flex-1 text-left">
      <p className="font-medium text-foreground">{label}</p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
    {badge && (
      <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
        {badge}
      </span>
    )}
    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
  </motion.button>
);

export const MobileHeader = () => {
  const { signOut, isGuest } = useAuth();
  const { isAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const baseMenuItems = [
    { icon: Home, label: "Dashboard", description: "Overview & analytics" },
    { icon: TrendingUp, label: "Live Trading", description: "Real-time market data", badge: "LIVE" },
    { icon: Bot, label: "AI Agents", description: "Automated trading bots" },
    { icon: PieChart, label: "Portfolio", description: "Holdings & performance" },
    { icon: Clock, label: "Trade History", description: "All executed trades" },
    { icon: AlertCircle, label: "Price Alerts", description: "Custom notifications" },
    { icon: Star, label: "Watchlist", description: "Tracked assets" },
    { icon: Settings, label: "Settings", description: "App preferences" },
  ];

  const menuItems = isAdmin
    ? [...baseMenuItems, { icon: Shield, label: "Admin Dashboard", description: "Manage platform", badge: "ADMIN", route: "/admin" }]
    : baseMenuItems;

  return (
    <>
      {/* Mobile Header */}
      <header className="glass sticky top-0 z-50 px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent glow-primary">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">CardinalApex</h1>
              <p className="text-[10px] text-primary font-medium">AI Trading Pro</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
            </Button>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md p-0 bg-background border-border">
                <div className="flex flex-col h-full">
                  {/* Menu Header */}
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent glow-primary">
                        <BarChart3 className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">CardinalApex</h2>
                        <p className="text-sm text-muted-foreground">AI-Powered Trading</p>
                      </div>
                    </div>
                    
                    {/* Balance Card */}
                    <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
                      <p className="text-xs text-muted-foreground mb-1">Portfolio Value</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">$10,000.00</span>
                        <span className="text-xs text-success font-medium">+12.5%</span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {menuItems.map((item) => (
                      <MobileMenuItem
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        description={item.description}
                        badge={item.badge}
                        onClick={() => {
                          setIsMenuOpen(false);
                          if ('route' in item && item.route) {
                            navigate(item.route);
                          }
                        }}
                      />
                    ))}
                  </div>

                  {/* Menu Footer */}
                  <div className="p-4 border-t border-border space-y-3">
                    {isGuest && (
                      <Button
                        variant="default"
                        className="w-full gap-2"
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate("/auth?mode=signup");
                        }}
                      >
                        <User className="h-4 w-4" />
                        Create Account
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                    
                    {/* Creator Credit */}
                    <div className="pt-4 text-center">
                      <p className="text-xs text-muted-foreground">Created by</p>
                      <p className="text-sm font-medium text-foreground">Hunain Qureshi</p>
                      <p className="text-xs text-primary">Tech CEO, Cardinal Consulting</p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl p-4 md:hidden"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search stocks, crypto, patterns..."
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {["BTC", "ETH", "AAPL", "TSLA", "SOL", "NVDA"].map((term) => (
                  <button
                    key={term}
                    className="px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-sm font-medium text-foreground transition-colors"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

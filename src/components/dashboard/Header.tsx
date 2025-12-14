import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Bell, Search, Settings, Wallet, LogOut, BarChart3, TrendingUp, Bot, PieChart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileHeader } from "./MobileHeader";

export const Header = () => {
  const { signOut, isGuest } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Desktop/Tablet Header */}
      <header className="glass sticky top-0 z-50 px-4 md:px-6 py-3 md:py-4 hidden md:block">
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          {/* Logo & Branding */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent glow-primary">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">CardinalApex</h1>
                <p className="text-[10px] text-primary font-medium uppercase tracking-wider">AI Trading Platform</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 ml-8">
              {[
                { icon: TrendingUp, label: "Trade", active: true },
                { icon: Bot, label: "AI Agents" },
                { icon: PieChart, label: "Portfolio" },
                { icon: Clock, label: "History" },
              ].map((item) => (
                <Button
                  key={item.label}
                  variant={item.active ? "default" : "ghost"}
                  size="sm"
                  className={`gap-2 ${item.active ? "glow-primary" : ""}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center gap-2 rounded-xl bg-secondary/80 px-4 py-2.5 border border-border/50 hover:border-primary/50 transition-colors flex-1 max-w-md mx-8">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search stocks, crypto, patterns..."
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none w-full"
            />
            <kbd className="hidden xl:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative hidden md:flex">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Settings className="h-4 w-4" />
            </Button>
            
            {/* Balance Display */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
              <Wallet className="h-4 w-4 text-primary" />
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="text-sm font-bold text-foreground">$10,000.00</p>
              </div>
            </div>
            
            {isGuest && (
              <Button
                variant="default"
                size="sm"
                className="hidden lg:flex gap-2"
                onClick={() => navigate("/auth?mode=signup")}
              >
                Create Account
              </Button>
            )}
            
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Creator Credit Bar */}
        <div className="hidden xl:flex items-center justify-center gap-2 mt-3 pt-3 border-t border-border/30">
          <span className="text-xs text-muted-foreground">Platform created by</span>
          <span className="text-xs font-semibold text-foreground">Hunain Qureshi</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-primary font-medium">Tech CEO, Cardinal Consulting</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">Pattern Recognition & Trading Algorithm Expert</span>
        </div>
      </header>
    </>
  );
};

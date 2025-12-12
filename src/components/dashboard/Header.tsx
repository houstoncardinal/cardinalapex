import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Bell, Search, Settings, Wallet, LogOut, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="glass sticky top-0 z-50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">TradeFlow</h1>
            <p className="text-xs text-muted-foreground">AI Trading</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 rounded-xl bg-secondary px-4 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search stocks, crypto..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none w-64"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="glass" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-pulse-glow" />
          </Button>
          <Button variant="glass" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="accent" className="hidden sm:flex gap-2">
            <Wallet className="h-4 w-4" />
            <span>$10,000.00</span>
          </Button>
          <Button variant="glass" size="icon" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

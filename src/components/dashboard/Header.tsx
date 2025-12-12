import { Bell, Search, Settings, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="glass sticky top-0 z-50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <span className="text-xl font-bold text-primary-foreground">T</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">TradeFlow</h1>
            <p className="text-xs text-muted-foreground">Smart Trading</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 rounded-xl bg-secondary px-4 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search stocks, crypto..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none w-64"
          />
          <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
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
            <span>$124,532.89</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

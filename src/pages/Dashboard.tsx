import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/dashboard/Header";
import { PortfolioStats } from "@/components/dashboard/PortfolioCard";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { PatternChart } from "@/components/dashboard/PatternChart";
import { Watchlist } from "@/components/dashboard/Watchlist";
import { AITradingPanel } from "@/components/dashboard/AITradingPanel";
import { RecentTrades } from "@/components/dashboard/RecentTrades";
import { PortfolioTracking } from "@/components/dashboard/PortfolioTracking";
import { TradesHistory } from "@/components/dashboard/TradesHistory";
import { PriceAlerts } from "@/components/dashboard/PriceAlerts";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your trading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <MarketOverview />
        
        {/* Portfolio Overview Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PortfolioStats />
          </div>
          <div>
            <PortfolioTracking />
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <PatternChart />
            <TradesHistory />
          </div>
          
          <div className="space-y-6">
            <AITradingPanel />
            <PriceAlerts />
            <Watchlist />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

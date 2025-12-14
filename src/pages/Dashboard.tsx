import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/dashboard/Header";
import { PortfolioStats } from "@/components/dashboard/PortfolioCard";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { PatternChart } from "@/components/dashboard/PatternChart";
import { Watchlist } from "@/components/dashboard/Watchlist";
import { AITradingPanel } from "@/components/dashboard/AITradingPanel";
import { PortfolioTracking } from "@/components/dashboard/PortfolioTracking";
import { TradesHistory } from "@/components/dashboard/TradesHistory";
import { PriceAlerts } from "@/components/dashboard/PriceAlerts";
import { LiveTradingActivity } from "@/components/dashboard/LiveTradingActivity";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Dashboard = () => {
  const { user, loading, isGuest } = useAuth();
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
        {/* Guest Banner */}
        {isGuest && (
          <Alert className="border-warning/50 bg-warning/10">
            <AlertCircle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-foreground">
              You're trading as a guest. <a href="/auth?mode=signup" className="text-primary font-medium hover:underline">Create an account</a> to save your progress and unlock all features.
            </AlertDescription>
          </Alert>
        )}

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
            <LiveTradingActivity />
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

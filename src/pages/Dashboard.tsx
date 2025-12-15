import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/dashboard/Header";
import { MobileToolbar } from "@/components/dashboard/MobileToolbar";
import { PortfolioStats } from "@/components/dashboard/PortfolioCard";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { PatternChart } from "@/components/dashboard/PatternChart";
import { Watchlist } from "@/components/dashboard/Watchlist";
import { AITradingPanel } from "@/components/dashboard/AITradingPanel";
import { PortfolioTracking } from "@/components/dashboard/PortfolioTracking";
import { TradesHistory } from "@/components/dashboard/TradesHistory";
import { OnChainTradeHistory } from "@/components/dashboard/OnChainTradeHistory";
import { WalletPortfolio } from "@/components/dashboard/WalletPortfolio";
import { MemeCoinTicker } from "@/components/dashboard/MemeCoinTicker";
import { QuickSwap } from "@/components/dashboard/QuickSwap";
import { PriceAlerts } from "@/components/dashboard/PriceAlerts";
import { LiveTradingActivity } from "@/components/dashboard/LiveTradingActivity";
import { PortfolioPnLChart } from "@/components/dashboard/PortfolioPnLChart";
import { TradingAnalytics } from "@/components/dashboard/TradingAnalytics";
import { PortfolioRebalancing } from "@/components/dashboard/PortfolioRebalancing";
import TradingAssistant from "@/components/dashboard/TradingAssistant";
import TradingRobots from "@/components/dashboard/TradingRobots";
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
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 md:py-6 space-y-4 md:space-y-6 max-w-[1800px]">
        {/* Guest Banner */}
        {isGuest && (
          <Alert className="border-warning/50 bg-warning/10">
            <AlertCircle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-foreground text-sm">
              You're trading as a guest. <a href="/auth?mode=signup" className="text-primary font-medium hover:underline">Create an account</a> to save your progress.
            </AlertDescription>
          </Alert>
        )}

        {/* Meme Coin Ticker - Full Width */}
        <MemeCoinTicker />

        {/* Trading Robots - Connect Wallet & Choose Robots */}
        <TradingRobots />

        {/* Market Overview - Full Width */}
        <MarketOverview />
        
        {/* Portfolio & Quick Swap Row */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <WalletPortfolio />
          </div>
          <div className="lg:col-span-1">
            <QuickSwap />
          </div>
          <div className="lg:col-span-1">
            <PortfolioStats />
          </div>
          <div>
            <PortfolioTracking />
          </div>
        </div>
        
        {/* Main Content Grid - Responsive */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-3">
          {/* Main Trading Area */}
          <div className="xl:col-span-2 space-y-4 md:space-y-6">
            <PatternChart />
            <LiveTradingActivity />
            
            {/* P&L History Chart */}
            <PortfolioPnLChart />
            
            {/* Trading Analytics Dashboard */}
            <TradingAnalytics />
            
            {/* On-Chain Trade History - Solscan links with P&L */}
            <OnChainTradeHistory />
            
            {/* Trades History - Hidden on mobile, shown in tab */}
            <div className="hidden sm:block">
              <TradesHistory />
            </div>
          </div>
          
          {/* Sidebar - Collapses on mobile */}
          <div className="space-y-4 md:space-y-6">
            {/* AI Trading Assistant - New GPT-powered chat */}
            <div className="h-[500px]">
              <TradingAssistant />
            </div>
            
            {/* AI Trading Panel - Priority on all screens */}
            <AITradingPanel />
            
            {/* AI Portfolio Rebalancing */}
            <PortfolioRebalancing />
            
            {/* Price Alerts & Watchlist - Stack on tablet, side by side on large screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4 md:gap-6">
              <PriceAlerts />
              <Watchlist />
            </div>
          </div>
        </div>
        
        {/* Mobile Trades History */}
        <div className="sm:hidden">
          <TradesHistory />
        </div>
      </main>
      
      {/* Mobile Bottom Toolbar */}
      <MobileToolbar />
    </div>
  );
};

export default Dashboard;

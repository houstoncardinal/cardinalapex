import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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
import { RiskDisclaimer, TradingWarningFooter } from "@/components/dashboard/RiskDisclaimer";
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
      {/* Risk Warning Banner */}
      <RiskDisclaimer variant="banner" />
      
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

        {/* Risk Disclosure Card */}
        <RiskDisclaimer variant="card" />

        {/* Meme Coin Ticker - Full Width */}
        <ErrorBoundary fallbackMessage="Failed to load meme coin ticker">
          <MemeCoinTicker />
        </ErrorBoundary>

        {/* Trading Robots - Connect Wallet & Choose Robots */}
        <ErrorBoundary fallbackMessage="Failed to load trading robots">
          <TradingRobots />
        </ErrorBoundary>

        {/* Market Overview - Full Width */}
        <ErrorBoundary fallbackMessage="Failed to load market overview">
          <MarketOverview />
        </ErrorBoundary>
        
        {/* Portfolio & Quick Swap Row */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <ErrorBoundary fallbackMessage="Failed to load wallet portfolio">
              <WalletPortfolio />
            </ErrorBoundary>
          </div>
          <div className="lg:col-span-1">
            <ErrorBoundary fallbackMessage="Failed to load quick swap">
              <QuickSwap />
            </ErrorBoundary>
          </div>
          <div className="lg:col-span-1">
            <ErrorBoundary fallbackMessage="Failed to load portfolio stats">
              <PortfolioStats />
            </ErrorBoundary>
          </div>
          <div>
            <ErrorBoundary fallbackMessage="Failed to load portfolio tracking">
              <PortfolioTracking />
            </ErrorBoundary>
          </div>
        </div>
        
        {/* Main Content Grid - Responsive */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-3">
          {/* Main Trading Area */}
          <div className="xl:col-span-2 space-y-4 md:space-y-6">
            <ErrorBoundary fallbackMessage="Failed to load pattern chart">
              <PatternChart />
            </ErrorBoundary>
            <ErrorBoundary fallbackMessage="Failed to load live trading activity">
              <LiveTradingActivity />
            </ErrorBoundary>
            
            {/* P&L History Chart */}
            <ErrorBoundary fallbackMessage="Failed to load P&L chart">
              <PortfolioPnLChart />
            </ErrorBoundary>
            
            {/* Trading Analytics Dashboard */}
            <ErrorBoundary fallbackMessage="Failed to load trading analytics">
              <TradingAnalytics />
            </ErrorBoundary>
            
            {/* On-Chain Trade History - Solscan links with P&L */}
            <ErrorBoundary fallbackMessage="Failed to load on-chain trade history">
              <OnChainTradeHistory />
            </ErrorBoundary>
            
            {/* Trades History - Hidden on mobile, shown in tab */}
            <div className="hidden sm:block">
              <ErrorBoundary fallbackMessage="Failed to load trades history">
                <TradesHistory />
              </ErrorBoundary>
            </div>
          </div>
          
          {/* Sidebar - Collapses on mobile */}
          <div className="space-y-4 md:space-y-6">
            {/* AI Trading Assistant - New GPT-powered chat */}
            <div className="h-[500px]">
              <ErrorBoundary fallbackMessage="Failed to load trading assistant">
                <TradingAssistant />
              </ErrorBoundary>
            </div>
            
            {/* AI Trading Panel - Priority on all screens */}
            <ErrorBoundary fallbackMessage="Failed to load AI trading panel">
              <AITradingPanel />
            </ErrorBoundary>
            
            {/* AI Portfolio Rebalancing */}
            <ErrorBoundary fallbackMessage="Failed to load portfolio rebalancing">
              <PortfolioRebalancing />
            </ErrorBoundary>
            
            {/* Price Alerts & Watchlist - Stack on tablet, side by side on large screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4 md:gap-6">
              <ErrorBoundary fallbackMessage="Failed to load price alerts">
                <PriceAlerts />
              </ErrorBoundary>
              <ErrorBoundary fallbackMessage="Failed to load watchlist">
                <Watchlist />
              </ErrorBoundary>
            </div>
          </div>
        </div>
        
        {/* Mobile Trades History */}
        <div className="sm:hidden">
          <ErrorBoundary fallbackMessage="Failed to load trades history">
            <TradesHistory />
          </ErrorBoundary>
        </div>
        
        {/* Trading Warning Footer */}
        <TradingWarningFooter />
      </main>
      
      {/* Mobile Bottom Toolbar */}
      <MobileToolbar />
    </div>
  );
};

export default Dashboard;

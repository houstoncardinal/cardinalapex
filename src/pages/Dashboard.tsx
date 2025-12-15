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
import { PortfolioComparison } from "@/components/dashboard/PortfolioComparison";
import { TradingAnalytics } from "@/components/dashboard/TradingAnalytics";
import { PortfolioRebalancing } from "@/components/dashboard/PortfolioRebalancing";
import { RiskDisclaimer, TradingWarningFooter } from "@/components/dashboard/RiskDisclaimer";
import { DCAAutomation } from "@/components/dashboard/DCAAutomation";
import { CopyTrading } from "@/components/dashboard/CopyTrading";
import { TradeJournal } from "@/components/dashboard/TradeJournal";
import { NotificationWebhooks } from "@/components/dashboard/NotificationWebhooks";
import { Backtesting } from "@/components/dashboard/Backtesting";
import { SocialLeaderboard } from "@/components/dashboard/SocialLeaderboard";
import { WhaleTracking } from "@/components/dashboard/WhaleTracking";
import { SentimentAnalysis } from "@/components/dashboard/SentimentAnalysis";
import { TokenScanner } from "@/components/dashboard/TokenScanner";
import { LiquidityTracking } from "@/components/dashboard/LiquidityTracking";
import { NewsFeed } from "@/components/dashboard/NewsFeed";
import { GasTracker } from "@/components/dashboard/GasTracker";
import { PortfolioAlerts } from "@/components/dashboard/PortfolioAlerts";
import { PricePrediction } from "@/components/dashboard/PricePrediction";
import { AutoTradeScheduler } from "@/components/dashboard/AutoTradeScheduler";
import { TokenLaunchDetector } from "@/components/dashboard/TokenLaunchDetector";
import { PnLCalculator } from "@/components/dashboard/PnLCalculator";
import { MultiWalletManager } from "@/components/dashboard/MultiWalletManager";
import { AITradeSuggestions } from "@/components/dashboard/AITradeSuggestions";
import { TradingChatRoom } from "@/components/dashboard/TradingChatRoom";
import { ArbitrageScanner } from "@/components/dashboard/ArbitrageScanner";
import { PortfolioRiskAnalyzer } from "@/components/dashboard/PortfolioRiskAnalyzer";
import { LimitOrderManager } from "@/components/dashboard/LimitOrderManager";
import { AdvancedOrders } from "@/components/dashboard/AdvancedOrders";
import { CorrelationMatrix } from "@/components/dashboard/CorrelationMatrix";
import { StopLossTakeProfit } from "@/components/dashboard/StopLossTakeProfit";
import { PortfolioHeatMap } from "@/components/dashboard/PortfolioHeatMap";
import { TradingSignals } from "@/components/dashboard/TradingSignals";
import { PositionSizer } from "@/components/dashboard/PositionSizer";
import { SessionTimer } from "@/components/dashboard/SessionTimer";
import { BreakoutDetector } from "@/components/dashboard/BreakoutDetector";
import { MarketDepth } from "@/components/dashboard/MarketDepth";
import VWAPIndicator from "@/components/dashboard/VWAPIndicator";
import SmartMoneyFlow from "@/components/dashboard/SmartMoneyFlow";
import FundingRateTracker from "@/components/dashboard/FundingRateTracker";
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
            
            {/* Multi-Token Portfolio Comparison */}
            <ErrorBoundary fallbackMessage="Failed to load portfolio comparison">
              <PortfolioComparison />
            </ErrorBoundary>
            
            {/* Whale Tracking */}
            <ErrorBoundary fallbackMessage="Failed to load whale tracking">
              <WhaleTracking />
            </ErrorBoundary>
            
            {/* Sentiment Analysis */}
            <ErrorBoundary fallbackMessage="Failed to load sentiment analysis">
              <SentimentAnalysis />
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
            
            {/* Token Scanner */}
            <ErrorBoundary fallbackMessage="Failed to load token scanner">
              <TokenScanner />
            </ErrorBoundary>
            
            {/* Gas Tracker */}
            <ErrorBoundary fallbackMessage="Failed to load gas tracker">
              <GasTracker />
            </ErrorBoundary>
            
            {/* Portfolio Alerts */}
            <ErrorBoundary fallbackMessage="Failed to load portfolio alerts">
              <PortfolioAlerts />
            </ErrorBoundary>
            
            {/* AI Price Prediction */}
            <ErrorBoundary fallbackMessage="Failed to load price prediction">
              <PricePrediction />
            </ErrorBoundary>
            
            {/* Token Launch Detector */}
            <ErrorBoundary fallbackMessage="Failed to load token launch detector">
              <TokenLaunchDetector />
            </ErrorBoundary>
            
            {/* P&L Calculator & Tax Report */}
            <ErrorBoundary fallbackMessage="Failed to load P&L calculator">
              <PnLCalculator />
            </ErrorBoundary>
            
            {/* Multi-Wallet Manager */}
            <ErrorBoundary fallbackMessage="Failed to load multi-wallet manager">
              <MultiWalletManager />
            </ErrorBoundary>
            
            {/* AI Trade Suggestions */}
            <ErrorBoundary fallbackMessage="Failed to load AI trade suggestions">
              <AITradeSuggestions />
            </ErrorBoundary>
            
            {/* Trading Chat Room */}
            <ErrorBoundary fallbackMessage="Failed to load trading chat">
              <TradingChatRoom />
            </ErrorBoundary>
            
            {/* Arbitrage Scanner */}
            <ErrorBoundary fallbackMessage="Failed to load arbitrage scanner">
              <ArbitrageScanner />
            </ErrorBoundary>
            
            {/* Portfolio Risk Analyzer */}
            <ErrorBoundary fallbackMessage="Failed to load portfolio risk analyzer">
              <PortfolioRiskAnalyzer />
            </ErrorBoundary>
            
            {/* Limit Order Manager */}
            <ErrorBoundary fallbackMessage="Failed to load limit orders">
              <LimitOrderManager />
            </ErrorBoundary>
            
            {/* Advanced Orders - Trailing Stops & OCO */}
            <ErrorBoundary fallbackMessage="Failed to load advanced orders">
              <AdvancedOrders />
            </ErrorBoundary>
            
            {/* Correlation Matrix */}
            <ErrorBoundary fallbackMessage="Failed to load correlation matrix">
              <CorrelationMatrix />
            </ErrorBoundary>
            
            {/* Stop-Loss / Take-Profit */}
            <ErrorBoundary fallbackMessage="Failed to load stop-loss/take-profit">
              <StopLossTakeProfit />
            </ErrorBoundary>
            
            {/* Portfolio Heat Map */}
            <ErrorBoundary fallbackMessage="Failed to load portfolio heat map">
              <PortfolioHeatMap />
            </ErrorBoundary>
            
            {/* Trading Signals */}
            <ErrorBoundary fallbackMessage="Failed to load trading signals">
              <TradingSignals />
            </ErrorBoundary>
            
            {/* Position Sizer */}
            <ErrorBoundary fallbackMessage="Failed to load position sizer">
              <PositionSizer />
            </ErrorBoundary>
            
            {/* Session Timer */}
            <ErrorBoundary fallbackMessage="Failed to load session timer">
              <SessionTimer />
            </ErrorBoundary>
            
            {/* Breakout Detector */}
            <ErrorBoundary fallbackMessage="Failed to load breakout detector">
              <BreakoutDetector />
            </ErrorBoundary>
            
            {/* Market Depth */}
            <ErrorBoundary fallbackMessage="Failed to load market depth">
              <MarketDepth />
            </ErrorBoundary>
            
            {/* VWAP Indicator */}
            <ErrorBoundary fallbackMessage="Failed to load VWAP indicator">
              <VWAPIndicator />
            </ErrorBoundary>
            
            {/* Smart Money Flow */}
            <ErrorBoundary fallbackMessage="Failed to load smart money flow">
              <SmartMoneyFlow />
            </ErrorBoundary>
            
            {/* Funding Rate Tracker */}
            <ErrorBoundary fallbackMessage="Failed to load funding rate tracker">
              <FundingRateTracker />
            </ErrorBoundary>
            
            {/* Liquidity Pool Tracking */}
            <ErrorBoundary fallbackMessage="Failed to load liquidity tracking">
              <LiquidityTracking />
            </ErrorBoundary>
            
            {/* News Feed */}
            <ErrorBoundary fallbackMessage="Failed to load news feed">
              <NewsFeed />
            </ErrorBoundary>
            
            {/* AI Portfolio Rebalancing */}
            <ErrorBoundary fallbackMessage="Failed to load portfolio rebalancing">
              <PortfolioRebalancing />
            </ErrorBoundary>
            
            {/* DCA Automation */}
            <ErrorBoundary fallbackMessage="Failed to load DCA automation">
              <DCAAutomation />
            </ErrorBoundary>
            
            {/* Copy Trading */}
            <ErrorBoundary fallbackMessage="Failed to load copy trading">
              <CopyTrading />
            </ErrorBoundary>
            
            {/* Trade Journal */}
            <ErrorBoundary fallbackMessage="Failed to load trade journal">
              <TradeJournal />
            </ErrorBoundary>
            
            {/* Backtesting */}
            <ErrorBoundary fallbackMessage="Failed to load backtesting">
              <Backtesting />
            </ErrorBoundary>
            
            {/* Auto-Trade Scheduler */}
            <ErrorBoundary fallbackMessage="Failed to load auto-trade scheduler">
              <AutoTradeScheduler />
            </ErrorBoundary>
            
            {/* Social Leaderboard */}
            <ErrorBoundary fallbackMessage="Failed to load leaderboard">
              <SocialLeaderboard />
            </ErrorBoundary>
            
            {/* Notification Webhooks */}
            <ErrorBoundary fallbackMessage="Failed to load notification webhooks">
              <NotificationWebhooks />
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

import { Header } from "@/components/dashboard/Header";
import { PortfolioStats } from "@/components/dashboard/PortfolioCard";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { PriceChart } from "@/components/dashboard/PriceChart";
import { Watchlist } from "@/components/dashboard/Watchlist";
import { AutoTrading } from "@/components/dashboard/AutoTrading";
import { RecentTrades } from "@/components/dashboard/RecentTrades";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <MarketOverview />
        <PortfolioStats />
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <PriceChart />
            <RecentTrades />
          </div>
          
          <div className="space-y-6">
            <AutoTrading />
            <Watchlist />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

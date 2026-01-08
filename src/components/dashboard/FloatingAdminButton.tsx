import { useState, useEffect } from "react";
import { 
  Shield, 
  Users, 
  Megaphone, 
  BarChart3, 
  Settings, 
  X, 
  TrendingUp, 
  Bot,
  Activity,
  UserPlus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface AdminStats {
  totalUsers: number;
  newUsersToday: number;
  totalTrades: number;
  tradesToday: number;
  activeBots: number;
  activeAnnouncements: number;
}

const menuItems = [
  { icon: Users, label: "Manage Users", action: "users" },
  { icon: Megaphone, label: "Announcements", action: "announcements" },
  { icon: BarChart3, label: "Analytics", action: "analytics" },
  { icon: Settings, label: "Settings", action: "settings" },
];

export const FloatingAdminButton = () => {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    newUsersToday: 0,
    totalTrades: 0,
    tradesToday: 0,
    activeBots: 0,
    activeAnnouncements: 0,
  });

  useEffect(() => {
    if (!isAdmin) return;

    const fetchStats = async () => {
      const [
        profilesResult,
        newUsersResult,
        tradesResult,
        tradesTodayResult,
        botsResult,
        announcementsResult,
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gte("created_at", new Date().toISOString().split("T")[0]),
        supabase.from("trades").select("*", { count: "exact", head: true }),
        supabase
          .from("trades")
          .select("*", { count: "exact", head: true })
          .gte("created_at", new Date().toISOString().split("T")[0]),
        supabase
          .from("ai_bots")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("announcements")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true),
      ]);

      setStats({
        totalUsers: profilesResult.count || 0,
        newUsersToday: newUsersResult.count || 0,
        totalTrades: tradesResult.count || 0,
        tradesToday: tradesTodayResult.count || 0,
        activeBots: botsResult.count || 0,
        activeAnnouncements: announcementsResult.count || 0,
      });
    };

    fetchStats();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("admin-stats-enhanced")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => fetchStats()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trades" },
        () => fetchStats()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ai_bots" },
        () => fetchStats()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcements" },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  if (loading || !isAdmin) return null;

  const totalBadgeCount = stats.newUsersToday + stats.activeAnnouncements;
  
  // Simple system health based on active bots ratio
  const systemHealth = stats.activeBots > 0 ? "operational" : "idle";
  const healthColor = systemHealth === "operational" ? "text-success" : "text-warning";

  const handleAction = (action: string) => {
    setIsOpen(false);
    navigate(`/admin?tab=${action}`);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 mb-2 w-72"
          >
            <div className="glass rounded-xl border border-border shadow-xl overflow-hidden">
              {/* Header with stats */}
              <div className="p-4 border-b border-border bg-primary/10">
                <p className="text-sm font-semibold text-foreground mb-3">Admin Dashboard</p>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-background/50">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">Users</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">{stats.totalUsers}</p>
                    {stats.newUsersToday > 0 && (
                      <div className="flex items-center gap-1 text-success text-xs">
                        <UserPlus className="h-3 w-3" />
                        +{stats.newUsersToday} today
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 rounded-lg bg-background/50">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">Trades</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">{stats.totalTrades}</p>
                    {stats.tradesToday > 0 && (
                      <p className="text-xs text-success">+{stats.tradesToday} today</p>
                    )}
                  </div>
                  
                  <div className="p-2 rounded-lg bg-background/50">
                    <div className="flex items-center gap-2">
                      <Bot className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">Active Bots</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">{stats.activeBots}</p>
                  </div>
                  
                  <div className="p-2 rounded-lg bg-background/50">
                    <div className="flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">System</span>
                    </div>
                    <p className={`text-sm font-semibold capitalize ${healthColor}`}>
                      {systemHealth}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="p-2 space-y-1">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.action}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleAction(item.action)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors text-left group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </motion.button>
                ))}
              </div>
              
              {/* Footer */}
              <div className="p-2 border-t border-border">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/admin");
                  }}
                >
                  <Shield className="h-4 w-4" />
                  Open Full Dashboard
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        {/* Notification Badge */}
        {totalBadgeCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 z-10"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground shadow-lg">
              {totalBadgeCount > 9 ? "9+" : totalBadgeCount}
            </span>
            <span className="absolute inset-0 rounded-full bg-destructive animate-ping opacity-75" />
          </motion.div>
        )}

        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-14 w-14 rounded-full shadow-lg transition-all duration-200 ${
            isOpen
              ? "bg-secondary hover:bg-secondary/80 text-foreground"
              : "bg-primary hover:bg-primary/90 glow-primary"
          }`}
          size="icon"
          title="Admin Actions"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Shield className="h-6 w-6" />}
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
};

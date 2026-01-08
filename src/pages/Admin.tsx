import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { AdminAnnouncements } from '@/components/admin/AdminAnnouncements';
import { AdminRoleManager } from '@/components/admin/AdminRoleManager';
import { 
  Users, Bot, TrendingUp, Bell, Shield, 
  LogOut, Search, RefreshCw, Trash2, ChevronLeft,
  Database, Activity, BarChart3, Megaphone, Crown
} from 'lucide-react';

const Admin = () => {
  const { isAdmin, loading, user } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrades: 0,
    totalBots: 0,
    totalAlerts: 0
  });
  
  const [users, setUsers] = useState<any[]>([]);
  const [trades, setTrades] = useState<any[]>([]);
  const [bots, setBots] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [journals, setJournals] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [isAdmin, loading, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  const fetchAllData = async () => {
    setIsRefreshing(true);
    try {
      const [profilesRes, tradesRes, botsRes, alertsRes, journalsRes] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('trades').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('ai_bots').select('*'),
        supabase.from('price_alerts').select('*'),
        supabase.from('trade_journal').select('*').order('created_at', { ascending: false }).limit(50)
      ]);

      if (profilesRes.data) setUsers(profilesRes.data);
      if (tradesRes.data) setTrades(tradesRes.data);
      if (botsRes.data) setBots(botsRes.data);
      if (alertsRes.data) setAlerts(alertsRes.data);
      if (journalsRes.data) setJournals(journalsRes.data);

      setStats({
        totalUsers: profilesRes.data?.length || 0,
        totalTrades: tradesRes.data?.length || 0,
        totalBots: botsRes.data?.length || 0,
        totalAlerts: alertsRes.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin data",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const deleteBot = async (botId: string) => {
    const { error } = await supabase.from('ai_bots').delete().eq('id', botId);
    if (error) {
      toast({ title: "Error", description: "Failed to delete bot", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Bot deleted successfully" });
      fetchAllData();
    }
  };

  const deleteAlert = async (alertId: string) => {
    const { error } = await supabase.from('price_alerts').delete().eq('id', alertId);
    if (error) {
      toast({ title: "Error", description: "Failed to delete alert", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Alert deleted successfully" });
      fetchAllData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.user_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Admin
            </Badge>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <TabsList className="bg-muted/50 flex-wrap h-auto">
              <TabsTrigger value="overview" className="gap-2">
                <Activity className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="roles" className="gap-2">
                <Crown className="h-4 w-4" />
                Roles
              </TabsTrigger>
              <TabsTrigger value="announcements" className="gap-2">
                <Megaphone className="h-4 w-4" />
                Announcements
              </TabsTrigger>
              <TabsTrigger value="trades" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Trades
              </TabsTrigger>
              <TabsTrigger value="bots" className="gap-2">
                <Bot className="h-4 w-4" />
                Bots
              </TabsTrigger>
              <TabsTrigger value="alerts" className="gap-2">
                <Bell className="h-4 w-4" />
                Alerts
              </TabsTrigger>
              <TabsTrigger value="journals" className="gap-2">
                <Database className="h-4 w-4" />
                Journals
              </TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" onClick={fetchAllData} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground mt-1">Registered profiles</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalTrades}</div>
                  <p className="text-xs text-muted-foreground mt-1">Executed trades</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
                  <Bot className="h-5 w-5 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalBots}</div>
                  <p className="text-xs text-muted-foreground mt-1">AI trading bots</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Price Alerts</CardTitle>
                  <Bell className="h-5 w-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalAlerts}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active alerts</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Trades</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {trades.slice(0, 10).map((trade) => (
                        <div key={trade.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium">{trade.symbol}</p>
                            <p className="text-xs text-muted-foreground">{trade.type} • {trade.market}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${Number(trade.price).toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">Qty: {trade.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {users.slice(0, 10).map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium">{user.full_name || 'Anonymous'}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{user.user_id}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${Number(user.total_balance || 0).toFixed(2)}</p>
                            <Badge variant="outline" className="text-xs">{user.risk_tolerance}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AdminAnalytics users={users} trades={trades} bots={bots} />
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles">
            <AdminRoleManager users={users} />
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements">
            <AdminAnnouncements />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search users..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Risk</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.full_name || 'Anonymous'}</TableCell>
                          <TableCell className="font-mono text-xs truncate max-w-[150px]">{user.user_id}</TableCell>
                          <TableCell>${Number(user.total_balance || 0).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.risk_tolerance}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trades Tab */}
          <TabsContent value="trades" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Market</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>P/L</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trades.map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell className="font-medium">{trade.symbol}</TableCell>
                          <TableCell>
                            <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                              {trade.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{trade.market}</TableCell>
                          <TableCell>${Number(trade.price).toFixed(4)}</TableCell>
                          <TableCell>{trade.quantity}</TableCell>
                          <TableCell className={Number(trade.profit_loss) >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {trade.profit_loss ? `$${Number(trade.profit_loss).toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{trade.status}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(trade.created_at).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bots Tab */}
          <TabsContent value="bots" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Strategy</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total Trades</TableHead>
                        <TableHead>Win Rate</TableHead>
                        <TableHead>Profit</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bots.map((bot) => (
                        <TableRow key={bot.id}>
                          <TableCell className="font-medium">{bot.name}</TableCell>
                          <TableCell>{bot.strategy}</TableCell>
                          <TableCell>
                            <Badge variant={bot.risk_level === 'aggressive' ? 'destructive' : 'secondary'}>
                              {bot.risk_level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={bot.is_active ? 'default' : 'outline'}>
                              {bot.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>{bot.total_trades}</TableCell>
                          <TableCell>{Number(bot.win_rate || 0).toFixed(1)}%</TableCell>
                          <TableCell className={Number(bot.total_profit) >= 0 ? 'text-green-500' : 'text-red-500'}>
                            ${Number(bot.total_profit || 0).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => deleteBot(bot.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Market</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Target Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alerts.map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell className="font-medium">{alert.symbol}</TableCell>
                          <TableCell>{alert.market}</TableCell>
                          <TableCell>{alert.condition}</TableCell>
                          <TableCell>${Number(alert.target_price).toFixed(4)}</TableCell>
                          <TableCell>
                            <Badge variant={alert.is_triggered ? 'secondary' : alert.is_active ? 'default' : 'outline'}>
                              {alert.is_triggered ? 'Triggered' : alert.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(alert.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => deleteAlert(alert.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Journals Tab */}
          <TabsContent value="journals" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Emotion</TableHead>
                        <TableHead>Market Condition</TableHead>
                        <TableHead>Entry</TableHead>
                        <TableHead>Exit</TableHead>
                        <TableHead>P/L</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {journals.map((journal) => (
                        <TableRow key={journal.id}>
                          <TableCell className="font-medium max-w-[200px] truncate">{journal.title}</TableCell>
                          <TableCell>{journal.emotion || '-'}</TableCell>
                          <TableCell>{journal.market_condition || '-'}</TableCell>
                          <TableCell>{journal.entry_price ? `$${Number(journal.entry_price).toFixed(4)}` : '-'}</TableCell>
                          <TableCell>{journal.exit_price ? `$${Number(journal.exit_price).toFixed(4)}` : '-'}</TableCell>
                          <TableCell className={Number(journal.pnl) >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {journal.pnl ? `$${Number(journal.pnl).toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(journal.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;

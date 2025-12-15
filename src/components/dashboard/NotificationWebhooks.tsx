import { useState, useEffect } from 'react';
import { Bell, MessageCircle, Plus, Trash2, Loader2, Send, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Webhook {
  id: string;
  webhook_type: 'telegram' | 'discord';
  webhook_url: string;
  is_active: boolean;
  notify_trades: boolean;
  notify_alerts: boolean;
  notify_dca: boolean;
}

export const NotificationWebhooks = () => {
  const { user } = useAuth();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  
  const [newWebhook, setNewWebhook] = useState({
    webhook_type: 'discord' as 'telegram' | 'discord',
    webhook_url: '',
  });

  useEffect(() => {
    if (user) fetchWebhooks();
  }, [user]);

  const fetchWebhooks = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('notification_webhooks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setWebhooks(data.map(w => ({
        ...w,
        webhook_type: w.webhook_type as 'telegram' | 'discord'
      })));
    }
    setIsLoading(false);
  };

  const createWebhook = async () => {
    if (!user || !newWebhook.webhook_url) {
      toast.error('Please enter a webhook URL');
      return;
    }

    setIsCreating(true);
    const { error } = await supabase.from('notification_webhooks').insert({
      user_id: user.id,
      webhook_type: newWebhook.webhook_type,
      webhook_url: newWebhook.webhook_url,
    });

    if (error) {
      toast.error('Failed to add webhook');
    } else {
      toast.success('Webhook added successfully');
      setShowCreateDialog(false);
      setNewWebhook({ webhook_type: 'discord', webhook_url: '' });
      fetchWebhooks();
    }
    setIsCreating(false);
  };

  const toggleWebhook = async (id: string, field: keyof Webhook, value: boolean) => {
    const { error } = await supabase
      .from('notification_webhooks')
      .update({ [field]: value })
      .eq('id', id);

    if (!error) {
      setWebhooks(prev => 
        prev.map(w => w.id === id ? { ...w, [field]: value } : w)
      );
    }
  };

  const deleteWebhook = async (id: string) => {
    const { error } = await supabase
      .from('notification_webhooks')
      .delete()
      .eq('id', id);

    if (!error) {
      setWebhooks(prev => prev.filter(w => w.id !== id));
      toast.success('Webhook removed');
    }
  };

  const testWebhook = async (webhook: Webhook) => {
    setIsTesting(webhook.id);
    try {
      const message = webhook.webhook_type === 'discord' 
        ? { content: '🚀 **Test from Cardinal Trading Bot**\n\nYour webhook is connected successfully! You will receive trade alerts, price notifications, and DCA updates here.' }
        : { text: '🚀 *Test from Cardinal Trading Bot*\n\nYour webhook is connected successfully!' };

      await fetch(webhook.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify(message),
      });

      toast.success('Test notification sent! Check your channel.');
    } catch (error) {
      toast.error('Failed to send test notification');
    }
    setIsTesting(null);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
            <Bell className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold">Notification Webhooks</h3>
            <p className="text-xs text-muted-foreground">Telegram & Discord alerts</p>
          </div>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Notification Webhook</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select 
                  value={newWebhook.webhook_type} 
                  onValueChange={(v: 'telegram' | 'discord') => setNewWebhook(p => ({ ...p, webhook_type: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discord">Discord</SelectItem>
                    <SelectItem value="telegram">Telegram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input
                  value={newWebhook.webhook_url}
                  onChange={(e) => setNewWebhook(p => ({ ...p, webhook_url: e.target.value }))}
                  placeholder={newWebhook.webhook_type === 'discord' 
                    ? 'https://discord.com/api/webhooks/...' 
                    : 'https://api.telegram.org/bot.../sendMessage'}
                />
                <p className="text-xs text-muted-foreground">
                  {newWebhook.webhook_type === 'discord' 
                    ? 'Create a webhook in Discord: Server Settings → Integrations → Webhooks'
                    : 'Use your Telegram bot token with the sendMessage endpoint'}
                </p>
              </div>
              
              <Button onClick={createWebhook} disabled={isCreating} className="w-full">
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Add Webhook
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : webhooks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No webhooks configured</p>
          <p className="text-xs mt-1">Add Discord or Telegram to get alerts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className={cn(
                "p-3 rounded-lg border transition-all",
                webhook.is_active ? "border-primary/30 bg-primary/5" : "border-border bg-secondary/30"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant={webhook.webhook_type === 'discord' ? 'default' : 'secondary'}>
                    {webhook.webhook_type === 'discord' ? '💬 Discord' : '📱 Telegram'}
                  </Badge>
                  {webhook.is_active && <Check className="h-4 w-4 text-success" />}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7"
                    onClick={() => testWebhook(webhook)}
                    disabled={isTesting === webhook.id}
                  >
                    {isTesting === webhook.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Send className="h-3 w-3" />
                    )}
                  </Button>
                  <Switch
                    checked={webhook.is_active}
                    onCheckedChange={(v) => toggleWebhook(webhook.id, 'is_active', v)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-destructive"
                    onClick={() => deleteWebhook(webhook.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Switch
                    className="scale-75"
                    checked={webhook.notify_trades}
                    onCheckedChange={(v) => toggleWebhook(webhook.id, 'notify_trades', v)}
                  />
                  <span className="text-muted-foreground">Trades</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Switch
                    className="scale-75"
                    checked={webhook.notify_alerts}
                    onCheckedChange={(v) => toggleWebhook(webhook.id, 'notify_alerts', v)}
                  />
                  <span className="text-muted-foreground">Price Alerts</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Switch
                    className="scale-75"
                    checked={webhook.notify_dca}
                    onCheckedChange={(v) => toggleWebhook(webhook.id, 'notify_dca', v)}
                  />
                  <span className="text-muted-foreground">DCA</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

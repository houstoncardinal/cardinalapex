import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface NotificationSettings {
  tradeExecutions: boolean;
  priceAlerts: boolean;
  highConfidenceSignals: boolean;
}

export const useNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>({
    tradeExecutions: true,
    priceAlerts: true,
    highConfidenceSignals: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      toast({
        title: "Notifications Not Supported",
        description: "Your browser doesn't support push notifications",
        variant: "destructive",
      });
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive trade alerts on your device",
        });
        return true;
      } else {
        toast({
          title: "Notifications Blocked",
          description: "Enable notifications in your browser settings",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported, toast]);

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!isSupported || permission !== 'granted') {
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        requireInteraction: true,
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close after 10 seconds
      setTimeout(() => notification.close(), 10000);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }, [isSupported, permission]);

  const notifyTradeExecution = useCallback((
    symbol: string,
    action: 'BUY' | 'SELL',
    price: number,
    profit?: number
  ) => {
    if (!settings.tradeExecutions) return;

    const emoji = action === 'BUY' ? '📈' : '📉';
    const profitText = profit !== undefined 
      ? profit >= 0 ? `+$${profit.toFixed(2)}` : `-$${Math.abs(profit).toFixed(2)}`
      : '';

    sendNotification(`${emoji} ${action} ${symbol}`, {
      body: `Executed at $${price.toLocaleString()}${profitText ? ` | ${profitText}` : ''}`,
      tag: `trade-${Date.now()}`,
    });
  }, [settings.tradeExecutions, sendNotification]);

  const notifyPriceAlert = useCallback((
    symbol: string,
    targetPrice: number,
    currentPrice: number,
    condition: 'above' | 'below'
  ) => {
    if (!settings.priceAlerts) return;

    const emoji = condition === 'above' ? '🚀' : '⚠️';
    sendNotification(`${emoji} ${symbol} Price Alert`, {
      body: `${symbol} is now ${condition} $${targetPrice.toLocaleString()} (Current: $${currentPrice.toLocaleString()})`,
      tag: `alert-${symbol}-${targetPrice}`,
    });
  }, [settings.priceAlerts, sendNotification]);

  const notifyHighConfidenceSignal = useCallback((
    symbol: string,
    pattern: string,
    confidence: number,
    direction: 'bullish' | 'bearish'
  ) => {
    if (!settings.highConfidenceSignals) return;

    const emoji = direction === 'bullish' ? '🎯' : '🎯';
    sendNotification(`${emoji} High Confidence Signal: ${symbol}`, {
      body: `${pattern} detected at ${confidence}% confidence - ${direction.toUpperCase()}`,
      tag: `signal-${symbol}-${Date.now()}`,
    });
  }, [settings.highConfidenceSignals, sendNotification]);

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    isSupported,
    permission,
    settings,
    requestPermission,
    sendNotification,
    notifyTradeExecution,
    notifyPriceAlert,
    notifyHighConfidenceSignal,
    updateSettings,
  };
};

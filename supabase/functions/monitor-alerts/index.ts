import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PriceData {
  [symbol: string]: number;
}

// Fetch current prices
const fetchPrices = async (symbols: string[]): Promise<PriceData> => {
  const prices: PriceData = {};
  
  // Map common symbols to CoinGecko IDs
  const symbolMap: { [key: string]: string } = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'DOGE': 'dogecoin',
    'XRP': 'ripple',
    'ADA': 'cardano',
    'AVAX': 'avalanche-2',
    'DOT': 'polkadot',
    'MATIC': 'matic-network',
    'LINK': 'chainlink',
    'SHIB': 'shiba-inu',
    'PEPE': 'pepe',
    'WIF': 'dogwifhat',
    'BONK': 'bonk'
  };

  const cryptoSymbols = symbols.filter(s => symbolMap[s.toUpperCase()]);
  
  if (cryptoSymbols.length > 0) {
    try {
      const ids = cryptoSymbols.map(s => symbolMap[s.toUpperCase()]).join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
      );
      const data = await response.json();
      
      for (const symbol of cryptoSymbols) {
        const id = symbolMap[symbol.toUpperCase()];
        if (data[id]?.usd) {
          prices[symbol.toUpperCase()] = data[id].usd;
        }
      }
    } catch (error) {
      console.error('Failed to fetch crypto prices:', error);
    }
  }

  // For stock symbols, use simulated prices
  const stockSymbols = symbols.filter(s => !symbolMap[s.toUpperCase()]);
  const stockPrices: { [key: string]: number } = {
    'AAPL': 178.50,
    'NVDA': 487.20,
    'TSLA': 248.30,
    'GOOGL': 141.80,
    'MSFT': 378.90,
    'AMZN': 178.25,
    'META': 485.60
  };

  for (const symbol of stockSymbols) {
    const basePrice = stockPrices[symbol.toUpperCase()] || 100;
    // Add small random variance
    prices[symbol.toUpperCase()] = basePrice * (1 + (Math.random() - 0.5) * 0.02);
  }

  return prices;
};

// Send webhook notification
const sendWebhookNotification = async (
  webhookUrl: string,
  webhookType: string,
  alert: any,
  currentPrice: number
): Promise<boolean> => {
  try {
    const message = `🚨 Price Alert: ${alert.symbol} is now ${alert.condition} $${alert.target_price} (Current: $${currentPrice.toFixed(2)})`;
    
    let payload: any;
    
    if (webhookType === 'discord') {
      payload = {
        content: message,
        embeds: [{
          title: `${alert.symbol} Price Alert Triggered`,
          description: `Target: $${alert.target_price}\nCondition: ${alert.condition}\nCurrent Price: $${currentPrice.toFixed(2)}`,
          color: alert.condition === 'above' ? 0x00ff00 : 0xff0000,
          timestamp: new Date().toISOString()
        }]
      };
    } else if (webhookType === 'telegram') {
      payload = {
        text: message,
        parse_mode: 'HTML'
      };
    } else {
      payload = {
        type: 'price_alert',
        symbol: alert.symbol,
        target_price: alert.target_price,
        current_price: currentPrice,
        condition: alert.condition,
        triggered_at: new Date().toISOString()
      };
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send webhook:', error);
    return false;
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting price alert monitoring...');

    // Fetch all active, non-triggered alerts
    const { data: alerts, error: alertsError } = await supabaseClient
      .from('price_alerts')
      .select('*')
      .eq('is_active', true)
      .eq('is_triggered', false);

    if (alertsError) {
      throw new Error(`Failed to fetch alerts: ${alertsError.message}`);
    }

    if (!alerts || alerts.length === 0) {
      console.log('No active alerts to monitor');
      return new Response(JSON.stringify({ 
        message: 'No active alerts',
        triggered: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Monitoring ${alerts.length} active alerts`);

    // Get unique symbols
    const symbols = [...new Set(alerts.map(a => a.symbol))];
    
    // Fetch current prices
    const prices = await fetchPrices(symbols);
    console.log('Current prices:', prices);

    const triggeredAlerts: any[] = [];
    const notificationsSent: any[] = [];

    for (const alert of alerts) {
      const currentPrice = prices[alert.symbol.toUpperCase()];
      
      if (!currentPrice) {
        console.log(`No price available for ${alert.symbol}`);
        continue;
      }

      let isTriggered = false;

      if (alert.condition === 'above' && currentPrice >= alert.target_price) {
        isTriggered = true;
      } else if (alert.condition === 'below' && currentPrice <= alert.target_price) {
        isTriggered = true;
      }

      if (isTriggered) {
        console.log(`Alert triggered: ${alert.symbol} ${alert.condition} $${alert.target_price} (Current: $${currentPrice})`);

        // Update alert as triggered
        const { error: updateError } = await supabaseClient
          .from('price_alerts')
          .update({
            is_triggered: true,
            triggered_at: new Date().toISOString()
          })
          .eq('id', alert.id);

        if (updateError) {
          console.error(`Failed to update alert ${alert.id}:`, updateError);
          continue;
        }

        triggeredAlerts.push({
          id: alert.id,
          symbol: alert.symbol,
          targetPrice: alert.target_price,
          currentPrice,
          condition: alert.condition
        });

        // Check for webhooks to notify
        const { data: webhooks } = await supabaseClient
          .from('notification_webhooks')
          .select('*')
          .eq('user_id', alert.user_id)
          .eq('is_active', true)
          .eq('notify_alerts', true);

        if (webhooks && webhooks.length > 0) {
          for (const webhook of webhooks) {
            const sent = await sendWebhookNotification(
              webhook.webhook_url,
              webhook.webhook_type,
              alert,
              currentPrice
            );

            if (sent) {
              notificationsSent.push({
                alertId: alert.id,
                webhookType: webhook.webhook_type
              });
              console.log(`Notification sent via ${webhook.webhook_type} for alert ${alert.id}`);
            }
          }
        }
      }
    }

    console.log(`Alert monitoring complete: ${triggeredAlerts.length} alerts triggered, ${notificationsSent.length} notifications sent`);

    return new Response(JSON.stringify({
      message: 'Alert monitoring complete',
      monitored: alerts.length,
      triggered: triggeredAlerts.length,
      notificationsSent: notificationsSent.length,
      alerts: triggeredAlerts
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in monitor-alerts:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

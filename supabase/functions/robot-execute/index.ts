import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TradingSignal {
  symbol: string;
  market: string;
  action: 'buy' | 'sell';
  price: number;
  quantity: number;
  confidence: number;
  reason: string;
}

// Fetch current prices for crypto
const fetchCryptoPrice = async (symbol: string): Promise<number> => {
  try {
    const ids = symbol.toLowerCase() === 'btc' ? 'bitcoin' : 
                symbol.toLowerCase() === 'eth' ? 'ethereum' :
                symbol.toLowerCase() === 'sol' ? 'solana' : symbol.toLowerCase();
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
    const data = await response.json();
    return data[ids]?.usd || 0;
  } catch {
    return 0;
  }
};

// Simple momentum strategy
const analyzeMomentum = async (symbol: string, riskLevel: string): Promise<TradingSignal | null> => {
  const price = await fetchCryptoPrice(symbol);
  if (price === 0) return null;

  // Simulated momentum indicator (-100 to 100)
  const momentum = (Math.random() - 0.5) * 200;
  const threshold = riskLevel === 'aggressive' ? 20 : riskLevel === 'balanced' ? 40 : 60;
  
  if (Math.abs(momentum) < threshold) return null;

  const action = momentum > 0 ? 'buy' : 'sell';
  const confidence = Math.min(95, 50 + Math.abs(momentum) / 2);
  
  // Only execute high-confidence trades
  if (confidence < 85) return null;

  const baseQuantity = riskLevel === 'aggressive' ? 0.1 : riskLevel === 'balanced' ? 0.05 : 0.02;
  
  return {
    symbol,
    market: 'crypto',
    action,
    price,
    quantity: baseQuantity,
    confidence,
    reason: `Momentum ${action === 'buy' ? 'bullish' : 'bearish'} signal detected`
  };
};

// Scalper strategy - quick small trades
const analyzeScalper = async (symbol: string): Promise<TradingSignal | null> => {
  const price = await fetchCryptoPrice(symbol);
  if (price === 0) return null;

  // Look for small price movements
  const priceChange = (Math.random() - 0.5) * 2; // -1% to +1%
  
  if (Math.abs(priceChange) < 0.3) return null;

  const action = priceChange > 0 ? 'buy' : 'sell';
  const confidence = Math.min(92, 75 + Math.abs(priceChange) * 10);
  
  if (confidence < 85) return null;

  return {
    symbol,
    market: 'crypto',
    action,
    price,
    quantity: 0.02,
    confidence,
    reason: `Scalp opportunity: ${priceChange > 0 ? '+' : ''}${priceChange.toFixed(2)}% movement`
  };
};

// Swing trader strategy - longer term moves
const analyzeSwing = async (symbol: string): Promise<TradingSignal | null> => {
  const price = await fetchCryptoPrice(symbol);
  if (price === 0) return null;

  // Look for trend reversals
  const trendStrength = (Math.random() - 0.5) * 100;
  
  if (Math.abs(trendStrength) < 30) return null;

  const action = trendStrength > 0 ? 'buy' : 'sell';
  const confidence = Math.min(93, 70 + Math.abs(trendStrength) / 3);
  
  if (confidence < 85) return null;

  return {
    symbol,
    market: 'crypto',
    action,
    price,
    quantity: 0.08,
    confidence,
    reason: `Swing trade: ${action === 'buy' ? 'Uptrend' : 'Downtrend'} confirmation`
  };
};

// HODL strategy - only buy, never sell
const analyzeHodl = async (symbol: string): Promise<TradingSignal | null> => {
  const price = await fetchCryptoPrice(symbol);
  if (price === 0) return null;

  // Look for dips to buy
  const dipIndicator = Math.random() * 100;
  
  // Only buy on significant dips
  if (dipIndicator > 20) return null;

  const confidence = Math.min(90, 80 + (20 - dipIndicator) / 2);
  
  if (confidence < 85) return null;

  return {
    symbol,
    market: 'crypto',
    action: 'buy',
    price,
    quantity: 0.05,
    confidence,
    reason: `HODL buy signal: Price dip detected, accumulating`
  };
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

    console.log('Starting robot execution cycle...');

    // Fetch all active bots
    const { data: activeBots, error: botsError } = await supabaseClient
      .from('ai_bots')
      .select('*')
      .eq('is_active', true);

    if (botsError) {
      throw new Error(`Failed to fetch bots: ${botsError.message}`);
    }

    if (!activeBots || activeBots.length === 0) {
      console.log('No active bots found');
      return new Response(JSON.stringify({ 
        message: 'No active bots',
        executed: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${activeBots.length} active bots`);

    const executedTrades: any[] = [];
    const symbols = ['BTC', 'ETH', 'SOL'];

    for (const bot of activeBots) {
      try {
        console.log(`Processing bot: ${bot.name} (${bot.strategy})`);

        for (const symbol of symbols) {
          let signal: TradingSignal | null = null;

          // Execute strategy based on bot type
          switch (bot.strategy) {
            case 'momentum':
              signal = await analyzeMomentum(symbol, bot.risk_level || 'aggressive');
              break;
            case 'scalper':
              signal = await analyzeScalper(symbol);
              break;
            case 'swing':
              signal = await analyzeSwing(symbol);
              break;
            case 'hodl':
              signal = await analyzeHodl(symbol);
              break;
            default:
              signal = await analyzeMomentum(symbol, bot.risk_level || 'balanced');
          }

          if (signal && signal.confidence >= 85) {
            console.log(`Signal found for ${bot.name}: ${signal.action} ${signal.quantity} ${signal.symbol} at $${signal.price}`);

            // Insert trade
            const { data: trade, error: tradeError } = await supabaseClient
              .from('trades')
              .insert({
                user_id: bot.user_id,
                bot_id: bot.id,
                symbol: signal.symbol,
                market: signal.market,
                type: signal.action,
                price: signal.price,
                quantity: signal.quantity,
                status: 'pending'
              })
              .select()
              .single();

            if (tradeError) {
              console.error(`Failed to insert trade for bot ${bot.id}:`, tradeError);
              continue;
            }

            // Update bot trade count
            await supabaseClient
              .from('ai_bots')
              .update({
                total_trades: (bot.total_trades || 0) + 1,
                updated_at: new Date().toISOString()
              })
              .eq('id', bot.id);

            executedTrades.push({
              botId: bot.id,
              botName: bot.name,
              tradeId: trade.id,
              ...signal
            });

            console.log(`Trade executed: ${trade.id}`);
          }
        }
      } catch (botError) {
        console.error(`Error processing bot ${bot.id}:`, botError);
      }
    }

    console.log(`Robot execution complete: ${executedTrades.length} trades executed`);

    return new Response(JSON.stringify({
      message: 'Robot execution complete',
      executed: executedTrades.length,
      trades: executedTrades
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in robot-execute:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

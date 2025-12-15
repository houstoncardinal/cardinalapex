import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid user" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { symbol, market, action, price, quantity, confidence, pattern, entry, target, stopLoss } = await req.json();

    console.log(`Executing trade for ${user.id}: ${action} ${quantity} ${symbol} at $${price}`);
    console.log(`Pattern: ${pattern}, Confidence: ${confidence}%, Entry: $${entry}, Target: $${target}, Stop: $${stopLoss}`);

    // Validate confidence threshold
    if (confidence < 85) {
      return new Response(JSON.stringify({ 
        error: "Trade not executed - confidence below 85% threshold",
        confidence 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user's active bot
    const { data: bot, error: botError } = await supabaseClient
      .from('ai_bots')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1)
      .single();

    if (botError) {
      console.error("Bot fetch error:", botError);
    }

    // Calculate potential profit/loss based on entry vs target
    const tradeType = action.toLowerCase(); // Convert to lowercase for DB constraint
    const potentialProfit = tradeType === 'buy' 
      ? ((target - entry) / entry) * 100 * quantity
      : ((entry - target) / entry) * 100 * quantity;

    // Insert trade record
    const { data: trade, error: tradeError } = await supabaseClient
      .from('trades')
      .insert({
        user_id: user.id,
        bot_id: bot?.id || null,
        symbol,
        market,
        type: tradeType, // Must be lowercase 'buy' or 'sell'
        price: entry,
        quantity,
        status: 'pending',
        profit_loss: null
      })
      .select()
      .single();

    if (tradeError) {
      console.error("Trade insert error:", tradeError);
      throw new Error("Failed to execute trade");
    }

    console.log("Trade executed successfully:", trade.id);

    // Update bot statistics
    if (bot) {
      // Get current bot stats first
      const { data: currentBot } = await supabaseClient
        .from('ai_bots')
        .select('total_trades')
        .eq('id', bot.id)
        .single();
      
      await supabaseClient
        .from('ai_bots')
        .update({ 
          total_trades: (currentBot?.total_trades || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', bot.id);
    }

    return new Response(JSON.stringify({ 
      success: true,
      trade,
      pattern,
      confidence,
      potentialProfit,
      message: `${action} order placed for ${quantity} ${symbol} at $${entry.toFixed(2)}`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in execute-trade:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

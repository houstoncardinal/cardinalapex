import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map common symbols to CoinGecko IDs
const symbolToCoingeckoId: { [key: string]: string } = {
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

const fetchCurrentPrice = async (symbol: string, market: string): Promise<number> => {
  try {
    if (market === 'crypto') {
      const coingeckoId = symbolToCoingeckoId[symbol.toUpperCase()] || symbol.toLowerCase();
      console.log(`Fetching price for ${symbol} using CoinGecko ID: ${coingeckoId}`);
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`);
      const data = await response.json();
      console.log(`CoinGecko response for ${coingeckoId}:`, JSON.stringify(data));
      return data[coingeckoId]?.usd || 0;
    }
    // For stocks, return simulated price with slight variance
    const basePrice = symbol === 'AAPL' ? 178 : symbol === 'NVDA' ? 487 : symbol === 'TSLA' ? 248 : 100;
    return basePrice * (1 + (Math.random() - 0.5) * 0.02);
  } catch (error) {
    console.error(`Failed to fetch price for ${symbol}:`, error);
    return 0;
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

    console.log('Starting trade settlement process...');

    // Fetch all pending trades
    const { data: pendingTrades, error: fetchError } = await supabaseClient
      .from('trades')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.error('Failed to fetch pending trades:', fetchError);
      throw new Error('Failed to fetch pending trades');
    }

    if (!pendingTrades || pendingTrades.length === 0) {
      console.log('No pending trades to settle');
      return new Response(JSON.stringify({ 
        message: 'No pending trades to settle',
        settled: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${pendingTrades.length} pending trades to settle`);

    const settledTrades = [];
    const failedTrades = [];

    for (const trade of pendingTrades) {
      try {
        // Get current price for P&L calculation
        const currentPrice = await fetchCurrentPrice(trade.symbol, trade.market);
        
        if (currentPrice === 0) {
          console.error(`Could not get price for ${trade.symbol}, marking as failed`);
          failedTrades.push(trade.id);
          
          await supabaseClient
            .from('trades')
            .update({ status: 'failed' })
            .eq('id', trade.id);
          continue;
        }

        // Calculate P&L based on trade type
        let profitLoss: number;
        if (trade.type === 'buy') {
          // For buy trades, P&L = (current price - entry price) * quantity
          profitLoss = (currentPrice - trade.price) * trade.quantity;
        } else {
          // For sell trades, P&L = (entry price - current price) * quantity
          profitLoss = (trade.price - currentPrice) * trade.quantity;
        }

        // Update trade with P&L and completed status
        const { error: updateError } = await supabaseClient
          .from('trades')
          .update({
            status: 'completed',
            profit_loss: profitLoss
          })
          .eq('id', trade.id);

        if (updateError) {
          console.error(`Failed to update trade ${trade.id}:`, updateError);
          failedTrades.push(trade.id);
          continue;
        }

        // Update bot statistics if trade was from a bot
        if (trade.bot_id) {
          const { data: bot } = await supabaseClient
            .from('ai_bots')
            .select('total_profit, win_rate, total_trades')
            .eq('id', trade.bot_id)
            .single();

          if (bot) {
            const newTotalProfit = (bot.total_profit || 0) + profitLoss;
            const totalTrades = (bot.total_trades || 0);
            const currentWins = Math.round((bot.win_rate || 0) / 100 * totalTrades);
            const newWins = profitLoss > 0 ? currentWins + 1 : currentWins;
            const newWinRate = totalTrades > 0 ? (newWins / totalTrades) * 100 : 0;

            await supabaseClient
              .from('ai_bots')
              .update({
                total_profit: newTotalProfit,
                win_rate: newWinRate,
                updated_at: new Date().toISOString()
              })
              .eq('id', trade.bot_id);
          }
        }

        // Update user portfolio holdings
        const { data: holding } = await supabaseClient
          .from('portfolio_holdings')
          .select('*')
          .eq('user_id', trade.user_id)
          .eq('symbol', trade.symbol)
          .single();

        if (trade.type === 'buy') {
          if (holding) {
            // Update existing holding
            const newQuantity = holding.quantity + trade.quantity;
            const newAvgPrice = ((holding.average_buy_price * holding.quantity) + (trade.price * trade.quantity)) / newQuantity;
            
            await supabaseClient
              .from('portfolio_holdings')
              .update({
                quantity: newQuantity,
                average_buy_price: newAvgPrice,
                updated_at: new Date().toISOString()
              })
              .eq('id', holding.id);
          } else {
            // Create new holding
            await supabaseClient
              .from('portfolio_holdings')
              .insert({
                user_id: trade.user_id,
                symbol: trade.symbol,
                market: trade.market,
                quantity: trade.quantity,
                average_buy_price: trade.price
              });
          }
        } else if (trade.type === 'sell' && holding) {
          // Reduce holding
          const newQuantity = Math.max(0, holding.quantity - trade.quantity);
          if (newQuantity === 0) {
            await supabaseClient
              .from('portfolio_holdings')
              .delete()
              .eq('id', holding.id);
          } else {
            await supabaseClient
              .from('portfolio_holdings')
              .update({
                quantity: newQuantity,
                updated_at: new Date().toISOString()
              })
              .eq('id', holding.id);
          }
        }

        settledTrades.push({
          id: trade.id,
          symbol: trade.symbol,
          type: trade.type,
          profitLoss,
          currentPrice
        });

        console.log(`Settled trade ${trade.id}: ${trade.type} ${trade.quantity} ${trade.symbol} - P&L: $${profitLoss.toFixed(2)}`);
      } catch (tradeError) {
        console.error(`Error settling trade ${trade.id}:`, tradeError);
        failedTrades.push(trade.id);
      }
    }

    const totalPnL = settledTrades.reduce((sum, t) => sum + t.profitLoss, 0);

    console.log(`Settlement complete: ${settledTrades.length} settled, ${failedTrades.length} failed, Total P&L: $${totalPnL.toFixed(2)}`);

    return new Response(JSON.stringify({
      message: 'Trade settlement complete',
      settled: settledTrades.length,
      failed: failedTrades.length,
      totalPnL,
      trades: settledTrades
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in settle-trades:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

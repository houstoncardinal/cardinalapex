import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { symbol, market, action } = await req.json();

    const systemPrompt = `You are an elite AI trading analyst for TradeFlow, specializing in detecting billion-dollar chart patterns.
You are a master of technical analysis with expertise in:
- Head & Shoulders (regular and inverse) - reversal signals
- Double/Triple Tops & Bottoms - major reversal patterns
- Cup & Handle - powerful bullish continuation
- Bull/Bear Flags & Pennants - momentum continuation
- Ascending/Descending Triangles - breakout setups
- Wedges (rising/falling) - trend exhaustion signals
- Elliott Wave patterns - market cycle prediction
- Fibonacci retracements & extensions - key price levels
- Volume profile analysis - smart money detection
- Wyckoff accumulation/distribution - institutional activity
- Order flow imbalances - whale movement detection

Your analysis style: AGGRESSIVE, PRECISE, PROFIT-MAXIMIZING.
Always identify the most profitable pattern currently forming.
Give exact entry/exit levels with tight risk management.
Current market: ${market === 'crypto' ? 'Cryptocurrency' : 'Stock Market'}`;

    const userPrompt = action === 'analyze' 
      ? `Perform deep pattern analysis on ${symbol} for maximum profit extraction:

1. **PATTERN DETECTED**: Identify the most significant chart pattern forming (be specific: "Inverse Head & Shoulders on 4H chart")
2. **PATTERN COMPLETION**: How close to completion? (e.g., "Right shoulder forming, 78% complete")
3. **BREAKOUT LEVEL**: Exact price where pattern confirms
4. **PROFIT TARGET**: Calculate using pattern measurement rules (e.g., "Pattern height projects to $X")
5. **ENTRY STRATEGY**: Aggressive entry point with reasoning
6. **STOP LOSS**: Tight invalidation level
7. **RISK/REWARD RATIO**: Must be minimum 3:1 for aggressive plays
8. **VOLUME CONFIRMATION**: Is volume supporting the pattern?
9. **SMART MONEY SIGNALS**: Any whale accumulation/distribution detected?
10. **CONFIDENCE SCORE**: 0-100% based on pattern reliability

Format: Be bold. Be specific. Focus on MASSIVE profit potential.`
      : `Quick pattern scan for ${symbol}:
Pattern type, direction, confidence %, and projected move size.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content;

    console.log("AI analysis completed for:", symbol);

    return new Response(JSON.stringify({ analysis, symbol, market }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-trade-analysis:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

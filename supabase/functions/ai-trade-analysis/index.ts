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

    const systemPrompt = `You are an aggressive AI trading analyst for TradeFlow, a revolutionary trading platform. 
You analyze market conditions and provide bold, actionable trading insights.
Your personality: Confident, data-driven, and focused on maximum profit potential.
Always be specific with price targets, entry/exit points, and risk levels.
Format responses in a clear, punchy style. Use percentages and specific numbers.
Current market: ${market === 'crypto' ? 'Cryptocurrency' : 'Stock Market'}`;

    const userPrompt = action === 'analyze' 
      ? `Analyze ${symbol} for aggressive trading opportunities. Provide:
1. Current market sentiment (bullish/bearish/neutral with confidence %)
2. Recommended action (BUY/SELL/HOLD)
3. Entry price target
4. Take profit target (aggressive)
5. Stop loss recommendation
6. Risk/reward ratio
7. Key factors driving this analysis
Keep it concise but powerful.`
      : `Generate a quick trading signal for ${symbol}. 
Give me: Direction, confidence level, and one sentence reason.`;

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

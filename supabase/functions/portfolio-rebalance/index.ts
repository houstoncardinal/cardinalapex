import "https://deno.land/x/xhr@0.1.0/mod.ts";
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

    const { holdings, totalValue, riskTolerance } = await req.json();

    console.log("Analyzing portfolio for rebalancing:", { holdings, totalValue, riskTolerance });

    const systemPrompt = `You are an elite crypto portfolio manager specializing in Solana ecosystem tokens and meme coins.
Your job is to analyze portfolios and provide aggressive growth-focused rebalancing suggestions.

Risk tolerance: ${riskTolerance || 'aggressive'}

Target allocations for aggressive Solana portfolio:
- SOL: 30-50% (base layer exposure)
- Top meme coins (BONK, WIF, PEPE): 10-20% each
- Emerging meme coins (POPCAT, MEW, BOME): 5-10% each
- Keep some SOL for gas and opportunities

Key principles:
1. Diversification within meme coin exposure
2. Always maintain SOL for gas and stability
3. Rotate into trending tokens with momentum
4. Cut losers quickly, let winners run

Respond with a JSON object containing:
{
  "suggestions": [
    {
      "symbol": "TOKEN",
      "currentAllocation": number,
      "targetAllocation": number,
      "action": "buy" | "sell" | "hold",
      "amount": number (USD value),
      "reason": "Brief explanation",
      "priority": "high" | "medium" | "low"
    }
  ],
  "overallScore": number (0-100, portfolio health),
  "riskAssessment": "Brief risk assessment",
  "summary": "1-2 sentence summary of recommendations"
}`;

    const userPrompt = `Analyze this Solana portfolio and provide rebalancing suggestions:

Total Portfolio Value: $${totalValue?.toFixed(2) || 0}

Current Holdings:
${holdings?.map((h: any) => `- ${h.symbol}: $${h.usdValue?.toFixed(2)} (${h.allocation?.toFixed(1)}%)`).join('\n') || 'No holdings'}

Provide specific, actionable rebalancing suggestions to optimize for aggressive growth.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
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
        console.error("Rate limit exceeded");
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("AI response:", content);

    // Extract JSON from response
    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      // Return a default response
      result = {
        suggestions: [],
        overallScore: 75,
        riskAssessment: "Unable to fully analyze. Consider diversifying.",
        summary: "Portfolio analysis complete. Review your allocations."
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in portfolio-rebalance:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

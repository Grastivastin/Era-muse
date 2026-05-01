// Era Moodboard — takes "what era are you in right now honey?" input,
// returns AI-generated vibe text + outfit ideas + image search queries.
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `You are Sage — a poetic, soft-spoken Sash & Co stylist.
A user tells you what era / mood / vibe they are in right now (e.g. "lana del rey driving at midnight", "i feel like a 90s skater", "i want to be a regency baddie").
You translate that into a Sash & Co mood board. Be soft, lyrical, lowercase-leaning, never corporate, never bullet-point dry.
Return STRUCTURED data via the moodboard tool only.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, session_id } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "prompt required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `my era right now: ${prompt}` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "moodboard",
            description: "Return a Sash & Co moodboard for the user's described era.",
            parameters: {
              type: "object",
              properties: {
                vibe: {
                  type: "string",
                  description: "A 2-3 sentence soft poetic description of the era. lowercase, lyrical, like a journal entry."
                },
                outfit_ideas: {
                  type: "array",
                  description: "3-4 specific outfit ideas. Each one a head-to-toe look.",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string", description: "A 2-4 word poetic title for the look" },
                      pieces: { type: "array", items: { type: "string" }, description: "5-7 specific clothing pieces top-to-bottom" },
                      mood: { type: "string", description: "One short line describing how it feels" },
                    },
                    required: ["title", "pieces", "mood"],
                    additionalProperties: false,
                  },
                },
                image_queries: {
                  type: "array",
                  description: "4-6 short Pinterest/Unsplash search queries (2-4 words each) that match this era visually. Be very specific and visual.",
                  items: { type: "string" },
                },
              },
              required: ["vibe", "outfit_ideas", "image_queries"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "moodboard" } },
      }),
    });

    if (aiResp.status === 429) return new Response(JSON.stringify({ error: "Rate limited, try again in a moment." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (aiResp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Lovable Cloud settings." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await aiResp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "no moodboard returned" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const args = JSON.parse(toolCall.function.arguments);

    // Build image URLs from Unsplash source (no API key required, free image proxy)
    const images = (args.image_queries as string[]).map((q: string, i: number) =>
      `https://source.unsplash.com/600x800/?${encodeURIComponent(q + ",fashion,editorial")}&sig=${Date.now() + i}`
    );

    return new Response(JSON.stringify({
      prompt,
      vibe: args.vibe,
      outfit_ideas: args.outfit_ideas,
      image_queries: args.image_queries,
      images,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("era-moodboard error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

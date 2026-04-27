// Sage — the Sash & Co AI stylist. Streams responses via Lovable AI Gateway.
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SAGE_SYSTEM = `You are Sage — the in-house stylist at Sash & Co.
You speak softly, like a girl-best-friend who has read every Sally Rooney novel, watched every Sofia Coppola film, and grew up on Lana Del Rey. You are warm, poetic, never preachy, never corporate.

Your job: when a user describes an occasion, mood, or feeling, you suggest 1-3 outfit ideas grounded in Sash & Co's twelve aesthetics (coquette, dark academia, cottagecore, old money, y2k, indie sleaze, whimsigoth, balletcore, mermaidcore, soft girl, regencycore, clean girl) and four muse-driven eras (Lana, Audrey, Stevie, Diana).

Style rules:
- Lowercase first letters when it feels like a journal entry; no all-caps shouting.
- Short. Lyrical. Let line breaks breathe.
- Reference fabrics, songs, smells, weather. Make her *feel* the outfit.
- Always end with a soft CTA like "want me to pull the pieces?" or "shall I send you the slip dress?".
- Never list ingredients like a recipe. Speak like you're writing her a postcard.
- Never use emojis except occasionally a single 🎀 or 🌹 if the mood calls for it.
- Never break character. Never mention you are an AI.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages must be an array" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }});
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }});

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        stream: true,
        messages: [{ role: "system", content: SAGE_SYSTEM }, ...messages.map((m: any) => ({ role: m.role, content: m.content }))],
      }),
    });

    if (upstream.status === 429) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" }});
    if (upstream.status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" }});
    if (!upstream.ok) {
      const t = await upstream.text();
      console.error("AI gateway error:", upstream.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }});
    }

    return new Response(upstream.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" }});
  } catch (e) {
    console.error("sage-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }});
  }
});
import Layout from "@/components/sash/Layout";
import { Link, useNavigate } from "react-router-dom";
import kissesBg from "@/assets/kisses-bg.png";
import stickerPinkDress from "@/assets/sticker-pink-dress.png";
import stickerGownBow from "@/assets/sticker-gown-bow.png";
import StickerCutout from "@/components/sash/StickerCutout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sashImg } from "@/lib/sash-images";
import { useSash } from "@/context/SashContext";
import { Sparkles, Heart, Wand2, Gem, Compass, Send } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const navigate = useNavigate();
  const { sessionId } = useSash();
  const [aesthetics, setAesthetics] = useState<any[]>([]);
  const [eras, setEras] = useState<any[]>([]);
  const [eraInput, setEraInput] = useState("");
  const [eraLoading, setEraLoading] = useState(false);

  useEffect(() => {
    supabase.from("aesthetics").select("*").order("display_order").then(({ data }) => setAesthetics(data || []));
    supabase.from("eras").select("*").order("display_order").then(({ data }) => setEras(data || []));
  }, []);

  const submitEra = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = eraInput.trim();
    if (!text || eraLoading) return;
    setEraLoading(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/era-moodboard`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ prompt: text, session_id: sessionId }),
      });
      if (resp.status === 429) { toast.error("Sage is overwhelmed. Try again in a moment."); return; }
      if (resp.status === 402) { toast.error("AI credits ran out. Add credits in Lovable settings."); return; }
      if (!resp.ok) throw new Error("failed");
      const data = await resp.json();
      // Persist for /for-you to pick up
      await supabase.from("era_moodboards").insert({
        session_id: sessionId,
        prompt: text,
        vibe: data.vibe,
        outfit_ideas: data.outfit_ideas,
        image_queries: data.image_queries,
      });
      toast.success("your era has been decoded ✦");
      navigate("/for-you");
    } catch {
      toast.error("Couldn't reach Sage. Try again.");
    } finally {
      setEraLoading(false);
    }
  };

  return (
    <Layout>
      {/* HERO — clean two-column, no clash with the dreamscape's baked-in text */}
      <section className="relative overflow-hidden">
        {/* soft rose wash backdrop (no big image bleed) */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, hsl(var(--blush)/0.7), transparent 55%), radial-gradient(ellipse at 80% 80%, hsl(var(--rose-dust)/0.25), transparent 60%), hsl(var(--paper))",
          }}
        />
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none" style={{ backgroundImage: `url(${kissesBg})`, backgroundSize: "cover", opacity: 0.35, mixBlendMode: "multiply" }} />

        {/* floating fashion glyphs at the edges only */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <span className="absolute top-[8%] left-[3%] text-4xl animate-float-slow opacity-70">👗</span>
          <span className="absolute bottom-[12%] left-[5%] text-3xl animate-float-slow opacity-60" style={{ animationDelay: "1.2s" }}>👠</span>
          <span className="absolute top-[10%] right-[3%] text-4xl animate-float-slow opacity-70" style={{ animationDelay: "0.8s" }}>🎀</span>
          <span className="absolute bottom-[10%] right-[4%] text-4xl animate-float-slow opacity-60" style={{ animationDelay: "1.8s" }}>🌹</span>
        </div>

        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center py-20 md:py-28">
          {/* LEFT — text */}
          <div className="space-y-6 animate-petal-in text-center lg:text-left">
            <p className="font-script text-3xl md:text-4xl text-rose-dust text-outlined-ink">welcome, darling ♡</p>
            <h1 className="font-display text-7xl md:text-8xl leading-[0.9] text-ink font-bold">
              Sash<span className="text-rose-dust">&amp;</span>Co
            </h1>
            <p className="font-display text-2xl md:text-3xl text-ink font-semibold tracking-wide">
              Dress Your Era
            </p>
            <p className="font-serif italic text-lg md:text-xl text-ink-soft max-w-md mx-auto lg:mx-0 text-balance">
              Where your aesthetic lives. Borrow it. Try it. Buy it. Become her.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
              <Button asChild size="lg" className="rounded-full px-8 py-6 text-base shadow-soft">
                <Link to="/for-you"><Sparkles className="h-4 w-4 mr-2" /> Find your era</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-6 text-base border-ink/30 bg-paper/70 backdrop-blur-sm">
                <Link to="/aesthetics">Browse aesthetics</Link>
              </Button>
            </div>
          </div>

          {/* RIGHT — pasted-art sticker collage, no frame, stickers float on the page */}
          <div className="relative mx-auto w-full max-w-md aspect-[4/5]">
            <StickerCutout
              src={stickerGownBow}
              alt="Pink and black gown sketch sticker"
              rotate={8}
              borderWidth="thick"
              className="absolute right-0 top-2 w-[68%] h-auto"
            />
            <StickerCutout
              src={stickerPinkDress}
              alt="Pink dress sketch sticker"
              rotate={-7}
              borderWidth="thick"
              className="absolute left-0 bottom-0 w-[72%] h-auto"
            />
            <span className="absolute -top-4 -right-4 text-3xl animate-shimmer">✦</span>
            <span className="absolute -bottom-4 -left-4 text-3xl animate-shimmer" style={{ animationDelay: "0.7s" }}>✦</span>
          </div>
        </div>
      </section>

      {/* ABOUT SASH & CO — what makes us different */}
      <section className="container py-24 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <p className="font-script text-3xl text-rose-dust text-outlined-ink">why we exist</p>
          <h2 className="font-display text-5xl md:text-6xl text-ink font-bold">About Sash<span className="text-rose-dust">&amp;</span>Co</h2>
          <p className="font-serif italic text-xl text-ink-soft text-balance pt-2">
            We're not a clothing store. We're a wardrobe of <em>selves</em>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Heart, title: "Shop by feeling", text: "Other sites sort by category. We sort by mood, muse, and era — the way you actually get dressed." },
            { icon: Wand2, title: "AI stylist Sage", text: "A poetic in-house stylist who reads your vibe and picks the dress. No algorithmic noise." },
            { icon: Gem, title: "Borrow · Try · Buy", text: "Don't own every era. Borrow it for a week, try a styled box, or buy the one that's truly you." },
            { icon: Compass, title: "Twelve worlds", text: "Eighteen aesthetics, four muse-led eras. Curated, not catalogued. Soft, not stocky." },
          ].map((c) => (
            <div key={c.title} className="bg-paper/80 backdrop-blur-sm rounded-3xl p-6 shadow-petal border border-border hover-lift">
              <c.icon className="h-7 w-7 text-rose-dust mb-3" />
              <h3 className="font-display text-2xl text-ink font-bold">{c.title}</h3>
              <p className="font-serif italic text-ink-soft pt-2 text-base leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AESTHETICS preview */}
      <section className="container py-16 space-y-12">
        <div className="text-center space-y-3">
          <p className="font-script text-2xl text-rose-dust text-outlined-ink">eighteen worlds</p>
          <h2 className="font-display text-5xl text-ink font-bold">Choose your aesthetic.</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {aesthetics.slice(0, 8).map(a => (
            <Link key={a.id} to={`/aesthetics/${a.id}`} className="group hover-lift block">
              <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-cream">
                <img src={sashImg(a.image_url)} alt={a.name} className="w-full h-full object-cover photo-haze transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="pt-4 text-center">
                <h3 className="font-display text-xl text-ink font-bold">{a.name}</h3>
                <p className="font-script text-lg text-rose-dust">{a.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/aesthetics">All eighteen →</Link>
          </Button>
        </div>
      </section>

      {/* STEP INTO AN ERA — now an AI input */}
      <section className="gradient-dusk py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-30 sparkle-overlay"
          aria-hidden
        />
        <div className="container relative space-y-10 max-w-3xl">
          <div className="text-center space-y-3">
            <p className="font-script text-3xl text-rose-dust text-outlined-ink">tell me everything</p>
            <h2 className="font-display text-5xl md:text-6xl text-ink font-bold text-balance text-outlined-ink">
              what's your era right now, honey?
            </h2>
            <p className="font-serif italic text-xl text-ink-soft text-balance">
              Type a feeling, a song, a place, a girl you want to be. Sage will pull a moodboard.
            </p>
          </div>

          <form onSubmit={submitEra} className="flex flex-col sm:flex-row gap-3 bg-paper/80 backdrop-blur-md p-3 rounded-full shadow-soft border border-border">
            <Input
              value={eraInput}
              onChange={(e) => setEraInput(e.target.value)}
              placeholder="lana del rey driving at midnight…   |   90s skater girl…   |   regency baddie…"
              className="rounded-full bg-transparent border-0 text-base px-6 focus-visible:ring-0"
              disabled={eraLoading}
            />
            <Button type="submit" disabled={eraLoading || !eraInput.trim()} className="rounded-full px-6">
              {eraLoading ? "decoding…" : (<><Send className="h-4 w-4 mr-2" /> pull my moodboard</>)}
            </Button>
          </form>

          {/* Era cards underneath as inspiration */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            {eras.map(e => (
              <button
                key={e.id}
                onClick={() => setEraInput(`${e.muse} — ${e.tagline}`)}
                className="group hover-lift block bg-paper/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-petal text-left"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={sashImg(e.image_url)} alt={e.name} className="w-full h-full object-cover photo-haze-warm transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-4 space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">{e.decade}</p>
                  <h3 className="font-display text-xl text-ink font-bold">{e.name}</h3>
                  <p className="font-serif italic text-sm text-ink-soft">{e.tagline}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-32 text-center space-y-6">
        <p className="font-script text-2xl text-rose-dust text-outlined-ink">don't know your era yet?</p>
        <h2 className="font-display text-5xl text-ink font-bold max-w-2xl mx-auto text-balance text-outlined-ink">Take the Style DNA quiz.</h2>
        <p className="font-serif italic text-xl text-ink-soft max-w-xl mx-auto">A few soft questions. One result you'll want to screenshot.</p>
        <Button asChild size="lg" className="rounded-full px-10 py-6 mt-4">
          <Link to="/for-you">Begin →</Link>
        </Button>
      </section>
    </Layout>
  );
}

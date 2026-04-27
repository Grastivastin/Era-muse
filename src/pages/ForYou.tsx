import Layout from "@/components/sash/Layout";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSash } from "@/context/SashContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { Download, Link2, Sparkles, Send, RefreshCcw } from "lucide-react";
import StyleDnaCard from "@/components/sash/StyleDnaCard";
import { sashImg } from "@/lib/sash-images";

const QUIZ = [
  { q: "It's a Sunday morning. You're…", opts: [
    { label: "in a cream cardigan with a pot of tea and a thick novel", aes: "darkacademia", muse: "audrey" },
    { label: "barefoot in a meadow, picking wildflowers", aes: "cottagecore", muse: "stevie" },
    { label: "still in last night's slip dress, drinking coffee on the fire escape", aes: "coquette", muse: "lana" },
    { label: "freshly showered, slick bun, white tank, doing nothing perfectly", aes: "cleangirl", muse: "diana" },
  ]},
  { q: "Your dream Saturday night sound is…", opts: [
    { label: "Lana Del Rey, candles lit, alone on purpose", aes: "coquette", muse: "lana" },
    { label: "Fleetwood Mac, twirling, a little too much wine", aes: "whimsigoth", muse: "stevie" },
    { label: "Frank Sinatra, a martini, the lights low", aes: "oldmoney", muse: "audrey" },
    { label: "The Strokes, a sticky bar floor, bad decisions", aes: "indiesleaze", muse: "diana" },
  ]},
  { q: "Pick a fabric to live inside…", opts: [
    { label: "silk", aes: "coquette", muse: "lana" },
    { label: "tweed", aes: "darkacademia", muse: "audrey" },
    { label: "lace", aes: "regency", muse: "stevie" },
    { label: "cashmere", aes: "oldmoney", muse: "diana" },
  ]},
  { q: "Your signature accessory is…", opts: [
    { label: "a single strand of pearls", aes: "oldmoney", muse: "audrey" },
    { label: "a satin ribbon in your hair", aes: "coquette", muse: "lana" },
    { label: "a moon pendant on a long chain", aes: "whimsigoth", muse: "stevie" },
    { label: "gold hoops, nothing else", aes: "cleangirl", muse: "diana" },
  ]},
];

const POEMS: Record<string, string> = {
  lana: "you write your own myth in the bathroom mirror.\nthe roses know.\nthe silk knows.\nso does she.",
  audrey: "less, chosen perfectly.\na clean line. a quiet laugh.\nthe room turns toward you anyway.",
  stevie: "you twirl in lace at golden hour\nand the sky learns your name.\nthe moon already knew.",
  diana: "you are done shrinking.\nthe blazer is borrowed from no one.\nthe world is watching. for once that is the point.",
};

export default function ForYou() {
  const { sessionId, selectedEra } = useSash();
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<{ aes: string; muse: string }[]>([]);
  const [result, setResult] = useState<any>(null);
  const [moodboards, setMoodboards] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [eraInput, setEraInput] = useState("");
  const [eraLoading, setEraLoading] = useState(false);

  // Load existing personalization
  useEffect(() => {
    supabase.from("style_dna").select("*").eq("session_id", sessionId).maybeSingle()
      .then(({ data }) => { if (data) setResult(data); });
    supabase.from("era_moodboards").select("*").eq("session_id", sessionId).order("created_at", { ascending: false }).limit(3)
      .then(({ data }) => setMoodboards(data || []));
  }, [sessionId]);

  // Recommended products based on selected era / DNA
  useEffect(() => {
    const era = selectedEra || result?.era || result?.muse;
    if (!era) return;
    supabase.from("products").select("*").eq("era_id", era).limit(8)
      .then(({ data }) => {
        if (data && data.length) setRecommended(data);
        else supabase.from("products").select("*").limit(8).then(({ data: d2 }) => setRecommended(d2 || []));
      });
  }, [selectedEra, result]);

  const begin = () => { setStep(0); setAnswers([]); setResult(null); };

  const choose = async (opt: { aes: string; muse: string }) => {
    const next = [...answers, opt];
    setAnswers(next);
    if (step < QUIZ.length - 1) {
      setStep(step + 1);
    } else {
      const aesTally: Record<string, number> = {};
      const museTally: Record<string, number> = {};
      next.forEach(a => { aesTally[a.aes] = (aesTally[a.aes] || 0) + 1; museTally[a.muse] = (museTally[a.muse] || 0) + 1; });
      const sortedAes = Object.entries(aesTally).sort((a,b) => b[1]-a[1]);
      const muse = Object.entries(museTally).sort((a,b)=> b[1]-a[1])[0][0];
      const dna = {
        session_id: sessionId,
        primary_aesthetic: sortedAes[0][0],
        secondary_aesthetic: sortedAes[1]?.[0] ?? null,
        muse,
        era: muse,
        signature_pieces: ["silk slip", "pearl headband", "tweed blazer"],
        poem: POEMS[muse] ?? POEMS.lana,
        answers: next as any,
      };
      await supabase.from("style_dna").upsert(dna, { onConflict: "session_id" });
      await supabase.from("sessions").update({ selected_era: muse }).eq("id", sessionId);
      setResult(dna);
      setStep(-1);
    }
  };

  const submitEra = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = eraInput.trim();
    if (!text || eraLoading) return;
    setEraLoading(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/era-moodboard`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ prompt: text, session_id: sessionId }),
      });
      if (resp.status === 429) { toast.error("Sage is overwhelmed. Try again."); return; }
      if (resp.status === 402) { toast.error("AI credits ran out."); return; }
      if (!resp.ok) throw new Error("failed");
      const data = await resp.json();
      const { data: inserted } = await supabase.from("era_moodboards").insert({
        session_id: sessionId, prompt: text, vibe: data.vibe,
        outfit_ideas: data.outfit_ideas, image_queries: data.image_queries,
      }).select().single();
      const board = inserted ? { ...inserted, images: data.images } : { ...data, prompt: text };
      setMoodboards(m => [board, ...m].slice(0, 3));
      setEraInput("");
      toast.success("your moodboard is ready ✦");
    } catch {
      toast.error("Couldn't reach Sage. Try again.");
    } finally {
      setEraLoading(false);
    }
  };

  // QUIZ flow
  if (step >= 0) {
    const cur = QUIZ[step];
    return (
      <Layout>
        <section className="container py-24 max-w-2xl space-y-10 animate-petal-in">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-soft text-center">question {step + 1} of {QUIZ.length}</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink text-center text-balance font-bold">{cur.q}</h2>
          <div className="space-y-3">
            {cur.opts.map((o, i) => (
              <button key={i} onClick={() => choose(o)} className="w-full text-left p-6 rounded-2xl bg-paper/80 hover:bg-blush border border-border transition-colors font-serif text-lg text-ink">
                {o.label}
              </button>
            ))}
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container py-12 md:py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <p className="font-script text-3xl text-rose-dust">curated, just for you</p>
          <h1 className="font-display text-5xl md:text-6xl text-ink font-bold">For You.</h1>
          <p className="font-serif italic text-xl text-ink-soft text-balance">
            Everything below is shaped by your era, your DNA, and the moods you've whispered to Sage.
          </p>
        </div>

        {/* Era input */}
        <div className="max-w-3xl mx-auto bg-paper/85 backdrop-blur-md rounded-3xl p-6 shadow-petal border border-border space-y-3">
          <p className="font-script text-2xl text-rose-dust text-center">what's your era right now, honey?</p>
          <form onSubmit={submitEra} className="flex flex-col sm:flex-row gap-2">
            <Input
              value={eraInput}
              onChange={(e) => setEraInput(e.target.value)}
              placeholder="i feel like a 90s skater girl…   |   regency baddie at a museum…"
              className="rounded-full bg-cream"
              disabled={eraLoading}
            />
            <Button type="submit" disabled={eraLoading || !eraInput.trim()} className="rounded-full px-6">
              {eraLoading ? "decoding…" : (<><Send className="h-4 w-4 mr-2" /> moodboard</>)}
            </Button>
          </form>
        </div>

        {/* Recent moodboards */}
        {moodboards.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-display text-3xl text-ink font-bold text-center">Your recent eras</h2>
            <div className="space-y-8">
              {moodboards.map((mb) => (
                <article key={mb.id || mb.prompt} className="bg-paper/85 backdrop-blur-md rounded-3xl p-6 shadow-petal border border-border space-y-4">
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <p className="font-script text-2xl text-rose-dust">"{mb.prompt}"</p>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">decoded by Sage</p>
                  </div>
                  {mb.vibe && <p className="font-serif italic text-lg text-ink leading-relaxed">{mb.vibe}</p>}

                  {/* image grid */}
                  {(mb.images || mb.image_queries) && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {((mb.images as string[]) || (mb.image_queries as string[]).map((q: string, i: number) =>
                        `https://source.unsplash.com/600x800/?${encodeURIComponent(q + ",fashion,editorial")}&sig=${i}`
                      )).slice(0, 4).map((src: string, i: number) => (
                        <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden bg-cream">
                          <img src={src} alt="" loading="lazy" className="w-full h-full object-cover photo-haze" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* outfit ideas */}
                  {mb.outfit_ideas && Array.isArray(mb.outfit_ideas) && mb.outfit_ideas.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-3 pt-2">
                      {mb.outfit_ideas.map((o: any, i: number) => (
                        <div key={i} className="p-4 rounded-2xl bg-blush/40 border border-border">
                          <p className="font-display text-xl text-ink font-bold">{o.title}</p>
                          <p className="font-serif italic text-sm text-ink-soft pb-2">{o.mood}</p>
                          <ul className="text-sm font-serif text-ink space-y-1">
                            {o.pieces?.map((p: string, j: number) => (
                              <li key={j} className="before:content-['✦'] before:text-rose-dust before:mr-2">{p}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Style DNA Result OR Quiz CTA */}
        {result ? (
          <ResultView result={result} sessionId={sessionId} onRetake={begin} />
        ) : (
          <div className="text-center space-y-4 py-8 max-w-2xl mx-auto">
            <p className="font-script text-2xl text-rose-dust">a soft little quiz</p>
            <h2 className="font-display text-4xl text-ink font-bold">Find your Style DNA.</h2>
            <p className="font-serif italic text-lg text-ink-soft">Four questions. One muse. A wardrobe that finally feels like you.</p>
            <Button size="lg" onClick={begin} className="rounded-full px-10 py-6 mt-2">Begin →</Button>
          </div>
        )}

        {/* Recommended products */}
        {recommended.length > 0 && (
          <div className="space-y-6 pt-8">
            <h2 className="font-display text-3xl text-ink font-bold text-center">
              Especially curated for you
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recommended.map(p => (
                <Link key={p.id} to={`/products/${p.id}`} className="group hover-lift block">
                  <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-cream">
                    <img src={sashImg(p.image_url)} alt={p.name} className="w-full h-full object-cover photo-haze transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="pt-3 text-center">
                    <h3 className="font-serif text-base text-ink">{p.name}</h3>
                    <p className="text-xs text-ink-soft">borrow ${p.borrow_price} · buy ${p.buy_price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}

function ResultView({ result, sessionId, onRetake }: { result: any; sessionId: string; onRetake: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const downloadPng = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true, backgroundColor: undefined });
      const link = document.createElement("a");
      link.download = `sash-style-dna-${result.muse}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Saved to your downloads, darling.");
    } catch {
      toast.error("Couldn't capture the card. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/dna/${sessionId}`;
    try { await navigator.clipboard.writeText(url); toast.success("Link copied — share your era."); }
    catch { toast.error("Couldn't copy. Long-press the URL instead."); }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pt-4">
      <div className="text-center space-y-1">
        <p className="font-script text-3xl text-rose-dust">she's been decoded</p>
        <h2 className="font-display text-4xl text-ink font-bold">Your Style DNA</h2>
      </div>

      <div ref={cardRef}>
        <StyleDnaCard result={result} />
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Button onClick={downloadPng} disabled={busy} className="rounded-full">
          <Download className="h-4 w-4 mr-2" /> {busy ? "capturing…" : "Download PNG"}
        </Button>
        <Button variant="outline" onClick={copyLink} className="rounded-full">
          <Link2 className="h-4 w-4 mr-2" /> Copy share link
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/aesthetics"><Sparkles className="h-4 w-4 mr-2" /> Shop your world</Link>
        </Button>
        <Button variant="ghost" onClick={onRetake} className="rounded-full">
          <RefreshCcw className="h-4 w-4 mr-2" /> Retake
        </Button>
      </div>
    </div>
  );
}

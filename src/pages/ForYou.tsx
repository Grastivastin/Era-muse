import Layout from "@/components/sash/Layout";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSash } from "@/context/SashContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { Download, Link2, Sparkles } from "lucide-react";
import StyleDnaCard from "@/components/sash/StyleDnaCard";

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
  const { sessionId } = useSash();
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<{ aes: string; muse: string }[]>([]);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    supabase.from("style_dna").select("*").eq("session_id", sessionId).maybeSingle()
      .then(({ data }) => { if (data) setResult(data); });
  }, [sessionId]);

  const begin = () => { setStep(0); setAnswers([]); setResult(null); };

  const choose = async (opt: { aes: string; muse: string }) => {
    const next = [...answers, opt];
    setAnswers(next);
    if (step < QUIZ.length - 1) {
      setStep(step + 1);
    } else {
      // tally
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

  if (result) {
    return <ResultView result={result} sessionId={sessionId} onRetake={begin} />;
  }

  if (step === -1) {
    return (
      <Layout>
        <section className="container py-32 text-center max-w-2xl space-y-6">
          <p className="font-script text-2xl text-rose-dust">a soft little quiz</p>
          <h1 className="font-display text-6xl text-ink">Find your Style DNA.</h1>
          <p className="font-serif italic text-xl text-ink-soft">Four questions. One muse. A wardrobe that finally feels like you.</p>
          <Button size="lg" onClick={begin} className="rounded-full px-10 py-6 mt-4">Begin →</Button>
        </section>
      </Layout>
    );
  }

  const cur = QUIZ[step];
  return (
    <Layout>
      <section className="container py-24 max-w-2xl space-y-10 animate-petal-in">
        <p className="text-xs uppercase tracking-[0.3em] text-ink-soft text-center">question {step + 1} of {QUIZ.length}</p>
        <h2 className="font-display text-4xl md:text-5xl text-ink text-center text-balance">{cur.q}</h2>
        <div className="space-y-3">
          {cur.opts.map((o, i) => (
            <button key={i} onClick={() => choose(o)} className="w-full text-left p-6 rounded-2xl bg-cream hover:bg-blush border border-border transition-colors font-serif text-lg text-ink">
              {o.label}
            </button>
          ))}
        </div>
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
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: "transparent",
      });
      const link = document.createElement("a");
      link.download = `sash-style-dna-${result.muse}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Saved to your downloads, darling.");
    } catch (e) {
      toast.error("Couldn't capture the card. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/dna/${sessionId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied — share your era.");
    } catch {
      toast.error("Couldn't copy. Long-press the URL instead.");
    }
  };

  return (
    <Layout>
      <section className="container py-12 max-w-xl space-y-6">
        <div className="text-center space-y-1">
          <p className="font-script text-3xl text-rose-dust">she's been decoded</p>
          <h1 className="font-display text-4xl text-ink">Your Style DNA</h1>
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
          <Button variant="ghost" onClick={onRetake} className="rounded-full">Retake</Button>
        </div>
      </section>
    </Layout>
  );
}
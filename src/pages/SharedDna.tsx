import Layout from "@/components/sash/Layout";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import StyleDnaCard from "@/components/sash/StyleDnaCard";
import { Button } from "@/components/ui/button";

export default function SharedDna() {
  const { sessionId } = useParams();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    supabase
      .from("style_dna")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle()
      .then(({ data }) => {
        setResult(data);
        setLoading(false);
      });
  }, [sessionId]);

  return (
    <Layout>
      <section className="container py-12 max-w-xl space-y-6">
        <div className="text-center space-y-1">
          <p className="font-script text-3xl text-rose-dust">a friend shared their era</p>
          <h1 className="font-display text-4xl text-ink">Style DNA</h1>
        </div>

        {loading && (
          <p className="font-serif italic text-ink-soft text-center py-20">unfolding the love letter…</p>
        )}

        {!loading && !result && (
          <div className="text-center py-16 space-y-4">
            <p className="font-serif italic text-ink-soft">this era hasn't been decoded yet.</p>
            <Button asChild className="rounded-full"><Link to="/for-you">Find your own →</Link></Button>
          </div>
        )}

        {result && (
          <>
            <StyleDnaCard result={result} />
            <div className="flex justify-center gap-3 pt-2">
              <Button asChild className="rounded-full"><Link to="/for-you">Take the quiz</Link></Button>
              <Button asChild variant="outline" className="rounded-full"><Link to="/aesthetics">Browse aesthetics</Link></Button>
            </div>
          </>
        )}
      </section>
    </Layout>
  );
}
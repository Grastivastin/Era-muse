import Layout from "@/components/sash/Layout";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sashImg } from "@/lib/sash-images";

export default function AestheticDetail() {
  const { id } = useParams();
  const [a, setA] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    supabase.from("aesthetics").select("*").eq("id", id).maybeSingle().then(({ data }) => setA(data));
    supabase.from("products").select("*").eq("aesthetic_id", id).then(({ data }) => setProducts(data || []));
  }, [id]);

  if (!a) return <Layout><div className="container py-32 text-center font-serif italic text-ink-soft">loading…</div></Layout>;

  return (
    <Layout>
      <section className="relative h-[70vh] overflow-hidden">
        <img src={sashImg(a.image_url)} alt={a.name} className="absolute inset-0 w-full h-full object-cover photo-haze" />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/40 to-transparent" />
        <div className="container relative h-full flex flex-col justify-end pb-12 space-y-3">
          <p className="font-script text-2xl text-rose-dust">{a.tagline}</p>
          <h1 className="font-display text-7xl text-ink">{a.name}</h1>
          <p className="font-serif italic text-2xl text-ink-soft max-w-2xl text-balance">{a.description}</p>
          <div className="flex gap-2 pt-2">
            {(a.mood_words ?? []).map((w: string) => (
              <span key={w} className="text-xs uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-paper/70 border border-border text-ink-soft">{w}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="container py-20">
        <h2 className="font-display text-4xl text-ink mb-8">Pieces from this world</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <Link key={p.id} to={`/products/${p.id}`} className="group hover-lift block">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-cream">
                <img src={sashImg(p.image_url)} alt={p.name} className="w-full h-full object-cover photo-haze transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="pt-3">
                <h3 className="font-serif text-lg text-ink">{p.name}</h3>
                <p className="text-sm text-ink-soft">borrow ${p.borrow_price} · buy ${p.buy_price}</p>
              </div>
            </Link>
          ))}
          {products.length === 0 && <p className="font-serif italic text-ink-soft col-span-full">More pieces are being curated for this world.</p>}
        </div>
      </section>
    </Layout>
  );
}
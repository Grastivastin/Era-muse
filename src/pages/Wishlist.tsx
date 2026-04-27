import Layout from "@/components/sash/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSash } from "@/context/SashContext";
import { sashImg } from "@/lib/sash-images";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { sessionId } = useSash();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("wishlist_items").select("id, product:products(*)").eq("session_id", sessionId)
      .then(({ data }) => setItems(data || []));
  }, [sessionId]);

  return (
    <Layout>
      <section className="container py-16 text-center space-y-2">
        <p className="font-script text-2xl text-rose-dust">saved for later</p>
        <h1 className="font-display text-5xl text-ink">Your Wishlist</h1>
      </section>
      <section className="container pb-24">
        {items.length === 0 ? (
          <p className="font-serif italic text-ink-soft text-center">Nothing saved yet. <Link to="/aesthetics" className="story-link">Wander a little.</Link></p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {items.map(({ id, product: p }) => p && (
              <Link key={id} to={`/products/${p.id}`} className="hover-lift block">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-cream"><img src={sashImg(p.image_url)} alt={p.name} className="w-full h-full object-cover photo-haze" /></div>
                <p className="pt-3 font-serif text-lg text-ink">{p.name}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
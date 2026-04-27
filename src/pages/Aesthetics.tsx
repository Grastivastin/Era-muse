import Layout from "@/components/sash/Layout";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sashImg } from "@/lib/sash-images";

export default function Aesthetics() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("aesthetics").select("*").order("display_order").then(({ data }) => setItems(data || []));
  }, []);

  return (
    <Layout>
      <section className="container py-20 text-center space-y-4">
        <p className="font-script text-2xl text-rose-dust">twelve worlds, one wardrobe</p>
        <h1 className="font-display text-6xl text-ink">Aesthetics</h1>
        <p className="font-serif italic text-xl text-ink-soft max-w-xl mx-auto">Pick the world your closet has been whispering about.</p>
      </section>
      <section className="container pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(a => (
          <Link key={a.id} to={`/aesthetics/${a.id}`} className="group hover-lift block">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-cream">
              <img src={sashImg(a.image_url)} alt={a.name} className="w-full h-full object-cover photo-haze transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            </div>
            <div className="pt-4 space-y-1">
              <h2 className="font-display text-2xl text-ink">{a.name}</h2>
              <p className="font-script text-xl text-rose-dust">{a.tagline}</p>
              <p className="font-serif italic text-ink-soft">{a.description}</p>
            </div>
          </Link>
        ))}
      </section>
    </Layout>
  );
}
import Layout from "@/components/sash/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSash } from "@/context/SashContext";
import { sashImg } from "@/lib/sash-images";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Cart() {
  const { sessionId } = useSash();
  const [items, setItems] = useState<any[]>([]);
  const load = () => supabase.from("cart_items").select("id, mode, product:products(*)").eq("session_id", sessionId).then(({ data }) => setItems(data || []));
  useEffect(() => { load(); }, [sessionId]);
  const remove = async (id: string) => { await supabase.from("cart_items").delete().eq("id", id); load(); };

  const total = items.reduce((s, it) => s + (it.product ? (it.mode === "borrow" ? it.product.borrow_price : it.mode === "try" ? it.product.try_price : it.product.buy_price) : 0), 0);

  return (
    <Layout>
      <section className="container py-16 text-center space-y-2">
        <p className="font-script text-2xl text-rose-dust">almost yours</p>
        <h1 className="font-display text-5xl text-ink">Your Cart</h1>
      </section>
      <section className="container pb-24 max-w-3xl">
        {items.length === 0 ? (
          <p className="font-serif italic text-ink-soft text-center">Nothing in here yet. <Link to="/aesthetics" className="story-link">Find something.</Link></p>
        ) : (
          <>
            <div className="space-y-4">
              {items.map(({ id, mode, product: p }) => p && (
                <div key={id} className="flex gap-4 bg-cream/50 rounded-2xl p-4 items-center">
                  <img src={sashImg(p.image_url)} alt={p.name} className="w-24 h-24 object-cover rounded-xl photo-haze" />
                  <div className="flex-1">
                    <p className="font-serif text-xl text-ink">{p.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">{mode}</p>
                  </div>
                  <p className="font-serif text-lg text-ink">${mode === "borrow" ? p.borrow_price : mode === "try" ? p.try_price : p.buy_price}</p>
                  <button onClick={() => remove(id)} className="text-sm text-ink-soft story-link">remove</button>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 rounded-2xl gradient-haze text-center space-y-3">
              <p className="font-display text-3xl text-ink">Total · ${total.toFixed(2)}</p>
              <Button size="lg" className="rounded-full px-10">Checkout (demo)</Button>
            </div>
          </>
        )}
      </section>
    </Layout>
  );
}
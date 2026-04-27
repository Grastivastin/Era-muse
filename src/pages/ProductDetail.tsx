import Layout from "@/components/sash/Layout";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sashImg } from "@/lib/sash-images";
import { Button } from "@/components/ui/button";
import { useSash } from "@/context/SashContext";
import { toast } from "sonner";
import { Heart } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const { sessionId } = useSash();
  const [p, setP] = useState<any>(null);
  const [mode, setMode] = useState<"borrow" | "try" | "buy">("borrow");

  useEffect(() => {
    if (!id) return;
    supabase.from("products").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      setP(data);
      const m = data?.available_modes?.[0];
      if (m === "borrow" || m === "try" || m === "buy") setMode(m);
    });
  }, [id]);

  if (!p) return <Layout><div className="container py-32 text-center font-serif italic text-ink-soft">loading…</div></Layout>;

  const price = mode === "borrow" ? p.borrow_price : mode === "try" ? p.try_price : p.buy_price;

  const addToCart = async () => {
    await supabase.from("cart_items").insert({ session_id: sessionId, product_id: p.id, mode });
    toast.success(`${p.name} added to cart`, { description: `${mode} · $${price}` });
  };
  const addToWishlist = async () => {
    await supabase.from("wishlist_items").insert({ session_id: sessionId, product_id: p.id });
    toast.success(`Saved to your wishlist`);
  };

  return (
    <Layout>
      <section className="container py-12 grid md:grid-cols-2 gap-12">
        <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-cream">
          <img src={sashImg(p.image_url)} alt={p.name} className="w-full h-full object-cover photo-haze" />
        </div>
        <div className="space-y-6">
          <div>
            <p className="font-script text-2xl text-rose-dust capitalize">{p.aesthetic_id}</p>
            <h1 className="font-display text-5xl text-ink">{p.name}</h1>
          </div>
          <p className="font-serif italic text-xl text-ink-soft">{p.description}</p>
          {p.story && <blockquote className="border-l-2 border-rose-dust pl-4 font-serif italic text-ink">"{p.story}"</blockquote>}

          <div className="space-y-3 pt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">choose your way</p>
            <div className="grid grid-cols-3 gap-2">
              {(["borrow","try","buy"] as const).map(m => (
                <button key={m} onClick={() => setMode(m)} className={`p-4 rounded-xl border transition-all ${mode === m ? "border-ink bg-blush" : "border-border bg-paper"}`}>
                  <p className="font-serif text-lg capitalize text-ink">{m}</p>
                  <p className="text-sm text-ink-soft">${m === "borrow" ? p.borrow_price : m === "try" ? p.try_price : p.buy_price}</p>
                </button>
              ))}
            </div>
            <p className="text-sm font-serif italic text-ink-soft">
              {mode === "borrow" && "Wear it for a week. Return it in the prepaid bag. Live the life."}
              {mode === "try" && "Three pieces in a curated box. Keep what you love."}
              {mode === "buy" && "Yours forever. Or until you pass it on."}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button size="lg" onClick={addToCart} className="rounded-full flex-1">{mode === "borrow" ? "Borrow her" : mode === "try" ? "Add to try-on box" : "Make her yours"} — ${price}</Button>
            <Button size="lg" variant="outline" onClick={addToWishlist} className="rounded-full"><Heart className="h-5 w-5" /></Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
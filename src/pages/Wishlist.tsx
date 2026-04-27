import Layout from "@/components/sash/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSash } from "@/context/SashContext";
import { sashImg } from "@/lib/sash-images";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ShoppingBag, Trash2 } from "lucide-react";

type Mode = "borrow" | "try" | "buy";

export default function Wishlist() {
  const { sessionId } = useSash();
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState<Mode>("borrow");
  const [busy, setBusy] = useState(false);

  const load = () =>
    supabase
      .from("wishlist_items")
      .select("id, product:products(*)")
      .eq("session_id", sessionId)
      .then(({ data }) => setItems(data || []));

  useEffect(() => { load(); }, [sessionId]);

  const toggle = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const allSelected = items.length > 0 && selected.size === items.length;
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(items.map(i => i.id)));

  const selectedItems = items.filter(i => selected.has(i.id));

  const moveToCart = async () => {
    if (selectedItems.length === 0) return;
    setBusy(true);
    try {
      const rows = selectedItems
        .filter(i => i.product)
        .map(i => ({
          session_id: sessionId,
          product_id: i.product.id,
          mode: bulkMode,
          quantity: 1,
        }));
      const { error: insErr } = await supabase.from("cart_items").insert(rows);
      if (insErr) throw insErr;
      const ids = selectedItems.map(i => i.id);
      const { error: delErr } = await supabase.from("wishlist_items").delete().in("id", ids);
      if (delErr) throw delErr;
      toast.success(`${rows.length} piece${rows.length > 1 ? "s" : ""} moved to cart · ${bulkMode}`);
      setSelected(new Set());
      await load();
    } catch {
      toast.error("Couldn't move those, darling. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const removeSelected = async () => {
    if (selected.size === 0) return;
    setBusy(true);
    const ids = Array.from(selected);
    const { error } = await supabase.from("wishlist_items").delete().in("id", ids);
    setBusy(false);
    if (error) return toast.error("Couldn't remove those.");
    toast.success(`${ids.length} removed from wishlist`);
    setSelected(new Set());
    load();
  };

  return (
    <Layout>
      <section className="container py-16 text-center space-y-2">
        <p className="font-script text-2xl text-rose-dust">saved for later</p>
        <h1 className="font-display text-5xl text-ink">Your Wishlist</h1>
      </section>
      <section className="container pb-24">
        {items.length === 0 ? (
          <p className="font-serif italic text-ink-soft text-center">
            Nothing saved yet. <Link to="/aesthetics" className="story-link">Wander a little.</Link>
          </p>
        ) : (
          <>
            <div className="sticky top-[73px] z-30 -mx-4 px-4 py-3 mb-6 backdrop-blur-md bg-paper/80 border-y border-border flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                <span className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                  {selected.size > 0 ? `${selected.size} selected` : "select all"}
                </span>
              </label>

              <div className="flex-1" />

              <div className="flex items-center gap-1 bg-cream rounded-full p-1">
                {(["borrow", "try", "buy"] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setBulkMode(m)}
                    className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.2em] transition-colors ${
                      bulkMode === m ? "bg-blush text-ink" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <Button
                size="sm"
                onClick={moveToCart}
                disabled={selected.size === 0 || busy}
                className="rounded-full"
              >
                <ShoppingBag className="h-4 w-4 mr-2" /> Move to cart
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={removeSelected}
                disabled={selected.size === 0 || busy}
                className="rounded-full"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Remove
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {items.map(({ id, product: p }) =>
                p && (
                  <div key={id} className={`relative group rounded-2xl transition-all ${selected.has(id) ? "ring-2 ring-rose-dust ring-offset-4 ring-offset-paper" : ""}`}>
                    <button
                      onClick={() => toggle(id)}
                      className="absolute top-3 left-3 z-10 h-7 w-7 rounded-full bg-paper/90 border border-border flex items-center justify-center backdrop-blur"
                      aria-label={selected.has(id) ? "deselect" : "select"}
                    >
                      <Checkbox checked={selected.has(id)} className="pointer-events-none" />
                    </button>
                    <Link to={`/products/${p.id}`} className="hover-lift block">
                      <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-cream">
                        <img src={sashImg(p.image_url)} alt={p.name} className="w-full h-full object-cover photo-haze" />
                      </div>
                      <p className="pt-3 font-serif text-lg text-ink">{p.name}</p>
                    </Link>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </section>
    </Layout>
  );
}
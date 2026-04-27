import Layout from "@/components/sash/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSash } from "@/context/SashContext";
import { sashImg } from "@/lib/sash-images";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Heart, Trash2, Minus, Plus } from "lucide-react";

type Mode = "borrow" | "try" | "buy";

const priceFor = (p: any, mode: Mode) =>
  Number((mode === "borrow" ? p.borrow_price : mode === "try" ? p.try_price : p.buy_price) ?? 0);

export default function Cart() {
  const { sessionId } = useSash();
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState<Mode>("borrow");
  const [busy, setBusy] = useState(false);

  const load = () =>
    supabase
      .from("cart_items")
      .select("id, mode, quantity, product:products(*)")
      .eq("session_id", sessionId)
      .order("added_at")
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

  const updateQty = async (id: string, qty: number) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => (i.id === id ? { ...i, quantity: qty } : i)));
    await supabase.from("cart_items").update({ quantity: qty }).eq("id", id);
  };

  const updateMode = async (id: string, mode: Mode) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, mode } : i)));
    await supabase.from("cart_items").update({ mode }).eq("id", id);
  };

  const removeOne = async (id: string) => {
    await supabase.from("cart_items").delete().eq("id", id);
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
    load();
  };

  const bulkChangeMode = async () => {
    if (selected.size === 0) return;
    setBusy(true);
    const ids = Array.from(selected);
    const { error } = await supabase.from("cart_items").update({ mode: bulkMode }).in("id", ids);
    setBusy(false);
    if (error) return toast.error("Couldn't update those.");
    toast.success(`${ids.length} updated to ${bulkMode}`);
    load();
  };

  const bulkRemove = async () => {
    if (selected.size === 0) return;
    setBusy(true);
    const ids = Array.from(selected);
    const { error } = await supabase.from("cart_items").delete().in("id", ids);
    setBusy(false);
    if (error) return toast.error("Couldn't remove those.");
    toast.success(`${ids.length} removed from cart`);
    setSelected(new Set());
    load();
  };

  const bulkMoveToWishlist = async () => {
    const chosen = items.filter(i => selected.has(i.id) && i.product);
    if (chosen.length === 0) return;
    setBusy(true);
    try {
      const rows = chosen.map(i => ({ session_id: sessionId, product_id: i.product.id }));
      const { error: insErr } = await supabase.from("wishlist_items").insert(rows);
      if (insErr) throw insErr;
      const { error: delErr } = await supabase.from("cart_items").delete().in("id", chosen.map(i => i.id));
      if (delErr) throw delErr;
      toast.success(`${chosen.length} moved to wishlist`);
      setSelected(new Set());
      await load();
    } catch {
      toast.error("Couldn't move those, darling.");
    } finally {
      setBusy(false);
    }
  };

  const total = items.reduce(
    (s, it) => s + (it.product ? priceFor(it.product, it.mode) * (it.quantity ?? 1) : 0),
    0
  );

  return (
    <Layout>
      <section className="container py-16 text-center space-y-2">
        <p className="font-script text-2xl text-rose-dust">almost yours</p>
        <h1 className="font-display text-5xl text-ink">Your Cart</h1>
      </section>
      <section className="container pb-24 max-w-3xl">
        {items.length === 0 ? (
          <p className="font-serif italic text-ink-soft text-center">
            Nothing in here yet. <Link to="/aesthetics" className="story-link">Find something.</Link>
          </p>
        ) : (
          <>
            <div className="sticky top-[73px] z-30 -mx-4 px-4 py-3 mb-4 backdrop-blur-md bg-paper/80 border-y border-border flex flex-wrap items-center gap-3">
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
                    className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-[0.2em] transition-colors ${
                      bulkMode === m ? "bg-blush text-ink" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <Button size="sm" onClick={bulkChangeMode} disabled={selected.size === 0 || busy} className="rounded-full">
                Apply mode
              </Button>
              <Button size="sm" variant="outline" onClick={bulkMoveToWishlist} disabled={selected.size === 0 || busy} className="rounded-full">
                <Heart className="h-4 w-4 mr-2" /> To wishlist
              </Button>
              <Button size="sm" variant="outline" onClick={bulkRemove} disabled={selected.size === 0 || busy} className="rounded-full">
                <Trash2 className="h-4 w-4 mr-2" /> Remove
              </Button>
            </div>

            <div className="space-y-4">
              {items.map(({ id, mode, quantity, product: p }) =>
                p && (
                  <div
                    key={id}
                    className={`flex gap-4 bg-cream/50 rounded-2xl p-4 items-center transition-all ${
                      selected.has(id) ? "ring-2 ring-rose-dust" : ""
                    }`}
                  >
                    <Checkbox checked={selected.has(id)} onCheckedChange={() => toggle(id)} />
                    <Link to={`/products/${p.id}`}>
                      <img src={sashImg(p.image_url)} alt={p.name} className="w-20 h-20 object-cover rounded-xl photo-haze" />
                    </Link>
                    <div className="flex-1 min-w-0 space-y-1">
                      <Link to={`/products/${p.id}`} className="font-serif text-xl text-ink story-link">{p.name}</Link>
                      <div className="flex items-center gap-1 mt-1">
                        {(["borrow", "try", "buy"] as const).map(m => (
                          <button
                            key={m}
                            onClick={() => updateMode(id, m)}
                            className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full border transition-colors ${
                              mode === m ? "border-ink bg-blush text-ink" : "border-border text-ink-soft hover:text-ink"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 border border-border rounded-full bg-paper">
                      <button
                        onClick={() => updateQty(id, (quantity ?? 1) - 1)}
                        disabled={(quantity ?? 1) <= 1}
                        className="h-8 w-8 flex items-center justify-center text-ink-soft hover:text-ink disabled:opacity-30"
                        aria-label="decrease"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center font-serif text-ink">{quantity ?? 1}</span>
                      <button
                        onClick={() => updateQty(id, (quantity ?? 1) + 1)}
                        className="h-8 w-8 flex items-center justify-center text-ink-soft hover:text-ink"
                        aria-label="increase"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <p className="font-serif text-lg text-ink w-20 text-right">
                      ${(priceFor(p, mode) * (quantity ?? 1)).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeOne(id)}
                      className="text-ink-soft hover:text-ink"
                      aria-label="remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )
              )}
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
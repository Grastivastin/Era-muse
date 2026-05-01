import Layout from "@/components/sash/Layout";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { sashImg } from "@/lib/sash-images";
import { useSash } from "@/context/SashContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Search, X } from "lucide-react";
import { toast } from "sonner";

type Aesthetic = { id: string; name: string; palette: string[] };
type Era = { id: string; name: string; decade?: string; palette: string[] };
type Product = {
  id: string; name: string; image_url: string;
  aesthetic_id: string | null; era_id: string | null;
  category: string; tags: string[];
  borrow_price: number | null; buy_price: number | null; try_price: number | null;
};

// Map palette hex → rough makeup/color family bucket
function colorFamily(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2 / 255;
  if (l > 0.85) return "ivory";
  if (l < 0.18) return "noir";
  if (r > g && r > b && r - b > 40) return "rose";
  if (r > 180 && g > 140 && b < 160) return "blush";
  if (g > r && g > b) return "sage";
  if (b > r && b > g) return "powder";
  if (r > 150 && g > 110 && b < 110) return "honey";
  if (r > 100 && g < 100 && b < 100) return "wine";
  return "mauve";
}

const COLOR_FAMILIES = ["blush", "rose", "ivory", "honey", "sage", "powder", "mauve", "wine", "noir"] as const;
const COLOR_SWATCH: Record<string, string> = {
  blush: "#fde4dc", rose: "#d8a8b1", ivory: "#faf6f0", honey: "#d4b896",
  sage: "#b5c89a", powder: "#a5b4c4", mauve: "#b8a8d0", wine: "#7a3b3b", noir: "#2a2a2a",
};

// Lightweight makeup-style mapping derived from aesthetic
const MAKEUP_BY_AESTHETIC: Record<string, string> = {
  coquette: "soft-glam", balletcore: "soft-glam", softgirl: "soft-glam",
  oldmoney: "clean", cleangirl: "clean", regency: "clean",
  darkacademia: "smoky", whimsigoth: "smoky", gothic: "smoky", grunge: "smoky",
  y2k: "glossy", bubblegum: "glossy", mermaid: "glossy",
  cottagecore: "natural", vintage: "natural",
  indiesleaze: "smudged", baddie: "bold", ethnic: "bold",
};
const MAKEUP_STYLES = ["soft-glam", "clean", "smoky", "glossy", "natural", "smudged", "bold"];

export default function Shop() {
  const { sessionId } = useSash();
  const [params, setParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [aesthetics, setAesthetics] = useState<Aesthetic[]>([]);
  const [eras, setEras] = useState<Era[]>([]);

  const q = params.get("q") ?? "";
  const aesthetic = params.get("aesthetic") ?? "";
  const era = params.get("era") ?? "";
  const category = params.get("category") ?? "";
  const color = params.get("color") ?? "";
  const makeup = params.get("makeup") ?? "";

  const updateParam = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    v ? next.set(k, v) : next.delete(k);
    setParams(next, { replace: true });
  };

  useEffect(() => {
    supabase.from("products").select("*").then(({ data }) => setProducts((data as Product[]) || []));
    supabase.from("aesthetics").select("id,name,palette").order("display_order").then(({ data }) => setAesthetics((data as Aesthetic[]) || []));
    supabase.from("eras").select("id,name,decade,palette").order("display_order").then(({ data }) => setEras((data as Era[]) || []));
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map(p => p.category))).sort(),
    [products]
  );

  const filtered = useMemo(() => {
    const aesById = Object.fromEntries(aesthetics.map(a => [a.id, a]));
    const erById = Object.fromEntries(eras.map(e => [e.id, e]));
    const term = q.trim().toLowerCase();
    return products.filter(p => {
      if (aesthetic && p.aesthetic_id !== aesthetic) return false;
      if (era && p.era_id !== era) return false;
      if (category && p.category !== category) return false;
      if (makeup && (!p.aesthetic_id || MAKEUP_BY_AESTHETIC[p.aesthetic_id] !== makeup)) return false;
      if (color) {
        const palette = [
          ...(aesById[p.aesthetic_id ?? ""]?.palette ?? []),
          ...(erById[p.era_id ?? ""]?.palette ?? []),
        ];
        if (!palette.some(hex => colorFamily(hex) === color)) return false;
      }
      if (term) {
        const hay = [p.name, p.category, p.aesthetic_id, p.era_id, ...(p.tags ?? [])]
          .filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [products, aesthetics, eras, q, aesthetic, era, category, color, makeup]);

  const addToWishlist = async (p: Product) => {
    const { error } = await supabase.from("wishlist_items").insert({ session_id: sessionId, product_id: p.id });
    if (error) return toast.error("Couldn't save, darling.");
    toast.success(`${p.name} saved to wishlist`);
  };
  const addToCart = async (p: Product) => {
    const mode = p.borrow_price ? "borrow" : p.try_price ? "try" : "buy";
    const { error } = await supabase.from("cart_items").insert({ session_id: sessionId, product_id: p.id, mode });
    if (error) return toast.error("Couldn't add to cart.");
    toast.success(`${p.name} added · ${mode}`);
  };

  const clearAll = () => setParams(new URLSearchParams(), { replace: true });
  const activeCount = [aesthetic, era, category, color, makeup].filter(Boolean).length;

  return (
    <Layout>
      <section className="container py-12 text-center space-y-3">
        <p className="font-script text-2xl text-rose-dust">find your piece</p>
        <h1 className="font-display text-5xl text-ink font-bold">Shop</h1>
        <p className="font-serif italic text-ink-soft">Search by mood, era, palette, or makeup style.</p>
      </section>

      <section className="container pb-8">
        <div className="surface-paper p-4 md:p-6 rounded-2xl space-y-5 max-w-5xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
            <Input
              placeholder="Search pieces, tags, eras…"
              value={q}
              onChange={e => updateParam("q", e.target.value)}
              className="pl-10 bg-paper"
            />
          </div>

          <FilterRow label="Aesthetic" value={aesthetic} onChange={v => updateParam("aesthetic", v)}
            options={aesthetics.map(a => ({ value: a.id, label: a.name }))} />
          <FilterRow label="Era" value={era} onChange={v => updateParam("era", v)}
            options={eras.map(e => ({ value: e.id, label: e.decade ? `${e.name} · ${e.decade}` : e.name }))} />
          <FilterRow label="Category" value={category} onChange={v => updateParam("category", v)}
            options={categories.map(c => ({ value: c, label: c }))} />
          <FilterRow label="Makeup style" value={makeup} onChange={v => updateParam("makeup", v)}
            options={MAKEUP_STYLES.map(m => ({ value: m, label: m }))} />

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-soft mb-2">Color palette</p>
            <div className="flex flex-wrap gap-2">
              {COLOR_FAMILIES.map(c => {
                const active = color === c;
                return (
                  <button
                    key={c}
                    onClick={() => updateParam("color", active ? "" : c)}
                    className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all ${
                      active ? "border-ink bg-blush" : "border-border bg-paper hover:border-ink"
                    }`}
                  >
                    <span className="h-5 w-5 rounded-full border border-border" style={{ backgroundColor: COLOR_SWATCH[c] }} />
                    <span className="text-xs uppercase tracking-[0.15em] text-ink">{c}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {(activeCount > 0 || q) && (
            <div className="flex items-center justify-between pt-1">
              <p className="text-sm text-ink-soft">
                {filtered.length} piece{filtered.length === 1 ? "" : "s"} match
              </p>
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-ink-soft">
                <X className="h-4 w-4 mr-1" /> clear all
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="container pb-24">
        {filtered.length === 0 ? (
          <p className="font-serif italic text-ink-soft text-center py-12">
            No pieces yet for that mood. Try loosening a filter, darling.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {filtered.map(p => (
              <div key={p.id} className="group">
                <Link to={`/products/${p.id}`} className="block hover-lift">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-cream relative">
                    <img src={sashImg(p.image_url)} alt={p.name} className="w-full h-full object-cover photo-haze transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  </div>
                  <h3 className="pt-3 font-serif text-lg text-ink">{p.name}</h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-soft capitalize">
                    {p.aesthetic_id ?? p.category}
                  </p>
                </Link>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1 rounded-full" onClick={() => addToWishlist(p)}>
                    <Heart className="h-3.5 w-3.5 mr-1" /> Save
                  </Button>
                  <Button size="sm" className="flex-1 rounded-full" onClick={() => addToCart(p)}>
                    <ShoppingBag className="h-3.5 w-3.5 mr-1" /> Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}

function FilterRow({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-ink-soft mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange("")}
          className={`px-3 py-1 rounded-full border text-xs uppercase tracking-[0.15em] transition-all ${
            value === "" ? "border-ink bg-blush text-ink" : "border-border bg-paper text-ink-soft hover:text-ink"
          }`}
        >all</button>
        {options.map(o => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              onClick={() => onChange(active ? "" : o.value)}
              className={`px-3 py-1 rounded-full border text-xs uppercase tracking-[0.15em] capitalize transition-all ${
                active ? "border-ink bg-blush text-ink" : "border-border bg-paper text-ink-soft hover:text-ink"
              }`}
            >{o.label}</button>
          );
        })}
      </div>
    </div>
  );
}

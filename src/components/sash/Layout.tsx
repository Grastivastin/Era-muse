import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search } from "lucide-react";
import kissesBg from "@/assets/kisses-bg.png";

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : "/shop");
  };
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Site-wide kisses background — soft ~22% opacity, fixed so it doesn't scroll */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: `url(${kissesBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
          opacity: 0.42,
          mixBlendMode: "multiply",
        }}
      />
      <header className="sticky top-0 z-40 backdrop-blur-md bg-paper/85 border-b border-border">
        <div className="container flex items-center justify-between py-5 gap-4">
          <Link to="/" className="font-script text-3xl md:text-4xl font-bold text-ink drop-shadow-sm" style={{ textShadow: "0 1px 2px hsl(var(--rose-dust)/0.4)" }}>
            Sash<span className="text-rose-dust">&amp;</span>Co
          </Link>
          <nav className="hidden md:flex gap-6 text-sm uppercase tracking-[0.2em] text-ink font-medium">
            {[
              ["/", "Home"],
              ["/shop", "Shop"],
              ["/aesthetics", "Aesthetics"],
              ["/for-you", "For You"],
              ["/wishlist", "Wishlist"],
              ["/cart", "Cart"],
              ["/about", "Manifesto"],
            ].map(([to, label]) => (
              <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) =>
                `story-link ${isActive ? "text-ink" : ""}`}>{label}</NavLink>
            ))}
          </nav>
          <form onSubmit={submitSearch} className="hidden md:flex items-center gap-2 bg-paper/80 border border-border rounded-full px-3 py-1.5 w-56">
            <Search className="h-4 w-4 text-ink-soft shrink-0" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="search pieces…"
              className="bg-transparent outline-none text-sm text-ink placeholder:text-ink-soft w-full"
              aria-label="Search"
            />
          </form>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border mt-32 py-12 gradient-dusk relative z-10">
        <div className="container text-center space-y-2">
          <p className="font-script text-5xl text-ink font-bold">Sash<span className="text-rose-dust">&amp;</span>Co</p>
          <p className="font-serif italic text-xl text-ink">dress your era</p>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-soft pt-4">© Sash &amp; Co — a love letter</p>
        </div>
      </footer>
    </div>
  );
}
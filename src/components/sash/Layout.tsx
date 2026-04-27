import { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-paper/70 border-b border-border">
        <div className="container flex items-center justify-between py-5">
          <Link to="/" className="font-display text-2xl tracking-widest text-ink">SASH &amp; CO</Link>
          <nav className="hidden md:flex gap-8 text-sm uppercase tracking-[0.2em] text-ink-soft">
            {[
              ["/aesthetics", "Aesthetics"],
              ["/for-you", "For You"],
              ["/stylist", "Sage"],
              ["/wishlist", "Wishlist"],
              ["/cart", "Cart"],
              ["/about", "Manifesto"],
            ].map(([to, label]) => (
              <NavLink key={to} to={to} className={({ isActive }) =>
                `story-link ${isActive ? "text-ink" : ""}`}>{label}</NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border mt-32 py-12 gradient-dusk">
        <div className="container text-center space-y-2">
          <p className="font-display text-3xl text-ink">SASH &amp; CO</p>
          <p className="font-script text-2xl text-ink-soft">dress your era</p>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-soft pt-4">© Sash &amp; Co — a love letter</p>
        </div>
      </footer>
    </div>
  );
}
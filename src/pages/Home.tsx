import Layout from "@/components/sash/Layout";
import { Link } from "react-router-dom";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sashImg } from "@/lib/sash-images";

export default function Home() {
  const [aesthetics, setAesthetics] = useState<any[]>([]);
  const [eras, setEras] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("aesthetics").select("*").order("display_order").then(({ data }) => setAesthetics(data || []));
    supabase.from("eras").select("*").order("display_order").then(({ data }) => setEras(data || []));
  }, []);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative min-h-[90vh] grid md:grid-cols-2 items-center overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-haze opacity-40" />
        <div className="container py-20 space-y-8 animate-petal-in">
          <p className="font-script text-3xl text-rose-dust">welcome, darling</p>
          <h1 className="font-display text-6xl md:text-8xl leading-[0.95] text-ink text-balance">
            Dress<br/>Your Era.
          </h1>
          <p className="font-serif italic text-2xl text-ink-soft max-w-md text-balance">
            Where your aesthetic lives. Borrow it. Try it. Buy it. Become her.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-base">
              <Link to="/for-you">Find your era</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-6 text-base border-ink/20">
              <Link to="/aesthetics">Browse aesthetics</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-[60vh] md:h-[90vh]">
          <img src={hero} alt="A young woman in soft pastel romantic editorial portrait" className="w-full h-full object-cover photo-haze" width={1080} height={1920} />
          <div className="absolute inset-0 gradient-dawn opacity-20 mix-blend-soft-light" />
        </div>
      </section>

      {/* AESTHETICS */}
      <section className="container py-24 space-y-12">
        <div className="text-center space-y-3">
          <p className="font-script text-2xl text-rose-dust">twelve worlds</p>
          <h2 className="font-display text-5xl text-ink">Choose your aesthetic.</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {aesthetics.slice(0, 8).map(a => (
            <Link key={a.id} to={`/aesthetics/${a.id}`} className="group hover-lift block">
              <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-cream">
                <img src={sashImg(a.image_url)} alt={a.name} className="w-full h-full object-cover photo-haze transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="pt-4 text-center">
                <h3 className="font-display text-xl text-ink">{a.name}</h3>
                <p className="font-script text-lg text-ink-soft">{a.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/aesthetics">All twelve →</Link>
          </Button>
        </div>
      </section>

      {/* ERAS */}
      <section className="gradient-dusk py-24">
        <div className="container space-y-12">
          <div className="text-center space-y-3">
            <p className="font-script text-2xl text-rose-dust">muse-led collections</p>
            <h2 className="font-display text-5xl text-ink">Step into an era.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eras.map(e => (
              <Link key={e.id} to="/for-you" className="group hover-lift block bg-paper rounded-3xl overflow-hidden shadow-petal">
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={sashImg(e.image_url)} alt={e.name} className="w-full h-full object-cover photo-haze-warm transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-6 space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-ink-soft">{e.decade}</p>
                  <h3 className="font-display text-2xl text-ink">{e.name}</h3>
                  <p className="font-serif italic text-ink-soft">{e.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-32 text-center space-y-6">
        <p className="font-script text-2xl text-rose-dust">don't know your era yet?</p>
        <h2 className="font-display text-5xl text-ink max-w-2xl mx-auto text-balance">Take the Style DNA quiz.</h2>
        <p className="font-serif italic text-xl text-ink-soft max-w-xl mx-auto">A few soft questions. One result you'll want to screenshot.</p>
        <Button asChild size="lg" className="rounded-full px-10 py-6 mt-4">
          <Link to="/for-you">Begin →</Link>
        </Button>
      </section>
    </Layout>
  );
}
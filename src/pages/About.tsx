import Layout from "@/components/sash/Layout";
import coastalImg from "@/assets/aes-coastal-balcony.jpg";
import cottageImg from "@/assets/aes-cottage-window.jpg";
import dateAngelsImg from "@/assets/aes-date-angels.jpg";

export default function About() {
  return (
    <Layout>
      {/* HERO — Date with the Angels signage as the muse */}
      <section className="container pt-16 pb-12">
        <div className="grid lg:grid-cols-5 gap-10 items-center max-w-6xl mx-auto">
          <div className="lg:col-span-3 space-y-5 text-center lg:text-left">
            <p className="font-script text-3xl text-rose-dust">our manifesto</p>
            <h1 className="font-display text-5xl md:text-6xl text-ink font-bold leading-tight">
              A love letter to <span className="text-rose-dust">getting dressed.</span>
            </h1>
            <p className="font-serif italic text-xl text-ink-soft text-balance">
              For the girl who picks a song before she picks a coat. Who curates a Pinterest board before she curates an outfit.
            </p>
          </div>
          <div className="lg:col-span-2 relative mx-auto w-full max-w-sm">
            <div className="aspect-square rounded-[2rem] overflow-hidden shadow-soft border border-border">
              <img src={dateAngelsImg} alt="Date with the Angels — vintage signage muse" className="w-full h-full object-cover" />
            </div>
            <span className="absolute -top-3 -right-3 text-3xl animate-shimmer">✦</span>
            <span className="absolute -bottom-3 -left-3 text-2xl animate-shimmer" style={{ animationDelay: "0.7s" }}>✦</span>
          </div>
        </div>
      </section>

      {/* CHAPTER 1 — Cottage window */}
      <section className="container py-12">
        <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto bg-paper/80 backdrop-blur-md rounded-[2rem] p-8 md:p-10 shadow-petal border border-border">
          <div className="aspect-[5/4] rounded-3xl overflow-hidden order-1 md:order-none">
            <img src={cottageImg} alt="A cottage window in bloom" className="w-full h-full object-cover photo-haze" />
          </div>
          <div className="space-y-4">
            <p className="font-script text-2xl text-rose-dust">chapter one</p>
            <h2 className="font-display text-4xl text-ink font-bold">She shops for versions of herself.</h2>
            <p className="font-serif italic text-lg text-ink leading-relaxed">
              The Lana version. The Audrey version. The girl writing in a notebook in a Parisian café — the one she's never been to but knows she belongs in.
            </p>
            <p className="font-serif italic text-lg text-ink leading-relaxed">
              Sash &amp; Co exists for that girl.
            </p>
          </div>
        </div>
      </section>

      {/* CHAPTER 2 — Coastal balcony */}
      <section className="container py-12">
        <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto bg-paper/80 backdrop-blur-md rounded-[2rem] p-8 md:p-10 shadow-petal border border-border">
          <div className="space-y-4 order-2 md:order-1">
            <p className="font-script text-2xl text-rose-dust">chapter two</p>
            <h2 className="font-display text-4xl text-ink font-bold">Sorted by feeling, not by category.</h2>
            <p className="font-serif italic text-lg text-ink leading-relaxed">
              We organize fashion by aesthetic, by muse, by era. Not by garment type. Not by occasion. By the <em>feeling</em>.
            </p>
            <p className="font-serif italic text-lg text-ink leading-relaxed">
              Old money on a balcony in the Florida Keys. Cottagecore in a window full of hydrangeas. We meet you in the mood, not the size chart.
            </p>
          </div>
          <div className="aspect-[5/4] rounded-3xl overflow-hidden order-1 md:order-2">
            <img src={coastalImg} alt="Old-money balcony, coastal sunset" className="w-full h-full object-cover photo-haze-warm" />
          </div>
        </div>
      </section>

      {/* CHAPTER 3 — Borrow · Try · Buy */}
      <section className="container py-12">
        <div className="max-w-4xl mx-auto bg-paper/85 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-petal border border-border text-center space-y-6">
          <p className="font-script text-2xl text-rose-dust">chapter three</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink font-bold">Every era shouldn't cost $400.</h2>
          <div className="grid md:grid-cols-3 gap-6 pt-4">
            {[
              { word: "Borrow", line: "the era for a week." },
              { word: "Try", line: "three pieces in a styled box." },
              { word: "Buy", line: "the one that becomes a part of you." },
            ].map((b) => (
              <div key={b.word} className="rounded-3xl bg-blush/40 border border-border p-6">
                <p className="font-display text-3xl text-ink font-bold">{b.word}</p>
                <p className="font-serif italic text-ink-soft pt-2">{b.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="container py-20 text-center space-y-4 max-w-2xl mx-auto">
        <p className="font-script text-4xl text-rose-dust">welcome to your wardrobe of selves.</p>
        <p className="font-script text-2xl text-rose-dust pt-4">— Sash &amp; Co</p>
      </section>
    </Layout>
  );
}
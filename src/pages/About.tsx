import Layout from "@/components/sash/Layout";

export default function About() {
  return (
    <Layout>
      <section className="container py-24 max-w-2xl space-y-8 text-center">
        <p className="font-script text-3xl text-rose-dust">our manifesto</p>
        <h1 className="font-display text-6xl text-ink">A love letter to getting dressed.</h1>
        <div className="font-serif text-xl text-ink-soft italic space-y-4 text-left pt-6">
          <p>We believe Gen Z doesn't shop for "dresses." She shops for <em>versions of herself</em>.</p>
          <p>The Lana version. The Audrey version. The version writing in a notebook in a Parisian café — the one she's never been to but knows she belongs in.</p>
          <p>Sash &amp; Co exists for that girl. The one who curates a Pinterest board before she curates an outfit. Who picks a song before she picks a coat.</p>
          <p>We organize fashion by aesthetic, by muse, by era. Not by garment type. Not by occasion. By the feeling.</p>
          <p>And because every era doesn't need to cost $400 — you can <strong className="not-italic font-display text-ink">borrow</strong> the era for a week. <strong className="not-italic font-display text-ink">Try</strong> three pieces in a styled box. Or <strong className="not-italic font-display text-ink">buy</strong> the one that becomes a part of you.</p>
          <p>Welcome to your wardrobe of selves.</p>
        </div>
        <p className="font-script text-2xl text-rose-dust pt-8">— Sash &amp; Co</p>
      </section>
    </Layout>
  );
}
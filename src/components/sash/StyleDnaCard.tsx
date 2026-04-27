import { sashImg } from "@/lib/sash-images";

type Props = {
  result: {
    muse: string;
    primary_aesthetic: string;
    secondary_aesthetic?: string | null;
    poem: string;
    signature_pieces?: string[];
  };
};

const MUSE_LABEL: Record<string, { era: string; whisper: string }> = {
  lana: { era: "The Lana Era", whisper: "candlelight, silk slips, & a secret diary" },
  audrey: { era: "The Audrey Era", whisper: "a clean line, a quiet laugh, a perfect coat" },
  stevie: { era: "The Stevie Era", whisper: "lace at golden hour & moon-knowing eyes" },
  diana: { era: "The Diana Era", whisper: "borrowed blazers & the world finally watching" },
};

export default function StyleDnaCard({ result }: Props) {
  const meta = MUSE_LABEL[result.muse] ?? { era: `The ${result.muse} Era`, whisper: "your softest self, finally dressed" };
  const museImg = sashImg(`era-${result.muse}`);

  return (
    <div
      className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-soft"
      style={{
        background:
          "linear-gradient(135deg, hsl(264 35% 18%) 0%, hsl(320 25% 22%) 35%, hsl(348 35% 32%) 70%, hsl(38 40% 60%) 100%)",
      }}
    >
      {/* muse portrait, hazed deep */}
      <img
        src={museImg}
        alt=""
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover opacity-45"
        style={{ filter: "saturate(0.7) brightness(0.85) hue-rotate(-15deg) contrast(1.05)" }}
      />

      {/* Color veil — neutral with purple/rose hues */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(264 30% 15% / 0.6) 0%, hsl(320 25% 25% / 0.4) 40%, hsl(348 35% 35% / 0.55) 80%, hsl(264 30% 25% / 0.7) 100%)",
        }}
      />

      {/* Glitter / sparkle layer */}
      <div
        className="absolute inset-0 opacity-90 pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `
            radial-gradient(circle at 12% 18%, hsl(38 90% 80% / 0.95) 1.2px, transparent 2px),
            radial-gradient(circle at 78% 22%, hsl(348 80% 85% / 0.95) 1px, transparent 1.6px),
            radial-gradient(circle at 30% 60%, hsl(264 70% 85% / 0.9) 0.9px, transparent 1.4px),
            radial-gradient(circle at 88% 70%, hsl(38 90% 80% / 0.85) 1.4px, transparent 2.2px),
            radial-gradient(circle at 18% 85%, hsl(348 80% 88% / 0.9) 0.8px, transparent 1.3px),
            radial-gradient(circle at 65% 45%, hsl(264 75% 90% / 0.8) 1.1px, transparent 1.7px),
            radial-gradient(circle at 50% 8%, hsl(38 90% 85% / 0.95) 1.3px, transparent 2px),
            radial-gradient(circle at 92% 92%, hsl(348 85% 88% / 0.85) 1px, transparent 1.5px)
          `,
          backgroundSize: "180px 180px, 220px 220px, 150px 150px, 240px 240px, 170px 170px, 200px 200px, 190px 190px, 210px 210px",
        }}
      />

      {/* Larger sparkle stars */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <span className="absolute top-[8%] left-[12%] text-2xl text-champagne animate-shimmer" style={{ animationDelay: "0s" }}>✦</span>
        <span className="absolute top-[14%] right-[18%] text-xl text-rose-dust animate-shimmer" style={{ animationDelay: "1s" }}>✧</span>
        <span className="absolute bottom-[20%] left-[8%] text-xl animate-shimmer" style={{ animationDelay: "0.5s", color: "hsl(var(--lavender))" }}>✦</span>
        <span className="absolute bottom-[10%] right-[14%] text-2xl text-champagne animate-shimmer" style={{ animationDelay: "1.5s" }}>✧</span>
        <span className="absolute top-[40%] right-[8%] text-base text-rose-dust animate-shimmer" style={{ animationDelay: "0.8s" }}>✦</span>
      </div>

      {/* Decorative border */}
      <div
        aria-hidden
        className="absolute inset-3 rounded-[1.7rem] border pointer-events-none"
        style={{
          borderColor: "hsl(var(--champagne) / 0.5)",
          boxShadow: "inset 0 0 40px hsl(var(--lavender) / 0.2), inset 0 0 80px hsl(var(--rose-dust) / 0.15)",
        }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-8 text-center">
        <div className="space-y-1">
          <p className="font-script text-2xl text-champagne font-bold" style={{ textShadow: "0 1px 8px hsl(var(--ink)/0.6)" }}>
            sash &amp; co · style dna
          </p>
          <p className="text-[10px] uppercase tracking-[0.4em] text-paper/80">a love letter, decoded</p>
        </div>

        <div className="space-y-3">
          <p className="font-script text-2xl text-rose-dust font-bold" style={{ textShadow: "0 1px 8px hsl(var(--ink)/0.6)" }}>
            your era is
          </p>
          <h2
            className="font-display text-5xl md:text-6xl text-paper leading-tight font-bold"
            style={{ textShadow: "0 2px 12px hsl(var(--ink)/0.7), 0 0 30px hsl(var(--lavender)/0.5)" }}
          >
            {meta.era}
          </h2>
          <p className="font-serif italic text-lg text-champagne text-balance px-4" style={{ textShadow: "0 1px 4px hsl(var(--ink)/0.6)" }}>
            {meta.whisper}
          </p>
        </div>

        <div className="space-y-3 px-2">
          <p
            className="font-serif italic text-base text-paper whitespace-pre-line text-balance leading-relaxed"
            style={{ textShadow: "0 1px 6px hsl(var(--ink)/0.7)" }}
          >
            {result.poem}
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex justify-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-[0.3em] px-3 py-1 rounded-full bg-paper/20 backdrop-blur-sm border border-champagne/40 text-paper font-medium">
              {result.primary_aesthetic}
            </span>
            {result.secondary_aesthetic && (
              <span className="text-[10px] uppercase tracking-[0.3em] px-3 py-1 rounded-full bg-paper/15 backdrop-blur-sm border border-champagne/30 text-paper/90">
                + {result.secondary_aesthetic}
              </span>
            )}
          </div>
          <p className="font-script text-xl text-champagne pt-2 font-bold" style={{ textShadow: "0 1px 6px hsl(var(--ink)/0.6)" }}>
            — Sash &amp; Co
          </p>
          <p className="text-[10px] uppercase tracking-[0.4em] text-paper/80">dress your era</p>
        </div>
      </div>
    </div>
  );
}

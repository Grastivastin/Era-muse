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
        backgroundImage: "var(--gradient-haze)",
      }}
    >
      {/* muse portrait, hazed */}
      <img
        src={museImg}
        alt=""
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover photo-haze opacity-70"
      />
      {/* soft overlay for legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--paper)/0.55) 0%, hsl(var(--blush)/0.35) 45%, hsl(var(--lavender)/0.55) 100%)",
        }}
      />

      {/* content */}
      <div className="relative h-full flex flex-col justify-between p-8 text-center">
        <div className="space-y-1">
          <p className="font-script text-2xl text-rose-dust">sash &amp; co · style dna</p>
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink-soft">a love letter, decoded</p>
        </div>

        <div className="space-y-4">
          <p className="font-script text-2xl text-rose-dust">your era is</p>
          <h2 className="font-display text-5xl md:text-6xl text-ink leading-tight">{meta.era}</h2>
          <p className="font-serif italic text-lg text-ink-soft text-balance px-4">{meta.whisper}</p>
        </div>

        <div className="space-y-3">
          <p className="font-serif italic text-base text-ink whitespace-pre-line text-balance leading-relaxed">
            {result.poem}
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex justify-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-[0.3em] px-3 py-1 rounded-full bg-paper/70 border border-border text-ink">
              {result.primary_aesthetic}
            </span>
            {result.secondary_aesthetic && (
              <span className="text-[10px] uppercase tracking-[0.3em] px-3 py-1 rounded-full bg-paper/50 border border-border text-ink-soft">
                + {result.secondary_aesthetic}
              </span>
            )}
          </div>
          <p className="font-script text-xl text-ink pt-2">— sash &amp; co</p>
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink-soft">dress your era</p>
        </div>
      </div>
    </div>
  );
}
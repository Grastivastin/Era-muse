-- Update existing aesthetic images to real Unsplash editorial full-body fashion photos
UPDATE public.aesthetics SET image_url = 'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=900&q=80' WHERE id = 'coquette';
UPDATE public.aesthetics SET image_url = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80' WHERE id = 'darkacademia';
UPDATE public.aesthetics SET image_url = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80' WHERE id = 'oldmoney';
UPDATE public.aesthetics SET image_url = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80' WHERE id = 'y2k';
UPDATE public.aesthetics SET image_url = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80' WHERE id = 'indiesleaze';
UPDATE public.aesthetics SET image_url = 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?w=900&q=80' WHERE id = 'balletcore';
UPDATE public.aesthetics SET image_url = 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=900&q=80' WHERE id = 'mermaid';
UPDATE public.aesthetics SET image_url = 'https://images.unsplash.com/photo-1469398715555-76331a6c7c9b?w=900&q=80' WHERE id = 'softgirl';
UPDATE public.aesthetics SET image_url = 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=900&q=80' WHERE id = 'cleangirl';
UPDATE public.aesthetics SET image_url = 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=900&q=80' WHERE id = 'regency';

-- Add new aesthetics: grunge/skater, gothic, vintage, ethnic, baddie, bubblegum pop
INSERT INTO public.aesthetics (id, name, tagline, description, mood_words, palette, image_url, display_order) VALUES
('grunge', 'Grunge / Skater', 'a sticky bar floor & a borrowed flannel', 'Oversized tees, ripped denim, scuffed sneakers — the soundtrack of every 90s mixtape.', ARRAY['raw','rebellious','effortless','loud'], ARRAY['#2a2a2a','#7a3b3b','#a89b86','#3d2c3a'], 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80', 13),
('gothic', 'Gothic', 'velvet, candles, & a slow-burning curse', 'Dark romance — corsets, lace, leather, midnight silhouettes.', ARRAY['mysterious','romantic','dramatic','nocturnal'], ARRAY['#0e0a14','#3d2c3a','#5e2436','#9b8baf'], 'https://images.unsplash.com/photo-1485518882345-15568b007407?w=900&q=80', 14),
('vintage', 'Vintage', 'a flea-market scarf & someone else''s love story', 'Thrifted treasures from every decade — 70s flares, 80s blazers, 50s tea dresses.', ARRAY['nostalgic','curated','timeless','storied'], ARRAY['#c8a27a','#8b5a3c','#d4b896','#4a3528'], 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80', 15),
('ethnic', 'Ethnic / Cultural', 'heritage, woven & worn proudly', 'Sarees, kimonos, kaftans, ankaras, huipiles — the world''s wardrobe, honored.', ARRAY['heritage','rich','crafted','global'], ARRAY['#c1272d','#f7c873','#1c5d99','#e8a87c'], 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80', 16),
('baddie', 'Baddie', 'glossed-up, snatched & unbothered', 'Body-con, bold colors, statement accessories — main character energy turned all the way up.', ARRAY['bold','confident','sleek','sultry'], ARRAY['#000000','#d4af37','#c1272d','#f4d4d4'], 'https://images.unsplash.com/photo-1496440737103-cd596325d314?w=900&q=80', 17),
('bubblegum', 'Bubblegum Pop', 'pink on pink on pink, with a wink', 'Hyper-femme, candy colors, glitter, mini skirts — Y2K turned up to saccharine.', ARRAY['sweet','playful','loud','sparkly'], ARRAY['#ff69b4','#ffb6e1','#fff0f5','#c71585'], 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=900&q=80', 18)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  tagline = EXCLUDED.tagline, 
  description = EXCLUDED.description, 
  mood_words = EXCLUDED.mood_words,
  palette = EXCLUDED.palette,
  image_url = EXCLUDED.image_url,
  display_order = EXCLUDED.display_order;

-- Add columns to style_dna for personalization
ALTER TABLE public.style_dna ADD COLUMN IF NOT EXISTS recent_searches TEXT[] DEFAULT '{}'::text[];

-- Era moodboards table for "what's your era right now honey?" feature
CREATE TABLE IF NOT EXISTS public.era_moodboards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  prompt TEXT NOT NULL,
  vibe TEXT,
  outfit_ideas JSONB DEFAULT '[]'::jsonb,
  image_queries TEXT[] DEFAULT '{}'::text[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.era_moodboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Era moodboards open" ON public.era_moodboards FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_era_moodboards_session ON public.era_moodboards(session_id, created_at DESC);
-- PRODUCTS, AESTHETICS, ERAS (catalog)
CREATE TABLE public.aesthetics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  mood_words TEXT[] NOT NULL DEFAULT '{}',
  palette TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.eras (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  muse TEXT NOT NULL,
  decade TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  manifesto TEXT NOT NULL,
  image_url TEXT,
  palette TEXT[] NOT NULL DEFAULT '{}',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  story TEXT,
  aesthetic_id TEXT REFERENCES public.aesthetics(id),
  era_id TEXT REFERENCES public.eras(id),
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  buy_price NUMERIC(10,2),
  borrow_price NUMERIC(10,2),
  try_price NUMERIC(10,2),
  available_modes TEXT[] NOT NULL DEFAULT '{borrow,try,buy}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SESSION-SCOPED PERSISTENCE
CREATE TABLE public.sessions (
  id TEXT PRIMARY KEY,
  selected_era TEXT REFERENCES public.eras(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.style_dna (
  session_id TEXT PRIMARY KEY REFERENCES public.sessions(id) ON DELETE CASCADE,
  primary_aesthetic TEXT NOT NULL,
  secondary_aesthetic TEXT,
  muse TEXT NOT NULL,
  era TEXT NOT NULL,
  signature_pieces TEXT[] NOT NULL DEFAULT '{}',
  poem TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_id, product_id)
);

CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('borrow','try','buy')),
  quantity INT NOT NULL DEFAULT 1,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.sage_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sage_messages_session ON public.sage_messages(session_id, created_at);
CREATE INDEX idx_wishlist_session ON public.wishlist_items(session_id);
CREATE INDEX idx_cart_session ON public.cart_items(session_id);
CREATE INDEX idx_products_aesthetic ON public.products(aesthetic_id);
CREATE INDEX idx_products_era ON public.products(era_id);

-- RLS
ALTER TABLE public.aesthetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.style_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sage_messages ENABLE ROW LEVEL SECURITY;

-- Public catalog: anyone can read
CREATE POLICY "Aesthetics public read" ON public.aesthetics FOR SELECT USING (true);
CREATE POLICY "Eras public read" ON public.eras FOR SELECT USING (true);
CREATE POLICY "Products public read" ON public.products FOR SELECT USING (true);

-- Session tables: open read & write for v1 (session id is unguessable UUID held in browser)
CREATE POLICY "Sessions open" ON public.sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Style DNA open" ON public.style_dna FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Wishlist open" ON public.wishlist_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Cart open" ON public.cart_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Sage messages open" ON public.sage_messages FOR ALL USING (true) WITH CHECK (true);
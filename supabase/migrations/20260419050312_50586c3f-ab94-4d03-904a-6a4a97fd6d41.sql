-- Editable text content
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_content read" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "site_content insert" ON public.site_content FOR INSERT WITH CHECK (true);
CREATE POLICY "site_content update" ON public.site_content FOR UPDATE USING (true);
CREATE POLICY "site_content delete" ON public.site_content FOR DELETE USING (true);

-- Editable images
CREATE TABLE public.site_images (
  key TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_images read" ON public.site_images FOR SELECT USING (true);
CREATE POLICY "site_images insert" ON public.site_images FOR INSERT WITH CHECK (true);
CREATE POLICY "site_images update" ON public.site_images FOR UPDATE USING (true);
CREATE POLICY "site_images delete" ON public.site_images FOR DELETE USING (true);

-- Self-assessment scores
CREATE TABLE public.scores (
  indicator_key TEXT PRIMARY KEY,
  value SMALLINT NOT NULL CHECK (value BETWEEN 1 AND 4),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "scores read" ON public.scores FOR SELECT USING (true);
CREATE POLICY "scores insert" ON public.scores FOR INSERT WITH CHECK (true);
CREATE POLICY "scores update" ON public.scores FOR UPDATE USING (true);
CREATE POLICY "scores delete" ON public.scores FOR DELETE USING (true);

-- Evidence posts
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_key TEXT NOT NULL,
  media_url TEXT NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX posts_indicator_idx ON public.posts(indicator_key, created_at DESC);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts read" ON public.posts FOR SELECT USING (true);
CREATE POLICY "posts insert" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "posts update" ON public.posts FOR UPDATE USING (true);
CREATE POLICY "posts delete" ON public.posts FOR DELETE USING (true);

-- Likes (deduped by browser_id)
CREATE TABLE public.likes (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  browser_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, browser_id)
);
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "likes read" ON public.likes FOR SELECT USING (true);
CREATE POLICY "likes insert" ON public.likes FOR INSERT WITH CHECK (true);
CREATE POLICY "likes delete" ON public.likes FOR DELETE USING (true);

-- Comments
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX comments_post_idx ON public.comments(post_id, created_at ASC);
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments read" ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments insert" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "comments delete" ON public.comments FOR DELETE USING (true);

-- Photos bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "photos public read" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
CREATE POLICY "photos public insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos');
CREATE POLICY "photos public update" ON storage.objects FOR UPDATE USING (bucket_id = 'photos');
CREATE POLICY "photos public delete" ON storage.objects FOR DELETE USING (bucket_id = 'photos');
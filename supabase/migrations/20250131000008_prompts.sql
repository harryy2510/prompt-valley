-- ============================================================================
-- PROMPTS TABLE
-- id column contains slug values (e.g., 'linkedin-about-generator')
-- ============================================================================

CREATE TABLE prompts (
  id TEXT PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  tier tier NOT NULL DEFAULT 'free',
  views_count INTEGER NOT NULL DEFAULT 0,
  saves_count INTEGER NOT NULL DEFAULT 0,
  copies_count INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_prompts_category_id ON prompts(category_id);
CREATE INDEX idx_prompts_tier ON prompts(tier);
CREATE INDEX idx_prompts_is_featured ON prompts(is_featured);
CREATE INDEX idx_prompts_is_published ON prompts(is_published);
CREATE INDEX idx_prompts_created_by ON prompts(created_by);
CREATE INDEX idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX idx_prompts_sort_order ON prompts(sort_order) WHERE is_featured = true;
CREATE INDEX idx_prompts_published_at ON prompts(published_at DESC) WHERE is_published = true;
CREATE INDEX idx_prompts_images ON prompts USING GIN(images);

CREATE TRIGGER generate_slug_prompts
  BEFORE INSERT ON prompts
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug_from_title();

-- Trigger for updated_at
CREATE TRIGGER set_updated_at_prompts
  BEFORE UPDATE ON prompts
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Helper function to check if user can access pro content
CREATE OR REPLACE FUNCTION user_can_access_pro_content()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Admins can access everything
  IF (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' THEN
    RETURN true;
  END IF;

  -- Check if user is authenticated and has pro tier
  IF auth.uid() IS NOT NULL THEN
    RETURN EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND tier = 'pro'
    );
  END IF;

  RETURN false;
END;
$$;

-- Helper functions for engagement
CREATE OR REPLACE FUNCTION increment_prompt_views(prompt_text_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.prompts SET views_count = views_count + 1 WHERE id = prompt_text_id;
END;
$$;

CREATE OR REPLACE FUNCTION increment_prompt_copies(prompt_text_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.prompts SET copies_count = copies_count + 1 WHERE id = prompt_text_id;
END;
$$;

-- RLS
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published prompts"
  ON prompts FOR SELECT
  USING (is_published = true OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can insert prompts"
  ON prompts FOR INSERT
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update prompts"
  ON prompts FOR UPDATE
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete prompts"
  ON prompts FOR DELETE
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- View with tier-based content masking
-- Free users can see pro prompts exist, but content is masked
CREATE VIEW prompts_with_access AS
SELECT
  id,
  title,
  description,
  CASE
    -- Show content if: free tier prompt, or user has pro access, or admin
    WHEN tier = 'free' OR user_can_access_pro_content() THEN content
    ELSE NULL
  END as content,
  images,
  category_id,
  tier,
  views_count,
  saves_count,
  copies_count,
  is_featured,
  is_published,
  sort_order,
  created_by,
  created_at,
  updated_at,
  published_at
FROM prompts;

-- Grants
GRANT SELECT ON TABLE prompts TO anon, authenticated;
GRANT ALL ON TABLE prompts TO service_role;
GRANT SELECT ON prompts_with_access TO anon, authenticated;
GRANT EXECUTE ON FUNCTION user_can_access_pro_content TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION increment_prompt_views TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION increment_prompt_copies TO anon, authenticated, service_role;

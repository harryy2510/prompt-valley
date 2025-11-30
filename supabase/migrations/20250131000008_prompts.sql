-- ============================================================================
-- PROMPTS TABLE
-- ============================================================================

CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
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
CREATE INDEX idx_prompts_slug ON prompts(slug);
CREATE INDEX idx_prompts_category_id ON prompts(category_id);
CREATE INDEX idx_prompts_tier ON prompts(tier);
CREATE INDEX idx_prompts_is_featured ON prompts(is_featured);
CREATE INDEX idx_prompts_is_published ON prompts(is_published);
CREATE INDEX idx_prompts_created_by ON prompts(created_by);
CREATE INDEX idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX idx_prompts_sort_order ON prompts(sort_order) WHERE is_featured = true;
CREATE INDEX idx_prompts_published_at ON prompts(published_at DESC) WHERE is_published = true;
CREATE INDEX idx_prompts_images ON prompts USING GIN(images);

-- Trigger for updated_at
CREATE TRIGGER set_updated_at_prompts
  BEFORE UPDATE ON prompts
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Helper functions for engagement
CREATE OR REPLACE FUNCTION increment_prompt_views(prompt_uuid UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE prompts SET views_count = views_count + 1 WHERE id = prompt_uuid;
END;
$$;

CREATE OR REPLACE FUNCTION increment_prompt_copies(prompt_uuid UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE prompts SET copies_count = copies_count + 1 WHERE id = prompt_uuid;
END;
$$;

-- RLS
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published prompts"
  ON prompts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage prompts"
  ON prompts FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Grants
GRANT SELECT ON TABLE prompts TO anon, authenticated;
GRANT ALL ON TABLE prompts TO service_role;
GRANT EXECUTE ON FUNCTION increment_prompt_views TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION increment_prompt_copies TO anon, authenticated, service_role;

-- ============================================================================
-- TAGS TABLE
-- ============================================================================

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tags_slug ON tags(slug);

-- Trigger for updated_at
CREATE TRIGGER set_updated_at_tags
  BEFORE UPDATE ON tags
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tags"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage tags"
  ON tags FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Grants
GRANT SELECT ON TABLE tags TO anon, authenticated;
GRANT ALL ON TABLE tags TO service_role;

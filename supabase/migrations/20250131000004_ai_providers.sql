-- ============================================================================
-- AI_PROVIDERS TABLE
-- ============================================================================

CREATE TABLE ai_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ai_providers_slug ON ai_providers(slug);

-- Trigger for updated_at
CREATE TRIGGER set_updated_at_ai_providers
  BEFORE UPDATE ON ai_providers
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE ai_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ai_providers"
  ON ai_providers FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert ai_providers"
  ON ai_providers FOR INSERT
  WITH CHECK ((SELECT auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admins can update ai_providers"
  ON ai_providers FOR UPDATE
  USING ((SELECT auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admins can delete ai_providers"
  ON ai_providers FOR DELETE
  USING ((SELECT auth.jwt() ->> 'role') = 'admin');

-- Grants
GRANT SELECT ON TABLE ai_providers TO anon, authenticated;
GRANT ALL ON TABLE ai_providers TO service_role;

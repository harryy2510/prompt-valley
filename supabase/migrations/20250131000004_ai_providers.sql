-- ============================================================================
-- AI_PROVIDERS TABLE
-- id column contains slug values (e.g., 'openai', 'google')
-- ============================================================================

CREATE TABLE ai_providers (
  id TEXT PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to auto-generate id from name if not provided
CREATE TRIGGER generate_slug_ai_providers
  BEFORE INSERT ON ai_providers
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug_from_name();

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
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update ai_providers"
  ON ai_providers FOR UPDATE
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete ai_providers"
  ON ai_providers FOR DELETE
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Grants
GRANT SELECT ON TABLE ai_providers TO anon, authenticated;
GRANT ALL ON TABLE ai_providers TO service_role;

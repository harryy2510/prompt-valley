-- ============================================================================
-- TAGS TABLE
-- id column contains slug values (e.g., 'beginner-friendly', 'linkedin')
-- ============================================================================

CREATE TABLE tags (
  id TEXT PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to auto-generate id from name if not provided
CREATE TRIGGER generate_slug_tags
  BEFORE INSERT ON tags
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug_from_name();

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

CREATE POLICY "Admins can insert tags"
  ON tags FOR INSERT
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update tags"
  ON tags FOR UPDATE
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete tags"
  ON tags FOR DELETE
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Grants
GRANT SELECT ON TABLE tags TO anon, authenticated;
GRANT ALL ON TABLE tags TO service_role;

-- ============================================================================
-- CATEGORIES TABLE
-- id column contains slug values (e.g., 'writing', 'linkedin-post')
-- ============================================================================

CREATE TABLE categories (
  id TEXT PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  parent_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT no_self_reference CHECK (id != parent_id)
);

-- Indexes
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- Trigger to auto-generate id from name if not provided
CREATE TRIGGER generate_slug_categories
  BEFORE INSERT ON categories
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug_from_name();

-- Trigger for updated_at
CREATE TRIGGER set_updated_at_categories
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Function to prevent cyclic references
CREATE OR REPLACE FUNCTION prevent_category_cycle()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    -- Check if setting this parent would create a cycle
    IF EXISTS (
      WITH RECURSIVE category_tree AS (
        SELECT id, parent_id FROM public.categories WHERE id = NEW.parent_id
        UNION ALL
        SELECT c.id, c.parent_id
        FROM public.categories c
        INNER JOIN category_tree ct ON c.id = ct.parent_id
      )
      SELECT 1 FROM category_tree WHERE id = NEW.id
    ) THEN
      RAISE EXCEPTION 'Cannot set parent: would create a cycle';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_category_cycle_trigger
  BEFORE INSERT OR UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION prevent_category_cycle();

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Grants
GRANT SELECT ON TABLE categories TO anon, authenticated;
GRANT ALL ON TABLE categories TO service_role;

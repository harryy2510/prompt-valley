-- ============================================================================
-- PROMPT_TAGS TABLE
-- ============================================================================

CREATE TABLE prompt_tags (
  prompt_id TEXT NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (prompt_id, tag_id)
);

-- Indexes
CREATE INDEX idx_prompt_tags_tag_id ON prompt_tags(tag_id);

-- RLS
ALTER TABLE prompt_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view prompt_tags for published prompts"
  ON prompt_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM prompts
      WHERE prompts.id = prompt_tags.prompt_id
      AND prompts.is_published = true
    )
    OR (SELECT auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can insert prompt_tags"
  ON prompt_tags FOR INSERT
  WITH CHECK ((SELECT auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admins can update prompt_tags"
  ON prompt_tags FOR UPDATE
  USING ((SELECT auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admins can delete prompt_tags"
  ON prompt_tags FOR DELETE
  USING ((SELECT auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Service role bypasses RLS on prompt_tags"
  ON prompt_tags
  AS PERMISSIVE
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Grants
GRANT SELECT ON TABLE prompt_tags TO anon, authenticated;
GRANT ALL ON TABLE prompt_tags TO service_role;

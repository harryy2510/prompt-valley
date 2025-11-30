-- ============================================================================
-- PROMPT_TAGS TABLE
-- ============================================================================

CREATE TABLE prompt_tags (
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
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
  );

CREATE POLICY "Admins can manage prompt_tags"
  ON prompt_tags FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Grants
GRANT SELECT ON TABLE prompt_tags TO anon, authenticated;
GRANT ALL ON TABLE prompt_tags TO service_role;

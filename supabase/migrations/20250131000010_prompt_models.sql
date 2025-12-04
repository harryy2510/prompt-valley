-- ============================================================================
-- PROMPT_MODELS TABLE
-- ============================================================================

CREATE TABLE prompt_models (
  prompt_id TEXT NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  model_id TEXT NOT NULL REFERENCES ai_models(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (prompt_id, model_id)
);

-- Indexes
CREATE INDEX idx_prompt_models_model_id ON prompt_models(model_id);

-- RLS
ALTER TABLE prompt_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view prompt_models for published prompts"
  ON prompt_models FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM prompts
      WHERE prompts.id = prompt_models.prompt_id
      AND prompts.is_published = true
    )
    OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can insert prompt_models"
  ON prompt_models FOR INSERT
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update prompt_models"
  ON prompt_models FOR UPDATE
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete prompt_models"
  ON prompt_models FOR DELETE
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Service role bypasses RLS on prompt_models"
  ON prompt_models
  AS PERMISSIVE
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Grants
GRANT SELECT ON TABLE prompt_models TO anon, authenticated;
GRANT ALL ON TABLE prompt_models TO service_role;

-- ============================================================================
-- AI_MODELS TABLE
-- id column contains model identifiers from providers (e.g., 'gpt-4o', 'claude-3-5-sonnet-20241022', 'gemini-2.0-flash-exp')
-- No validation constraint since third-party IDs may use dots, underscores, etc.
-- ============================================================================

CREATE TABLE ai_models (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL REFERENCES ai_providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  capabilities model_capability[] NOT NULL DEFAULT '{text}',
  context_window INTEGER,
  max_output_tokens INTEGER,
  cost_input_per_million DECIMAL(10,4),
  cost_output_per_million DECIMAL(10,4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ai_models_provider_id ON ai_models(provider_id);
CREATE INDEX idx_ai_models_capabilities ON ai_models USING GIN(capabilities);

-- Trigger for updated_at
CREATE TRIGGER set_updated_at_ai_models
  BEFORE UPDATE ON ai_models
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ai_models"
  ON ai_models FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert ai_models"
  ON ai_models FOR INSERT
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update ai_models"
  ON ai_models FOR UPDATE
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete ai_models"
  ON ai_models FOR DELETE
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Grants
GRANT SELECT ON TABLE ai_models TO anon, authenticated;
GRANT ALL ON TABLE ai_models TO service_role;

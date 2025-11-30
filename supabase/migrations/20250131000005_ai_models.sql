-- ============================================================================
-- AI_MODELS TABLE
-- ============================================================================

CREATE TABLE ai_models (
  id TEXT PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES ai_providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
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
CREATE INDEX idx_ai_models_slug ON ai_models(slug);
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

CREATE POLICY "Admins can manage ai_models"
  ON ai_models FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Grants
GRANT SELECT ON TABLE ai_models TO anon, authenticated;
GRANT ALL ON TABLE ai_models TO service_role;

-- ============================================================================
-- USER_FAVORITES TABLE
-- ============================================================================

CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_favorite UNIQUE(user_id, prompt_id)
);

-- Indexes
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_prompt_id ON user_favorites(prompt_id);
CREATE INDEX idx_user_favorites_created_at ON user_favorites(created_at DESC);

-- Trigger to update prompt saves_count
CREATE OR REPLACE FUNCTION update_prompt_saves_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE prompts SET saves_count = saves_count + 1 WHERE id = NEW.prompt_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE prompts SET saves_count = GREATEST(saves_count - 1, 0) WHERE id = OLD.prompt_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_prompt_saves_count_trigger
  AFTER INSERT OR DELETE ON user_favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_prompt_saves_count();

-- RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
  ON user_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites"
  ON user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON user_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Grants
GRANT SELECT, INSERT, DELETE ON TABLE user_favorites TO authenticated;
GRANT ALL ON TABLE user_favorites TO service_role;

-- ============================================================================
-- ADD LIKES_COUNT TO PROMPTS AND CREATE USER_LIKES TABLE
-- ============================================================================

-- Add likes_count column to prompts table
ALTER TABLE prompts ADD COLUMN likes_count INTEGER NOT NULL DEFAULT 0;

-- Create index for likes_count
CREATE INDEX idx_prompts_likes_count ON prompts(likes_count DESC);

-- ============================================================================
-- USER_LIKES TABLE
-- ============================================================================

CREATE TABLE user_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompt_id TEXT NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_like UNIQUE(user_id, prompt_id)
);

-- Indexes
CREATE INDEX idx_user_likes_user_id ON user_likes(user_id);
CREATE INDEX idx_user_likes_prompt_id ON user_likes(prompt_id);
CREATE INDEX idx_user_likes_created_at ON user_likes(created_at DESC);

-- Trigger to update prompt likes_count
CREATE OR REPLACE FUNCTION update_prompt_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.prompts SET likes_count = likes_count + 1 WHERE id = NEW.prompt_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.prompts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.prompt_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_prompt_likes_count_trigger
  AFTER INSERT OR DELETE ON user_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_prompt_likes_count();

-- RLS
ALTER TABLE user_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own likes"
  ON user_likes FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create their own likes"
  ON user_likes FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own likes"
  ON user_likes FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

-- Grants
GRANT SELECT, INSERT, DELETE ON TABLE user_likes TO authenticated;
GRANT ALL ON TABLE user_likes TO service_role;

-- ============================================================================
-- UPDATE PROMPTS_WITH_ACCESS VIEW TO INCLUDE LIKES_COUNT
-- ============================================================================

-- Drop and recreate the view to add likes_count
DROP VIEW IF EXISTS prompts_with_access;

CREATE VIEW prompts_with_access AS
SELECT
  p.id,
  p.title,
  p.description,
  CASE
    WHEN p.tier = 'free' OR user_can_access_pro_content() THEN p.content
    ELSE NULL
  END as content,
  p.images,
  p.category_id,
  c.parent_id as parent_category_id,
  p.tier,
  p.views_count,
  p.saves_count,
  p.likes_count,
  p.copies_count,
  p.is_featured,
  p.is_published,
  p.sort_order,
  p.created_by,
  p.created_at,
  p.updated_at,
  p.published_at
FROM prompts p
LEFT JOIN categories c ON p.category_id = c.id;

-- Re-grant access to the view
GRANT SELECT ON prompts_with_access TO anon, authenticated;

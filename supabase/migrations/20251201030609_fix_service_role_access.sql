-- ============================================================================
-- FIX SERVICE ROLE ACCESS FOR CMS
-- Create explicit service_role bypass policies
-- ============================================================================

-- Add service_role bypass policy to prompt_tags
CREATE POLICY "Service role bypasses RLS on prompt_tags"
  ON prompt_tags
  AS PERMISSIVE
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add service_role bypass policy to prompt_models
CREATE POLICY "Service role bypasses RLS on prompt_models"
  ON prompt_models
  AS PERMISSIVE
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


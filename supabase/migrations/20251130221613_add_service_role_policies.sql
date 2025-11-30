-- ============================================================================
-- ADD SERVICE ROLE POLICIES FOR CMS ACCESS
-- Adds full access policies for service_role to junction tables
-- ============================================================================

-- Add service_role full access policy to prompt_tags
CREATE POLICY "Service role has full access to prompt_tags"
  ON prompt_tags FOR ALL
  USING ((SELECT current_setting('request.jwt.claims', true)::json->>'role') = 'service_role')
  WITH CHECK ((SELECT current_setting('request.jwt.claims', true)::json->>'role') = 'service_role');

-- Add UPDATE policy for admins on prompt_tags (was missing)
CREATE POLICY "Admins can update prompt_tags"
  ON prompt_tags FOR UPDATE
  USING ((SELECT auth.jwt() ->> 'role') = 'admin');

-- Add service_role full access policy to prompt_models
CREATE POLICY "Service role has full access to prompt_models"
  ON prompt_models FOR ALL
  USING ((SELECT current_setting('request.jwt.claims', true)::json->>'role') = 'service_role')
  WITH CHECK ((SELECT current_setting('request.jwt.claims', true)::json->>'role') = 'service_role');

-- Add UPDATE policy for admins on prompt_models (was missing)
CREATE POLICY "Admins can update prompt_models"
  ON prompt_models FOR UPDATE
  USING ((SELECT auth.jwt() ->> 'role') = 'admin');

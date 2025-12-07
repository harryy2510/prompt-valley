-- ============================================================================
-- ADD MARKETING FEATURES TO STRIPE PRODUCTS
-- Stripe products have a marketing_features array that's separate from metadata
-- ============================================================================

-- Rename 'features' to 'marketing_features' to match Stripe's field name
ALTER TABLE stripe_products RENAME COLUMN features TO marketing_features;

-- Drop the view since we'll use Supabase relationships instead
DROP VIEW IF EXISTS stripe_products_with_prices;

-- Add comment for clarity
COMMENT ON COLUMN stripe_products.marketing_features IS 'Marketing features from Stripe product (bullet points for pricing page)';

-- ============================================================================
-- FIX SECURITY DEFINER VIEW: prompts_with_access
-- Change from SECURITY DEFINER to SECURITY INVOKER
-- ============================================================================

-- Recreate the view with SECURITY INVOKER
DROP VIEW IF EXISTS prompts_with_access;

CREATE VIEW prompts_with_access
WITH (security_invoker = on)
AS
SELECT
  p.id,
  p.title,
  p.description,
  p.category_id,
  p.tier,
  p.images,
  p.is_featured,
  p.is_published,
  p.published_at,
  p.sort_order,
  p.views_count,
  p.copies_count,
  p.saves_count,
  p.created_by,
  p.created_at,
  p.updated_at,
  -- Only show content if user has access (free tier or pro user)
  CASE
    WHEN p.tier = 'free' THEN p.content
    WHEN public.user_can_access_pro_content() THEN p.content
    ELSE NULL
  END AS content
FROM prompts p
WHERE p.is_published = true;

-- Grant access
GRANT SELECT ON prompts_with_access TO anon, authenticated;

COMMENT ON VIEW prompts_with_access IS 'Published prompts with content access control based on user tier';

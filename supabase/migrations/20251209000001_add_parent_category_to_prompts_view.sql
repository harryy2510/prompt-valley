-- Add parent_category_id to prompts_with_access view for hierarchical filtering

DROP VIEW IF EXISTS prompts_with_access;

CREATE VIEW prompts_with_access
WITH (security_invoker = on)
AS
SELECT
  p.id,
  p.title,
  p.description,
  p.category_id,
  c.parent_id AS parent_category_id,
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
LEFT JOIN categories c ON c.id = p.category_id
WHERE p.is_published = true;

-- Grant access
GRANT SELECT ON prompts_with_access TO anon, authenticated;

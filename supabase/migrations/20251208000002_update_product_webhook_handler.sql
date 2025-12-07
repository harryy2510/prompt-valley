-- ============================================================================
-- UPDATE PRODUCT WEBHOOK HANDLER FOR MARKETING FEATURES
-- Stripe products have marketing_features as a top-level array
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_stripe_product_webhook(payload JSONB)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  event_type TEXT;
  product_data JSONB;
  product_id TEXT;
  product_name TEXT;
  product_description TEXT;
  product_images TEXT[];
  product_active BOOLEAN;
  product_metadata JSONB;
  marketing_features_array TEXT[];
BEGIN
  event_type := payload->>'type';
  product_data := payload->'data'->'object';
  product_id := product_data->>'id';

  -- Handle product deletion
  IF event_type = 'product.deleted' THEN
    UPDATE public.stripe_products
    SET active = false, updated_at = NOW()
    WHERE id = product_id;
    RETURN;
  END IF;

  -- Extract product data
  product_name := product_data->>'name';
  product_description := product_data->>'description';
  product_active := (product_data->>'active')::BOOLEAN;
  product_metadata := COALESCE(product_data->'metadata', '{}'::jsonb);

  -- Extract images array
  SELECT ARRAY_AGG(elem::TEXT)
  INTO product_images
  FROM jsonb_array_elements_text(COALESCE(product_data->'images', '[]'::jsonb)) AS elem;

  -- Extract marketing_features from Stripe (array of objects with 'name' field)
  SELECT ARRAY_AGG(feature_obj->>'name')
  INTO marketing_features_array
  FROM jsonb_array_elements(COALESCE(product_data->'marketing_features', '[]'::jsonb)) AS feature_obj
  WHERE feature_obj->>'name' IS NOT NULL;

  -- Upsert product
  INSERT INTO public.stripe_products (
    id,
    name,
    description,
    images,
    marketing_features,
    highlight,
    display_order,
    active,
    metadata,
    created_at,
    updated_at
  ) VALUES (
    product_id,
    product_name,
    product_description,
    COALESCE(product_images, '{}'),
    COALESCE(marketing_features_array, '{}'),
    product_metadata->>'highlight',
    COALESCE((product_metadata->>'display_order')::INTEGER, 0),
    product_active,
    product_metadata,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    images = EXCLUDED.images,
    marketing_features = EXCLUDED.marketing_features,
    highlight = EXCLUDED.highlight,
    display_order = EXCLUDED.display_order,
    active = EXCLUDED.active,
    metadata = EXCLUDED.metadata,
    updated_at = NOW();

  RAISE NOTICE 'Stripe product synced: % (%) with % marketing features',
    product_name, product_id, COALESCE(array_length(marketing_features_array, 1), 0);
END;
$$;

GRANT EXECUTE ON FUNCTION handle_stripe_product_webhook TO service_role;

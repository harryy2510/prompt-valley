-- ============================================================================
-- STRIPE PRODUCT/PRICE/COUPON SYNC HANDLERS
-- Functions to handle Stripe webhook events for product catalog sync
-- ============================================================================

-- ============================================================================
-- PRODUCT SYNC HANDLER
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
  features_array TEXT[];
  i INTEGER;
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

  -- Extract features from metadata (stored as features_1, features_2, etc. or as JSON array)
  IF product_metadata ? 'features' THEN
    -- Features stored as JSON array string in metadata
    BEGIN
      SELECT ARRAY_AGG(elem::TEXT)
      INTO features_array
      FROM jsonb_array_elements_text((product_metadata->>'features')::jsonb) AS elem;
    EXCEPTION WHEN OTHERS THEN
      features_array := '{}';
    END;
  ELSE
    -- Features stored as numbered keys
    features_array := '{}';
    FOR i IN 1..10 LOOP
      IF product_metadata ? ('feature_' || i) THEN
        features_array := array_append(features_array, product_metadata->>'feature_' || i);
      END IF;
    END LOOP;
  END IF;

  -- Upsert product
  INSERT INTO public.stripe_products (
    id,
    name,
    description,
    images,
    features,
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
    COALESCE(features_array, '{}'),
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
    features = EXCLUDED.features,
    highlight = EXCLUDED.highlight,
    display_order = EXCLUDED.display_order,
    active = EXCLUDED.active,
    metadata = EXCLUDED.metadata,
    updated_at = NOW();

  RAISE NOTICE 'Stripe product synced: % (%)', product_name, product_id;
END;
$$;

GRANT EXECUTE ON FUNCTION handle_stripe_product_webhook TO service_role;

-- ============================================================================
-- PRICE SYNC HANDLER
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_stripe_price_webhook(payload JSONB)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  event_type TEXT;
  price_data JSONB;
  price_id TEXT;
  product_id TEXT;
  price_active BOOLEAN;
  unit_amount INTEGER;
  currency TEXT;
  recurring_data JSONB;
  interval_value public.billing_interval;
  interval_count INTEGER;
  nickname TEXT;
  price_metadata JSONB;
BEGIN
  event_type := payload->>'type';
  price_data := payload->'data'->'object';
  price_id := price_data->>'id';

  -- Handle price deletion
  IF event_type = 'price.deleted' THEN
    UPDATE public.stripe_prices
    SET active = false, updated_at = NOW()
    WHERE id = price_id;
    RETURN;
  END IF;

  -- Extract price data
  product_id := price_data->>'product';
  price_active := (price_data->>'active')::BOOLEAN;
  unit_amount := (price_data->>'unit_amount')::INTEGER;
  currency := price_data->>'currency';
  nickname := price_data->>'nickname';
  price_metadata := COALESCE(price_data->'metadata', '{}'::jsonb);

  -- Extract recurring data if present
  recurring_data := price_data->'recurring';
  IF recurring_data IS NOT NULL AND recurring_data != 'null'::jsonb THEN
    interval_value := (recurring_data->>'interval')::public.billing_interval;
    interval_count := COALESCE((recurring_data->>'interval_count')::INTEGER, 1);
  ELSE
    interval_value := NULL;
    interval_count := NULL;
  END IF;

  -- Upsert price (only if product exists)
  INSERT INTO public.stripe_prices (
    id,
    product_id,
    unit_amount,
    currency,
    recurring_interval,
    recurring_interval_count,
    active,
    nickname,
    metadata,
    created_at,
    updated_at
  ) VALUES (
    price_id,
    product_id,
    unit_amount,
    currency,
    interval_value,
    interval_count,
    price_active,
    nickname,
    price_metadata,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    product_id = EXCLUDED.product_id,
    unit_amount = EXCLUDED.unit_amount,
    currency = EXCLUDED.currency,
    recurring_interval = EXCLUDED.recurring_interval,
    recurring_interval_count = EXCLUDED.recurring_interval_count,
    active = EXCLUDED.active,
    nickname = EXCLUDED.nickname,
    metadata = EXCLUDED.metadata,
    updated_at = NOW();

  RAISE NOTICE 'Stripe price synced: % for product %', price_id, product_id;
END;
$$;

GRANT EXECUTE ON FUNCTION handle_stripe_price_webhook TO service_role;

-- ============================================================================
-- COUPON SYNC HANDLER
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_stripe_coupon_webhook(payload JSONB)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  event_type TEXT;
  coupon_data JSONB;
  coupon_id TEXT;
  coupon_name TEXT;
  amount_off INTEGER;
  percent_off NUMERIC;
  currency TEXT;
  duration_value public.coupon_duration;
  duration_months INTEGER;
  max_redemptions INTEGER;
  redeem_by_ts TIMESTAMPTZ;
  applies_to_products TEXT[];
  coupon_valid BOOLEAN;
  times_redeemed INTEGER;
  coupon_metadata JSONB;
BEGIN
  event_type := payload->>'type';
  coupon_data := payload->'data'->'object';
  coupon_id := coupon_data->>'id';

  -- Handle coupon deletion
  IF event_type = 'coupon.deleted' THEN
    UPDATE public.stripe_coupons
    SET valid = false, updated_at = NOW()
    WHERE id = coupon_id;
    RETURN;
  END IF;

  -- Extract coupon data
  coupon_name := coupon_data->>'name';
  amount_off := (coupon_data->>'amount_off')::INTEGER;
  percent_off := (coupon_data->>'percent_off')::NUMERIC;
  currency := coupon_data->>'currency';
  duration_value := (coupon_data->>'duration')::public.coupon_duration;
  duration_months := (coupon_data->>'duration_in_months')::INTEGER;
  max_redemptions := (coupon_data->>'max_redemptions')::INTEGER;
  coupon_valid := (coupon_data->>'valid')::BOOLEAN;
  times_redeemed := COALESCE((coupon_data->>'times_redeemed')::INTEGER, 0);
  coupon_metadata := COALESCE(coupon_data->'metadata', '{}'::jsonb);

  -- Extract redeem_by timestamp
  IF coupon_data->>'redeem_by' IS NOT NULL THEN
    redeem_by_ts := to_timestamp((coupon_data->>'redeem_by')::BIGINT);
  END IF;

  -- Extract applies_to products
  IF coupon_data->'applies_to'->'products' IS NOT NULL THEN
    SELECT ARRAY_AGG(elem::TEXT)
    INTO applies_to_products
    FROM jsonb_array_elements_text(coupon_data->'applies_to'->'products') AS elem;
  ELSE
    applies_to_products := '{}';
  END IF;

  -- Upsert coupon
  INSERT INTO public.stripe_coupons (
    id,
    name,
    amount_off,
    percent_off,
    currency,
    duration,
    duration_in_months,
    max_redemptions,
    redeem_by,
    applies_to_products,
    valid,
    times_redeemed,
    metadata,
    created_at,
    updated_at
  ) VALUES (
    coupon_id,
    coupon_name,
    amount_off,
    percent_off,
    currency,
    duration_value,
    duration_months,
    max_redemptions,
    redeem_by_ts,
    COALESCE(applies_to_products, '{}'),
    coupon_valid,
    times_redeemed,
    coupon_metadata,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    amount_off = EXCLUDED.amount_off,
    percent_off = EXCLUDED.percent_off,
    currency = EXCLUDED.currency,
    duration = EXCLUDED.duration,
    duration_in_months = EXCLUDED.duration_in_months,
    max_redemptions = EXCLUDED.max_redemptions,
    redeem_by = EXCLUDED.redeem_by,
    applies_to_products = EXCLUDED.applies_to_products,
    valid = EXCLUDED.valid,
    times_redeemed = EXCLUDED.times_redeemed,
    metadata = EXCLUDED.metadata,
    updated_at = NOW();

  RAISE NOTICE 'Stripe coupon synced: % (%)', coupon_name, coupon_id;
END;
$$;

GRANT EXECUTE ON FUNCTION handle_stripe_coupon_webhook TO service_role;

-- ============================================================================
-- PROMOTION CODE SYNC HANDLER
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_stripe_promotion_code_webhook(payload JSONB)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  event_type TEXT;
  promo_data JSONB;
  promo_id TEXT;
  promo_code TEXT;
  coupon_id TEXT;
  promo_active BOOLEAN;
  expires_at_ts TIMESTAMPTZ;
  max_redemptions INTEGER;
  times_redeemed INTEGER;
  first_time_tx BOOLEAN;
  min_amount INTEGER;
  min_currency TEXT;
  promo_metadata JSONB;
BEGIN
  event_type := payload->>'type';
  promo_data := payload->'data'->'object';
  promo_id := promo_data->>'id';

  -- Handle promotion code updates (there's no delete event for promo codes)

  -- Extract data
  promo_code := promo_data->>'code';
  coupon_id := promo_data->'coupon'->>'id';
  promo_active := (promo_data->>'active')::BOOLEAN;
  max_redemptions := (promo_data->>'max_redemptions')::INTEGER;
  times_redeemed := COALESCE((promo_data->>'times_redeemed')::INTEGER, 0);
  promo_metadata := COALESCE(promo_data->'metadata', '{}'::jsonb);

  -- Extract expires_at timestamp
  IF promo_data->>'expires_at' IS NOT NULL THEN
    expires_at_ts := to_timestamp((promo_data->>'expires_at')::BIGINT);
  END IF;

  -- Extract restrictions
  first_time_tx := COALESCE((promo_data->'restrictions'->>'first_time_transaction')::BOOLEAN, false);
  min_amount := (promo_data->'restrictions'->>'minimum_amount')::INTEGER;
  min_currency := promo_data->'restrictions'->>'minimum_amount_currency';

  -- Upsert promotion code (only if coupon exists)
  INSERT INTO public.stripe_promotion_codes (
    id,
    code,
    coupon_id,
    active,
    expires_at,
    max_redemptions,
    times_redeemed,
    first_time_transaction,
    minimum_amount,
    minimum_amount_currency,
    metadata,
    created_at,
    updated_at
  ) VALUES (
    promo_id,
    promo_code,
    coupon_id,
    promo_active,
    expires_at_ts,
    max_redemptions,
    times_redeemed,
    first_time_tx,
    min_amount,
    min_currency,
    promo_metadata,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    code = EXCLUDED.code,
    coupon_id = EXCLUDED.coupon_id,
    active = EXCLUDED.active,
    expires_at = EXCLUDED.expires_at,
    max_redemptions = EXCLUDED.max_redemptions,
    times_redeemed = EXCLUDED.times_redeemed,
    first_time_transaction = EXCLUDED.first_time_transaction,
    minimum_amount = EXCLUDED.minimum_amount,
    minimum_amount_currency = EXCLUDED.minimum_amount_currency,
    metadata = EXCLUDED.metadata,
    updated_at = NOW();

  RAISE NOTICE 'Stripe promotion code synced: % (%)', promo_code, promo_id;
END;
$$;

GRANT EXECUTE ON FUNCTION handle_stripe_promotion_code_webhook TO service_role;

-- ============================================================================
-- HELPER: Validate promotion code
-- Returns coupon details if valid, null otherwise
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_promotion_code(code_param TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  result JSON;
  promo RECORD;
  coup RECORD;
BEGIN
  -- Find active promotion code
  SELECT * INTO promo
  FROM public.stripe_promotion_codes
  WHERE code = UPPER(code_param)
    AND active = true
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (max_redemptions IS NULL OR times_redeemed < max_redemptions);

  IF promo IS NULL THEN
    RETURN NULL;
  END IF;

  -- Get associated coupon
  SELECT * INTO coup
  FROM public.stripe_coupons
  WHERE id = promo.coupon_id
    AND valid = true
    AND (redeem_by IS NULL OR redeem_by > NOW())
    AND (max_redemptions IS NULL OR times_redeemed < max_redemptions);

  IF coup IS NULL THEN
    RETURN NULL;
  END IF;

  -- Return coupon details
  SELECT json_build_object(
    'promotion_code_id', promo.id,
    'code', promo.code,
    'coupon_id', coup.id,
    'name', coup.name,
    'amount_off', coup.amount_off,
    'percent_off', coup.percent_off,
    'currency', coup.currency,
    'duration', coup.duration,
    'duration_in_months', coup.duration_in_months,
    'minimum_amount', promo.minimum_amount,
    'first_time_transaction', promo.first_time_transaction
  ) INTO result;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION validate_promotion_code TO anon, authenticated;

COMMENT ON FUNCTION validate_promotion_code IS 'Validates a promotion code and returns discount details if valid';

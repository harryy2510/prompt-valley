-- ============================================================================
-- STRIPE WEBHOOK HANDLER
-- Function to handle Stripe subscription events and sync to users table
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_stripe_webhook(payload JSONB)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  event_type TEXT;
  customer_id TEXT;
  subscription_id TEXT;
  subscription_status TEXT;
  period_start TIMESTAMPTZ;
  period_end TIMESTAMPTZ;
  cancel_at_period_end BOOLEAN;
  canceled_at TIMESTAMPTZ;
  new_tier public.tier;
BEGIN
  -- Extract event type
  event_type := payload->>'type';

  -- Only process subscription events
  IF event_type NOT LIKE 'customer.subscription.%' THEN
    RETURN;
  END IF;

  -- Extract subscription data
  customer_id := payload->'data'->'object'->>'customer';
  subscription_id := payload->'data'->'object'->>'id';
  subscription_status := payload->'data'->'object'->>'status';
  cancel_at_period_end := (payload->'data'->'object'->>'cancel_at_period_end')::BOOLEAN;

  -- Extract timestamps (Stripe sends Unix timestamps)
  period_start := to_timestamp((payload->'data'->'object'->>'current_period_start')::BIGINT);
  period_end := to_timestamp((payload->'data'->'object'->>'current_period_end')::BIGINT);

  -- Extract canceled_at if present
  IF payload->'data'->'object'->>'canceled_at' IS NOT NULL THEN
    canceled_at := to_timestamp((payload->'data'->'object'->>'canceled_at')::BIGINT);
  END IF;

  -- Determine tier based on subscription status
  IF subscription_status IN ('active', 'trialing') THEN
    new_tier := 'pro';
  ELSE
    new_tier := 'free';
  END IF;

  -- Update user record
  UPDATE public.users
  SET
    tier = new_tier,
    stripe_customer_id = customer_id,
    stripe_subscription_id = subscription_id,
    stripe_subscription_status = subscription_status,
    stripe_current_period_start = period_start,
    stripe_current_period_end = period_end,
    stripe_cancel_at_period_end = cancel_at_period_end,
    stripe_canceled_at = canceled_at,
    updated_at = NOW()
  WHERE stripe_customer_id = customer_id;

  -- Log the event for debugging (optional)
  RAISE NOTICE 'Stripe webhook processed: % for customer %', event_type, customer_id;
END;
$$;

-- Grant execute permission to service_role (used by Edge Functions)
GRANT EXECUTE ON FUNCTION handle_stripe_webhook TO service_role;

-- ============================================================================
-- HELPER FUNCTION: Get user billing info for frontend
-- Only returns data if requesting user matches the user_id (security check)
-- ============================================================================

CREATE OR REPLACE FUNCTION get_user_billing_info(user_id_param UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  result JSON;
BEGIN
  -- Security check: Only return data if user is requesting their own info
  IF auth.uid() != user_id_param AND (SELECT auth.jwt() -> 'app_metadata' ->> 'role') != 'admin' THEN
    RAISE EXCEPTION 'Access denied: You can only view your own billing information';
  END IF;

  SELECT json_build_object(
    'tier', tier,
    'stripe_customer_id', stripe_customer_id,
    'subscription_status', stripe_subscription_status,
    'current_period_start', stripe_current_period_start,
    'current_period_end', stripe_current_period_end,
    'cancel_at_period_end', stripe_cancel_at_period_end,
    'canceled_at', stripe_canceled_at,
    'is_active', CASE
      WHEN stripe_subscription_status IN ('active', 'trialing') THEN true
      ELSE false
    END,
    'days_until_renewal', CASE
      WHEN stripe_current_period_end IS NOT NULL THEN
        EXTRACT(DAY FROM stripe_current_period_end - NOW())::INTEGER
      ELSE NULL
    END
  )
  INTO result
  FROM public.users
  WHERE id = user_id_param;

  RETURN result;
END;
$$;

-- Grant execute to authenticated users (they can only see their own info)
GRANT EXECUTE ON FUNCTION get_user_billing_info TO authenticated;

-- ============================================================================
-- RLS POLICY: Users can view their own subscription info
-- ============================================================================

-- Already handled in users table RLS, but add comment for clarity
COMMENT ON COLUMN users.stripe_customer_id IS 'Stripe customer ID for billing';
COMMENT ON COLUMN users.stripe_subscription_status IS 'Current Stripe subscription status: active, canceled, past_due, trialing, incomplete, incomplete_expired, unpaid';
COMMENT ON COLUMN users.stripe_cancel_at_period_end IS 'Whether subscription will cancel at end of current period';

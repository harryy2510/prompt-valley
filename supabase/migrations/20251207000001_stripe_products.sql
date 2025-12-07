-- ============================================================================
-- STRIPE PRODUCTS TABLE
-- Synced from Stripe via webhook to display pricing, marketing features
-- ============================================================================

-- Enum for product/price status
CREATE TYPE stripe_status AS ENUM ('active', 'inactive', 'archived');

-- Enum for billing interval
CREATE TYPE billing_interval AS ENUM ('day', 'week', 'month', 'year');

-- Enum for coupon duration
CREATE TYPE coupon_duration AS ENUM ('once', 'repeating', 'forever');

-- ============================================================================
-- STRIPE PRODUCTS
-- ============================================================================

CREATE TABLE stripe_products (
  id TEXT PRIMARY KEY, -- Stripe product ID (prod_xxx)
  name TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  -- Marketing metadata from Stripe product metadata
  features TEXT[] DEFAULT '{}', -- Feature bullet points for pricing cards
  highlight TEXT, -- Highlighted text (e.g., "Most Popular")
  display_order INTEGER DEFAULT 0, -- Order for display on pricing page
  -- Status
  active BOOLEAN NOT NULL DEFAULT true,
  -- Stripe metadata
  metadata JSONB DEFAULT '{}',
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for active products
CREATE INDEX idx_stripe_products_active ON stripe_products(active) WHERE active = true;
CREATE INDEX idx_stripe_products_display_order ON stripe_products(display_order);

-- Trigger for updated_at
CREATE TRIGGER set_updated_at_stripe_products
  BEFORE UPDATE ON stripe_products
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- STRIPE PRICES
-- Products can have multiple prices (monthly, yearly, etc.)
-- ============================================================================

CREATE TABLE stripe_prices (
  id TEXT PRIMARY KEY, -- Stripe price ID (price_xxx)
  product_id TEXT NOT NULL REFERENCES stripe_products(id) ON DELETE CASCADE,
  -- Pricing
  unit_amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  -- Billing
  recurring_interval billing_interval, -- null for one-time prices
  recurring_interval_count INTEGER DEFAULT 1, -- e.g., every 3 months
  -- Status
  active BOOLEAN NOT NULL DEFAULT true,
  -- Display
  nickname TEXT, -- Display name (e.g., "Monthly", "Yearly")
  -- Stripe metadata
  metadata JSONB DEFAULT '{}',
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_stripe_prices_product_id ON stripe_prices(product_id);
CREATE INDEX idx_stripe_prices_active ON stripe_prices(active) WHERE active = true;

-- Trigger for updated_at
CREATE TRIGGER set_updated_at_stripe_prices
  BEFORE UPDATE ON stripe_prices
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- STRIPE COUPONS
-- Discount codes synced from Stripe
-- ============================================================================

CREATE TABLE stripe_coupons (
  id TEXT PRIMARY KEY, -- Stripe coupon ID (can be custom code or auto-generated)
  name TEXT, -- Display name
  -- Discount
  amount_off INTEGER, -- Fixed amount discount in cents (mutually exclusive with percent_off)
  percent_off NUMERIC(5, 2), -- Percentage discount (mutually exclusive with amount_off)
  currency TEXT, -- Required if amount_off is set
  -- Restrictions
  duration coupon_duration NOT NULL DEFAULT 'once',
  duration_in_months INTEGER, -- Only for 'repeating' duration
  max_redemptions INTEGER, -- Max total uses
  redeem_by TIMESTAMPTZ, -- Expiration date
  -- Applies to specific products (empty = all products)
  applies_to_products TEXT[] DEFAULT '{}',
  -- Status
  valid BOOLEAN NOT NULL DEFAULT true,
  times_redeemed INTEGER NOT NULL DEFAULT 0,
  -- Stripe metadata
  metadata JSONB DEFAULT '{}',
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_stripe_coupons_valid ON stripe_coupons(valid) WHERE valid = true;
CREATE INDEX idx_stripe_coupons_redeem_by ON stripe_coupons(redeem_by) WHERE redeem_by IS NOT NULL;

-- Trigger for updated_at
CREATE TRIGGER set_updated_at_stripe_coupons
  BEFORE UPDATE ON stripe_coupons
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- STRIPE PROMOTION CODES
-- User-facing codes that reference coupons
-- ============================================================================

CREATE TABLE stripe_promotion_codes (
  id TEXT PRIMARY KEY, -- Stripe promotion code ID (promo_xxx)
  code TEXT NOT NULL UNIQUE, -- The actual code users enter
  coupon_id TEXT NOT NULL REFERENCES stripe_coupons(id) ON DELETE CASCADE,
  -- Restrictions
  active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  max_redemptions INTEGER,
  times_redeemed INTEGER NOT NULL DEFAULT 0,
  -- Customer restrictions
  first_time_transaction BOOLEAN DEFAULT false,
  minimum_amount INTEGER, -- Minimum order amount in cents
  minimum_amount_currency TEXT,
  -- Stripe metadata
  metadata JSONB DEFAULT '{}',
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_stripe_promotion_codes_code ON stripe_promotion_codes(code);
CREATE INDEX idx_stripe_promotion_codes_coupon_id ON stripe_promotion_codes(coupon_id);
CREATE INDEX idx_stripe_promotion_codes_active ON stripe_promotion_codes(active) WHERE active = true;

-- Trigger for updated_at
CREATE TRIGGER set_updated_at_stripe_promotion_codes
  BEFORE UPDATE ON stripe_promotion_codes
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- RLS POLICIES
-- Products, prices, and active coupons are publicly readable for pricing page
-- ============================================================================

ALTER TABLE stripe_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_promotion_codes ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can read active products
CREATE POLICY "Anyone can view active products"
  ON stripe_products FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Admins can manage products
CREATE POLICY "Admins can manage products"
  ON stripe_products FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Prices: Anyone can read active prices
CREATE POLICY "Anyone can view active prices"
  ON stripe_prices FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Admins can manage prices
CREATE POLICY "Admins can manage prices"
  ON stripe_prices FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Coupons: Only valid coupons are publicly readable
CREATE POLICY "Anyone can view valid coupons"
  ON stripe_coupons FOR SELECT
  TO anon, authenticated
  USING (valid = true);

-- Admins can manage coupons
CREATE POLICY "Admins can manage coupons"
  ON stripe_coupons FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Promotion codes: Only active codes are publicly readable
CREATE POLICY "Anyone can view active promotion codes"
  ON stripe_promotion_codes FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Admins can manage promotion codes
CREATE POLICY "Admins can manage promotion codes"
  ON stripe_promotion_codes FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT SELECT ON stripe_products TO anon, authenticated;
GRANT ALL ON stripe_products TO service_role;

GRANT SELECT ON stripe_prices TO anon, authenticated;
GRANT ALL ON stripe_prices TO service_role;

GRANT SELECT ON stripe_coupons TO anon, authenticated;
GRANT ALL ON stripe_coupons TO service_role;

GRANT SELECT ON stripe_promotion_codes TO anon, authenticated;
GRANT ALL ON stripe_promotion_codes TO service_role;

-- ============================================================================
-- HELPER VIEW: Products with prices (for pricing page)
-- ============================================================================

CREATE VIEW stripe_products_with_prices AS
SELECT
  p.id,
  p.name,
  p.description,
  p.images,
  p.features,
  p.highlight,
  p.display_order,
  p.active,
  p.metadata,
  COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', pr.id,
        'unit_amount', pr.unit_amount,
        'currency', pr.currency,
        'interval', pr.recurring_interval,
        'interval_count', pr.recurring_interval_count,
        'nickname', pr.nickname
      ) ORDER BY pr.unit_amount ASC
    ) FILTER (WHERE pr.id IS NOT NULL AND pr.active = true),
    '[]'::jsonb
  ) AS prices
FROM stripe_products p
LEFT JOIN stripe_prices pr ON pr.product_id = p.id AND pr.active = true
WHERE p.active = true
GROUP BY p.id
ORDER BY p.display_order ASC;

-- Grant access to view
GRANT SELECT ON stripe_products_with_prices TO anon, authenticated;

COMMENT ON VIEW stripe_products_with_prices IS 'Products with their active prices for pricing page display';

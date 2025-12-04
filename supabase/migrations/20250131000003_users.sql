-- ============================================================================
-- USERS TABLE
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  tier tier NOT NULL DEFAULT 'free',
  role user_role NOT NULL DEFAULT 'user',
  -- Stripe subscription fields
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  stripe_subscription_status TEXT, -- 'active', 'canceled', 'past_due', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid'
  stripe_current_period_start TIMESTAMPTZ,
  stripe_current_period_end TIMESTAMPTZ,
  stripe_cancel_at_period_end BOOLEAN DEFAULT false,
  stripe_canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX idx_users_stripe_subscription_status ON users(stripe_subscription_status);

-- Trigger for updated_at
CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Auto-sync from auth.users
CREATE OR REPLACE FUNCTION sync_auth_user_to_public()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'avatar_url',
    'user'  -- Default role for new users
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    updated_at = NOW();

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sync_auth_users_to_public
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_auth_user_to_public();

-- ============================================================================
-- SYNC ROLE TO JWT CLAIMS
-- ============================================================================
-- When role changes in public.users, sync it to auth.users.raw_app_meta_data
-- so it appears in JWT claims for RLS policies

CREATE OR REPLACE FUNCTION sync_user_role_to_jwt()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Update auth.users app_metadata with the role
  UPDATE auth.users
  SET raw_app_meta_data =
    COALESCE(raw_app_meta_data, '{}'::jsonb) ||
    jsonb_build_object('role', NEW.role::text)
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sync_user_role_to_jwt
  AFTER INSERT OR UPDATE OF role ON users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_role_to_jwt();

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own full profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid()) OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete users"
  ON users FOR DELETE
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ============================================================================
-- PUBLIC USER PROFILES VIEW
-- Only exposes safe, non-sensitive fields for public viewing
-- ============================================================================

CREATE VIEW user_profiles AS
SELECT
  id,
  email,
  name,
  avatar_url,
  tier,  -- Show tier badge (free/pro) but not billing details
  created_at
FROM users;

-- RLS for public profiles view
ALTER VIEW user_profiles SET (security_invoker = on);

COMMENT ON VIEW user_profiles IS 'Public user profiles - safe to expose without revealing billing details';

-- Grants
GRANT SELECT ON TABLE users TO authenticated;
GRANT UPDATE ON TABLE users TO authenticated;
GRANT ALL ON TABLE users TO service_role;
GRANT SELECT ON user_profiles TO anon, authenticated;

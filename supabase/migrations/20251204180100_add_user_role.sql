-- ============================================================================
-- ADD USER ROLE SYSTEM
-- ============================================================================
-- This migration adds a role column to users and syncs it to JWT claims

-- Create user_role enum
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Add role column to users table
ALTER TABLE users
ADD COLUMN role user_role NOT NULL DEFAULT 'user';

-- Create index for role lookups
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- SYNC ROLE FROM public.users TO auth.users (for JWT claims)
-- ============================================================================

-- Function to set user role in JWT claims (app_metadata)
-- This syncs the role from public.users to auth.users app_metadata
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

-- Trigger to sync role changes to JWT
-- Fires on INSERT (new users) and UPDATE (role changes)
CREATE TRIGGER trg_sync_user_role_to_jwt
  AFTER INSERT OR UPDATE OF role ON users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_role_to_jwt();

-- ============================================================================
-- UPDATE EXISTING sync_auth_user_to_public TO INCLUDE ROLE
-- ============================================================================

-- Drop the existing function and its trigger
DROP TRIGGER IF EXISTS trg_sync_auth_users_to_public ON auth.users;
DROP FUNCTION IF EXISTS sync_auth_user_to_public();

-- Recreate the function with role support
CREATE OR REPLACE FUNCTION sync_auth_user_to_public()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_user_role text;
BEGIN
  -- Insert or update public.users
  INSERT INTO public.users (id, email, name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_app_meta_data->>'role')::user_role, 'user')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    updated_at = NOW()
  RETURNING role INTO new_user_role;

  -- Sync role back to auth.users if it's not already set
  IF NEW.raw_app_meta_data->>'role' IS NULL THEN
    UPDATE auth.users
    SET raw_app_meta_data =
      COALESCE(raw_app_meta_data, '{}'::jsonb) ||
      jsonb_build_object('role', COALESCE(new_user_role::text, 'user'))
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER trg_sync_auth_users_to_public
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_auth_user_to_public();

-- Add comment
COMMENT ON COLUMN users.role IS 'User role: user (default) or admin. Automatically synced to JWT claims for RLS policies.';

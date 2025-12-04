-- ============================================================================
-- MAKE USER ADMIN
-- ============================================================================
-- Instructions:
-- 1. Replace 'user@example.com' with the actual user's email
-- 2. Run this in Supabase SQL Editor or via CLI
-- 3. User must log out and log back in for JWT to refresh with new role
-- ============================================================================

-- Option 1: Make user admin by email
UPDATE users
SET role = 'admin'
WHERE email = 'user@example.com';

-- Option 2: Make user admin by user ID
-- UPDATE users
-- SET role = 'admin'
-- WHERE id = 'user-uuid-here';

-- Option 3: Make the first user admin (useful for initial setup)
-- UPDATE users
-- SET role = 'admin'
-- WHERE id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1);

-- ============================================================================
-- VERIFY THE CHANGE
-- ============================================================================

-- Check role in public.users table
SELECT id, email, name, role, created_at
FROM users
WHERE role = 'admin';

-- Check role in JWT (auth.users.raw_app_meta_data)
-- This is what RLS policies actually check
SELECT
  id,
  email,
  raw_app_meta_data->>'role' as jwt_role,
  created_at
FROM auth.users
WHERE raw_app_meta_data->>'role' = 'admin';

-- ============================================================================
-- REVOKE ADMIN (if needed)
-- ============================================================================
-- UPDATE users
-- SET role = 'user'
-- WHERE email = 'user@example.com';

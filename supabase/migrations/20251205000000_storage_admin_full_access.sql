-- ============================================================================
-- STORAGE ADMIN FULL ACCESS POLICIES
-- ============================================================================
-- Admins have full access to all buckets and objects

-- ============================================================================
-- BUCKET POLICIES (storage.buckets)
-- ============================================================================

-- Allow admins to list and manage all buckets
CREATE POLICY "Admins can list buckets"
ON storage.buckets FOR SELECT
USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can create buckets"
ON storage.buckets FOR INSERT
WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update buckets"
ON storage.buckets FOR UPDATE
USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete buckets"
ON storage.buckets FOR DELETE
USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ============================================================================
-- OBJECT POLICIES (storage.objects) - ADMIN FULL ACCESS TO ALL BUCKETS
-- ============================================================================

-- Drop the content-bucket specific admin policies (replaced by full access)
DROP POLICY IF EXISTS "Admins can upload to content-bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update content-bucket files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete from content-bucket" ON storage.objects;

-- Admins have full access to ALL buckets
CREATE POLICY "Admins have full access to all objects"
ON storage.objects FOR ALL
USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Storage policies for content-bucket
-- Note: Bucket already exists from Supabase dashboard
-- Uses JWT-based role checking for consistency with other policies

-- Allow public read access to all files
CREATE POLICY "Public read access for content-bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'content-bucket');

-- Allow admins to upload (checks JWT claims)
CREATE POLICY "Admins can upload to content-bucket"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'content-bucket'
  AND (SELECT auth.jwt() ->> 'role') = 'admin'
);

-- Allow service role full access (for backend operations)
CREATE POLICY "Service role full access to content-bucket"
ON storage.objects FOR ALL
USING (
  bucket_id = 'content-bucket'
  AND (SELECT auth.jwt() ->> 'role') = 'service_role'
);

-- Allow admins to update files
CREATE POLICY "Admins can update content-bucket files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'content-bucket'
  AND (SELECT auth.jwt() ->> 'role') = 'admin'
);

-- Allow admins to delete files
CREATE POLICY "Admins can delete from content-bucket"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'content-bucket'
  AND (SELECT auth.jwt() ->> 'role') = 'admin'
);

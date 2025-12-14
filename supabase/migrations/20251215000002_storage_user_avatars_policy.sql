-- Storage policies for user avatars in content-bucket
-- Allows authenticated users to manage their own avatars
-- Public read already exists from previous migration

-- Allow authenticated users to upload their own avatar
-- Path pattern: avatars/{user_id}/*
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'content-bucket'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Allow authenticated users to update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'content-bucket'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Allow authenticated users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'content-bucket'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Future-proofing notes:
-- 1. Public read access already exists (users can see each other's avatars in comments, profiles)
-- 2. Path structure: avatars/{user_id}/{filename} ensures users only access their own folder
-- 3. For community features (comments, posts), users would upload to different folders:
--    - comments/{comment_id}/* or user-content/{user_id}/comments/*
--    - Just add similar policies for those paths when needed

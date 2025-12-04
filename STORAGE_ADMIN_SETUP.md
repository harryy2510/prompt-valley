# Storage Admin Setup Guide

## Overview

This guide explains how to set up admin permissions for the `content-bucket` storage bucket and how to grant admin access to users.

## What Was Added

### 1. User Role System (JWT-Based)
- Added `user_role` enum with values: `user`, `admin`
- Added `role` column to `users` table (defaults to `user`)
- Created `sync_user_role_to_jwt()` function to automatically sync role to JWT claims
- Role is stored in both `public.users` table AND `auth.users.raw_app_meta_data` for JWT access
- RLS policies check `auth.jwt() ->> 'role'` for efficient, consistent authorization

### 2. Storage Policies (JWT-Based)
Created policies for `content-bucket`:
- **Public Read**: Anyone can view/download files
- **Admin Upload**: Only admins can upload files (checks JWT)
- **Admin Update**: Only admins can update files (checks JWT)
- **Admin Delete**: Only admins can delete files (checks JWT)
- **Service Role**: Full access for backend operations

**Why JWT-based?** Using JWT claims (`auth.jwt() ->> 'role'`) is more efficient than database lookups and consistent with your existing RLS policies.

## How to Apply Migrations

### Local Development
```bash
# Reset database and apply all migrations
supabase db reset
```

### Production
```bash
# Push migrations to production
supabase db push
```

Or run the SQL files directly in your Supabase SQL Editor:
1. `/supabase/migrations/20251204180100_add_user_role.sql` (run first)
2. `/supabase/migrations/20251204180000_storage_content_bucket_policies.sql`

## How to Make a User Admin

### Method 1: Via SQL Editor (Recommended)
1. Open Supabase Dashboard → SQL Editor
2. Use the provided script: `/supabase/scripts/make_user_admin.sql`
3. Replace `'user@example.com'` with the actual user's email
4. Run the query:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'user@example.com';

-- Verify (check both database and JWT)
SELECT id, email, name, role FROM users WHERE role = 'admin';

-- Verify role is in JWT (check auth.users)
SELECT id, email, raw_app_meta_data->>'role' as jwt_role
FROM auth.users
WHERE email = 'user@example.com';
```

**Important:** The trigger automatically syncs the role to JWT, but the user will need to **log out and log back in** for the JWT to refresh with the new role.

### Method 2: Via Supabase CLI
```bash
supabase db execute "UPDATE users SET role = 'admin' WHERE email = 'user@example.com';"
```

### Method 3: Make First User Admin (Initial Setup)
```sql
UPDATE users
SET role = 'admin'
WHERE id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1);
```

## Testing Upload Permissions

After setting up an admin user:

1. **Log in as admin** to your app
2. **Try uploading** to the content-bucket
3. **Check permissions** work correctly

### Example Upload Code (React)
```typescript
import { supabase } from '@/lib/supabase'

async function uploadFile(file: File) {
  const { data, error } = await supabase.storage
    .from('content-bucket')
    .upload(`uploads/${file.name}`, file)

  if (error) {
    console.error('Upload failed:', error)
    return null
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('content-bucket')
    .getPublicUrl(data.path)

  return publicUrl
}
```

## Checking Your Role

### In Your App (JWT Method - Recommended)
```typescript
import { supabase } from '@/lib/supabase'

async function getCurrentUserRole() {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) return null

  // Get role directly from JWT claims (no database query needed!)
  const role = session.user.app_metadata?.role || 'user'
  return role // 'user' or 'admin'
}

// Or check if user is admin
function isAdmin() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user?.app_metadata?.role === 'admin'
}
```

### In Your App (Database Method - Alternative)
```typescript
async function getCurrentUserRole() {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  return data?.role // 'user' or 'admin'
}
```

### Via SQL
```sql
-- Check your own role (run while authenticated)
SELECT email, role FROM users WHERE id = auth.uid();

-- List all admins
SELECT id, email, name, role, created_at
FROM users
WHERE role = 'admin';
```

## Troubleshooting

### Can't Upload as Admin?
1. **Verify role in database:** `SELECT role FROM users WHERE email = 'your@email.com'`
2. **Verify role in JWT:** `SELECT raw_app_meta_data->>'role' FROM auth.users WHERE email = 'your@email.com'`
3. **Log out and log back in** - JWT tokens don't update until re-authentication
4. Check RLS is enabled on storage.objects
5. Verify policies exist: Check Supabase Dashboard → Storage → Policies
6. Check browser console for specific error messages
7. **Debug in app:** Log `session.user.app_metadata.role` to confirm JWT has correct role

### Regular Users Can't View Files?
- The "Public read access" policy allows anyone to view files
- If this doesn't work, check bucket settings in dashboard (should be public)

### Need to Revoke Admin Access?
```sql
UPDATE users
SET role = 'user'
WHERE email = 'user@example.com';
```

## Security Notes

- Admin users have full upload/update/delete permissions on the content-bucket
- Regular users can only view files (public read access)
- Service role has full access for backend operations
- All operations are logged in Supabase logs

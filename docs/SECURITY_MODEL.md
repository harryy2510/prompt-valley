# Security Model - User Data & Billing Privacy

## Overview

This document explains how user data is protected and what information is public vs. private.

## Two-Tier Access Model

### 1. Private Data (Own Account Only)

**Table:** `users` (full access)

Users can ONLY see their own full record including sensitive billing info:

```sql
SELECT * FROM users WHERE id = auth.uid();
```

**Fields exposed:**
- ✅ id, email, name, avatar_url, tier
- ✅ stripe_customer_id
- ✅ stripe_subscription_id
- ✅ stripe_subscription_status
- ✅ stripe_current_period_start
- ✅ stripe_current_period_end
- ✅ stripe_cancel_at_period_end
- ✅ stripe_canceled_at
- ✅ created_at, updated_at

**RLS Policy:**
```sql
CREATE POLICY "Users can view their own full profile"
  ON users FOR SELECT
  USING (id = auth.uid() OR auth.jwt()->>'role' = 'admin');
```

### 2. Public Data (Anyone Can View)

**View:** `user_profiles` (public-safe subset)

Anyone (including anonymous users) can view public profiles:

```sql
SELECT * FROM user_profiles WHERE id = 'some-user-id';
```

**Fields exposed:**
- ✅ id, name, avatar_url, tier, created_at
- ❌ email (can be public, but optional - up to you)
- ❌ All Stripe fields (completely hidden)

**What's hidden:**
- stripe_customer_id
- stripe_subscription_id
- stripe_subscription_status
- stripe_current_period_start
- stripe_current_period_end
- stripe_cancel_at_period_end
- stripe_canceled_at

## Usage in Your App

### For Public User Profiles

Use `user_profiles` view to display user cards, author info, etc.:

```typescript
// ✅ Safe for public display
const { data: profile } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', userId)
  .single()

// Returns:
// {
//   id: 'xxx',
//   name: 'John Doe',
//   avatar_url: 'https://...',
//   tier: 'pro',  // Shows badge, but not billing details
//   created_at: '2025-01-01T...'
// }
```

### For Private Billing Page

Use `users` table or `get_user_billing_info()` function:

```typescript
// ✅ Only works for logged-in user viewing their own data
const { data: billingInfo } = await supabase.rpc('get_user_billing_info', {
  user_id_param: currentUser.id
})

// Returns full billing details including:
// - subscription_status
// - current_period_end
// - cancel_at_period_end
// etc.
```

### For Prompt Authors

When showing who created a prompt:

```typescript
// ✅ Use user_profiles view
const { data: prompts } = await supabase
  .from('prompts')
  .select(`
    *,
    author:user_profiles!created_by (
      id,
      name,
      avatar_url,
      tier
    )
  `)
```

This shows the prompt author's public info without exposing their billing details.

## Example Scenarios

### Scenario 1: User Profile Page

**URL:** `/users/john-doe`

**What's visible to everyone:**
```typescript
// Anyone can see this
{
  name: "John Doe",
  avatar_url: "https://...",
  tier: "pro",  // Shows "PRO" badge
  created_at: "2025-01-01",
  prompts_created: 15
}
```

**What's hidden:**
- Stripe customer ID
- Subscription status details
- Renewal date
- Payment method
- Billing history

### Scenario 2: Own Billing Page

**URL:** `/billing` (must be logged in)

**What user sees about their OWN account:**
```typescript
// Only visible to the user themselves
{
  tier: "pro",
  subscription_status: "active",
  current_period_end: "2025-02-15",
  cancel_at_period_end: false,
  days_until_renewal: 12,
  // ... all billing details
}
```

### Scenario 3: Someone Tries to Snoop

**Attempt:** Malicious user tries to query another user's billing info

```typescript
// ❌ This will fail - RLS blocks it
const { data } = await supabase
  .from('users')
  .select('stripe_customer_id, stripe_subscription_status')
  .eq('id', 'victim-user-id')

// Returns: 0 rows (RLS policy prevents access)
```

## API Security

### Frontend Queries

**Public Profile (Safe):**
```typescript
// ✅ Anyone can do this
await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', userId)
```

**Own Billing Info (Protected):**
```typescript
// ✅ Only works if requesting your own data
const { data: { user } } = await supabase.auth.getUser()

await supabase.rpc('get_user_billing_info', {
  user_id_param: user.id
})
```

**Someone Else's Billing Info (Blocked):**
```typescript
// ❌ This will return error or null
await supabase.rpc('get_user_billing_info', {
  user_id_param: 'another-user-id'
})
```

### Backend/Admin Access

Only `service_role` key can bypass RLS:

```typescript
// Only works with service_role key (backend only)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // Never expose to frontend!
)

// Can access all users' data
const { data } = await supabaseAdmin
  .from('users')
  .select('*')
```

## Should Email Be Public?

You have options:

### Option A: Keep Email Private (Recommended)
```sql
-- Remove email from user_profiles view
CREATE VIEW user_profiles AS
SELECT
  id,
  name,
  avatar_url,
  tier,
  created_at
FROM users;
```

### Option B: Make Email Public
```sql
-- Keep email in user_profiles view
CREATE VIEW user_profiles AS
SELECT
  id,
  email,  -- ✅ Public
  name,
  avatar_url,
  tier,
  created_at
FROM users;
```

**Current setup:** Email is included in `user_profiles`. Remove it if you want it private.

## Tier Badge Display

The `tier` field (free/pro) is **intentionally public** because:

1. **Social Proof:** Shows which users support the platform
2. **Trust Signal:** Pro users may be seen as more serious/committed
3. **No Financial Details:** Doesn't reveal payment info, just subscription level
4. **Common Pattern:** Similar to GitHub Pro, Twitter Blue, etc.

If you want to hide tier from public profiles, remove it from the view:

```sql
CREATE VIEW user_profiles AS
SELECT
  id,
  email,
  name,
  avatar_url,
  -- tier removed
  created_at
FROM users;
```

## Admin Access

Admins (users with `role = 'admin'` in JWT) can see everything:

```sql
CREATE POLICY "Users can view their own full profile"
  ON users FOR SELECT
  USING (id = auth.uid() OR auth.jwt()->>'role' = 'admin');
  --                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  --                       Admins bypass restriction
```

## Testing Security

### Test 1: Can't See Others' Billing Info
```typescript
// Login as User A
const { data } = await supabase
  .from('users')
  .select('stripe_subscription_status')
  .eq('id', 'user-b-id')

console.log(data) // Should be: []
```

### Test 2: Can See Own Billing Info
```typescript
// Login as User A
const { data } = await supabase
  .from('users')
  .select('stripe_subscription_status')
  .eq('id', 'user-a-id')  // Own ID

console.log(data) // Should return data
```

### Test 3: Can See Others' Public Profiles
```typescript
// Anyone (even anon)
const { data } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', 'user-b-id')

console.log(data) // Should return: { name, avatar, tier, etc. }
```

## Summary

| Data Type | Table/View | Visible To | Fields |
|-----------|------------|------------|--------|
| Full Profile | `users` | Self + Admins | All fields including Stripe |
| Public Profile | `user_profiles` | Everyone | Name, avatar, tier, created_at |
| Billing Info | `get_user_billing_info()` | Self only | All Stripe subscription details |

**Key Principle:** Sensitive billing data never leaves the `users` table and is only accessible to the user themselves (or admins).

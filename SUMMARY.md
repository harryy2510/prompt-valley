# PromptValley Database Setup - Complete Summary

## What We Built

A complete database schema for a prompt management SaaS with:
- ✅ User authentication & profiles
- ✅ Prompt library with categories, tags, and models
- ✅ Many-to-many relationships for tags and compatible models
- ✅ Tier-based access control (free vs pro prompts)
- ✅ Stripe subscription integration
- ✅ Row-level security (RLS) for all tables
- ✅ Auto-slug generation from names
- ✅ Separate public/private user data views

## Database Schema

### Core Tables

1. **users** - User accounts with Stripe subscription data
2. **ai_providers** - AI providers (OpenAI, Google)
3. **ai_models** - AI models (ChatGPT, Gemini)
4. **categories** - Hierarchical categories (Writing → LinkedIn Post)
5. **tags** - Tags for organizing prompts
6. **prompts** - The actual prompt content with tier restrictions
7. **prompt_tags** - Many-to-many: prompts ↔ tags
8. **prompt_models** - Many-to-many: prompts ↔ compatible models
9. **user_favorites** - User saved prompts

### Views

1. **user_profiles** - Public-safe user data (hides billing info)
2. **prompts_with_access** - Prompts with tier-based content masking

## Key Features

### 1. Slug-Based Primary Keys

All main tables use TEXT slugs as primary keys instead of UUIDs:

```sql
-- ✅ Clean URLs
/prompts/linkedin-about-generator
/categories/linkedin-post
/tags/beginner-friendly

-- ❌ Instead of ugly UUIDs
/prompts/a3f8e4c2-9b1d-4a5e-8c3f-2d1e9a7b6c5d
```

**Auto-generation:** If you don't provide an `id`, it's generated from the `name`/`title`:
```sql
INSERT INTO tags (name) VALUES ('Beginner Friendly');
-- Auto-generates: id='beginner-friendly'
```

### 2. Tier-Based Content Access

**Free users:**
- Can see ALL prompts (title, description, tier badge)
- Can only view content of free-tier prompts
- Pro prompt content shows as NULL

**Pro users:**
- Can see ALL prompts
- Can view content of both free AND pro prompts

**Implementation:**
```typescript
// Use this view - content is automatically masked
SELECT * FROM prompts_with_access;

// Free user sees:
{ title: "Pro Prompt", content: null, tier: "pro" }

// Pro user sees:
{ title: "Pro Prompt", content: "full content...", tier: "pro" }
```

### 3. Stripe Integration (Minimal Setup)

**What you manage:**
- ONE webhook handler
- Two API routes (checkout + portal)
- Billing page showing subscription details

**What Stripe manages:**
- Payment processing
- Subscription management UI
- Card updates
- Cancellation flow
- Invoice generation

**What gets synced to your DB:**
```sql
tier                            -- 'free' or 'pro' (for RLS)
stripe_customer_id              -- Stripe customer ID
stripe_subscription_id          -- Subscription ID
stripe_subscription_status      -- 'active', 'canceled', etc.
stripe_current_period_end       -- Renewal date
stripe_cancel_at_period_end     -- Canceling at period end?
stripe_canceled_at              -- When canceled
```

### 4. Security & Privacy

**Public data (user_profiles view):**
- Name, avatar, tier badge
- NO billing details
- NO Stripe IDs
- NO subscription status

**Private data (users table):**
- Only accessible to the user themselves
- Contains all Stripe subscription details
- Protected by RLS

**Access control:**
```typescript
// ✅ Anyone can see public profile
await supabase.from('user_profiles').select('*')

// ❌ Only user can see their own billing
await supabase.from('users').select('stripe_*')
```

## File Structure

```
supabase/
├── migrations/
│   ├── 20250131000001_utilities.sql           # Helper functions
│   ├── 20250131000002_enums.sql               # Tier, capabilities enums
│   ├── 20250131000003_users.sql               # Users + Stripe fields
│   ├── 20250131000004_ai_providers.sql        # OpenAI, Google
│   ├── 20250131000005_ai_models.sql           # ChatGPT, Gemini
│   ├── 20250131000006_categories.sql          # Hierarchical categories
│   ├── 20250131000007_tags.sql                # Prompt tags
│   ├── 20250131000008_prompts.sql             # Prompts + tier access
│   ├── 20250131000009_prompt_tags.sql         # Many-to-many junction
│   ├── 20250131000010_prompt_models.sql       # Many-to-many junction
│   ├── 20250131000011_user_favorites.sql      # Saved prompts
│   └── 20250131000012_stripe_webhook.sql      # Webhook handler
├── functions/
│   └── stripe-webhook/
│       └── index.ts                            # Edge function
└── seed.sql                                    # Sample data

examples/
├── billing-page-example.tsx                    # Frontend billing page
└── api-routes-example.ts                       # Backend API routes

docs/
├── STRIPE_SETUP.md                             # Stripe integration guide
├── SECURITY_MODEL.md                           # Privacy & security
└── SUMMARY.md                                  # This file
```

## Seed Data

Includes:
- 2 AI Providers (OpenAI, Google)
- 2 AI Models (ChatGPT, Gemini)
- 2 Root Categories (Writing, Image Generation)
- 16 Subcategories
- 16 Tags
- 11 Sample Prompts (mix of free & pro)

## Next Steps

### 1. Database Setup
```bash
cd supabase
supabase db reset
```

### 2. Stripe Setup
See `STRIPE_SETUP.md` for complete guide:
- Deploy edge function
- Configure webhook in Stripe
- Set environment variables
- Add API routes to your app

### 3. Frontend Integration

**For public prompts list:**
```typescript
const { data } = await supabase
  .from('prompts_with_access')
  .select(`
    *,
    category:categories(id, name),
    tags:prompt_tags(tag:tags(*))
  `)
  .eq('is_published', true)
```

**For billing page:**
```typescript
const { data } = await supabase.rpc('get_user_billing_info', {
  user_id_param: user.id
})
```

**For user profiles:**
```typescript
const { data } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', userId)
```

## Key Decisions Made

| Decision | Rationale |
|----------|-----------|
| TEXT slugs as primary keys | SEO-friendly URLs, human-readable |
| Many-to-many for tags/models | Flexible, scalable relationships |
| View for tier-based content | Simple frontend code, secure |
| Separate user_profiles view | Privacy-by-design for public profiles |
| Local tier column | Fast RLS checks vs Stripe API calls |
| Single webhook handler | Minimal infrastructure, easy to maintain |
| Stripe-hosted pages | No payment form to build/maintain |

## Testing Checklist

- [ ] Database migrations run successfully
- [ ] RLS policies work (can't see others' data)
- [ ] Slug auto-generation works
- [ ] Free users can't see pro content
- [ ] Pro users can see all content
- [ ] Public profiles hide billing info
- [ ] Stripe webhook updates user tier
- [ ] Checkout redirects to Stripe
- [ ] Customer Portal works
- [ ] Subscription cancellation syncs

## Common Queries

### Get all prompts with category and tags
```sql
SELECT
  p.*,
  c.name as category_name,
  array_agg(t.name) as tag_names
FROM prompts_with_access p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN prompt_tags pt ON p.id = pt.prompt_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.is_published = true
GROUP BY p.id, c.name;
```

### Get user's subscription status
```sql
SELECT tier, stripe_subscription_status, stripe_current_period_end
FROM users
WHERE id = auth.uid();
```

### Get featured pro prompts
```sql
SELECT * FROM prompts_with_access
WHERE is_featured = true
AND tier = 'pro'
AND is_published = true;
```

## Support & Troubleshooting

**Database issues:**
```bash
# Check migrations
supabase migration list

# Reset database
supabase db reset

# Check RLS policies
supabase db check
```

**Stripe issues:**
- Check webhook logs in Stripe Dashboard
- Check Edge Function logs: `supabase functions logs stripe-webhook`
- Test locally with Stripe CLI

**Access control issues:**
- Verify user is authenticated: `await supabase.auth.getUser()`
- Check RLS policies allow the operation
- Use `prompts_with_access` view for tier-based access
- Use `user_profiles` view for public profiles

## Production Readiness

Before going live:
- [ ] Review all RLS policies
- [ ] Test with real Stripe account (not test mode)
- [ ] Set up monitoring for webhook failures
- [ ] Configure email notifications in Stripe
- [ ] Set up backup schedule for database
- [ ] Add rate limiting to API routes
- [ ] Enable SSL for all connections
- [ ] Review and update privacy policy
- [ ] Test cancellation and refund flows

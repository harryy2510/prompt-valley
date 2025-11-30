# PromptValley Database Migrations

## Overview

The database schema is organized into **7 sequential migrations** that build the complete PromptValley database from scratch. Each migration depends on the previous one to ensure proper order.

## Migration Files

### 1. `20250130000001_create_enums.sql`
**Dependencies:** None
**Purpose:** Create all enum types

**Creates:**
- `access_level` - Prompt access levels (`free`, `pro`)
- `model_capability` - AI model capabilities (`text`, `image`, `video`, `audio`, `code`, `vision`, `multimodal`)
- `subscription_tier` - User subscription tiers (`free`, `pro`, `enterprise`)

**Why First:** Enums must exist before tables that use them.

---

### 2. `20250130000002_create_core_tables.sql`
**Dependencies:** `20250130000001_create_enums.sql`
**Purpose:** Create foundational lookup tables

**Creates:**
- `ai_providers` - AI companies (OpenAI, Anthropic, Google, etc.)
- `ai_models` - Specific AI models with capabilities and pricing
- `categories` - Hierarchical categories (self-referencing)
- `tags` - Flexible tagging system

**Indexes:** 15 indexes for performance
- Provider slugs, active status, sort order
- Model capabilities (GIN index), featured status
- Category hierarchy, slugs
- Tag usage counts, featured status

**Why Second:** These are independent tables with no foreign keys to other application tables (except self-reference in categories).

---

### 3. `20250130000003_create_prompts_tables.sql`
**Dependencies:** `20250130000002_create_core_tables.sql`
**Purpose:** Create prompt content and related tables

**Creates:**
- `prompts` - Main prompt content (references `categories`)
- `prompt_images` - Multiple images per prompt
- `prompt_tags` - Many-to-many junction (prompts ↔ tags)
- `prompt_models` - Many-to-many junction (prompts ↔ ai_models)

**Indexes:** 11 indexes for performance
- Prompt slugs, categories, access levels
- Published/featured filtering
- Image ordering and primary flags
- Junction table relationships

**Why Third:** Requires `categories`, `tags`, and `ai_models` to exist for foreign keys.

---

### 4. `20250130000004_create_user_tables.sql`
**Dependencies:** `20250130000003_create_prompts_tables.sql`
**Purpose:** Create user-related tables

**Creates:**
- `user_favorites` - User saved prompts (references `auth.users`, `prompts`)
- `user_subscriptions` - Stripe subscription management (references `auth.users`)

**Indexes:** 7 indexes for performance
- User lookups
- Prompt favorites
- Subscription tiers and Stripe IDs

**Why Fourth:** Requires `prompts` table to exist. References Supabase's `auth.users`.

---

### 5. `20250130000005_create_triggers_functions.sql`
**Dependencies:** `20250130000004_create_user_tables.sql`
**Purpose:** Create triggers and helper functions

**Creates:**
- **Trigger Function:** `update_updated_at_column()`
  - Applied to: `ai_providers`, `ai_models`, `categories`, `tags`, `prompts`, `user_subscriptions`
  - Auto-updates `updated_at` timestamp on row update

- **Trigger Function:** `update_tag_usage_count()`
  - Applied to: `prompt_tags`
  - Auto-increments/decrements tag usage count

- **Trigger Function:** `update_prompt_saves_count()`
  - Applied to: `user_favorites`
  - Auto-increments/decrements prompt saves count

- **Helper Functions:**
  - `user_has_pro_access(user_uuid)` → BOOLEAN
  - `get_prompt_content(prompt_uuid, user_uuid)` → TABLE (with access control)
  - `increment_prompt_views(prompt_uuid)` → void
  - `increment_prompt_copies(prompt_uuid)` → void

**Why Fifth:** Requires all tables to exist before creating triggers on them.

---

### 6. `20250130000006_create_rls_policies.sql`
**Dependencies:** `20250130000005_create_triggers_functions.sql`
**Purpose:** Enable Row Level Security and create policies

**Creates:**
- Enables RLS on all 10 tables
- Creates 20+ security policies

**Policy Summary:**
- **Public Read (Active Only):** `ai_providers`, `ai_models`, `categories`
- **Public Read (All):** `tags`
- **Public Read (Published):** `prompts`, `prompt_images`, `prompt_tags`, `prompt_models`
- **User-Specific:** `user_favorites`, `user_subscriptions`
- **Admin Write:** All tables (requires `auth.jwt() ->> 'role' = 'admin'`)

**Why Sixth:** RLS should be enabled after all tables and functions exist. Policies reference the `user_has_pro_access()` function.

---

## Seed Data

**File:** `supabase/seed.sql` (not a migration)
**Purpose:** Populate initial data for development/testing

**Inserts:**
- **10 AI Providers:** OpenAI, Anthropic, Google, xAI, Meta, Mistral AI, Midjourney, Stability AI, Ideogram, DALL-E
- **25+ AI Models:**
  - Text: GPT-4 Turbo, GPT-4o, Claude 3.5 Sonnet, Claude 3 Opus, Gemini 2.0 Flash, Grok 2, Llama 3.3, Mistral Large 2
  - Image: Midjourney V6, DALL-E 3, Stable Diffusion 3, SDXL, Ideogram 2.0
- **8 Root Categories:** Writing, Image Generation, Coding, Marketing, Productivity, Analysis, Education, Creative
- **15 Subcategories:** Email Sequences, LinkedIn Posts, Social Media, Blog Posts, Illustrations, Fashion Shoots, Product Photos, etc.
- **35+ Tags:** Beginner Friendly, SEO, Viral, Photorealistic, ChatGPT, Claude, etc.

**Note:** Seed data is automatically run with `supabase db reset`. For production, you'll manage this data via Directus.

---

## Running Migrations

### Fresh Database Setup

```bash
# Reset database (WARNING: Deletes all data)
supabase db reset

# Or run migrations manually
supabase migration up
```

### Check Migration Status

```bash
supabase migration list
```

### Expected Output

```
  20250130000001  create_enums.sql
  20250130000002  create_core_tables.sql
  20250130000003  create_prompts_tables.sql
  20250130000004  create_user_tables.sql
  20250130000005  create_triggers_functions.sql
  20250130000006  create_rls_policies.sql
```

---

## Dependency Graph

```
20250130000001_create_enums.sql
         ↓
20250130000002_create_core_tables.sql
         ↓
20250130000003_create_prompts_tables.sql
         ↓
20250130000004_create_user_tables.sql
         ↓
20250130000005_create_triggers_functions.sql
         ↓
20250130000006_create_rls_policies.sql
         ↓
   supabase/seed.sql (auto-runs with db reset)
```

---

## Migration Rollback

To rollback migrations:

```bash
# Rollback last migration
supabase migration down

# Rollback to specific migration
supabase migration down --to 20250130000003
```

**Note:** Rollback is destructive and will delete data. Always backup before rolling back.

---

## Creating New Migrations

When adding new features:

```bash
# Create new migration
supabase migration new your_feature_name

# Edit the generated file
# File will be: supabase/migrations/YYYYMMDDHHMMSS_your_feature_name.sql
```

**Migration Naming Convention:**
- Use descriptive names: `add_user_profiles`, `update_prompt_schema`
- Use snake_case
- Be specific about what the migration does

---

## Common Issues

### Issue: Migration fails with "relation does not exist"
**Cause:** Migrations running out of order
**Solution:** Check dependencies, ensure migrations run sequentially

### Issue: Constraint violation during seed data
**Cause:** Foreign key references don't exist
**Solution:** Verify previous migrations completed successfully

### Issue: RLS policies blocking queries
**Cause:** User doesn't have required role or subscription
**Solution:** Check `auth.jwt()` claims and `user_subscriptions` table

---

## Verification Queries

After running migrations, verify with these queries:

```sql
-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check providers and models
SELECT
  p.display_name,
  COUNT(m.id) as model_count
FROM ai_providers p
LEFT JOIN ai_models m ON p.id = m.provider_id
GROUP BY p.id, p.display_name
ORDER BY p.sort_order;

-- Check categories hierarchy
SELECT
  c1.name as category,
  c2.name as subcategory
FROM categories c1
LEFT JOIN categories c2 ON c1.id = c2.parent_id
WHERE c1.parent_id IS NULL
ORDER BY c1.sort_order, c2.sort_order;

-- Check tags
SELECT COUNT(*) as tag_count FROM tags;

-- Check RLS enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## Schema Version

**Version:** 2.0
**Date:** 2025-01-30
**Status:** Production Ready

---

## Related Documentation

- [DATABASE.md](../DATABASE.md) - Complete schema documentation
- [Supabase Migrations Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## Migration History

### v2.0 (2025-01-30)
- Complete schema redesign
- Split into 7 modular migrations
- Added AI providers and models system
- Hierarchical categories
- Enhanced access control
- Stripe integration ready

### v1.0 (2025-01-21)
- Initial schema (deprecated)
- Single migration file
- Basic prompt management
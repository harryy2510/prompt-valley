# PromptValley Database Schema Documentation

**Last Updated:** January 30, 2025
**Version:** 2.0 (Complete Redesign)

## Overview

This is a complete redesign of the PromptValley database schema, built from scratch to support:
- Multi-provider AI model management (OpenAI, Anthropic, Google, xAI, etc.)
- Hierarchical category system
- Flexible tagging
- Multiple images per prompt
- Access control (Free vs Pro content)
- Stripe subscription integration
- Directus CMS compatibility

## Table of Contents

1. [Architecture](#architecture)
2. [Tables](#tables)
3. [Relationships](#relationships)
4. [Access Control](#access-control)
5. [Directus Integration](#directus-integration)
6. [Usage Examples](#usage-examples)
7. [Migration Guide](#migration-guide)

---

## Architecture

### Core Entities

```
┌─────────────────┐     ┌──────────────┐     ┌────────────┐
│  AI Providers   │────<│  AI Models   │────<│  Prompts   │
│  (OpenAI, etc)  │     │  (GPT-4, etc)│     │            │
└─────────────────┘     └──────────────┘     └────────────┘
                                                    │
                                    ┌───────────────┼───────────────┐
                                    │               │               │
                             ┌──────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
                             │  Categories │ │    Tags    │ │   Images   │
                             └─────────────┘ └────────────┘ └────────────┘
```

### User Flow

```
User (Free/Pro) → View Prompts → Access Control → Content Protected/Visible
                                       │
                                       └→ user_subscriptions table
```

---

## Tables

### 1. `ai_providers`

Stores AI companies and platforms.

**Fields:**
- `id` (UUID) - Primary key
- `name` (TEXT) - Unique company name (e.g., "OpenAI")
- `display_name` (TEXT) - User-friendly name
- `slug` (TEXT) - URL-friendly identifier
- `logo_url` (TEXT, nullable) - Provider logo
- `website_url` (TEXT, nullable) - Official website
- `description` (TEXT, nullable)
- `is_active` (BOOLEAN) - Show in UI
- `sort_order` (INTEGER) - Display order

**Examples:**
- OpenAI, Anthropic, Google, xAI, Meta, Mistral AI
- Midjourney, Stability AI, Ideogram, DALL-E

### 2. `ai_models`

Specific AI models with capabilities and pricing.

**Fields:**
- `id` (UUID) - Primary key
- `provider_id` (UUID) - FK to ai_providers
- `model_id` (TEXT) - API identifier (e.g., "gpt-4-turbo")
- `model_name` (TEXT) - Human-readable (e.g., "GPT-4 Turbo")
- `model_version` (TEXT, nullable) - Version number
- `slug` (TEXT) - URL-friendly unique identifier
- `capabilities` (model_capability[]) - Array of capabilities
  - `text`, `image`, `video`, `audio`, `code`, `vision`, `multimodal`
- `context_window` (INTEGER, nullable) - Token limit
- `max_output_tokens` (INTEGER, nullable)
- `cost_input_per_million` (DECIMAL, nullable) - Cost per 1M input tokens
- `cost_output_per_million` (DECIMAL, nullable) - Cost per 1M output tokens
- `description` (TEXT, nullable)
- `is_active` (BOOLEAN) - Available for use
- `is_featured` (BOOLEAN) - Show prominently
- `release_date` (DATE, nullable)
- `deprecation_date` (DATE, nullable)
- `sort_order` (INTEGER)

**Examples:**
- Text: GPT-4o, Claude 3.5 Sonnet, Gemini 2.0 Flash
- Image: Midjourney V6, DALL-E 3, Stable Diffusion 3

### 3. `categories`

Hierarchical categories (supports nested categories).

**Fields:**
- `id` (UUID) - Primary key
- `parent_id` (UUID, nullable) - Self-referencing FK for hierarchy
- `name` (TEXT) - Category name
- `slug` (TEXT) - URL-friendly unique identifier
- `description` (TEXT, nullable)
- `icon` (TEXT, nullable) - Emoji or icon name
- `color` (TEXT, nullable) - Hex color code
- `is_active` (BOOLEAN)
- `sort_order` (INTEGER)

**Structure:**
```
Writing (parent)
  ├─ Email Sequences (child)
  ├─ LinkedIn Posts (child)
  ├─ Social Media (child)
  └─ Blog Posts (child)

Image Generation (parent)
  ├─ Illustrations (child)
  ├─ Fashion Shoots (child)
  └─ Product Photos (child)
```

### 4. `tags`

Flexible tagging system.

**Fields:**
- `id` (UUID) - Primary key
- `name` (TEXT) - Unique tag name
- `slug` (TEXT) - URL-friendly unique identifier
- `description` (TEXT, nullable)
- `usage_count` (INTEGER) - Auto-updated count
- `is_featured` (BOOLEAN)

**Auto-Updates:**
- `usage_count` increments/decrements via triggers when tags are added/removed

**Examples:**
- Beginner Friendly, SEO, Viral, Professional, Photorealistic, ChatGPT, Claude

### 5. `prompts`

Main prompt content table.

**Fields:**
- `id` (UUID) - Primary key
- `title` (TEXT) - Prompt title
- `slug` (TEXT) - URL-friendly unique identifier
- `description` (TEXT, nullable) - Brief description
- **`content` (TEXT)** - **PROTECTED FIELD** - The actual prompt
- `category_id` (UUID, nullable) - FK to categories
- `access_level` (access_level) - `free` or `pro`
- `views_count` (INTEGER) - View count
- `saves_count` (INTEGER) - Save/favorite count
- `copies_count` (INTEGER) - Copy count
- `is_featured` (BOOLEAN) - Featured on homepage
- `is_published` (BOOLEAN) - Published/draft
- `featured_order` (INTEGER, nullable) - Order in featured section
- `meta_title`, `meta_description` (TEXT, nullable) - SEO
- `created_by`, `reviewed_by` (UUID, nullable) - User references
- `reviewed_at` (TIMESTAMPTZ, nullable)
- `created_at`, `updated_at`, `published_at` (TIMESTAMPTZ)

**Content Protection:**
- `content` field is **protected** via application logic
- Free users: Can see `content` for `access_level = 'free'` prompts
- Pro users: Can see `content` for all prompts
- Use `get_prompt_content()` function to enforce access control

### 6. `prompt_images`

Multiple images per prompt.

**Fields:**
- `id` (UUID) - Primary key
- `prompt_id` (UUID) - FK to prompts
- `image_url` (TEXT) - Image URL
- `alt_text` (TEXT, nullable) - Accessibility text
- `caption` (TEXT, nullable)
- `sort_order` (INTEGER) - Display order
- `is_primary` (BOOLEAN) - Main thumbnail
- `width`, `height`, `file_size` (INTEGER, nullable)

**Usage:**
- One prompt can have multiple images
- Mark one as `is_primary = true` for thumbnails
- Sort by `sort_order` for galleries

### 7. `prompt_tags`

Many-to-many relationship between prompts and tags.

**Fields:**
- `prompt_id` (UUID) - FK to prompts
- `tag_id` (UUID) - FK to tags
- Composite primary key

### 8. `prompt_models`

Many-to-many relationship between prompts and AI models.

**Fields:**
- `prompt_id` (UUID) - FK to prompts
- `model_id` (UUID) - FK to ai_models
- `recommended_settings` (JSONB, nullable) - Model-specific settings
  - Example: `{"temperature": 0.7, "top_p": 0.9}`
- `is_primary` (BOOLEAN) - Primary recommended model
- Composite primary key

### 9. `user_favorites`

User saved/favorited prompts.

**Fields:**
- `id` (UUID) - Primary key
- `user_id` (UUID) - FK to auth.users
- `prompt_id` (UUID) - FK to prompts
- `notes` (TEXT, nullable) - User's personal notes
- Unique constraint on (user_id, prompt_id)

### 10. `user_subscriptions`

Stripe subscription management.

**Fields:**
- `id` (UUID) - Primary key
- `user_id` (UUID) - Unique FK to auth.users
- `tier` (subscription_tier) - `free`, `pro`, or `enterprise`
- `stripe_customer_id` (TEXT, nullable unique)
- `stripe_subscription_id` (TEXT, nullable unique)
- `stripe_price_id` (TEXT, nullable)
- `is_active` (BOOLEAN)
- `current_period_start`, `current_period_end` (TIMESTAMPTZ, nullable)
- `cancel_at_period_end` (BOOLEAN)
- `canceled_at` (TIMESTAMPTZ, nullable)

---

## Relationships

### Entity Relationship Diagram

```
ai_providers (1) ──────< (N) ai_models
                              │
                              │
categories (1) ──────< (N) prompts (1) ──────< (N) prompt_images
    │                         │
    │ (self-reference)        ├─────< (N) prompt_tags >─────┤ (N) tags
    │                         │
    └─────< (N) children      └─────< (N) prompt_models >───┤ (N) ai_models

auth.users (1) ──────< (N) user_favorites >─────┤ (N) prompts
           │
           └─────< (1) user_subscriptions
```

### Key Relationships

1. **AI Provider → Models** (1:N)
   - One provider has many models
   - Example: OpenAI → [GPT-4, GPT-3.5, DALL-E 3]

2. **Categories** (Self-referencing)
   - Categories can have parent categories
   - Example: "Writing" → ["Email Sequences", "LinkedIn Posts"]

3. **Prompts → Categories** (N:1)
   - Each prompt belongs to one category

4. **Prompts → Tags** (N:N via prompt_tags)
   - One prompt can have multiple tags
   - One tag can be on multiple prompts

5. **Prompts → Models** (N:N via prompt_models)
   - One prompt can work with multiple models
   - Track which model is primary

6. **Prompts → Images** (1:N)
   - One prompt can have multiple images
   - One image marked as primary

7. **Users → Subscriptions** (1:1)
   - Each user has one subscription record

8. **Users → Favorites** (N:N via user_favorites)
   - Users can favorite multiple prompts

---

## Access Control

### Row Level Security (RLS)

All tables have RLS enabled with specific policies:

#### Public Read Tables
- `ai_providers` - Anyone can view active providers
- `ai_models` - Anyone can view active models
- `categories` - Anyone can view active categories
- `tags` - Anyone can view all tags

#### Conditional Access
- `prompts` - Everyone can view **published** prompts metadata
  - **Content field**: Protected by `get_prompt_content()` function
  - Free prompts → Everyone
  - Pro prompts → Pro subscribers only

#### User-Specific
- `user_favorites` - Users can only view/manage their own favorites
- `user_subscriptions` - Users can view their own subscription

#### Admin-Only
- Insert/Update/Delete on providers, models, categories, tags, prompts
- Requires `auth.jwt() ->> 'role' = 'admin'`

### Helper Functions

#### `user_has_pro_access(user_uuid UUID)`
Returns `BOOLEAN` - whether user has active pro subscription.

```sql
SELECT user_has_pro_access('user-uuid-here');
-- Returns: true/false
```

#### `get_prompt_content(prompt_uuid UUID, user_uuid UUID)`
Returns prompt with content access control applied.

```sql
SELECT * FROM get_prompt_content(
  'prompt-uuid-here',
  'user-uuid-here'
);
-- Returns: id, title, slug, description, content (nullable), access_level, has_access
```

**Logic:**
- If `access_level = 'free'` → content returned
- If `access_level = 'pro'` AND user has pro subscription → content returned
- Otherwise → content is NULL, has_access = false

#### `increment_prompt_views(prompt_uuid UUID)`
Increment view count.

#### `increment_prompt_copies(prompt_uuid UUID)`
Increment copy count.

---

## Directus Integration

### Setting Up Directus

1. **Install Directus:**
   ```bash
   npm install directus
   npx directus init
   ```

2. **Configure Database Connection:**
   Point Directus to your Supabase database (use connection string).

3. **Import Schema:**
   Directus will auto-detect all tables and relationships.

### Field Configurations for Directus

#### AI Providers
- **Display Template:** `{{display_name}}`
- **logo_url:** Use **Image** field type with URL input
- **sort_order:** Use **Sort** interface

#### AI Models
- **Display Template:** `{{model_name}} ({{provider.display_name}})`
- **provider_id:** Dropdown (M2O) to ai_providers
- **capabilities:** **Tags** interface (multi-select)
- **is_featured:** **Toggle** interface

#### Categories
- **Display Template:** `{{name}}`
- **parent_id:** **Dropdown** (M2O) to categories (self-reference)
- **icon:** **Icon Picker** or **Input** for emoji
- **color:** **Color Picker**
- Directus will show tree structure automatically

#### Tags
- **Display Template:** `{{name}}`
- **usage_count:** **Read-only** (auto-calculated)
- **is_featured:** **Toggle**

#### Prompts (Primary Content)
- **Display Template:** `{{title}}`
- **category_id:** **Dropdown** (M2O) to categories
- **access_level:** **Dropdown** (free/pro)
- **content:** **WYSIWYG** or **Textarea** - **This is the protected field**
- **is_published:** **Toggle**
- **is_featured:** **Toggle**

#### Prompt Images
- **Display Template:** `Image {{sort_order}}`
- **prompt_id:** **Hidden** (set via relation)
- **image_url:** **File** interface (upload to Supabase Storage or external CDN)
- **is_primary:** **Toggle**
- **sort_order:** **Sort** interface
- **Interface:** Use **Gallery** or **Image** with **Many-to-One** relation

#### Prompt Tags (Junction)
- **Use Directus M2M interface:**
  - On prompts collection: Add **Many-to-Many** field
  - Junction collection: `prompt_tags`
  - Related collection: `tags`
  - Will show as multi-select tags

#### Prompt Models (Junction)
- **Use Directus M2M interface:**
  - On prompts collection: Add **Many-to-Many** field
  - Junction collection: `prompt_models`
  - Related collection: `ai_models`
  - **recommended_settings:** **JSON** field
  - **is_primary:** **Toggle** (mark primary model)

### Recommended Directus Layout for Prompts

**Collection: prompts**

```
┌─ Basic Info ─────────────────────────┐
│ Title: [________________]            │
│ Slug: [________________] (auto)      │
│ Description: [___________]           │
│ Category: [Dropdown▼]                │
│ Access Level: [free ▼]               │
└──────────────────────────────────────┘

┌─ Content (Protected) ───────────────┐
│ [WYSIWYG Editor for prompt content]  │
│ [This field is protected and only   │
│  visible to authorized users based   │
│  on access_level and subscription]   │
└──────────────────────────────────────┘

┌─ Images ─────────────────────────────┐
│ [+ Add Image]                        │
│ ┌───────┬────────┬─────────┬──────┐ │
│ │ Image │ Primary│ Caption │ Sort │ │
│ ├───────┼────────┼─────────┼──────┤ │
│ │ img1  │ [x]    │ ...     │ 0    │ │
│ │ img2  │ [ ]    │ ...     │ 1    │ │
│ └───────┴────────┴─────────┴──────┘ │
└──────────────────────────────────────┘

┌─ AI Models ──────────────────────────┐
│ [Multi-select from ai_models]        │
│ - Claude 3.5 Sonnet ⭐ (primary)     │
│ - GPT-4o                             │
│ - Gemini 2.0 Flash                   │
└──────────────────────────────────────┘

┌─ Tags ───────────────────────────────┐
│ [Multi-select tag chips]             │
│ [Beginner] [SEO] [Professional]      │
└──────────────────────────────────────┘

┌─ Settings ───────────────────────────┐
│ ☑ Published                          │
│ ☑ Featured                           │
│ Featured Order: [__]                 │
└──────────────────────────────────────┘

┌─ SEO ────────────────────────────────┐
│ Meta Title: [___________]            │
│ Meta Description: [______]           │
└──────────────────────────────────────┘

┌─ Metrics (Read-only) ────────────────┐
│ Views: 1,234                         │
│ Saves: 56                            │
│ Copies: 78                           │
└──────────────────────────────────────┘
```

### Image Upload Setup

**Option 1: Supabase Storage**
1. Create a `prompt-images` bucket in Supabase Storage
2. Configure Directus to use Supabase Storage adapter
3. Images uploaded via Directus → stored in Supabase → URL saved to `image_url`

**Option 2: External CDN**
1. Use Cloudinary, Uploadcare, or similar
2. Configure Directus file interface
3. URL saved to `image_url` field

### Directus Collections Setup Checklist

- [x] Import all tables from Supabase
- [x] Configure relationships (M2O, M2M)
- [x] Set display templates
- [x] Configure field interfaces:
  - [x] Dropdowns for foreign keys
  - [x] Multi-select for tags and models
  - [x] File upload for images
  - [x] WYSIWYG for content
  - [x] Toggle for booleans
  - [x] Color picker for category colors
- [x] Set read-only fields (usage_count, metrics)
- [x] Configure permissions (admin-only edit)

---

## Usage Examples

### Query: Get All Prompts with Relations

```sql
SELECT
  p.*,
  c.name as category_name,
  array_agg(DISTINCT t.name) as tag_names,
  array_agg(DISTINCT m.model_name) as model_names,
  (SELECT pi.image_url FROM prompt_images pi
   WHERE pi.prompt_id = p.id AND pi.is_primary = true
   LIMIT 1) as primary_image
FROM prompts p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN prompt_tags pt ON p.id = pt.prompt_id
LEFT JOIN tags t ON pt.tag_id = t.id
LEFT JOIN prompt_models pm ON p.id = pm.prompt_id
LEFT JOIN ai_models m ON pm.model_id = m.id
WHERE p.is_published = true
GROUP BY p.id, c.name;
```

### Query: Get User's Accessible Prompts

```sql
-- Using the helper function
SELECT * FROM get_prompt_content(
  '550e8400-e29b-41d4-a716-446655440000',  -- prompt_id
  '7c9e6679-7425-40de-944b-e07fc1f90ae7'   -- user_id
);
```

### Query: Get Category Hierarchy

```sql
WITH RECURSIVE category_tree AS (
  -- Root categories
  SELECT id, name, slug, parent_id, 0 as level, name as path
  FROM categories
  WHERE parent_id IS NULL AND is_active = true

  UNION ALL

  -- Child categories
  SELECT c.id, c.name, c.slug, c.parent_id, ct.level + 1, ct.path || ' > ' || c.name
  FROM categories c
  INNER JOIN category_tree ct ON c.parent_id = ct.id
  WHERE c.is_active = true
)
SELECT * FROM category_tree ORDER BY path;
```

### Insert: Create a New Prompt

```sql
-- 1. Insert prompt
INSERT INTO prompts (
  title, slug, description, content, category_id, access_level, is_published
) VALUES (
  'Perfect LinkedIn Post Generator',
  'perfect-linkedin-post-generator',
  'Generate engaging LinkedIn posts that get maximum reach',
  'Your actual prompt content here...',
  (SELECT id FROM categories WHERE slug = 'linkedin-posts'),
  'free',
  true
) RETURNING id;

-- 2. Add tags (assuming prompt_id from above)
INSERT INTO prompt_tags (prompt_id, tag_id)
SELECT
  '550e8400-e29b-41d4-a716-446655440000',  -- prompt_id
  id
FROM tags
WHERE slug IN ('professional', 'seo', 'chatgpt');

-- 3. Add compatible models
INSERT INTO prompt_models (prompt_id, model_id, is_primary)
SELECT
  '550e8400-e29b-41d4-a716-446655440000',  -- prompt_id
  id,
  slug = 'claude-3-5-sonnet'  -- Mark as primary
FROM ai_models
WHERE slug IN ('claude-3-5-sonnet', 'gpt-4o', 'gemini-2-0-flash');

-- 4. Add images
INSERT INTO prompt_images (prompt_id, image_url, is_primary, sort_order)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'https://...img1.jpg', true, 0),
  ('550e8400-e29b-41d4-a716-446655440000', 'https://...img2.jpg', false, 1);
```

### Update: Increment Prompt Engagement

```sql
-- Increment views
SELECT increment_prompt_views('550e8400-e29b-41d4-a716-446655440000');

-- Increment copies
SELECT increment_prompt_copies('550e8400-e29b-41d4-a716-446655440000');

-- Add to favorites
INSERT INTO user_favorites (user_id, prompt_id, notes)
VALUES (
  '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  '550e8400-e29b-41d4-a716-446655440000',
  'Great for weekly posts'
);
```

---

## Migration Guide

### Migrating from Old Schema

If you have existing data in the old schema:

#### Step 1: Backup Data
```bash
pg_dump <old-database> > backup.sql
```

#### Step 2: Run New Migrations
```bash
supabase db reset  # Drops all tables
supabase migration up
```

#### Step 3: Data Migration Script

```sql
-- This is a conceptual guide - adjust based on your old schema

-- Migrate old prompts to new structure
INSERT INTO prompts (
  title, slug, description, content,
  access_level, is_published, is_featured
)
SELECT
  title,
  lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g')),  -- Generate slug
  description,
  content,
  CASE WHEN is_curated THEN 'free'::access_level ELSE 'free'::access_level END,
  is_public,
  is_featured
FROM old_prompts;

-- Map old categories to new ones
-- (Manual mapping required based on your old enum)
UPDATE prompts p
SET category_id = (
  SELECT id FROM categories
  WHERE slug = 'writing'  -- Map based on old category
)
WHERE ... -- Your mapping logic
```

---

## Best Practices

### 1. Content Protection
- Always use `get_prompt_content()` function in your API
- Never expose `prompts.content` directly to frontend for pro prompts
- Check `user_subscriptions` before granting access

### 2. Performance
- Use indexes (already created in schema)
- Limit queries with pagination
- Cache frequent queries (categories, tags, providers)

### 3. Image Management
- Store images in Supabase Storage or CDN
- Always set one `is_primary = true` per prompt
- Optimize images before upload
- Use `sort_order` for consistent display

### 4. Tags & Categories
- Keep tag names concise (2-3 words max)
- Use hierarchical categories (max 2 levels deep)
- Featured tags appear in UI prominently

### 5. AI Models
- Keep model data up-to-date
- Mark deprecated models with `deprecation_date`
- Update costs regularly
- Use `is_featured` for popular models

---

## Troubleshooting

### Common Issues

**Issue:** Directus can't see relationships
- **Solution:** Refresh schema in Directus admin
- Check foreign key constraints in database

**Issue:** Content visible to free users
- **Solution:** Use `get_prompt_content()` function, not direct SELECT
- Check RLS policies are enabled

**Issue:** Images not uploading
- **Solution:** Check Supabase Storage bucket permissions
- Verify CORS settings
- Check file size limits

**Issue:** Tag usage_count not updating
- **Solution:** Trigger should auto-update
- Verify triggers are created: `\df update_tag_usage_count`

---

## Data Sources for AI Models

You asked about getting AI model data from open-source or services. Here are sources:

### Recommended Approach
**Manually curate** using these sources:

1. **OpenAI:** https://openai.com/api/pricing/
2. **Anthropic:** https://www.anthropic.com/pricing
3. **Google Gemini:** https://ai.google.dev/pricing
4. **Provider documentation** for capabilities and context windows

### Semi-Automated Options

1. **LiteLLM Model Database**
   - GitHub: `BerriAI/litellm`
   - Has JSON with many models and costs
   - Not always current

2. **OpenRouter API**
   - https://openrouter.ai/docs#models
   - Aggregates many models with pricing
   - `/api/v1/models` endpoint

3. **Hugging Face Model Hub**
   - For open-source models
   - API: `https://huggingface.co/api/models`

### Manual Maintenance Recommended
Given the pace of AI model releases, **manual curation** via Directus is most reliable.

---

## Next Steps

1. **Run Migrations:**
   ```bash
   supabase db reset
   supabase migration up
   ```

2. **Set Up Directus:**
   - Install and configure
   - Import schema
   - Configure field interfaces
   - Create admin user

3. **Populate Initial Data:**
   - Seed data already included in migration
   - Add more prompts via Directus

4. **Build Frontend:**
   - Use TypeScript types from `database.types.ts`
   - Implement access control logic
   - Create prompt display components

5. **Integrate Stripe:**
   - Use a Stripe wrapper (e.g., `@stripe/stripe-js`)
   - Update `user_subscriptions` on webhook events
   - Sync subscription status

---

## Support & Resources

- **Supabase Docs:** https://supabase.com/docs
- **Directus Docs:** https://docs.directus.io
- **Stripe Integration:** https://stripe.com/docs/billing
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

**Schema Version:** 2.0
**Migration Files:**
- `20250130000001_new_schema.sql` - Schema definition
- `20250130000002_seed_data.sql` - Initial seed data

**Type Definitions:** `src/types/database.types.ts`
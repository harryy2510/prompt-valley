-- ============================================================================
-- PROMPTVALLEY SEED DATA
-- Fresh seed data matching the new schema
-- ============================================================================

-- ============================================================================
-- AI PROVIDERS
-- ============================================================================

INSERT INTO ai_providers (name, slug, logo_url, website_url) VALUES
('OpenAI', 'openai', 'https://cdn.openai.com/assets/favicon-32x32.png', 'https://openai.com'),
('Anthropic', 'anthropic', 'https://www.anthropic.com/images/icons/safari-pinned-tab.svg', 'https://www.anthropic.com'),
('Google', 'google', 'https://www.google.com/favicon.ico', 'https://ai.google'),
('xAI', 'xai', NULL, 'https://x.ai'),
('Meta', 'meta', 'https://static.xx.fbcdn.net/rsrc.php/yb/r/hLRJ1GG_y0J.ico', 'https://ai.meta.com'),
('Mistral AI', 'mistral', NULL, 'https://mistral.ai'),
('Midjourney', 'midjourney', NULL, 'https://www.midjourney.com'),
('Stability AI', 'stability', NULL, 'https://stability.ai'),
('Ideogram', 'ideogram', NULL, 'https://ideogram.ai');

-- ============================================================================
-- AI MODELS
-- ============================================================================

-- OpenAI Models
INSERT INTO ai_models (id, provider_id, name, slug, capabilities, context_window, max_output_tokens, cost_input_per_million, cost_output_per_million)
SELECT
  'gpt-4o',
  id,
  'GPT-4o',
  'gpt-4o',
  ARRAY['text', 'code', 'image']::model_capability[],
  128000,
  16384,
  2.5000,
  10.0000
FROM ai_providers WHERE slug = 'openai';

INSERT INTO ai_models (id, provider_id, name, slug, capabilities, context_window, max_output_tokens, cost_input_per_million, cost_output_per_million)
SELECT
  'gpt-4-turbo',
  id,
  'GPT-4 Turbo',
  'gpt-4-turbo',
  ARRAY['text', 'code', 'image']::model_capability[],
  128000,
  4096,
  10.0000,
  30.0000
FROM ai_providers WHERE slug = 'openai';

INSERT INTO ai_models (id, provider_id, name, slug, capabilities, context_window, max_output_tokens, cost_input_per_million, cost_output_per_million)
SELECT
  'gpt-3.5-turbo',
  id,
  'GPT-3.5 Turbo',
  'gpt-3-5-turbo',
  ARRAY['text', 'code']::model_capability[],
  16385,
  4096,
  0.5000,
  1.5000
FROM ai_providers WHERE slug = 'openai';

-- Anthropic Models
INSERT INTO ai_models (id, provider_id, name, slug, capabilities, context_window, max_output_tokens, cost_input_per_million, cost_output_per_million)
SELECT
  'claude-3-5-sonnet-20241022',
  id,
  'Claude 3.5 Sonnet',
  'claude-3-5-sonnet',
  ARRAY['text', 'code', 'image']::model_capability[],
  200000,
  8192,
  3.0000,
  15.0000
FROM ai_providers WHERE slug = 'anthropic';

INSERT INTO ai_models (id, provider_id, name, slug, capabilities, context_window, max_output_tokens, cost_input_per_million, cost_output_per_million)
SELECT
  'claude-3-opus-20240229',
  id,
  'Claude 3 Opus',
  'claude-3-opus',
  ARRAY['text', 'code', 'image']::model_capability[],
  200000,
  4096,
  15.0000,
  75.0000
FROM ai_providers WHERE slug = 'anthropic';

INSERT INTO ai_models (id, provider_id, name, slug, capabilities, context_window, max_output_tokens, cost_input_per_million, cost_output_per_million)
SELECT
  'claude-3-haiku-20240307',
  id,
  'Claude 3 Haiku',
  'claude-3-haiku',
  ARRAY['text', 'code', 'image']::model_capability[],
  200000,
  4096,
  0.2500,
  1.2500
FROM ai_providers WHERE slug = 'anthropic';

-- Google Models
INSERT INTO ai_models (id, provider_id, name, slug, capabilities, context_window, max_output_tokens, cost_input_per_million, cost_output_per_million)
SELECT
  'gemini-2.0-flash-exp',
  id,
  'Gemini 2.0 Flash',
  'gemini-2-0-flash',
  ARRAY['text', 'code', 'image']::model_capability[],
  1000000,
  8192,
  0.0000,
  0.0000
FROM ai_providers WHERE slug = 'google';

INSERT INTO ai_models (id, provider_id, name, slug, capabilities, context_window, max_output_tokens, cost_input_per_million, cost_output_per_million)
SELECT
  'gemini-1.5-pro',
  id,
  'Gemini 1.5 Pro',
  'gemini-1-5-pro',
  ARRAY['text', 'code', 'image']::model_capability[],
  2000000,
  8192,
  1.2500,
  5.0000
FROM ai_providers WHERE slug = 'google';

-- xAI Models
INSERT INTO ai_models (id, provider_id, name, slug, capabilities, context_window, max_output_tokens, cost_input_per_million, cost_output_per_million)
SELECT
  'grok-2',
  id,
  'Grok 2',
  'grok-2',
  ARRAY['text', 'code']::model_capability[],
  128000,
  4096,
  2.0000,
  10.0000
FROM ai_providers WHERE slug = 'xai';

-- Meta Models
INSERT INTO ai_models (id, provider_id, name, slug, capabilities, context_window, max_output_tokens, cost_input_per_million, cost_output_per_million)
SELECT
  'llama-3.3-70b',
  id,
  'Llama 3.3 70B',
  'llama-3-3-70b',
  ARRAY['text', 'code']::model_capability[],
  128000,
  4096,
  0.0000,
  0.0000
FROM ai_providers WHERE slug = 'meta';

-- Mistral Models
INSERT INTO ai_models (id, provider_id, name, slug, capabilities, context_window, max_output_tokens, cost_input_per_million, cost_output_per_million)
SELECT
  'mistral-large-2',
  id,
  'Mistral Large 2',
  'mistral-large-2',
  ARRAY['text', 'code']::model_capability[],
  128000,
  4096,
  2.0000,
  6.0000
FROM ai_providers WHERE slug = 'mistral';

-- Image Generation Models
INSERT INTO ai_models (id, provider_id, name, slug, capabilities, context_window, max_output_tokens, cost_input_per_million, cost_output_per_million)
SELECT
  'midjourney-v6',
  id,
  'Midjourney V6',
  'midjourney-v6',
  ARRAY['image']::model_capability[],
  NULL,
  NULL,
  NULL,
  NULL
FROM ai_providers WHERE slug = 'midjourney';

INSERT INTO ai_models (id, provider_id, name, slug, capabilities, context_window, max_output_tokens, cost_input_per_million, cost_output_per_million)
SELECT
  'dall-e-3',
  id,
  'DALL-E 3',
  'dall-e-3',
  ARRAY['image']::model_capability[],
  NULL,
  NULL,
  NULL,
  NULL
FROM ai_providers WHERE slug = 'openai';

INSERT INTO ai_models (id, provider_id, name, slug, capabilities, context_window, max_output_tokens, cost_input_per_million, cost_output_per_million)
SELECT
  'stable-diffusion-3',
  id,
  'Stable Diffusion 3',
  'stable-diffusion-3',
  ARRAY['image']::model_capability[],
  NULL,
  NULL,
  NULL,
  NULL
FROM ai_providers WHERE slug = 'stability';

INSERT INTO ai_models (id, provider_id, name, slug, capabilities, context_window, max_output_tokens, cost_input_per_million, cost_output_per_million)
SELECT
  'ideogram-v2',
  id,
  'Ideogram V2',
  'ideogram-v2',
  ARRAY['image']::model_capability[],
  NULL,
  NULL,
  NULL,
  NULL
FROM ai_providers WHERE slug = 'ideogram';

-- ============================================================================
-- CATEGORIES
-- ============================================================================

-- Root categories
INSERT INTO categories (name, slug) VALUES
('Writing', 'writing'),
('Image Generation', 'image-generation'),
('Coding', 'coding'),
('Marketing', 'marketing'),
('Productivity', 'productivity'),
('Analysis', 'analysis'),
('Education', 'education'),
('Creative', 'creative');

-- Subcategories for Writing
INSERT INTO categories (parent_id, name, slug)
SELECT id, 'Email Sequences', 'email-sequences' FROM categories WHERE slug = 'writing';

INSERT INTO categories (parent_id, name, slug)
SELECT id, 'LinkedIn Posts', 'linkedin-posts' FROM categories WHERE slug = 'writing';

INSERT INTO categories (parent_id, name, slug)
SELECT id, 'Social Media', 'social-media' FROM categories WHERE slug = 'writing';

INSERT INTO categories (parent_id, name, slug)
SELECT id, 'Blog Posts', 'blog-posts' FROM categories WHERE slug = 'writing';

-- Subcategories for Image Generation
INSERT INTO categories (parent_id, name, slug)
SELECT id, 'Illustrations', 'illustrations' FROM categories WHERE slug = 'image-generation';

INSERT INTO categories (parent_id, name, slug)
SELECT id, 'Fashion Photography', 'fashion-photography' FROM categories WHERE slug = 'image-generation';

INSERT INTO categories (parent_id, name, slug)
SELECT id, 'Product Photos', 'product-photos' FROM categories WHERE slug = 'image-generation';

INSERT INTO categories (parent_id, name, slug)
SELECT id, 'Logos & Branding', 'logos-branding' FROM categories WHERE slug = 'image-generation';

-- Subcategories for Coding
INSERT INTO categories (parent_id, name, slug)
SELECT id, 'Python', 'python' FROM categories WHERE slug = 'coding';

INSERT INTO categories (parent_id, name, slug)
SELECT id, 'JavaScript', 'javascript' FROM categories WHERE slug = 'coding';

INSERT INTO categories (parent_id, name, slug)
SELECT id, 'Debugging', 'debugging' FROM categories WHERE slug = 'coding';

-- ============================================================================
-- TAGS
-- ============================================================================

INSERT INTO tags (name, slug) VALUES
('Beginner Friendly', 'beginner-friendly'),
('Advanced', 'advanced'),
('SEO', 'seo'),
('Viral', 'viral'),
('Professional', 'professional'),
('Photorealistic', 'photorealistic'),
('ChatGPT', 'chatgpt'),
('Claude', 'claude'),
('Midjourney', 'midjourney'),
('Quick', 'quick'),
('Detailed', 'detailed'),
('B2B', 'b2b'),
('B2C', 'b2c'),
('Technical', 'technical'),
('Creative', 'creative'),
('Business', 'business'),
('Personal', 'personal'),
('Education', 'education'),
('Marketing', 'marketing'),
('Sales', 'sales'),
('Customer Support', 'customer-support'),
('Content Creation', 'content-creation'),
('Productivity', 'productivity'),
('Data Analysis', 'data-analysis'),
('Research', 'research');

-- ============================================================================
-- SAMPLE PROMPTS (Optional - you can add your own)
-- ============================================================================

-- Example: LinkedIn Post Generator
INSERT INTO prompts (
  title,
  slug,
  description,
  content,
  category_id,
  tier,
  is_featured,
  is_published,
  sort_order,
  published_at
)
SELECT
  'Professional LinkedIn Post Generator',
  'professional-linkedin-post-generator',
  'Create engaging LinkedIn posts that drive engagement and establish thought leadership',
  'You are a LinkedIn content strategist. Write a professional LinkedIn post about [TOPIC] that:
- Starts with a hook that grabs attention in the first line
- Shares a personal story or insight
- Provides 3-5 actionable takeaways
- Ends with a question to encourage comments
- Uses short paragraphs (2-3 lines max)
- Includes relevant emojis sparingly
- Stays under 1,300 characters

Topic: [INSERT YOUR TOPIC HERE]

Write the post now.',
  id,
  'free',
  true,
  true,
  1,
  NOW()
FROM categories WHERE slug = 'linkedin-posts';

-- Link the prompt to tags
INSERT INTO prompt_tags (prompt_id, tag_id)
SELECT
  p.id,
  t.id
FROM prompts p
CROSS JOIN tags t
WHERE p.slug = 'professional-linkedin-post-generator'
AND t.slug IN ('beginner-friendly', 'professional', 'chatgpt', 'claude', 'content-creation', 'marketing');

-- Link the prompt to compatible models
INSERT INTO prompt_models (prompt_id, model_id)
SELECT
  p.id,
  m.id
FROM prompts p
CROSS JOIN ai_models m
WHERE p.slug = 'professional-linkedin-post-generator'
AND m.id IN ('gpt-4o', 'claude-3-5-sonnet-20241022', 'gemini-2.0-flash-exp');

-- ============================================================================
-- Example: Midjourney Product Photo Prompt
-- ============================================================================

INSERT INTO prompts (
  title,
  slug,
  description,
  content,
  images,
  category_id,
  tier,
  is_featured,
  is_published,
  sort_order,
  published_at
)
SELECT
  'E-commerce Product Photography',
  'ecommerce-product-photography',
  'Generate stunning product photos for e-commerce with perfect lighting and composition',
  'Professional product photography of [PRODUCT DESCRIPTION], clean white background, studio lighting, 8k, ultra detailed, commercial photography, centered composition, soft shadows, high-end catalog style --ar 1:1 --style raw --v 6',
  ARRAY[]::TEXT[],
  id,
  'free',
  true,
  true,
  2,
  NOW()
FROM categories WHERE slug = 'product-photos';

INSERT INTO prompt_tags (prompt_id, tag_id)
SELECT
  p.id,
  t.id
FROM prompts p
CROSS JOIN tags t
WHERE p.slug = 'ecommerce-product-photography'
AND t.slug IN ('midjourney', 'professional', 'photorealistic', 'business');

INSERT INTO prompt_models (prompt_id, model_id)
SELECT
  p.id,
  m.id
FROM prompts p
CROSS JOIN ai_models m
WHERE p.slug = 'ecommerce-product-photography'
AND m.id = 'midjourney-v6';

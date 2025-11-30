-- ============================================================================
-- PROMPTVALLEY SEED DATA
-- Description: Initial data for AI providers, models, categories, and tags
-- Note: Run after all migrations are complete (supabase db reset)
-- ============================================================================

-- ============================================================================
-- AI PROVIDERS
-- ============================================================================

INSERT INTO ai_providers (name, display_name, slug, logo_url, website_url, description, sort_order) VALUES
-- Major AI Companies
('OpenAI', 'OpenAI', 'openai', 'https://cdn.openai.com/assets/favicon-32x32.png', 'https://openai.com', 'Leading AI research company behind ChatGPT and GPT models', 1),
('Anthropic', 'Anthropic', 'anthropic', 'https://www.anthropic.com/images/icons/safari-pinned-tab.svg', 'https://www.anthropic.com', 'AI safety company behind Claude models', 2),
('Google', 'Google AI', 'google', 'https://www.google.com/favicon.ico', 'https://ai.google', 'Google''s AI division with Gemini models', 3),
('xAI', 'xAI', 'xai', NULL, 'https://x.ai', 'Elon Musk''s AI company behind Grok', 4),
('Meta', 'Meta AI', 'meta', 'https://static.xx.fbcdn.net/rsrc.php/yb/r/hLRJ1GG_y0J.ico', 'https://ai.meta.com', 'Meta''s open-source AI models', 5),
('Mistral AI', 'Mistral AI', 'mistral', NULL, 'https://mistral.ai', 'European AI company with open models', 6),

-- Image Generation
('Midjourney', 'Midjourney', 'midjourney', NULL, 'https://www.midjourney.com', 'AI art generation platform', 10),
('Stability AI', 'Stability AI', 'stability', NULL, 'https://stability.ai', 'Creators of Stable Diffusion', 11),
('Ideogram', 'Ideogram', 'ideogram', NULL, 'https://ideogram.ai', 'Text-to-image AI with superior text rendering', 12),
('DALL-E', 'DALL-E', 'dalle', NULL, 'https://openai.com/dall-e-3', 'OpenAI''s image generation', 13);

-- ============================================================================
-- AI MODELS - Text/Chat Models
-- ============================================================================

-- OpenAI Models
INSERT INTO ai_models (
  provider_id, model_id, model_name, model_version, slug, capabilities,
  context_window, max_output_tokens, cost_input_per_million, cost_output_per_million,
  description, is_featured, release_date, sort_order
)
SELECT
  p.id,
  'gpt-4-turbo',
  'GPT-4 Turbo',
  '2024-04-09',
  'gpt-4-turbo',
  ARRAY['text', 'vision', 'code']::model_capability[],
  128000,
  4096,
  10.0000,
  30.0000,
  'Most capable GPT-4 model with vision capabilities',
  true,
  '2024-04-09',
  1
FROM ai_providers p WHERE p.slug = 'openai'

UNION ALL

SELECT
  p.id,
  'gpt-4o',
  'GPT-4o',
  '2024-05-13',
  'gpt-4o',
  ARRAY['text', 'vision', 'audio', 'code', 'multimodal']::model_capability[],
  128000,
  4096,
  5.0000,
  15.0000,
  'Omni-modal model with text, vision, and audio',
  true,
  '2024-05-13',
  2
FROM ai_providers p WHERE p.slug = 'openai'

UNION ALL

SELECT
  p.id,
  'gpt-3.5-turbo',
  'GPT-3.5 Turbo',
  '0125',
  'gpt-3-5-turbo',
  ARRAY['text', 'code']::model_capability[],
  16385,
  4096,
  0.5000,
  1.5000,
  'Fast and affordable model for simpler tasks',
  false,
  '2023-03-01',
  10
FROM ai_providers p WHERE p.slug = 'openai';

-- Anthropic Models
INSERT INTO ai_models (
  provider_id, model_id, model_name, model_version, slug, capabilities,
  context_window, max_output_tokens, cost_input_per_million, cost_output_per_million,
  description, is_featured, release_date, sort_order
)
SELECT
  p.id,
  'claude-3-5-sonnet-20241022',
  'Claude 3.5 Sonnet',
  '3.5',
  'claude-3-5-sonnet',
  ARRAY['text', 'vision', 'code']::model_capability[],
  200000,
  8192,
  3.0000,
  15.0000,
  'Most intelligent Claude model with extended context',
  true,
  '2024-10-22',
  1
FROM ai_providers p WHERE p.slug = 'anthropic'

UNION ALL

SELECT
  p.id,
  'claude-3-opus-20240229',
  'Claude 3 Opus',
  '3.0',
  'claude-3-opus',
  ARRAY['text', 'vision', 'code']::model_capability[],
  200000,
  4096,
  15.0000,
  75.0000,
  'Most powerful Claude 3 model for complex tasks',
  true,
  '2024-02-29',
  2
FROM ai_providers p WHERE p.slug = 'anthropic'

UNION ALL

SELECT
  p.id,
  'claude-3-sonnet-20240229',
  'Claude 3 Sonnet',
  '3.0',
  'claude-3-sonnet',
  ARRAY['text', 'vision', 'code']::model_capability[],
  200000,
  4096,
  3.0000,
  15.0000,
  'Balanced performance and speed',
  false,
  '2024-02-29',
  3
FROM ai_providers p WHERE p.slug = 'anthropic'

UNION ALL

SELECT
  p.id,
  'claude-3-haiku-20240307',
  'Claude 3 Haiku',
  '3.0',
  'claude-3-haiku',
  ARRAY['text', 'vision', 'code']::model_capability[],
  200000,
  4096,
  0.2500,
  1.2500,
  'Fastest and most affordable Claude 3 model',
  false,
  '2024-03-07',
  10
FROM ai_providers p WHERE p.slug = 'anthropic';

-- Google Gemini Models
INSERT INTO ai_models (
  provider_id, model_id, model_name, model_version, slug, capabilities,
  context_window, max_output_tokens, cost_input_per_million, cost_output_per_million,
  description, is_featured, release_date, sort_order
)
SELECT
  p.id,
  'gemini-2.0-flash',
  'Gemini 2.0 Flash',
  '2.0',
  'gemini-2-0-flash',
  ARRAY['text', 'vision', 'audio', 'video', 'code', 'multimodal']::model_capability[],
  1000000,
  8192,
  0.0750,
  0.3000,
  'Fastest multimodal model with massive context window',
  true,
  '2024-12-11',
  1
FROM ai_providers p WHERE p.slug = 'google'

UNION ALL

SELECT
  p.id,
  'gemini-1.5-pro',
  'Gemini 1.5 Pro',
  '1.5',
  'gemini-1-5-pro',
  ARRAY['text', 'vision', 'audio', 'code', 'multimodal']::model_capability[],
  2000000,
  8192,
  1.2500,
  5.0000,
  'Advanced model with 2M token context window',
  true,
  '2024-05-14',
  2
FROM ai_providers p WHERE p.slug = 'google'

UNION ALL

SELECT
  p.id,
  'gemini-1.5-flash',
  'Gemini 1.5 Flash',
  '1.5',
  'gemini-1-5-flash',
  ARRAY['text', 'vision', 'audio', 'code', 'multimodal']::model_capability[],
  1000000,
  8192,
  0.0750,
  0.3000,
  'Fast and affordable with large context',
  false,
  '2024-05-14',
  3
FROM ai_providers p WHERE p.slug = 'google';

-- xAI Grok Models
INSERT INTO ai_models (
  provider_id, model_id, model_name, model_version, slug, capabilities,
  context_window, max_output_tokens, cost_input_per_million, cost_output_per_million,
  description, is_featured, release_date, sort_order
)
SELECT
  p.id,
  'grok-2',
  'Grok 2',
  '2.0',
  'grok-2',
  ARRAY['text', 'code']::model_capability[],
  128000,
  4096,
  NULL,
  NULL,
  'Latest Grok model with real-time X/Twitter data',
  true,
  '2024-08-01',
  1
FROM ai_providers p WHERE p.slug = 'xai';

-- Meta Models
INSERT INTO ai_models (
  provider_id, model_id, model_name, model_version, slug, capabilities,
  context_window, max_output_tokens, cost_input_per_million, cost_output_per_million,
  description, is_featured, release_date, sort_order
)
SELECT
  p.id,
  'llama-3.3-70b',
  'Llama 3.3 70B',
  '3.3',
  'llama-3-3-70b',
  ARRAY['text', 'code']::model_capability[],
  128000,
  4096,
  NULL,
  NULL,
  'Open-source model with strong performance',
  true,
  '2024-12-01',
  1
FROM ai_providers p WHERE p.slug = 'meta'

UNION ALL

SELECT
  p.id,
  'llama-3.2-vision',
  'Llama 3.2 Vision',
  '3.2',
  'llama-3-2-vision',
  ARRAY['text', 'vision', 'code']::model_capability[],
  128000,
  4096,
  NULL,
  NULL,
  'Llama with vision capabilities',
  true,
  '2024-09-25',
  2
FROM ai_providers p WHERE p.slug = 'meta';

-- Mistral Models
INSERT INTO ai_models (
  provider_id, model_id, model_name, model_version, slug, capabilities,
  context_window, max_output_tokens, cost_input_per_million, cost_output_per_million,
  description, is_featured, release_date, sort_order
)
SELECT
  p.id,
  'mistral-large-2',
  'Mistral Large 2',
  '2',
  'mistral-large-2',
  ARRAY['text', 'code']::model_capability[],
  128000,
  4096,
  2.0000,
  6.0000,
  'Flagship model for complex reasoning',
  true,
  '2024-07-24',
  1
FROM ai_providers p WHERE p.slug = 'mistral';

-- ============================================================================
-- AI MODELS - Image Generation
-- ============================================================================

-- Midjourney
INSERT INTO ai_models (
  provider_id, model_id, model_name, model_version, slug, capabilities,
  context_window, max_output_tokens, cost_input_per_million, cost_output_per_million,
  description, is_featured, release_date, sort_order
)
SELECT
  p.id,
  'midjourney-v6',
  'Midjourney V6',
  '6',
  'midjourney-v6',
  ARRAY['image']::model_capability[],
  NULL,
  NULL,
  NULL,
  NULL,
  'Latest version with improved quality and coherence',
  true,
  '2023-12-21',
  1
FROM ai_providers p WHERE p.slug = 'midjourney'

UNION ALL

SELECT
  p.id,
  'midjourney-niji-6',
  'Niji 6',
  '6',
  'midjourney-niji-6',
  ARRAY['image']::model_capability[],
  NULL,
  NULL,
  NULL,
  NULL,
  'Anime and illustration focused model',
  false,
  '2024-03-01',
  2
FROM ai_providers p WHERE p.slug = 'midjourney';

-- Stable Diffusion
INSERT INTO ai_models (
  provider_id, model_id, model_name, model_version, slug, capabilities,
  context_window, max_output_tokens, cost_input_per_million, cost_output_per_million,
  description, is_featured, release_date, sort_order
)
SELECT
  p.id,
  'stable-diffusion-3',
  'Stable Diffusion 3',
  '3',
  'stable-diffusion-3',
  ARRAY['image']::model_capability[],
  NULL,
  NULL,
  NULL,
  NULL,
  'Latest open-source image generation model',
  true,
  '2024-04-17',
  1
FROM ai_providers p WHERE p.slug = 'stability'

UNION ALL

SELECT
  p.id,
  'sdxl',
  'SDXL 1.0',
  '1.0',
  'sdxl',
  ARRAY['image']::model_capability[],
  NULL,
  NULL,
  NULL,
  NULL,
  'High-quality image generation',
  false,
  '2023-07-26',
  2
FROM ai_providers p WHERE p.slug = 'stability';

-- Ideogram
INSERT INTO ai_models (
  provider_id, model_id, model_name, model_version, slug, capabilities,
  context_window, max_output_tokens, cost_input_per_million, cost_output_per_million,
  description, is_featured, release_date, sort_order
)
SELECT
  p.id,
  'ideogram-2.0',
  'Ideogram 2.0',
  '2.0',
  'ideogram-2-0',
  ARRAY['image']::model_capability[],
  NULL,
  NULL,
  NULL,
  NULL,
  'Superior text rendering in images',
  true,
  '2024-08-01',
  1
FROM ai_providers p WHERE p.slug = 'ideogram';

-- DALL-E
INSERT INTO ai_models (
  provider_id, model_id, model_name, model_version, slug, capabilities,
  context_window, max_output_tokens, cost_input_per_million, cost_output_per_million,
  description, is_featured, release_date, sort_order
)
SELECT
  p.id,
  'dall-e-3',
  'DALL-E 3',
  '3',
  'dall-e-3',
  ARRAY['image']::model_capability[],
  NULL,
  NULL,
  NULL,
  NULL,
  'OpenAI''s latest image generation model',
  true,
  '2023-10-01',
  1
FROM ai_providers p WHERE p.slug = 'dalle';

-- ============================================================================
-- CATEGORIES
-- ============================================================================

-- Root Categories
INSERT INTO categories (name, slug, description, icon, color, sort_order) VALUES
('Writing', 'writing', 'Content creation, copywriting, and writing tasks', '✍️', '#6366f1', 1),
('Image Generation', 'image-generation', 'AI image creation and art generation', '🎨', '#ec4899', 2),
('Coding', 'coding', 'Programming, debugging, and development', '💻', '#8b5cf6', 3),
('Marketing', 'marketing', 'Marketing, sales, and business content', '📊', '#f59e0b', 4),
('Productivity', 'productivity', 'Organization, planning, and efficiency', '⚡', '#10b981', 5),
('Analysis', 'analysis', 'Data analysis, research, and insights', '🔍', '#3b82f6', 6),
('Education', 'education', 'Learning, teaching, and explanations', '📚', '#06b6d4', 7),
('Creative', 'creative', 'Creative thinking and brainstorming', '💡', '#f97316', 8);

-- Subcategories for Writing
INSERT INTO categories (parent_id, name, slug, description, icon, sort_order)
SELECT id, 'Email Sequences', 'email-sequences', 'Email campaigns and drip sequences', '📧', 1
FROM categories WHERE slug = 'writing'
UNION ALL
SELECT id, 'LinkedIn Posts', 'linkedin-posts', 'Professional LinkedIn content', '💼', 2
FROM categories WHERE slug = 'writing'
UNION ALL
SELECT id, 'Social Media', 'social-media', 'Social media posts and captions', '📱', 3
FROM categories WHERE slug = 'writing'
UNION ALL
SELECT id, 'Blog Posts', 'blog-posts', 'Long-form blog content', '📝', 4
FROM categories WHERE slug = 'writing'
UNION ALL
SELECT id, 'Ad Copy', 'ad-copy', 'Advertising and sales copy', '🎯', 5
FROM categories WHERE slug = 'writing'
UNION ALL
SELECT id, 'Landing Pages', 'landing-pages', 'Landing page copywriting', '🌐', 6
FROM categories WHERE slug = 'writing'
UNION ALL
SELECT id, 'Case Studies', 'case-studies', 'Customer success stories', '📄', 7
FROM categories WHERE slug = 'writing'
UNION ALL
SELECT id, 'Cold Outreach', 'cold-outreach', 'Cold emails and DMs', '❄️', 8
FROM categories WHERE slug = 'writing';

-- Subcategories for Image Generation
INSERT INTO categories (parent_id, name, slug, description, icon, sort_order)
SELECT id, 'Illustrations', 'illustrations', 'Digital illustrations and drawings', '🖼️', 1
FROM categories WHERE slug = 'image-generation'
UNION ALL
SELECT id, 'Fashion Shoots', 'fashion-shoots', 'Fashion photography and styling', '👗', 2
FROM categories WHERE slug = 'image-generation'
UNION ALL
SELECT id, 'Product Photos', 'product-photos', 'Product photography', '📦', 3
FROM categories WHERE slug = 'image-generation'
UNION ALL
SELECT id, 'Movie-Style Images', 'movie-style', 'Cinematic and film-like imagery', '🎬', 4
FROM categories WHERE slug = 'image-generation'
UNION ALL
SELECT id, 'Website Heroes', 'website-heroes', 'Hero images for websites', '🖥️', 5
FROM categories WHERE slug = 'image-generation'
UNION ALL
SELECT id, 'Branding Assets', 'branding-assets', 'Logos, icons, and brand visuals', '🎨', 6
FROM categories WHERE slug = 'image-generation'
UNION ALL
SELECT id, 'Posters', 'posters', 'Poster designs and artwork', '🖼️', 7
FROM categories WHERE slug = 'image-generation';

-- ============================================================================
-- TAGS
-- ============================================================================

INSERT INTO tags (name, slug, description, is_featured) VALUES
-- General Tags
('Beginner Friendly', 'beginner-friendly', 'Easy to use for beginners', true),
('Advanced', 'advanced', 'For experienced users', false),
('Quick Win', 'quick-win', 'Fast results with minimal effort', true),
('Trending', 'trending', 'Popular and trending prompts', true),

-- Content Type Tags
('SEO', 'seo', 'Search engine optimized content', true),
('Viral', 'viral', 'Designed for viral reach', true),
('Professional', 'professional', 'Business and corporate tone', false),
('Casual', 'casual', 'Relaxed and friendly tone', false),
('Technical', 'technical', 'Technical and detailed', false),

-- Style Tags
('Minimalist', 'minimalist', 'Clean and simple', false),
('Detailed', 'detailed', 'Comprehensive and thorough', false),
('Creative', 'creative', 'Innovative and unique', true),
('Data-Driven', 'data-driven', 'Focused on metrics and data', false),

-- Image Tags
('Photorealistic', 'photorealistic', 'Photo-like quality', true),
('Artistic', 'artistic', 'Artistic and stylized', false),
('Abstract', 'abstract', 'Abstract visual style', false),
('Vintage', 'vintage', 'Retro and vintage aesthetics', false),
('Modern', 'modern', 'Contemporary style', false),
('Minimalist Design', 'minimalist-design', 'Clean minimal visuals', false),

-- Industry Tags
('SaaS', 'saas', 'Software as a service', false),
('E-commerce', 'ecommerce', 'Online retail', false),
('B2B', 'b2b', 'Business to business', false),
('B2C', 'b2c', 'Business to consumer', false),
('Startup', 'startup', 'Early-stage companies', true),
('Agency', 'agency', 'Marketing and creative agencies', false),

-- Platform Tags
('ChatGPT', 'chatgpt', 'Optimized for ChatGPT', true),
('Claude', 'claude', 'Optimized for Claude', true),
('Gemini', 'gemini', 'Optimized for Gemini', true),
('Midjourney', 'midjourney', 'Midjourney prompts', true),
('Stable Diffusion', 'stable-diffusion', 'SD prompts', false),

-- Use Case Tags
('Sales', 'sales', 'Sales and conversion', true),
('Engagement', 'engagement', 'Audience engagement', false),
('Lead Generation', 'lead-generation', 'Generate leads', true),
('Brand Building', 'brand-building', 'Build brand awareness', false),
('Education', 'education', 'Educational content', false),
('Entertainment', 'entertainment', 'Entertaining content', false);
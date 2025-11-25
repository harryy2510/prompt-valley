-- Add image and example support to prompts
ALTER TABLE prompts
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS example_output TEXT,
ADD COLUMN IF NOT EXISTS example_output_images TEXT[] DEFAULT '{}';

-- Create index for image_url queries
CREATE INDEX IF NOT EXISTS idx_prompts_image_url ON prompts(image_url) WHERE image_url IS NOT NULL;

-- Add new categories for image generation
ALTER TYPE prompt_category ADD VALUE IF NOT EXISTS 'image_generation';
ALTER TYPE prompt_category ADD VALUE IF NOT EXISTS 'character_design';
ALTER TYPE prompt_category ADD VALUE IF NOT EXISTS 'photography';
ALTER TYPE prompt_category ADD VALUE IF NOT EXISTS 'writing';

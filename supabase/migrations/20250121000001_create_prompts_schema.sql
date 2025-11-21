-- Create categories enum
CREATE TYPE prompt_category AS ENUM (
  'content_creation',
  'marketing',
  'coding',
  'productivity',
  'education',
  'business',
  'creative',
  'analysis',
  'other'
);

-- Create AI platform enum
CREATE TYPE ai_platform AS ENUM (
  'chatgpt',
  'claude',
  'gemini',
  'grok',
  'midjourney',
  'stable_diffusion',
  'all'
);

-- Create collections table (for organizing personal prompts)
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create prompts table
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,

  -- Prompt content
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,

  -- Categorization
  category prompt_category NOT NULL DEFAULT 'other',
  platform ai_platform NOT NULL DEFAULT 'all',
  tags TEXT[] DEFAULT '{}',

  -- Metadata
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_curated BOOLEAN NOT NULL DEFAULT FALSE,

  -- Usage tracking
  use_count INTEGER NOT NULL DEFAULT 0,
  favorite_count INTEGER NOT NULL DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_title_length CHECK (char_length(title) >= 3 AND char_length(title) <= 200),
  CONSTRAINT valid_content_length CHECK (char_length(content) >= 10)
);

-- Create favorites table (for users to save prompts)
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure a user can only favorite a prompt once
  UNIQUE(user_id, prompt_id)
);

-- Create prompt_usage table (for tracking when prompts are used)
CREATE TABLE prompt_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_prompts_user_id ON prompts(user_id);
CREATE INDEX idx_prompts_collection_id ON prompts(collection_id);
CREATE INDEX idx_prompts_category ON prompts(category);
CREATE INDEX idx_prompts_platform ON prompts(platform);
CREATE INDEX idx_prompts_is_public ON prompts(is_public);
CREATE INDEX idx_prompts_is_featured ON prompts(is_featured);
CREATE INDEX idx_prompts_is_curated ON prompts(is_curated);
CREATE INDEX idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX idx_prompts_tags ON prompts USING GIN(tags);

CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_prompt_id ON favorites(prompt_id);
CREATE INDEX idx_prompt_usage_user_id ON prompt_usage(user_id);
CREATE INDEX idx_prompt_usage_prompt_id ON prompt_usage(prompt_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment use_count
CREATE OR REPLACE FUNCTION increment_prompt_use_count(prompt_uuid UUID, user_uuid UUID)
RETURNS void AS $$
BEGIN
  -- Update the prompt use count
  UPDATE prompts
  SET use_count = use_count + 1
  WHERE id = prompt_uuid;

  -- Insert usage record
  INSERT INTO prompt_usage (user_id, prompt_id)
  VALUES (user_uuid, prompt_uuid);
END;
$$ LANGUAGE plpgsql;

-- Create function to toggle favorite
CREATE OR REPLACE FUNCTION toggle_favorite(prompt_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  favorite_exists BOOLEAN;
BEGIN
  -- Check if favorite exists
  SELECT EXISTS(
    SELECT 1 FROM favorites
    WHERE user_id = user_uuid AND prompt_id = prompt_uuid
  ) INTO favorite_exists;

  IF favorite_exists THEN
    -- Remove favorite
    DELETE FROM favorites
    WHERE user_id = user_uuid AND prompt_id = prompt_uuid;

    -- Decrement favorite count
    UPDATE prompts
    SET favorite_count = GREATEST(favorite_count - 1, 0)
    WHERE id = prompt_uuid;

    RETURN FALSE;
  ELSE
    -- Add favorite
    INSERT INTO favorites (user_id, prompt_id)
    VALUES (user_uuid, prompt_uuid);

    -- Increment favorite count
    UPDATE prompts
    SET favorite_count = favorite_count + 1
    WHERE id = prompt_uuid;

    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_usage ENABLE ROW LEVEL SECURITY;

-- Collections policies
CREATE POLICY "Users can view their own collections"
  ON collections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own collections"
  ON collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
  ON collections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
  ON collections FOR DELETE
  USING (auth.uid() = user_id);

-- Prompts policies
CREATE POLICY "Anyone can view public and curated prompts"
  ON prompts FOR SELECT
  USING (is_public = true OR is_curated = true OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can create prompts"
  ON prompts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prompts"
  ON prompts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prompts"
  ON prompts FOR DELETE
  USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Prompt usage policies
CREATE POLICY "Users can view their own usage"
  ON prompt_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own usage records"
  ON prompt_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);


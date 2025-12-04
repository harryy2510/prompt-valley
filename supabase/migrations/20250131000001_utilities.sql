-- ============================================================================
-- UTILITIES
-- Shared functions used across multiple tables
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function to auto-generate slug from name if id is not provided
CREATE OR REPLACE FUNCTION generate_slug_from_name()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    NEW.id = lower(regexp_replace(trim(NEW.name), '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.id = regexp_replace(NEW.id, '^-+|-+$', '', 'g');
  END IF;
  RETURN NEW;
END;
$$;

-- Function to auto-generate slug from title if id is not provided
CREATE OR REPLACE FUNCTION generate_slug_from_title()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    NEW.id = lower(regexp_replace(trim(NEW.title), '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.id = regexp_replace(NEW.id, '^-+|-+$', '', 'g');
  END IF;
  RETURN NEW;
END;
$$;
-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE tier AS ENUM ('free', 'pro');

CREATE TYPE model_capability AS ENUM ('text', 'image', 'video', 'code');

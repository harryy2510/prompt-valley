-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE tier AS ENUM ('free', 'pro');

CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TYPE model_capability AS ENUM ('text', 'image', 'video', 'code');

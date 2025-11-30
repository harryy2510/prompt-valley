/**
 * Database types for PromptValley
 * Generated from Supabase schema
 * Last updated: 2025-01-30
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================================================
// ENUMS
// ============================================================================

export type AccessLevel = 'free' | 'pro'
export type ModelCapability = 'text' | 'image' | 'video' | 'audio' | 'code' | 'vision' | 'multimodal'
export type SubscriptionTier = 'free' | 'pro' | 'enterprise'

// ============================================================================
// TABLE TYPES
// ============================================================================

export interface AIProvider {
  id: string
  name: string
  display_name: string
  slug: string
  logo_url: string | null
  website_url: string | null
  description: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface AIModel {
  id: string
  provider_id: string
  model_id: string
  model_name: string
  model_version: string | null
  slug: string
  capabilities: ModelCapability[]
  context_window: number | null
  max_output_tokens: number | null
  cost_input_per_million: number | null
  cost_output_per_million: number | null
  description: string | null
  is_active: boolean
  is_featured: boolean
  release_date: string | null
  deprecation_date: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  parent_id: string | null
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  description: string | null
  usage_count: number
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Prompt {
  id: string
  title: string
  slug: string
  description: string | null
  content: string // PROTECTED - access controlled by access_level
  category_id: string | null
  access_level: AccessLevel
  views_count: number
  saves_count: number
  copies_count: number
  is_featured: boolean
  is_published: boolean
  featured_order: number | null
  meta_title: string | null
  meta_description: string | null
  created_by: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
  published_at: string | null
}

export interface PromptImage {
  id: string
  prompt_id: string
  image_url: string
  alt_text: string | null
  caption: string | null
  sort_order: number
  is_primary: boolean
  width: number | null
  height: number | null
  file_size: number | null
  created_at: string
}

export interface PromptTag {
  prompt_id: string
  tag_id: string
  created_at: string
}

export interface PromptModel {
  prompt_id: string
  model_id: string
  recommended_settings: Json | null
  is_primary: boolean
  created_at: string
}

export interface UserFavorite {
  id: string
  user_id: string
  prompt_id: string
  notes: string | null
  created_at: string
}

export interface UserSubscription {
  id: string
  user_id: string
  tier: SubscriptionTier
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  is_active: boolean
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  canceled_at: string | null
  created_at: string
  updated_at: string
}

// ============================================================================
// DATABASE INTERFACE
// ============================================================================

export interface Database {
  public: {
    Tables: {
      ai_providers: {
        Row: AIProvider
        Insert: Omit<AIProvider, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<AIProvider, 'id' | 'created_at' | 'updated_at'>>
      }
      ai_models: {
        Row: AIModel
        Insert: Omit<AIModel, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<AIModel, 'id' | 'created_at' | 'updated_at'>>
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>
      }
      tags: {
        Row: Tag
        Insert: Omit<Tag, 'id' | 'usage_count' | 'created_at' | 'updated_at'> & {
          id?: string
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Tag, 'id' | 'usage_count' | 'created_at' | 'updated_at'>>
      }
      prompts: {
        Row: Prompt
        Insert: Omit<Prompt, 'id' | 'views_count' | 'saves_count' | 'copies_count' | 'created_at' | 'updated_at'> & {
          id?: string
          views_count?: number
          saves_count?: number
          copies_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Prompt, 'id' | 'views_count' | 'saves_count' | 'copies_count' | 'created_at' | 'updated_at'>>
      }
      prompt_images: {
        Row: PromptImage
        Insert: Omit<PromptImage, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<PromptImage, 'id' | 'created_at'>>
      }
      prompt_tags: {
        Row: PromptTag
        Insert: Omit<PromptTag, 'created_at'> & {
          created_at?: string
        }
        Update: never
      }
      prompt_models: {
        Row: PromptModel
        Insert: Omit<PromptModel, 'created_at'> & {
          created_at?: string
        }
        Update: Partial<Omit<PromptModel, 'prompt_id' | 'model_id' | 'created_at'>>
      }
      user_favorites: {
        Row: UserFavorite
        Insert: Omit<UserFavorite, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<UserFavorite, 'id' | 'user_id' | 'prompt_id' | 'created_at'>>
      }
      user_subscriptions: {
        Row: UserSubscription
        Insert: Omit<UserSubscription, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<UserSubscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
    }
    Views: Record<string, never>
    Functions: {
      user_has_pro_access: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      get_prompt_content: {
        Args: { prompt_uuid: string; user_uuid: string }
        Returns: {
          id: string
          title: string
          slug: string
          description: string | null
          content: string | null
          access_level: AccessLevel
          has_access: boolean
        }[]
      }
      increment_prompt_views: {
        Args: { prompt_uuid: string }
        Returns: void
      }
      increment_prompt_copies: {
        Args: { prompt_uuid: string }
        Returns: void
      }
    }
    Enums: {
      access_level: AccessLevel
      model_capability: ModelCapability
      subscription_tier: SubscriptionTier
    }
  }
}

// ============================================================================
// HELPER TYPES
// ============================================================================

// Prompt with relations
export interface PromptWithRelations extends Prompt {
  category?: Category | null
  tags?: Tag[]
  models?: (PromptModel & { model: AIModel })[]
  images?: PromptImage[]
  is_favorited?: boolean
}

// AI Model with provider
export interface AIModelWithProvider extends AIModel {
  provider: AIProvider
}

// Category with children
export interface CategoryWithChildren extends Category {
  children?: Category[]
  parent?: Category | null
}

// User with subscription
export interface UserWithSubscription {
  user_id: string
  subscription?: UserSubscription | null
  has_pro_access: boolean
}

// ============================================================================
// TYPE HELPERS (for Supabase client)
// ============================================================================

type DatabaseWithoutInternals = Database

type DefaultSchema = DatabaseWithoutInternals['public']

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

// ============================================================================
// CONSTANTS
// ============================================================================

export const Constants = {
  public: {
    Enums: {
      access_level: ['free', 'pro'] as const,
      model_capability: ['text', 'image', 'video', 'audio', 'code', 'vision', 'multimodal'] as const,
      subscription_tier: ['free', 'pro', 'enterprise'] as const,
    },
  },
} as const
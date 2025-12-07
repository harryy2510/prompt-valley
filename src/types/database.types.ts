export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_models: {
        Row: {
          capabilities: Database["public"]["Enums"]["model_capability"][]
          context_window: number | null
          cost_input_per_million: number | null
          cost_output_per_million: number | null
          created_at: string
          id: string
          max_output_tokens: number | null
          name: string
          provider_id: string
          updated_at: string
        }
        Insert: {
          capabilities?: Database["public"]["Enums"]["model_capability"][]
          context_window?: number | null
          cost_input_per_million?: number | null
          cost_output_per_million?: number | null
          created_at?: string
          id: string
          max_output_tokens?: number | null
          name: string
          provider_id: string
          updated_at?: string
        }
        Update: {
          capabilities?: Database["public"]["Enums"]["model_capability"][]
          context_window?: number | null
          cost_input_per_million?: number | null
          cost_output_per_million?: number | null
          created_at?: string
          id?: string
          max_output_tokens?: number | null
          name?: string
          provider_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_models_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "ai_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_providers: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          id: string
          logo_url?: string | null
          name: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_models: {
        Row: {
          created_at: string
          model_id: string
          prompt_id: string
        }
        Insert: {
          created_at?: string
          model_id: string
          prompt_id: string
        }
        Update: {
          created_at?: string
          model_id?: string
          prompt_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_models_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_models_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_models_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts_with_access"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_tags: {
        Row: {
          created_at: string
          prompt_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          prompt_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          prompt_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_tags_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_tags_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts_with_access"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          category_id: string | null
          content: string
          copies_count: number
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          images: string[] | null
          is_featured: boolean
          is_published: boolean
          published_at: string | null
          saves_count: number
          sort_order: number | null
          tier: Database["public"]["Enums"]["tier"]
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          category_id?: string | null
          content: string
          copies_count?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id: string
          images?: string[] | null
          is_featured?: boolean
          is_published?: boolean
          published_at?: string | null
          saves_count?: number
          sort_order?: number | null
          tier?: Database["public"]["Enums"]["tier"]
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          category_id?: string | null
          content?: string
          copies_count?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean
          is_published?: boolean
          published_at?: string | null
          saves_count?: number
          sort_order?: number | null
          tier?: Database["public"]["Enums"]["tier"]
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "prompts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_coupons: {
        Row: {
          amount_off: number | null
          applies_to_products: string[] | null
          created_at: string
          currency: string | null
          duration: Database["public"]["Enums"]["coupon_duration"]
          duration_in_months: number | null
          id: string
          max_redemptions: number | null
          metadata: Json | null
          name: string | null
          percent_off: number | null
          redeem_by: string | null
          times_redeemed: number
          updated_at: string
          valid: boolean
        }
        Insert: {
          amount_off?: number | null
          applies_to_products?: string[] | null
          created_at?: string
          currency?: string | null
          duration?: Database["public"]["Enums"]["coupon_duration"]
          duration_in_months?: number | null
          id: string
          max_redemptions?: number | null
          metadata?: Json | null
          name?: string | null
          percent_off?: number | null
          redeem_by?: string | null
          times_redeemed?: number
          updated_at?: string
          valid?: boolean
        }
        Update: {
          amount_off?: number | null
          applies_to_products?: string[] | null
          created_at?: string
          currency?: string | null
          duration?: Database["public"]["Enums"]["coupon_duration"]
          duration_in_months?: number | null
          id?: string
          max_redemptions?: number | null
          metadata?: Json | null
          name?: string | null
          percent_off?: number | null
          redeem_by?: string | null
          times_redeemed?: number
          updated_at?: string
          valid?: boolean
        }
        Relationships: []
      }
      stripe_prices: {
        Row: {
          active: boolean
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          nickname: string | null
          product_id: string
          recurring_interval:
            | Database["public"]["Enums"]["billing_interval"]
            | null
          recurring_interval_count: number | null
          unit_amount: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          currency?: string
          id: string
          metadata?: Json | null
          nickname?: string | null
          product_id: string
          recurring_interval?:
            | Database["public"]["Enums"]["billing_interval"]
            | null
          recurring_interval_count?: number | null
          unit_amount: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          nickname?: string | null
          product_id?: string
          recurring_interval?:
            | Database["public"]["Enums"]["billing_interval"]
            | null
          recurring_interval_count?: number | null
          unit_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "stripe_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stripe_prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "stripe_products_with_prices"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_products: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          display_order: number | null
          features: string[] | null
          highlight: string | null
          id: string
          images: string[] | null
          metadata: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          display_order?: number | null
          features?: string[] | null
          highlight?: string | null
          id: string
          images?: string[] | null
          metadata?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          display_order?: number | null
          features?: string[] | null
          highlight?: string | null
          id?: string
          images?: string[] | null
          metadata?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      stripe_promotion_codes: {
        Row: {
          active: boolean
          code: string
          coupon_id: string
          created_at: string
          expires_at: string | null
          first_time_transaction: boolean | null
          id: string
          max_redemptions: number | null
          metadata: Json | null
          minimum_amount: number | null
          minimum_amount_currency: string | null
          times_redeemed: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          code: string
          coupon_id: string
          created_at?: string
          expires_at?: string | null
          first_time_transaction?: boolean | null
          id: string
          max_redemptions?: number | null
          metadata?: Json | null
          minimum_amount?: number | null
          minimum_amount_currency?: string | null
          times_redeemed?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          code?: string
          coupon_id?: string
          created_at?: string
          expires_at?: string | null
          first_time_transaction?: boolean | null
          id?: string
          max_redemptions?: number | null
          metadata?: Json | null
          minimum_amount?: number | null
          minimum_amount_currency?: string | null
          times_redeemed?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_promotion_codes_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "stripe_coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          prompt_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          prompt_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          prompt_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts_with_access"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          role: Database["public"]["Enums"]["user_role"]
          stripe_cancel_at_period_end: boolean | null
          stripe_canceled_at: string | null
          stripe_current_period_end: string | null
          stripe_current_period_start: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          stripe_subscription_status: string | null
          tier: Database["public"]["Enums"]["tier"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          stripe_cancel_at_period_end?: boolean | null
          stripe_canceled_at?: string | null
          stripe_current_period_end?: string | null
          stripe_current_period_start?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_subscription_status?: string | null
          tier?: Database["public"]["Enums"]["tier"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          stripe_cancel_at_period_end?: boolean | null
          stripe_canceled_at?: string | null
          stripe_current_period_end?: string | null
          stripe_current_period_start?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_subscription_status?: string | null
          tier?: Database["public"]["Enums"]["tier"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      prompts_with_access: {
        Row: {
          category_id: string | null
          content: string | null
          copies_count: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string | null
          images: string[] | null
          is_featured: boolean | null
          is_published: boolean | null
          published_at: string | null
          saves_count: number | null
          sort_order: number | null
          tier: Database["public"]["Enums"]["tier"] | null
          title: string | null
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          category_id?: string | null
          content?: never
          copies_count?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string | null
          images?: string[] | null
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          saves_count?: number | null
          sort_order?: number | null
          tier?: Database["public"]["Enums"]["tier"] | null
          title?: string | null
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          category_id?: string | null
          content?: never
          copies_count?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string | null
          images?: string[] | null
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          saves_count?: number | null
          sort_order?: number | null
          tier?: Database["public"]["Enums"]["tier"] | null
          title?: string | null
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prompts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_products_with_prices: {
        Row: {
          active: boolean | null
          description: string | null
          display_order: number | null
          features: string[] | null
          highlight: string | null
          id: string | null
          images: string[] | null
          metadata: Json | null
          name: string | null
          prices: Json | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string | null
          name: string | null
          tier: Database["public"]["Enums"]["tier"] | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          name?: string | null
          tier?: Database["public"]["Enums"]["tier"] | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          name?: string | null
          tier?: Database["public"]["Enums"]["tier"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_billing_info: { Args: { user_id_param: string }; Returns: Json }
      handle_stripe_coupon_webhook: {
        Args: { payload: Json }
        Returns: undefined
      }
      handle_stripe_price_webhook: {
        Args: { payload: Json }
        Returns: undefined
      }
      handle_stripe_product_webhook: {
        Args: { payload: Json }
        Returns: undefined
      }
      handle_stripe_promotion_code_webhook: {
        Args: { payload: Json }
        Returns: undefined
      }
      handle_stripe_webhook: { Args: { payload: Json }; Returns: undefined }
      increment_prompt_copies: {
        Args: { prompt_text_id: string }
        Returns: undefined
      }
      increment_prompt_views: {
        Args: { prompt_text_id: string }
        Returns: undefined
      }
      user_can_access_pro_content: { Args: never; Returns: boolean }
      validate_promotion_code: { Args: { code_param: string }; Returns: Json }
    }
    Enums: {
      billing_interval: "day" | "week" | "month" | "year"
      coupon_duration: "once" | "repeating" | "forever"
      model_capability: "text" | "image" | "video" | "code"
      stripe_status: "active" | "inactive" | "archived"
      tier: "free" | "pro"
      user_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      billing_interval: ["day", "week", "month", "year"],
      coupon_duration: ["once", "repeating", "forever"],
      model_capability: ["text", "image", "video", "code"],
      stripe_status: ["active", "inactive", "archived"],
      tier: ["free", "pro"],
      user_role: ["user", "admin"],
    },
  },
} as const

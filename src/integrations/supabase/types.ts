export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appliance_models: {
        Row: {
          appliance_type: string
          brand: string
          company_id: string | null
          created_at: string
          id: string
          model: string
          serial_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          appliance_type: string
          brand: string
          company_id?: string | null
          created_at?: string
          id?: string
          model: string
          serial_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          appliance_type?: string
          brand?: string
          company_id?: string | null
          created_at?: string
          id?: string
          model?: string
          serial_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appliance_models_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          appliance_brand: string
          appliance_model: string | null
          appliance_type: string
          company_id: string | null
          created_at: string
          customer_address: string | null
          customer_name: string
          customer_phone: string | null
          estimated_time: string | null
          id: string
          initial_diagnosis: string | null
          labor_cost: string | null
          parts_cost: string | null
          parts_needed: string | null
          problem_description: string
          serial_number: string | null
          service_type: string | null
          status: string
          technician_notes: string | null
          updated_at: string
          user_id: string
          warranty_status: string | null
        }
        Insert: {
          appliance_brand: string
          appliance_model?: string | null
          appliance_type: string
          company_id?: string | null
          created_at?: string
          customer_address?: string | null
          customer_name: string
          customer_phone?: string | null
          estimated_time?: string | null
          id?: string
          initial_diagnosis?: string | null
          labor_cost?: string | null
          parts_cost?: string | null
          parts_needed?: string | null
          problem_description: string
          serial_number?: string | null
          service_type?: string | null
          status?: string
          technician_notes?: string | null
          updated_at?: string
          user_id: string
          warranty_status?: string | null
        }
        Update: {
          appliance_brand?: string
          appliance_model?: string | null
          appliance_type?: string
          company_id?: string | null
          created_at?: string
          customer_address?: string | null
          customer_name?: string
          customer_phone?: string | null
          estimated_time?: string | null
          id?: string
          initial_diagnosis?: string | null
          labor_cost?: string | null
          parts_cost?: string | null
          parts_needed?: string | null
          problem_description?: string
          serial_number?: string | null
          service_type?: string | null
          status?: string
          technician_notes?: string | null
          updated_at?: string
          user_id?: string
          warranty_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          primary_color: string | null
          secondary_color: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          primary_color?: string | null
          secondary_color?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_users: {
        Row: {
          company_id: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["company_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["company_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["company_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_usage: {
        Row: {
          company_id: string
          created_at: string
          feature_name: string
          id: string
          reset_date: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          company_id: string
          created_at?: string
          feature_name: string
          id?: string
          reset_date?: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          company_id?: string
          created_at?: string
          feature_name?: string
          id?: string
          reset_date?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "feature_usage_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      parts: {
        Row: {
          appliance_brand: string | null
          appliance_model: string | null
          appliance_type: string | null
          company_id: string | null
          created_at: string
          id: string
          part_name: string
          part_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appliance_brand?: string | null
          appliance_model?: string | null
          appliance_type?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          part_name: string
          part_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appliance_brand?: string | null
          appliance_model?: string | null
          appliance_type?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          part_name?: string
          part_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          agreements_date: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          policy_agreed: boolean | null
          terms_agreed: boolean | null
          updated_at: string
        }
        Insert: {
          agreements_date?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          policy_agreed?: boolean | null
          terms_agreed?: boolean | null
          updated_at?: string
        }
        Update: {
          agreements_date?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          policy_agreed?: boolean | null
          terms_agreed?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      subscription_features: {
        Row: {
          created_at: string
          enabled: boolean
          feature_limit: number | null
          feature_name: string
          id: string
          tier: Database["public"]["Enums"]["subscription_tier"]
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          feature_limit?: number | null
          feature_name: string
          id?: string
          tier: Database["public"]["Enums"]["subscription_tier"]
        }
        Update: {
          created_at?: string
          enabled?: boolean
          feature_limit?: number | null
          feature_name?: string
          id?: string
          tier?: Database["public"]["Enums"]["subscription_tier"]
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          company_id: string
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          trial_end: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          trial_end?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          trial_end?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_usage_limit: {
        Args: { _company_id: string; _feature_name: string }
        Returns: boolean
      }
      get_feature_limit: {
        Args: { _company_id: string; _feature_name: string }
        Returns: number
      }
      get_user_company: {
        Args: { _user_id: string }
        Returns: string
      }
      get_user_company_id: {
        Args: { user_id_param: string }
        Returns: string
      }
      has_feature_access: {
        Args: { _company_id: string; _feature_name: string }
        Returns: boolean
      }
      increment_usage: {
        Args: { _company_id: string; _feature_name: string }
        Returns: undefined
      }
    }
    Enums: {
      company_role: "owner" | "admin" | "member"
      subscription_tier: "free" | "basic" | "professional" | "enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      company_role: ["owner", "admin", "member"],
      subscription_tier: ["free", "basic", "professional", "enterprise"],
    },
  },
} as const

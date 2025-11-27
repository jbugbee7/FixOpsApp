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
      appliance_models: {
        Row: {
          appliance_type: string | null
          brand: string
          created_at: string | null
          id: string
          model: string
          updated_at: string | null
        }
        Insert: {
          appliance_type?: string | null
          brand: string
          created_at?: string | null
          id?: string
          model: string
          updated_at?: string | null
        }
        Update: {
          appliance_type?: string | null
          brand?: string
          created_at?: string | null
          id?: string
          model?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cases: {
        Row: {
          appliance_brand: string | null
          appliance_model: string | null
          appliance_type: string | null
          authorization_signature: string | null
          authorization_signature_date: string | null
          authorization_signed_by: string | null
          company_id: string | null
          completed_date: string | null
          completion_signature: string | null
          completion_signature_date: string | null
          completion_signed_by: string | null
          created_at: string | null
          customer_address: string | null
          customer_address_line_2: string | null
          customer_city: string | null
          customer_id: string | null
          customer_state: string | null
          customer_zip_code: string | null
          diagnosis: string | null
          id: string
          issue_description: string | null
          labor_cost: number | null
          parts_cost: number | null
          payment_amount: number | null
          payment_date: string | null
          payment_intent_id: string | null
          payment_status: string | null
          resolution: string | null
          scheduled_date: string | null
          service_type: string | null
          status: string | null
          technician_id: string | null
          total_cost: number | null
          updated_at: string | null
        }
        Insert: {
          appliance_brand?: string | null
          appliance_model?: string | null
          appliance_type?: string | null
          authorization_signature?: string | null
          authorization_signature_date?: string | null
          authorization_signed_by?: string | null
          company_id?: string | null
          completed_date?: string | null
          completion_signature?: string | null
          completion_signature_date?: string | null
          completion_signed_by?: string | null
          created_at?: string | null
          customer_address?: string | null
          customer_address_line_2?: string | null
          customer_city?: string | null
          customer_id?: string | null
          customer_state?: string | null
          customer_zip_code?: string | null
          diagnosis?: string | null
          id?: string
          issue_description?: string | null
          labor_cost?: number | null
          parts_cost?: number | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_intent_id?: string | null
          payment_status?: string | null
          resolution?: string | null
          scheduled_date?: string | null
          service_type?: string | null
          status?: string | null
          technician_id?: string | null
          total_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          appliance_brand?: string | null
          appliance_model?: string | null
          appliance_type?: string | null
          authorization_signature?: string | null
          authorization_signature_date?: string | null
          authorization_signed_by?: string | null
          company_id?: string | null
          completed_date?: string | null
          completion_signature?: string | null
          completion_signature_date?: string | null
          completion_signed_by?: string | null
          created_at?: string | null
          customer_address?: string | null
          customer_address_line_2?: string | null
          customer_city?: string | null
          customer_id?: string | null
          customer_state?: string | null
          customer_zip_code?: string | null
          diagnosis?: string | null
          id?: string
          issue_description?: string | null
          labor_cost?: number | null
          parts_cost?: number | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_intent_id?: string | null
          payment_status?: string | null
          resolution?: string | null
          scheduled_date?: string | null
          service_type?: string | null
          status?: string | null
          technician_id?: string | null
          total_cost?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      conversation_members: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_members_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          is_group: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_group?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_group?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          company_id: string
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          company_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          company_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          case_id: string | null
          category: string | null
          company_id: string
          created_at: string | null
          description: string | null
          expense_date: string
          id: string
          is_billable: boolean | null
          updated_at: string | null
          vendor: string | null
        }
        Insert: {
          amount: number
          case_id?: string | null
          category?: string | null
          company_id: string
          created_at?: string | null
          description?: string | null
          expense_date: string
          id?: string
          is_billable?: boolean | null
          updated_at?: string | null
          vendor?: string | null
        }
        Update: {
          amount?: number
          case_id?: string | null
          category?: string | null
          company_id?: string
          created_at?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          is_billable?: boolean | null
          updated_at?: string | null
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          name: string
          quantity: number | null
          reorder_point: number | null
          sku: string | null
          unit_cost: number | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          name: string
          quantity?: number | null
          reorder_point?: number | null
          sku?: string | null
          unit_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          name?: string
          quantity?: number | null
          reorder_point?: number | null
          sku?: string | null
          unit_cost?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          case_id: string | null
          company_id: string
          created_at: string | null
          customer_id: string | null
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          status: string | null
          subtotal: number | null
          tax: number | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          case_id?: string | null
          company_id: string
          created_at?: string | null
          customer_id?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date: string
          notes?: string | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          case_id?: string | null
          company_id?: string
          created_at?: string | null
          customer_id?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      job_checklists: {
        Row: {
          company_id: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          items: Json | null
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          items?: Json | null
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          items?: Json | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_checklists_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      job_schedules: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          case_id: string | null
          company_id: string
          created_at: string | null
          id: string
          notes: string | null
          scheduled_end: string
          scheduled_start: string
          status: string | null
          technician_id: string | null
          updated_at: string | null
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          case_id?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          scheduled_end: string
          scheduled_start: string
          status?: string | null
          technician_id?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          case_id?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          scheduled_end?: string
          scheduled_start?: string
          status?: string | null
          technician_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_schedules_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_schedules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_schedules_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      parts: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          part_name: string
          part_number: string | null
          price: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          part_name: string
          part_number?: string | null
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          part_name?: string
          part_number?: string | null
          price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          company_id: string
          created_at: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          payment_date: string
          payment_method: string | null
        }
        Insert: {
          amount: number
          company_id: string
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date: string
          payment_method?: string | null
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          agreements_date: string | null
          company_id: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          phone_number: string | null
          phone_verified: boolean | null
          policy_agreed: boolean | null
          terms_agreed: boolean | null
          updated_at: string | null
          verification_code: string | null
          verification_code_expires_at: string | null
        }
        Insert: {
          agreements_date?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id: string
          phone_number?: string | null
          phone_verified?: boolean | null
          policy_agreed?: boolean | null
          terms_agreed?: boolean | null
          updated_at?: string | null
          verification_code?: string | null
          verification_code_expires_at?: string | null
        }
        Update: {
          agreements_date?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone_number?: string | null
          phone_verified?: boolean | null
          policy_agreed?: boolean | null
          terms_agreed?: boolean | null
          updated_at?: string | null
          verification_code?: string | null
          verification_code_expires_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      technicians: {
        Row: {
          company_id: string
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          specialties: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          specialties?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          specialties?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technicians_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workflow_rules: {
        Row: {
          action: string
          company_id: string
          created_at: string | null
          enabled: boolean | null
          execution_count: number | null
          id: string
          name: string
          trigger: string
          updated_at: string | null
        }
        Insert: {
          action: string
          company_id: string
          created_at?: string | null
          enabled?: boolean | null
          execution_count?: number | null
          id?: string
          name: string
          trigger: string
          updated_at?: string | null
        }
        Update: {
          action?: string
          company_id?: string
          created_at?: string | null
          enabled?: boolean | null
          execution_count?: number | null
          id?: string
          name?: string
          trigger?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "technician" | "user"
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
      app_role: ["admin", "technician", "user"],
    },
  },
} as const

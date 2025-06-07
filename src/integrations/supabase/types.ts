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
        Relationships: []
      }
      automated_tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          customer_id: number
          description: string | null
          due_date: string | null
          id: string
          priority: string
          status: string
          task_type: string
          title: string
          updated_at: string
          workflow_rule_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_id: number
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          task_type: string
          title: string
          updated_at?: string
          workflow_rule_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: number
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          task_type?: string
          title?: string
          updated_at?: string
          workflow_rule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automated_tasks_workflow_rule_id_fkey"
            columns: ["workflow_rule_id"]
            isOneToOne: false
            referencedRelation: "workflow_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      case_parts: {
        Row: {
          case_id: string
          created_at: string
          final_price: number
          id: string
          markup_percentage: number
          part_cost: number
          part_name: string
          part_number: string
          quantity: number
          updated_at: string
        }
        Insert: {
          case_id: string
          created_at?: string
          final_price?: number
          id?: string
          markup_percentage?: number
          part_cost?: number
          part_name: string
          part_number: string
          quantity?: number
          updated_at?: string
        }
        Update: {
          case_id?: string
          created_at?: string
          final_price?: number
          id?: string
          markup_percentage?: number
          part_cost?: number
          part_name?: string
          part_number?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_parts_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          appliance_brand: string
          appliance_model: string | null
          appliance_type: string
          cancellation_reason: string | null
          company_id: string | null
          created_at: string
          customer_address: string | null
          customer_address_line_2: string | null
          customer_city: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          customer_state: string | null
          customer_zip_code: string | null
          diagnostic_fee_amount: number | null
          diagnostic_fee_type: string | null
          estimated_time: string | null
          id: string
          initial_diagnosis: string | null
          labor_cost: string | null
          labor_cost_calculated: number | null
          labor_level: number | null
          parts_cost: string | null
          parts_needed: string | null
          photos: string[] | null
          problem_description: string
          serial_number: string | null
          service_type: string | null
          spt_status: string | null
          status: string
          technician_notes: string | null
          updated_at: string
          user_id: string
          warranty_status: string | null
          wo_number: string | null
        }
        Insert: {
          appliance_brand: string
          appliance_model?: string | null
          appliance_type: string
          cancellation_reason?: string | null
          company_id?: string | null
          created_at?: string
          customer_address?: string | null
          customer_address_line_2?: string | null
          customer_city?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          customer_state?: string | null
          customer_zip_code?: string | null
          diagnostic_fee_amount?: number | null
          diagnostic_fee_type?: string | null
          estimated_time?: string | null
          id?: string
          initial_diagnosis?: string | null
          labor_cost?: string | null
          labor_cost_calculated?: number | null
          labor_level?: number | null
          parts_cost?: string | null
          parts_needed?: string | null
          photos?: string[] | null
          problem_description: string
          serial_number?: string | null
          service_type?: string | null
          spt_status?: string | null
          status?: string
          technician_notes?: string | null
          updated_at?: string
          user_id: string
          warranty_status?: string | null
          wo_number?: string | null
        }
        Update: {
          appliance_brand?: string
          appliance_model?: string | null
          appliance_type?: string
          cancellation_reason?: string | null
          company_id?: string | null
          created_at?: string
          customer_address?: string | null
          customer_address_line_2?: string | null
          customer_city?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          customer_state?: string | null
          customer_zip_code?: string | null
          diagnostic_fee_amount?: number | null
          diagnostic_fee_type?: string | null
          estimated_time?: string | null
          id?: string
          initial_diagnosis?: string | null
          labor_cost?: string | null
          labor_cost_calculated?: number | null
          labor_level?: number | null
          parts_cost?: string | null
          parts_needed?: string | null
          photos?: string[] | null
          problem_description?: string
          serial_number?: string | null
          service_type?: string | null
          spt_status?: string | null
          status?: string
          technician_notes?: string | null
          updated_at?: string
          user_id?: string
          warranty_status?: string | null
          wo_number?: string | null
        }
        Relationships: []
      }
      communication_history: {
        Row: {
          content: string | null
          customer_id: number
          delivered_at: string | null
          id: string
          metadata: Json | null
          opened_at: string | null
          sent_at: string
          status: string
          subject: string | null
          template_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          customer_id: number
          delivered_at?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          sent_at?: string
          status?: string
          subject?: string | null
          template_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          content?: string | null
          customer_id?: number
          delivered_at?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          sent_at?: string
          status?: string
          subject?: string | null
          template_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communication_history_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "communication_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_templates: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          subject: string | null
          type: string
          updated_at: string
          user_id: string
          variables: Json | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          subject?: string | null
          type: string
          updated_at?: string
          user_id: string
          variables?: Json | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string | null
          type?: string
          updated_at?: string
          user_id?: string
          variables?: Json | null
        }
        Relationships: []
      }
      contact_interactions: {
        Row: {
          attachments: Json | null
          created_at: string
          customer_id: number
          description: string | null
          follow_up_date: string | null
          id: string
          interaction_date: string
          interaction_type: string
          metadata: Json | null
          outcome: string | null
          priority: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          customer_id: number
          description?: string | null
          follow_up_date?: string | null
          id?: string
          interaction_date?: string
          interaction_type: string
          metadata?: Json | null
          outcome?: string | null
          priority?: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          customer_id?: number
          description?: string | null
          follow_up_date?: string | null
          id?: string
          interaction_date?: string
          interaction_type?: string
          metadata?: Json | null
          outcome?: string | null
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversation_members: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
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
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_analytics: {
        Row: {
          calculated_at: string
          customer_id: number
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          period_end: string | null
          period_start: string | null
        }
        Insert: {
          calculated_at?: string
          customer_id: number
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
          period_end?: string | null
          period_start?: string | null
        }
        Update: {
          calculated_at?: string
          customer_id?: number
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          period_end?: string | null
          period_start?: string | null
        }
        Relationships: []
      }
      customer_health_metrics: {
        Row: {
          calculated_at: string
          customer_id: number
          health_score: number
          id: string
          last_interaction_date: string | null
          next_recommended_action: string | null
          opportunities: Json | null
          risk_factors: Json | null
        }
        Insert: {
          calculated_at?: string
          customer_id: number
          health_score: number
          id?: string
          last_interaction_date?: string | null
          next_recommended_action?: string | null
          opportunities?: Json | null
          risk_factors?: Json | null
        }
        Update: {
          calculated_at?: string
          customer_id?: number
          health_score?: number
          id?: string
          last_interaction_date?: string | null
          next_recommended_action?: string | null
          opportunities?: Json | null
          risk_factors?: Json | null
        }
        Relationships: []
      }
      customer_notes: {
        Row: {
          content: string
          created_at: string
          customer_id: number
          id: string
          is_pinned: boolean
          note_type: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          customer_id: number
          id?: string
          is_pinned?: boolean
          note_type?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          customer_id?: number
          id?: string
          is_pinned?: boolean
          note_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      customer_preferences: {
        Row: {
          communication_preferences: Json | null
          customer_id: number
          id: string
          service_preferences: Json | null
          updated_at: string
        }
        Insert: {
          communication_preferences?: Json | null
          customer_id: number
          id?: string
          service_preferences?: Json | null
          updated_at?: string
        }
        Update: {
          communication_preferences?: Json | null
          customer_id?: number
          id?: string
          service_preferences?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      customer_scores: {
        Row: {
          created_at: string
          customer_id: number
          id: string
          last_calculated: string
          priority_level: string
          score_breakdown: Json | null
          total_score: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: number
          id?: string
          last_calculated?: string
          priority_level?: string
          score_breakdown?: Json | null
          total_score?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: number
          id?: string
          last_calculated?: string
          priority_level?: string
          score_breakdown?: Json | null
          total_score?: number
          updated_at?: string
        }
        Relationships: []
      }
      customer_segment_membership: {
        Row: {
          customer_id: number
          id: string
          joined_at: string
          segment_id: string
        }
        Insert: {
          customer_id: number
          id?: string
          joined_at?: string
          segment_id: string
        }
        Update: {
          customer_id?: number
          id?: string
          joined_at?: string
          segment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_segment_membership_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "customer_segments_advanced"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_segments_advanced: {
        Row: {
          color: string | null
          conditions: Json
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_dynamic: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          conditions: Json
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_dynamic?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          conditions?: Json
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_dynamic?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_timeline: {
        Row: {
          activity_type: string
          created_at: string
          customer_id: number
          description: string | null
          id: string
          metadata: Json | null
          new_value: string | null
          old_value: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          customer_id: number
          description?: string | null
          id?: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          customer_id?: number
          description?: string | null
          id?: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body_html: string
          body_text: string | null
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          merge_fields: Json | null
          name: string
          subject: string
          template_type: string
          updated_at: string
        }
        Insert: {
          body_html: string
          body_text?: string | null
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean
          merge_fields?: Json | null
          name: string
          subject: string
          template_type: string
          updated_at?: string
        }
        Update: {
          body_html?: string
          body_text?: string | null
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean
          merge_fields?: Json | null
          name?: string
          subject?: string
          template_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      forum_messages: {
        Row: {
          author_name: string
          conversation_id: string
          created_at: string
          id: string
          message: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author_name: string
          conversation_id: string
          created_at?: string
          id?: string
          message: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author_name?: string
          conversation_id?: string
          created_at?: string
          id?: string
          message?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_scoring_rules: {
        Row: {
          created_at: string
          criteria_type: string
          criteria_value: Json
          id: string
          is_active: boolean
          name: string
          score_points: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          criteria_type: string
          criteria_value: Json
          id?: string
          is_active?: boolean
          name: string
          score_points?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          criteria_type?: string
          criteria_value?: Json
          id?: string
          is_active?: boolean
          name?: string
          score_points?: number
          updated_at?: string
        }
        Relationships: []
      }
      parts: {
        Row: {
          appliance_brand: string | null
          appliance_model: string | null
          appliance_type: string | null
          company_id: string | null
          created_at: string
          final_price: number | null
          id: string
          markup_percentage: number | null
          part_cost: number | null
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
          final_price?: number | null
          id?: string
          markup_percentage?: number | null
          part_cost?: number | null
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
          final_price?: number | null
          id?: string
          markup_percentage?: number | null
          part_cost?: number | null
          part_name?: string
          part_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          case_id: string | null
          created_at: string
          currency: string | null
          id: string
          payment_date: string | null
          status: string | null
          stripe_session_id: string | null
          tax_amount: number
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          case_id?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          payment_date?: string | null
          status?: string | null
          stripe_session_id?: string | null
          tax_amount?: number
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          case_id?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          payment_date?: string | null
          status?: string | null
          stripe_session_id?: string | null
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      predictive_analytics: {
        Row: {
          confidence_score: number | null
          created_at: string
          customer_id: number
          factors: Json | null
          id: string
          prediction_type: string
          prediction_value: number | null
          valid_until: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          customer_id: number
          factors?: Json | null
          id?: string
          prediction_type: string
          prediction_value?: number | null
          valid_until?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          customer_id?: number
          factors?: Json | null
          id?: string
          prediction_type?: string
          prediction_value?: number | null
          valid_until?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          agreements_date: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          phone_verified: boolean | null
          policy_agreed: boolean | null
          terms_agreed: boolean | null
          updated_at: string
          verification_code: string | null
          verification_code_expires_at: string | null
        }
        Insert: {
          agreements_date?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone_number?: string | null
          phone_verified?: boolean | null
          policy_agreed?: boolean | null
          terms_agreed?: boolean | null
          updated_at?: string
          verification_code?: string | null
          verification_code_expires_at?: string | null
        }
        Update: {
          agreements_date?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          phone_verified?: boolean | null
          policy_agreed?: boolean | null
          terms_agreed?: boolean | null
          updated_at?: string
          verification_code?: string | null
          verification_code_expires_at?: string | null
        }
        Relationships: []
      }
      public_cases: {
        Row: {
          appliance_brand: string
          appliance_brand_selection: string | null
          appliance_model: string | null
          appliance_type: string
          created_at: string
          customer_address: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          diagnostic_fee_amount: number | null
          diagnostic_fee_type: string | null
          id: string
          problem_description: string
          status: string
          updated_at: string
        }
        Insert: {
          appliance_brand: string
          appliance_brand_selection?: string | null
          appliance_model?: string | null
          appliance_type: string
          created_at?: string
          customer_address?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          diagnostic_fee_amount?: number | null
          diagnostic_fee_type?: string | null
          id?: string
          problem_description: string
          status?: string
          updated_at?: string
        }
        Update: {
          appliance_brand?: string
          appliance_brand_selection?: string | null
          appliance_model?: string | null
          appliance_type?: string
          created_at?: string
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          diagnostic_fee_amount?: number | null
          diagnostic_fee_type?: string | null
          id?: string
          problem_description?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workflow_rules: {
        Row: {
          actions: Json
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          trigger_conditions: Json
          trigger_type: string
          updated_at: string
        }
        Insert: {
          actions?: Json
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          trigger_conditions?: Json
          trigger_type: string
          updated_at?: string
        }
        Update: {
          actions?: Json
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          trigger_conditions?: Json
          trigger_type?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_customer_score: {
        Args: { customer_id_param: number }
        Returns: number
      }
      calculate_labor_cost: {
        Args: { level: number }
        Returns: number
      }
      generate_wo_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_active_member_count: {
        Args: { conversation_id: string }
        Returns: number
      }
      get_conversation_members: {
        Args: { conversation_id: string }
        Returns: {
          user_id: string
          full_name: string
          email: string
          joined_at: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_conversations: {
        Args: { user_id: string }
        Returns: {
          conversation_id: string
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_authorized_to_delete: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      user_is_conversation_member: {
        Args: { conversation_id: string; user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const

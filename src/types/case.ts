
// Case type matching actual database schema plus extended fields from components
export interface Case {
  id: string;
  company_id: string;
  customer_id?: string;
  technician_id?: string;
  appliance_brand?: string;
  appliance_model?: string;
  appliance_type?: string;
  issue_description?: string;
  service_type?: string;
  status?: string;
  diagnosis?: string;
  resolution?: string;
  scheduled_date?: string;
  completed_date?: string;
  labor_cost?: number;
  parts_cost?: number;
  total_cost?: number;
  created_at?: string;
  updated_at?: string;
  
  // Extended fields that components expect (optional)
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  customer_address_line_2?: string;
  customer_city?: string;
  customer_state?: string;
  customer_zip_code?: string;
  problem_description?: string;
  wo_number?: string;
  user_id?: string;
  serial_number?: string;
  warranty_status?: string;
  initial_diagnosis?: string;
  parts_needed?: string;
  estimated_time?: string;
  technician_notes?: string;
  cancellation_reason?: string;
  labor_level?: string;
  labor_cost_calculated?: number;
  diagnostic_fee_type?: string;
  diagnostic_fee_amount?: number;
  spt_status?: string;
  authorization_signature?: string;
  authorization_signature_date?: string;
  authorization_signed_by?: string;
  completion_signature?: string;
  completion_signature_date?: string;
  completion_signed_by?: string;
  payment_intent_id?: string;
  payment_amount?: number;
  payment_status?: string;
  payment_date?: string;
}

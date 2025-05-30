
export interface Case {
  id: string;
  wo_number?: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  customer_address?: string;
  customer_address_line_2?: string;
  customer_city?: string;
  customer_state?: string;
  customer_zip_code?: string;
  appliance_brand: string;
  appliance_model?: string;
  appliance_type: string;
  serial_number?: string;
  warranty_status?: string;
  service_type?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  problem_description: string;
  initial_diagnosis?: string;
  parts_needed?: string;
  estimated_time?: string;
  technician_notes?: string;
  photos?: string[];
  company_id?: string;
  user_id?: string;
  labor_cost?: string;
  parts_cost?: string;
  labor_level?: number;
  labor_cost_calculated?: number;
  diagnostic_fee_type?: string;
  diagnostic_fee_amount?: number;
  cancellation_reason?: string;
  spt_status?: string;
}

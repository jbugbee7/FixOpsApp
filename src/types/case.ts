
// Case type matching actual database schema
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
}


export interface Case {
  id: string;
  customer_name: string;
  appliance_brand: string;
  appliance_type: string;
  status: string;
  created_at: string;
  customer_phone?: string;
  customer_address?: string;
  problem_description: string;
  initial_diagnosis?: string;
  company_id?: string; // Optional to support both company and basic operations
  user_id?: string; // Optional for basic operations
}

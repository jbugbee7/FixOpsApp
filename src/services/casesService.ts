
import { supabase } from "@/integrations/supabase/client";
import { Case } from "@/types/case";

export interface CasesServiceResult {
  cases: Case[] | null;
  error: {
    code?: string;
    message: string;
    details?: any;
  } | null;
}

export const fetchAllCases = async (): Promise<CasesServiceResult> => {
  console.log('Fetching ALL cases for cross-user visibility');
  
  const { data: cases, error } = await supabase
    .from('cases')
    .select('*')
    .order('created_at', { ascending: false });

  console.log('=== ALL CASES FETCH RESULT ===');
  console.log('Cases data:', cases);
  console.log('Cases error:', error);
  console.log('Cases count:', cases?.length || 0);

  if (error) {
    console.error('=== CASES FETCH ERROR ===');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details:', error.details);
    
    return {
      cases: null,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    };
  }

  console.log('All cases fetch successful - cross-user visibility enabled');
  return {
    cases: cases || [],
    error: null
  };
};

export const addSampleWorkOrders = async (userId: string): Promise<CasesServiceResult> => {
  console.log('Adding sample work orders for user:', userId);
  
  const sampleOrders = [
    {
      customer_name: "John Smith",
      customer_phone: "(555) 123-4567",
      customer_email: "john.smith@email.com",
      customer_address: "123 Main St",
      customer_city: "Anytown",
      customer_state: "CA",
      customer_zip_code: "90210",
      appliance_brand: "Whirlpool",
      appliance_type: "Refrigerator",
      appliance_model: "WRF535SWHZ",
      serial_number: "WP12345678",
      warranty_status: "In Warranty",
      service_type: "Repair",
      status: "Scheduled",
      problem_description: "Refrigerator not cooling properly",
      initial_diagnosis: "Possible compressor issue",
      parts_needed: "Compressor assembly",
      estimated_time: "2-3 hours",
      labor_cost: "$150",
      parts_cost: "$300",
      user_id: userId
    },
    {
      customer_name: "Sarah Johnson",
      customer_phone: "(555) 987-6543",
      customer_email: "sarah.j@email.com",
      customer_address: "456 Oak Ave",
      customer_city: "Springfield",
      customer_state: "CA",
      customer_zip_code: "91234",
      appliance_brand: "GE",
      appliance_type: "Washing Machine",
      appliance_model: "GTW485ASJWS",
      serial_number: "GE87654321",
      warranty_status: "Out of Warranty",
      service_type: "Maintenance",
      status: "In Progress",
      problem_description: "Washing machine making loud noises during spin cycle",
      initial_diagnosis: "Worn out bearings",
      parts_needed: "Bearing kit",
      estimated_time: "1-2 hours",
      labor_cost: "$100",
      parts_cost: "$75",
      user_id: userId
    },
    {
      customer_name: "Mike Davis",
      customer_phone: "(555) 555-0123",
      customer_email: "mike.davis@email.com",
      customer_address: "789 Pine St",
      customer_city: "Riverside",
      customer_state: "CA",
      customer_zip_code: "92501",
      appliance_brand: "Samsung",
      appliance_type: "Dryer",
      appliance_model: "DV45H7000EW",
      serial_number: "SM11223344",
      warranty_status: "Extended Warranty",
      service_type: "Installation",
      status: "Completed",
      problem_description: "New dryer installation and setup",
      initial_diagnosis: "Installation complete",
      parts_needed: "Vent kit",
      estimated_time: "1 hour",
      labor_cost: "$80",
      parts_cost: "$25",
      user_id: userId
    }
  ];

  const { data, error } = await supabase
    .from('cases')
    .insert(sampleOrders)
    .select();

  if (error) {
    console.error('Error adding sample work orders:', error);
    return {
      cases: null,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    };
  }

  console.log('Successfully added sample work orders:', data?.length || 0);
  return {
    cases: data || [],
    error: null
  };
};

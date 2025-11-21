
import { supabase } from "@/integrations/supabase/client";
import { Case } from "@/types/case";

export interface PublicCase {
  id: string;
  customer_name: string;
  customer_phone?: string;
  customer_address?: string;
  appliance_brand: string;
  appliance_type: string;
  problem_description: string;
  diagnostic_fee_type?: string;
  diagnostic_fee_amount?: number;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface CombinedCasesResult {
  cases: Case[];
  publicCases: PublicCase[];
  error: {
    code?: string;
    message: string;
    details?: any;
  } | null;
}

export const fetchAllCasesAndPublicCases = async (): Promise<CombinedCasesResult> => {
  try {
    // Only fetch from cases table (public_cases doesn't exist)
    const { data: casesData, error: casesError } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (casesError) {
      console.error('Error fetching cases:', casesError);
      return {
        cases: [],
        publicCases: [],
        error: {
          code: casesError.code,
          message: casesError.message,
          details: casesError.details
        }
      };
    }

    return {
      cases: casesData || [],
      publicCases: [],
      error: null
    };
  } catch (error) {
    console.error('Unexpected error fetching cases:', error);
    return {
      cases: [],
      publicCases: [],
      error: {
        message: 'An unexpected error occurred while fetching cases',
        details: error
      }
    };
  }
};

export const removeTestCases = async (): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('cases')
      .delete()
      .or('customer_name.ilike.%test%,customer_name.ilike.%TEST%,customer_name.ilike.%Test%');

    if (error) {
      console.error('Error removing test cases:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error removing test cases:', error);
    return { success: false, error };
  }
};

export const updatePublicCase = async (caseId: string, updates: Partial<PublicCase>): Promise<{ success: boolean; error?: any }> => {
  // public_cases table doesn't exist
  console.log('Public cases update not implemented');
  return { success: false };
};

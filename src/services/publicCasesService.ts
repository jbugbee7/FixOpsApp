
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
  console.log('Fetching cases from both tables');
  
  try {
    // Fetch from both tables in parallel
    const [casesResult, publicCasesResult] = await Promise.all([
      supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('public_cases')
        .select('*')
        .order('created_at', { ascending: false })
    ]);

    if (casesResult.error) {
      console.error('Error fetching cases:', casesResult.error);
      return {
        cases: [],
        publicCases: [],
        error: {
          code: casesResult.error.code,
          message: casesResult.error.message,
          details: casesResult.error.details
        }
      };
    }

    if (publicCasesResult.error) {
      console.error('Error fetching public cases:', publicCasesResult.error);
      return {
        cases: casesResult.data || [],
        publicCases: [],
        error: {
          code: publicCasesResult.error.code,
          message: publicCasesResult.error.message,
          details: publicCasesResult.error.details
        }
      };
    }

    console.log('Successfully fetched:', {
      cases: casesResult.data?.length || 0,
      publicCases: publicCasesResult.data?.length || 0
    });
    console.log('Public cases details:', publicCasesResult.data);

    return {
      cases: casesResult.data || [],
      publicCases: publicCasesResult.data || [],
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
  console.log('Removing test cases from both tables');
  
  try {
    // Remove test cases from cases table - using case-insensitive search
    const { error: casesError } = await supabase
      .from('cases')
      .delete()
      .or('customer_name.ilike.%test%,customer_name.ilike.%TEST%,customer_name.ilike.%Test%');

    if (casesError) {
      console.error('Error removing test cases from cases table:', casesError);
      return { success: false, error: casesError };
    }

    // Remove test cases from public_cases table - using case-insensitive search
    const { error: publicCasesError } = await supabase
      .from('public_cases')
      .delete()
      .or('customer_name.ilike.%test%,customer_name.ilike.%TEST%,customer_name.ilike.%Test%');

    if (publicCasesError) {
      console.error('Error removing test cases from public_cases table:', publicCasesError);
      return { success: false, error: publicCasesError };
    }

    console.log('Test cases removed successfully from both tables');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error removing test cases:', error);
    return { success: false, error };
  }
};

export const updatePublicCase = async (caseId: string, updates: Partial<PublicCase>): Promise<{ success: boolean; error?: any }> => {
  console.log('Updating public case:', caseId, updates);
  
  try {
    const { error } = await supabase
      .from('public_cases')
      .update(updates)
      .eq('id', caseId);

    if (error) {
      console.error('Error updating public case:', error);
      return { success: false, error };
    }

    console.log('Public case updated successfully - should trigger move to cases table');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error updating public case:', error);
    return { success: false, error };
  }
};

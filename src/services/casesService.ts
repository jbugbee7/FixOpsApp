
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

export const fetchUserCases = async (userId: string): Promise<CasesServiceResult> => {
  console.log('Fetching all cases for user:', userId);
  
  const { data: cases, error } = await supabase
    .from('cases')
    .select('*')
    .order('created_at', { ascending: false });

  console.log('=== CASES FETCH RESULT ===');
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

  console.log('Cases fetch successful, processing data...');
  return {
    cases: cases || [],
    error: null
  };
};

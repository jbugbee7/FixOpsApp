
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

export const fetchUserCases = async (userId: string): Promise<CasesServiceResult> => {
  console.log('Fetching cases for specific user:', userId);
  
  const { data: cases, error } = await supabase
    .from('cases')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('=== USER CASES FETCH ERROR ===');
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

  console.log('User cases fetch successful:', cases?.length || 0, 'cases');
  return {
    cases: cases || [],
    error: null
  };
};

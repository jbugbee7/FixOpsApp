import { supabase } from '@/lib/supabaseClient';
import type { Tables } from '@/integrations/supabase/types';

type Case = Tables<'cases'>;

export const fetchAllCases = async () => {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cases:', error);
      return { cases: [], error };
    }

    return { cases: data || [], error: null };
  } catch (err) {
    console.error('Unexpected error fetching cases:', err);
    return { cases: [], error: err };
  }
};

export const fetchUserCases = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cases:', error);
      return { cases: [], error };
    }

    return { cases: data || [], error: null };
  } catch (err) {
    console.error('Unexpected error fetching cases:', err);
    return { cases: [], error: err };
  }
};

export const updateCaseStatus = async (caseId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('cases')
      .update({ status })
      .eq('id', caseId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating case status:', error);
      return { case: null, error };
    }

    return { case: data, error: null };
  } catch (err) {
    console.error('Unexpected error updating case:', err);
    return { case: null, error: err };
  }
};

export const deleteCase = async (caseId: string) => {
  try {
    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', caseId);

    if (error) {
      console.error('Error deleting case:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Unexpected error deleting case:', err);
    return { success: false, error: err };
  }
};

import { supabase } from '@/integrations/supabase/client';
import { Case } from '@/types/case';

export const fetchCasesFromDB = async (): Promise<Case[]> => {
  const { data } = await supabase.from('cases').select('*');
  return data || [];
};

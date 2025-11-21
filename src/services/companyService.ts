import { supabase } from '@/lib/supabaseClient';
import type { Tables } from '@/integrations/supabase/types';

export type Company = Tables<'companies'>;

export const createCompanyAndAssignOwner = async (
  companyName: string,
  ownerUserId: string
): Promise<{ company_id: string | null; error: string | null }> => {
  try {
    console.log('Creating company and assigning owner:', companyName, ownerUserId);
    
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({ name: companyName })
      .select()
      .maybeSingle();

    if (companyError) {
      console.error('Error creating company:', companyError);
      return { company_id: null, error: companyError.message };
    }

    if (!company) {
      return { company_id: null, error: 'Failed to create company' };
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ company_id: company.id })
      .eq('id', ownerUserId);

    if (profileError) {
      console.error('Error assigning owner:', profileError);
      return { company_id: null, error: profileError.message };
    }

    console.log('Company created successfully:', company.id);
    return { company_id: company.id, error: null };
  } catch (err) {
    console.error('Unexpected error creating company:', err);
    return { company_id: null, error: 'Failed to create company' };
  }
};

export const fetchUserCompany = async (userId: string): Promise<{ company: Company | null; error: string | null }> => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', userId)
      .maybeSingle();

    if (!profile?.company_id) {
      return { company: null, error: null };
    }

    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', profile.company_id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching company:', error);
      return { company: null, error: error.message };
    }

    return { company, error: null };
  } catch (err) {
    console.error('Unexpected error fetching company:', err);
    return { company: null, error: 'Failed to fetch company' };
  }
};

export const updateCompany = async (
  companyId: string,
  updates: Partial<Company>
): Promise<{ company: Company | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', companyId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating company:', error);
      return { company: null, error: error.message };
    }

    return { company: data, error: null };
  } catch (err) {
    console.error('Unexpected error updating company:', err);
    return { company: null, error: 'Failed to update company' };
  }
};

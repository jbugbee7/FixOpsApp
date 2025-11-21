
import { supabase } from '@/integrations/supabase/client';

export interface Company {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export const createCompanyAndAssignOwner = async (
  companyName: string,
  ownerUserId: string
): Promise<{ company_id: string | null; error: string | null }> => {
  try {
    console.log('Creating company:', companyName, ownerUserId);
    
    // Create the company directly
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .insert({ name: companyName })
      .select()
      .single();

    if (companyError) {
      console.error('Error creating company:', companyError);
      return { company_id: null, error: companyError.message };
    }

    // Update user profile with company_id
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ company_id: companyData.id })
      .eq('id', ownerUserId);

    if (profileError) {
      console.error('Error assigning company to user:', profileError);
      return { company_id: null, error: profileError.message };
    }

    console.log('Company created successfully:', companyData.id);
    return { company_id: companyData.id, error: null };
  } catch (err) {
    console.error('Unexpected error creating company:', err);
    return { company_id: null, error: 'Failed to create company' };
  }
};

export const fetchUserCompany = async (): Promise<{ company: Company | null; error: string | null }> => {
  try {
    const { data: companies, error } = await supabase
      .from('companies')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error fetching user company:', error);
      return { company: null, error: error.message };
    }

    return { company: companies?.[0] || null, error: null };
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
      .single();

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

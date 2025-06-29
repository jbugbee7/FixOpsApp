
import { supabase } from '@/integrations/supabase/client';

export interface Company {
  id: string;
  name: string;
  subscription_status: string;
  subscription_plan: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const createCompanyAndAssignOwner = async (
  companyName: string,
  ownerUserId: string
): Promise<{ company_id: string | null; error: string | null }> => {
  try {
    console.log('Creating company and assigning owner:', companyName, ownerUserId);
    
    const { data, error } = await supabase
      .rpc('create_company_and_assign_owner', {
        company_name: companyName,
        owner_user_id: ownerUserId
      });

    if (error) {
      console.error('Error creating company:', error);
      return { company_id: null, error: error.message };
    }

    console.log('Company created successfully:', data);
    return { company_id: data, error: null };
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

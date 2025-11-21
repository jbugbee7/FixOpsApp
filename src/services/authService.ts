
import { fetchUserProfile, updateUserProfileData } from './profileService';
import { signUpWithEmail, signInWithEmail, signOutUser as signOut } from './authenticationService';
import { createCompanyAndAssignOwner } from './companyService';
import { supabase } from '@/lib/supabaseClient';

// Re-export for backward compatibility
export const fetchProfile = fetchUserProfile;
export const signInUser = signInWithEmail;
export const signOutUser = signOut;
export const updateUserProfile = updateUserProfileData;

export const signUpUser = async (email: string, password: string, fullName?: string, companyName?: string) => {
  try {
    const { data, error } = await signUpWithEmail(email, password, fullName);
    
    if (error) throw error;
    
    // If company name is provided and user is created, create company
    if (data.user && companyName) {
      console.log('Creating company for new user:', companyName);
      
      // Wait for profile to be created by the trigger (2 seconds should be enough)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        const { company_id, error: companyError } = await createCompanyAndAssignOwner(companyName, data.user.id);
        if (companyError) {
          console.error('Error creating company:', companyError);
        } else {
          console.log('Company created successfully:', company_id);
        }
      } catch (err) {
        console.error('Error in company creation:', err);
      }
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in signUpUser:', error);
    return { data: null, error };
  }
};

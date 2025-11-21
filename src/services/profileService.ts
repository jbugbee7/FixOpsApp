
import { supabase } from '@/lib/supabaseClient';
import { UserProfile } from '@/types/auth';

export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    throw profileError;
  }

  return profile as UserProfile;
};

export const updateUserProfileData = async (userId: string, profileData: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId)
    .select('*')
    .single();

  if (error) throw error;
  return data as UserProfile;
};

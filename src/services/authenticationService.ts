
import { supabase } from '@/integrations/supabase/client';

export const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || '',
      }
    }
  });

  if (error) throw error;
  return { data, error: null };
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return { data, error: null };
};

export const signOutUser = async () => {
  await supabase.auth.signOut();
};

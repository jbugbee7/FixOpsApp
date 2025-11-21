
import { supabase } from '@/lib/supabaseClient';

export const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
  // CRITICAL: Always include emailRedirectTo for proper authentication flow
  const redirectUrl = `${window.location.origin}/`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
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

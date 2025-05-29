import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useComplexHooks } from '@/hooks/useComplexHooks';

interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string; // Made optional since it's not in the database
  updated_at?: string;
  email?: string;
  policy_agreed?: boolean;
  terms_agreed?: boolean;
  agreements_date?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ data: any, error: any }>;
  signIn: (email: string, password: string) => Promise<{ data: any, error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { handleEvent } = useComplexHooks();

  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (err: any) {
        console.error('Error loading session:', err);
        setError(err.message || 'Failed to load session.');
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change event:', event);
        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      setUserProfile(profile as UserProfile);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      setError(error.message || 'Failed to fetch user profile.');
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      setError(null);
      
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

      // Trigger USER_SIGNUP event
      if (data.user) {
        await handleEvent('USER_SIGNUP', {
          userId: data.user.id,
          email: data.user.email,
          fullName: fullName
        });
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Trigger USER_LOGIN event
      if (data.user) {
        await handleEvent('USER_LOGIN', {
          userId: data.user.id,
          email: data.user.email,
          loginTime: new Date().toISOString()
        });
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setSession(null);
    } catch (error: any) {
      console.error('Error signing out:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user?.id)
        .select('*')
        .single();

      if (error) throw error;

      setUserProfile(data as UserProfile);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  userProfile: { full_name?: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{ full_name?: string } | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        // If we're in the middle of signing out, ignore any sign-in events
        if (isSigningOut && event === 'SIGNED_IN') {
          console.log('Ignoring sign-in event during sign-out process');
          return;
        }
        
        // If this is a sign-out event, clear everything immediately
        if (event === 'SIGNED_OUT') {
          console.log('Processing sign-out event');
          setSession(null);
          setUser(null);
          setUserProfile(null);
          setLoading(false);
          setIsSigningOut(false);
          return;
        }
        
        // For sign-in events, update state normally
        if (event === 'SIGNED_IN' && session) {
          console.log('Processing sign-in event');
          setSession(session);
          setUser(session.user);
          setLoading(false);
          
          // Fetch user profile
          if (session.user) {
            setTimeout(() => {
              fetchUserProfile(session.user.id);
            }, 0);
          }
          return;
        }
        
        // For initial session or token refresh
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user && !userProfile) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      
      if (!isSigningOut) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          fetchUserProfile(session.user.id);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [isSigningOut, userProfile]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signOut = async () => {
    if (isSigningOut) {
      console.log('Sign out already in progress, ignoring duplicate request');
      return;
    }

    try {
      console.log('Starting sign out process...');
      setIsSigningOut(true);
      
      // Clear local state first
      setUser(null);
      setSession(null);
      setUserProfile(null);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Sign out error:', error);
      } else {
        console.log('Successfully signed out from Supabase');
      }
      
      // Force redirect regardless of any errors
      setTimeout(() => {
        window.location.href = '/auth';
      }, 100);
      
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      setIsSigningOut(false);
      // Force redirect even on unexpected errors
      window.location.href = '/auth';
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    userProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

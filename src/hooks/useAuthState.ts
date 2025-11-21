
import { useState, useEffect, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { UserProfile } from '@/types/auth';
import { fetchProfile } from '@/services/authService';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  // Prevent multiple initialization calls
  const initRef = useRef(false);

  const loadProfile = async (userId: string) => {
    try {
      const profile = await fetchProfile(userId);
      setUserProfile(profile);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      // Don't set this as a blocking error since profile loading is secondary
    }
  };

  const handleAuthChange = async (event: string, session: Session | null) => {
    console.log('Auth state change:', event, session?.user?.email || 'no user');
    
    setSession(session);
    setUser(session?.user || null);
    setError(null); // Clear any previous errors

    if (session?.user) {
      console.log('User authenticated, loading profile...');
      // Load profile in background, don't block auth state
      setTimeout(() => {
        loadProfile(session.user.id);
      }, 0);
    } else {
      console.log('No user session, clearing profile');
      setUserProfile(null);
    }

    // Mark as fully loaded after auth state is processed
    setLoading(false);
  };

  useEffect(() => {
    // Prevent double initialization
    if (initRef.current) return;
    initRef.current = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        
        // Set up auth listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

        // Then get current session
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) {
            console.error('Session error:', sessionError);
            setError(sessionError.message);
          } else {
            console.log('Initial session:', session?.user?.email || 'no session');
            setSession(session);
            setUser(session?.user || null);

            if (session?.user) {
              console.log('Initial session found, loading profile...');
              // Load profile without blocking
              setTimeout(() => {
                loadProfile(session.user.id);
              }, 0);
            }
          }
        } catch (sessionError: any) {
          console.error('Failed to get session:', sessionError);
          setError('Failed to initialize authentication');
          setSession(null);
          setUser(null);
        }

        setInitialized(true);
        setLoading(false);

        return () => {
          console.log('Cleaning up auth subscription');
          subscription.unsubscribe();
        };
      } catch (err: any) {
        console.error('Auth initialization error:', err);
        setError(err.message || 'Failed to initialize auth.');
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  return {
    user,
    userProfile,
    session,
    loading: loading || !initialized,
    error,
    setLoading,
    setError,
    setUserProfile
  };
};

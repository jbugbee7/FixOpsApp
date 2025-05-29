
import { useState, useEffect, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
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
      setError(error.message || 'Failed to fetch user profile.');
    }
  };

  const handleAuthChange = async (event: string, session: Session | null) => {
    console.log('Auth state change:', event, session?.user?.email || 'no user');
    
    setSession(session);
    setUser(session?.user || null);

    if (session?.user) {
      // Load profile in background, don't block auth state
      setTimeout(() => {
        loadProfile(session.user.id);
      }, 0);
    } else {
      setUserProfile(null);
    }

    // Mark as fully loaded after auth state is processed
    if (!loading) {
      setLoading(false);
    }
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

        // Then get current session with timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 5000)
        );

        try {
          const { data: { session }, error: sessionError } = await Promise.race([
            sessionPromise,
            timeoutPromise
          ]) as any;

          if (sessionError) {
            console.error('Session error:', sessionError);
            setError(sessionError.message);
          } else {
            console.log('Initial session:', session?.user?.email || 'no session');
            setSession(session);
            setUser(session?.user || null);

            if (session?.user) {
              // Load profile without blocking
              setTimeout(() => {
                loadProfile(session.user.id);
              }, 0);
            }
          }
        } catch (timeoutError) {
          console.warn('Session fetch timed out, continuing without session');
          setSession(null);
          setUser(null);
        }

        setInitialized(true);
        setLoading(false);

        return () => {
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

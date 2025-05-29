
import { useState, useEffect } from 'react';
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

  const loadProfile = async (userId: string) => {
    try {
      const profile = await fetchProfile(userId);
      setUserProfile(profile);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      setError(error.message || 'Failed to fetch user profile.');
    }
  };

  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          await loadProfile(session.user.id);
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
          await loadProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    userProfile,
    session,
    loading,
    error,
    setLoading,
    setError,
    setUserProfile
  };
};


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'admin' | 'user' | null;

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .rpc('get_current_user_role');

        if (error) {
          console.error('Error fetching user role:', error);
          // If no role found, default to 'user'
          setUserRole('user');
        } else {
          setUserRole(data || 'user');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('user'); // Default to user role
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const isAdmin = userRole === 'admin';
  const isUser = userRole === 'user';

  return {
    userRole,
    isAdmin,
    isUser,
    isLoading
  };
};

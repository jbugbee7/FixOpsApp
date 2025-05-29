
import { useComplexHooks } from '@/hooks/useComplexHooks';
import { UserProfile } from '@/types/auth';
import { signUpUser, signInUser, signOutUser, updateUserProfile } from '@/services/authService';

interface UseAuthOperationsProps {
  user: any;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
}

export const useAuthOperations = ({ user, setLoading, setError, setUserProfile }: UseAuthOperationsProps) => {
  const { handleEvent } = useComplexHooks();

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await signUpUser(email, password, fullName);

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
      
      const { data, error } = await signInUser(email, password);

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
      await signOutUser();
      setUserProfile(null);
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

      const updatedProfile = await updateUserProfile(user?.id, profileData);
      setUserProfile(updatedProfile);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    updateProfile
  };
};

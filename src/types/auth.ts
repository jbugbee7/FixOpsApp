
import { Session, User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string; // Made optional since it's not in the database
  updated_at?: string;
  email?: string;
  policy_agreed?: boolean;
  terms_agreed?: boolean;
  agreements_date?: string;
  created_at?: string;
  phone_number?: string;
  phone_verified?: boolean;
  verification_code?: string;
  verification_code_expires_at?: string;
}

export interface AuthContextType {
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

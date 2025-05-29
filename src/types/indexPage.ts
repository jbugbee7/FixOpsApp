
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/auth';
import { Case } from '@/types/case';

export interface IndexPageProps {
  user: User | null;
  userProfile: UserProfile | null;
  signOut: () => Promise<void>;
  authLoading: boolean;
  isOnline: boolean;
  cases: Case[];
  loading: boolean;
  hasOfflineData: boolean;
  updateCaseStatus: (caseId: string, status: string) => Promise<boolean>;
  handleResync: () => Promise<void>;
  selectedCase: Case | null;
  selectedModel: any;
  selectedPart: any;
  activeTab: string;
  isResyncing: boolean;
  setActiveTab: (tab: string) => void;
  setIsResyncing: (loading: boolean) => void;
  handleCaseClick: (caseData: any) => void;
  handleModelFound: (model: any) => void;
  handlePartFound: (part: any) => void;
  handleHomeClick: () => void;
  handleNavigate: (section: string) => void;
}

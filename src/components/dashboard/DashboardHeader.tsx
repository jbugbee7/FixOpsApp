import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/fixops-logo.png';
const DashboardHeader = () => {
  const {
    userProfile
  } = useAuth();
  return <div className="flex items-center justify-between px-4 py-4">
      <div></div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">
          {userProfile?.full_name || 'User'}
        </span>
      </div>
    </div>;
};
export default DashboardHeader;
import { useAuth } from '@/contexts/AuthContext';

const DashboardHeader = () => {
  const { userProfile } = useAuth();
  
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">FixOps</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {userProfile?.full_name || 'User'}
        </span>
      </div>
    </div>
  );
};

export default DashboardHeader;

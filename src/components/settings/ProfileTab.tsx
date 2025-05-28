
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';

const ProfileTab = () => {
  const { userProfile, user } = useAuth();

  return (
    <div className="space-y-6 mt-0">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Profile Settings</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Manage your profile information and preferences
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="display-name" className="text-sm font-medium">Display Name</Label>
            <Input
              id="display-name"
              value={userProfile?.full_name || ''}
              placeholder="Enter your full name"
              className="border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-email" className="text-sm font-medium">Email</Label>
            <Input
              id="profile-email"
              value={user?.email || ''}
              disabled
              className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
            <p className="text-xs text-slate-500">
              Contact support to change your email address
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button className="px-6 shadow-sm">
            Save Profile Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from '@/contexts/AuthContext';

const AccountTab = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 mt-0">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Account Information</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">View and manage your basic account details</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="account-email" className="text-sm font-medium">Email Address</Label>
            <Input
              id="account-email"
              value={user?.email || ''}
              disabled
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
            <p className="text-xs text-slate-500">
              Your login email address cannot be changed
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Account Type</Label>
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="text-sm px-3 py-1 font-medium">
                Personal
              </Badge>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Individual account
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Theme Preference</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Choose your preferred interface theme
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTab;

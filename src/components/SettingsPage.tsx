
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogOut, Moon, Sun, User, CreditCard, Crown } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAuth } from '@/contexts/AuthContext';
import SubscriptionPlans from './SubscriptionPlans';
import { useState } from 'react';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { user, userProfile, signOut } = useAuth();
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false);
  const appVersion = "1.0.0"; // This would typically come from package.json or environment

  const handleSignOut = async () => {
    await signOut();
  };

  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  // Get the current effective theme for display
  const getCurrentThemeLabel = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light';
    }
    return theme === 'dark' ? 'Dark' : 'Light';
  };

  // Get display name - prioritize full name from profile, fallback to email
  const displayName = userProfile?.full_name || user?.email || 'User';

  if (showSubscriptionPlans) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setShowSubscriptionPlans(false)}
            className="flex items-center space-x-2"
          >
            ← Back to Settings
          </Button>
        </div>
        <SubscriptionPlans />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 dark:text-slate-100">
            {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span>Appearance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base dark:text-slate-100">{getCurrentThemeLabel()} Mode</Label>
            </div>
            <Switch 
              checked={isDarkMode}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Subscription Settings */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 dark:text-slate-100">
            <Crown className="h-5 w-5" />
            <span>Subscription</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-3">
            <div className="space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Current Plan:
              </p>
              <div className="flex items-center justify-center space-x-2">
                <span className="font-medium dark:text-slate-100">Free Trial</span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                  Active
                </span>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowSubscriptionPlans(true)}
              className="flex items-center space-x-2 w-full justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <CreditCard className="h-4 w-4" />
              <span>Upgrade Plan</span>
            </Button>
            
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Unlock advanced features and unlimited work orders
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 dark:text-slate-100">
            <User className="h-5 w-5" />
            <span>Account</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Signed in as:
            </p>
            <p className="font-medium dark:text-slate-100">
              {displayName}
            </p>
            {userProfile?.full_name && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user?.email}
              </p>
            )}
          </div>
          <Button 
            variant="destructive" 
            onClick={handleSignOut}
            className="flex items-center space-x-2 w-full justify-center"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="text-center">
          <CardTitle className="dark:text-slate-100">About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium dark:text-slate-300">Version</span>
            <span className="text-sm text-muted-foreground dark:text-slate-400">{appVersion}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;

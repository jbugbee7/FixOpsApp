
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const appVersion = "1.0.0"; // This would typically come from package.json or environment

  const handleSignOut = () => {
    // Handle sign out logic here
    console.log("User signed out");
  };

  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

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
              <Label className="text-base dark:text-slate-100">Dark Mode</Label>
            </div>
            <Switch 
              checked={isDarkMode}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="text-center">
          <CardTitle className="dark:text-slate-100">Account</CardTitle>
        </CardHeader>
        <CardContent>
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

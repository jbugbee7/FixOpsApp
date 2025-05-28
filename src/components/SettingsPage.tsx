
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogOut, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const appVersion = "1.0.0"; // This would typically come from package.json or environment

  const handleSignOut = () => {
    // Handle sign out logic here
    console.log("User signed out");
  };

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
            <Sun className="h-5 w-5" />
            <span>Appearance</span>
          </CardTitle>
          <CardDescription className="dark:text-slate-400">
            Customize the appearance of the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base dark:text-slate-100">Theme</Label>
              <p className="text-sm text-muted-foreground dark:text-slate-400">
                Select the theme for the application
              </p>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center space-x-2">
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center space-x-2">
                    <Monitor className="h-4 w-4" />
                    <span>System</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="dark:text-slate-100">Account</CardTitle>
          <CardDescription className="dark:text-slate-400">
            Manage your account settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleSignOut}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="dark:text-slate-100">About</CardTitle>
          <CardDescription className="dark:text-slate-400">
            Application information
          </CardDescription>
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

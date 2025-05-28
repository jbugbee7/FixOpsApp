
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "./ThemeToggle";
import { Settings, User, Palette } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const SettingsPage = () => {
  const { userProfile, user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Main Settings Section */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <Tabs defaultValue="account" className="w-full">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 px-6 py-4 rounded-t-lg">
              <TabsList className="grid w-full grid-cols-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-600 h-12">
                <TabsTrigger value="account" className="flex items-center space-x-2 py-2 px-4 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all">
                  <Settings className="h-4 w-4" />
                  <span>Account</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center space-x-2 py-2 px-4 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center space-x-2 py-2 px-4 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all">
                  <Palette className="h-4 w-4" />
                  <span>Appearance</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="account" className="space-y-6 mt-0">
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
              </TabsContent>
              
              <TabsContent value="profile" className="space-y-6 mt-0">
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
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-6 mt-0">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Appearance Settings</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Customize how the application looks and feels
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div>
                        <Label className="text-base font-medium">Theme</Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Switch between light and dark mode
                        </p>
                      </div>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;

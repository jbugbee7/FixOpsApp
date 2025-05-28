
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import CompanyBranding from "./CompanyBranding";
import SubscriptionInfo from "./SubscriptionInfo";
import SubscriptionPlans from "./SubscriptionPlans";
import ThemeToggle from "./ThemeToggle";
import { Building, CreditCard, User, Bell, Settings, Crown, Palette } from "lucide-react";
import { useCompany } from '@/contexts/CompanyContext';
import { useAuth } from '@/contexts/AuthContext';

const SettingsPage = () => {
  const { subscription, hasFeatureAccess } = useCompany();
  const { userProfile, user } = useAuth();

  const canCustomizeProfile = hasFeatureAccess('custom_branding');
  const currentTier = subscription?.tier || 'free';

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-slate-100 mb-2">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Manage your FixOps account, preferences, and subscription
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="account" className="flex items-center space-x-2 py-3">
            <Settings className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center space-x-2 py-3">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2 py-3">
            <Palette className="h-4 w-4" />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center space-x-2 py-3">
            <CreditCard className="h-4 w-4" />
            <span>Subscription</span>
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center space-x-2 py-3">
            <Crown className="h-4 w-4" />
            <span>Plans</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Account Information</span>
              </CardTitle>
              <CardDescription>
                View and manage your basic account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="account-email">Email Address</Label>
                  <Input
                    id="account-email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                  <p className="text-xs text-slate-500">
                    Your login email address cannot be changed
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Current Plan</Label>
                  <div className="flex items-center space-x-2">
                    <Badge variant={currentTier === 'free' ? 'secondary' : 'default'} className="text-sm px-3 py-1">
                      {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
                    </Badge>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {currentTier === 'free' ? 'Free forever' : 'Active subscription'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Settings</span>
                {!canCustomizeProfile && (
                  <Badge variant="outline" className="text-xs">
                    Upgrade Required
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {canCustomizeProfile 
                  ? "Customize your profile information and preferences"
                  : "Upgrade to Basic or higher for profile customization features"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input
                    id="display-name"
                    value={userProfile?.full_name || ''}
                    disabled={!canCustomizeProfile}
                    placeholder="Enter your full name"
                    className={!canCustomizeProfile ? 'bg-gray-100 dark:bg-gray-800' : ''}
                  />
                  {!canCustomizeProfile && (
                    <p className="text-xs text-slate-500">
                      Upgrade to Basic plan to customize your display name
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input
                    id="profile-email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                  <p className="text-xs text-slate-500">
                    Contact support to change your email address
                  </p>
                </div>
              </div>

              {currentTier === 'free' && (
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-3">
                    <Crown className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        Unlock Profile Features
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                        Upgrade to Basic plan or higher to unlock:
                      </p>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          <span>Custom display name and profile information</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          <span>Profile picture upload (Pro+)</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          <span>Custom contact preferences</span>
                        </li>
                        {currentTier !== 'professional' && currentTier !== 'enterprise' && (
                          <>
                            <li className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              <span>Custom email signature (Pro+)</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              <span>Advanced notification settings (Pro+)</span>
                            </li>
                          </>
                        )}
                      </ul>
                      <Button className="mt-4 bg-blue-600 hover:bg-blue-700" size="sm">
                        Upgrade Now
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {canCustomizeProfile && (
                <div className="flex justify-end pt-4 border-t">
                  <Button className="px-6">
                    Save Profile Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6">
          <CompanyBranding />
        </TabsContent>
        
        <TabsContent value="subscription" className="space-y-6">
          <SubscriptionInfo />
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <SubscriptionPlans />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

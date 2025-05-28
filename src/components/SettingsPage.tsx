
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
import { Building, CreditCard, User, Bell, Settings, Crown } from "lucide-react";
import { useCompany } from '@/contexts/CompanyContext';
import { useAuth } from '@/contexts/AuthContext';

const SettingsPage = () => {
  const { subscription, hasFeatureAccess } = useCompany();
  const { userProfile } = useAuth();

  const canCustomizeProfile = hasFeatureAccess('custom_branding');
  const currentTier = subscription?.tier || 'free';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold dark:text-slate-100">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your FixOps account and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="account" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span>Company</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Subscription</span>
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center space-x-2">
            <Crown className="h-4 w-4" />
            <span>Plans</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Theme</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Switch between light and dark mode
                  </p>
                </div>
                <ThemeToggle />
              </div>
              
              <div className="border-t pt-4">
                <Label className="text-base font-medium">Current Plan</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant={currentTier === 'free' ? 'secondary' : 'default'}>
                    {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
                  </Badge>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {currentTier === 'free' ? 'Free forever' : 'Active subscription'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Profile Customization</span>
                {!canCustomizeProfile && (
                  <Badge variant="outline" className="text-xs">
                    Limited on Free Plan
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {canCustomizeProfile 
                  ? "Customize your profile and display preferences"
                  : "Upgrade to Standard or higher for profile customization features"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  value={userProfile?.full_name || ''}
                  disabled={!canCustomizeProfile}
                  placeholder="Your display name"
                  className={!canCustomizeProfile ? 'bg-gray-100 dark:bg-gray-800' : ''}
                />
                {!canCustomizeProfile && (
                  <p className="text-xs text-slate-500">
                    Upgrade to Standard plan to customize your display name
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={userProfile?.email || ''}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
                <p className="text-xs text-slate-500">
                  Email cannot be changed from here
                </p>
              </div>

              {currentTier === 'free' && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Unlock Profile Features
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    Upgrade to Standard plan or higher to unlock:
                  </p>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Custom display name</li>
                    <li>• Profile picture upload</li>
                    <li>• Contact preferences</li>
                    {currentTier !== 'professional' && currentTier !== 'enterprise' && (
                      <>
                        <li>• Custom signature (Pro+)</li>
                        <li>• Advanced preferences (Pro+)</li>
                      </>
                    )}
                  </ul>
                </div>
              )}

              {canCustomizeProfile && (
                <Button className="w-full" disabled={!canCustomizeProfile}>
                  {canCustomizeProfile ? 'Save Profile Changes' : 'Upgrade Required'}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="company" className="space-y-6">
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

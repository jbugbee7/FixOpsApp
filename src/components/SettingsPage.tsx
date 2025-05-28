
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
  const currentTier = (subscription?.tier || 'free') as 'free' | 'basic' | 'professional' | 'enterprise';

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
                      <Label className="text-sm font-medium">Current Plan</Label>
                      <div className="flex items-center space-x-2">
                        <Badge variant={currentTier === 'free' ? 'secondary' : 'default'} className="text-sm px-3 py-1 font-medium">
                          {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
                        </Badge>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {currentTier === 'free' ? 'Free forever' : 'Active subscription'}
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
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Profile Settings</h3>
                    {!canCustomizeProfile && (
                      <Badge variant="outline" className="text-xs font-medium">
                        Upgrade Required
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {canCustomizeProfile 
                      ? "Customize your profile information and preferences"
                      : "Upgrade to Basic or higher for profile customization features"
                    }
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="display-name" className="text-sm font-medium">Display Name</Label>
                      <Input
                        id="display-name"
                        value={userProfile?.full_name || ''}
                        disabled={!canCustomizeProfile}
                        placeholder="Enter your full name"
                        className={!canCustomizeProfile ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' : 'border-slate-200 dark:border-slate-700'}
                      />
                      {!canCustomizeProfile && (
                        <p className="text-xs text-slate-500">
                          Upgrade to Basic plan to customize your display name
                        </p>
                      )}
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

                  {currentTier === 'free' && (
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-6">
                      <div className="flex items-start space-x-3">
                        <Crown className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                            Unlock Profile Features
                          </h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                            Upgrade to Basic plan or higher to unlock:
                          </p>
                          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                            <li className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                              <span>Custom display name and profile information</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                              <span>Profile picture upload (Pro+)</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                              <span>Custom contact preferences</span>
                            </li>
                            {(currentTier === 'free' || currentTier === 'basic') && (
                              <>
                                <li className="flex items-center space-x-2">
                                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                                  <span>Custom email signature (Pro+)</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                                  <span>Advanced notification settings (Pro+)</span>
                                </li>
                              </>
                            )}
                          </ul>
                          <Button className="mt-4 bg-blue-600 hover:bg-blue-700 shadow-sm" size="sm">
                            Upgrade Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {canCustomizeProfile && (
                    <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                      <Button className="px-6 shadow-sm">
                        Save Profile Changes
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-6 mt-0">
                <CompanyBranding />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Subscription & Billing Section */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 px-6 py-4 rounded-t-lg">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">Subscription & Billing</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Manage your subscription plan and billing information
            </p>
          </div>
          
          <div className="p-6">
            <Tabs defaultValue="subscription" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 h-12 p-1">
                <TabsTrigger value="subscription" className="flex items-center space-x-2 py-2 px-4 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all">
                  <CreditCard className="h-4 w-4" />
                  <span>Current Subscription</span>
                </TabsTrigger>
                <TabsTrigger value="plans" className="flex items-center space-x-2 py-2 px-4 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all">
                  <Crown className="h-4 w-4" />
                  <span>Available Plans</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="subscription" className="space-y-6 mt-0">
                  <SubscriptionInfo />
                </TabsContent>

                <TabsContent value="plans" className="space-y-6 mt-0">
                  <SubscriptionPlans />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;

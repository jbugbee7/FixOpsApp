import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ThemeToggle from "./ThemeToggle";
import PlanCard from "@/components/subscription/PlanCard";
import { Settings, User, Palette, CreditCard } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionPlans } from '@/data/subscriptionPlans';
import { toast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { userProfile, user } = useAuth();

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') {
      toast({
        title: "Free Plan",
        description: "You're using the free plan with basic features included.",
        variant: "default"
      });
      return;
    }

    if (planId === 'standard') {
      toast({
        title: "Standard Plan",
        description: "Standard plan subscription coming soon! This will include unlimited work orders and advanced features.",
        variant: "default"
      });
      return;
    }

    if (planId === 'pro') {
      toast({
        title: "Professional Plan",
        description: "Professional plan subscription coming soon! This will include AI diagnostics and premium support.",
        variant: "default"
      });
      return;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Main Settings Section */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <Tabs defaultValue="account" className="w-full">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 px-6 py-4 rounded-t-lg">
              <TabsList className="grid w-full grid-cols-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-600 h-12">
                <TabsTrigger value="account" className="flex items-center space-x-2 py-2 px-4 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all">
                  <Settings className="h-4 w-4" />
                  <span>Account</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center space-x-2 py-2 px-4 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="subscription" className="flex items-center space-x-2 py-2 px-4 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all">
                  <CreditCard className="h-4 w-4" />
                  <span>Plans</span>
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
              
              <TabsContent value="subscription" className="space-y-6 mt-0">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Subscription Plans</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Choose the plan that fits your repair business needs
                  </p>
                  
                  <Card className="border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-6">
                      <div className="relative">
                        <Carousel className="w-full">
                          <CarouselContent className="-ml-2 md:-ml-4">
                            {subscriptionPlans.map((plan) => (
                              <CarouselItem key={plan.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                <div className="h-full">
                                  <PlanCard 
                                    plan={plan} 
                                    onSubscribe={handleSubscribe}
                                  />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                      </div>
                      
                      <div className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
                        <p>Start with our free plan and upgrade as your business grows.</p>
                        <p className="mt-1">All plans include mobile access and customer management.</p>
                      </div>
                    </CardContent>
                  </Card>
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

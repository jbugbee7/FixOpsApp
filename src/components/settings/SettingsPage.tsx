
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/hooks/useCompany';
import ThemeToggle from "@/components/ThemeToggle";
import { CheckCircle, XCircle, Building2, MessageSquare } from 'lucide-react';

const SettingsPage = () => {
  const { userProfile, user } = useAuth();
  const { company, loading: companyLoading } = useCompany();

  const handleTextSupport = () => {
    const phoneNumber = '8283182617';
    const message = encodeURIComponent('Hi, I need support with my account.');
    
    try {
      window.location.href = `sms:${phoneNumber}?body=${message}`;
    } catch (error) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-8">
      {/* Profile Settings Section */}
      <div className="space-y-6">
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

            <div className="space-y-2">
              <Label htmlFor="profile-phone" className="text-sm font-medium">Phone Number</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="profile-phone"
                  value={userProfile?.phone_number || 'Not provided'}
                  disabled
                  className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
                {userProfile?.phone_number && (
                  <Badge variant={userProfile?.phone_verified ? "default" : "destructive"} className="whitespace-nowrap">
                    {userProfile?.phone_verified ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Unverified
                      </>
                    )}
                  </Badge>
                )}
              </div>
              {userProfile?.phone_number && !userProfile?.phone_verified && (
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  Phone number requires verification
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700 mt-6">
            <Button className="px-6 shadow-sm">
              Save Profile Changes
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Account Information Section */}
      <div className="space-y-6">
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
        </div>
      </div>

      <Separator className="my-8" />

      {/* Company Information Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Company Information</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            View your company details
          </p>
          
          {companyLoading ? (
            <div className="animate-pulse">
              <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company-name" className="text-sm font-medium">Company Name</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="company-name"
                    value={company?.name || 'No company name'}
                    disabled
                    className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                  <Building2 className="h-4 w-4 text-slate-500" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Appearance Settings Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Appearance Settings</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Customize how the application looks and feels
          </p>
          
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

      <Separator className="my-8" />

      {/* Support Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Get help with your account or technical issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-3">
              <Button 
                onClick={handleTextSupport}
                className="flex items-center gap-2 w-fit"
                size="lg"
              >
                <MessageSquare className="h-4 w-4" />
                Text Support
              </Button>
              <p className="text-sm text-muted-foreground">
                Send us a text message at (828) 318-2617 for quick support
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 AM - 6:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span>10:00 AM - 4:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;

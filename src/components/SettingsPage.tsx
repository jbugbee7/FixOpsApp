
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CompanyBranding from "./CompanyBranding";
import SubscriptionInfo from "./SubscriptionInfo";
import { Building, CreditCard, User, Bell } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span>Company</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Subscription</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="company" className="space-y-6">
          <CompanyBranding />
        </TabsContent>
        
        <TabsContent value="subscription" className="space-y-6">
          <SubscriptionInfo />
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Profile settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Notification settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { User, CreditCard } from "lucide-react";
import AccountTab from "./AccountTab";
import ProfileTab from "./ProfileTab";
import SubscriptionTab from "./SubscriptionTab";

const SettingsPage = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Main Settings Section */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <Tabs defaultValue="account" className="w-full">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 px-6 py-4 rounded-t-lg">
              <TabsList className="grid w-full grid-cols-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-600 h-12">
                <TabsTrigger value="account" className="flex items-center space-x-2 py-2 px-4 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all">
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
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="account">
                <AccountTab />
              </TabsContent>
              
              <TabsContent value="profile">
                <ProfileTab />
              </TabsContent>
              
              <TabsContent value="subscription">
                <SubscriptionTab />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;

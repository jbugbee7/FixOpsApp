
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from './ProfileTab';
import AccountTab from './AccountTab';
import AppearanceTab from './AppearanceTab';

const SettingsPage = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <ProfileTab />
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6">
          <AccountTab />
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6">
          <AppearanceTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

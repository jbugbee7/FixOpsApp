
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from './ProfileTab';
import AccountTab from './AccountTab';
import CompanyTab from './CompanyTab';
import AppearanceTab from './AppearanceTab';
import SupportTab from './SupportTab';

const SettingsPage = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <ProfileTab />
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6">
          <AccountTab />
        </TabsContent>
        
        <TabsContent value="company" className="space-y-6">
          <CompanyTab />
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6">
          <AppearanceTab />
        </TabsContent>
        
        <TabsContent value="support" className="space-y-6">
          <SupportTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

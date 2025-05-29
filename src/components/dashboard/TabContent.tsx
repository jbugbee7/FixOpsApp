
import { TabsContent } from "@/components/ui/tabs";
import { Settings } from 'lucide-react';
import AiAssistantPage from '@/components/AiAssistantPage';
import TrainingPage from '@/components/TrainingPage';
import SettingsPage from '@/components/SettingsPage';
import FixChatPage from '@/components/FixChatPage';
import CaseForm from '@/components/CaseForm';
import DashboardMain from './DashboardMain';
import type { Case } from '@/types/case';

interface TabContentProps {
  isOnline: boolean;
  hasOfflineData: boolean;
  cases: Case[];
  loading: boolean;
  isResyncing: boolean;
  displayName: string;
  onNavigate: (tab: string) => void;
  onModelFound: (model: any) => void;
  onPartFound: (part: any) => void;
  onCaseClick: (case_: Case) => void;
  onResync: () => void;
}

const TabContent = (props: TabContentProps) => {
  return (
    <>
      <TabsContent value="dashboard" className="m-0">
        <DashboardMain {...props} />
      </TabsContent>

      <TabsContent value="add-case" className="m-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CaseForm />
        </div>
      </TabsContent>

      <TabsContent value="fixchat" className="m-0">
        <FixChatPage />
      </TabsContent>

      <TabsContent value="ai-assistant" className="m-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AiAssistantPage />
        </div>
      </TabsContent>

      <TabsContent value="analytics" className="m-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TrainingPage />
        </div>
      </TabsContent>

      <TabsContent value="settings" className="m-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <Settings className="h-16 w-16 text-slate-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Settings</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">App configuration and preferences</p>
          </div>
          <SettingsPage />
        </div>
      </TabsContent>
    </>
  );
};

export default TabContent;


import { TabsContent } from "@/components/ui/tabs";
import DashboardMain from '@/components/dashboard/DashboardMain';
import FixChatPage from '@/components/FixChatPage';
import AiAssistantPage from '@/components/AiAssistantPage';
import AnalyticsPage from '@/components/AnalyticsPage';
import SettingsPage from '@/components/SettingsPage';
import { Case } from '@/types/case';

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
  onCaseClick: (caseItem: Case) => void;
  onResync: () => void;
}

const TabContent = ({
  isOnline,
  hasOfflineData,
  cases,
  loading,
  isResyncing,
  displayName,
  onNavigate,
  onModelFound,
  onPartFound,
  onCaseClick,
  onResync
}: TabContentProps) => {
  return (
    <>
      <TabsContent value="dashboard" className="mt-0">
        <DashboardMain
          isOnline={isOnline}
          hasOfflineData={hasOfflineData}
          cases={cases}
          loading={loading}
          isResyncing={isResyncing}
          displayName={displayName}
          onNavigate={onNavigate}
          onModelFound={onModelFound}
          onPartFound={onPartFound}
          onCaseClick={onCaseClick}
          onResync={onResync}
        />
      </TabsContent>

      <TabsContent value="fixchat" className="mt-0">
        <FixChatPage />
      </TabsContent>

      <TabsContent value="ai-assistant" className="mt-0">
        <AiAssistantPage />
      </TabsContent>

      <TabsContent value="analytics" className="mt-0">
        <AnalyticsPage />
      </TabsContent>

      <TabsContent value="settings" className="mt-0">
        <SettingsPage />
      </TabsContent>
    </>
  );
};

export default TabContent;


import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import AiSummaryPage from './AiSummaryPage';
import TrainingHeader from './training/TrainingHeader';
import InsightsTab from './training/InsightsTab';
import GuidesTab from './training/GuidesTab';

const TrainingPage = () => {
  const { user } = useAuth();
  const [selectedApplianceForAI, setSelectedApplianceForAI] = useState<string | null>(null);

  const handleInsightCardClick = (applianceType: string) => {
    setSelectedApplianceForAI(applianceType);
  };

  if (selectedApplianceForAI) {
    return (
      <AiSummaryPage 
        applianceType={selectedApplianceForAI}
        onBack={() => setSelectedApplianceForAI(null)}
      />
    );
  }

  return (
    <div className="space-y-8">
      <TrainingHeader />

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="insights">AI Repair Insights</TabsTrigger>
          <TabsTrigger value="guides">Troubleshooting Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <InsightsTab user={user} onInsightCardClick={handleInsightCardClick} />
        </TabsContent>

        <TabsContent value="guides" className="space-y-4">
          <GuidesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingPage;

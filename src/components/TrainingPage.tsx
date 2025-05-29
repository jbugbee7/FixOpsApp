
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import AiSummaryPage from './AiSummaryPage';
import TrainingHeader from './training/TrainingHeader';
import InsightsTab from './training/InsightsTab';
import GuidesTab from './training/GuidesTab';
import AiTrainingTab from './training/AiTrainingTab';

const TrainingPage = () => {
  const { user } = useAuth();
  const [selectedApplianceForAI, setSelectedApplianceForAI] = useState<string | null>(null);

  const handleInsightCardClick = (applianceType: string) => {
    setSelectedApplianceForAI(applianceType);
  };

  const handleTrainingCardClick = (applianceType: string) => {
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

      <Tabs defaultValue="ai-training" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ai-training">AI Training Center</TabsTrigger>
          <TabsTrigger value="insights">Repair Insights</TabsTrigger>
          <TabsTrigger value="guides">Troubleshooting Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-training" className="space-y-4">
          <AiTrainingTab user={user} onTrainingCardClick={handleTrainingCardClick} />
        </TabsContent>

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


import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TrainingCardHeader from './TrainingCardHeader';
import TrainingCardStats from './TrainingCardStats';
import TrainingCardSections from './TrainingCardSections';
import TrainingCardButton from './TrainingCardButton';

interface TrainingStep {
  step: number;
  title: string;
  description: string;
  keyPoints: string[];
  safetyNote?: string;
}

interface AiTrainingData {
  appliance_type: string;
  case_count: number;
  success_rate: number;
  common_issues: string[];
  repair_sequence: TrainingStep[];
  critical_points: string[];
  common_mistakes: string[];
  tools_required: string[];
  estimated_time: string;
}

interface AiTrainingCardProps {
  trainingData: AiTrainingData;
  onCardClick: (applianceType: string) => void;
}

const AiTrainingCard = ({ trainingData, onCardClick }: AiTrainingCardProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <Card className="w-full max-w-full dark:bg-slate-800 dark:border-slate-700 cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <CardTitle>
          <TrainingCardHeader 
            applianceType={trainingData.appliance_type}
            caseCount={trainingData.case_count}
            successRate={trainingData.success_rate}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TrainingCardStats 
          estimatedTime={trainingData.estimated_time}
          repairSequenceLength={trainingData.repair_sequence.length}
          toolsRequiredLength={trainingData.tools_required.length}
          criticalPointsLength={trainingData.critical_points.length}
        />

        <TrainingCardSections 
          repairSequence={trainingData.repair_sequence}
          criticalPoints={trainingData.critical_points}
          commonMistakes={trainingData.common_mistakes}
          toolsRequired={trainingData.tools_required}
          expandedSection={expandedSection}
          onToggleSection={toggleSection}
        />

        <TrainingCardButton 
          applianceType={trainingData.appliance_type}
          onCardClick={onCardClick}
        />
      </CardContent>
    </Card>
  );
};

export default AiTrainingCard;

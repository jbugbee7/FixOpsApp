
import { Button } from "@/components/ui/button";
import { Bot } from 'lucide-react';

interface TrainingCardButtonProps {
  applianceType: string;
  onCardClick: (applianceType: string) => void;
}

const TrainingCardButton = ({ applianceType, onCardClick }: TrainingCardButtonProps) => {
  return (
    <div className="pt-4 border-t">
      <Button 
        onClick={() => onCardClick(applianceType)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Bot className="h-4 w-4 mr-2" />
        Get AI-Powered Detailed Training
      </Button>
    </div>
  );
};

export default TrainingCardButton;

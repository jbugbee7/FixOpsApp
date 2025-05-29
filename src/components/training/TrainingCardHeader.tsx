
import { Badge } from "@/components/ui/badge";
import { Bot } from 'lucide-react';
import { getSuccessRateColor } from "@/utils/colorUtils";

interface TrainingCardHeaderProps {
  applianceType: string;
  caseCount: number;
  successRate: number;
}

const TrainingCardHeader = ({ applianceType, caseCount, successRate }: TrainingCardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:text-slate-100">
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <Bot className="h-6 w-6 text-blue-500 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <span className="text-lg block truncate">{applianceType} Repair Training</span>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {caseCount} Cases
            </Badge>
            <span className={`text-sm font-semibold ${getSuccessRateColor(successRate)}`}>
              {successRate}% Success
            </span>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
              AI Generated
            </Badge>
          </div>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
          Interactive Training →
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Based on real repair data
        </p>
      </div>
    </div>
  );
};

export default TrainingCardHeader;

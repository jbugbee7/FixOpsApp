
import { Clock, CheckCircle, Wrench, AlertTriangle } from 'lucide-react';

interface TrainingCardStatsProps {
  estimatedTime: string;
  repairSequenceLength: number;
  toolsRequiredLength: number;
  criticalPointsLength: number;
}

const TrainingCardStats = ({ 
  estimatedTime, 
  repairSequenceLength, 
  toolsRequiredLength, 
  criticalPointsLength 
}: TrainingCardStatsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <Clock className="h-4 w-4 mx-auto mb-1 text-blue-600" />
        <p className="text-sm font-medium truncate">{estimatedTime}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400">Avg Time</p>
      </div>
      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <CheckCircle className="h-4 w-4 mx-auto mb-1 text-green-600" />
        <p className="text-sm font-medium">{repairSequenceLength}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400">Steps</p>
      </div>
      <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
        <Wrench className="h-4 w-4 mx-auto mb-1 text-orange-600" />
        <p className="text-sm font-medium">{toolsRequiredLength}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400">Tools</p>
      </div>
      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <AlertTriangle className="h-4 w-4 mx-auto mb-1 text-purple-600" />
        <p className="text-sm font-medium">{criticalPointsLength}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400">Critical Points</p>
      </div>
    </div>
  );
};

export default TrainingCardStats;

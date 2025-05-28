
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, AlertTriangle, Lightbulb } from 'lucide-react';
import { getSuccessRateColor } from "@/utils/colorUtils";
import { RepairSummary } from "@/hooks/useRepairSummaries";

interface RepairSummaryCardProps {
  summary: RepairSummary;
  onCardClick: (applianceType: string) => void;
}

const RepairSummaryCard = ({ summary, onCardClick }: RepairSummaryCardProps) => {
  return (
    <Card 
      className="dark:bg-slate-800 dark:border-slate-700 cursor-pointer hover:shadow-lg transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700 border-l-4 border-l-blue-500"
      onClick={() => onCardClick(summary.appliance_type)}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between dark:text-slate-100">
          <div className="flex items-center space-x-3">
            <Bot className="h-6 w-6 text-blue-500" />
            <div>
              <span className="text-lg">{summary.appliance_type} Analysis</span>
              <div className="flex items-center space-x-4 mt-1">
                <Badge variant="outline" className="text-xs">
                  {summary.case_count} Cases
                </Badge>
                <span className={`text-sm font-semibold ${getSuccessRateColor(summary.success_rate)}`}>
                  {summary.success_rate}% Success Rate
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              Click for AI Analysis →
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Powered by your repair data
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {summary.common_issues.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                Most Common Issues
              </h4>
              <div className="space-y-2">
                {summary.common_issues.slice(0, 3).map((issue, issueIndex) => (
                  <div key={issueIndex} className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded border-l-4 border-orange-500 text-sm">
                    {issue}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {summary.recent_solutions.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2 text-green-500" />
                Successful Solutions
              </h4>
              <div className="space-y-2">
                {summary.recent_solutions.slice(0, 3).map((solution, solutionIndex) => (
                  <div key={solutionIndex} className="p-2 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-500 text-sm">
                    {solution}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RepairSummaryCard;

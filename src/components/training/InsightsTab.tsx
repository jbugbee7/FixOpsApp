
import { Button } from "@/components/ui/button";
import { Bot, RefreshCw, BarChart3 } from 'lucide-react';
import { useRepairSummaries } from "@/hooks/useRepairSummaries";
import RepairSummaryCard from "./RepairSummaryCard";
import ErrorStateCard from "./ErrorStateCard";
import EmptyStateCard from "./EmptyStateCard";

interface InsightsTabProps {
  user: any;
  onInsightCardClick: (applianceType: string) => void;
}

const InsightsTab = ({ user, onInsightCardClick }: InsightsTabProps) => {
  const {
    repairSummaries,
    loading,
    refreshing,
    hasError,
    errorMessage,
    handleRefreshAnalysis
  } = useRepairSummaries(user);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold dark:text-slate-100 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Data Insights
        </h3>
        <Button onClick={handleRefreshAnalysis} disabled={loading || refreshing} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${(loading || refreshing) ? 'animate-spin' : ''}`} />
          Refresh Analysis
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <Bot className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600 dark:text-slate-400">Analyzing your repair data...</p>
        </div>
      ) : hasError ? (
        <ErrorStateCard 
          errorMessage={errorMessage}
          onRetry={handleRefreshAnalysis}
          refreshing={refreshing}
        />
      ) : repairSummaries.length === 0 ? (
        <EmptyStateCard />
      ) : (
        <div className="grid gap-4">
          {repairSummaries.map((summary, index) => (
            <RepairSummaryCard
              key={index}
              summary={summary}
              onCardClick={onInsightCardClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightsTab;
